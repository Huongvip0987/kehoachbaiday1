// ══════════════════════════════════
// SET MODE (slides / code / game / edit / chon / cq / kichban)
// ══════════════════════════════════
function setMode(mode) {
  // Chặn chỉnh sửa slide khi đang ở chế độ Giảng Dạy
  if (mode === 'edit' && document.body.classList.contains('app-teaching')) return;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  if (document.body.classList.contains('mode-edit')) disableEditMode();
  document.body.classList.remove('mode-slides', 'mode-code', 'mode-edit');
  document.getElementById('chon-overlay').classList.remove('active');
  document.getElementById('cq-overlay').classList.remove('active');
  document.getElementById('kichban-overlay').classList.remove('active');

  _currentAppMode = mode;
  _spUpdateContextUI(mode);

  // Đóng speech panel khi chuyển sang các tab overlay
  if (['code', 'cq', 'chon', 'kichban'].includes(mode)) {
    const _sp = document.getElementById('speech-panel');
    const _spBtn = document.getElementById('speech-toggle-btn');
    if (_sp && _sp.classList.contains('sp-open')) {
      _sp.classList.remove('sp-open');
      if (_spBtn) { _spBtn.textContent = '💬'; _spBtn.title = 'Mở hộp thoại giảng dạy'; }
    }
  }

  if (mode === 'slides') {
    document.body.classList.add('mode-slides');
    document.getElementById('btn-slides').classList.add('active');
    closePlayground();
  } else if (mode === 'code') {
    document.body.classList.add('mode-code');
    document.getElementById('btn-code').classList.add('active');
    openPlayground(currentPresetKey || 'demo_bien');
  } else if (mode === 'game') {
    _currentAppMode = 'slides';
    _spUpdateContextUI('slides');
    openGameList();
  } else if (mode === 'edit') {
    document.body.classList.add('mode-slides', 'mode-edit');
    document.getElementById('btn-edit').classList.add('active');
    closePlayground();
    enableEditMode();
  } else if (mode === 'chon') {
    document.body.classList.add('mode-slides');
    document.getElementById('btn-chon').classList.add('active');
    closePlayground();
    document.getElementById('chon-overlay').classList.add('active');
  } else if (mode === 'cq') {
    document.body.classList.add('mode-slides');
    document.getElementById('btn-cq').classList.add('active');
    closePlayground();
    document.getElementById('cq-present')?.classList.remove('active');
    document.getElementById('cq-overlay').classList.add('active');
    cq_renderAll();
    if (_cqViewMode === 'present') cq_slideRender();
  } else if (mode === 'kichban') {
    document.body.classList.add('mode-slides');
    document.getElementById('btn-kichban').classList.add('active');
    closePlayground();
    document.getElementById('kichban-overlay').classList.add('active');
    try { if (typeof _kbHealExtraRefs === 'function') _kbHealExtraRefs(); } catch(e) {}
    // Sáng đúng "slide đang chiếu" trong Mục lục ngay khi mở Kịch bản
    try { if (typeof window._kbRefreshSlideHighlight === 'function') window._kbRefreshSlideHighlight(); } catch(e) {}
  }

  if (window.ZM) ZM.refresh();
}

// ── Speech panel context labels ──
const _SP_MODE_LABELS = {
  slides: '💬 Hộp Thoại · Slides',
  cq:     '💬 Hộp Thoại · Câu Hỏi',
  code:   '💬 Hộp Thoại · Giải Thích',
  chon:   '💬 Hộp Thoại · Chọn Người',
  game:   '💬 Hộp Thoại · Trò Chơi',
  edit:   '💬 Hộp Thoại · Slides',
};
const _SP_CTX_LABELS = {
  slides: '📖 Slide này',
  cq:     '📖 Câu hỏi',
  code:   '📖 Playground',
  chon:   '📖 Chọn người',
  game:   '📖 Trò chơi',
  edit:   '📖 Slide này',
};

function _spUpdateContextUI(mode) {
  const title  = document.getElementById('sp-header-title');
  const ctxBtn = document.getElementById('sp-ctx-btn');
  if (title)  title.textContent  = _SP_MODE_LABELS[mode]  || '💬 Hộp Thoại Giảng Dạy';
  if (ctxBtn) ctxBtn.textContent = _SP_CTX_LABELS[mode] || '📖 Mục này';
}

