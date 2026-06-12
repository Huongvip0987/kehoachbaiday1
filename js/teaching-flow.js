/* ════════════════════════════════════════════════════════════
   TEACHING FLOW – Lộ trình Giảng Dạy Bài 17
   Kết nối: Slide ↔ Câu hỏi ↔ Chọn người ↔ Code Playground
   Lộ trình: ôn tập → khởi động → kiến thức mới → thực hành → tổng kết
════════════════════════════════════════════════════════════ */

/* ── 1. DỮ LIỆU LỘTRÌNH ── */
/* Dữ liệu TEACHING_STEPS được nạp động từ từng bài (lessons/tinXX/bYY/js/teaching-flow.js) */
var TEACHING_STEPS = [];

/* ── Bảng tọa độ slide (h,v) theo index bước ──
   VIEW ĐỘNG (Proxy) đọc thẳng TEACHING_STEPS hiện tại, KHÔNG cache tĩnh.
   Lý do: trước đây đây là object dựng MỘT LẦN lúc load; sau khi TEACHING_STEPS
   bị splice lúc chạy (chèn bước phụ qua _loadExtra, _kbInsertStep, kéo-thả
   tf_moveStep/_kbMoveStep) thì bản đồ tĩnh lỗi thời → _TF_SLIDE_HV[i] trả hv của
   bước CŨ từng ở index i → điều hướng/preview lệch +1 (vd đứng ở bước "Câu hỏi
   kiểm tra – Biến là gì?" lại hiện slide "Lệnh gán đơn"). Proxy này luôn trả hv
   của bước ĐANG ở index đó, nên mọi nơi đọc _TF_SLIDE_HV[i] (kbDirExecute,
   kbPreviewSync, tf_execute, highlightNavItem, tf_cqIdForSlide…) đều đúng sau
   mọi thay đổi mảng — sửa một điểm, không cần rebuild thủ công. */
const _TF_SLIDE_HV = new Proxy({}, {
  get(_t, key) {
    if (typeof key === 'symbol') return undefined;
    const s = TEACHING_STEPS[Number(key)];
    return (s && s.hv) ? s.hv : undefined;
  },
  has(_t, key) {
    if (typeof key === 'symbol') return false;
    const s = TEACHING_STEPS[Number(key)];
    return !!(s && s.hv);
  },
  ownKeys() {
    const keys = [];
    TEACHING_STEPS.forEach((s, i) => { if (s && s.hv) keys.push(String(i)); });
    return keys;
  },
  getOwnPropertyDescriptor(_t, key) {
    if (typeof key === 'symbol') return undefined;
    const s = TEACHING_STEPS[Number(key)];
    if (s && s.hv) return { value: s.hv, enumerable: true, configurable: true, writable: false };
    return undefined;
  }
});

/* ── 3. STATE ── */
let _tf_step     = -1;
let _tf_open     = false;
let _tf_expanded = false;

/* ── Drag-and-drop state ── */
let _tf_drag_from = -1;
let _tf_drag_to   = -1;
let _tf_dragging  = false;

function _tf_cleanDragOver() {
  document.querySelectorAll('#tf-step-list .tf-drag-above, #tf-step-list .tf-drag-below')
    .forEach(el => el.classList.remove('tf-drag-above', 'tf-drag-below'));
  _tf_drag_to = -1;
}

/* Di chuyển bước fromIdx sang vị trí toIdx trong TEACHING_STEPS */
function tf_moveStep(fromIdx, toIdx) {
  const n = TEACHING_STEPS.length;
  if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || fromIdx >= n || toIdx >= n) return;
  const [step] = TEACHING_STEPS.splice(fromIdx, 1);
  TEACHING_STEPS.splice(toIdx, 0, step);
  // Điều chỉnh con trỏ bước hiện tại
  if (_tf_step === fromIdx)                             _tf_step = toIdx;
  else if (fromIdx < _tf_step && toIdx >= _tf_step)    _tf_step--;
  else if (fromIdx > _tf_step && toIdx <= _tf_step)    _tf_step++;
  tf_render();
  // Đồng bộ ngược sang Mục lục (kichban): vẽ lại danh sách theo thứ tự mới + sáng đúng bước
  if (typeof window._kbDirGoToByOrig === 'function') {
    try { window._kbDirGoToByOrig(_tf_step); } catch(e) {}
  }
  setTimeout(tf_scrollToActive, 60);
}

