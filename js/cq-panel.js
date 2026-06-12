// ══════════════════════════════════════════════════════════════
// CÂU HỎI – PANEL QUẢN LÝ (tabs, CRUD, slideshow panel)
// ══════════════════════════════════════════════════════════════

let _cqViewMode = 'present'; // 'present' | 'edit'
let _cqSlideIdx = 0;
let _cqFilter   = 'all';     // 'all' | 'mc' | 'tl' | 'fill' | 'match'
let _cqGrade    = '10';

// ── Grade switch ──
function cq_switchGrade(grade) {
  if (_cqGrade === grade) return;
  _cqGrade = grade;
  document.querySelectorAll('.cq-grade-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.grade === grade));
  cq_buildLessonBar();
  const lessons = CQ_GRADE_MAP[grade] || [];
  if (lessons.length > 0) {
    _cqLesson = null;          // force re-init kể cả trùng tên bài
    cq_switchLesson(lessons[0].id);
  } else {
    _cqLesson = null;
    _cqData   = null;
    _cqSlideIdx = 0;
    const h2 = document.querySelector('#cq-header h2');
    if (h2) h2.textContent = '📚 Thư viện câu hỏi – Lớp ' + grade;
    const tabBar = document.getElementById('cq-tabs-bar');
    if (tabBar) tabBar.innerHTML = '';
    const body = document.getElementById('cq-edit-body');
    if (body) body.innerHTML = `<div class="cq-grade-empty">
      <div style="font-size:2em;margin-bottom:12px">🚧</div>
      Lớp ${grade} chưa có bài học nào trong hệ thống.<br>
      <small style="color:#3a5070">Đang cập nhật...</small>
    </div>`;
    const container = document.getElementById('cq-slideshow-body');
    if (container) container.innerHTML = '<div class="cqsl-empty">Chưa có câu hỏi nào cho lớp này.</div>';
    const counterEl = document.getElementById('cqsl-counter');
    if (counterEl) counterEl.textContent = '0 / 0';
  }
}

function cq_buildLessonBar() {
  const bar = document.getElementById('cq-lesson-bar');
  if (!bar) return;
  const lessons = CQ_GRADE_MAP[_cqGrade] || [];
  if (lessons.length === 0) {
    bar.innerHTML = '<span style="font-size:0.8em;color:#3a5070;font-style:italic;padding:0 4px">Chưa có bài học nào</span>';
    return;
  }
  bar.innerHTML = '<span class="cq-lesson-lbl">Bài:</span>' +
    lessons.map(l =>
      `<button class="cq-lesson-btn${l.id === _cqLesson ? ' active' : ''}"
        data-lesson="${l.id}"
        onclick="cq_switchLesson('${l.id}')"
        title="${l.subtitle || ''}">${l.label}</button>`
    ).join('');
}

// ── Tabs & lesson switch ──
function cq_switchTab(i) {
  document.querySelectorAll('.cq-tab').forEach((t,j) => t.classList.toggle('active', i===j));
  document.querySelectorAll('.cq-panel').forEach((p,j) => p.classList.toggle('active', i===j));
  _cqSlideIdx = 0;
  if (_cqViewMode === 'present') cq_slideRender();
  cq_updateFilterCounts();
}

function cq_buildTabsAndPanels() {
  const cats = _cqLessonCfg().cats;
  const tabBar = document.getElementById('cq-tabs-bar');
  if (tabBar) tabBar.innerHTML = cats.map((c, i) =>
    `<div class="cq-tab${i===0?' active':''}" onclick="cq_switchTab(${i})">${c.label}</div>`
  ).join('');
  const body = document.getElementById('cq-edit-body');
  if (body) body.innerHTML = cats.map((c, i) =>
    `<div class="cq-panel${i===0?' active':''}" data-cat="${c.id}"></div>`
  ).join('');
}

function cq_switchLesson(id) {
  if (_cqLesson === id) return;
  _cqLesson   = id;
  _cqData     = null;
  _cqSlideIdx = 0;
  // Cập nhật active trên lesson bar (dynamic)
  document.querySelectorAll('#cq-lesson-bar .cq-lesson-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lesson === id));
  const h2 = document.querySelector('#cq-header h2');
  if (h2) h2.textContent = '📚 Thư viện câu hỏi – ' + _cqLessonCfg().label + ' · Lớp ' + _cqGrade;
  cq_buildTabsAndPanels();
  cq_renderAll();
}

// ── Render ──
function cq_renderAll() {
  const data = cq_getData();
  const cats = _cqLessonCfg().cats;
  document.querySelectorAll('.cq-panel').forEach((panel, i) => cq_renderPanel(panel, cats[i], data));
  if (_cqViewMode === 'present') cq_slideRender();
  cq_updateFilterCounts();
}

function cq_renderPanel(panel, cat, data) {
  const allQs = data.questions.filter(q => q.cat === cat.id);
  const qs    = cq_applyFilter(allQs);
  panel.innerHTML = '';

  const addRow = document.createElement('div');
  addRow.className = 'cq-add-row';
  addRow.innerHTML = `<button onclick="cq_showNewForm('${cat.id}')">＋ Thêm câu hỏi</button>`;
  panel.appendChild(addRow);

  const nf = document.createElement('div');
  nf.className = 'cq-new-form';
  nf.id = 'cq-nf-' + cat.id;
  nf.innerHTML = `
    <div style="color:#ffd43b;font-size:0.8em;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">＋ Thêm câu hỏi</div>
    <div class="cq-type-row" style="flex-wrap:wrap">
      <button class="cq-type-btn cq-ta" data-t="mc"    id="cq-nf-tb-mc-${cat.id}"    onclick="cq_nfSetType('${cat.id}','mc')">📋 Trắc nghiệm</button>
      <button class="cq-type-btn"       data-t="tl"    id="cq-nf-tb-tl-${cat.id}"    onclick="cq_nfSetType('${cat.id}','tl')">✍️ Tự luận</button>
      <button class="cq-type-btn"       data-t="fill"  id="cq-nf-tb-fill-${cat.id}"  onclick="cq_nfSetType('${cat.id}','fill')">📝 Điền chỗ trống</button>
      <button class="cq-type-btn"       data-t="match" id="cq-nf-tb-match-${cat.id}" onclick="cq_nfSetType('${cat.id}','match')">🔗 Nối từ</button>
    </div>
    <input type="hidden" id="cq-nf-type-${cat.id}" value="mc">
    <label>Câu hỏi *</label>
    <textarea id="cq-nf-q-${cat.id}" placeholder="Nhập nội dung câu hỏi..."></textarea>
    <div id="cq-nf-opts-block-${cat.id}">
      <label>Lựa chọn A *</label>
      <textarea id="cq-nf-o0-${cat.id}" placeholder="Nội dung đáp án A..." style="min-height:44px"></textarea>
      <label>Lựa chọn B *</label>
      <textarea id="cq-nf-o1-${cat.id}" placeholder="Nội dung đáp án B..." style="min-height:44px"></textarea>
      <label>Lựa chọn C *</label>
      <textarea id="cq-nf-o2-${cat.id}" placeholder="Nội dung đáp án C..." style="min-height:44px"></textarea>
      <label>Lựa chọn D *</label>
      <textarea id="cq-nf-o3-${cat.id}" placeholder="Nội dung đáp án D..." style="min-height:44px"></textarea>
      <label>Đáp án đúng</label>
      <select id="cq-nf-ans-${cat.id}">
        <option value="0">A</option><option value="1">B</option>
        <option value="2">C</option><option value="3">D</option>
      </select>
    </div>
    <div id="cq-nf-fill-block-${cat.id}" style="display:none">
      <div class="cq-form-hint">💡 Dùng <code>___</code> trong câu hỏi để đánh dấu chỗ trống</div>
      <label>Đáp án các ô trống (mỗi dòng = 1 ô trống, theo thứ tự)</label>
      <textarea id="cq-nf-fill-${cat.id}" placeholder="Dòng 1: đáp án ô trống 1&#10;Dòng 2: đáp án ô trống 2" style="min-height:80px;font-family:monospace"></textarea>
    </div>
    <div id="cq-nf-match-block-${cat.id}" style="display:none">
      <div class="cq-form-hint">💡 Mỗi dòng 1 cặp: <code>Cột A | Cột B</code></div>
      <label>Các cặp nối (tối đa 6 cặp)</label>
      <textarea id="cq-nf-match-${cat.id}" placeholder="x = 5 | Lệnh gán&#10;x == 5 | So sánh bằng&#10;+= | Gán kết hợp" style="min-height:110px;font-family:monospace"></textarea>
    </div>
    <label id="cq-nf-exp-lbl-${cat.id}">Giải thích / Đáp án gợi ý</label>
    <textarea id="cq-nf-exp-${cat.id}" placeholder="Giải thích hoặc đáp án mẫu..." style="color:#ffd43b;border-color:#ffd43b33"></textarea>
    <label style="margin-top:10px">📽 Liên kết Slide (không bắt buộc)</label>
    <input type="text" id="cq-nf-slide-${cat.id}" placeholder="VD: 2-1 (nhóm 2, slide 1)" style="background:#0d0d1a;border:1px solid #2a3a5a;border-radius:8px;color:#4fc3f7;font-size:0.88em;padding:8px 12px;width:100%;box-sizing:border-box;font-family:var(--font-code)">
    <div class="cq-form-actions" style="margin-top:12px">
      <button class="cq-btn edit" onclick="cq_addQuestion('${cat.id}')">💾 Lưu</button>
      <button class="cq-btn del" onclick="cq_hideNewForm('${cat.id}')">✖ Hủy</button>
    </div>
  `;
  panel.appendChild(nf);

  const list = document.createElement('div');
  list.className = 'cq-list';
  if (qs.length === 0) {
    const TYPE_LABELS = { mc:'Trắc nghiệm', tl:'Tự luận', fill:'Điền chỗ trống', match:'Nối từ' };
    const emptyMsg = _cqFilter !== 'all'
      ? `Không có câu hỏi loại <strong>${TYPE_LABELS[_cqFilter]||_cqFilter}</strong> trong danh mục này.<br><small>Thêm câu hỏi hoặc chọn "Tất cả" để xem tất cả loại.</small>`
      : 'Chưa có câu hỏi nào. Nhấn "＋ Thêm câu hỏi" để bắt đầu.';
    list.innerHTML = `<div class="cq-filter-empty">${emptyMsg}</div>`;
  } else {
    qs.forEach((q, idx) => list.appendChild(cq_createCard(q, cat, idx + 1)));
  }
  panel.appendChild(list);
}

function cq_createCard(q, cat, num) {
  const card = document.createElement('div');
  card.className = 'cq-card';
  card.id = 'cq-card-' + q.id;

  const qType   = q.type || 'mc';
  const isTL    = qType === 'tl';
  const isFill  = qType === 'fill';
  const isMatch = qType === 'match';

  const BADGE_MAP = {
    mc:    `<span class="cq-mc-badge">TRẮC NGHIỆM</span>`,
    tl:    `<span class="cq-tl-badge">TỰ LUẬN</span>`,
    fill:  `<span class="cq-fill-badge">ĐIỀN CHỖ TRỐNG</span>`,
    match: `<span class="cq-match-badge">NỐI TỪ</span>`
  };
  const typeBadge = BADGE_MAP[qType] || BADGE_MAP.mc;

  const slideRefHtml = q.slide
    ? `<span class="cq-slide-ref" onclick="cq_gotoSlide('${q.slide}')" title="Chuyển đến slide ${q.slide}">📽 Slide ${q.slide}</span>`
    : '';

  let kbBadgeHtml = '';
  if (q.kbStepRef != null) {
    const ref  = q.kbStepRef;
    const live = (typeof TEACHING_STEPS !== 'undefined') ? TEACHING_STEPS[ref.idx] : null;
    const clr  = (live ? live.color : ref.color) || '#4fc3f7';
    let stepPos = 0;
    if (typeof TEACHING_STEPS !== 'undefined') {
      const _del = window._kbDeletedSet || new Set();
      for (let _i = 0; _i <= ref.idx && _i < TEACHING_STEPS.length; _i++) {
        if (TEACHING_STEPS[_i].action !== 'break' && !_del.has(_i)) stepPos++;
      }
    }
    const qCode = q.id.replace(/^(cq|q)/i, '');
    kbBadgeHtml = `<span class="cq-kb-badge" style="--kb-clr:${clr}"
      title="Bước ${stepPos} – nhấn để gỡ" onclick="cq_assignStep('${q.id}',null)">
      <span class="cqb-pos">B${stepPos}</span>
      <span class="cqb-sep">·</span>
      <span class="cqb-id">#${qCode}</span>
    </span>`;
  }

  let optsHtml = '';
  if (qType === 'mc' && q.opts && q.opts.length) {
    optsHtml = `<div class="cq-opts" id="cq-opts-${q.id}">`;
    q.opts.forEach((opt, i) => {
      optsHtml += `<div class="cq-opt" data-correct="${i===q.ans?'1':'0'}">
        <span class="cq-opt-label">${CQ_LABELS[i]}</span>
        <span class="cq-opt-text">${cq_escHtml(opt)}</span>
      </div>`;
    });
    optsHtml += '</div>';
    if (q.explain) optsHtml += `<div class="cq-explain" id="cq-exp-${q.id}">${cq_escHtml(q.explain)}</div>`;
  } else if (isTL && q.explain) {
    optsHtml = `<div class="cq-tl-answer" id="cq-opts-${q.id}">${cq_escHtml(q.explain)}</div>`;
  } else if (isFill) {
    optsHtml = cq_renderFillHtml(q);
  } else if (isMatch) {
    optsHtml = cq_renderMatchHtml(q);
  }

  let editOptsHtml = '';
  let editAnsHtml  = '';
  if (!isTL) {
    editOptsHtml = CQ_LABELS.map((lbl, i) => `
      <label>Lựa chọn ${lbl}</label>
      <textarea id="cq-eo${i}-${q.id}" style="min-height:44px">${cq_escHtml(q.opts?.[i]||'')}</textarea>`).join('');
    const selOpts = CQ_LABELS.map((lbl,i)=>`<option value="${i}"${i===q.ans?' selected':''}>${lbl}</option>`).join('');
    editAnsHtml = `<label>Đáp án đúng</label><select id="cq-eans-${q.id}">${selOpts}</select>`;
  }

  const ANS_BTN_MAP = {
    mc:    '💡 Xem đáp án',
    tl:    '📖 Xem đáp án gợi ý',
    fill:  '📝 Xem đáp án',
    match: '🔗 Xem đáp án'
  };
  const ansBtn = `<button class="cq-btn ans" id="cq-ans-btn-${q.id}" onclick="cq_toggleAns('${q.id}')">${ANS_BTN_MAP[qType]||'💡 Xem đáp án'}</button>`;

  const editTypeSel = `<input type="hidden" id="cq-etype-${q.id}" value="${qType}">
    <div class="cq-type-row" style="margin-bottom:10px;flex-wrap:wrap">
      <button class="cq-type-btn${qType==='mc'   ?' cq-ta':''}" data-t="mc"    id="cq-etb-mc-${q.id}"    onclick="cq_efSetType('${q.id}','mc')">📋 Trắc nghiệm</button>
      <button class="cq-type-btn${qType==='tl'   ?' cq-ta':''}" data-t="tl"    id="cq-etb-tl-${q.id}"    onclick="cq_efSetType('${q.id}','tl')">✍️ Tự luận</button>
      <button class="cq-type-btn${qType==='fill' ?' cq-ta':''}" data-t="fill"  id="cq-etb-fill-${q.id}"  onclick="cq_efSetType('${q.id}','fill')">📝 Điền chỗ trống</button>
      <button class="cq-type-btn${qType==='match'?' cq-ta':''}" data-t="match" id="cq-etb-match-${q.id}" onclick="cq_efSetType('${q.id}','match')">🔗 Nối từ</button>
    </div>`;

  card.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      <span style="background:${cat.color}22;color:${cat.color};border-radius:6px;padding:2px 9px;font-size:0.75em;font-weight:700;white-space:nowrap;flex-shrink:0;margin-top:2px">#${num}</span>
      ${typeBadge}${slideRefHtml}${kbBadgeHtml}
      <div class="cq-card-q" style="flex:1;min-width:0">${cq_escHtml(q.q)}</div>
    </div>
    ${optsHtml}
    <div class="cq-card-actions">
      ${ansBtn}
      <button class="cq-btn pres" onclick="cq_present('${q.id}')">📺 Trình chiếu</button>
      <button class="cq-btn edit" onclick="cq_toggleEditForm('${q.id}')">✏️ Sửa</button>
      <button class="cq-btn del" onclick="cq_delete('${q.id}')">🗑 Xóa</button>
    </div>
    <div class="cq-edit-form" id="cq-ef-${q.id}">
      ${editTypeSel}
      <label>Câu hỏi</label>
      <textarea id="cq-eq-${q.id}">${cq_escHtml(q.q)}</textarea>
      <div id="cq-eopts-block-${q.id}" ${isTL?'style="display:none"':''}>
        ${editOptsHtml}
        ${editAnsHtml}
      </div>
      <div id="cq-efill-block-${q.id}" ${isFill?'':'style="display:none"'}>
        <div class="cq-form-hint">💡 Dùng <code>___</code> để đánh dấu chỗ trống</div>
        <label>Đáp án các ô trống (mỗi dòng = 1 đáp án)</label>
        <textarea id="cq-efill-${q.id}" style="min-height:80px;font-family:monospace">${cq_escHtml((q.blanks||[]).join('\n'))}</textarea>
      </div>
      <div id="cq-ematch-block-${q.id}" ${isMatch?'':'style="display:none"'}>
        <div class="cq-form-hint">💡 Mỗi dòng: <code>Cột A | Cột B</code></div>
        <label>Các cặp nối</label>
        <textarea id="cq-ematch-${q.id}" style="min-height:100px;font-family:monospace">${cq_escHtml(cq_pairsToText(q.pairs))}</textarea>
      </div>
      <label>Giải thích / Đáp án gợi ý</label>
      <textarea id="cq-eexp-${q.id}" style="color:#ffd43b;border-color:#ffd43b33">${cq_escHtml(q.explain||'')}</textarea>
      <label style="margin-top:8px">📽 Liên kết Slide</label>
      <input type="text" id="cq-eslide-${q.id}" value="${cq_escHtml(q.slide||'')}" placeholder="VD: 2-1" style="background:#0d0d1a;border:1px solid #2a3a5a;border-radius:8px;color:#4fc3f7;font-size:0.88em;padding:8px 12px;width:100%;box-sizing:border-box;font-family:var(--font-code)">
      <div class="cq-form-actions">
        <button class="cq-btn edit" onclick="cq_saveEdit('${q.id}')">💾 Lưu</button>
        <button class="cq-btn del" onclick="cq_toggleEditForm('${q.id}')">✖ Hủy</button>
      </div>
    </div>
  `;
  return card;
}

// ── CRUD helpers ──
function cq_gotoSlide(ref) {
  if (!ref) return;
  const parts = ref.split('-').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
  setMode('slides');
  setTimeout(() => { if (window.Reveal) Reveal.navigateTo(parts[0], parts[1]); }, 80);
}

function cq_nfSetType(catId, type) {
  document.getElementById('cq-nf-type-' + catId).value = type;
  ['mc','tl','fill','match'].forEach(t => {
    const btn = document.getElementById(`cq-nf-tb-${t}-${catId}`);
    if (btn) btn.classList.toggle('cq-ta', t === type);
  });
  const optsBlock  = document.getElementById('cq-nf-opts-block-'  + catId);
  const fillBlock  = document.getElementById('cq-nf-fill-block-'  + catId);
  const matchBlock = document.getElementById('cq-nf-match-block-' + catId);
  if (optsBlock)  optsBlock.style.display  = type === 'mc'    ? '' : 'none';
  if (fillBlock)  fillBlock.style.display  = type === 'fill'  ? '' : 'none';
  if (matchBlock) matchBlock.style.display = type === 'match' ? '' : 'none';
  const expLbl = document.getElementById('cq-nf-exp-lbl-' + catId);
  if (expLbl) expLbl.textContent =
    type === 'tl'    ? '✍️ Đáp án gợi ý / Câu trả lời mẫu *' :
    type === 'fill'  ? '✍️ Giải thích thêm (không bắt buộc)' :
    type === 'match' ? '✍️ Ghi chú thêm (không bắt buộc)' :
                       'Giải thích (không bắt buộc)';
}

function cq_efSetType(id, type) {
  const inp = document.getElementById('cq-etype-' + id);
  if (inp) inp.value = type;
  ['mc','tl','fill','match'].forEach(t => {
    const btn = document.getElementById(`cq-etb-${t}-${id}`);
    if (btn) btn.classList.toggle('cq-ta', t === type);
  });
  const optsBlock  = document.getElementById('cq-eopts-block-'  + id);
  const fillBlock  = document.getElementById('cq-efill-block-'  + id);
  const matchBlock = document.getElementById('cq-ematch-block-' + id);
  if (optsBlock)  optsBlock.style.display  = type === 'mc'    ? '' : 'none';
  if (fillBlock)  fillBlock.style.display  = type === 'fill'  ? '' : 'none';
  if (matchBlock) matchBlock.style.display = type === 'match' ? '' : 'none';
}

function cq_toggleAns(id) {
  const optsEl = document.getElementById('cq-opts-' + id);
  const expEl  = document.getElementById('cq-exp-' + id);
  const btn    = document.getElementById('cq-ans-btn-' + id);
  if (!optsEl) return;

  if (optsEl.classList.contains('cq-tl-answer')) {
    const showing = optsEl.classList.toggle('visible');
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : '📖 Xem đáp án gợi ý';
  } else if (optsEl.classList.contains('cq-fill-answers')) {
    const showing = optsEl.classList.toggle('visible');
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : '📝 Xem đáp án';
  } else if (optsEl.classList.contains('cq-match-table')) {
    const showing = optsEl.classList.toggle('revealed');
    const ansText = optsEl.querySelector('.cq-match-ans-text');
    if (ansText) ansText.classList.toggle('visible', showing);
    if (expEl)   expEl.classList.toggle('visible', showing);
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : '🔗 Xem đáp án';
  } else {
    const showing = optsEl.classList.toggle('revealed');
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : '💡 Xem đáp án';
    if (expEl) expEl.classList.toggle('visible', showing);
  }
}

function cq_toggleEditForm(id) {
  const ef = document.getElementById('cq-ef-' + id);
  if (ef) ef.classList.toggle('visible');
}

function cq_showNewForm(catId) {
  const nf = document.getElementById('cq-nf-' + catId);
  if (!nf) return;
  nf.classList.add('visible');
  const ta = document.getElementById('cq-nf-q-' + catId);
  if (ta) ta.focus();
}

function cq_hideNewForm(catId) {
  const nf = document.getElementById('cq-nf-' + catId);
  if (!nf) return;
  nf.classList.remove('visible');
  ['q','o0','o1','o2','o3','exp'].forEach(k => {
    const el = document.getElementById(`cq-nf-${k}-${catId}`);
    if (el) el.value = '';
  });
  const sel = document.getElementById('cq-nf-ans-' + catId);
  if (sel) sel.value = '0';
  const slideEl = document.getElementById('cq-nf-slide-' + catId);
  if (slideEl) slideEl.value = '';
  ['fill','match'].forEach(k => {
    const el = document.getElementById(`cq-nf-${k}-${catId}`);
    if (el) el.value = '';
  });
  cq_nfSetType(catId, 'mc');
}

function cq_addQuestion(catId) {
  const qEl = document.getElementById('cq-nf-q-' + catId);
  const qText = qEl ? qEl.value.trim() : '';
  if (!qText) { if (qEl) qEl.focus(); return; }

  const typeEl  = document.getElementById('cq-nf-type-' + catId);
  const qType   = typeEl ? typeEl.value : 'mc';
  const expEl   = document.getElementById('cq-nf-exp-' + catId);
  const slideEl = document.getElementById('cq-nf-slide-' + catId);

  const newQ = {
    id: cq_genId(), cat: catId, type: qType,
    q: qText,
    explain: expEl ? expEl.value.trim() : ''
  };

  if (qType === 'mc') {
    const opts = [0,1,2,3].map(i => {
      const el = document.getElementById(`cq-nf-o${i}-${catId}`);
      return el ? el.value.trim() : '';
    });
    const ansEl = document.getElementById('cq-nf-ans-' + catId);
    newQ.opts = opts; newQ.ans = ansEl ? parseInt(ansEl.value) : 0;
  } else if (qType === 'fill') {
    const fillEl = document.getElementById('cq-nf-fill-' + catId);
    newQ.blanks = cq_parseBlanks(fillEl ? fillEl.value : '');
  } else if (qType === 'match') {
    const matchEl = document.getElementById('cq-nf-match-' + catId);
    newQ.pairs = cq_parsePairs(matchEl ? matchEl.value : '');
  }

  if (slideEl && slideEl.value.trim()) newQ.slide = slideEl.value.trim();

  const data = cq_getData();
  data.questions.push(newQ);
  cq_saveData(data);
  cq_hideNewForm(catId);
  cq_renderAll();
}

function cq_saveEdit(id) {
  const qEl   = document.getElementById('cq-eq-' + id);
  const qText = qEl ? qEl.value.trim() : '';
  if (!qText) return;

  const typeEl  = document.getElementById('cq-etype-' + id);
  const qType   = typeEl ? typeEl.value : 'mc';
  const expEl   = document.getElementById('cq-eexp-' + id);
  const slideEl = document.getElementById('cq-eslide-' + id);

  const data = cq_getData();
  const q = data.questions.find(q => q.id === id);
  if (!q) return;
  q.type    = qType;
  q.q       = qText;
  q.explain = expEl ? expEl.value.trim() : '';

  delete q.opts; delete q.ans; delete q.blanks; delete q.pairs;

  if (qType === 'mc') {
    const opts = [0,1,2,3].map(i => {
      const el = document.getElementById(`cq-eo${i}-${id}`);
      return el ? el.value.trim() : '';
    });
    const ansEl = document.getElementById('cq-eans-' + id);
    q.opts = opts; q.ans = ansEl ? parseInt(ansEl.value) : 0;
  } else if (qType === 'fill') {
    const fillEl = document.getElementById('cq-efill-' + id);
    q.blanks = cq_parseBlanks(fillEl ? fillEl.value : '');
  } else if (qType === 'match') {
    const matchEl = document.getElementById('cq-ematch-' + id);
    q.pairs = cq_parsePairs(matchEl ? matchEl.value : '');
  }

  const sv = slideEl ? slideEl.value.trim() : '';
  if (sv) q.slide = sv; else delete q.slide;
  cq_saveData(data);
  cq_renderAll();
}

function cq_delete(id) {
  if (!confirm('Xóa câu hỏi này?')) return;
  const data = cq_getData();
  data.questions = data.questions.filter(q => q.id !== id);
  _cqData = data;
  cq_saveData(data);
  cq_renderAll();
}

// ── View mode & filter ──
function cq_setViewMode(mode) {
  _cqViewMode = mode;
  document.querySelectorAll('.cq-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  const slideshowEl = document.getElementById('cq-slideshow');
  const editBodyEl  = document.getElementById('cq-edit-body');
  const hintEl      = document.querySelector('.cq-mode-hint');
  if (mode === 'present') {
    slideshowEl.classList.add('active');
    if (editBodyEl) editBodyEl.style.display = 'none';
    if (hintEl) hintEl.style.display = '';
    cq_slideRender();
  } else {
    slideshowEl.classList.remove('active');
    if (editBodyEl) editBodyEl.style.display = '';
    if (hintEl) hintEl.style.display = 'none';
    cq_renderAll();
  }
}

function cq_getCurrentCatIdx() {
  let idx = 0;
  document.querySelectorAll('.cq-tab').forEach((t, i) => { if (t.classList.contains('active')) idx = i; });
  return idx;
}

function cq_getQuestionForStep(stepOrigIdx) {
  const data = cq_getData();
  return data.questions.find(q => q.kbStepRef != null && q.kbStepRef.idx === stepOrigIdx) || null;
}
window.cq_getQuestionForStep = cq_getQuestionForStep;

function cq_getQuestionById(id) {
  return cq_getData().questions.find(q => q.id === id) || null;
}
window.cq_getQuestionById = cq_getQuestionById;

function cq_getQuestionsByCat(catId) {
  return cq_getData().questions.filter(q => q.cat === catId);
}
window.cq_getQuestionsByCat = cq_getQuestionsByCat;

function cq_getCurrentQuestion() {
  const qs   = cq_getSlideQuestions();
  const q    = qs[_cqSlideIdx] || null;
  const tabs = [...document.querySelectorAll('.cq-tab')];
  const active = tabs.findIndex(t => t.classList.contains('active'));
  return q ? { question: q, tabIdx: active } : null;
}
window.cq_getCurrentQuestion = cq_getCurrentQuestion;

/* ── Khóa dán: mỗi slide câu hỏi chỉ chứa 1 câu ── */

/* Toast cảnh báo khóa dán */
function cq_pasteBlockToast(msg) {
  let el = document.getElementById('cq-paste-block-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'cq-paste-block-toast';
    el.style.cssText = 'position:fixed;top:18px;left:50%;transform:translateX(-50%);'
      + 'padding:11px 24px;border-radius:8px;font-size:14px;font-weight:700;'
      + 'background:#ef4444;color:#fff;z-index:99999;pointer-events:none;'
      + 'box-shadow:0 4px 16px rgba(0,0,0,.4);transition:opacity .3s;opacity:0;'
      + 'max-width:80vw;text-align:center;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = '0'; }, 3500);
}
window.cq_pasteBlockToast = cq_pasteBlockToast;

/* Nhảy đến câu đang dán trong thư viện câu hỏi (mở mode cq + chuyển tab/filter + slide) */
function cq_navToPastedQuestion(pastedQ) {
  if (!pastedQ) return;
  /* Mở thư viện câu hỏi ở chế độ trình chiếu */
  try { if (typeof setMode === 'function') setMode('cq'); } catch(e) {}
  if (_cqViewMode !== 'present') cq_setViewMode('present');

  /* Chuyển sang tab (danh mục) chứa câu đang dán */
  const cats = _cqLessonCfg().cats;
  const tabIdx = cats.findIndex(c => c.id === pastedQ.cat);
  if (tabIdx >= 0) cq_switchTab(tabIdx);

  /* Bỏ filter nếu nó đang ẩn câu này */
  if (_cqFilter !== 'all' && (pastedQ.type || 'mc') !== _cqFilter) cq_setFilter('all');

  /* Định vị slideshow đến đúng câu */
  const qs  = cq_getSlideQuestions();
  const idx = qs.findIndex(x => x.id === pastedQ.id);
  if (idx >= 0) { _cqSlideIdx = idx; cq_slideRender(); }

  cq_pasteBlockToast('⚠️ Slide này đã có 1 câu hỏi. Bấm "B…" để bỏ dán câu hiện tại trước, rồi mới dán câu mới.');
}
window.cq_navToPastedQuestion = cq_navToPastedQuestion;

function cq_focusQuestion(id) {
  const q = cq_getQuestionById(id);
  if (!q) return false;

  try { if (typeof setMode === 'function') setMode('cq'); } catch(e) {}
  if (_cqViewMode !== 'present') cq_setViewMode('present');

  const cats = _cqLessonCfg().cats;
  const tabIdx = cats.findIndex(c => c.id === q.cat);
  if (tabIdx >= 0) cq_switchTab(tabIdx);

  if (_cqFilter !== 'all' && (q.type || 'mc') !== _cqFilter) cq_setFilter('all');

  const qs = cq_getSlideQuestions();
  const idx = qs.findIndex(x => x.id === q.id);
  if (idx >= 0) {
    _cqSlideIdx = idx;
    cq_slideRender();
  }
  return true;
}
window.cq_focusQuestion = cq_focusQuestion;

function cq_applyFilter(qs) {
  if (_cqFilter === 'all') return qs;
  return qs.filter(q => (q.type || 'mc') === _cqFilter);
}

function cq_setFilter(type) {
  _cqFilter = type;
  _cqSlideIdx = 0;
  document.querySelectorAll('.cq-filter-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.filter === type));
  cq_renderAll();
  cq_updateFilterCounts();
}

function cq_updateFilterCounts() {
  const cat = CQ_CATS[cq_getCurrentCatIdx()];
  if (!cat) return;
  const qs = cq_getData().questions.filter(q => q.cat === cat.id);
  const counts = { all: qs.length, mc: 0, tl: 0, fill: 0, match: 0 };
  qs.forEach(q => { const t = q.type || 'mc'; if (counts[t] !== undefined) counts[t]++; });
  ['all','mc','tl','fill','match'].forEach(k => {
    const el = document.getElementById('cq-fcnt-' + k);
    if (el) el.textContent = counts[k] > 0 ? counts[k] : '';
  });
}

function cq_getSlideQuestions() {
  const cat = CQ_CATS[cq_getCurrentCatIdx()];
  const all = cq_getData().questions.filter(q => q.cat === cat.id);
  return cq_applyFilter(all);
}

// ── Panel slideshow ──
function cq_slideRender() {
  if (_cqViewMode !== 'present') return;
  try { window._kbCQUpdatePastePreview && window._kbCQUpdatePastePreview(); } catch(e) {}
  const qs         = cq_getSlideQuestions();
  const container  = document.getElementById('cq-slideshow-body');
  const counterEl  = document.getElementById('cqsl-counter');
  const prevBtn    = document.getElementById('cqsl-prev');
  const nextBtn    = document.getElementById('cqsl-next');
  const presBtn    = document.getElementById('cqsl-pres-btn');
  const ansBtn     = document.getElementById('cqsl-ans-btn');

  if (_cqSlideIdx >= qs.length) _cqSlideIdx = Math.max(0, qs.length - 1);
  if (prevBtn) prevBtn.disabled = _cqSlideIdx === 0 || qs.length === 0;
  if (nextBtn) nextBtn.disabled = _cqSlideIdx >= qs.length - 1 || qs.length === 0;
  if (counterEl) counterEl.textContent = qs.length > 0 ? (_cqSlideIdx + 1) + ' / ' + qs.length : '0 / 0';

  if (!container) return;

  if (qs.length === 0) {
    container.innerHTML = '<div class="cqsl-empty">Danh mục này chưa có câu hỏi nào.</div>';
    if (presBtn) presBtn.dataset.id = '';
    return;
  }

  const q  = qs[_cqSlideIdx];
  const qt = q.type || 'mc';
  const SL_BADGE = {
    mc:    `<span class="cqsl-type-badge" style="background:rgba(46,196,182,0.12);border:1px solid rgba(46,196,182,0.4);color:#2ec4b6">TRẮC NGHIỆM</span>`,
    tl:    `<span class="cqsl-type-badge" style="background:rgba(255,152,0,0.14);border:1px solid rgba(255,152,0,0.4);color:#ff9800">TỰ LUẬN</span>`,
    fill:  `<span class="cqsl-type-badge" style="background:rgba(100,220,180,0.12);border:1px solid rgba(100,220,180,0.4);color:#64dcb4">ĐIỀN CHỖ TRỐNG</span>`,
    match: `<span class="cqsl-type-badge" style="background:rgba(255,212,59,0.12);border:1px solid rgba(255,212,59,0.4);color:#ffd43b">NỐI TỪ</span>`
  };
  const typeBadge = SL_BADGE[qt] || SL_BADGE.mc;

  let bodyHtml = '';
  if (qt === 'mc' && q.opts && q.opts.length) {
    bodyHtml = `<div class="cqsl-opts" id="cqsl-opts">`;
    q.opts.forEach((opt, i) => {
      bodyHtml += `<div class="cqsl-opt" data-correct="${i === q.ans ? '1' : '0'}">
        <span class="cqsl-opt-label">${CQ_LABELS[i]}</span>
        <span class="cqsl-opt-text">${cq_escHtml(opt)}</span>
      </div>`;
    });
    bodyHtml += `</div>`;
    if (q.explain) bodyHtml += `<div class="cqsl-explain" id="cqsl-explain">${cq_escHtml(q.explain)}</div>`;
  } else if (qt === 'tl' && q.explain) {
    bodyHtml = `<div class="cqsl-tl-answer" id="cqsl-tl-answer">${cq_escHtml(q.explain)}</div>`;
  } else if (qt === 'fill') {
    bodyHtml = cq_renderFillHtml(q, 'cq-blank', 'cq-fill-answers', 'cqsl-fill-ans');
  } else if (qt === 'match') {
    bodyHtml = cq_renderMatchHtml(q, 'cqsl-match-table', 'cqsl-match-exp');
  }

  const qText  = qt === 'fill'
    ? cq_escHtml(q.q).replace(/___/g, `<span class="cq-blank">___</span>`)
    : cq_escHtml(q.q);

  const qCode    = q.id.replace(/^(cq|q)/i, '');
  const qIdChip  = `<span class="cqsl-qid" title="Mã câu hỏi: ${q.id}">#${qCode}</span>`;

  let stepPosChip = '';
  if (q.kbStepRef != null) {
    const ref  = q.kbStepRef;
    const live = (typeof TEACHING_STEPS !== 'undefined') ? TEACHING_STEPS[ref.idx] : null;
    const clr  = (live ? live.color : ref.color) || '#4fc3f7';
    let stepPos = 0;
    if (typeof TEACHING_STEPS !== 'undefined') {
      const _del = window._kbDeletedSet || new Set();
      for (let _i = 0; _i <= ref.idx && _i < TEACHING_STEPS.length; _i++) {
        if (TEACHING_STEPS[_i].action !== 'break' && !_del.has(_i)) stepPos++;
      }
    }
    stepPosChip = `<span class="cqsl-kbpos" style="--kb-clr:${clr}"
      title="Bước ${stepPos} – nhấn để bỏ dán" onclick="cq_unpasteQuestion('${q.id}')">
      B${stepPos}
    </span>`;
  }

  container.innerHTML = `
    <div class="cqsl-card">
      <div class="cqsl-header">
        <span class="cqsl-num">Câu ${_cqSlideIdx + 1}</span>
        ${typeBadge}
        ${qIdChip}
        ${stepPosChip}
      </div>
      <div class="cqsl-q">${qText}</div>
      ${bodyHtml}
    </div>`;

  if (presBtn) presBtn.dataset.id = q.id;
  if (ansBtn) {
    const ANS_SL  = { mc:'💡 Xem đáp án', tl:'📖 Xem đáp án gợi ý', fill:'📝 Xem đáp án', match:'🔗 Xem đáp án' };
    const ANS_CLR = { mc:'#2ecc71', tl:'#ff9800', fill:'#64dcb4', match:'#ffd43b' };
    ansBtn.textContent        = ANS_SL[qt]  || '💡 Xem đáp án';
    ansBtn.style.borderColor  = ANS_CLR[qt] || '#2ecc71';
    ansBtn.style.color        = ANS_CLR[qt] || '#2ecc71';
  }
}

function cq_slidePrev() {
  if (_cqSlideIdx > 0) { _cqSlideIdx--; cq_slideRender(); }
}

function cq_slideNext() {
  const qs = cq_getSlideQuestions();
  if (_cqSlideIdx < qs.length - 1) { _cqSlideIdx++; cq_slideRender(); }
}

function cq_slideToggleAns() {
  const btn     = document.getElementById('cqsl-ans-btn');
  const tlEl    = document.getElementById('cqsl-tl-answer');
  const optEl   = document.getElementById('cqsl-opts');
  const expEl   = document.getElementById('cqsl-explain');
  const fillEl  = document.getElementById('cqsl-fill-ans');
  const matchEl = document.getElementById('cqsl-match-table');

  if (tlEl) {
    const showing = tlEl.classList.toggle('visible');
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : '📖 Xem đáp án gợi ý';
  } else if (fillEl) {
    const showing = fillEl.classList.toggle('visible');
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : '📝 Xem đáp án';
  } else if (matchEl) {
    const showing = matchEl.classList.toggle('revealed');
    const ansText = matchEl.querySelector('.cq-match-ans-text');
    const mExp    = document.getElementById('cqsl-match-exp');
    if (ansText) ansText.classList.toggle('visible', showing);
    if (mExp)    mExp.classList.toggle('visible', showing);
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : '🔗 Xem đáp án';
  } else if (optEl) {
    const showing = optEl.classList.toggle('revealed');
    if (btn) btn.textContent = showing ? '🙈 Ẩn đáp án' : '💡 Xem đáp án';
    if (expEl) expEl.classList.toggle('visible', showing);
  }
}

// ── Keyboard shortcuts: ← → Space F trong panel ──
document.addEventListener('keydown', function(e) {
  const cqOpen  = document.getElementById('cq-overlay').classList.contains('active');
  const presOpen = document.getElementById('cq-present').classList.contains('active');
  if (!cqOpen || presOpen || _cqViewMode !== 'present') return;
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); cq_slidePrev(); }
  if (e.key === 'ArrowRight') { e.preventDefault(); cq_slideNext(); }
  if (e.key === ' ')          { e.preventDefault(); cq_slideToggleAns(); }
  if (e.key === 'f' || e.key === 'F') {
    const presBtn = document.getElementById('cqsl-pres-btn');
    if (presBtn && presBtn.dataset.id) cq_present(presBtn.dataset.id);
  }
});

// ── Init ──
(function() {
  function _cqInit() {
    cq_buildLessonBar();
    cq_buildTabsAndPanels();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _cqInit);
  } else {
    _cqInit();
  }
})();