// ── Slide Navigator ──
let SLIDE_MAP = [
  { label: '🏠 Giới thiệu', h: 0, v: 0 },
  { label: '⚡ Khởi Động', h: 1, v: 0 },
  { label: '  └ Khởi động – Nội dung', h: 1, v: 1 },
  { label: '  └ Định nghĩa biến toán học & lập trình', h: 1, v: 2 },
  { label: '📦 01 · Biến & Lệnh Gán', h: 2, v: 0 },
  { label: '  └ Biến là gì?', h: 2, v: 1 },
  { label: '  └ Lệnh gán đơn', h: 2, v: 2 },
  { label: '  └ Lệnh gán đồng thời', h: 2, v: 3 },
  { label: '  └ Quy tắc đặt tên', h: 2, v: 4 },
  { label: '  └ Demo Biến', h: 2, v: 5 },
  { label: '➕ 02 · Phép Toán', h: 3, v: 0 },
  { label: '  └ Phép toán số', h: 3, v: 1 },
  { label: '  └ Phép toán xâu', h: 3, v: 2 },
  { label: '  └ Demo Phép toán', h: 3, v: 3 },
  { label: '🔑 03 · Từ Khoá', h: 4, v: 0 },
  { label: '  └ Danh sách từ khóa', h: 4, v: 1 },
  { label: '🛠 04 · Thực Hành', h: 5, v: 0 },
  { label: '  └ Bài tập SGK', h: 5, v: 1 },
  { label: '🚀 05 · Vận Dụng', h: 6, v: 0 },
  { label: '  └ Đổi đơn vị thời gian', h: 6, v: 1 },
  { label: '📋 06 · Tổng Kết', h: 7, v: 0 },
  { label: '  └ Bảng tổng kết', h: 7, v: 1 },
  { label: '  └ Mở trò chơi', h: 7, v: 2 },
];

// Fallback before rebuildNavFromDOM() runs. Keep this in sync with index.html.
SLIDE_MAP = [
  { label: 'Home', h: 0, v: 0 },
  { label: 'Khoi dong', h: 1, v: 0 },
  { label: '  - Bien trong toan hoc va lap trinh', h: 1, v: 1 },
  { label: '  - Dinh nghia bien toan hoc va lap trinh', h: 1, v: 2 },
  { label: '  - Cau hoi thao luan khoi dong', h: 1, v: 3 },
  { label: '  - Bien trong cuoc song', h: 1, v: 4 },
  { label: 'Bien va Lenh Gan', h: 2, v: 0 },
  { label: '  - Bien la gi?', h: 2, v: 1 },
  { label: '  - Cau hoi kiem tra bien', h: 2, v: 2 },
  { label: '  - Lenh gan don', h: 2, v: 3 },
  { label: '  - Lenh gan dong thoi', h: 2, v: 4 },
  { label: '  - Cau hoi lenh gan va hoan doi', h: 2, v: 5 },
  { label: '  - Quy tac dat ten bien', h: 2, v: 6 },
  { label: '  - Demo bien', h: 2, v: 7 },
  { label: '  - Kieu du lieu cua bien', h: 2, v: 8 },
  { label: '  - Gan nhieu bien va toan tu ket hop', h: 2, v: 9 },
  { label: '  - Bai tap Hoat dong 1', h: 2, v: 10 },
  { label: 'Phep Toan', h: 3, v: 0 },
  { label: '  - Phep toan tren kieu so', h: 3, v: 1 },
  { label: '  - Phep toan tren xau', h: 3, v: 2 },
  { label: '  - Cau hoi phep toan', h: 3, v: 3 },
  { label: '  - Demo phep toan', h: 3, v: 4 },
  { label: '  - Cau hoi on nhanh', h: 3, v: 5 },
  { label: '  - Chia nguyen va lay du', h: 3, v: 6 },
  { label: '  - Thu tu uu tien', h: 3, v: 7 },
  { label: '  - Kiem tra nhanh', h: 3, v: 8 },
  { label: 'Tu Khoa', h: 4, v: 0 },
  { label: '  - Tu khoa Python', h: 4, v: 1 },
  { label: '  - Cau hoi tu khoa', h: 4, v: 2 },
  { label: '  - SyntaxError dung tu khoa', h: 4, v: 3 },
  { label: '  - Bai tap Hoat dong 3', h: 4, v: 4 },
  { label: 'Thuc Hanh', h: 5, v: 0 },
  { label: '  - Bai tap SGK', h: 5, v: 1 },
  { label: '  - Thuc hanh mo rong', h: 5, v: 2 },
  { label: 'Van Dung', h: 6, v: 0 },
  { label: '  - Doi giay ra ngay gio phut giay', h: 6, v: 1 },
  { label: '  - Hoan doi khong can bien tam', h: 6, v: 2 },
  { label: 'Tong Ket', h: 7, v: 0 },
  { label: '  - Nhung gi da hoc', h: 7, v: 1 },
  { label: '  - Cau hoi cung co', h: 7, v: 2 },
  { label: '  - Tro choi', h: 7, v: 3 },
];

