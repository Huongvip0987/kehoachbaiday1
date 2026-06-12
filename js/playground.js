// ══════════════════════════════════
// PLAYGROUND GRADE / LESSON STATE
// ══════════════════════════════════
let _pgGrade  = '10';
let _pgLesson = (typeof LESSON_ID !== 'undefined' && LESSON_ID === 'b16') ? 'b16' : 'b17';
function _pgGetDemos() { return (PG_LESSON_CFGS[_pgLesson] || PG_LESSON_CFGS.b17).demos; }

function pg_switchGrade(grade) {
  if (_pgGrade === grade) return;
  _pgGrade = grade;
  document.querySelectorAll('.pg-grade-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.grade === grade));
  pg_buildLessonBar();
  const lessons = PG_GRADE_MAP[grade] || [];
  if (lessons.length > 0) {
    pg_switchLesson(lessons[0].id);
  } else {
    _pgLesson = null;
    const dt = document.getElementById('demo-tabs');
    if (dt) dt.innerHTML = '<div class="pg-grade-empty">📭 Chưa có bài học nào cho lớp này.<br><span style="color:#333;font-size:0.85em">Nội dung đang được cập nhật.</span></div>';
  }
}

function pg_buildLessonBar() {
  const bar = document.getElementById('pg-lesson-bar');
  if (!bar) return;
  const lessons = PG_GRADE_MAP[_pgGrade] || [];
  if (lessons.length === 0) {
    bar.innerHTML = '<span class="pg-lesson-lbl">Không có bài</span>';
    return;
  }
  bar.innerHTML = '<span class="pg-lesson-lbl">Bài:</span>' +
    lessons.map(l =>
      '<button class="pg-lesson-btn' + (l.id === _pgLesson ? ' active' : '') +
      '" data-lesson="' + l.id + '" onclick="pg_switchLesson(\'' + l.id + '\')">' +
      l.label + ' <small style="opacity:0.6;font-weight:400">' + l.subtitle + '</small>' +
      '</button>'
    ).join('');
}

function pg_switchLesson(id) {
  _pgLesson = id;
  document.querySelectorAll('#pg-lesson-bar .pg-lesson-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lesson === id));
  pg_buildDemoTabs();
  const cfg = PG_LESSON_CFGS[id];
  if (cfg) openPlayground(cfg.firstKey);
}

function pg_buildDemoTabs() {
  const dt = document.getElementById('demo-tabs');
  if (!dt) return;
  const demos = _pgGetDemos();
  dt.innerHTML = Object.entries(demos).map(([key, demo], idx) =>
    '<button class="demo-tab' + (idx === 0 ? ' active' : '') +
    '" data-key="' + key + '" onclick="switchDemo(\'' + key + '\')">' +
    demo.title + '</button>'
  ).join('');
}

// ══════════════════════════════════
// PLAYGROUND OPEN / CLOSE
// ══════════════════════════════════
let _pgInitialized = false;
function openPlayground(presetKey, asSlide) {
  if (asSlide) {
    // Lấy bounds từ .reveal trước (position:fixed, không animated – chính xác bất kể slide đang transition)
    const revealEl = document.querySelector('.reveal');
    if (presetKey) _pgLesson = presetKey.startsWith('b16_') ? 'b16' : 'b17';
    document.body.classList.add('pg-as-slide');
    // Định vị overlay khớp .reveal container
    try {
      if (revealEl) {
        const r = revealEl.getBoundingClientRect();
        const ov = document.getElementById('playground-overlay');
        ov.style.top    = r.top    + 'px';
        ov.style.left   = r.left   + 'px';
        ov.style.width  = r.width  + 'px';
        ov.style.height = r.height + 'px';
        ov.style.right  = 'auto';
        ov.style.bottom = 'auto';
      }
    } catch(e) {}
    // Luôn rebuild bars để đảm bảo state đúng (lesson/demo có thể thay đổi giữa các lần mở)
    if (!_pgInitialized) _pgInitialized = true;
    pg_buildLessonBar();
    pg_buildDemoTabs();
  } else {
    // Xóa inline style từ lần asSlide trước để CSS mặc định (left:0;right:0) có hiệu lực
    const _ov = document.getElementById('playground-overlay');
    _ov.style.top = _ov.style.left = _ov.style.width = _ov.style.height = '';
    _ov.style.right = _ov.style.bottom = '';
    document.body.classList.remove('pg-as-slide');
    // Chuyển sang tab code như cũ
    if (!document.body.classList.contains('mode-code')) {
      document.body.classList.remove('mode-slides', 'mode-code');
      document.body.classList.add('mode-code');
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('btn-code').classList.add('active');
    }
    // Build bars chỉ lần đầu (tab mode)
    if (!_pgInitialized) {
      _pgInitialized = true;
      pg_buildLessonBar();
      pg_buildDemoTabs();
    }
  }

  const overlay = document.getElementById('playground-overlay');
  overlay.classList.add('active');
  if (typeof window.pgNormalizeResize === 'function') window.pgNormalizeResize();

  const key = presetKey || currentPresetKey || (PG_LESSON_CFGS[_pgLesson] || {}).firstKey || 'demo_bien';
  currentPresetKey = key;
  renderCodeDisplay(key);
  resetPlayground();
  document.querySelectorAll('.demo-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.key === key));

  document.addEventListener('keydown', pgKeyHandler);
}

function closePlayground() {
  const ov = document.getElementById('playground-overlay');
  ov.classList.remove('active');
  // Reset inline size styles set by asSlide mode
  ov.style.top = ov.style.left = ov.style.width = ov.style.height = '';
  ov.style.right = ov.style.bottom = '';
  document.body.classList.remove('pg-as-slide');
  document.removeEventListener('keydown', pgKeyHandler);
}

// ══════════════════════════════════
// PLAYGROUND PANE RESIZE
// ══════════════════════════════════
(function () {
  const LS_LEFT = 'pg_left_w';
  const LS_OUT  = 'pg_console_h';
  const root = document.documentElement;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, Math.round(n)));
  }

  function applyLeftWidth(px, save) {
    const main = document.getElementById('pg-main');
    if (!main) return;
    const max = Math.max(300, main.clientWidth - 220);
    const w = clamp(px, 260, max);
    root.style.setProperty('--pg-left-w', w + 'px');
    if (save) {
      try { localStorage.setItem(LS_LEFT, String(w)); } catch(e) {}
    }
  }

  function applyConsoleHeight(px, save) {
    const editor = document.getElementById('pg-editor-pane');
    if (!editor) return;
    const max = Math.max(120, editor.clientHeight - 160);
    const h = clamp(px, 90, max);
    root.style.setProperty('--pg-console-h', h + 'px');
    if (save) {
      try { localStorage.setItem(LS_OUT, String(h)); } catch(e) {}
    }
  }

  function restoreSizes() {
    try {
      const left = parseInt(localStorage.getItem(LS_LEFT) || '', 10);
      if (Number.isFinite(left)) root.style.setProperty('--pg-left-w', left + 'px');
      const out = parseInt(localStorage.getItem(LS_OUT) || '', 10);
      if (Number.isFinite(out)) root.style.setProperty('--pg-console-h', out + 'px');
    } catch(e) {}
  }

  window.pgNormalizeResize = function () {
    const editor = document.getElementById('pg-editor-pane');
    const out = document.getElementById('pg-console');
    if (editor) applyLeftWidth(editor.getBoundingClientRect().width, false);
    if (out) applyConsoleHeight(out.getBoundingClientRect().height, false);
  };

  function initDrag(handle, bodyClass, onMove, onEnd) {
    if (!handle) return;
    let active = false;

    handle.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      active = true;
      document.body.classList.add(bodyClass);
      try { handle.setPointerCapture(e.pointerId); } catch(_) {}
      onMove(e);
    });

    handle.addEventListener('pointermove', function (e) {
      if (!active) return;
      e.preventDefault();
      onMove(e);
    });

    function stop(e) {
      if (!active) return;
      active = false;
      document.body.classList.remove(bodyClass);
      try { handle.releasePointerCapture(e.pointerId); } catch(_) {}
      if (onEnd) onEnd(e);
    }

    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
  }

  document.addEventListener('DOMContentLoaded', function () {
    restoreSizes();

    const vHandle = document.getElementById('pg-v-resizer');
    const hHandle = document.getElementById('pg-h-resizer');

    initDrag(vHandle, 'pg-resizing-v', function (e) {
      const main = document.getElementById('pg-main');
      if (!main) return;
      const r = main.getBoundingClientRect();
      applyLeftWidth(e.clientX - r.left, false);
    }, function () {
      const editor = document.getElementById('pg-editor-pane');
      if (editor) applyLeftWidth(editor.getBoundingClientRect().width, true);
    });

    initDrag(hHandle, 'pg-resizing-h', function (e) {
      const editor = document.getElementById('pg-editor-pane');
      if (!editor) return;
      const r = editor.getBoundingClientRect();
      applyConsoleHeight(r.bottom - e.clientY, false);
    }, function () {
      const out = document.getElementById('pg-console');
      if (out) applyConsoleHeight(out.getBoundingClientRect().height, true);
    });

    if (vHandle) vHandle.addEventListener('dblclick', function () {
      root.style.setProperty('--pg-left-w', '55%');
      try { localStorage.removeItem(LS_LEFT); } catch(e) {}
    });
    if (hHandle) hHandle.addEventListener('dblclick', function () {
      root.style.setProperty('--pg-console-h', '140px');
      try { localStorage.removeItem(LS_OUT); } catch(e) {}
    });
  });
}());

