// ══════════════════════════════════
// SLIDE HISTORY (undo xóa slide, history panel)
// ══════════════════════════════════
const _slideHistory = [];   // [{html, label, slideCount, time}, ...]
const _MAX_HISTORY  = 20;

function _pushHistory(label) {
  const slidesEl = document.querySelector('.reveal .slides');
  if (!slidesEl) return;
  _slideHistory.push({
    html:       slidesEl.innerHTML,
    label:      label || 'Thay đổi',
    slideCount: Reveal.getTotalSlides(),
    time:       new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });
  if (_slideHistory.length > _MAX_HISTORY) _slideHistory.shift();
  _updateHistoryPanel();
}

function _restoreHistory(idx) {
  const snap = _slideHistory[idx];
  if (!snap) return;
  const slidesEl = document.querySelector('.reveal .slides');
  slidesEl.innerHTML = snap.html;
  slidesEl.querySelectorAll('pre code').forEach(b => { if (!b.dataset.raw) b.dataset.raw = b.textContent; });
  Reveal.sync();
  rebuildNavFromDOM();
  applyHighlight(document);
  // Nếu đang ở edit mode: khôi phục drag handles
  if (document.body.classList.contains('mode-edit')) {
    disableEditMode();
    enableEditMode();
  }
  _slideHistory.splice(idx);
  _updateHistoryPanel();
}

function _updateHistoryPanel() {
  const list  = document.getElementById('hp-list');
  const empty = document.getElementById('hp-empty');
  if (_slideHistory.length === 0) {
    if (empty) empty.style.display = '';
    // Remove existing entries
    list.querySelectorAll('.hp-entry').forEach(e => e.remove());
    return;
  }
  if (empty) empty.style.display = 'none';
  list.querySelectorAll('.hp-entry').forEach(e => e.remove());
  // Mới nhất ở trên
  for (let i = _slideHistory.length - 1; i >= 0; i--) {
    const snap = _slideHistory[i];
    const el   = document.createElement('div');
    el.className = 'hp-entry';
    el.innerHTML =
      '<div class="hp-entry-label">' + snap.label + '</div>' +
      '<div class="hp-entry-meta">' + snap.time + ' · ' + snap.slideCount + ' slide</div>' +
      '<span class="hp-restore">↩ Khôi phục về đây</span>';
    el.onclick = () => {
      if (confirm('Khôi phục về trạng thái: "' + snap.label + '" lúc ' + snap.time + '?')) {
        _restoreHistory(i);
      }
    };
    list.appendChild(el);
  }
}

function toggleHistoryPanel() {
  document.getElementById('history-panel').classList.toggle('hp-open');
}

// Ctrl+Z chỉ dùng undoEdit() — history panel dùng để khôi phục slide-level thủ công

// ══════════════════════════════════
// TOOLBAR TOGGLE — ẩn/hiện mode-bar
// ══════════════════════════════════
const _TB_LS_KEY = 'toolbar_hidden_' + _LID;

function toggleToolbar() {
  const hidden = document.body.classList.toggle('toolbar-hidden');
  try { localStorage.setItem(_TB_LS_KEY, hidden ? '1' : '0'); } catch(e) {}
  // Cho CSS transition xong rồi mới báo Reveal.js resize
  setTimeout(function () { try { Reveal.layout(); } catch(e) {} }, 240);
}

window.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem(_TB_LS_KEY) === '1')
    document.body.classList.add('toolbar-hidden');

  // Phím Ctrl+` để toggle
  document.addEventListener('keydown', function (e) {
    if (e.key === '`' && e.ctrlKey && !e.altKey && !e.metaKey) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      toggleToolbar();
    }
  });
}, { once: true });