const _TF_ICONS  = { slide:'📽', cq:'❓', chon:'🎲', code:'💻', break:'⏸' };
const _TF_LABELS = { slide:'Slide', cq:'Câu hỏi', chon:'Chọn người', code:'Playground', break:'Nghỉ tiết' };
const _TF_TAG_CLS = { slide:'tf-tag-slide', cq:'tf-tag-cq', chon:'tf-tag-chon', code:'tf-tag-code', break:'tf-tag-dim' };

// Ranh giới Tiết 1 / Tiết 2 xác định theo vị trí bước "break" trong TEACHING_STEPS.
function _tfBreakIdx() { return TEACHING_STEPS.findIndex(s => s.action === 'break'); }
function _tfTier(i) { const b = _tfBreakIdx(); return (b < 0 || i <= b) ? 1 : 2; }

/* ── 3. TOGGLE PANEL – đã tích hợp vào slide-nav ── */
function tf_togglePanel() {
  toggleSlideNav();
  const isOpen = document.getElementById('slide-nav').classList.contains('open');
  const btn = document.getElementById('btn-tf');
  if (btn) btn.classList.toggle('active', isOpen);
}

/* Phím tắt Alt+L: ẩn/hiện lộ trình kịch bản */
document.addEventListener('keydown', function (e) {
  if (!e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.code !== 'KeyL' && e.key !== 'l' && e.key !== 'L') return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  e.preventDefault();
  tf_togglePanel();
});

/* ── 4. NAVIGATION ── */
function tf_goTo(idx) {
  const max = TEACHING_STEPS.length - 1;
  _tf_step = Math.max(0, Math.min(max, idx));
  window._kbTFStep = _tf_step; // expose để cau-hoi.js dùng fallback gán bước
  tf_render();
  // Sync sang kichban script panel (guard tránh vòng lặp với kbDirSelect)
  if (window._currentAppMode === 'kichban' && !window._kbDirSelectSyncing && typeof window._kbDirGoToByOrig === 'function') {
    window._kbDirGoToByOrig(_tf_step);
  }
}

/* Đồng bộ con trỏ bước (_tf_step) theo slide Reveal ĐANG hiển thị.
   Gọi từ sự kiện 'slidechanged' để khi điều hướng bằng mũi tên Reveal
   (div.controls-arrow) hoặc phím < > — vốn KHÔNG đi qua tf_goTo — thì marker
   .tf-active trong Lộ trình vẫn nhảy đúng sang bước của slide hiện tại.
   tf_goTo không gọi Reveal.slide nên không tạo vòng lặp slidechanged. */
let _tf_syncing = false;
function tf_syncStepToSlide(h, v) {
  if (window._PREVIEW_MODE || _tf_syncing) return;
  const vv = v || 0;
  let idx = -1;
  for (let i = 0; i < TEACHING_STEPS.length; i++) {
    const s = TEACHING_STEPS[i];
    if (!s || s.action !== 'slide' || window._kbDeletedSet?.has(i)) continue;
    const hv = s.hv;                       // dùng hv gắn liền object (luôn đúng sau mọi splice)
    if (hv && hv[0] === h && (hv[1] || 0) === vv) { idx = i; break; }
  }
  if (idx < 0 || idx === _tf_step) return; // không khớp hoặc đã đúng → bỏ qua
  _tf_syncing = true;
  try { tf_goTo(idx); tf_scrollToActive(); } catch (e) {}
  _tf_syncing = false;
}
window.tf_syncStepToSlide = tf_syncStepToSlide;

/* Bước có thể điều hướng trong lộ trình: slide hoặc break (divider), bỏ qua câu hỏi/chọn người/playground */
function _tf_isNavigable(i) {
  const s = TEACHING_STEPS[i];
  if (!s || window._kbDeletedSet?.has(i)) return false;
  return s.action === 'slide' || s.action === 'break';
}

function tf_next() {
  for (let i = _tf_step + 1; i < TEACHING_STEPS.length; i++) {
    if (_tf_isNavigable(i)) { tf_goTo(i); tf_execute(); return; }
  }
}

function tf_prev() {
  for (let i = _tf_step - 1; i >= 0; i--) {
    if (_tf_isNavigable(i)) { tf_goTo(i); return; }
  }
}

