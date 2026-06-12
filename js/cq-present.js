// ══════════════════════════════════════════════════════════════
// CÂU HỎI – TRÌNH CHIẾU TOÀN MÀN HÌNH + CHẾ ĐỘ TƯƠNG TÁC
// ══════════════════════════════════════════════════════════════

let _cqpCurrentType = 'mc';
let _cqpInteractive = false;
let _cqpCountTimer  = null;
window._cqpResolve  = null;

// ── Fullscreen present ──
function cq_presentEmpty() {
  const badge = document.getElementById('cqp-type-badge');
  if (badge) { badge.className = ''; badge.textContent = ''; }
  const tag = document.getElementById('cqp-tag');
  if (tag) tag.textContent = '';
  const qEl = document.getElementById('cqp-q');
  if (qEl) qEl.textContent = 'Bước này chưa có câu hỏi được gán.';
  const optsEl = document.getElementById('cqp-opts');
  if (optsEl) { optsEl.innerHTML = ''; optsEl.style.display = 'none'; }
  ['cqp-tl-answer','cqp-fill-answers','cqp-match-body','cqp-explain','cqp-student-msg']
    .forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = ''; });
  document.getElementById('cq-present')?.classList.add('active');
}

function cq_present(id) {
  const data = cq_getData();
  const q    = data.questions.find(q => q.id === id);
  if (!q) return;
  const cat  = CQ_CATS.find(c => c.id === q.cat);
  const qt   = q.type || 'mc';
  _cqpCurrentType = qt;

  const BADGE_INFO = {
    mc:    { cls:'badge-mc',    txt:'📋 TRẮC NGHIỆM' },
    tl:    { cls:'badge-tl',    txt:'✍️ TỰ LUẬN' },
    fill:  { cls:'badge-fill',  txt:'📝 ĐIỀN CHỖ TRỐNG' },
    match: { cls:'badge-match', txt:'🔗 NỐI TỪ' }
  };
  const bi = BADGE_INFO[qt] || BADGE_INFO.mc;
  const badge = document.getElementById('cqp-type-badge');
  badge.className   = bi.cls;
  badge.textContent = bi.txt;

  document.getElementById('cqp-tag').textContent = cat ? cat.label : '';

  const qEl = document.getElementById('cqp-q');
  if (qt === 'fill') {
    qEl.innerHTML = `<div class="cqp-fill-q">${cq_escHtml(q.q).replace(/___/g,'<span class="cqp-blank">___</span>')}</div>`;
  } else {
    qEl.textContent = q.q;
  }

  // MC options
  const optsEl = document.getElementById('cqp-opts');
  optsEl.innerHTML = ''; optsEl.classList.remove('revealed');
  optsEl.style.display = (qt !== 'tl' && qt !== 'fill' && qt !== 'match') ? '' : 'none';
  if (qt === 'mc') {
    (q.opts || []).forEach((opt, i) => {
      const div = document.createElement('div');
      div.className      = 'cqp-opt';
      div.dataset.correct = (i === q.ans) ? '1' : '0';
      div.innerHTML = `<span class="cqp-opt-label">${CQ_LABELS[i]}</span><span class="cqp-opt-text">${cq_escHtml(opt)}</span>`;
      optsEl.appendChild(div);
    });
  }

  // TL answer
  const tlEl = document.getElementById('cqp-tl-answer');
  tlEl.textContent = qt === 'tl' ? (q.explain || '') : '';
  tlEl.className   = '';
  tlEl.style.display = qt === 'tl' ? '' : 'none';

  // Fill answers
  const fillAnsEl = document.getElementById('cqp-fill-answers');
  if (fillAnsEl) {
    fillAnsEl.innerHTML = ''; fillAnsEl.classList.remove('cqp-vis');
    fillAnsEl.style.display = qt === 'fill' ? '' : 'none';
    if (qt === 'fill' && q.blanks) {
      q.blanks.forEach((b, i) => {
        const row = document.createElement('div');
        row.className = 'cqp-fill-ans-item';
        row.innerHTML = `<span class="cqp-fill-ans-num">${i+1}</span><span class="cqp-fill-ans-val">${cq_escHtml(b)}</span>`;
        fillAnsEl.appendChild(row);
      });
    }
  }

  // Match body
  const matchBodyEl = document.getElementById('cqp-match-body');
  if (matchBodyEl) {
    matchBodyEl.innerHTML = ''; matchBodyEl.classList.remove('cqp-vis');
    matchBodyEl.style.display = qt === 'match' ? '' : 'none';
    if (qt === 'match' && q.pairs && q.pairs.length) {
      const leftItems  = q.pairs.map((p,i) => `<div class="cqp-match-item"><span class="cqp-match-lbl">${i+1}</span>${cq_escHtml(p.a)}</div>`).join('');
      const rightItems = q.pairs.map((p,i) => `<div class="cqp-match-item"><span class="cqp-match-lbl">${String.fromCharCode(65+i)}</span>${cq_escHtml(p.b)}</div>`).join('');
      const ansTxt     = q.pairs.map((_,i) => `${i+1} → ${String.fromCharCode(65+i)}`).join('  ·  ');
      matchBodyEl.innerHTML = `
        <div class="cqp-match-grid">
          <div><div class="cqp-match-col-hdr">Cột A</div>${leftItems}</div>
          <div><div class="cqp-match-col-hdr">Cột B</div>${rightItems}</div>
        </div>
        <div class="cqp-match-ans-bar">${ansTxt}</div>`;
    }
  }

  // Explain (MC only)
  const expEl = document.getElementById('cqp-explain');
  expEl.textContent = qt === 'mc' ? (q.explain || '') : '';
  expEl.style.display = 'none';

  const ANS_BTN = { mc:'💡 Xem đáp án', tl:'📖 Xem đáp án gợi ý', fill:'📝 Xem đáp án', match:'🔗 Xem đáp án' };
  const ANS_CLR = { mc:'#2ecc71', tl:'#ff9800', fill:'#64dcb4', match:'#ffd43b' };
  const ansBtn = document.getElementById('cqp-ans-btn');
  ansBtn.textContent       = ANS_BTN[qt] || '💡 Xem đáp án';
  ansBtn.style.borderColor = ANS_CLR[qt] || '#2ecc71';
  ansBtn.style.color       = ANS_CLR[qt] || '#2ecc71';
  ansBtn.style.display = '';
  document.getElementById('cqp-next-btn').style.display = 'none';
  const smsg = document.getElementById('cqp-student-msg');
  if (smsg) { smsg.textContent = ''; smsg.className = ''; smsg.style.display = 'none'; }

  const _counter = document.getElementById('cqp-step-counter');
  if (_counter && typeof window._kbTFStep !== 'undefined') {
    const _total = (typeof TEACHING_STEPS !== 'undefined') ? TEACHING_STEPS.length : 35;
    _counter.textContent = `Bước ${window._kbTFStep + 1} / ${_total}`;
  }
  document.getElementById('cq-present').classList.add('active');
  document.getElementById('cq-present').classList.remove('cqp-interactive');
}

