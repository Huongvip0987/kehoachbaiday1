// ══════════════════════════════════════════════
// CHE / HIỆN ĐÁP ÁN THEO TỪNG CÂU – luyện tập trên slide
// • Mỗi câu có nút 👁 riêng → bấm để hiện/ẩn đáp án của riêng câu đó.
// • Nút "Hiện tất cả" / "Ẩn tất cả" tác động toàn slide.
// ══════════════════════════════════════════════

// Nút 👁 của từng câu.
function pqEye(btn) {
  const item = btn.closest('.pq-item');
  if (!item) return;
  const on = item.classList.toggle('pq-on');
  btn.textContent = on ? '🙈' : '👁';
}
window.pqEye = pqEye;

// Hiện/ẩn toàn bộ câu trong một phạm vi (slide hoặc khối practice-quiz).
function _pqSetAll(scope, on) {
  if (!scope || !scope.querySelectorAll) return;
  scope.querySelectorAll('.pq-item').forEach(function (it) {
    it.classList.toggle('pq-on', on);
    const eye = it.querySelector('.pq-eye');
    if (eye) eye.textContent = on ? '🙈' : '👁';
  });
}

function pqShowAll(btn) { const box = btn.closest('.practice-quiz'); if (box) _pqSetAll(box, true); }
function pqReset(btn)   { const box = btn.closest('.practice-quiz'); if (box) _pqSetAll(box, false); }
window.pqShowAll = pqShowAll;
window.pqReset = pqReset;

// Rời slide nào thì ẩn lại đáp án ở slide đó → lần sau vào học sinh tự trả lời trước.
(function () {
  if (typeof Reveal !== 'undefined' && Reveal.on) {
    Reveal.on('slidechanged', function (e) {
      if (e && e.previousSlide) _pqSetAll(e.previousSlide, false);
    });
  }
})();