/* ── 5. THỰC HIỆN BƯỚC ── */
function tf_execute() {
  if (_tf_step < 0) return;
  // Kịch bản là phòng tập riêng — không thực thi bước khi đang ở kichban
  if (window._currentAppMode === 'kichban') return;
  const s = TEACHING_STEPS[_tf_step];

  // Break = nghỉ giữa tiết → chỉ render, không chuyển tab
  if (s.action === 'break') {
    tf_render();
    return;
  }

  if (s.slide !== null && s.slide !== undefined) {
    const hv = _TF_SLIDE_HV[_tf_step];
    try {
      if (hv) Reveal.slide(hv[0], hv[1]);
      else    Reveal.slide(s.slide, 0);
    } catch(e) {}
  }

  // Đóng overlay fullscreen từ bước trước, rồi mở đúng tab theo loại hoạt động.
  try { document.getElementById('cq-present')?.classList.remove('active'); } catch(e) {}
  try { document.getElementById('chon-overlay')?.classList.remove('active'); } catch(e) {}

  switch (s.action) {
    case 'slide':
      setMode('slides');
      break;

    case 'cq':
      setMode('cq');
      if (s.cqTab !== null && s.cqTab !== undefined)
        setTimeout(() => { try { cq_switchTab(s.cqTab); } catch(e) {} }, 80);
      if (s.cqId) {
        setTimeout(() => { try { cq_focusQuestion(s.cqId); } catch(e) {} }, 120);
      }
      break;

    case 'chon':
      setMode('chon');
      setTimeout(() => { try { chon_switchTab(2); } catch(e) {} }, 80);
      break;

    case 'code':
      if (s.preset) {
        try { currentPresetKey = s.preset; } catch(e) {}
      }
      setMode('code');
      break;
  }

  /* Cập nhật lời thoại trong speech panel */
  _tf_loadScript();
}

/* Phân giải câu hỏi cần chiếu cho một slide (h,v):
   ưu tiên s.cqId của bước CQ tương ứng (đã đồng bộ khi dán/đổi câu),
   trả null nếu không có bước CQ nào khớp → caller tự fallback về data-cq-id gốc. */
function tf_cqIdForSlide(indexh, indexv) {
  const v = indexv || 0;
  for (const key in _TF_SLIDE_HV) {
    const hv = _TF_SLIDE_HV[key];
    if (hv[0] === indexh && (hv[1] || 0) === v) {
      const s = TEACHING_STEPS[key];
      if (s && s.action === 'cq' && s.cqId) return s.cqId;
    }
  }
  return null;
}
window.tf_cqIdForSlide = tf_cqIdForSlide;

/* ── 5c. MỞ CÁC PANEL THEO BƯỚC HIỆN TẠI ── */
function tf_cqOpen() {
  setMode('cq');
  const s = (_tf_step >= 0 && _tf_step < TEACHING_STEPS.length)
    ? TEACHING_STEPS[_tf_step] : null;
  if (s && s.cqTab !== null && s.cqTab !== undefined) {
    setTimeout(() => { try { cq_switchTab(s.cqTab); } catch(e) {} }, 80);
  }
  if (s && s.cqId) {
    setTimeout(() => { try { cq_focusQuestion(s.cqId); } catch(e) {} }, 100);
  }
}

function tf_codeOpen() {
  const s = (_tf_step >= 0 && _tf_step < TEACHING_STEPS.length)
    ? TEACHING_STEPS[_tf_step] : null;
  const preset = (s && s.preset) ? s.preset : (window.currentPresetKey || 'demo_bien');
  try { currentPresetKey = preset; } catch(e) {}
  setMode('code');
}

/* ── 5b. NẠP LỜI THOẠI VÀO SPEECH PANEL ──
   Thứ tự ưu tiên:
   1. STEP_TTS (lời thoại sạch từ kichban.js)
   2. SLIDE_SCRIPTS (lời thoại theo h-v slide)
   3. s.script (hướng dẫn GV dự phòng)
── */
function _tf_loadScript() {
  const ta = document.getElementById('sp-textarea');
  if (!ta) return;

  const s = TEACHING_STEPS[_tf_step];
  if (!s) return;

  /* 1. TTS scripts từ kichban.js */
  const tts = window._kbStepTTS && window._kbStepTTS[_tf_step];
  if (tts) { ta.value = tts; _tf_notifyScriptLoaded(); return; }

  /* 2. SLIDE_SCRIPTS theo tọa độ (h,v) */
  if (typeof SLIDE_SCRIPTS !== 'undefined') {
    const hv  = _TF_SLIDE_HV[_tf_step];
    const key = hv ? (hv[0] + '-' + hv[1]) : null;
    if (key && SLIDE_SCRIPTS[key]) {
      ta.value = SLIDE_SCRIPTS[key];
      _tf_notifyScriptLoaded(); return;
    }
  }

  /* 3. script của bước (hướng dẫn GV) */
  if (s.script) { ta.value = s.script; _tf_notifyScriptLoaded(); }
}

