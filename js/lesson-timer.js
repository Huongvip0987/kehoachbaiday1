// ══════════════════════════════════
// LESSON TIMER – đồng hồ 45 phút
// ══════════════════════════════════
const _LT_TOTAL = 45 * 60;
let _ltRemaining = _LT_TOTAL;
let _ltRunning   = false;
let _ltInterval  = null;

function ltFmt(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function ltUpdateUI() {
  const done = _ltRemaining <= 0;
  const txt  = done ? 'Hết giờ!' : ltFmt(_ltRemaining);
  const cls  = done ? 'lt-danger' : _ltRemaining <= 300 ? 'lt-danger' : _ltRemaining <= 600 ? 'lt-warning' : '';
  const pct  = (((_LT_TOTAL - _ltRemaining) / _LT_TOTAL) * 100).toFixed(2);

  // Panel display
  const d1 = document.getElementById('sp-timer-display');
  if (d1) { d1.textContent = txt; d1.className = cls; }

  // Mode-bar display
  const d2 = document.getElementById('lt-display');
  if (d2) d2.textContent = done ? 'Hết giờ!' : ltFmt(_ltRemaining);
  const mb = document.getElementById('lesson-timer');
  if (mb) {
    mb.classList.toggle('lt-warning', cls === 'lt-warning');
    mb.classList.toggle('lt-danger',  cls === 'lt-danger');
  }

  // Progress bar
  const bar = document.getElementById('lt-bar');
  if (bar) {
    bar.style.width = pct + '%';
    bar.style.background = cls === 'lt-danger' ? '#f44336' : cls === 'lt-warning' ? '#ff9800' : '#4fc3f7';
  }
}

function ltStart() {
  if (_ltInterval) return;            // đã chạy
  if (_ltRemaining <= 0) { _ltRemaining = _LT_TOTAL; ltUpdateUI(); }
  _ltRunning = true;
  document.getElementById('lesson-timer')?.classList.add('lt-running');
  const sb = document.getElementById('sp-timer-start');
  if (sb) { sb.textContent = '⏸'; sb.title = 'Tạm dừng'; }
  _ltInterval = setInterval(function () {
    if (_ltRemaining > 0) {
      _ltRemaining--;
      ltUpdateUI();
    } else {
      ltStop();
      ltUpdateUI();
    }
  }, 1000);
}

function ltStop() {
  if (_ltInterval) { clearInterval(_ltInterval); _ltInterval = null; }
  _ltRunning = false;
  const sb = document.getElementById('sp-timer-start');
  if (sb) { sb.textContent = '▶'; sb.title = 'Bắt đầu'; }
}

function ltToggle() {
  if (_ltRunning) ltStop(); else ltStart();
}

function ltReset() {
  ltStop();
  _ltRemaining = _LT_TOTAL;
  document.getElementById('lesson-timer')?.classList.remove('lt-running', 'lt-warning', 'lt-danger');
  ltUpdateUI();
}
