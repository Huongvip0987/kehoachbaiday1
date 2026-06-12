// ══════════════════════════════════
// EDIT MODE – UNDO / REDO / CLIPBOARD / SAVE
// ══════════════════════════════════
const _undoStack = [], _redoStack = [];
let _clipboard = null;
let _undoPushedForTarget = null;

function _pushUndo() {
  const sec = Reveal.getCurrentSlide();
  if (!sec) return;
  _undoStack.push(sec.innerHTML);
  if (_undoStack.length > 40) _undoStack.shift();
  _redoStack.length = 0;
}

function _ensureUndo() {
  if (_fontTarget && _undoPushedForTarget !== _fontTarget) {
    _pushUndo();
    _undoPushedForTarget = _fontTarget;
  }
}

let _histDbt;
function _debouncedHistory(label) {
  clearTimeout(_histDbt);
  _histDbt = setTimeout(() => { _pushHistory(label); }, 700);
}

function _restoreSlide(html) {
  const sec = Reveal.getCurrentSlide();
  if (!sec) return;
  sec.innerHTML = html;
  disableEditMode();
  enableEditMode();
  deselectObj();
}

function undoEdit() {
  if (!_undoStack.length) return;
  const sec = Reveal.getCurrentSlide();
  if (!sec) return;
  _redoStack.push(sec.innerHTML);
  _restoreSlide(_undoStack.pop());
  _showEditToast('↩ Hoàn tác');
}

function redoEdit() {
  if (!_redoStack.length) return;
  const sec = Reveal.getCurrentSlide();
  if (!sec) return;
  _undoStack.push(sec.innerHTML);
  _restoreSlide(_redoStack.pop());
  _showEditToast('↪ Làm lại');
}

function copySelected() {
  if (!_selected) return;
  _clipboard = _selected.outerHTML;
  _showEditToast('📋 Đã sao chép');
}

function pasteSelected() {
  if (!_clipboard) return;
  _pushUndo();
  const sec = Reveal.getCurrentSlide();
  if (!sec) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = _clipboard;
  const clone = tmp.firstElementChild;
  if (!clone) return;
  const m = (clone.style.transform || '').match(/translate\(([^,]+),([^)]+)\)/);
  const bx = m ? parseFloat(m[1]) + 20 : 20;
  const by = m ? parseFloat(m[2]) + 20 : 20;
  clone.style.transform = `translate(${bx}px,${by}px)`;
  sec.appendChild(clone);
  if (document.body.classList.contains('mode-edit')) {
    clone.classList.add('drag-handle');
    clone._dragMD = dragStart.bind(null, clone);
    clone.addEventListener('mousedown', clone._dragMD);
    clone._fontClick = showObjFontCtrl.bind(null, clone);
    clone.addEventListener('click', clone._fontClick);
    clone._dblEdit = () => { clone.setAttribute('contenteditable','true'); clone.focus(); };
    clone.addEventListener('dblclick', clone._dblEdit);
  }
  _showEditToast('📌 Đã dán');
}

function deleteSelected() {
  if (!_selected) return;
  _pushUndo();
  _selected.remove();
  deselectObj();
  _showEditToast('🗑 Đã xóa');
}

function _showEditToast(msg) {
  const t = document.getElementById('edit-toast');
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._tid);
  t._tid = setTimeout(() => { t.style.opacity = '0'; t.textContent = '✅ Đã lưu!'; }, 1400);
}

// ── Keyboard shortcuts ──
function _editKeydown(e) {
  if (!document.body.classList.contains('mode-edit')) return;
  if (document.activeElement && document.activeElement.isContentEditable) {
    if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undoEdit(); }
    if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redoEdit(); }
    return;
  }
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undoEdit(); }
  if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redoEdit(); }
  if (e.ctrlKey && e.key === 'c') { e.preventDefault(); copySelected(); }
  if (e.ctrlKey && e.key === 'v') { e.preventDefault(); pasteSelected(); }
  if (e.ctrlKey && e.key === 'x') { e.preventDefault(); copySelected(); deleteSelected(); }
  if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) { e.preventDefault(); toggleMoveMode(); }
  if ((e.key === 'Delete') && _selected) { e.preventDefault(); deleteSelected(); }
}
document.addEventListener('keydown', _editKeydown);

// ── Toolbar helpers ──
function changeFontSizeEl(delta) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const el = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
  el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) + delta) + 'px';
}

function execEditCmd(cmd) { document.execCommand(cmd); }

function deleteCurrentEl() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const node = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
  const el = node.closest('p,li,h1,h2,h3');
  if (el) el.remove();
}

function moveLi(btn, dir) {
  const li = btn.closest('li'), ul = li.parentElement;
  if (dir === -1 && li.previousElementSibling) ul.insertBefore(li, li.previousElementSibling);
  else if (dir === 1 && li.nextElementSibling) ul.insertBefore(li.nextElementSibling, li);
}

function resetTransforms() {
  document.querySelectorAll('.drag-handle').forEach(el => el.style.transform = '');
}

// ── Save / Reset ──
function saveEdits() {
  const data = {};
  const sig = window._SRC_SIG || {};
  // Mỗi slide lưu { html, src }: html = nội dung hiện tại, src = vân tay nguồn lúc lưu.
  // Khi load, nếu vân tay nguồn đổi (AI đã sửa slide đó) thì bỏ bản lưu này.
  document.querySelectorAll('.reveal .slides > section').forEach((hSec, h) => {
    const vSecs = hSec.querySelectorAll(':scope > section');
    if (vSecs.length === 0) {
      data[h + '-0'] = { html: hSec.innerHTML, src: sig[h + '-0'] || '' };
    } else {
      vSecs.forEach((vSec, v) => {
        data[h + '-' + v] = { html: vSec.innerHTML, src: sig[h + '-' + v] || '' };
      });
    }
  });
  localStorage.setItem('slide_edits_' + _LID, JSON.stringify(data));
  localStorage.setItem('slide_fonts_' + _LID, JSON.stringify(slideFontSizes));
  const t = document.getElementById('edit-toast');
  t.style.opacity = '1'; setTimeout(() => { t.style.opacity = '0'; }, 2000);
}

function resetEdits() {
  if (confirm('Xóa toàn bộ chỉnh sửa đã lưu và tải lại trang?')) {
    localStorage.removeItem('slide_edits_' + _LID);
    localStorage.removeItem('slide_edits_' + _LID + '_ver');
    localStorage.removeItem('slide_fonts_' + _LID);
    location.reload();
  }
}

function deleteCurrentSlide() {
  const total = Reveal.getTotalSlides();
  if (total <= 1) { alert('Không thể xóa slide duy nhất.'); return; }
  const { h, v } = Reveal.getIndices();
  const slide = Reveal.getSlide(h, v);
  if (!slide) return;
  if (!confirm('Xóa slide ' + (h + 1) + '.' + v + ' này?\n(Ctrl+Z hoặc 📋 Lịch sử để khôi phục.)')) return;

  const slideLabel = slide.querySelector('h2,h1')?.textContent?.trim() || ('slide ' + h + '.' + v);
  _pushHistory('Xóa: ' + slideLabel);

  const parent = slide.parentElement;
  slide.remove();

  if (parent.querySelectorAll(':scope > section').length === 0) {
    parent.remove();
  }

  Reveal.sync();

  const newH = Math.max(0, Reveal.getIndices().h);
  Reveal.slide(newH, 0);

  rebuildNavFromDOM();
}
