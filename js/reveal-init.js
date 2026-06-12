// ══════════════════════════════════
// REVEAL.JS INIT
// ══════════════════════════════════
var _isPreview = !!window._PREVIEW_MODE;

Reveal.initialize({
  hash: !_isPreview,
  transition: 'convex',
  transitionSpeed: 'default',
  backgroundTransition: 'fade',
  controls: !_isPreview,
  navigationMode: 'linear',
  progress: !_isPreview,
  center: false,
  /* Preview: kích thước cố định → Reveal tự scale xuống đúng tỉ lệ.
     Main:    100%/100% → lấp đầy cửa sổ không có letterbox. */
  width:    _isPreview ? 1280   : '100%',
  height:   _isPreview ? 720    : '100%',
  margin:   _isPreview ? 0.04   : 0,
  minScale: 0.1,
  maxScale: _isPreview ? 1      : 2,
  slideNumber: _isPreview ? false : 'c/t',
  plugins: []
});

/* Đồng bộ preview panel khi chuyển slide (chỉ ở cửa sổ chính) */
if (!_isPreview) {
  Reveal.on('slidechanged', function (event) {
    try {
      window.kbSlideWinGoTo && kbSlideWinGoTo(event.indexh, event.indexv);
    } catch (e) {}
  });
} else {
  /* Iframe Xem trước: báo ngược cho cửa sổ cha biết slide đang chiếu,
     để Mục lục (kịch bản) sáng đúng "slide đang ở" dù điều hướng trong khung này. */
  Reveal.on('slidechanged', function (event) {
    try {
      window.parent && window.parent.postMessage(
        { type: 'kb-preview-back', cmd: 'slidechanged', h: event.indexh, v: event.indexv }, '*');
    } catch (e) {}
  });
}

