// ══════════════════════════════════
// ID INSPECTOR – Xem mã định danh
// Di chuột: xem selector · Chuột phải: copy 1 phần tử
// Kéo chuột trái: vùng chọn nhiều phần tử → copy tất cả
// ══════════════════════════════════

let _idInspectActive = false;
let _idTip  = null;
let _idCopyTimeout = null;
let _idLastTarget  = null;

// Drag-select state
let _idDragStart = null;   // {x, y} khi mousedown
let _idDragging  = false;  // đã vượt ngưỡng 4px
let _idDragEl    = null;   // #id-drag-rect

// ── Toggle ──────────────────────────────────────────────
function toggleIdInspector() {
  _idInspectActive = !_idInspectActive;
  const btn = document.getElementById('btn-id-inspect');
  if (!_idTip)   _idTip   = document.getElementById('id-inspector-tip');
  if (!_idDragEl) _idDragEl = document.getElementById('id-drag-rect');

  if (_idInspectActive) {
    document.body.classList.add('mode-id-inspect');
    if (btn) btn.classList.add('active');
    document.addEventListener('mousemove',   _idOnMove,        true);
    document.addEventListener('contextmenu', _idOnContextMenu, true);
    document.addEventListener('mouseleave',  _idOnLeave,       true);
    document.addEventListener('mousedown',   _idOnMouseDown,   true);
    document.addEventListener('mouseup',     _idOnMouseUp,     true);
  } else {
    _idResetDrag();
    document.body.classList.remove('mode-id-inspect', 'id-dragging');
    if (btn) btn.classList.remove('active');
    document.removeEventListener('mousemove',   _idOnMove,        true);
    document.removeEventListener('contextmenu', _idOnContextMenu, true);
    document.removeEventListener('mouseleave',  _idOnLeave,       true);
    document.removeEventListener('mousedown',   _idOnMouseDown,   true);
    document.removeEventListener('mouseup',     _idOnMouseUp,     true);
    if (_idTip)   _idTip.classList.remove('visible');
  }
}

// ── Drag-select ─────────────────────────────────────────
function _idOnMouseDown(e) {
  if (e.button !== 0) return;
  if (_idTip   && (_idTip.contains(e.target)   || e.target === _idTip))   return;
  if (_idDragEl && (_idDragEl.contains(e.target) || e.target === _idDragEl)) return;
  _idDragStart = { x: e.clientX, y: e.clientY };
  _idDragging  = false;
}

function _idOnMouseUp(e) {
  if (_idDragging && _idDragStart) {
    _idFinishDrag(e.clientX, e.clientY);
  }
  _idResetDrag();
}

function _idResetDrag() {
  _idDragStart = null;
  _idDragging  = false;
  document.body.classList.remove('id-dragging');
  if (_idDragEl) _idDragEl.classList.remove('visible');
}

function _idFinishDrag(cx, cy) {
  const x1 = Math.min(_idDragStart.x, cx);
  const y1 = Math.min(_idDragStart.y, cy);
  const x2 = Math.max(_idDragStart.x, cx);
  const y2 = Math.max(_idDragStart.y, cy);

  const els = _idGetElementsInRect(x1, y1, x2, y2);
  if (els.length === 0) return;

  const text = els.map(_buildIdText).join('\n');
  _idCopyText(text, null, els.length);
}

function _idUpdateDragRect(cx, cy) {
  if (!_idDragEl || !_idDragStart) return;
  const x1 = Math.min(_idDragStart.x, cx);
  const y1 = Math.min(_idDragStart.y, cy);
  const x2 = Math.max(_idDragStart.x, cx);
  const y2 = Math.max(_idDragStart.y, cy);
  _idDragEl.style.left   = x1 + 'px';
  _idDragEl.style.top    = y1 + 'px';
  _idDragEl.style.width  = (x2 - x1) + 'px';
  _idDragEl.style.height = (y2 - y1) + 'px';
  _idDragEl.classList.add('visible');

  // Tooltip đếm phần tử
  const count = _idGetElementsInRect(x1, y1, x2, y2).length;
  if (_idTip) {
    _idTip.innerHTML =
      `<span class="tip-tag">📦</span> <span style="color:#4fc3f7;font-weight:700">${count}</span> phần tử trong vùng chọn` +
      `<div class="tip-hint">Thả chuột để copy tất cả</div>`;
    _idTip.classList.add('visible');
    // Cạnh phải màn hình
    const TW = _idTip.offsetWidth || 220;
    const TH = _idTip.offsetHeight || 40;
    let tx = cx + 14;
    let ty = cy + 14;
    if (tx + TW > window.innerWidth  - 8) tx = cx - TW - 14;
    if (ty + TH > window.innerHeight - 8) ty = cy - TH - 14;
    _idTip.style.left = Math.max(4, tx) + 'px';
    _idTip.style.top  = Math.max(4, ty) + 'px';
  }
}

