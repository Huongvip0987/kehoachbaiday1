// ══════════════════════════════════
// EDIT MODE – CORE (drag / resize / select / group)
// ══════════════════════════════════
const DRAGGABLE_SEL = [
  '.reveal section > h1','.reveal section > h2','.reveal section > h3',
  '.reveal section > p','.reveal section > ul','.reveal section > pre',
  '.reveal section > table','.reveal section > small','.reveal section > div',
  '.reveal section > span',
  '.reveal section > .math-box','.reveal section > .mem-demo',
  '.reveal section > .two-col','.reveal section > .question-box',
  '.reveal section > .info-box','.reveal section > .summary-grid',
  '.reveal section > .keyword-grid','.reveal section > .section-tag',
  '.reveal section > .simultaneous-demo','.reveal section > .open-playground-btn',
  '.reveal section > .task-list','.reveal section > .demo-hint',
  '.reveal section > .vscode-badge',
  '.reveal section .info-box','.reveal section .mem-box',
  '.reveal section .summary-card','.reveal section .cr-card',
  '.reveal section img'
].join(', ');

function enableEditMode() {
  document.querySelectorAll('.reveal section li').forEach(li => {
    if (!li.querySelector('.li-move-btns')) {
      const b = document.createElement('span');
      b.className = 'li-move-btns';
      b.innerHTML = '<button onclick="moveLi(this,-1)">▲</button><button onclick="moveLi(this,1)">▼</button>';
      li.appendChild(b);
    }
  });
  document.querySelectorAll(DRAGGABLE_SEL).forEach(el => {
    if (el.classList.contains('drag-handle')) return;
    el.classList.add('drag-handle');
    el._dragMD = dragStart.bind(null, el);
    el.addEventListener('mousedown', el._dragMD);
    el._fontClick = showObjFontCtrl.bind(null, el);
    el.addEventListener('click', el._fontClick);
    el._dblEdit = () => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
      el.focus();
    };
    el.addEventListener('dblclick', el._dblEdit);
  });
  document.querySelectorAll('.reveal section li').forEach(el => {
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('spellcheck', 'false');
  });
}

function disableEditMode() {
  if (_moveMode) toggleMoveMode(false);
  _clearMultiSel();
  document.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
  document.querySelectorAll('.li-move-btns').forEach(b => b.remove());
  document.querySelectorAll('.drag-handle').forEach(el => {
    if (el._dragMD) el.removeEventListener('mousedown', el._dragMD);
    if (el._fontClick) el.removeEventListener('click', el._fontClick);
    if (el._dblEdit) el.removeEventListener('dblclick', el._dblEdit);
    el.classList.remove('drag-handle');
  });
  document.getElementById('obj-font-ctrl').style.display = 'none';
  deselectObj();
}

// ── Shared state ──
let _drag     = null;
let _resize   = null;
let _selected = null;
let _moveMode = false;

function toggleMoveMode(force) {
  _moveMode = (force !== undefined) ? force : !_moveMode;
  document.body.classList.toggle('move-mode', _moveMode);
  const btn = document.getElementById('btn-move-mode');
  if (btn) btn.classList.toggle('move-active', _moveMode);
  _showEditToast(_moveMode ? '🔀 Chế độ Di chuyển BẬT' : '🔀 Chế độ Di chuyển TẮT');
}

// ── Selection & resize handles ──
function selectObj(el) {
  if (_selected && _selected !== el) _selected.classList.remove('selected');
  _selected = el;
  el.classList.add('selected');
  positionHandles(el);
  document.querySelectorAll('.rh').forEach(h => h.classList.add('visible'));
}

function deselectObj() {
  if (_selected) { _selected.classList.remove('selected'); _selected = null; }
  _clearMultiSel();
  document.querySelectorAll('.rh').forEach(h => h.classList.remove('visible'));
  if (document.getElementById('obj-font-ctrl')) {
    document.getElementById('obj-font-ctrl').style.display = 'none';
  }
}