/* Flash nhẹ textarea khi nội dung cập nhật */
function _tf_notifyScriptLoaded() {
  const ta = document.getElementById('sp-textarea');
  if (!ta) return;
  ta.style.transition = 'background 0.25s';
  ta.style.background = '#0e2040';
  setTimeout(() => { ta.style.background = ''; }, 350);
}

/* Lộ trình chỉ gồm bước slide → chỉ đếm/hiển thị bước slide (break là divider, không tính) */
function _tfIsListed(i) {
  const s = TEACHING_STEPS[i];
  if (!s) return false;
  return s.action === 'slide' && !window._kbDeletedSet?.has(i);
}

/* Số thứ tự liên tục của một bước (đếm bước slide, non-deleted từ đầu đến origIdx) */
function _tfStepNumber(origIdx) {
  let n = 0;
  for (let j = 0; j <= origIdx && j < TEACHING_STEPS.length; j++) {
    if (_tfIsListed(j)) n++;
  }
  return n;
}

/* Tổng số bước thực (bước slide, non-deleted) */
function _tfTotalSteps() {
  let t = 0;
  TEACHING_STEPS.forEach((s, j) => { if (_tfIsListed(j)) t++; });
  return t;
}

/* ── 6. RENDER – cập nhật strip + script ── */
function tf_render() {
  const total = _tfTotalSteps();

  /* Progress bar */
  const pct  = _tf_step < 0 ? 0 : (_tfStepNumber(_tf_step) / total * 100);
  const fill = document.getElementById('tf-progress-fill');
  if (fill) fill.style.width = pct + '%';

  if (_tf_step < 0) return;
  const s = TEACHING_STEPS[_tf_step];
  const n = _tfStepNumber(_tf_step);

  /* Phase dot */
  const dot = document.getElementById('tf-phase-dot');
  if (dot) { dot.style.background = s.color; dot.style.boxShadow = '0 0 8px ' + s.color + 'aa'; }

  /* Strip text */
  const stepEl = document.getElementById('tf-strip-step');
  if (stepEl) stepEl.innerHTML =
    `<em>Bước ${n}/${total}</em> &nbsp;·&nbsp; <span style="color:${s.color};font-weight:700">${s.phase}</span> &nbsp;·&nbsp; ${s.title}`;

  const isBreak = s.action === 'break';
  const tier = _tfTier(_tf_step);

  const metaEl = document.getElementById('tf-strip-meta');
  if (metaEl) {
    if (isBreak)
      metaEl.textContent = `⏸ Nghỉ giữa tiết  ·  Tiết 1 ✓  →  Tiết 2  ·  còn ${total - n} bước`;
    else
      metaEl.textContent = `Tiết ${tier}  ·  ${_TF_ICONS[s.action]} ${_TF_LABELS[s.action]}  ·  ⏱ ~${s.time}p  ·  còn ${total - n} bước`;
  }

  /* Script badge + text */
  const badge = document.getElementById('tf-phase-badge');
  if (badge) {
    badge.textContent = s.phase;
    badge.style.background   = s.color + '22';
    badge.style.color        = s.color;
    badge.style.borderColor  = s.color + '55';
  }
  const scriptEl = document.getElementById('tf-script-text');
  if (scriptEl) scriptEl.textContent = s.script;

  const timeEl = document.getElementById('tf-time-tag');
  if (timeEl) timeEl.textContent = `⏱ ~${s.time} phút`;

  /* Rebuild list & pills */
  tf_buildList();
}

/* ── 7. BUILD DANH SÁCH – phase pills + step rows ── */
function tf_buildList() {
  _tf_buildPhases();
  _tf_buildRows();
}

/* Phase pills – đã ẩn theo yêu cầu */
function _tf_buildPhases() {
  const bar = document.getElementById('tf-phases');
  if (!bar) return;
  bar.innerHTML = '';
}