// ── Hover (di chuột đơn) ────────────────────────────────
function _idOnMove(e) {
  if (!_idTip) return;

  // Đang kéo chuột trái?
  if (_idDragStart && e.buttons === 1) {
    const dx = Math.abs(e.clientX - _idDragStart.x);
    const dy = Math.abs(e.clientY - _idDragStart.y);
    if (!_idDragging && (dx > 4 || dy > 4)) {
      _idDragging = true;
      document.body.classList.add('id-dragging');
    }
    if (_idDragging) {
      e.preventDefault();
      _idUpdateDragRect(e.clientX, e.clientY);
      return; // không hiện tooltip đơn lẻ khi đang kéo
    }
    return;
  }

  // Hover bình thường
  const el = e.target;
  if (el === _idTip   || _idTip.contains(el))   return;
  if (el === _idDragEl || (_idDragEl && _idDragEl.contains(el))) return;

  _idLastTarget = el;
  _idTip.innerHTML = _buildIdHtml(el);
  _idTip.classList.add('visible');

  const GAP = 14;
  const TW = _idTip.offsetWidth  || 280;
  const TH = _idTip.offsetHeight || 60;
  let tx = e.clientX + GAP;
  let ty = e.clientY + GAP;
  if (tx + TW > window.innerWidth  - 8) tx = e.clientX - TW - GAP;
  if (ty + TH > window.innerHeight - 8) ty = e.clientY - TH - GAP;
  _idTip.style.left = Math.max(4, tx) + 'px';
  _idTip.style.top  = Math.max(4, ty) + 'px';
}

function _idOnLeave(e) {
  if (!_idTip) return;
  if (!e.relatedTarget) _idTip.classList.remove('visible');
}

// ── Chuột phải: copy đơn lẻ ────────────────────────────
function _idOnContextMenu(e) {
  if (!_idInspectActive) return;
  e.preventDefault();
  e.stopPropagation();

  const el = e.target;
  if (el === _idTip   || (_idTip   && _idTip.contains(el)))   return;
  if (el === _idDragEl || (_idDragEl && _idDragEl.contains(el))) return;

  _idCopyText(_buildIdText(el), el, 1);
}

// ── Copy helper ─────────────────────────────────────────
function _idCopyText(text, el, count) {
  const doShow = () => {
    if (!_idTip) return;
    if (_idCopyTimeout) clearTimeout(_idCopyTimeout);
    if (count > 1) {
      _idTip.innerHTML = `<div class="tip-copy">✅ Đã copy ${count} mã định danh!</div>`;
      _idTip.classList.add('visible');
      _idCopyTimeout = setTimeout(() => {
        if (_idTip && _idInspectActive) _idTip.classList.remove('visible');
      }, 2000);
    } else if (el) {
      _idTip.innerHTML = _buildIdHtml(el, true);
      _idCopyTimeout = setTimeout(() => {
        if (_idTip && _idInspectActive) _idTip.innerHTML = _buildIdHtml(el, false);
      }, 1500);
    }
  };

  navigator.clipboard.writeText(text).then(doShow).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    doShow();
  });
}

// ── Tìm phần tử trong vùng chọn ────────────────────────
function _idGetElementsInRect(x1, y1, x2, y2) {
  const SKIP_TAGS = new Set(['html', 'body', 'script', 'style', 'head', 'meta', 'link', 'title']);
  const tipEl    = document.getElementById('id-inspector-tip');
  const dragEl   = document.getElementById('id-drag-rect');
  const pgOverlay = document.getElementById('playground-overlay');
  const pgActive  = pgOverlay && pgOverlay.classList.contains('active');
  const modeBar   = document.getElementById('mode-bar');

  return Array.from(document.querySelectorAll('*')).filter(el => {
    // Khi playground đang mở: chỉ nhặt phần tử bên trong playground hoặc mode-bar
    if (pgActive) {
      const inPg      = pgOverlay.contains(el);
      const inModeBar = modeBar && modeBar.contains(el);
      if (!inPg && !inModeBar) return false;
    }
    if (SKIP_TAGS.has(el.tagName.toLowerCase())) return false;
    if (el === tipEl  || (tipEl  && tipEl.contains(el)))  return false;
    if (el === dragEl || (dragEl && dragEl.contains(el))) return false;
    // Chỉ lấy phần tử có mã định danh hữu ích
    if (!el.id && !el.classList.length && !Object.keys(el.dataset || {}).length) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    return r.left < x2 && r.right > x1 && r.top < y2 && r.bottom > y1;
  });
}

// ── Build identifier string ─────────────────────────────
function _buildIdText(el) {
  let s = el.tagName.toLowerCase();
  if (el.id) s += '#' + el.id;
  if (el.classList && el.classList.length) {
    s += '.' + Array.from(el.classList).join('.');
  }
  const dataAttrs = _getDataAttrs(el);
  if (dataAttrs.length) s += ' ' + dataAttrs.map(([k, v]) => `[${k}="${v}"]`).join(' ');
  return s;
}

function _buildIdHtml(el, copied) {
  const tag  = el.tagName.toLowerCase();
  const id   = el.id ? `<span class="tip-id">#${_esc(el.id)}</span>` : '';
  const cls  = el.classList && el.classList.length
    ? `<span class="tip-cls">.${Array.from(el.classList).map(_esc).join('.</span><span class="tip-cls">')}</span>`
    : '';
  const attrs = _getDataAttrs(el);
  const attrsHtml = attrs.length
    ? '<br>' + attrs.map(([k, v]) => `<span class="tip-attr">[${_esc(k)}=<span class="tip-val">"${_esc(v)}"</span>]</span>`).join('<br>')
    : '';
  const note = copied
    ? '<div class="tip-copy">✅ Đã copy vào clipboard!</div>'
    : '<div class="tip-hint">Chuột phải: copy · Kéo trái: chọn vùng</div>';
  return `<span class="tip-tag">${_esc(tag)}</span>${id}${cls}${attrsHtml}${note}`;
}

// ── Helpers ─────────────────────────────────────────────
function _getDataAttrs(el) {
  if (!el.dataset) return [];
  return Object.entries(el.dataset).map(([k, v]) => [`data-${_camelToKebab(k)}`, v]);
}
function _camelToKebab(s) {
  return s.replace(/([A-Z])/g, m => '-' + m.toLowerCase());
}
function _esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
