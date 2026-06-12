// ══════════════════════════════════════════════════════════════
// ZOOM + PAN + SCROLLBARS  –  tự inject CSS, hoạt động mọi trang
// Ctrl+Scroll  = zoom in/out
// Scroll       = pan lên/xuống khi đang zoom
// Shift+Scroll = pan trái/phải khi đang zoom
// Ctrl+0/+/-   = phím tắt zoom
// ══════════════════════════════════════════════════════════════

const ZM = (() => {
  // ── Inject CSS ─────────────────────────────────────────────
  (function _injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      #zm-sx {
        display:none;position:fixed;bottom:0;left:0;right:10px;height:10px;
        background:rgba(8,14,28,0.88);z-index:99997;cursor:pointer;
        border-top:1px solid #0d1525;
      }
      #zm-sx-thumb {
        position:absolute;top:1px;height:8px;
        background:rgba(79,195,247,0.45);border-radius:4px;
        cursor:grab;min-width:24px;transition:background .12s;
      }
      #zm-sx-thumb:hover,#zm-sx-thumb:active{background:rgba(79,195,247,.7);cursor:grabbing}
      #zm-sy {
        display:none;position:fixed;right:0;top:0;bottom:10px;width:10px;
        background:rgba(8,14,28,0.88);z-index:99997;cursor:pointer;
        border-left:1px solid #0d1525;
      }
      #zm-sy-thumb {
        position:absolute;left:1px;width:8px;
        background:rgba(79,195,247,0.45);border-radius:4px;
        cursor:grab;min-height:24px;transition:background .12s;
      }
      #zm-sy-thumb:hover,#zm-sy-thumb:active{background:rgba(79,195,247,.7);cursor:grabbing}
      #zm-sx::after {
        content:'';position:absolute;right:-10px;top:-1px;
        width:10px;height:11px;background:rgba(8,14,28,0.88);
      }
    `;
    document.head.appendChild(style);
  })();

  // ── State ──────────────────────────────────────────────────
  let zoom = 1.0, panX = 0, panY = 0;

  const MIN = 0.3, MAX = 3.0, STEP = 0.1;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const VW    = () => window.innerWidth;
  const VH    = () => window.innerHeight;
  const maxPX = () => Math.max(0, VW() * (zoom - 1));
  const maxPY = () => Math.max(0, VH() * (zoom - 1));

  // ── Content element detection ──────────────────────────────
  // Modal box (luật chơi, danh sách game): zoom quanh tâm, không pan
  function _getModalBox() {
    const qr = document.getElementById('quiz-rules-modal');
    if (qr && qr.classList.contains('active'))
      return document.getElementById('quiz-rules-box');
    const gl = document.getElementById('game-list-modal');
    if (gl && gl.classList.contains('active'))
      return document.getElementById('game-list-box');
    return null;
  }

  function _getContentEl() {
    const modalBox = _getModalBox();
    if (modalBox) return modalBox;
    const cqPres = document.getElementById('cq-present');
    if (cqPres && cqPres.classList.contains('active')) return cqPres;
    if (document.body.classList.contains('pg-as-slide'))
      return document.getElementById('playground-overlay');
    const mode = (typeof _currentAppMode !== 'undefined') ? _currentAppMode : null;
    if (mode === 'cq')      return document.getElementById('cq-overlay');
    if (mode === 'kichban') return document.getElementById('kichban-overlay');
    if (mode === 'chon')    return document.getElementById('chon-overlay');
    if (mode === 'code')    return document.getElementById('playground-overlay');
    // Slides / edit mode hoặc trang không có mode system
    return document.querySelector('.reveal') || document.body;
  }

  // ── Apply transform ────────────────────────────────────────
  function _clearAll() {
    ['.reveal','#cq-present','#cq-overlay','#kichban-overlay','#chon-overlay','#playground-overlay','#quiz-rules-box','#game-list-box'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) { el.style.transform = ''; el.style.transformOrigin = ''; el.style.overflow = ''; }
    });
    document.body.style.transform = '';
    document.body.style.transformOrigin = '';
  }

  function _apply() {
    panX = clamp(panX, 0, maxPX());
    panY = clamp(panY, 0, maxPY());
    _clearAll();

    const el = _getContentEl();
    if (!el) return;

    if (zoom !== 1 || panX !== 0 || panY !== 0) {
      if (_getModalBox() === el) {
        // Hộp modal nằm giữa màn hình: phóng quanh tâm, giữ nguyên vị trí & thanh cuộn nội bộ
        el.style.transformOrigin = '50% 50%';
        el.style.transform = `scale(${zoom})`;
      } else {
        el.style.transformOrigin = '0 0';
        el.style.transform =
          `scale(${zoom}) translate(${(-panX / zoom).toFixed(2)}px,${(-panY / zoom).toFixed(2)}px)`;
      }
    }
    _updateScrollbars();
  }

  // ── Zoom API ──────────────────────────────────────────────
  function setZoom(z) {
    const prev = zoom;
    zoom = clamp(Math.round(z * 10) / 10, MIN, MAX);
    if (zoom <= 1) {
      panX = panY = 0;
    } else if (prev <= 1) {
      panX = maxPX() / 2;
      panY = maxPY() / 2;
    } else {
      const r = zoom / prev;
      panX = clamp(panX * r, 0, maxPX());
      panY = clamp(panY * r, 0, maxPY());
    }
    _apply();
  }

  function stepZoom(dir) { setZoom(zoom + dir * STEP); }
  function resetZoom()   { zoom = 1; panX = panY = 0; _apply(); }
  function panBy(dx, dy) {
    panX = clamp(panX + dx, 0, maxPX());
    panY = clamp(panY + dy, 0, maxPY());
    _apply();
  }

  // ── Scrollbars ─────────────────────────────────────────────
  function _buildScrollbars() {
    const sx = document.createElement('div');
    sx.id = 'zm-sx';
    sx.innerHTML = '<div id="zm-sx-thumb"></div>';
    document.body.appendChild(sx);

    const sy = document.createElement('div');
    sy.id = 'zm-sy';
    sy.innerHTML = '<div id="zm-sy-thumb"></div>';
    document.body.appendChild(sy);

    _bindDrag('zm-sx-thumb', 'x');
    _bindDrag('zm-sy-thumb', 'y');

    sx.addEventListener('click', e => {
      if (e.target.id === 'zm-sx-thumb') return;
      const r = sx.getBoundingClientRect();
      panX = clamp(((e.clientX - r.left) / r.width) * maxPX(), 0, maxPX());
      _apply();
    });
    sy.addEventListener('click', e => {
      if (e.target.id === 'zm-sy-thumb') return;
      const r = sy.getBoundingClientRect();
      panY = clamp(((e.clientY - r.top) / r.height) * maxPY(), 0, maxPY());
      _apply();
    });
  }

  function _bindDrag(thumbId, axis) {
    const thumb = document.getElementById(thumbId);
    if (!thumb) return;
    let startMouse = 0, startPan = 0, active = false;

    thumb.addEventListener('mousedown', e => {
      active = true;
      startMouse = axis === 'x' ? e.clientX : e.clientY;
      startPan   = axis === 'x' ? panX : panY;
      e.stopPropagation(); e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!active) return;
      const track  = document.getElementById(axis === 'x' ? 'zm-sx' : 'zm-sy');
      const trRect = track.getBoundingClientRect();
      const trSize = axis === 'x' ? trRect.width  : trRect.height;
      const tSize  = axis === 'x' ? thumb.offsetWidth : thumb.offsetHeight;
      const ratio  = (trSize - tSize) > 0
        ? ((axis === 'x' ? e.clientX : e.clientY) - startMouse) / (trSize - tSize) : 0;
      if (axis === 'x') panX = clamp(startPan + ratio * maxPX(), 0, maxPX());
      else              panY = clamp(startPan + ratio * maxPY(), 0, maxPY());
      _apply();
    });
    document.addEventListener('mouseup', () => { active = false; });
  }

  function _updateScrollbars() {
    const sx  = document.getElementById('zm-sx');
    const sy  = document.getElementById('zm-sy');
    const sxt = document.getElementById('zm-sx-thumb');
    const syt = document.getElementById('zm-sy-thumb');
    const show = zoom > 1;
    if (sx) sx.style.display = show ? '' : 'none';
    if (sy) sy.style.display = show ? '' : 'none';
    if (!show) return;

    if (sxt) {
      const tw = Math.max(24, Math.round(VW() / zoom));
      const leftMax = Math.max(0, sx.offsetWidth - tw);
      sxt.style.width = tw + 'px';
      sxt.style.left  = Math.round(maxPX() > 0 ? (panX / maxPX()) * leftMax : 0) + 'px';
    }
    if (syt) {
      const th = Math.max(24, Math.round(VH() / zoom));
      const topMax = Math.max(0, sy.offsetHeight - th);
      syt.style.height = th + 'px';
      syt.style.top    = Math.round(maxPY() > 0 ? (panY / maxPY()) * topMax : 0) + 'px';
    }
  }

  // ── Đặt lại top cho #zm-sy theo toolbar (nếu có) ──────────
  function _syncToolbarOffset() {
    const bar = document.getElementById('mode-bar');
    const sy  = document.getElementById('zm-sy');
    if (!sy) return;
    sy.style.top = bar ? (bar.offsetHeight || 44) + 'px' : '0';
  }

  // ── Input events ───────────────────────────────────────────
  function _bindInput() {
    document.addEventListener('wheel', e => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoom(zoom + (e.deltaY < 0 ? STEP : -STEP));
      } else if (zoom > 1) {
        // Trong hộp modal: để cuộn nội bộ hoạt động bình thường
        if (e.target && e.target.closest && e.target.closest('#quiz-rules-box, #game-list-box')) return;
        e.preventDefault();
        if (e.shiftKey) panBy(e.deltaY > 0 ? 80 : -80, 0);
        else            panBy(0, e.deltaY > 0 ? 80 : -80);
      }
    }, { passive: false });

    document.addEventListener('keydown', e => {
      if (!e.ctrlKey) return;
      if (e.key === '0') { e.preventDefault(); resetZoom(); }
      if (e.key === '=' || e.key === '+') { e.preventDefault(); stepZoom(1); }
      if (e.key === '-') { e.preventDefault(); stepZoom(-1); }
    });
  }

  // ── Reset khi đổi tab ──────────────────────────────────────
  function refresh() {
    zoom = 1; panX = panY = 0;
    _clearAll();
    _updateScrollbars();
    _syncToolbarOffset();
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    _buildScrollbars();
    _syncToolbarOffset();
    _bindInput();
    window.addEventListener('resize', () => { panX = clamp(panX,0,maxPX()); panY = clamp(panY,0,maxPY()); _apply(); _syncToolbarOffset(); });
  }

  return { init, refresh, setZoom, stepZoom, resetZoom, panBy,
           get zoom() { return zoom; } };
})();

document.addEventListener('DOMContentLoaded', () => ZM.init());
