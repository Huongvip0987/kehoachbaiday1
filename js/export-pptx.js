// ══════════════════════════════════
// EXPORT TO PPTX
// ══════════════════════════════════
function _setExportProgress(msg, pct) {
  document.getElementById('export-status').textContent = msg;
  document.getElementById('export-bar').style.width = Math.round(pct * 100) + '%';
}

async function exportToPptx() {
  if (!window.pptxBridge) {
    alert('Tính năng xuất PPTX chỉ khả dụng trong Electron app.');
    return;
  }

  // 1. Hộp thoại chọn nơi lưu
  const filePath = await window.pptxBridge.showSaveDialog();
  if (!filePath) return;

  // 2. Hiện overlay tiến trình
  const overlay = document.getElementById('export-overlay');
  overlay.classList.add('active');
  _setExportProgress('Chuẩn bị chụp slide...', 0);

  // 3. Lưu trạng thái hiện tại
  const origIndices = Reveal.getIndices();
  const origTransition = Reveal.getConfig().transition;

  // 4. Ẩn UI chrome (mode bar, nav) để chụp màn hình sạch
  const modeBar  = document.getElementById('mode-bar');
  const navToggle = document.getElementById('slide-nav-toggle');
  const navPanel  = document.getElementById('slide-nav');
  const revealEl  = document.querySelector('.reveal');
  modeBar.style.visibility   = 'hidden';
  navToggle.style.visibility = 'hidden';
  navPanel.style.visibility  = 'hidden';
  revealEl.style.top    = '0';
  revealEl.style.height = '100vh';

  // Tắt animation để chụp nhanh
  Reveal.configure({ transition: 'none' });

  const screenshots = [];
  try {
    for (let i = 0; i < SLIDE_MAP.length; i++) {
      const s = SLIDE_MAP[i];
      _setExportProgress(
        'Chụp slide ' + (i + 1) + ' / ' + SLIDE_MAP.length + ' — ' + s.label.trim(),
        i / SLIDE_MAP.length
      );
      Reveal.slide(s.h, s.v);
      // Đợi slide render xong
      await new Promise(r => setTimeout(r, 280));
      const img = await window.pptxBridge.captureSlide();
      screenshots.push(img);
    }
  } catch (captureErr) {
    _restoreAfterExport(modeBar, navToggle, navPanel, revealEl, origTransition, origIndices);
    overlay.classList.remove('active');
    alert('Lỗi khi chụp slide: ' + captureErr.message);
    return;
  }

  // 5. Khôi phục UI
  _restoreAfterExport(modeBar, navToggle, navPanel, revealEl, origTransition, origIndices);

  // 6. Tạo và lưu PPTX
  _setExportProgress('Đang tạo file PPTX (' + screenshots.length + ' slide)...', 0.97);
  const result = await window.pptxBridge.saveFile({
    filePath,
    slides: screenshots,
    lessonTitle: 'Bài 17 – Biến và Lệnh Gán – Tin học 10'
  });

  if (result.ok) {
    _setExportProgress('✅ Xuất thành công! ' + SLIDE_MAP.length + ' slide', 1);
    setTimeout(() => overlay.classList.remove('active'), 2800);
  } else {
    overlay.classList.remove('active');
    alert('Lỗi tạo PPTX: ' + result.error);
  }
}

function _restoreAfterExport(modeBar, navToggle, navPanel, revealEl, origTransition, origIndices) {
  modeBar.style.visibility   = '';
  navToggle.style.visibility = '';
  navPanel.style.visibility  = '';
  revealEl.style.top    = '';
  revealEl.style.height = '';
  Reveal.configure({ transition: origTransition });
  Reveal.slide(origIndices.h, origIndices.v);
}