// ══════════════════════════════════
// PLAYGROUND FONT SIZE CONTROLS
// ══════════════════════════════════
(function () {
  const CFG = {
    code:   { key: 'pg_code_fs',   css: '--pg-code-fs',   def: 13.5, min: 10, max: 78 },
    output: { key: 'pg_output_fs', css: '--pg-output-fs', def: 12.5, min: 10, max: 72 }
  };
  const root = document.documentElement;

  function clamp(v, cfg) {
    return Math.max(cfg.min, Math.min(cfg.max, Math.round(v * 2) / 2));
  }

  function setFont(kind, value, save) {
    const cfg = CFG[kind];
    if (!cfg) return;
    const next = clamp(value, cfg);
    root.style.setProperty(cfg.css, next + 'px');
    if (save) {
      try { localStorage.setItem(cfg.key, String(next)); } catch(e) {}
    }
  }

  function getFont(kind) {
    const cfg = CFG[kind];
    if (!cfg) return 0;
    const raw = root.style.getPropertyValue(cfg.css);
    const current = parseFloat(raw || '');
    return Number.isFinite(current) ? current : cfg.def;
  }

  window.pgAdjustFont = function (kind, delta) {
    setFont(kind, getFont(kind) + delta, true);
  };

  window.pgResetFont = function (kind) {
    const cfg = CFG[kind];
    if (!cfg) return;
    root.style.setProperty(cfg.css, cfg.def + 'px');
    try { localStorage.removeItem(cfg.key); } catch(e) {}
  };

  document.addEventListener('DOMContentLoaded', function () {
    Object.keys(CFG).forEach(function (kind) {
      const cfg = CFG[kind];
      try {
        const saved = parseFloat(localStorage.getItem(cfg.key) || '');
        if (Number.isFinite(saved)) setFont(kind, saved, false);
      } catch(e) {}
    });
  });
}());