function cq_presToggleAns() {
  const btn    = document.getElementById('cqp-ans-btn');
  const ANS_OFF = { mc:'💡 Xem đáp án', tl:'📖 Xem đáp án gợi ý', fill:'📝 Xem đáp án', match:'🔗 Xem đáp án' };

  if (_cqpCurrentType === 'tl') {
    const tlEl = document.getElementById('cqp-tl-answer');
    const showing = tlEl.classList.toggle('cqp-vis');
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : ANS_OFF.tl;

  } else if (_cqpCurrentType === 'fill') {
    const fillEl = document.getElementById('cqp-fill-answers');
    if (fillEl) {
      const showing = fillEl.classList.toggle('cqp-vis');
      if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : ANS_OFF.fill;
    }

  } else if (_cqpCurrentType === 'match') {
    const matchBody = document.getElementById('cqp-match-body');
    const ansBar    = matchBody && matchBody.querySelector('.cqp-match-ans-bar');
    if (ansBar) {
      const showing = ansBar.classList.toggle('cqp-vis');
      if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : ANS_OFF.match;
    }

  } else {
    const optsEl = document.getElementById('cqp-opts');
    const expEl  = document.getElementById('cqp-explain');
    const showing = optsEl.classList.toggle('revealed');
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : ANS_OFF.mc;
    if (expEl) expEl.style.display = (showing && expEl.textContent) ? 'block' : 'none';
  }
}

function cq_presClose() {
  _cqpInteractiveCancel();
  document.getElementById('cq-present').classList.remove('active');
  document.getElementById('cq-present').classList.remove('cqp-interactive');
}

function cq_presGoToLibrary() {
  document.getElementById('cq-present')?.classList.remove('active');
  setMode('cq');
}

function cq_presNav(dir) {
  document.getElementById('cq-present')?.classList.remove('active');
  const cur   = (typeof window._kbTFStep !== 'undefined') ? window._kbTFStep : 0;
  const total = (typeof TEACHING_STEPS   !== 'undefined') ? TEACHING_STEPS.length : 35;
  const next  = cur + dir;
  if (next < 0 || next >= total) return;
  try { tf_goTo(next); }  catch(e) {}
  try { tf_execute(); }   catch(e) {}
}