function positionHandles(el) {
  if (!el) return;
  const r  = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const pts = {
    nw:[r.left,r.top], n:[cx,r.top], ne:[r.right,r.top],
    e:[r.right,cy], se:[r.right,r.bottom],
    s:[cx,r.bottom], sw:[r.left,r.bottom], w:[r.left,cy]
  };
  document.querySelectorAll('.rh').forEach(h => {
    const [x,y] = pts[h.dataset.d] || [0,0];
    h.style.left = x + 'px';
    h.style.top  = y + 'px';
  });
}

// ── Drag ──
function dragStart(el, e) {
  if (!_moveMode) return;
  if (el.isContentEditable) return;
  const af = document.activeElement;
  if (af && af.isContentEditable && af !== document.body && af !== el && el.contains(af)) return;

  e.stopPropagation();
  if (!el.style.animation) {
    el.style.opacity = getComputedStyle(el).opacity;
    el.style.animation = 'none';
  }
  const cs = getComputedStyle(el).transform;
  const m  = cs === 'none' ? { m41: 0, m42: 0 } : new DOMMatrix(cs);
  _drag = { el, sx: e.clientX, sy: e.clientY, bx: m.m41, by: m.m42, moved: false };
  el.classList.add('dragging');
}

// ── Resize handles setup ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.rh').forEach(h => {
    h.addEventListener('mousedown', e => {
      if (!_selected) return;
      e.preventDefault();
      e.stopPropagation();
      _pushUndo();
      if (!_selected.style.animation) {
        _selected.style.opacity = getComputedStyle(_selected).opacity;
        _selected.style.animation = 'none';
      }
      const r  = _selected.getBoundingClientRect();
      const cs = getComputedStyle(_selected).transform;
      const m  = cs === 'none' ? { m41:0, m42:0 } : new DOMMatrix(cs);
      _resize = {
        el: _selected, dir: h.dataset.d,
        sx: e.clientX,  sy: e.clientY,
        sw: r.width,     sh: r.height,
        bx: m.m41,       by: m.m42
      };
    });
  });
});

// ── Click ngoài drag-handle → deselect ──
window.addEventListener('click', e => {
  if (!document.body.classList.contains('mode-edit')) return;
  if (!e.target.closest('.drag-handle') &&
      !e.target.closest('.rh') &&
      !e.target.closest('#obj-font-ctrl') &&
      !e.target.closest('#edit-toolbar')) {
    deselectObj();
  }
}, true);

window.addEventListener('resize', () => { if (_selected) positionHandles(_selected); });

// ── Mousemove: drag và resize ──
window.addEventListener('mousemove', e => {
  if (_resize) {
    const { el, dir, sx, sy, sw, sh, bx, by } = _resize;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    let tx = bx, ty = by;
    if (dir.includes('e')) el.style.width  = Math.max(60, sw + dx) + 'px';
    if (dir.includes('w')) {
      const nw = Math.max(60, sw - dx);
      el.style.width = nw + 'px';
      tx = bx + (sw - nw);
    }
    if (dir.includes('s')) el.style.height = Math.max(20, sh + dy) + 'px';
    if (dir.includes('n')) {
      const nh = Math.max(20, sh - dy);
      el.style.height = nh + 'px';
      ty = by + (sh - nh);
    }
    if (tx !== bx || ty !== by) el.style.transform = `translate(${tx}px,${ty}px)`;
    positionHandles(el);
    return;
  }

  if (!_drag) return;
  e.preventDefault();
  const dx = e.clientX - _drag.sx;
  const dy = e.clientY - _drag.sy;

  if (!_drag.moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
    _pushUndo();
    _drag.moved = true;
  }

  _drag.el.style.transform = `translate(${_drag.bx + dx}px,${_drag.by + dy}px)`;
  if (_selected === _drag.el) positionHandles(_drag.el);
});

// ── Mouseup ──
window.addEventListener('mouseup', () => {
  if (_resize) {
    const lbl = (_resize.el.className || _resize.el.tagName || '').split(' ')[0];
    _resize = null;
    _pushHistory('Resize: ' + lbl);
    return;
  }
  if (!_drag) return;
  const el    = _drag.el;
  const moved = _drag.moved;
  el.classList.remove('dragging');
  _drag = null;
  if (moved) {
    const lbl = (el.className || el.tagName || '').split(' ')[0];
    _pushHistory('Di chuyển: ' + lbl);
  }
});

// ══ MULTI-SELECT & GROUP/UNGROUP ══
let _multiSelected = new Set();