// ══════════════════════════════════
// THU GỌN / MỞ RỘNG header playground (chọn lớp, bài, tab demo, tiêu đề)
// ══════════════════════════════════
function pg_toggleCompact() {
  const ov = document.getElementById('playground-overlay');
  if (!ov) return;
  const on = ov.classList.toggle('pg-compact');
  const btn = document.getElementById('pg-compact-btn');
  if (btn) btn.textContent = on ? '🔽 Hiện chọn bài' : '🔼 Thu gọn';
  try { localStorage.setItem('pg_compact', on ? '1' : '0'); } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function () {
  try {
    if (localStorage.getItem('pg_compact') === '1') {
      const ov = document.getElementById('playground-overlay');
      if (ov) ov.classList.add('pg-compact');
      const btn = document.getElementById('pg-compact-btn');
      if (btn) btn.textContent = '🔽 Hiện chọn bài';
    }
  } catch (e) {}
});

function pgKeyHandler(e) {
  if (e.key === 'Escape') {
    if (document.body.classList.contains('mode-code')) { setMode('slides'); return; }
    closePlayground();
  }
  if (e.key === 'F7') { e.preventDefault(); doPrevStep(); }
  if (e.key === 'F8') { e.preventDefault(); doStep(); }
}

// ── Auto-play ──
function startAutoPlay() {
  if (autoPlayTimer) return;
  const btn = document.getElementById('btn-autoplay');
  btn.textContent = '⏸ Dừng';
  btn.onclick = stopAutoPlay;
  autoPlayTimer = setInterval(() => {
    doStep();
  }, 1800);
}

function stopAutoPlay() {
  if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
  const btn = document.getElementById('btn-autoplay');
  if (btn) { btn.textContent = '▶ Tự chạy'; btn.onclick = startAutoPlay; }
}