/* Step rows (vertical list) – drag-and-drop + nút ▲▼ */
function _tf_buildRows() {
  const list = document.getElementById('tf-step-list');
  if (!list) return;
  list.innerHTML = '';

  let lastPhase = null;
  let lastTier  = null; // null → chưa có, 1 → tiết 1, 2 → tiết 2
  let stepNum   = 0;    // số thứ tự hiển thị liên tục (đồng bộ với lộ trình kịch bản)

  TEACHING_STEPS.forEach((s, i) => {

    if (window._kbDeletedSet?.has(i)) return; // bỏ qua bước đã xóa

    // Lộ trình chỉ hiển thị slide (giữ break làm divider 2 tiết); ẩn câu hỏi/chọn người/playground
    if (s.action !== 'slide' && s.action !== 'break') return;

    /* ── Break / Divider giữa 2 tiết ── */
    if (s.action === 'break') {
      // Tổng kết thời lượng 2 tiết – theo vị trí break
      let t1Time = 0, t2Time = 0;
      TEACHING_STEPS.forEach((x, xi) => {
        if (x.action === 'break') return;
        if (_tfTier(xi) === 1) t1Time += x.time; else t2Time += x.time;
      });

      const isDone = i < _tf_step;
      const isActive = i === _tf_step;

      const div = document.createElement('div');
      div.id = 'tfc' + i;
      div.className = 'tf-tier-divider' + (isActive ? ' tf-active' : isDone ? ' tf-done' : '');
      div.style.opacity = isDone ? '0.5' : '';
      div.innerHTML =
        `<div class="tf-tier-div-top">` +
          `<span class="tf-tier-badge t1">✓ Tiết 1</span>` +
          `<span class="tf-tier-div-title">Kết thúc Tiết 1 — Nghỉ giữa tiết</span>` +
          `<span class="tf-tier-div-time">~${s.time}p</span>` +
        `</div>` +
        `<hr class="tf-tier-sep">` +
        `<div class="tf-tier-div-top" style="margin-top:4px">` +
          `<span class="tf-tier-badge t2">▶ Tiết 2</span>` +
          `<span style="font-size:0.63em;color:#3a5a70">Luyện tập · Vận dụng · Tổng kết · BTVN</span>` +
          `<span class="tf-tier-div-time" style="color:#06d6a0">~${t2Time}p</span>` +
        `</div>` +
        `<div class="tf-tier-div-note">⏱ Tiết 1: ~${t1Time}p &nbsp;|&nbsp; ⏱ Tiết 2: ~${t2Time}p &nbsp;|&nbsp; Tổng: ~${t1Time + t2Time}p</div>`;
      div.onclick = () => { tf_goTo(i); };
      list.appendChild(div);
      lastPhase = s.phase;
      return;
    }

    /* ── Tiết header (lần đầu gặp tiết 2) ── */
    const thisTier = _tfTier(i);
    if (thisTier !== lastTier) {
      const tierHdr = document.createElement('div');
      tierHdr.className = 'tf-tier-hdr';
      if (thisTier === 1) {
        tierHdr.style.color = '#3a86ff';
        tierHdr.style.borderLeftColor = '#3a86ff';
        tierHdr.innerHTML = `<span>📚 TIẾT 1</span><span style="margin-left:auto;font-weight:400;color:#2a3a4a">Hình thành kiến thức · ~45 phút</span>`;
      } else {
        tierHdr.style.color = '#06d6a0';
        tierHdr.style.borderLeftColor = '#06d6a0';
        tierHdr.innerHTML = `<span>📗 TIẾT 2</span><span style="margin-left:auto;font-weight:400;color:#2a3a4a">Luyện tập · Vận dụng · Tổng kết · ~45 phút</span>`;
      }
      list.appendChild(tierHdr);
      lastTier = thisTier;
    }

    /* ── Phase header ── */
    if (s.phase !== lastPhase) {
      let phCnt = 0, phTime = 0;
      for (let j = i; j < TEACHING_STEPS.length && TEACHING_STEPS[j].phase === s.phase; j++) {
        if (TEACHING_STEPS[j].action === 'slide' && !window._kbDeletedSet?.has(j)) { phCnt++; phTime += TEACHING_STEPS[j].time; }
      }
      const hdr = document.createElement('div');
      hdr.className = 'tf-phase-hdr';
      hdr.style.borderLeftColor = s.color;
      hdr.style.color           = s.color;
      hdr.innerHTML =
        `<span>${s.phase}</span>` +
        `<span class="tf-phase-hdr-meta">${phCnt} bước · ~${phTime} phút</span>`;
      list.appendChild(hdr);
      lastPhase = s.phase;
    }

    /* ── Step row ── */
    stepNum++;  // chỉ tăng cho bước thực (break có nhánh return riêng, bước đã xóa đã skip)
    const isDone   = i < _tf_step;
    const isActive = i === _tf_step;

    const row = document.createElement('div');
    row.id              = 'tfc' + i;
    row.dataset.idx     = i;
    row.setAttribute('draggable', 'true');          // drag luôn bật
    row.className       = 'tf-row' + (isActive ? ' tf-active' : isDone ? ' tf-done' : '');
    if (isActive) row.style.setProperty('--step-color', s.color);
    row.title = `Bước ${stepNum}: ${s.title}\n⏱ ~${s.time} phút\n\n${s.script}`;

    /* onclick: bỏ qua nếu click vào nút ▲▼ */
    row.addEventListener('click', e => {
      if (e.target.closest('.tf-mv-btn')) return;
      window._kbSelectedOrigIdx = i; // đồng bộ với cau-hoi.js để gán bước hoạt động từ slide-nav
      tf_goTo(i); tf_execute();
    });

    /* ── Build inner HTML ── */
    const accentStyle = isActive ? `background:${s.color}` : isDone ? 'background:#2a5a2a' : '';
    let extraTags = '';
    if (s.cqTab !== null && s.cqTab !== undefined)
      extraTags += `<span class="tf-tag tf-tag-cq tf-tag-dim">Tab ${s.cqTab}</span>`;
    if (s.preset)
      extraTags += `<span class="tf-tag tf-tag-code tf-tag-dim">${s.preset.replace('demo_','')}</span>`;
    const numLabel = isDone ? `<span style="color:#3a8a3a">✓</span>` : `${stepNum}`;

    row.innerHTML =
      `<div class="tf-row-drag" title="Kéo để di chuyển">⠿</div>` +
      `<div class="tf-row-accent" style="${accentStyle}"></div>` +
      `<div class="tf-row-num">${numLabel}</div>` +
      `<div class="tf-row-icon">${_TF_ICONS[s.action]}</div>` +
      `<div class="tf-row-body">` +
        `<div class="tf-row-title">${s.title}</div>` +
        `<div class="tf-row-tags">` +
          `<span class="tf-tag ${_TF_TAG_CLS[s.action]}">${_TF_ICONS[s.action]} ${_TF_LABELS[s.action]}</span>` +
          extraTags +
        `</div>` +
      `</div>` +
      `<div class="tf-row-btns">` +
        `<button class="tf-mv-btn" title="Lên trên">▲</button>` +
        `<button class="tf-mv-btn" title="Xuống dưới">▼</button>` +
      `</div>` +
      `<div class="tf-row-right">` +
        `<div class="tf-row-time">⏱ ~${s.time}p</div>` +
      `</div>`;

    /* ── Nút ▲▼ ── */
    const [btnUp, btnDn] = row.querySelectorAll('.tf-mv-btn');
    btnUp.addEventListener('click', e => { e.stopPropagation(); tf_moveStep(i, i - 1); });
    btnDn.addEventListener('click', e => { e.stopPropagation(); tf_moveStep(i, i + 1); });

    /* ── Drag events ── */
    row.addEventListener('dragstart', e => {
      _tf_drag_from = i;
      _tf_dragging  = true;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(i));
      row.classList.add('tf-dragging');
    });

    row.addEventListener('dragend', () => {
      _tf_dragging = false;
      row.classList.remove('tf-dragging');
      _tf_cleanDragOver();
      _tf_drag_from = -1;
    });

    row.addEventListener('dragover', e => {
      if (_tf_drag_from < 0 || _tf_drag_from === i) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      _tf_cleanDragOver();
      const rect = row.getBoundingClientRect();
      const after = e.clientY > rect.top + rect.height * 0.5;
      row.classList.add(after ? 'tf-drag-below' : 'tf-drag-above');
      _tf_drag_to = after ? i + 1 : i;
    });

    row.addEventListener('dragleave', e => {
      if (!row.contains(e.relatedTarget))
        row.classList.remove('tf-drag-above', 'tf-drag-below');
    });

    row.addEventListener('drop', e => {
      e.preventDefault();
      if (_tf_drag_from < 0) return;
      _tf_cleanDragOver();
      let to = _tf_drag_to >= 0 ? _tf_drag_to : i;
      if (to > _tf_drag_from) to--;
      tf_moveStep(_tf_drag_from, to);
    });

    list.appendChild(row);
  });
}

function tf_scrollToActive() {
  const el = document.getElementById('tfc' + _tf_step);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
