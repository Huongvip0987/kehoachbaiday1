// Nếu chạy với ELECTRON_RUN_AS_NODE=1, restart mà không có flag đó
if (process.env.ELECTRON_RUN_AS_NODE === '1') {
  const { execFileSync } = require('child_process');
  const args = process.argv.slice(1);
  const env = { ...process.env, ELECTRON_RUN_AS_NODE: '' };
  execFileSync(process.execPath, args, { env, stdio: 'inherit' });
  process.exit(0);
}

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
let mainWin = null;

function resolveSafeHtmlPath(filePath) {
  const raw = String(filePath || '');
  const normalized = path.normalize(raw);
  const startsOutside = normalized === '..' || normalized.startsWith(`..${path.sep}`);

  if (!raw || path.isAbsolute(raw) || startsOutside || path.extname(normalized).toLowerCase() !== '.html') {
    throw new Error('Invalid lesson path');
  }

  return normalized;
}

function getStepRunnerPath() {
  const candidates = [];

  if (app.isPackaged && process.resourcesPath) {
    candidates.push(path.join(process.resourcesPath, 'app.asar.unpacked', 'step_runner.py'));
  }

  candidates.push(path.join(__dirname, 'step_runner.py'));

  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}

function createWindow() {
  mainWin = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'Bài 17 · Biến và Lệnh Gán · Tin học 10',
    backgroundColor: '#080d1a',
    show: false
  });

  mainWin.once('ready-to-show', () => {
    mainWin.maximize();
    mainWin.show();
  });

  mainWin.loadFile('index.html');
}

// ── IPC: Lesson navigation ──
ipcMain.handle('open-lesson', async (_event, lessonPath) => {
  if (typeof lessonPath === 'string' && lessonPath.startsWith('lesson:')) {
    await mainWin.loadFile('index.html', { query: { lesson: lessonPath.slice(7) } });
  } else {
    await mainWin.loadFile(resolveSafeHtmlPath(lessonPath));
  }
  return true;
});

ipcMain.handle('open-library', async () => {
  await mainWin.loadFile('library.html');
  return true;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

// ── IPC: Open Windows Sound Settings ──
ipcMain.handle('open-sound-settings', async () => {
  // Mở trang cài đặt âm thanh Windows
  await shell.openExternal('ms-settings:sound');
  return true;
});

// ── IPC: Open Caro Team game ──
ipcMain.handle('open-caro', async () => {
  const caroWin = new BrowserWindow({
    width: 1280, height: 720,
    minWidth: 960, minHeight: 600,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
    title: 'Caro Team – Bài 17',
    backgroundColor: '#10163a',
    show: false
  });
  caroWin.once('ready-to-show', () => { caroWin.maximize(); caroWin.show(); });
  caroWin.loadFile('caro_b17.html');
  return true;
});

// ── IPC: Open quiz game in separate window ──
ipcMain.handle('open-quiz', async () => {
  const quizWin = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'Ai Là Triệu Phú – Bài 17',
    backgroundColor: '#10163a',
    show: false,
    parent: mainWin
  });
  quizWin.once('ready-to-show', () => { quizWin.maximize(); quizWin.show(); });
  quizWin.loadFile('quiz_b17.html');
  return true;
});

// ── IPC: PPT – mở bằng app gốc và đặt vào vị trí slide ──
ipcMain.handle('ppt-open-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWin, {
    title: 'Chọn file PowerPoint',
    filters: [{ name: 'PowerPoint', extensions: ['pptx', 'ppt'] }],
    properties: ['openFile']
  });
  return canceled ? null : filePaths[0];
});

ipcMain.handle('ppt-open-native', async (_event, filePath) => {
  // Tính toán vùng slide (content area trừ toolbar 44px)
  const cb = mainWin.getContentBounds();
  const TOOLBAR_H = 44;
  const sx = cb.x;
  const sy = cb.y + TOOLBAR_H;
  const sw = cb.width;
  const sh = cb.height - TOOLBAR_H;

  // Mở file bằng ứng dụng mặc định (PowerPoint / LibreOffice)
  shell.openPath(filePath);

  // PowerShell: chờ cửa sổ PPT xuất hiện rồi đặt đúng vị trí slide
  const ps = `
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class PPTPos {
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr i, int x, int y, int cx, int cy, uint f);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
}
'@
$x=${sx}; $y=${sy}; $w=${sw}; $h=${sh}
$hwnd=[IntPtr]::Zero; $i=0
do {
    Start-Sleep -Milliseconds 700
    $p = Get-Process -EA SilentlyContinue |
         Where-Object { $_.ProcessName -in 'POWERPNT','soffice','SOFFICE' -and $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle -ne '' } |
         Select-Object -First 1
    if ($p) { $hwnd=$p.MainWindowHandle }
    $i++
} while ($hwnd -eq [IntPtr]::Zero -and $i -lt 20)
if ($hwnd -ne [IntPtr]::Zero) {
    [PPTPos]::ShowWindow($hwnd, 9)
    [PPTPos]::SetWindowPos($hwnd, [IntPtr]::Zero, $x, $y, $w, $h, 0x0044)
}`;

  const ps1 = spawn('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], {
    windowsHide: true,
    detached: true
  });
  ps1.unref();

  return true;
});

// ── IPC: Execute Python code step by step ──
ipcMain.handle('run-python-steps', async (_event, code) => {
  const scriptPath = getStepRunnerPath();

  // Try 'python' first, then 'python3'
  const tryPython = (cmd) =>
    new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      let py;
      try {
        py = spawn(cmd, [scriptPath], {
          stdio: ['pipe', 'pipe', 'pipe'],
          windowsHide: true
        });
      } catch (e) {
        return reject(new Error('not_found'));
      }

      py.on('error', (err) => {
        if (err.code === 'ENOENT') reject(new Error('not_found'));
        else reject(err);
      });

      py.stdout.on('data', (d) => { stdout += d.toString('utf8'); });
      py.stderr.on('data', (d) => { stderr += d.toString('utf8'); });

      py.stdin.write(code, 'utf8');
      py.stdin.end();

      py.on('close', (code) => {
        if (code !== 0) reject(new Error(stderr || 'Python exited with code ' + code));
        else resolve(stdout);
      });
    });

  try {
    return await tryPython('python');
  } catch (e1) {
    if (e1.message === 'not_found') {
      try {
        return await tryPython('python3');
      } catch (e2) {
        if (e2.message === 'not_found') {
          return JSON.stringify([{
            lineNum: 0, line: '', vars: {}, output: '',
            error: 'Không tìm thấy Python! Hãy cài Python 3.x từ python.org rồi khởi động lại app.',
            skip: false
          }]);
        }
        throw e2;
      }
    }
    throw e1;
  }
});
