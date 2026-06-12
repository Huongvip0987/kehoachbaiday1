(function () {
  var MIN_W = 200;           // chiều rộng tối thiểu (px)
  var MAX_W = 640;           // chiều rộng tối đa (px)
  var LS_KEY = 'sp_w';       // localStorage key
  var root = document.documentElement;
  var dragging = false;

  /* Áp chiều rộng lên biến CSS */
  function applyW(w) {
    w = Math.max(MIN_W, Math.min(MAX_W, Math.round(w)));
    root.style.setProperty('--sp-w', w + 'px');
    return w;
  }

  /* Lưu sau khi kéo xong */
  function saveW(w) {
    try { localStorage.setItem(LS_KEY, String(w)); } catch (_) {}
  }

  /* Khôi phục chiều rộng đã lưu (chạy ngay khi script load) */
  try {
    var saved = parseInt(localStorage.getItem(LS_KEY) || '', 10);
    if (saved >= MIN_W && saved <= MAX_W) applyW(saved);
  } catch (_) {}

  /* Gắn sự kiện sau khi DOM sẵn sàng */
  document.addEventListener('DOMContentLoaded', function () {
    var handle = document.getElementById('sp-resize-handle');
    if (!handle) return;

    /* ── Mouse ── */
    handle.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;   // chỉ chuột trái
      e.preventDefault();
      dragging = true;
      document.body.classList.add('sp-resizing');
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      applyW(window.innerWidth - e.clientX);
    });

    document.addEventListener('mouseup', function (e) {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove('sp-resizing');
      var w = parseInt(root.style.getPropertyValue('--sp-w') || '284', 10);
      saveW(w);
    });

    /* ── Touch (tablet / màn hình cảm ứng) ── */
    handle.addEventListener('touchstart', function (e) {
      e.preventDefault();
      dragging = true;
      document.body.classList.add('sp-resizing');
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      applyW(window.innerWidth - e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove('sp-resizing');
      var w = parseInt(root.style.getPropertyValue('--sp-w') || '284', 10);
      saveW(w);
    });
  });
}());