function buildSlideNav() {
  if (typeof tf_buildList === 'function') tf_buildList();
}

function highlightNavItem(h, v) {
  const vv = v ?? 0;
  document.querySelectorAll('#tf-step-list .tf-row').forEach((el) => {
    const i  = parseInt(el.dataset.idx, 10);
    const s  = TEACHING_STEPS[i];
    const hv = (typeof _TF_SLIDE_HV !== 'undefined') ? _TF_SLIDE_HV[i] : null;
    const sh = hv ? hv[0] : (s ? s.slide : null);
    const sv = hv ? (hv[1] || 0) : 0;
    el.classList.toggle('tf-slide-cur',
      s && s.action === 'slide' && sh === h && sv === vv && i !== _tf_step);
  });
}

function rebuildNavFromDOM() {
  SLIDE_MAP = [];
  let n = 0;
  document.querySelectorAll('.reveal .slides > section').forEach((hSec, h) => {
    const vSecs = hSec.querySelectorAll(':scope > section');
    const slides = vSecs.length > 0 ? Array.from(vSecs) : [hSec];
    slides.forEach((sec, vi) => {
      const v = vSecs.length > 0 ? vi : 0; n++;
      const isIntro = sec.classList.contains('section-intro-card');
      const h2txt = sec.querySelector('h2,h1')?.textContent?.trim() || ('Slide ' + n);
      const prefix = (vSecs.length > 0 && !isIntro) ? '  └ ' : '';
      SLIDE_MAP.push({ label: prefix + h2txt, h, v });
    });
  });
}

function toggleSlideNav() {
  const nav = document.getElementById('slide-nav');
  const btn = document.getElementById('slide-nav-toggle');
  nav.classList.toggle('open');
  const isOpen = nav.classList.contains('open');
  btn.textContent = isOpen ? '✕' : '☰';
  if (isOpen) {
    if (_tf_step < 0) tf_goTo(0);
    else tf_render();
    setTimeout(tf_scrollToActive, 100);
  }
}

