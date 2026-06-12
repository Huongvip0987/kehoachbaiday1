// ══════════════════════════════════
// EDIT MODE – OBJECT STYLE POPUP
// ══════════════════════════════════
let _fontTarget = null;

function _rgbToHex(rgb) {
  if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#4fc3f7';
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return '#4fc3f7';
  return '#' + [m[0],m[1],m[2]].map(x => parseInt(x).toString(16).padStart(2,'0')).join('');
}

function showObjFontCtrl(el, e) {
  if (e.target.closest('.li-move-btns')) return;

  if (e.ctrlKey) {
    if (_selected && _selected !== el) deselectObj();
    _toggleMultiSel(el);
    return;
  }

  _clearMultiSel();
  selectObj(el);
  _fontTarget = el;
  const rect = el.getBoundingClientRect();
  const cs   = getComputedStyle(el);
  const ctrl = document.getElementById('obj-font-ctrl');

  document.getElementById('obj-font-label').textContent =
    (el.className ? el.className.split(' ').filter(c => c && !['drag-handle','selected','dragging'].includes(c))[0] : '') || el.tagName.toLowerCase();

  document.getElementById('obj-font-input').value = Math.round(parseFloat(cs.fontSize));

  document.getElementById('obj-width-label').textContent =
    el.style.width ? el.style.width : Math.round(rect.width) + 'px';

  const bStyle  = el.style.borderStyle  || cs.borderLeftStyle  || 'none';
  const bWidth  = el.style.borderWidth  ? parseInt(el.style.borderWidth) : Math.round(parseFloat(cs.borderLeftWidth)) || 0;
  const bColorR = el.style.borderColor  || cs.borderLeftColor;
  const bRadius = el.style.borderRadius ? parseInt(el.style.borderRadius) : Math.round(parseFloat(cs.borderTopLeftRadius)) || 0;

  document.getElementById('obj-border-style').value  = bStyle || 'none';
  document.getElementById('obj-border-width').value  = bWidth;
  document.getElementById('obj-border-color').value  = _rgbToHex(bColorR);
  document.getElementById('obj-border-radius').value = bRadius;

  ctrl.style.display = 'flex';
  ctrl.style.left = Math.min(rect.left, window.innerWidth - 300) + 'px';
  ctrl.style.top  = Math.max(48, rect.top - 120) + 'px';
  _undoPushedForTarget = null;
}

function setObjBorder() {
  if (!_fontTarget) return;
  _ensureUndo();
  const style = document.getElementById('obj-border-style').value;
  const width = document.getElementById('obj-border-width').value;
  const color = document.getElementById('obj-border-color').value;
  if (style === 'none') {
    _fontTarget.style.border = 'none';
  } else {
    _fontTarget.style.border = width + 'px ' + style + ' ' + color;
  }
  _debouncedHistory('Viền: ' + (_fontTarget.className || _fontTarget.tagName).split(' ')[0]);
}

function setObjBorderRadius() {
  if (!_fontTarget) return;
  _ensureUndo();
  const r = document.getElementById('obj-border-radius').value;
  _fontTarget.style.borderRadius = r + 'px';
  _debouncedHistory('Bo góc: ' + (_fontTarget.className || _fontTarget.tagName).split(' ')[0]);
}

function adjustObjFont(delta) {
  if (!_fontTarget) return;
  _ensureUndo();
  const nv = Math.max(8, Math.min(120, Math.round(parseFloat(getComputedStyle(_fontTarget).fontSize)) + delta));
  _fontTarget.style.fontSize = nv + 'px';
  document.getElementById('obj-font-input').value = nv;
  _debouncedHistory('Cỡ chữ: ' + (_fontTarget.className || _fontTarget.tagName).split(' ')[0]);
}

function setObjFont(val) {
  if (!_fontTarget) return;
  _ensureUndo();
  const nv = Math.max(8, Math.min(120, parseInt(val) || 8));
  _fontTarget.style.fontSize = nv + 'px';
  _debouncedHistory('Cỡ chữ: ' + (_fontTarget.className || _fontTarget.tagName).split(' ')[0]);
}

function adjustObjWidth(delta) {
  if (!_fontTarget) return;
  _ensureUndo();
  const cur = _fontTarget.style.width
    ? parseInt(_fontTarget.style.width)
    : Math.round(_fontTarget.getBoundingClientRect().width);
  const nv = Math.max(80, cur + delta);
  _fontTarget.style.width = nv + 'px';
  document.getElementById('obj-width-label').textContent = nv + 'px';
  _debouncedHistory('Chiều rộng: ' + (_fontTarget.className || _fontTarget.tagName).split(' ')[0]);
}