function cq_presNextAuto() {
  _cqpInteractiveCancel();
  document.getElementById('cq-present').classList.remove('active');
  document.getElementById('cq-present').classList.remove('cqp-interactive');
  if (window._cqpResolve) { const r = window._cqpResolve; window._cqpResolve = null; r(); }
}

// ── Interactive mode (auto-teach với đếm ngược) ──
function _cqpInteractiveCancel() {
  clearInterval(_cqpCountTimer);
  _cqpCountTimer  = null;
  _cqpInteractive = false;
  const ring = document.getElementById('cqp-countdown-ring');
  if (ring) ring.classList.add('cqp-hidden');
  const msg = document.getElementById('cqp-student-msg');
  if (msg) msg.style.display = 'none';
  const nextBtn = document.getElementById('cqp-next-btn');
  if (nextBtn) nextBtn.style.display = 'none';
  const ansBtn = document.getElementById('cqp-ans-btn');
  if (ansBtn) ansBtn.style.display = '';
}

function cq_presentInteractive(id, secs) {
  secs = secs || 30;
  return new Promise(function(resolve) {
    const data = cq_getData();
    const q = data.questions.find(function(x){ return x.id === id; });
    if (!q) { resolve(); return; }
    const cat   = CQ_CATS.find(function(c){ return c.id === q.cat; });
    const qt    = q.type || 'mc';
    const isMC  = qt === 'mc';
    _cqpCurrentType = qt;

    const BADGE_IA  = { mc:'badge-mc', tl:'badge-tl', fill:'badge-fill', match:'badge-match' };
    const BADGE_TXT = { mc:'📋 TRẮC NGHIỆM', tl:'✍️ TỰ LUẬN', fill:'📝 ĐIỀN CHỖ TRỐNG', match:'🔗 NỐI TỪ' };
    const badge = document.getElementById('cqp-type-badge');
    badge.className   = BADGE_IA[qt]  || 'badge-mc';
    badge.textContent = BADGE_TXT[qt] || '📋 TRẮC NGHIỆM';

    document.getElementById('cqp-tag').textContent = cat ? cat.label + ' · ⏱ ' + secs + 's' : '⏱ ' + secs + 's';

    const qEl = document.getElementById('cqp-q');
    if (qt === 'fill') {
      qEl.innerHTML = '<div class="cqp-fill-q">' + cq_escHtml(q.q).replace(/___/g,'<span class="cqp-blank">___</span>') + '</div>';
    } else {
      qEl.textContent = q.q;
    }

    const optsEl = document.getElementById('cqp-opts');
    optsEl.innerHTML = ''; optsEl.classList.remove('revealed');
    optsEl.style.display = isMC ? '' : 'none';

    const tlEl = document.getElementById('cqp-tl-answer');
    tlEl.textContent = (qt === 'tl') ? (q.explain || '') : '';
    tlEl.className   = '';
    tlEl.style.display = (qt === 'tl') ? '' : 'none';

    const fillAnsElI = document.getElementById('cqp-fill-answers');
    if (fillAnsElI) {
      fillAnsElI.innerHTML = ''; fillAnsElI.classList.remove('cqp-vis');
      fillAnsElI.style.display = (qt === 'fill') ? '' : 'none';
      if (qt === 'fill' && q.blanks) {
        q.blanks.forEach(function(b,i) {
          const row = document.createElement('div'); row.className = 'cqp-fill-ans-item';
          row.innerHTML = '<span class="cqp-fill-ans-num">'+(i+1)+'</span><span class="cqp-fill-ans-val">'+cq_escHtml(b)+'</span>';
          fillAnsElI.appendChild(row);
        });
      }
    }

    const matchBodyElI = document.getElementById('cqp-match-body');
    if (matchBodyElI) {
      matchBodyElI.innerHTML = ''; matchBodyElI.classList.remove('cqp-vis');
      matchBodyElI.style.display = (qt === 'match') ? '' : 'none';
      if (qt === 'match' && q.pairs && q.pairs.length) {
        const lft = q.pairs.map(function(p,i){ return '<div class="cqp-match-item"><span class="cqp-match-lbl">'+(i+1)+'</span>'+cq_escHtml(p.a)+'</div>'; }).join('');
        const rgt = q.pairs.map(function(p,i){ return '<div class="cqp-match-item"><span class="cqp-match-lbl">'+String.fromCharCode(65+i)+'</span>'+cq_escHtml(p.b)+'</div>'; }).join('');
        const ans = q.pairs.map(function(_,i){ return (i+1)+' → '+String.fromCharCode(65+i); }).join('  ·  ');
        matchBodyElI.innerHTML = '<div class="cqp-match-grid"><div><div class="cqp-match-col-hdr">Cột A</div>'+lft+'</div><div><div class="cqp-match-col-hdr">Cột B</div>'+rgt+'</div></div><div class="cqp-match-ans-bar">'+ans+'</div>';
      }
    }

    if (isMC) {
      (q.opts || []).forEach(function(opt, i) {
        const div = document.createElement('div');
        div.className       = 'cqp-opt';
        div.dataset.correct = (i === q.ans) ? '1' : '0';
        div.dataset.idx     = i;
        div.innerHTML = '<span class="cqp-opt-label">' + CQ_LABELS[i] + '</span>' +
                        '<span class="cqp-opt-text">' + cq_escHtml(opt) + '</span>';
        div.addEventListener('click', function(){ _cqpHandleClick(i, q.ans); });
        optsEl.appendChild(div);
      });
    }

    const expEl = document.getElementById('cqp-explain');
    expEl.textContent = (qt !== 'tl') ? (q.explain || '') : '';
    expEl.style.display = 'none';

    const ansBtn = document.getElementById('cqp-ans-btn');
    ansBtn.textContent       = qt === 'tl' ? '📖 Xem đáp án gợi ý' : '💡 Xem đáp án';
    ansBtn.style.borderColor = qt === 'tl' ? '#ff9800' : '#2ecc71';
    ansBtn.style.color       = qt === 'tl' ? '#ff9800' : '#2ecc71';
    ansBtn.style.display     = 'none';
    document.getElementById('cqp-next-btn').style.display = 'none';

    const msg = document.getElementById('cqp-student-msg');
    msg.textContent = ''; msg.className = ''; msg.style.display = 'none';

    const ring  = document.getElementById('cqp-countdown-ring');
    const numEl = document.getElementById('cqp-countdown-num');
    ring.classList.remove('cqp-hidden');
    numEl.textContent    = secs;
    ring.style.boxShadow = '';
    ring.style.background = 'conic-gradient(#ffd43b 100%, #1e2a3a 100%)';

    document.getElementById('cq-present').classList.add('active', 'cqp-interactive');
    _cqpInteractive    = true;
    window._cqpResolve = resolve;

    let remaining = secs;
    _cqpCountTimer = setInterval(function() {
      remaining--;
      if (numEl) numEl.textContent = Math.max(0, remaining);
      const pct = (remaining / secs) * 100;
      ring.style.background = 'conic-gradient(#ffd43b ' + pct + '%, #1e2a3a ' + pct + '%)';
      if (remaining <= 5 && remaining > 0) ring.style.boxShadow = '0 0 22px rgba(255,152,0,0.6)';
      if (remaining <= 0) {
        clearInterval(_cqpCountTimer);
        _cqpCountTimer  = null;
        _cqpInteractive = false;
        document.getElementById('cq-present').classList.remove('cqp-interactive');
        ring.style.background = 'conic-gradient(#ff9800 0%, #1e2a3a 0%)';
        numEl.textContent = '0';
        const m = document.getElementById('cqp-student-msg');
        m.textContent = _cqpCurrentType === 'tl'
          ? '⏰ Hết giờ suy nghĩ! Mời xem đáp án gợi ý:'
          : '⏰ Hết giờ! Đây là đáp án đúng:';
        m.className = 'cqp-timeout'; m.style.display = 'block';
        cq_presToggleAns();
        document.getElementById('cqp-next-btn').style.display = '';
        setTimeout(function() {
          if (document.getElementById('cq-present').classList.contains('active')) {
            cq_presNextAuto();
          }
        }, 4000);
      }
    }, 1000);
  });
}