// ── Reveal event listeners ──
let _delSkipCount = 0; // chặn lặp vô hạn khi lỡ xóa toàn bộ slide
Reveal.on('slidechanged', ({ indexh, indexv, currentSlide, previousSlide }) => {
  // Bỏ qua slide đã XÓA khỏi mục lục (đánh dấu uncounted) khi điều hướng bằng
  // mũi tên / phím < > / controls-arrow: tự nhảy tiếp theo đúng hướng đang đi.
  if (currentSlide && currentSlide.dataset && currentSlide.dataset.kbDeletedSlide === '1' && _delSkipCount++ < 200) {
    let forward = true;
    if (previousSlide) {
      // previousSlide nằm SAU currentSlide trong DOM → ta đang lùi → đi prev tiếp
      if (currentSlide.compareDocumentPosition(previousSlide) & Node.DOCUMENT_POSITION_FOLLOWING) forward = false;
    }
    if (forward) Reveal.next(); else Reveal.prev();
    return;
  }
  _delSkipCount = 0;

  const varCards = document.getElementById('var-cards-container');
  const consoleLines = document.getElementById('console-lines');
  if (varCards) varCards.innerHTML = '';
  if (consoleLines) consoleLines.innerHTML = '';
  highlightNavItem(indexh, indexv);
  // Cho marker bước trong Lộ trình đi theo slide khi điều hướng bằng mũi tên/phím < >
  if (typeof tf_syncStepToSlide === 'function') tf_syncStepToSlide(indexh, indexv);
  // Sáng "slide đang chiếu" trong Mục lục (kịch bản) – không đổi bước đang soạn
  if (typeof window._kbSyncSlide === 'function') window._kbSyncSlide(indexh, indexv);
  const sz = slideFontSizes[`${indexh}-${indexv ?? 0}`] ?? DEFAULT_FONT_SIZE;
  document.getElementById('font-size-label').value = sz;
  // Slide mode stays pure: data-pg/data-cq-id only mark where a tool belongs.
  // Tools are opened explicitly through their own tabs or teaching-flow actions.
});

Reveal.on('ready', ({ indexh, indexv }) => {
  highlightNavItem(indexh, indexv);
  if (typeof window._kbSyncSlide === 'function') window._kbSyncSlide(indexh, indexv);
  try {
    const savedFonts = localStorage.getItem('slide_fonts_' + _LID);
    if (savedFonts) {
      slideFontSizes = JSON.parse(savedFonts);
      Object.entries(slideFontSizes).forEach(([key, size]) => {
        const [h, v] = key.split('-').map(Number);
        const slide = Reveal.getSlide(h, v);
        if (slide) slide.style.fontSize = size + 'px';
      });
    }
  } catch(e) { localStorage.removeItem('slide_fonts_' + _LID); }
  const sz = slideFontSizes[`${indexh}-${indexv ?? 0}`] ?? DEFAULT_FONT_SIZE;
  document.getElementById('font-size-label').value = sz;
  applyHighlight(document);
});

// ── DOMContentLoaded: init body mode + load saved edits ──
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('mode-slides');
  document.documentElement.style.setProperty('--r-main-font-size', '28px');
  rebuildNavFromDOM();

  try {
    const saved = localStorage.getItem('slide_edits_' + _LID);
    if (saved) {
      const data = JSON.parse(saved);
      if (data && !Array.isArray(data)) {
        const sig = window._SRC_SIG || {};
        document.querySelectorAll('.reveal .slides > section').forEach((hSec, h) => {
          const vSecs = hSec.querySelectorAll(':scope > section');
          function restoreSection(sec, key) {
            const entry = data[key];
            if (!entry) return;
            // Định dạng cũ (chuỗi html, không có vân tay) → bỏ qua để ưu tiên nguồn AI mới.
            if (typeof entry === 'string' || !entry.html) return;
            // AI đã sửa slide này kể từ lúc lưu (vân tay nguồn khác) → dùng bản nguồn mới.
            if (entry.src && sig[key] && entry.src !== sig[key]) return;
            const raws = [];
            sec.querySelectorAll('pre code').forEach(b => raws.push(b.dataset.raw || ''));
            sec.innerHTML = entry.html;
            sec.querySelectorAll('pre code').forEach((b, idx) => { if (raws[idx]) b.dataset.raw = raws[idx]; });
          }
          if (vSecs.length === 0) {
            restoreSection(hSec, h + '-0');
          } else {
            vSecs.forEach((vSec, v) => restoreSection(vSec, h + '-' + v));
          }
        });
      }
    }
  } catch(e) { localStorage.removeItem('slide_edits_' + _LID); }

  applyHighlight(document);

  // Inject decorative symbols into section intro cards
  const symbols = ['{}', '=', '→', 'if', '+=', '[]', 'def', ':'];
  document.querySelectorAll('.section-intro-card').forEach(card => {
    const d = document.createElement('div');
    d.className = 'card-deco';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = symbols.map((s, i) =>
      '<span class="card-sym cs' + i + '">' + s + '</span>'
    ).join('');
    card.appendChild(d);
  });
});