// ── Demo switcher ──
function switchDemo(key) {
  stopAutoPlay();
  document.querySelectorAll('.demo-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.key === key));
  currentPresetKey = key;
  const demo = _pgGetDemos()[key];
  const lessonCfg = PG_LESSON_CFGS[_pgLesson] || {};
  document.getElementById('pg-title-text').textContent =
    (demo ? demo.title : key) + ' · ' + (lessonCfg.label || 'Bài 17') + ' · Python';
  renderCodeDisplay(key);
  resetPlayground();
  // Cập nhật lời thoại trong speech panel nếu đang mở
  const sp = document.getElementById('speech-panel');
  if (sp && sp.classList.contains('sp-open') && typeof window.spLoadContextScript === 'function') {
    window.spLoadContextScript('code');
  }
}

// ══════════════════════════════════
// RESET
// ══════════════════════════════════
function resetPlayground() {
  stopAutoPlay();
  demoSteps = (_pgGetDemos()[currentPresetKey] || {}).steps || [];
  currentStep = -1;
  previousVars = {};
  document.querySelectorAll('#code-display .code-line').forEach(el => el.classList.remove('active'));
  document.getElementById('var-cards-container').innerHTML = '';
  document.getElementById('console-lines').innerHTML = '';
  document.getElementById('mem-empty-hint').style.display = '';
  document.getElementById('step-line-info').textContent = 'Sẵn sàng';
  document.getElementById('step-progress-bar').style.width = '0%';
  const explBox = document.getElementById('step-explain-box');
  if (explBox) {
    explBox.classList.remove('has-content');
    document.getElementById('step-explain-text').innerHTML =
      'Nhấn <b>▶ Tự chạy</b> hoặc <b>⏭ Bước tiếp</b> (F8) để xem code chạy từng dòng. <b>⏮ Lùi</b> (F7) để quay lại bước trước.';
  }
  _updateStepBtns();
}

// ══════════════════════════════════
// STEP EXECUTION (pure JS, no Python)
// ══════════════════════════════════
function doStep() {
  if (demoSteps.length === 0) {
    demoSteps = (_pgGetDemos()[currentPresetKey] || {}).steps || [];
    if (demoSteps.length === 0) return;
  }

  currentStep++;

  if (currentStep >= demoSteps.length) {
    addConsoleMsg('✔ Đã chạy hết — bấm 🔄 Xem lại để bắt đầu lại.', 'info');
    document.getElementById('step-line-info').textContent = 'Hoàn thành ✔';
    document.getElementById('step-progress-bar').style.width = '100%';
    stopAutoPlay();
    return;
  }

  const s = demoSteps[currentStep];

  // Highlight current line
  highlightCodeLine(s.line);

  // Console output
  if (s.out) {
    s.out.split('\n').filter(l => l).forEach(l => addConsoleMsg('→ ' + l, 'step-out'));
  }

  // Variable cards
  updateVarCards(s.vars, false);
  document.getElementById('mem-empty-hint').style.display = 'none';

  // Explanation box
  const explBox = document.getElementById('step-explain-box');
  const explText = document.getElementById('step-explain-text');
  if (explBox && explText) {
    explText.innerHTML = s.expl || '';
    explBox.classList.toggle('has-content', !!s.expl);
    explBox.style.animation = 'none';
    explBox.offsetHeight;
    explBox.style.animation = '';
  }

  // Progress bar
  const pct = (currentStep + 1) / demoSteps.length * 100;
  document.getElementById('step-progress-bar').style.width = pct + '%';
  document.getElementById('step-line-info').textContent =
    'Bước ' + (currentStep + 1) + ' / ' + demoSteps.length;

  _updateStepBtns();
}

// ── Cập nhật trạng thái nút Lùi / Tiếp ──
function _updateStepBtns() {
  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-step');
  if (prev) prev.disabled = (currentStep < 0);
  if (next) next.disabled = (demoSteps.length > 0 && currentStep >= demoSteps.length - 1);
}

// ── Lùi về bước trước ──
function doPrevStep() {
  stopAutoPlay();
  if (demoSteps.length === 0) {
    demoSteps = (_pgGetDemos()[currentPresetKey] || {}).steps || [];
    if (demoSteps.length === 0) return;
  }
  if (currentStep <= 0) {
    // Đang ở bước đầu → reset về trạng thái ban đầu
    resetPlayground();
    return;
  }
  currentStep--;

  const s = demoSteps[currentStep];

  // 1. Highlight dòng code
  highlightCodeLine(s.line);

  // 2. Rebuild console: phát lại tất cả output từ bước 0 đến currentStep
  const linesEl = document.getElementById('console-lines');
  linesEl.innerHTML = '';
  for (let i = 0; i <= currentStep; i++) {
    const step = demoSteps[i];
    if (step.out) {
      step.out.split('\n').filter(function(l) { return l; }).forEach(function(l) {
        const div = document.createElement('div');
        div.className = 'console-line step-out';
        div.textContent = '→ ' + l;
        linesEl.appendChild(div);
      });
    }
  }
  linesEl.scrollTop = linesEl.scrollHeight;

  // 3. Rebuild var cards: vars tại bước này (full reset + animate-in)
  previousVars = {};
  updateVarCards(s.vars, true);
  const hint = document.getElementById('mem-empty-hint');
  if (hint) hint.style.display = Object.keys(s.vars || {}).length === 0 ? '' : 'none';

  // 4. Explanation box
  const explBox  = document.getElementById('step-explain-box');
  const explText = document.getElementById('step-explain-text');
  if (explBox && explText) {
    explText.innerHTML = s.expl || '';
    explBox.classList.toggle('has-content', !!(s.expl));
    explBox.style.animation = 'none';
    void explBox.offsetHeight;
    explBox.style.animation = '';
  }

  // 5. Progress bar
  const pct = (currentStep + 1) / demoSteps.length * 100;
  document.getElementById('step-progress-bar').style.width = pct + '%';
  document.getElementById('step-line-info').textContent =
    'Bước ' + (currentStep + 1) + ' / ' + demoSteps.length;

  _updateStepBtns();
}

// ══════════════════════════════════
// VAR CARDS
// ══════════════════════════════════
function updateVarCards(vars, fullReset) {
  const container = document.getElementById('var-cards-container');
  if (fullReset) container.innerHTML = '';

  if (!fullReset) {
    container.querySelectorAll('.var-card').forEach(card => {
      if (!(card.getAttribute('data-var') in vars)) card.remove();
    });
  }

  for (const [name, info] of Object.entries(vars)) {
    const existing = container.querySelector('[data-var="' + name + '"]');
    const valClass = info.type === 'str' ? 'val-str' : (info.type === 'float' ? 'val-float' : 'val-int');
    const displayVal = info.value.length > 20 ? info.value.substring(0, 18) + '…' : info.value;

    if (existing) {
      const valEl = existing.querySelector('.vc-val');
      const typeEl = existing.querySelector('.vc-type');
      if (valEl.textContent !== displayVal) {
        valEl.textContent = displayVal;
        valEl.className = 'vc-val ' + valClass;
        typeEl.textContent = info.type;
        existing.classList.remove('updated', 'new-var');
        void existing.offsetWidth;
        existing.classList.add('updated');
        setTimeout(() => existing.classList.remove('updated'), 600);
      }
    } else {
      const card = document.createElement('div');
      card.className = 'var-card new-var';
      card.setAttribute('data-var', name);
      card.innerHTML =
        '<div class="vc-name">' + escHtml(name) + '</div>' +
        '<div class="vc-val ' + valClass + '">' + escHtml(displayVal) + '</div>' +
        '<div class="vc-type">' + escHtml(info.type) + '</div>';
      container.appendChild(card);
    }
  }
}

// ══════════════════════════════════
// HELPERS
// ══════════════════════════════════
function addConsoleMsg(text, cls) {
  const el = document.createElement('div');
  el.className = 'console-line ' + (cls || 'out');
  el.textContent = text;
  const lines = document.getElementById('console-lines');
  lines.appendChild(el);
  lines.scrollTop = lines.scrollHeight;
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function openQuizWindow() {
  if (window.quizBridge) {
    window.quizBridge.openQuiz();
  } else {
    window.open('quiz_b17.html', '_blank');
  }
}

// Zoom dùng trạng thái chung → đặt lại khi mở/đóng modal để mức phóng
// của slide không dính sang hộp modal và ngược lại.
function _zmRefresh() { try { if (typeof ZM !== 'undefined') ZM.refresh(); } catch (e) {} }

function openGameList() {
  _zmRefresh();
  document.getElementById('game-list-modal').classList.add('active');
}

function closeGameList() {
  document.getElementById('game-list-modal').classList.remove('active');
  _zmRefresh();
}

function launchGame(type) {
  closeGameList();
  if (type === 'quiz') openQuizWindow();
  if (type === 'caro' && window.caroBridge) window.caroBridge.openCaro();
}

function openQuizRules()  { _zmRefresh(); document.getElementById('quiz-rules-modal').classList.add('active'); }
function closeQuizRules() { document.getElementById('quiz-rules-modal').classList.remove('active'); _zmRefresh(); }