function _cqpHandleClick(chosenIdx, correctIdx) {
  if (!_cqpInteractive) return;
  clearInterval(_cqpCountTimer);
  _cqpCountTimer  = null;
  _cqpInteractive = false;
  document.getElementById('cq-present').classList.remove('cqp-interactive');

  const ring = document.getElementById('cqp-countdown-ring');
  ring.classList.add('cqp-hidden');

  const optsEl = document.getElementById('cqp-opts');
  optsEl.querySelectorAll('.cqp-opt').forEach(function(opt, i) {
    if (i === chosenIdx) {
      opt.classList.add(chosenIdx === correctIdx ? 'cqp-sel-correct' : 'cqp-sel-wrong');
    }
  });

  const msg = document.getElementById('cqp-student-msg');
  if (chosenIdx === correctIdx) {
    msg.textContent = '✅ Chính xác! Đáp án ' + CQ_LABELS[chosenIdx] + ' đúng rồi!';
    msg.className   = 'cqp-correct'; msg.style.display = 'block';
  } else {
    msg.textContent = '❌ Chưa đúng! Đáp án đúng là ' + CQ_LABELS[correctIdx];
    msg.className   = 'cqp-wrong'; msg.style.display = 'block';
  }

  setTimeout(function() {
    cq_presToggleAns();
    document.getElementById('cqp-next-btn').style.display = '';
    setTimeout(function() {
      if (document.getElementById('cq-present').classList.contains('active')) {
        cq_presNextAuto();
      }
    }, 4000);
  }, 1200);
}

