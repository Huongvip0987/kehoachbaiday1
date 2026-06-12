// ══════════════════════════════════════════════════════════════
// KỊCH BẢN – TEACHING DIRECTOR
// Hiển thị TEACHING_STEPS tiết 1 dưới dạng lộ trình có thể chạy.
// Luồng: Câu hỏi → Chọn người → Chốt đáp án → Dạy kiến thức
// Kết nối: Speech TTS · Slides · Playground · CQ · Chọn người
// ══════════════════════════════════════════════════════════════
(function () {
  'use strict';

  /* ════════════════════════════════════
     1. TTS SCRIPTS – lời thoại TTS sạch
        (index tương ứng vị trí trong TEACHING_STEPS)
  ════════════════════════════════════ */
  const STEP_TTS = {}; // lời thoại mặc định theo SLIDE_SCRIPTS[h-v]; object này chỉ lưu chỉnh sửa thủ công

  /* ════════════════════════════════════
     2. SUB-TOPIC METADATA cho phần A–G
        (dùng vị trí gốc trong TEACHING_STEPS)
  ════════════════════════════════════ */
  const SUBTOPIC = {}; // không dùng nữa – nhóm theo phase (phần slide)

  /* Expose để teaching-flow.js truy cập khi người dùng click bước */
  window._kbStepTTS = STEP_TTS;

  /* ════════════════════════════════════
     3. STATE
  ════════════════════════════════════ */
  const TIER1 = new Set(['ÔN TẬP', 'KHỞI ĐỘNG', 'HÌNH THÀNH KIẾN THỨC']);

  /* v3: lộ trình/mục lục tái cấu trúc theo 41 slide thực tế → reset dữ liệu cũ */
  const _LS_DEL_KEY   = 'kb_deleted_steps_b17_v3';
  const _LS_EXTRA_KEY = 'kb_extra_steps_b17_v3';
  const _LS_TTS_KEY   = 'kb_tts_edits_b17_v1';
  const _LS_SCRIPT_KEY = 'kb_script_edits_b17_v1';
  const SCRIPT_EDITS = {};

  let _dirIdx        = -1;   // index trong filtered list (bước đang chọn để soạn)
  let _curSlideHV    = null; // [h,v] slide Reveal đang chiếu → highlight "slide đang ở" trong mục lục
  let _playing       = false;
  let _paused        = false;
  let _simMode       = false; // true = mô phỏng trong kịch bản, không mở overlay ngoài
  let _dragFrom      = -1;   // filtered index đang kéo
  let _deletedOrigIdx = new Set();  // các vị trí gốc đã bị xóa
  window._kbDeletedSet = _deletedOrigIdx; // expose để teaching-flow.js đọc

  /* ── Load danh sách đã xóa từ localStorage ── */
  function _loadDeleted() {
    try {
      const raw = localStorage.getItem(_LS_DEL_KEY);
      if (raw) JSON.parse(raw).forEach(i => _deletedOrigIdx.add(i));
    } catch(e) {}
  }

  /* ── Lưu danh sách đã xóa xuống localStorage ── */
  function _saveDeleted() {
    try {
      localStorage.setItem(_LS_DEL_KEY, JSON.stringify([..._deletedOrigIdx]));
    } catch(e) {}
  }

  /* ── Nạp extra steps (dán từ CQ) vào TEACHING_STEPS khi khởi động ── */
  function _loadExtra() {
    try {
      const raw = localStorage.getItem(_LS_EXTRA_KEY);
      if (!raw) return;
      const extras = JSON.parse(raw);
      extras.forEach(({ afterTitle, step }) => {
        const anchorIdx = afterTitle
          ? TEACHING_STEPS.findIndex(s => s.title === afterTitle)
          : -1;
        if (anchorIdx >= 0) TEACHING_STEPS.splice(anchorIdx + 1, 0, step);
        else TEACHING_STEPS.push(step);
      });
    } catch(e) {}
  }

  /* ── Lưu tất cả extra steps xuống localStorage ── */
  function _saveExtra() {
    try {
      const extras = [];
      TEACHING_STEPS.forEach((s, i) => {
        if (s._extra) {
          const prev = TEACHING_STEPS[i - 1];
          extras.push({ afterTitle: prev ? prev.title : null, step: s });
        }
      });
      localStorage.setItem(_LS_EXTRA_KEY, JSON.stringify(extras));
    } catch(e) {}
  }

  function _loadTtsEdits() {
    try {
      const raw = localStorage.getItem(_LS_TTS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return;
      Object.keys(data).forEach(k => { STEP_TTS[k] = String(data[k] ?? ''); });
    } catch(e) {}
  }

  function _saveTtsEdits() {
    try {
      localStorage.setItem(_LS_TTS_KEY, JSON.stringify(STEP_TTS));
    } catch(e) {}
  }

  function _loadScriptEdits() {
    try {
      const raw = localStorage.getItem(_LS_SCRIPT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return;
      Object.keys(data).forEach(k => {
        const idx = Number(k);
        if (!Number.isInteger(idx) || !TEACHING_STEPS[idx]) return;
        const val = String(data[k] ?? '');
        SCRIPT_EDITS[k] = val;
        TEACHING_STEPS[idx].script = val;
      });
    } catch(e) {}
  }

  function _saveScriptEdits() {
    try {
      localStorage.setItem(_LS_SCRIPT_KEY, JSON.stringify(SCRIPT_EDITS));
    } catch(e) {}
  }

  function _slideHvForOrig(origIdx) {
    const s = TEACHING_STEPS && TEACHING_STEPS[origIdx];
    if (s && s.hv) return s.hv;
    return (typeof _TF_SLIDE_HV !== 'undefined') ? _TF_SLIDE_HV[origIdx] : null;
  }

  function _slideElForOrig(origIdx) {
    try {
      const hv = _slideHvForOrig(origIdx);
      if (!hv || typeof Reveal === 'undefined' || typeof Reveal.getSlide !== 'function') return null;
      return Reveal.getSlide(hv[0], hv[1] || 0);
    } catch(e) {
      return null;
    }
  }

  function _markSlideUncounted(origIdx, deleted) {
    const slide = _slideElForOrig(origIdx);
    if (!slide) return false;

    if (deleted) {
      if (!slide.dataset.kbPrevVisibility) {
        slide.dataset.kbPrevVisibility = slide.getAttribute('data-visibility') || '';
      }
      slide.dataset.visibility = 'uncounted';
      slide.dataset.kbDeletedSlide = '1';
    } else {
      const prev = slide.dataset.kbPrevVisibility || '';
      if (prev) slide.dataset.visibility = prev;
      else slide.removeAttribute('data-visibility');
      delete slide.dataset.kbPrevVisibility;
      delete slide.dataset.kbDeletedSlide;
    }
    return true;
  }

  function _syncRevealSlideCount() {
    try {
      if (typeof Reveal !== 'undefined' && typeof Reveal.sync === 'function') Reveal.sync();
    } catch(e) {}
  }

  function _applyDeletedSlidesToReveal() {
    let changed = false;
    _deletedOrigIdx.forEach(origIdx => {
      if (_markSlideUncounted(origIdx, true)) changed = true;
    });
    if (changed) _syncRevealSlideCount();
  }

  function _catIndexForQuestion(q) {
    if (!q || typeof CQ_CATS === 'undefined') return -1;
    return CQ_CATS.findIndex(c => c.id === q.cat);
  }

  function _questionScript(q) {
    if (!q) return '';
    return '[Câu hỏi dán từ danh sách]\n' + (q.q || '') +
      (q.opts ? '\n' + q.opts.map((o, i) => 'ABCD'[i] + '. ' + o).join('\n') : '') +
      '\n\nBấm 📽 Trình chiếu → câu hỏi hiện toàn màn hình.\nHS suy nghĩ → trả lời → GV xác nhận đáp án.';
  }

  function _syncQuestionAssignmentsFromData() {
    try {
      if (typeof cq_getData !== 'function' || typeof TEACHING_STEPS === 'undefined') return;
      const data = cq_getData();
      if (!data || !data.questions) return;
      let changed = false;

      data.questions.forEach(q => {
        const ref = q.kbStepRef;
        if (!ref || typeof ref.idx !== 'number') return;
        let stepIdx = ref.idx;
        let s = TEACHING_STEPS[stepIdx];
        if ((!s || s.action !== 'cq' || (ref.title && s.title !== ref.title)) && ref.title) {
          const foundIdx = TEACHING_STEPS.findIndex(step =>
            step && step.action === 'cq' && step.title === ref.title
          );
          if (foundIdx >= 0) {
            stepIdx = foundIdx;
            s = TEACHING_STEPS[stepIdx];
          }
        }
        if (!s || s.action !== 'cq') return;

        if (s.cqId !== q.id) s.cqId = q.id;
        const catIdx = _catIndexForQuestion(q);
        if (catIdx >= 0 && s.cqTab !== catIdx) s.cqTab = catIdx;

        const title = s.title || ref.title || '';
        if (ref.idx !== stepIdx || ref.title !== title || ref.color !== s.color || ref.phase !== s.phase) {
          q.kbStepRef = {
            idx: stepIdx,
            title,
            color: s.color || ref.color || '#4fc3f7',
            phase: s.phase || ref.phase || ''
          };
          changed = true;
        }
      });

      if (changed && typeof cq_saveData === 'function') cq_saveData(data);
    } catch(e) {}
  }

  function _refreshQuestionAssignmentUI() {
    try { if (typeof cq_renderAll === 'function') cq_renderAll(); } catch(e) {}
    try { if (typeof tf_buildList === 'function') tf_buildList(); } catch(e) {}
    try { _renderList(); } catch(e) {}
    try { _renderDetail(); } catch(e) {}
    try { _renderCtrl(); } catch(e) {}
  }

  /* ── Mục lục CHỈ gồm bước slide (loại câu hỏi/chọn người/playground/break, loại đã xóa) ── */
  function _steps() {
    if (typeof TEACHING_STEPS === 'undefined') return [];
    return TEACHING_STEPS.filter((s, i) =>
      s.action === 'slide' && !_deletedOrigIdx.has(i)
    );
  }

  /* ── Vị trí gốc trong TEACHING_STEPS ── */
  function _origIdx(filtIdx) {
    const all = _steps();
    if (filtIdx < 0 || filtIdx >= all.length) return -1;
    return TEACHING_STEPS.indexOf(all[filtIdx]);
  }

  /* ── TTS text cho bước ──
     Ưu tiên: chỉnh sửa thủ công (STEP_TTS) → lời thoại mẫu SLIDE_SCRIPTS[h-v] → tiêu đề. */
  function _getTTS(filtIdx) {
    const orig = _origIdx(filtIdx);
    if (Object.prototype.hasOwnProperty.call(STEP_TTS, orig)) return STEP_TTS[orig];
    const s = _steps()[filtIdx];
    if (s && s.hv && typeof SLIDE_SCRIPTS !== 'undefined') {
      const key = s.hv[0] + '-' + s.hv[1];
      if (SLIDE_SCRIPTS[key]) return SLIDE_SCRIPTS[key];
    }
    return (s && s.title) || '';
  }

  /* ════════════════════════════════════
     4. RENDER – step list
  ════════════════════════════════════ */
  const _ICONS  = { slide:'📽', cq:'❓', chon:'🎲', code:'💻' };
  const _BADGE  = { slide:'dial', cq:'quest', chon:'pick', code:'expl' };
  const _ALABEL = { slide:'Dạy slide', cq:'Câu hỏi', chon:'Chọn người', code:'Demo code' };
  const _PCLR   = {
    'MỞ ĐẦU':'#3a86ff', 'KHỞI ĐỘNG':'#ff9f1c', 'BIẾN & LỆNH GÁN':'#2ec4b6',
    'PHÉP TOÁN':'#e71d36', 'TỪ KHÓA':'#9b5de5', 'THỰC HÀNH':'#06d6a0',
    'VẬN DỤNG':'#f72585',  'TỔNG KẾT':'#4cc9f0'
  };

  /* Vị trí gốc của bước "break" (ranh giới Tiết 1 / Tiết 2) */
  function _breakOrigIdx() {
    if (typeof TEACHING_STEPS === 'undefined') return -1;
    return TEACHING_STEPS.findIndex(s => s.action === 'break');
  }

  function _renderList() {
    const el = document.getElementById('kb-dir-list');
    if (!el) return;

    const steps = _steps();
    if (!steps.length) {
      el.innerHTML = '<div class="kb-empty">Đang tải kịch bản...</div>';
      return;
    }

    let html = '';
    let lastPhase = '';
    let shownTier2 = false;
    const brk = _breakOrigIdx();

    steps.forEach((s, i) => {
      const orig    = _origIdx(i);
      const color   = _PCLR[s.phase] || '#888';

      /* Divider giữa 2 tiết – đặt khi bước vượt qua vị trí break */
      if (brk >= 0 && orig > brk && !shownTier2) {
        shownTier2 = true;
        html += `<div class="kb-tier-divider">
          <span class="kb-tier-badge t1">✓ Tiết 1</span>
          <span class="kb-tier-sep-line"></span>
          <span class="kb-tier-badge t2">▶ Tiết 2</span>
        </div>`;
      }

      /* Phase header */
      if (s.phase !== lastPhase) {
        html += `<div class="kb-dir-phase" style="color:${color};border-left-color:${color}">${s.phase}</div>`;
        lastPhase = s.phase;
      }

      const isActive = i === _dirIdx;
      const isDone   = _playing && i < _dirIdx;
      const isSlideCur = !isActive && _curSlideHV && s.hv &&
        s.hv[0] === _curSlideHV[0] && (s.hv[1]||0) === (_curSlideHV[1]||0);

      html += `<div class="kb-dir-step${isActive?' kds-on':isDone?' kds-done':''}${isSlideCur?' kds-slide-cur':''}" id="kds${i}" data-filt="${i}" draggable="true" onclick="kbDirSelect(${i})">
        <div class="kb-dir-step-row">
          <span class="kb-drag-handle" title="Kéo để di chuyển" onclick="event.stopPropagation()">⠿</span>
          <span class="kb-step-num${isActive?' kds-na':''}">${isDone?'✓':(i+1)}</span>
          <span class="kb-step-badge ${_BADGE[s.action]||''}">${_ICONS[s.action]||''} ${_ALABEL[s.action]||s.action}</span>
          <span class="kb-dir-time">~${s.time}p</span>
          <button class="kb-del-btn" title="Xóa bước này" onclick="event.stopPropagation();kbDirDeleteStep(${i})">🗑</button>
        </div>
        <div class="kb-dir-step-title">${_esc(s.title)}</div>
      </div>`;
    });

    el.innerHTML = html;
    _attachDragEvents(el);
    if (_dirIdx >= 0) {
      document.getElementById('kds' + _dirIdx)
        ?.scrollIntoView({ block:'nearest', behavior:'smooth' });
    }
    // Giữ tf-step-list đồng bộ khi kichban thay đổi danh sách bước
    if (typeof tf_buildList === 'function') try { tf_buildList(); } catch(e) {}
  }

  /* ── Kéo thả: gắn sự kiện sau mỗi lần render ── */
  function _attachDragEvents(list) {
    const stepEls = list.querySelectorAll('.kb-dir-step[data-filt]');

    stepEls.forEach(el => {
      const i = parseInt(el.dataset.filt);

      el.addEventListener('contextmenu', e => {
        e.preventDefault();
        kbCtxClose();
        _kbCtxShow(i, e.clientX, e.clientY);
      });

      el.addEventListener('dragstart', e => {
        _dragFrom = i;
        el.classList.add('kds-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(i));
      });

      el.addEventListener('dragend', () => {
        _dragFrom = -1;
        el.classList.remove('kds-dragging');
        list.querySelectorAll('.kds-drag-above,.kds-drag-below')
          .forEach(x => x.classList.remove('kds-drag-above', 'kds-drag-below'));
      });

      el.addEventListener('dragover', e => {
        if (_dragFrom < 0 || _dragFrom === i) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        list.querySelectorAll('.kds-drag-above,.kds-drag-below')
          .forEach(x => x.classList.remove('kds-drag-above', 'kds-drag-below'));
        const mid = el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2;
        el.classList.add(e.clientY > mid ? 'kds-drag-below' : 'kds-drag-above');
      });

      el.addEventListener('dragleave', e => {
        if (!el.contains(e.relatedTarget))
          el.classList.remove('kds-drag-above', 'kds-drag-below');
      });

      el.addEventListener('drop', e => {
        e.preventDefault();
        const from = _dragFrom;
        if (from < 0 || from === i) return;
        list.querySelectorAll('.kds-drag-above,.kds-drag-below')
          .forEach(x => x.classList.remove('kds-drag-above', 'kds-drag-below'));
        const mid = el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2;
        const after = e.clientY > mid;
        let to = after ? i + 1 : i;
        if (to > from) to--;          // bù lệch do xoá phần tử trước
        _kbMoveStep(from, to);
      });
    });
  }

  /* ── Di chuyển bước trong TEACHING_STEPS theo filtered index ── */
  function _kbMoveStep(filtFrom, filtTo) {
    if (filtFrom === filtTo || filtFrom < 0 || filtTo < 0) return;
    const steps = _steps();
    if (filtFrom >= steps.length || filtTo >= steps.length) return;

    const movedStep  = steps[filtFrom];
    const targetStep = steps[filtTo];

    // Xoá khỏi TEACHING_STEPS
    const origFrom = TEACHING_STEPS.indexOf(movedStep);
    if (origFrom < 0) return;
    TEACHING_STEPS.splice(origFrom, 1);

    // Tìm vị trí mới của targetStep sau khi xoá
    const newOrigTarget = TEACHING_STEPS.indexOf(targetStep);
    if (newOrigTarget < 0) { TEACHING_STEPS.splice(origFrom, 0, movedStep); return; }

    // Chèn: dịch xuống → sau target; dịch lên → trước target
    TEACHING_STEPS.splice(filtTo > filtFrom ? newOrigTarget + 1 : newOrigTarget, 0, movedStep);

    // Cập nhật _dirIdx theo bước đang active
    if      (_dirIdx === filtFrom)                                  _dirIdx = filtTo;
    else if (filtFrom < filtTo && _dirIdx > filtFrom && _dirIdx <= filtTo) _dirIdx--;
    else if (filtFrom > filtTo && _dirIdx >= filtTo && _dirIdx < filtFrom) _dirIdx++;

    try { tf_buildList(); } catch(e) {}
    _renderList();
    _renderDetail();
    _renderCtrl();
  }

  /* ── Render panel lời thoại (right) ── */
  function _renderDetail() {
    const empty   = document.getElementById('kb-sp-empty');
    const content = document.getElementById('kb-sp-content');
    if (!empty || !content) return;

    const steps = _steps();
    const s = steps[_dirIdx];

    if (!s) {
      empty.style.display   = '';
      content.style.display = 'none';
      return;
    }
    empty.style.display   = 'none';
    content.style.display = 'flex';

    const origI = _origIdx(_dirIdx);
    const color = s.color || '#4fc3f7';

    /* Header */
    const hdr = document.getElementById('kb-sp-header');
    if (hdr) hdr.innerHTML =
      `<span class="kb-step-badge ${_BADGE[s.action]||''}" style="font-size:0.82em">${_ICONS[s.action]||''} ${_ALABEL[s.action]||s.action}</span>` +
      `<span style="font-size:0.75em;color:${color};margin-left:8px;font-weight:700">⏱ ~${s.time}p</span>` +
      `<span style="font-size:0.75em;color:#3a4a5a;margin-left:auto">Bước ${_dirIdx+1}/${steps.length}</span>` +
      `<span style="display:block;margin-top:8px;color:${color};font-size:1em;font-weight:700;width:100%">${_esc(s.title)}</span>`;

    /* Điền lời thoại và hướng dẫn vào textarea */
    const ttaEl  = document.getElementById('kb-sp-tts');
    const scrEl  = document.getElementById('kb-sp-script');
    if (ttaEl) ttaEl.value = _getTTS(_dirIdx) || '';
    if (scrEl) scrEl.value = s.script || '';

    /* Gán sự kiện cho các nút */
    const execBtn = document.getElementById('kb-sp-exec-btn');
    const readBtn = document.getElementById('kb-sp-read-btn');
    const saveBtn = document.getElementById('kb-sp-save-btn');
    const delBtn  = document.getElementById('kb-sp-del-btn');

    if (execBtn) execBtn.onclick = function() { kbDirRead(_dirIdx); };

    const fsBtnEl  = document.getElementById('kb-sp-exec-fs-btn');
    const simBtnEl = document.getElementById('kb-sp-exec-sim-btn');
    if (fsBtnEl)  fsBtnEl.onclick  = function() { kbDirStart('fullscreen'); };
    if (simBtnEl) simBtnEl.onclick = function() { kbDirStart('simulate');   };
    if (readBtn) readBtn.onclick = function() { kbDirRead(_dirIdx); };
    if (delBtn)  delBtn.onclick  = function() { kbDirDeleteStep(_dirIdx); };
    if (saveBtn) saveBtn.onclick = function() {
      /* Lưu lời thoại vào STEP_TTS */
      if (origI < 0) return;
      if (ttaEl) {
        STEP_TTS[origI] = ttaEl.value;
        _saveTtsEdits();
      }
      /* Lưu hướng dẫn vào TEACHING_STEPS */
      if (scrEl && typeof TEACHING_STEPS !== 'undefined' && TEACHING_STEPS[origI]) {
        TEACHING_STEPS[origI].script = scrEl.value;
        SCRIPT_EDITS[origI] = scrEl.value;
        _saveScriptEdits();
      }
      saveBtn.textContent = '✓ Đã lưu';
      setTimeout(function() { saveBtn.textContent = '💾 Lưu'; }, 1500);
    };

    /* Điều hướng */
    const navEl = document.getElementById('kb-sp-nav');
    if (navEl) {
      navEl.innerHTML =
        (_dirIdx > 0 ? `<button class="kb-pick-btn reset" style="flex:1" onclick="kbDirSelect(${_dirIdx-1})">← Trước</button>` : '') +
        (_dirIdx < steps.length-1 ? `<button class="kb-pick-btn dial" style="flex:1" onclick="kbDirSelect(${_dirIdx+1})">Tiếp →</button>` : '');
    }

    /* Cập nhật preview nút Dán */
    _kbCQUpdatePastePreview && _kbCQUpdatePastePreview();
    if (typeof _kbQPanelRender === 'function') _kbQPanelRender();
    if (typeof _kbPgPanelRender === 'function') _kbPgPanelRender();
  }

  /* ── Render progress + play button ── */
  function _renderCtrl() {
    const btn = document.getElementById('kb-dir-play-btn');
    if (btn) {
      if (_playing && !_paused) {
        btn.textContent = '⏸ Tạm dừng';
        btn.className   = 'kb-pick-btn reset';
      } else if (_paused) {
        btn.textContent = '▶ Tiếp tục';
        btn.className   = 'kb-pick-btn spin';
      } else {
        btn.textContent = '▶ Tự động dạy';
        btn.className   = 'kb-pick-btn spin';
      }
    }

    const prog = document.getElementById('kb-dir-progress');
    if (!prog) return;
    const steps = _steps();
    const done  = Math.max(0, _dirIdx + 1);
    const pct   = steps.length ? (done / steps.length * 100).toFixed(1) : 0;
    prog.innerHTML = `
      <div style="height:3px;background:#1a2540;margin:6px 12px 0;border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#4fc3f7,#a78bfa);border-radius:2px;transition:width 0.35s"></div>
      </div>
      <div style="font-size:0.68em;color:#3a4a5a;text-align:center;padding:3px 12px 6px">
        ${done}/${steps.length} bước &nbsp;·&nbsp; ${_playing ? (_paused ? '⏸ Tạm dừng' : '🔊 Đang dạy...') : 'Sẵn sàng'}
      </div>`;
  }

  /* ════════════════════════════════════
     5. PUBLIC API
  ════════════════════════════════════ */

  /* Tính origIdx bằng cách đếm trực tiếp (không dùng indexOf) – chỉ đếm bước slide */
  function _filtToOrig(filtIdx) {
    let count = -1;
    for (let j = 0; j < TEACHING_STEPS.length; j++) {
      if (TEACHING_STEPS[j].action === 'slide' && !_deletedOrigIdx.has(j)) {
        count++;
        if (count === filtIdx) return j;
      }
    }
    return -1;
  }

  /* Ngược của _filtToOrig: origIdx (trong TEACHING_STEPS) → filtIdx (vị trí trong mục lục).
     Trả về -1 nếu bước không hiển thị trong mục lục (không phải slide, hoặc đã xóa). */
  function _origToFilt(origIdx) {
    if (origIdx < 0 || origIdx >= TEACHING_STEPS.length) return -1;
    if (TEACHING_STEPS[origIdx].action !== 'slide' || _deletedOrigIdx.has(origIdx)) return -1;
    let count = -1;
    for (let j = 0; j <= origIdx; j++) {
      if (TEACHING_STEPS[j].action === 'slide' && !_deletedOrigIdx.has(j)) count++;
    }
    return count;
  }

  /* ════════════════════════════════════
     ĐỒNG BỘ NGƯỢC: LỘ TRÌNH → MỤC LỤC
     Do teaching-flow.js gọi tới (tf_goTo khi điều hướng, tf_moveStep khi sắp xếp).
     Vẽ lại Mục lục theo trạng thái TEACHING_STEPS hiện tại + sáng đúng bước origIdx.
     KHÔNG gọi lại tf_goTo (tránh vòng lặp) – _renderList tự gọi tf_buildList để
     làm tươi danh sách lộ trình, đủ để hai bên luôn khớp.
  ════════════════════════════════════ */
  window._kbDirGoToByOrig = function (origIdx) {
    const filt = _origToFilt(origIdx);
    if (filt >= 0) {                       // bước slide hợp lệ → chuyển highlight
      _dirIdx = filt;
      window._kbSelectedOrigIdx = origIdx;
    }
    // Với break/đã xóa: giữ nguyên highlight nhưng vẫn vẽ lại để khớp thứ tự mới
    _renderList();
    _renderDetail();
    _renderCtrl();
  };

  /* ════════════════════════════════════
     HIGHLIGHT "SLIDE ĐANG CHIẾU" TRONG MỤC LỤC
     Do set-mode.js gọi mỗi khi Reveal đổi slide (mũi tên / phím < > / điều hướng bất kỳ).
     Đánh dấu hàng có hv khớp slide hiện tại bằng class .kds-slide-cur — KHÔNG đổi
     _dirIdx (bước đang soạn lời thoại), nên không phá panel kịch bản. Toggle trực tiếp
     trên DOM (không rebuild) cho mượt; _renderList cũng tự áp lại theo _curSlideHV. */
  function _kbHighlightSlide(h, v) {
    _curSlideHV = (h == null) ? null : [h, v || 0];
    const list = document.getElementById('kb-dir-list');
    if (!list) return;
    list.querySelectorAll('.kb-dir-step').forEach(el => {
      const filt = parseInt(el.dataset.filt, 10);
      if (filt === _dirIdx) { el.classList.remove('kds-slide-cur'); return; }
      const s  = _steps()[filt];
      const hv = s && s.hv;
      el.classList.toggle('kds-slide-cur',
        !!hv && _curSlideHV && hv[0] === _curSlideHV[0] && (hv[1]||0) === _curSlideHV[1]);
    });
  }
  window._kbSyncSlide = _kbHighlightSlide;

  /* Làm tươi highlight theo slide Reveal hiện tại (gọi khi mở overlay Kịch bản). */
  window._kbRefreshSlideHighlight = function () {
    try {
      if (typeof Reveal !== 'undefined' && typeof Reveal.getIndices === 'function') {
        const ix = Reveal.getIndices();
        _kbHighlightSlide(ix.h, ix.v || 0);
      }
    } catch (e) {}
  };

  /* Chọn bước */
  window.kbDirSelect = function (i) {
    _dirIdx = i;
    /* Cache origIdx để cau-hoi.js dùng gán bước */
    window._kbSelectedOrigIdx = _filtToOrig(i);
    _renderList();
    _renderDetail();
    _renderCtrl();
    const s = _steps()[i];
    if (s) {
      try { window.kbPreviewSync && kbPreviewSync(s, _origIdx(i)); } catch(e) {}
    }
    // Sync _tf_step với _dirIdx khi ở kichban (guard tránh vòng lặp)
    if (window._currentAppMode === 'kichban' && !window._kbDirSelectSyncing && typeof tf_goTo === 'function') {
      const orig = _filtToOrig(i);
      if (orig >= 0) {
        window._kbDirSelectSyncing = true;
        tf_goTo(orig);
        window._kbDirSelectSyncing = false;
      }
    }
  };

  /* Xóa bước khỏi lộ trình (không xóa khỏi TEACHING_STEPS gốc) */
  window.kbDirDeleteStep = function (i) {
    if (_playing) return;
    const s = _steps()[i];
    if (!s) return;
    if (!confirm('Xóa bước "' + s.title + '"?\n\nLời thoại của bước này cũng sẽ bị xóa.\nĐể khôi phục, hãy tải lại trang (F5).')) return;
    const origIdx = _origIdx(i);
    if (origIdx < 0) return;

    /* Xóa khỏi danh sách ẩn + xóa lời thoại TTS */
    _deletedOrigIdx.add(origIdx);
    _markSlideUncounted(origIdx, true);
    delete STEP_TTS[origIdx];
    delete SCRIPT_EDITS[origIdx];
    _saveDeleted();
    _saveTtsEdits();
    _saveScriptEdits();
    _syncRevealSlideCount();
    try { tf_buildList(); } catch(e) {}   // đồng bộ lộ trình kịch bản

    /* Cập nhật _dirIdx sau khi xóa */
    const newSteps = _steps();
    if (_dirIdx >= newSteps.length) _dirIdx = newSteps.length - 1;
    else if (_dirIdx === i && _dirIdx > 0) _dirIdx = i - 1;

    _renderList();
    _renderDetail();
    _renderCtrl();
  };

  /* Khôi phục tất cả bước đã xóa */
  window.kbDirRestoreAll = function () {
    _deletedOrigIdx.forEach(origIdx => { _markSlideUncounted(origIdx, false); });
    _deletedOrigIdx.clear();
    _saveDeleted();
    /* STEP_TTS đã bị delete() → cần reload trang để reset đầy đủ */
    _syncRevealSlideCount();
    _dirIdx = -1;
    try { tf_buildList(); } catch(e) {}   // đồng bộ lộ trình kịch bản
    _renderList();
    _renderDetail();
    _renderCtrl();
  };

  /* Thực hiện bước (chuyển mode, điều hướng slide đúng h-v, mở playground)
     – Dùng _TF_SLIDE_HV từ teaching-flow.js để navigate đúng vị trí.
     – Gọi tf_goTo() để đồng bộ đánh dấu vị trí với lộ trình kịch bản. */
  window.kbDirExecute = function (i) {
    const s = _steps()[i];
    if (!s) return;

    const origI = _origIdx(i);
    window._kbSelectedOrigIdx = origI; // cập nhật để gán câu hỏi hoạt động đúng

    /* ── Điều hướng slide với tọa độ (h, v) chính xác ── */
    const hv = (typeof _TF_SLIDE_HV !== 'undefined') ? _TF_SLIDE_HV[origI] : null;
    if (s.slide !== null && s.slide !== undefined) {
      try {
        if (hv) Reveal.slide(hv[0], hv[1]);
        else    Reveal.slide(s.slide, 0);
      } catch(e) {}
    }
    /* Đồng bộ toàn bộ trạng thái (slide + mode + tab/preset) sang panel preview */
    try { window.kbPreviewSync && kbPreviewSync(s, origI); } catch(e) {}

    /* ── Đồng bộ vị trí với lộ trình kịch bản (slide-nav panel) ── */
    if (typeof tf_goTo === 'function') {
      try { tf_goTo(origI); } catch(e) {}
    }

    /* ── Chuyển chế độ ── */
    switch (s.action) {
      case 'slide':
        setMode('slides');
        break;
      case 'cq':
        setMode('cq');
        if (s.cqTab !== null && s.cqTab !== undefined) {
          setTimeout(() => { try { cq_switchTab(s.cqTab); } catch(e) {} }, 80);
        }
        if (s.cqId) {
          setTimeout(() => { try { cq_focusQuestion(s.cqId); } catch(e) {} }, 120);
        }
        break;
      case 'chon':
        setMode('chon');
        setTimeout(() => { try { chon_switchTab(2); } catch(e) {} }, 80);
        break;
      case 'code':
        if (s.preset) { try { currentPresetKey = s.preset; } catch(e) {} }
        setMode('code');
        break;
    }
  };

  /* Đọc lời thoại TTS – hiện karaoke inline trong panel kịch bản */
  window.kbDirRead = function (i) {
    const ttsEl     = document.getElementById('kb-sp-tts');
    const karaokeEl = document.getElementById('kb-sp-karaoke');
    const readBtn   = document.getElementById('kb-sp-read-btn');

    /* Ưu tiên lấy text từ textarea đang hiển thị (có thể đã sửa) */
    const tts = (ttsEl ? ttsEl.value.trim() : '') || _getTTS(i) || '';
    if (!tts) return;

    /* Ẩn textarea, hiện karaoke */
    if (ttsEl)     ttsEl.style.display     = 'none';
    if (karaokeEl) karaokeEl.style.display = '';
    if (readBtn)   { readBtn.textContent = '⏹ Dừng'; readBtn.onclick = stopKbRead; }

    function stopKbRead() {
      try { window.spStop && spStop(); } catch(e) {}
      _onKbReadEnd();
    }

    function _onKbReadEnd() {
      if (ttsEl)     ttsEl.style.display     = '';
      if (karaokeEl) karaokeEl.style.display  = 'none';
      if (readBtn)   { readBtn.textContent = '🔊 Đọc lời thoại'; readBtn.onclick = function() { kbDirRead(_dirIdx); }; }
    }

    try {
      spReadText(tts, karaokeEl, _onKbReadEnd);
    } catch(e) {
      _onKbReadEnd();
    }
  };

  /* ════════════════════════════════════
     6. AUTO-PLAY
     Luồng CQ:
       TTS đọc câu hỏi
       → ❓ fullscreen + đếm 30s suy nghĩ (cq_presentInteractive)
       → 🎲 quay số không trùng (chon_pickFromPool) ~3s
       → ❓ fullscreen + đếm 15s trả lời (cq_presentInteractive)
       → tiếp bước tiếp
  ════════════════════════════════════ */

  /* _gen: tăng khi STOP → mọi callback đang chờ đều tự hủy */
  let _gen = 0;

  /* Tạo setTimeout gắn với generation hiện tại */
  function _sched(fn, delay) {
    const g = _gen;
    return setTimeout(() => {
      if (_gen !== g || !_playing || _paused) return;
      fn();
    }, delay);
  }

  /* ── Hook: speech.js gọi sau khi đọc xong ── */
  function _onSpeechEnd() {
    if (!_playing || _paused) return;
    const s = _steps()[_dirIdx];
    if (!s) { _sched(_advance, 2000); return; }

    if (!_simMode && s.action === 'cq') {
      /* CQ step toàn màn hình → chạy luồng tương tác đầy đủ */
      _runCQFlow(s);
    } else {
      /* Các step khác: chờ cố định rồi advance */
      const delay = s.action === 'chon' ? 7000
                  : s.action === 'code' ? 4000
                  : 2000;
      _sched(_advance, delay);
    }
  }

  /* ══════════════════════════════════════════════════════════
     Hiển thị câu hỏi fullscreen với đồng hồ đếm ngược tùy chỉnh.
     Không dùng cq_presentInteractive để tránh tự bấm đáp án sớm.

     @param qId        – ID câu hỏi
     @param secs       – số giây đếm ngược
     @param autoReveal – nếu true, tự hiện đáp án khi hết giờ rồi đóng 3s
     @param onDone     – callback khi hoàn tất (hết giờ + đóng xong)
  ══════════════════════════════════════════════════════════ */
  function _kbCqCountdown(qId, secs, autoReveal, onDone) {
    const myGen = _gen;

    try { cq_present(qId); } catch(e) { onDone(); return; }

    /* Kích hoạt countdown ring (có sẵn trong #cq-present) */
    const ring  = document.getElementById('cqp-countdown-ring');
    const numEl = document.getElementById('cqp-countdown-num');
    if (ring)  { ring.classList.remove('cqp-hidden'); ring.style.boxShadow = ''; ring.style.background = 'conic-gradient(#ffd43b 100%, #1e2a3a 100%)'; }
    if (numEl) numEl.textContent = secs;

    let remaining = secs;
    const iv = setInterval(() => {
      /* Hủy nếu bị stop */
      if (_gen !== myGen) {
        clearInterval(iv);
        try { cq_presClose(); } catch(e) {}
        return;
      }

      remaining--;
      if (numEl) numEl.textContent = Math.max(0, remaining);
      if (ring) {
        const pct = (remaining / secs) * 100;
        ring.style.background = `conic-gradient(#ffd43b ${pct}%, #1e2a3a ${pct}%)`;
        if (remaining <= 5 && remaining > 0)
          ring.style.boxShadow = '0 0 22px rgba(255,152,0,0.6)';
      }

      if (remaining <= 0) {
        clearInterval(iv);
        if (ring) { ring.classList.add('cqp-hidden'); ring.style.boxShadow = ''; }

        if (!autoReveal) {
          /* Pha suy nghĩ: chỉ đóng, KHÔNG hiện đáp án */
          try { cq_presClose(); } catch(e) {}
          onDone();
        } else {
          /* Pha trả lời: hiện đáp án, đóng sau 3s */
          const msg = document.getElementById('cqp-student-msg');
          if (msg) {
            msg.textContent = '⏰ Hết giờ! Đây là đáp án đúng:';
            msg.className   = 'cqp-timeout';
            msg.style.display = 'block';
          }
          try { cq_presToggleAns(); } catch(e) {}
          setTimeout(() => {
            if (_gen !== myGen) return;
            try { cq_presClose(); } catch(e) {}
            onDone();
          }, 3000);
        }
      }
    }, 1000);
  }

  /* ── Luồng tương tác CQ ──
     Pha 1: fullscreen + 30s suy nghĩ (đóng, KHÔNG reveal)
     Pha 2: quay số không trùng (~3s)
     Pha 3: fullscreen + 15s trả lời → auto-reveal → đóng
  ── */
  function _runCQFlow(s) {
    const myGen = _gen;

    const catId = (typeof CQ_CATS !== 'undefined' && s.cqTab != null)
      ? (CQ_CATS[s.cqTab] || {}).id : null;
    const data  = (typeof cq_getData === 'function') ? cq_getData() : null;
    const q     = catId && data ? data.questions.find(x => x.cat === catId) : null;

    if (!q) { _sched(_advance, 2000); return; }

    /* ── Pha 1: 30s suy nghĩ – đóng khi hết giờ, chưa reveal ── */
    _kbCqCountdown(q.id, 30, false, () => {
      if (_gen !== myGen || !_playing || _paused) return;

      /* ── Pha 2: quay số không trùng ── */
      try { setMode('chon'); } catch(e) {}
      setTimeout(() => { try { chon_switchTab(2); } catch(e) {} }, 80);
      setTimeout(() => {
        if (_gen !== myGen || !_playing || _paused) return;
        try { chon_pickFromPool(); } catch(e) {}
      }, 200);

      /* Thời gian chờ animation = waitSec + buffer */
      const spinMs = (() => {
        const v = parseFloat(document.getElementById('cPoolWait')?.value) || 1;
        return Math.max(1, v) * 1000 + 900;
      })();

      setTimeout(() => {
        if (_gen !== myGen || !_playing || _paused) return;

        /* ── Pha 3: quay về CQ + 15s trả lời → auto-reveal ── */
        try { setMode('cq'); } catch(e) {}
        setTimeout(() => { try { cq_switchTab(s.cqTab); } catch(e) {} }, 80);
        setTimeout(() => {
          if (_gen !== myGen || !_playing || _paused) return;
          _kbCqCountdown(q.id, 15, true, () => {
            if (_gen !== myGen || !_playing || _paused) return;
            _advance();
          });
        }, 500);
      }, spinMs);
    });
  }

  /* ── Chuyển sang bước tiếp ── */
  function _advance() {
    if (!_playing || _paused) return;
    const steps = _steps();
    if (_dirIdx < steps.length - 1) {
      _dirIdx++;
      _autoStep();
    } else {
      kbDirStop();
    }
  }

  /* ── Chạy bước hiện tại ── */
  function _autoStep() {
    if (!_playing || _paused) return;
    _renderList();
    _renderDetail();
    _renderCtrl();
    if (_simMode) {
      /* Mô phỏng: chỉ cập nhật preview, không mở overlay ngoài */
      const s = _steps()[_dirIdx];
      if (s) try { window.kbPreviewSync && kbPreviewSync(s, _origIdx(_dirIdx)); } catch(e) {}
    } else {
      kbDirExecute(_dirIdx);
    }
    _sched(() => kbDirRead(_dirIdx), 400);
  }

  /* ── Bắt đầu chạy tất cả bước theo chế độ ── */
  window.kbDirStart = function (mode) {
    _simMode = (mode === 'simulate');
    if (_dirIdx < 0) _dirIdx = 0;
    if (_playing) kbDirStop();           // dừng nếu đang chạy
    kbDirToggleAutoPlay();               // rồi bắt đầu
  };

  /* ── Toggle auto-play (start / pause / resume) ── */
  window.kbDirToggleAutoPlay = function () {
    if (_playing && !_paused) {
      /* Tạm dừng */
      _paused = true;
      try { spPause();      } catch(e) {}
      try { cq_presClose(); } catch(e) {} // dừng fullscreen đang đếm
      _renderCtrl();
    } else if (_playing && _paused) {
      /* Tiếp tục – chạy lại từ bước hiện tại */
      _paused = false;
      try { spStop(); } catch(e) {}  // xóa TTS cũ
      _autoStep();
      _renderCtrl();
    } else {
      /* Bắt đầu */
      _playing = true;
      _paused  = false;
      window._kbOnSpeechEnd = _onSpeechEnd;
      if (_dirIdx < 0) _dirIdx = 0;

      /* Khởi động đồng hồ 45 phút nếu chưa chạy */
      try {
        const ltEl = document.getElementById('lesson-timer');
        if (ltEl && !ltEl.classList.contains('lt-running')) ltToggle();
      } catch(e) {}

      _autoStep();
      _renderCtrl();
    }
  };

  /* ── Dừng hoàn toàn ── */
  window.kbDirStop = function () {
    _playing = false;
    _paused  = false;
    _simMode = false;
    _gen++;                          // hủy tất cả callback đang chờ
    window._kbOnSpeechEnd = null;
    try { spStop();       } catch(e) {}
    try { cq_presClose(); } catch(e) {} // đóng fullscreen nếu đang mở
    _renderList();
    _renderCtrl();
  };

  /* Khởi động lại từ bước đầu */
  window.kbDirRestart = function () {
    kbDirStop();
    _dirIdx = -1;
    _renderList();
    _renderDetail();
    _renderCtrl();
  };

  /* ════════════════════════════════════
     7. STUDENT PICKER (giữ nguyên từ bản cũ)
  ════════════════════════════════════ */
  let _pickedSet = new Set();

  window.kbLoadClassList = function () {
    if (typeof CHON_STUDENTS === 'undefined') return;
    const ta = document.getElementById('kb-student-textarea');
    if (ta) ta.value = CHON_STUDENTS.map(s => s.name).join('\n');
  };

  window.kbPickStudent = function () {
    const all = (document.getElementById('kb-student-textarea')?.value || '')
      .split('\n').map(s => s.trim()).filter(Boolean);
    if (!all.length) { alert('Vui lòng nhập danh sách học sinh trước.'); return; }

    const rem = all.filter(s => !_pickedSet.has(s));
    const resEl = document.getElementById('kb-pick-result');
    const allEl = document.getElementById('kb-pick-all');

    if (!rem.length) {
      resEl?.classList.remove('show');
      allEl?.classList.add('show');
      return;
    }
    allEl?.classList.remove('show');

    const chosen = rem[Math.floor(Math.random() * rem.length)];
    _pickedSet.add(chosen);
    const left = all.filter(s => !_pickedSet.has(s)).length;

    document.getElementById('kb-pick-name').textContent = chosen;
    document.getElementById('kb-pick-meta').textContent = `Còn lại: ${left}/${all.length}`;
    resEl?.classList.remove('pop');
    resEl?.classList.add('show');
    void resEl?.offsetWidth;
    resEl?.classList.add('pop');
  };

  window.kbResetPick = function () {
    _pickedSet.clear();
    document.getElementById('kb-pick-result')?.classList.remove('show');
    document.getElementById('kb-pick-all')?.classList.remove('show');
  };

  /* ════════════════════════════════════
     8. INIT
  ════════════════════════════════════ */
  function _esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ════════════════════════════════════════════════════════
     KB-Q-PANEL – Quản lý câu hỏi dán trực tiếp trong bước CQ
  ════════════════════════════════════════════════════════ */
  let _kbqPickerOpen = false;
  let _kbqSearch     = '';

  /* Toast nổi hiển thị cảnh báo khóa dán */
  function _kbPasteBlockToast(msg) {
    let el = document.getElementById('_kb-paste-block-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = '_kb-paste-block-toast';
      el.style.cssText = 'position:fixed;top:18px;left:50%;transform:translateX(-50%);'
        + 'padding:10px 22px;border-radius:8px;font-size:14px;font-weight:700;'
        + 'background:#ef4444;color:#fff;z-index:99999;pointer-events:none;'
        + 'box-shadow:0 4px 14px rgba(0,0,0,.35);transition:opacity .3s;opacity:0;white-space:nowrap;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 3000);
  }

  /* Khóa dán bị chặn: nhảy đến câu đang dán + cảnh báo.
     Ưu tiên nhảy đến câu trong thư viện (cq_navToPastedQuestion tự hiện toast);
     fallback: cảnh báo + nhảy đến bước trong kịch bản. */
  function _kbNavToPastedStep(pastedQ) {
    if (typeof window.cq_navToPastedQuestion === 'function') {
      window.cq_navToPastedQuestion(pastedQ);
      return;
    }
    _kbPasteBlockToast('⚠️ Tắt dán câu hỏi hiện tại trước!');
    if (!pastedQ.kbStepRef) return;
    const refOrigIdx = pastedQ.kbStepRef.idx;
    const steps = _steps();
    for (let fi = 0; fi < steps.length; fi++) {
      if (_origIdx(fi) === refOrigIdx) {
        kbDirSelect(fi);
        return;
      }
    }
  }

  /* Tìm câu hỏi đã gán tường minh (qua kbStepRef). Tự sửa idx lỗi thời nếu có. */
  function _kbQFindLinked(s, origI) {
    if (typeof cq_getData !== 'function') return null;
    const data = cq_getData();
    let q = data.questions.find(x => x.kbStepRef && x.kbStepRef.idx === origI);
    if (q) return q;
    if (s.cqId) {
      q = data.questions.find(x => x.id === s.cqId);
      if (q) {
        q.kbStepRef = {
          idx: origI,
          title: s.title || '',
          color: s.color || '#4fc3f7',
          phase: s.phase || ''
        };
        try { cq_saveData(data); } catch(e) {}
        return q;
      }
    }
    return null;
  }

  /* Render panel vào #kb-q-panel — gọi từ _renderDetail */
  function _kbQPanelRender() {
    const panel = document.getElementById('kb-q-panel');
    if (!panel) return;

    const s = _steps()[_dirIdx];
    if (!s || s.action !== 'cq') { panel.innerHTML = ''; return; }

    const origI  = _origIdx(_dirIdx);
    const catIdx = s.cqTab != null ? s.cqTab : 2;
    const cat    = (typeof CQ_CATS !== 'undefined') ? CQ_CATS[catIdx] : null;
    const catId  = cat ? cat.id    : '';
    const catClr = cat ? cat.color : '#4fc3f7';

    const linked = _kbQFindLinked(s, origI);

    if (_kbqPickerOpen) {
      _kbQRenderPicker(panel, catId, catClr, origI, linked);
    } else {
      _kbQRenderMain(panel, linked, catClr, catId, origI);
    }
  }

  /* ── Hiển thị chính: câu đã dán hoặc trạng thái rỗng ── */
  function _kbQRenderMain(panel, q, catClr, catId, origI) {
    let inner = '';

    if (q) {
      /* Tính vị trí bước (loại trừ bước đã xóa khỏi mục lục) */
      let stepPos = 0;
      if (typeof TEACHING_STEPS !== 'undefined') {
        for (let i = 0; i <= origI && i < TEACHING_STEPS.length; i++)
          if (TEACHING_STEPS[i].action !== 'break' && !_deletedOrigIdx.has(i)) stepPos++;
      }
      const qCode = q.id.replace(/^(cq|q)/i, '');
      const TYPE_LBL = { mc:'TRẮC NGHIỆM', tl:'TỰ LUẬN', fill:'ĐIỀN CHỖ TRỐNG', match:'NỐI TỪ' };
      const typeLbl = TYPE_LBL[q.type||'mc'] || 'TRẮC NGHIỆM';

      /* Preview options */
      let optsHtml = '';
      if ((q.type||'mc') === 'mc' && q.opts) {
        optsHtml = '<div class="kbqp-opts">' +
          q.opts.map((o, i) => `<div class="kbqp-opt${i===q.ans?' kbqp-correct':''}">
            <span class="kbqp-lbl">${'ABCD'[i]}</span>
            <span>${_esc(o)}</span>
          </div>`).join('') +
        '</div>';
      } else if (q.type === 'tl') {
        optsHtml = `<div class="kbqp-tl">${_esc((q.explain||'').slice(0,120))}${(q.explain||'').length>120?'…':''}</div>`;
      } else if (q.type === 'fill' && q.blanks) {
        optsHtml = `<div class="kbqp-tl">Đáp án: ${_esc(q.blanks.join(' · '))}</div>`;
      }

      inner = `
        <div class="kbqp-hdr">
          <span class="kbqp-title">📌 Câu hỏi đã dán</span>
          <span class="kbqp-meta" style="color:${catClr}">B${stepPos} · #${qCode}</span>
          <button class="kbqp-btn-remove" onclick="_kbQUnassign('${q.id}')" title="Bỏ dán (mỗi slide chỉ 1 câu — bỏ rồi mới dán câu khác)">✕</button>
        </div>
        <div class="kbqp-type-row">
          <span class="kbqp-type-badge" style="background:${catClr}22;color:${catClr};border:1px solid ${catClr}44">${typeLbl}</span>
        </div>
        <div class="kbqp-q">${_esc(q.q)}</div>
        ${optsHtml}`;
    } else {
      inner = `
        <div class="kbqp-hdr">
          <span class="kbqp-title">📌 Câu hỏi</span>
          <span class="kbqp-empty-hint">Chưa có câu hỏi nào được dán</span>
        </div>
        <button class="kbqp-paste-btn" onclick="_kbQOpenPicker()">📌 Chọn & dán câu hỏi</button>`;
    }

    panel.innerHTML = `<div class="kb-q-panel-wrap">${inner}</div>`;
  }

  /* ── Picker: danh sách câu hỏi trong cùng danh mục ── */
  function _kbQRenderPicker(panel, catId, catClr, origI, currentQ) {
    const all = (typeof cq_getQuestionsByCat === 'function')
      ? cq_getQuestionsByCat(catId) : [];

    const filtered = _kbqSearch
      ? all.filter(q => q.q.toLowerCase().includes(_kbqSearch.toLowerCase()))
      : all;

    const TYPE_LBL = { mc:'MC', tl:'TL', fill:'Fill', match:'Nối' };
    const items = filtered.map(q => {
      const isActive = currentQ && currentQ.id === q.id;
      const qCode    = q.id.replace(/^(cq|q)/i, '');
      return `<button class="kbqp-item${isActive?' kbqp-item-active':''}"
        onclick="_kbQAssign('${q.id}',${origI})" title="${_esc(q.q)}">
        <span class="kbqp-item-badge">${TYPE_LBL[q.type||'mc']||'MC'} · #${qCode}</span>
        <span class="kbqp-item-q">${_esc(q.q.slice(0,80))}${q.q.length>80?'…':''}</span>
      </button>`;
    }).join('');

    panel.innerHTML = `<div class="kb-q-panel-wrap kb-q-picker-wrap">
      <div class="kbqp-hdr">
        <span class="kbqp-title">📌 Chọn câu hỏi</span>
        <button class="kbqp-btn-remove" onclick="_kbQClosePicker()" title="Đóng">✕</button>
      </div>
      <input class="kbqp-search" placeholder="🔍 Tìm câu hỏi…" value="${_esc(_kbqSearch)}"
        oninput="_kbqSearch=this.value;_kbQPanelRender()">
      <div class="kbqp-list">
        ${items || '<div class="kbqp-no-items">Không có câu hỏi nào phù hợp.</div>'}
      </div>
    </div>`;
  }

  window._kbQOpenPicker = function() {
    const s = _steps()[_dirIdx];
    const origI = _origIdx(_dirIdx);
    const linked = s ? _kbQFindLinked(s, origI) : null;
    /* Per-slide: bước đã có câu → buộc bỏ dán trước (nhảy đến câu đang dán) rồi mới dán câu mới */
    if (linked) {
      _kbNavToPastedStep(linked);
      return;
    }
    _kbqPickerOpen = true;
    _kbqSearch = '';
    _kbQPanelRender();
  };
  window._kbQClosePicker = function() { _kbqPickerOpen = false; _kbQPanelRender(); };

  window._kbQAssign = function(qId, origI) {
    if (typeof cq_getData !== 'function') return;
    const data = cq_getData();
    const s      = (typeof TEACHING_STEPS !== 'undefined') ? TEACHING_STEPS[origI] : null;
    const oldCqId = s ? s.cqId : null;
    if (!s || s.action !== 'cq') return;

    /* Gỡ câu cũ khỏi bước này (tìm theo idx hiện tại hoặc cqId cũ phòng idx lỗi thời) */
    data.questions.forEach(q => {
      if (q.kbStepRef && (q.kbStepRef.idx === origI || (oldCqId && q.id === oldCqId)))
        delete q.kbStepRef;
    });

    /* Gán câu mới */
    const newQ = data.questions.find(q => q.id === qId);
    if (newQ) {
      newQ.kbStepRef = {
        idx:   origI,
        title: s ? s.title : '',
        color: s ? s.color : '#4fc3f7',
        phase: s ? s.phase : ''
      };
      const catIdx = _catIndexForQuestion(newQ);
      if (catIdx >= 0) s.cqTab = catIdx;
      s.cqId = qId;
    }

    /* Cập nhật tiêu đề bước nếu còn placeholder (tạo từ kbCQPaste không có câu pre-selected) */
    if (s && s._extra && newQ) {
      const snippet = (newQ.q || '').slice(0, 48) + ((newQ.q || '').length > 48 ? '…' : '');
      s.title = '❓ ' + snippet;
      s.script = _questionScript(newQ);
      if (newQ.kbStepRef) newQ.kbStepRef.title = s.title;
    }
    if (typeof cq_saveData === 'function') cq_saveData(data);
    if (s && s._extra) _saveExtra();
    _kbqPickerOpen = false;
    _refreshQuestionAssignmentUI();
  };

  window._kbQUnassign = function(qId) {
    if (typeof cq_getData !== 'function') return;
    const data = cq_getData();
    const q    = data.questions.find(x => x.id === qId);
    if (q) {
      if (q.kbStepRef != null) {
        const s = TEACHING_STEPS[q.kbStepRef.idx];
        if (s && s.cqId === qId) {
          s.cqId = null;
          if (s._extra) _saveExtra();
        }
      }
      delete q.kbStepRef;
    }
    if (typeof cq_saveData === 'function') cq_saveData(data);
    _refreshQuestionAssignmentUI();
  };

  /* Expose cho _renderDetail gọi */
  window._kbQPanelRender = _kbQPanelRender;

  /* Trả về original index của bước đang chọn trong kịch bản (-1 nếu chưa chọn) */
  window._kbGetSelectedOrigIdx = function () {
    return (window._kbSelectedOrigIdx != null) ? window._kbSelectedOrigIdx : -1;
  };

  /* ── Tự động gán câu hỏi vào tất cả bước CQ — ĐÃ VÔ HIỆU ──
     Mâu thuẫn với quy tắc "mỗi slide chỉ 1 câu, dán thủ công". Giữ no-op để không
     vô tình gán hàng loạt; phần thân cũ bên dưới được giữ lại để tham khảo. */
  window.kbAutoAssignQuestions = function () {
    return;
  };

  window._kbAutoAssignQuestions_DISABLED = function () {
    if (typeof TEACHING_STEPS === 'undefined') return;
    if (typeof cq_getData !== 'function')      return;

    const data = cq_getData();
    const cats = (typeof CQ_CATS !== 'undefined') ? CQ_CATS : [];

    /* Tập các câu hỏi đã được gán (bất kỳ bước nào) */
    const assigned = new Set(
      data.questions.filter(q => q.kbStepRef != null).map(q => q.id)
    );

    let count = 0;

    TEACHING_STEPS.forEach((s, origIdx) => {
      if (s.action !== 'cq' || s.cqTab == null) return;

      /* Bước đã có câu hỏi → bỏ qua */
      const alreadyLinked = data.questions.some(
        q => q.kbStepRef && q.kbStepRef.idx === origIdx
      );
      if (alreadyLinked) return;

      /* Bước có câu hỏi cụ thể → gán trực tiếp theo ID */
      if (s.cqId) {
        const qById = data.questions.find(q2 => q2.id === s.cqId);
        if (qById && !qById.kbStepRef) {
          qById.kbStepRef = {
            idx:   origIdx,
            title: s.title,
            color: s.color || '#4fc3f7',
            phase: s.phase
          };
          assigned.add(qById.id);
          count++;
        }
        return;
      }

      const catId = cats[s.cqTab] ? cats[s.cqTab].id : null;
      if (!catId) return;

      /* Tìm câu hỏi đầu tiên cùng danh mục chưa được gán */
      const q = data.questions.find(
        q => q.cat === catId && !assigned.has(q.id)
      );
      if (!q) return;

      q.kbStepRef = {
        idx:   origIdx,
        title: s.title,
        color: s.color || '#4fc3f7',
        phase: s.phase
      };
      assigned.add(q.id);
      count++;
    });

    if (typeof cq_saveData === 'function')  cq_saveData(data);
    if (typeof cq_renderAll === 'function') cq_renderAll();

    /* Thông báo kết quả */
    const msg = document.getElementById('kb-cq-msg');
    if (msg) {
      msg.textContent = count
        ? `✅ Đã gán ${count} câu hỏi vào kịch bản!`
        : '⚠️ Tất cả bước CQ đã có câu hỏi hoặc không tìm được câu phù hợp.';
      msg.className = count ? 'ok' : 'warn';
      clearTimeout(msg._t);
      msg._t = setTimeout(() => { msg.textContent = ''; msg.className = ''; }, 4000);
    } else {
      alert(count
        ? `✅ Đã tự động gán ${count} câu hỏi vào kịch bản!`
        : '⚠️ Không tìm được câu hỏi phù hợp để gán.');
    }
  };

  /* ── Xóa toàn bộ câu hỏi đã dán và đặt lại kịch bản ── */
  window.kbDirResetAssignments = function () {
    if (!confirm('Xóa toàn bộ câu hỏi đã dán và đặt lại kịch bản về trạng thái gốc?')) return;
    try {
      const data = cq_getData();
      data.questions.forEach(q => delete q.kbStepRef);
      cq_saveData(data);
      _refreshQuestionAssignmentUI();
    } catch(e) {}
    for (let i = TEACHING_STEPS.length - 1; i >= 0; i--) {
      if (TEACHING_STEPS[i]._extra) TEACHING_STEPS.splice(i, 1);
    }
    localStorage.removeItem(_LS_EXTRA_KEY);
    _dirIdx = -1;
    try { if (typeof tf_buildList === 'function') tf_buildList(); } catch(e) {}
    _renderList(); _renderDetail(); _renderCtrl();
    const msg = document.getElementById('kb-cq-msg');
    if (msg) {
      msg.textContent = '✅ Đã xóa toàn bộ câu hỏi đã dán.';
      msg.className = 'ok';
      clearTimeout(msg._t);
      msg._t = setTimeout(() => { msg.textContent = ''; msg.className = ''; }, 3500);
    }
  };

  /* Dán câu hỏi từ CQ panel vào bước đang chọn trong kịch bản */
  window.cq_assignToSelected = function (qId, event) {
    if (typeof cq_getData !== 'function') return;
    const data = cq_getData();
    if (!data || !data.questions) return;
    const q = data.questions.find(x => x.id === qId);
    if (!q) return;

    const cur_s   = _steps()[_dirIdx];
    const curOrig = _origIdx(_dirIdx);

    if (cur_s && cur_s.action === 'cq' && curOrig >= 0) {
      /* Per-slide: nếu bước này đã có câu khác → buộc bỏ dán trước */
      const existing = (typeof cq_getQuestionForStep === 'function') ? cq_getQuestionForStep(curOrig) : null;
      if (existing && existing.id !== qId) {
        _kbNavToPastedStep(existing);
        return;
      }
      window._kbQAssign(qId, curOrig);
      return;
    }
    const snippet = (q.q || '').slice(0, 48) + ((q.q || '').length > 48 ? '…' : '');
    const catIdx  = (typeof CQ_CATS !== 'undefined') ? CQ_CATS.findIndex(c => c.id === q.cat) : -1;

    const newStep = {
      phase:  cur_s ? cur_s.phase : 'HÌNH THÀNH KIẾN THỨC',
      color:  cur_s ? cur_s.color : '#4fc3f7',
      title:  '❓ ' + snippet,
      time: 2, action: 'cq', cqTab: catIdx >= 0 ? catIdx : 2,
      cqId: qId, slide: null, preset: null,
      script: '[Câu hỏi dán từ danh sách]\n' + (q.q || '') +
              (q.opts ? '\n' + q.opts.map((o, i) => 'ABCD'[i] + '. ' + o).join('\n') : '') +
              '\n\nBấm 📽 Trình chiếu → câu hỏi hiện toàn màn hình.',
      _extra: true
    };

    _kbInsertStep(_dirIdx, newStep);
    _saveExtra();

    const newOrigIdx = TEACHING_STEPS.indexOf(newStep);
    if (newOrigIdx >= 0) {
      q.kbStepRef = { idx: newOrigIdx, title: newStep.title, color: newStep.color, phase: newStep.phase };
      if (typeof cq_saveData === 'function') cq_saveData(data);
      _refreshQuestionAssignmentUI();
    }
  };

  /* Bỏ dán: xóa link câu hỏi + xóa extra step khỏi kịch bản */
  window.cq_unpasteQuestion = function (qId) {
    if (typeof cq_getData !== 'function') return;
    const data = cq_getData();
    if (!data || !data.questions) return;
    const q = data.questions.find(x => x.id === qId);
    if (!q || !q.kbStepRef) return;

    const s = TEACHING_STEPS[q.kbStepRef.idx];
    if (s && s._extra) {
      const tsIdx = TEACHING_STEPS.indexOf(s);
      if (tsIdx >= 0) TEACHING_STEPS.splice(tsIdx, 1);
    }
    delete q.kbStepRef;

    _saveExtra();
    if (typeof cq_saveData === 'function') cq_saveData(data);
    if (typeof cq_renderAll === 'function') cq_renderAll();
    _dirIdx = Math.min(_dirIdx, Math.max(0, _steps().length - 1));
    _renderList(); _renderDetail(); _renderCtrl();
  };

  /* Sửa kbStepRef.idx bị lỗi thời sau khi _loadExtra() tái chèn bước vào vị trí mới */
  window._kbHealExtraRefs = function () {
    try {
      if (typeof cq_getData !== 'function') return;
      const data = cq_getData();
      if (!data || !data.questions) return;
      let changed = false;
      TEACHING_STEPS.forEach((s, idx) => {
        if (!s._extra || !s.cqId) return;
        const q = data.questions.find(x => x.id === s.cqId);
        if (!q) return;
        if (!q.kbStepRef || q.kbStepRef.idx !== idx) {
          q.kbStepRef = { idx, title: s.title, color: s.color, phase: s.phase };
          changed = true;
        }
      });
      if (changed && typeof cq_saveData === 'function') cq_saveData(data);
    } catch(e) {}
  };

  /* ════════════════════════════════════════════════════════
     KB-PG-PANEL – Playground gán trực tiếp trong bước CODE
  ════════════════════════════════════════════════════════ */
  let _kbpgPickerOpen = false;

  function _kbPgPanelRender() {
    const panel = document.getElementById('kb-pg-panel');
    if (!panel) return;
    const s = _steps()[_dirIdx];
    if (!s || s.action !== 'code') { panel.innerHTML = ''; return; }
    const origI = _origIdx(_dirIdx);
    if (_kbpgPickerOpen) {
      _kbPgRenderPicker(panel, origI, s.preset);
    } else {
      _kbPgRenderMain(panel, origI, s.preset);
    }
  }

  function _kbPgGetAllDemos() {
    const result = {};
    if (typeof PG_LESSON_CFGS === 'undefined') return result;
    Object.values(PG_LESSON_CFGS).forEach(function(cfg) {
      if (cfg && cfg.demos) Object.assign(result, cfg.demos);
    });
    return result;
  }

  function _kbPgRenderMain(panel, origI, preset) {
    const allDemos = _kbPgGetAllDemos();
    const demo = allDemos[preset];
    let inner = '';
    if (demo) {
      inner =
        '<div class="kbqp-hdr">' +
          '<span class="kbqp-title">💻 Playground đã gán</span>' +
          '<span class="kbqp-meta">' + _esc(demo.id || preset) + '</span>' +
          '<button class="kbqp-btn-change" onclick="_kbPgOpenPicker()" title="Đổi playground">🔄</button>' +
          '<button class="kbqp-btn-remove" onclick="_kbPgUnassign(' + origI + ')" title="Bỏ gán">✕</button>' +
        '</div>' +
        '<div class="kbqp-q">' + _esc(demo.title) + '</div>';
    } else {
      inner =
        '<div class="kbqp-hdr">' +
          '<span class="kbqp-title">💻 Playground</span>' +
          '<span class="kbqp-empty-hint">Chưa có playground nào được gán</span>' +
        '</div>' +
        '<button class="kbqp-paste-btn" onclick="_kbPgOpenPicker()">💻 Chọn & gán playground</button>';
    }
    panel.innerHTML = '<div class="kb-q-panel-wrap">' + inner + '</div>';
  }

  function _kbPgRenderPicker(panel, origI, currentPreset) {
    const allDemos = _kbPgGetAllDemos();
    const items = Object.entries(allDemos).map(function(entry) {
      const key = entry[0], demo = entry[1];
      const isActive = key === currentPreset;
      return '<button class="kbqp-item' + (isActive ? ' kbqp-item-active' : '') + '"' +
        ' onclick="_kbPgSelect(\'' + key + '\',' + origI + ')" title="' + _esc(demo.title) + '">' +
        '<span class="kbqp-item-badge">' + _esc(demo.id || key) + '</span>' +
        '<span class="kbqp-item-q">' + _esc(demo.title) + '</span>' +
        '</button>';
    }).join('');
    panel.innerHTML =
      '<div class="kb-q-panel-wrap kb-q-picker-wrap">' +
        '<div class="kbqp-hdr">' +
          '<span class="kbqp-title">💻 Chọn playground</span>' +
          '<button class="kbqp-btn-remove" onclick="_kbPgClosePicker()" title="Đóng">✕</button>' +
        '</div>' +
        '<div class="kbqp-list">' +
          (items || '<div class="kbqp-no-items">Không có playground nào.</div>') +
        '</div>' +
      '</div>';
  }

  window._kbPgOpenPicker  = function() { _kbpgPickerOpen = true;  _kbPgPanelRender(); };
  window._kbPgClosePicker = function() { _kbpgPickerOpen = false; _kbPgPanelRender(); };

  window._kbPgSelect = function(key, origI) {
    if (typeof TEACHING_STEPS !== 'undefined' && TEACHING_STEPS[origI]) {
      TEACHING_STEPS[origI].preset = key;
    }
    _kbpgPickerOpen = false;
    _kbPgPanelRender();
    try { openPlayground(key, true); } catch(e) {}
  };

  window._kbPgUnassign = function(origI) {
    if (typeof TEACHING_STEPS !== 'undefined' && TEACHING_STEPS[origI]) {
      TEACHING_STEPS[origI].preset = null;
    }
    _kbPgPanelRender();
    try { closePlayground(); } catch(e) {}
  };

  /* ════════════════════════════════════════════════════════
     CONTEXT MENU – chuột phải trên bước mục lục
  ════════════════════════════════════════════════════════ */
  const _PHASE_CLR = {
    'ÔN TẬP':'#3a86ff','KHỞI ĐỘNG':'#ff9f1c','HÌNH THÀNH KIẾN THỨC':'#2ec4b6',
    'ÔN ĐẦU TIẾT 2':'#4fc3f7','LUYỆN TẬP':'#06d6a0','VẬN DỤNG':'#f72585','TỔNG KẾT':'#4cc9f0'
  };
  let _kbCtxIdx = -1;

  function _kbCtxShow(filtIdx, x, y) {
    _kbCtxIdx = filtIdx;
    const s = _steps()[filtIdx];
    const info = document.getElementById('kb-ctx-info');
    if (info && s) info.textContent = (filtIdx + 1) + '. ' + s.title;
    const menu = document.getElementById('kb-ctx-menu');
    if (!menu) return;
    menu.style.left = x + 'px';
    menu.style.top  = y + 'px';
    menu.classList.add('kbcm-open');
    requestAnimationFrame(() => {
      const r = menu.getBoundingClientRect();
      if (r.right  > window.innerWidth)  menu.style.left = (x - r.width)  + 'px';
      if (r.bottom > window.innerHeight) menu.style.top  = (y - r.height) + 'px';
    });
  }

  window.kbCtxClose = function () {
    document.getElementById('kb-ctx-menu')?.classList.remove('kbcm-open');
    _kbCtxIdx = -1;
  };

  window.kbCtxDelete = function () {
    const idx = _kbCtxIdx; kbCtxClose();
    if (idx >= 0) kbDirDeleteStep(idx);
  };

  window.kbCtxAdd = function (type) {
    const afterIdx = _kbCtxIdx >= 0 ? _kbCtxIdx : (_steps().length - 1);
    kbCtxClose();
    const s     = _steps()[afterIdx];
    const phase = s ? s.phase : 'HÌNH THÀNH KIẾN THỨC';
    const color = _PHASE_CLR[phase] || '#4fc3f7';
    const TITLES = { slide:'📽 Slide mới', cq:'❓ Câu hỏi', chon:'🎲 Chọn người', code:'💻 Giải thích code' };
    const newStep = {
      phase, color, title: TITLES[type] || type,
      time: 2, action: type,
      cqTab:  type === 'cq'   ? 2    : null,
      preset: type === 'code' ? null : null,
      slide: null, script: '',
      _extra: true
    };
    _kbInsertStep(afterIdx, newStep);
    _saveExtra();
    /* Hành động sau khi tạo */
    setTimeout(() => {
      if (type === 'cq')   { window._kbQOpenPicker  && _kbQOpenPicker(); }
      else if (type === 'code')  { /* preset sẽ được cài khi chỉnh sửa bước */ }
      else if (type === 'chon') { try { setMode('chon'); } catch(e) {} }
    }, 180);
  };

  /* Đóng menu khi click ngoài hoặc Escape */
  document.addEventListener('click',   function (e) {
    const m = document.getElementById('kb-ctx-menu');
    if (m && !m.contains(e.target)) kbCtxClose();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') kbCtxClose();
  });


  window.kbDirInit = function () {
    _loadDeleted();
    _loadExtra();   // khôi phục extra steps (câu hỏi đã dán) trước khi render
    _loadTtsEdits();
    _loadScriptEdits();
    _applyDeletedSlidesToReveal();
    _syncQuestionAssignmentsFromData();
    try { window._kbHealExtraRefs && window._kbHealExtraRefs(); } catch(e) {}
    try { tf_buildList(); } catch(e) {}   // đồng bộ lộ trình kịch bản ngay khi load
    _renderList();
    _renderDetail();
    _renderCtrl();
  };

  document.addEventListener('DOMContentLoaded', function () {
    // Render ngay khi DOM sẵn sàng; TEACHING_STEPS sẽ có sẵn vì được load trước
    setTimeout(window.kbDirInit, 50);
  });

  /* ════════════════════════════════════════════════════════
     TẠO CÂU HỎI MỚI
  ════════════════════════════════════════════════════════ */
  let _cqFormOpen = false;

  /* Điền danh mục và pre-select dựa trên bước hiện tại */
  function _kbCQPopulateCat(s) {
    const sel = document.getElementById('kb-cq-cat');
    if (!sel) return;
    if (!sel.options.length && typeof CQ_CATS !== 'undefined') {
      CQ_CATS.forEach(c => {
        const o = document.createElement('option');
        o.value = c.id; o.textContent = c.label;
        sel.appendChild(o);
      });
    }
    if (!s) return;
    if (s.cqTab != null && s.cqTab < sel.options.length) {
      sel.selectedIndex = s.cqTab;
    } else {
      // Đoán danh mục từ vị trí slide
      const origI = TEACHING_STEPS.indexOf(s);
      const hv = (typeof _TF_SLIDE_HV !== 'undefined') ? _TF_SLIDE_HV[origI] : null;
      if (hv) {
        const map = {1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7};
        if (map[hv[0]] != null) sel.selectedIndex = map[hv[0]];
      }
    }
  }

  window.kbCQToggle = function () {
    _cqFormOpen = !_cqFormOpen;
    const wrap  = document.getElementById('kb-cq-form-wrap');
    const arrow = document.getElementById('kb-cq-arrow');
    if (wrap)  wrap.style.display = _cqFormOpen ? 'block' : 'none';
    if (arrow) arrow.textContent  = _cqFormOpen ? '▾' : '▸';
    if (_cqFormOpen) _kbCQPopulateCat(_steps()[_dirIdx]);
  };

  window.kbCQTypeChange = function () {
    const type = document.getElementById('kb-cq-type')?.value;
    document.getElementById('kb-cq-mc-wrap')?.style &&
      (document.getElementById('kb-cq-mc-wrap').style.display    = type === 'mc'    ? '' : 'none');
    document.getElementById('kb-cq-fill-wrap')?.style &&
      (document.getElementById('kb-cq-fill-wrap').style.display  = type === 'fill'  ? '' : 'none');
    document.getElementById('kb-cq-match-wrap')?.style &&
      (document.getElementById('kb-cq-match-wrap').style.display = type === 'match' ? '' : 'none');
  };

  window.kbCQCreate = function () {
    const type    = document.getElementById('kb-cq-type')?.value    || 'mc';
    const cat     = document.getElementById('kb-cq-cat')?.value     || '';
    const q       = (document.getElementById('kb-cq-q')?.value      || '').trim();
    const explain = (document.getElementById('kb-cq-explain')?.value || '').trim();
    const doInsert = document.getElementById('kb-cq-insert-step')?.checked;

    if (!q) { _kbCQMsg('⚠️ Nhập nội dung câu hỏi!', 'warn'); return; }

    const qObj = {
      id: (typeof cq_genId === 'function' ? cq_genId() : 'cq' + Date.now()),
      cat, type, q, explain
    };

    if (type === 'mc') {
      const opts = [...document.querySelectorAll('.kb-cq-txt')].map(el => el.value.trim());
      const ansEl = document.querySelector('input[name="kb-cq-ans"]:checked');
      if (opts.some(o => !o)) { _kbCQMsg('⚠️ Nhập đủ 4 lựa chọn!', 'warn'); return; }
      if (!ansEl)              { _kbCQMsg('⚠️ Chọn đáp án đúng!',   'warn'); return; }
      qObj.opts = opts;
      qObj.ans  = parseInt(ansEl.value);
    } else if (type === 'fill') {
      const blanks = cq_parseBlanks(document.getElementById('kb-cq-blanks')?.value || '');
      if (!blanks.length) { _kbCQMsg('⚠️ Nhập ít nhất 1 đáp án!', 'warn'); return; }
      qObj.blanks = blanks;
    } else if (type === 'match') {
      const pairs = cq_parsePairs(document.getElementById('kb-cq-pairs')?.value || '');
      if (pairs.length < 2) { _kbCQMsg('⚠️ Nhập ít nhất 2 cặp (Trái | Phải)!', 'warn'); return; }
      qObj.pairs = pairs;
    }

    /* Lưu vào hệ thống câu hỏi */
    try {
      const data = cq_getData();
      data.questions.push(qObj);
      cq_saveData(data);
      if (typeof cq_renderAll === 'function') cq_renderAll();
    } catch(e) { _kbCQMsg('❌ Lỗi: ' + e.message, 'err'); return; }

    /* Chèn bước CQ vào kịch bản */
    if (doInsert) {
      const catIdx = (typeof CQ_CATS !== 'undefined')
        ? CQ_CATS.findIndex(c => c.id === cat) : 2;
      const cur   = _steps()[_dirIdx];
      const phase = cur ? cur.phase : 'HÌNH THÀNH KIẾN THỨC';
      const color = cur ? cur.color : '#4fc3f7';
      const newStep = {
        phase, color,
        title:  '❓ ' + q.slice(0, 48) + (q.length > 48 ? '…' : ''),
        time: 2, action: 'cq',
        cqTab: catIdx >= 0 ? catIdx : 2,
        cqId:  qObj.id,
        _extra: true,
        slide: null, preset: null,
        script: '[Hộp câu hỏi – câu hỏi mới]\nBấm 📽 Trình chiếu → câu hỏi hiện toàn màn hình.\nHS suy nghĩ → trả lời → GV xác nhận đáp án.'
      };
      _kbInsertStep(_dirIdx, newStep);
      _saveExtra();
      /* Lưu kbStepRef vào câu hỏi vừa tạo */
      try {
        const newOrigIdx = TEACHING_STEPS.indexOf(newStep);
        if (newOrigIdx >= 0) {
          qObj.kbStepRef = { idx: newOrigIdx, title: newStep.title, color: newStep.color, phase: newStep.phase };
          cq_saveData(cq_getData());
          if (typeof cq_renderAll === 'function') cq_renderAll();
        }
      } catch(e) {}
      _kbCQMsg('✅ Đã tạo và thêm bước vào kịch bản!', 'ok');
    } else {
      _kbCQMsg('✅ Đã tạo câu hỏi!', 'ok');
    }
  };

  /* Dán câu hỏi đang hiển thị trong CQ slideshow vào kịch bản (luôn tạo bước CQ mới → mỗi slide 1 câu) */
  window.kbCQPaste = function () {
    const cur = (typeof cq_getCurrentQuestion === 'function') ? cq_getCurrentQuestion() : null;
    const cur_s = _steps()[_dirIdx];

    if (!cur || !cur.question) {
      /* Không có câu hỏi pre-selected: tạo bước CQ trống + mở picker ngay trong panel */
      const newStep = {
        phase:  cur_s ? cur_s.phase  : 'HÌNH THÀNH KIẾN THỨC',
        color:  cur_s ? cur_s.color  : '#4fc3f7',
        title:  '❓ Câu hỏi (chưa chọn)',
        time: 2, action: 'cq', cqTab: 2,
        cqId: null, slide: null, preset: null, script: '',
        _extra: true
      };
      _kbInsertStep(_dirIdx, newStep);
      _saveExtra();
      _kbqPickerOpen = true;
      _kbQPanelRender();
      _kbCQMsg('📌 Chọn câu hỏi bên phải để hoàn tất', 'ok');
      return;
    }

    /* Có câu hỏi pre-selected: dán ngay với câu đó */
    const q       = cur.question;
    const tabIdx  = cur.tabIdx >= 0 ? cur.tabIdx : 2;
    const snippet = (q.q || '').slice(0, 48) + ((q.q || '').length > 48 ? '…' : '');
    const newStep = {
      phase:  cur_s ? cur_s.phase : 'HÌNH THÀNH KIẾN THỨC',
      color:  cur_s ? cur_s.color : '#4fc3f7',
      title:  '❓ ' + snippet,
      time: 2, action: 'cq', cqTab: tabIdx,
      cqId: q.id, slide: null, preset: null,
      script: '[Câu hỏi dán từ danh sách]\n' + (q.q || '') +
              (q.opts ? '\n' + q.opts.map((o,i)=>'ABCD'[i]+'. '+o).join('\n') : '') +
              '\n\nBấm 📽 Trình chiếu → câu hỏi hiện toàn màn hình.\nHS suy nghĩ → trả lời → GV xác nhận đáp án.',
      _extra: true
    };
    _kbInsertStep(_dirIdx, newStep);
    _saveExtra();
    try {
      const newOrigIdx = TEACHING_STEPS.indexOf(newStep);
      const data = cq_getData();
      if (!data || !data.questions) throw new Error('no cq data');
      const qObj = data.questions.find(x => x.id === q.id);
      if (qObj && newOrigIdx >= 0) {
        qObj.kbStepRef = { idx: newOrigIdx, title: newStep.title, color: newStep.color, phase: newStep.phase };
        cq_saveData(data);
        if (typeof cq_renderAll === 'function') cq_renderAll();
        _kbQPanelRender();
      }
    } catch(e) {}
    _kbCQMsg('✅ Đã dán câu hỏi vào kịch bản!', 'ok');
  };

  /* Cập nhật preview nút Dán khi có thay đổi trong CQ */
  function _kbCQUpdatePastePreview() {
    const el = document.getElementById('kb-cq-paste-preview');
    if (!el) return;
    const cur = (typeof cq_getCurrentQuestion === 'function') ? cq_getCurrentQuestion() : null;
    el.textContent = cur && cur.question
      ? '← ' + (cur.question.q || '').slice(0, 60)
      : '← Chưa có câu nào được chọn';
  }
  /* Gọi mỗi khi mở kịch bản hoặc đổi bước */
  window._kbCQUpdatePastePreview = _kbCQUpdatePastePreview;

  window.kbCQClear = function () {
    ['kb-cq-q','kb-cq-explain','kb-cq-blanks','kb-cq-pairs']
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.querySelectorAll('.kb-cq-txt').forEach(el => el.value = '');
    const r = document.querySelector('input[name="kb-cq-ans"]:checked');
    if (r) r.checked = false;
    const msg = document.getElementById('kb-cq-msg');
    if (msg) msg.textContent = '';
  };

  function _kbCQMsg(text, type) {
    const el = document.getElementById('kb-cq-msg');
    if (!el) return;
    el.textContent = text;
    el.className   = type || '';
    clearTimeout(el._kbT);
    el._kbT = setTimeout(() => { el.textContent = ''; el.className = ''; }, 3000);
  }

  /* Chèn bước mới vào TEACHING_STEPS ngay sau filtered index afterFiltIdx */
  function _kbInsertStep(afterFiltIdx, stepObj) {
    const steps = _steps();
    if (!steps.length) {
      TEACHING_STEPS.push(stepObj);
      _dirIdx = 0;
    } else {
      const anchor   = steps[Math.min(afterFiltIdx, steps.length - 1)];
      const origAfter = TEACHING_STEPS.indexOf(anchor);
      TEACHING_STEPS.splice(origAfter + 1, 0, stepObj);
      _dirIdx = afterFiltIdx + 1;
    }
    try { tf_buildList(); } catch(e) {}
    _renderList();
    _renderDetail();
    _renderCtrl();
  }

})();