function _updateGroupBtn() {
  const btn = document.getElementById('btn-group');
  if (btn) btn.disabled = _multiSelected.size < 2;
}

function _clearMultiSel() {
  _multiSelected.forEach(el => el.classList.remove('multi-sel'));
  _multiSelected.clear();
  _updateGroupBtn();
}

function _toggleMultiSel(el) {
  if (_multiSelected.has(el)) {
    _multiSelected.delete(el);
    el.classList.remove('multi-sel');
  } else {
    _multiSelected.add(el);
    el.classList.add('multi-sel');
  }
  _updateGroupBtn();
}

function _registerDraggable(el) {
  if (el.classList.contains('drag-handle')) return;
  el.classList.add('drag-handle');
  el._dragMD    = dragStart.bind(null, el);
  el._fontClick = showObjFontCtrl.bind(null, el);
  el._dblEdit   = () => { el.setAttribute('contenteditable','true'); el.setAttribute('spellcheck','false'); el.focus(); };
  el.addEventListener('mousedown', el._dragMD);
  el.addEventListener('click',     el._fontClick);
  el.addEventListener('dblclick',  el._dblEdit);
}

function _forceRegisterDraggable(el) {
  if (el._dragMD)    el.removeEventListener('mousedown', el._dragMD);
  if (el._fontClick) el.removeEventListener('click',     el._fontClick);
  if (el._dblEdit)   el.removeEventListener('dblclick',  el._dblEdit);
  el.classList.add('drag-handle');
  el._dragMD    = dragStart.bind(null, el);
  el._fontClick = showObjFontCtrl.bind(null, el);
  el._dblEdit   = () => { el.setAttribute('contenteditable','true'); el.setAttribute('spellcheck','false'); el.focus(); };
  el.addEventListener('mousedown', el._dragMD);
  el.addEventListener('click',     el._fontClick);
  el.addEventListener('dblclick',  el._dblEdit);
}

function groupSelected() {
  if (_multiSelected.size < 2) {
    alert('Ctrl+Click để chọn ít nhất 2 đối tượng, rồi nhấn Gộp.');
    return;
  }
  const items = Array.from(_multiSelected);
  const parent = items[0].parentElement;
  if (!items.every(el => el.parentElement === parent)) {
    alert('Chỉ gộp được các đối tượng cùng cấp (cùng parent).');
    return;
  }
  _pushUndo();

  items.sort((a, b) => a.compareDocumentPosition(b) & 4 ? -1 : 1);

  const wrapper = document.createElement('div');
  wrapper.className = 'group-wrapper';
  parent.insertBefore(wrapper, items[0]);
  items.forEach(el => {
    el.classList.remove('multi-sel', 'selected');
    wrapper.appendChild(el);
  });

  _multiSelected.clear();
  _updateGroupBtn();

  if (document.body.classList.contains('mode-edit')) _registerDraggable(wrapper);
  selectObj(wrapper);
  _pushHistory('Gộp nhóm');
  _showEditToast('🔗 Đã gộp ' + items.length + ' đối tượng');
}

function ungroupSelected() {
  const container = _selected;
  if (!container) { _showEditToast('⚠️ Chọn một khung để tách'); return; }
  const parent = container.parentElement;
  if (!parent) return;

  const children = Array.from(container.children).filter(
    c => !c.classList.contains('li-move-btns') && !c.classList.contains('card-deco')
  );
  if (children.length === 0) { _showEditToast('⚠️ Không có phần tử con để tách'); return; }

  _pushUndo();

  const m    = new DOMMatrix(getComputedStyle(container).transform);
  const ctTx = m.m41, ctTy = m.m42;

  const isEditMode = document.body.classList.contains('mode-edit');
  children.forEach(child => {
    const cm = new DOMMatrix(getComputedStyle(child).transform);
    child.style.transform = `translate(${cm.m41 + ctTx}px,${cm.m42 + ctTy}px)`;
    parent.insertBefore(child, container);
    if (isEditMode) _forceRegisterDraggable(child);
  });

  container.remove();
  deselectObj();
  _pushHistory('Tách nhóm');
  _showEditToast('✂️ Đã tách ' + children.length + ' phần tử');
}
