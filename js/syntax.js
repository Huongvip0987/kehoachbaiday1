// ══════════════════════════════════
// SYNTAX HIGHLIGHTING (VSCode Dark+)
// ══════════════════════════════════
const _PY_KW = new Set([
  'False','None','True','and','as','assert','async','await',
  'break','class','continue','def','del','elif','else','except',
  'finally','for','from','global','if','import','in','is',
  'lambda','nonlocal','not','or','pass','raise','return',
  'try','while','with','yield'
]);
const _PY_BUILTINS = new Set([
  'print','len','range','round','int','float','str','input',
  'type','abs','max','min','sum','list','dict','set','tuple',
  'bool','chr','ord','hex','bin','oct','repr','format',
  'enumerate','zip','map','filter','sorted','reversed','open',
  'super','isinstance','issubclass','hasattr','getattr','setattr',
  'id','hash','vars','dir','callable','any','all','next','iter'
]);

function highlightPython(line) {
  if (!line.trim()) return ' ';
  let s = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Tách comment (tránh nhầm # trong string)
  let cmtIdx = -1, inStr = false, strChar = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!inStr && (c==='"'||c==="'")) { inStr=true; strChar=c; }
    else if (inStr && c===strChar) { inStr=false; }
    else if (!inStr && c==='#') { cmtIdx=i; break; }
  }
  let suffix = '';
  if (cmtIdx >= 0) {
    suffix = '<span class="tk-cmt">' + s.slice(cmtIdx) + '</span>';
    s = s.slice(0, cmtIdx);
  }
  s = s.replace(/(^|\s)(@[a-zA-Z_]\w*)/g, '$1<span class="tk-dec">$2</span>');
  s = s.replace(/"([^"]*)"/g, '<span class="tk-str">"$1"</span>');
  s = s.replace(/'([^']*)'/g, "<span class='tk-str'>'$1'</span>");
  // Dùng alternation để bỏ qua HTML tags đã chèn ở bước trên
  s = s.replace(/(<[^>]+>)|(\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+\.?\d*)\b)/g,
    (_, tag, num) => tag || '<span class="tk-num">' + num + '</span>');
  s = s.replace(/(<[^>]+>)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)/g, (_, tag, id) => {
    if (tag) return tag;
    if (_PY_KW.has(id)) return '<span class="tk-kw">' + id + '</span>';
    if (_PY_BUILTINS.has(id)) return '<span class="tk-fn">' + id + '</span>';
    return id;
  });
  return s + suffix;
}

function applyHighlight(root) {
  const ctx = root || document;
  ctx.querySelectorAll('pre code').forEach(block => {
    // Ưu tiên data-raw (không bị ảnh hưởng bởi saved edits hay old broken HTML)
    const raw = block.dataset.raw || block.textContent;
    block.innerHTML = raw.split('\n').map(highlightPython).join('\n');
  });
  ctx.querySelectorAll('code:not(pre code)').forEach(el => {
    const st = el.getAttribute('style') || '';
    if (st.includes('f87171') || st.includes('4caf50')) return;
    const text = el.textContent.trim();
    if (!text || text.length < 2) return;
    el.innerHTML = text.split('\n').map(highlightPython).join('\n');
    el.style.removeProperty('color');
  });
}

// ══════════════════════════════════
// CODE DISPLAY (replaces Monaco)
// ══════════════════════════════════

function renderCodeDisplay(key) {
  const demo = _pgGetDemos()[key];
  if (!demo) return;
  const lines = demo.code.split('\n');
  const container = document.getElementById('code-display');
  container.innerHTML = lines.map((l, i) =>
    '<div class="code-line" data-line="' + i + '">' +
    '<span class="ln">' + (i + 1) + '</span>' +
    '<span class="lc">' + highlightPython(l) + '</span>' +
    '</div>'
  ).join('');
}

function highlightCodeLine(lineNum) {
  document.querySelectorAll('#code-display .code-line').forEach(el => el.classList.remove('active'));
  const el = document.querySelector('#code-display [data-line="' + lineNum + '"]');
  if (el) { el.classList.add('active'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
}

