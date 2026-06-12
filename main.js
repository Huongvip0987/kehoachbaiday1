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
const PptxGenJS = require('pptxgenjs');

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

// ── IPC: Export to PPTX ──
ipcMain.handle('pptx-save-dialog', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWin, {
    title: 'Xuất file PowerPoint',
    defaultPath: 'Bai17-Bien-Lenh-Gan.pptx',
    filters: [{ name: 'PowerPoint Presentation', extensions: ['pptx'] }]
  });
  return canceled ? null : filePath;
});

ipcMain.handle('pptx-capture-slide', async () => {
  const img = await mainWin.webContents.capturePage();
  const buf = img.toJPEG(88);
  return 'data:image/jpeg;base64,' + buf.toString('base64');
});

ipcMain.handle('pptx-save-file', async (_event, { filePath, slides, lessonTitle }) => {
  try {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.title = lessonTitle || 'Bài giảng';
    pptx.subject = lessonTitle || '';
    for (const imgData of slides) {
      const slide = pptx.addSlide();
      slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
    }
    await pptx.writeFile({ fileName: filePath });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
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