// ── Toast nhỏ ──
function _cqToast(msg, ok) {
  let el = document.getElementById('cq-assign-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'cq-assign-toast';
    el.style.cssText = 'position:fixed;bottom:70px;left:50%;transform:translateX(-50%);'
      + 'padding:7px 18px;border-radius:20px;font-size:13px;font-weight:700;'
      + 'pointer-events:none;z-index:11000;transition:opacity .3s;opacity:0;white-space:nowrap;';
    document.body.appendChild(el);
  }
  el.textContent  = msg;
  el.style.background = ok ? '#2ec4b6' : '#f87171';
  el.style.color  = '#000';
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(function(){ el.style.opacity = '0'; }, 2200);
}

// ── Gán câu hỏi vào bước kịch bản ──
function cq_assignToSelected(qId, event) {
  if (event) event.stopPropagation();
  const src = (window._PREVIEW_MODE && window.parent && window.parent !== window)
              ? window.parent : window;
  let origIdx = (src._kbSelectedOrigIdx != null) ? src._kbSelectedOrigIdx : -1;
  if (origIdx < 0 && src._kbTFStep != null && src._kbTFStep >= 0) origIdx = src._kbTFStep;

  if (origIdx >= 0) {
    cq_assignStep(qId, origIdx);
    _cqToast('✅ Đã gán vào bước!', true);
    if (src !== window) {
      try { src.cq_renderAll && src.cq_renderAll(); } catch(e) {}
    }
  } else {
    _cqToast('⚠️ Chọn một bước trong Mục lục trước', false);
  }
}
window.cq_assignToSelected = cq_assignToSelected;

function cq_assignStep(qId, stepIdx) {
  const data = cq_getData();
  const q    = data.questions.find(x => x.id === qId);
  if (!q) return;
  if (stepIdx == null) {
    /* Gỡ gán: clear kbStepRef và cqId trên step nếu _extra */
    if (q.kbStepRef != null) {
      const s = (typeof TEACHING_STEPS !== 'undefined') ? TEACHING_STEPS[q.kbStepRef.idx] : null;
      if (s && s._extra && s.cqId === qId) {
        s.cqId = null;
        try { if (typeof _saveExtra === 'function') _saveExtra(); } catch(e) {}
      }
    }
    delete q.kbStepRef;
  } else {
    /* Khóa dán: mỗi slide chỉ 1 câu. Nếu bước đã có câu khác → nhảy đến câu đó, buộc bỏ dán trước */
    const existing = (typeof cq_getQuestionForStep === 'function') ? cq_getQuestionForStep(stepIdx) : null;
    if (existing && existing.id !== qId) {
      if (typeof cq_navToPastedQuestion === 'function') cq_navToPastedQuestion(existing);
      return;
    }
    const s = (typeof TEACHING_STEPS !== 'undefined') ? TEACHING_STEPS[stepIdx] : null;
    q.kbStepRef = {
      idx:   stepIdx,
      title: s ? s.title : 'Bước CQ',
      color: s ? s.color : '#4fc3f7',
      phase: s ? s.phase : ''
    };
    /* Đồng bộ cqId lên step để tf_execute biết câu nào cần chiếu */
    if (s) { s.cqId = qId; }
    if (s && s._extra) {
      try { if (typeof _saveExtra === 'function') _saveExtra(); } catch(e) {}
    }
  }
  cq_saveData(data);
  cq_renderAll();
}

// ── Keyboard: Escape đóng present, ← → chuyển bước ──
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('cq-present').classList.contains('active')) {
    cq_presClose();
  }
});
document.addEventListener('keydown', function(e) {
  const pres = document.getElementById('cq-present');
  if (!pres?.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); cq_presNav(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); cq_presNav(1);  }
});
