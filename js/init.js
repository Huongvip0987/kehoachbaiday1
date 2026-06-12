// ── Lesson ID: để shared JS dùng đúng localStorage key ──
var LESSON_ID = 'b17';

// ── Vân tay (hash) HTML gốc từng slide ──
// Mục đích: lưu chỉnh sửa của người dùng theo TỪNG slide, nhưng vẫn cho phép AI
// cập nhật slide. Khi load, slide nào có vân tay nguồn KHỚP với lúc lưu → dùng bản
// người dùng; slide nào AI đã sửa (vân tay khác) → tự bỏ bản lưu cũ, hiện bản mới.
// Nhờ vậy KHÔNG cần xóa sạch toàn bộ chỉnh sửa mỗi khi AI sửa một slide.
function _slideHash(s) {
  var h = 5381, i = s.length;
  while (i) { h = (Math.imul(h, 33) ^ s.charCodeAt(--i)) >>> 0; }
  return h.toString(36);
}
window._slideHash = _slideHash;

// Chụp vân tay nguồn NGAY khi tải, trước khi tô màu code / khôi phục bản lưu.
window._SRC_SIG = {};
document.querySelectorAll('.reveal .slides > section').forEach(function (hSec, h) {
  var vSecs = hSec.querySelectorAll(':scope > section');
  if (vSecs.length === 0) {
    window._SRC_SIG[h + '-0'] = _slideHash(hSec.innerHTML);
  } else {
    vSecs.forEach(function (vSec, v) { window._SRC_SIG[h + '-' + v] = _slideHash(vSec.innerHTML); });
  }
});

// Cache raw Python code trước khi bất kỳ thứ gì ghi đè (saved edits, Reveal.js, v.v.)
document.querySelectorAll('pre code').forEach(function (b) {
  b.dataset.raw = b.textContent;
});
