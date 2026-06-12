// ══════════════════════════════════
// KB PREVIEW – Preview mode + Split handle + Slide preview panel
// ══════════════════════════════════

/* ── Preview-mode: nhận lệnh từ cửa sổ cha qua postMessage ── */
if (window._PREVIEW_MODE) {
  function _revealGo(h, v) {
    function _go() { try { Reveal.slide(h, v); } catch(ex) {} }
    if (typeof Reveal !== 'undefined') { _go(); }
    else {
      var iv = setInterval(function() {
        if (typeof Reveal !== 'undefined') { clearInterval(iv); _go(); }
      }, 150);
    }
  }
  window.addEventListener('message', function(e) {
    var d = e.data;
    if (!d || d.type !== 'kb-preview') return;
    switch (d.cmd) {
      case 'reveal-goto': _revealGo(d.h || 0, d.v || 0); break;
      case 'setMode':     try { setMode(d.mode); }            catch(ex) {} break;
      case 'cqTab':       try { cq_switchTab(d.tab); }        catch(ex) {} break;
      case 'playground':  try { openPlayground(d.preset); }   catch(ex) {} break;
      case 'chonTab':     try { chon_switchTab(d.tab != null ? d.tab : 2); } catch(ex) {} break;
    }
  });
}

/* ── Cửa sổ CHA: nhận tin từ iframe Xem trước để sáng "slide đang ở" trong Mục lục ── */
if (!window._PREVIEW_MODE) {
  window.addEventListener('message', function(e) {
    var d = e.data;
    if (!d || d.type !== 'kb-preview-back') return;
    if (d.cmd === 'slidechanged' && typeof window._kbSyncSlide === 'function') {
      window._kbSyncSlide(d.h || 0, d.v || 0);
    }
  });
}

/* ── Panel toggle functions ── */
window.kbLeftToggle = function() {
  var panel = document.querySelector('.kb-left');
  var btn   = document.getElementById('kb-left-toggle-btn');
  if (!panel) return;
  var hiding = !panel.classList.contains('kbleft-hidden');
  panel.classList.toggle('kbleft-hidden', hiding);
  if (btn) btn.classList.toggle('active', !hiding);
};

window.kbScriptToggle = function() {
  var panel = document.querySelector('.kb-script-panel');
  var btn   = document.getElementById('kb-script-toggle-btn');
  if (!panel) return;
  var hiding = !panel.classList.contains('kbsp-hidden');
  panel.classList.toggle('kbsp-hidden', hiding);
  if (btn) btn.classList.toggle('active', !hiding);
};

/* ── Left handle drag (mục lục ↔ kịch bản) ── */
(function() {
  var LS_KEY = 'kb_left_panel_w';
  document.addEventListener('DOMContentLoaded', function() {
    var handle    = document.getElementById('kb-left-handle');
    var leftPanel = document.querySelector('.kb-left');
    var workspace = document.querySelector('.kb-workspace');
    if (!handle || !leftPanel || !workspace) return;

    var saved = parseInt(localStorage.getItem(LS_KEY));
    if (saved && saved > 120) leftPanel.style.width = saved + 'px';

    var dragging = false, startX = 0, startW = 0;

    handle.addEventListener('mousedown', function(e) {
      dragging = true;
      startX = e.clientX;
      startW = leftPanel.getBoundingClientRect().width;
      handle.classList.add('kblh-drag');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      var ifr = document.getElementById('kb-slide-iframe');
      if (ifr) ifr.style.pointerEvents = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      var wRect = workspace.getBoundingClientRect();
      var newW = startW + (e.clientX - startX);
      var minW = 120, maxW = wRect.width - 400;
      newW = Math.max(minW, Math.min(newW, maxW));
      leftPanel.style.width = newW + 'px';
    });

    document.addEventListener('mouseup', function() {
      if (!dragging) return;
      dragging = false;
      handle.classList.remove('kblh-drag');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      var ifr = document.getElementById('kb-slide-iframe');
      if (ifr) ifr.style.pointerEvents = '';
      var w = parseInt(leftPanel.style.width);
      if (w) localStorage.setItem(LS_KEY, w);
    });
  });
})();

