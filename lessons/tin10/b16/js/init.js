var LESSON_ID = 'b16';

function _slideHash(s) {
  var h = 5381, i = s.length;
  while (i) { h = (Math.imul(h, 33) ^ s.charCodeAt(--i)) >>> 0; }
  return h.toString(36);
}
window._slideHash = _slideHash;

window._SRC_SIG = {};
document.querySelectorAll('.reveal .slides > section').forEach(function(hSec, h) {
  var vSecs = hSec.querySelectorAll(':scope > section');
  if (vSecs.length === 0) { window._SRC_SIG[h+'-0'] = _slideHash(hSec.innerHTML); }
  else { vSecs.forEach(function(vSec, v) { window._SRC_SIG[h+'-'+v] = _slideHash(vSec.innerHTML); }); }
});

document.querySelectorAll('pre code').forEach(function(b) { b.dataset.raw = b.textContent; });
