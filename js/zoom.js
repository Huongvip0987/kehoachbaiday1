// ══════════════════════════════════
// ZOOM TẠI CON TRỎ CHUỘT – tất cả tab
// Ctrl+Scroll  → zoom tại vị trí chuột
// Chuột giữa kéo (hoặc Space+kéo) → pan
// Ctrl+0       → đặt lại 100%
// ══════════════════════════════════
(function () {
  'use strict';

  const ZOOM_MIN = 0.25, ZOOM_MAX = 4.0, ZOOM_STEP = 0.1;

  // Trạng thái zoom per-tab
  const _state = {};
  function _getState(el) {
    if (!el._zoomId) el._zoomId = '_z' + Math.random().toString(36).slice(2);
    if (!_state[el._zoomId]) _state[el._zoomId] = { scale: 1, panX: 0, panY: 0 };
    return _state[el._zoomId];
  }

  let spaceDown = false, panning = false, lastPX = 0, lastPY = 0;

  /* ── Lấy element đang hiện theo mode ── */
  function getTarget() {
    // Modal đang mở (luật chơi, danh sách game) – zoom vào hộp nội dung
    const qrModal = document.getElementById('quiz-rules-modal');
    if (qrModal && qrModal.classList.contains('active'))
      return document.getElementById('quiz-rules-box');
    const glModal = document.getElementById('game-list-modal');
    if (glModal && glModal.classList.contains('active'))
      return document.getElementById('game-list-box');
    // Câu hỏi trình chiếu (ưu tiên cao nhất – mode không đổi khi mở)
    const cqPres = document.getElementById('cq-present');
    if (cqPres && cqPres.classList.contains('active')) return cqPres;
    // Playground dán trong slide (body.pg-as-slide, mode vẫn là 'slides')
    if (document.body.classList.contains('pg-as-slide'))
      return document.getElementById('playground-overlay');
    const mode = (typeof _currentAppMode !== 'undefined') ? _currentAppMode : 'slides';
    if (mode === 'cq')      return document.getElementById('cq-overlay');
    if (mode === 'chon')    return document.getElementById('chon-overlay');
    if (mode === 'kichban') return document.getElementById('kichban-overlay');
    if (mode === 'code')    return document.getElementById('playground-overlay');
    return document.querySelector('.reveal'); // slides / edit
  }

  /* ── Áp dụng transform ── */
  function applyTransform(el) {
    if (!el) return;
    const st = _getState(el);
    if (st.scale === 1 && st.panX === 0 && st.panY === 0) {
      el.style.transform = '';
      el.style.transformOrigin = '';
      el.style.overflow = '';
    } else {
      el.style.transformOrigin = '0 0';
      el.style.transform =
        'translate(' + st.panX + 'px,' + st.panY + 'px) scale(' + st.scale + ')';
      if (!el.dataset.zoomKeepOverflow) el.style.overflow = 'visible';
    }
  }

  /* ── Hiện indicator ── */
  let _indT;
  function showIndicator(s) {
    const el = document.getElementById('zoom-indicator');
    if (!el) return;
    el.querySelector('.zi-pct').textContent = Math.round(s * 100) + '%';
    const hint = el.querySelector('.zi-hint');
    if (hint) hint.textContent = s === 1 ? '' : 'Ctrl+0 đặt lại · chuột giữa kéo để di chuyển';
    el.classList.add('visible');
    clearTimeout(_indT);
    _indT = setTimeout(function () { el.classList.remove('visible'); }, 1800);
  }

  /* ── Tính gốc layout (chưa transform) của target để offset chuột đúng ──
     Với transform-origin 0 0: vị trí hiển thị của gốc = vị trí layout + pan,
     nên trừ pan ra để được gốc layout thật (đúng cả khi target là modal ở giữa màn hình). */
  function getLayoutOffset(el, st) {
    if (!el) return { left: 0, top: 0 };
    const rect = el.getBoundingClientRect();
    return { left: rect.left - st.panX, top: rect.top - st.panY };
  }

  /* ── Ctrl+Scroll: zoom tại con trỏ ── */
  window.addEventListener('wheel', function (e) {
    if (!e.ctrlKey) return;
    e.preventDefault();
    e.stopPropagation();

    const el = getTarget();
    if (!el) return;
    const st = _getState(el);

    const oldScale = st.scale;
    const raw = e.deltaY < 0
      ? Math.min(ZOOM_MAX, st.scale + ZOOM_STEP)
      : Math.max(ZOOM_MIN, st.scale - ZOOM_STEP);
    const newScale = Math.round(raw * 10) / 10;
    if (newScale === oldScale) return;

    const ratio = newScale / oldScale;
    const off = getLayoutOffset(el, st);
    const mx = e.clientX - off.left;
    const my = e.clientY - off.top;

    st.panX = mx * (1 - ratio) + st.panX * ratio;
    st.panY = my * (1 - ratio) + st.panY * ratio;
    st.scale = newScale;

    if (st.scale <= 1) { st.scale = Math.max(ZOOM_MIN, st.scale); st.panX = 0; st.panY = 0; }

    applyTransform(el);
    showIndicator(st.scale);
    if (el.classList.contains('reveal')) try { Reveal.layout(); } catch(e2) {}
  }, { passive: false });

  /* ── Phím tắt ── */
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      const el = getTarget();
      const st = el ? _getState(el) : { scale: 1 };
      if (st.scale > 1 && !e.target.closest('[contenteditable]')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!spaceDown) { spaceDown = true; document.body.style.cursor = 'grab'; }
        return;
      }
    }
    if (!e.ctrlKey) return;

    const el = getTarget();
    if (!el) return;
    const st = _getState(el);

    // Ctrl+0: reset
    if (e.key === '0') {
      e.preventDefault();
      st.scale = 1; st.panX = 0; st.panY = 0;
      applyTransform(el); showIndicator(1);
      if (el.classList.contains('reveal')) try { Reveal.layout(); } catch(e2) {}
    }
    // Ctrl++ / Ctrl+=
    else if (e.key === '=' || e.key === '+') {
      e.preventDefault();
      const ns = Math.round(Math.min(ZOOM_MAX, st.scale + ZOOM_STEP) * 10) / 10;
      if (ns !== st.scale) {
        const ratio = ns / st.scale;
        const off = getLayoutOffset(el, st);
        const cx = window.innerWidth / 2 - off.left, cy = window.innerHeight / 2 - off.top;
        st.panX = cx * (1 - ratio) + st.panX * ratio;
        st.panY = cy * (1 - ratio) + st.panY * ratio;
        st.scale = ns; applyTransform(el); showIndicator(st.scale);
      }
    }
    // Ctrl+-
    else if (e.key === '-') {
      e.preventDefault();
      const ns = Math.round(Math.max(ZOOM_MIN, st.scale - ZOOM_STEP) * 10) / 10;
      if (ns !== st.scale) {
        const ratio = ns / st.scale;
        const off = getLayoutOffset(el, st);
        const cx = window.innerWidth / 2 - off.left, cy = window.innerHeight / 2 - off.top;
        st.panX = cx * (1 - ratio) + st.panX * ratio;
        st.panY = cy * (1 - ratio) + st.panY * ratio;
        st.scale = ns;
        if (st.scale <= 1) { st.scale = Math.max(ZOOM_MIN, st.scale); st.panX = 0; st.panY = 0; }
        applyTransform(el); showIndicator(st.scale);
      }
    }
  }, { capture: true });

  window.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
      spaceDown = false; panning = false;
      document.body.style.cursor = '';
    }
  });

  /* ── Chuột giữa hoặc Space+kéo: pan ── */
  window.addEventListener('mousedown', function (e) {
    const isMiddle = e.button === 1;
    const el = getTarget();
    const st = el ? _getState(el) : { scale: 1 };
    const isSpaceDrag = spaceDown && st.scale > 1;
    if (!isMiddle && !isSpaceDrag) return;
    if (st.scale <= 1 && !isSpaceDrag) return;
    e.preventDefault();
    e.stopPropagation();
    panning = true;
    lastPX = e.clientX; lastPY = e.clientY;
    document.body.style.cursor = 'grabbing';
  }, { capture: true });

  window.addEventListener('mousemove', function (e) {
    if (!panning) return;
    const el = getTarget();
    if (!el) return;
    const st = _getState(el);
    st.panX += e.clientX - lastPX;
    st.panY += e.clientY - lastPY;
    lastPX = e.clientX; lastPY = e.clientY;
    applyTransform(el);
  });

  window.addEventListener('mouseup', function (e) {
    if (!panning) return;
    panning = false;
    document.body.style.cursor = spaceDown ? 'grab' : '';
  });
})();