/* ── Split Handle drag (kịch bản ↔ xem trước) ── */
(function() {
  var LS_KEY = 'kb_slide_panel_w';
  document.addEventListener('DOMContentLoaded', function() {
    var handle     = document.getElementById('kb-split-handle');
    var slidePanel = document.getElementById('kb-slide-panel');
    var workspace  = document.querySelector('.kb-workspace');
    if (!handle || !slidePanel || !workspace) return;

    var saved = parseInt(localStorage.getItem(LS_KEY));
    if (saved && saved > 180) slidePanel.style.width = saved + 'px';

    var dragging = false, startX = 0, startW = 0;

    handle.addEventListener('mousedown', function(e) {
      dragging = true;
      startX = e.clientX;
      startW = slidePanel.getBoundingClientRect().width;
      handle.classList.add('kbsh-drag');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      var ifr = document.getElementById('kb-slide-iframe');
      if (ifr) ifr.style.pointerEvents = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      var wRect = workspace.getBoundingClientRect();
      var newW = startW - (e.clientX - startX);
      var minW = 180, maxW = wRect.width - 480;
      newW = Math.max(minW, Math.min(newW, maxW));
      slidePanel.style.width = newW + 'px';
    });

    document.addEventListener('mouseup', function() {
      if (!dragging) return;
      dragging = false;
      handle.classList.remove('kbsh-drag');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      var ifr = document.getElementById('kb-slide-iframe');
      if (ifr) ifr.style.pointerEvents = '';
      var w = parseInt(slidePanel.style.width);
      if (w) localStorage.setItem(LS_KEY, w);
    });
  });
})();

/* ── Slide Preview Panel ── */
(function() {
  var _loaded = false;

  function _post(cmd, extra) {
    var ifr = document.getElementById('kb-slide-iframe');
    if (!ifr) return;
    try { ifr.contentWindow.postMessage(Object.assign({ type: 'kb-preview', cmd: cmd }, extra || {}), '*'); } catch(ex) {}
  }

  function _loadIframe(cb) {
    var ifr = document.getElementById('kb-slide-iframe');
    if (!ifr) return;
    if (_loaded) { if (cb) setTimeout(cb, 60); return; }
    _loaded = true;
    ifr.onload = function() {
      ifr.onload = null;
      setTimeout(function() { if (cb) cb(); }, 900);
    };
    ifr.src = location.href.replace(/[?#].*$/, '') + '?preview=1';
  }

  /* Đồng bộ toàn bộ trạng thái sang preview (slide + mode + tab/preset) */
  window.kbPreviewSync = function(s, origI) {
    if (!s) return;
    var panel = document.getElementById('kb-slide-panel');
    if (panel && panel.classList.contains('kbsp-hidden')) return;

    var info = document.getElementById('kb-slide-win-info');
    if (info) info.textContent = s.title || '';

    var hv = (typeof _TF_SLIDE_HV !== 'undefined') ? _TF_SLIDE_HV[origI] : null;
    var ph = hv ? hv[0] : (s.slide || 0), pv = hv ? hv[1] : 0;

    var modeMap = { slide: 'slides', cq: 'cq', code: 'code', chon: 'chon' };
    var mode = modeMap[s.action] || 'slides';

    _loadIframe(function() {
      _post('reveal-goto', { h: ph, v: pv });
      _post('setMode', { mode: mode });
      if (s.action === 'cq' && s.cqTab != null) {
        setTimeout(function() { _post('cqTab', { tab: s.cqTab }); }, 100);
      }
      if (s.action === 'code' && s.preset) {
        setTimeout(function() { _post('playground', { preset: s.preset }); }, 80);
      }
      if (s.action === 'chon') {
        setTimeout(function() { _post('chonTab', { tab: 2 }); }, 100);
      }
    });
  };

  /* Backward-compat */
  window.kbSlideWinGoTo = function(h, v, label) {
    var info = document.getElementById('kb-slide-win-info');
    if (info && label) info.textContent = label;
    var panel = document.getElementById('kb-slide-panel');
    if (panel && panel.classList.contains('kbsp-hidden')) return;
    _loadIframe(function() { _post('reveal-goto', { h: h || 0, v: v || 0 }); });
  };

  window.kbSlideWinToggle = function() {
    var panel  = document.getElementById('kb-slide-panel');
    var handle = document.getElementById('kb-split-handle');
    var btn    = document.getElementById('kb-slidewin-toggle-btn');
    if (!panel) return;
    var hiding = !panel.classList.contains('kbsp-hidden');
    panel.classList.toggle('kbsp-hidden', hiding);
    if (handle) handle.style.display = hiding ? 'none' : '';
    if (btn) btn.classList.toggle('active', !hiding);
    if (!hiding) _loadIframe(null);
  };

  /* Auto-load khi kịch bản overlay mở */
  document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('kichban-overlay');
    if (!overlay) return;
    new MutationObserver(function(muts) {
      muts.forEach(function(m) {
        if (m.attributeName === 'class' && overlay.classList.contains('active') && !_loaded)
          _loadIframe(null);
      });
    }).observe(overlay, { attributes: true });
  });
})();
