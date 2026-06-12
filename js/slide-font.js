// ══════════════════════════════════
// SLIDE FONT SIZE CONTROL (per-slide)
// ══════════════════════════════════
const DEFAULT_FONT_SIZE = 28;
let slideFontSizes = {};

function _slideKey() {
  const { h, v } = Reveal.getIndices();
  return `${h}-${v ?? 0}`;
}

function _currentSize() {
  return slideFontSizes[_slideKey()] ?? DEFAULT_FONT_SIZE;
}

function _applyFontSize(key, size) {
  const [h, v] = key.split('-').map(Number);
  const slide = Reveal.getSlide(h, v);
  if (slide) slide.style.fontSize = size + 'px';
  document.getElementById('font-size-label').value = size;
  Reveal.layout();
}

function adjustFontSize(delta) {
  const key = _slideKey();
  const next = Math.max(14, Math.min(120, _currentSize() + delta));
  slideFontSizes[key] = next;
  _applyFontSize(key, next);
}

function resetFontSize() {
  const key = _slideKey();
  slideFontSizes[key] = DEFAULT_FONT_SIZE;
  _applyFontSize(key, DEFAULT_FONT_SIZE);
}

function setFontSizeDirect(val) {
  const n = Math.round(parseFloat(val));
  if (isNaN(n) || n < 14 || n > 120) return;
  const key = _slideKey();
  slideFontSizes[key] = n;
  _applyFontSize(key, n);
}
