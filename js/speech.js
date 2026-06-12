// ══════════════════════════════════
// SPEECH / DIALOGUE PANEL – TTS + KARAOKE + AUTO-TEACH
// ══════════════════════════════════
(function () {
  'use strict';

  let _spLang        = 'vi-VN';
  let _spRate        = 0.9;
  let _spPitch       = 1.0;
  let _spAutoRead    = false;
  let _spAutoTeach   = false;   // chế độ dạy TOÀN BÀI
  let _spTeachSingle = false;   // chế độ dạy SLIDE NÀY
  let _spVoice       = null;
  let _spSeenPg      = new Set();  // playground / question đã dạy trong session này
  const _synth       = window.speechSynthesis;

  /* ── Escape HTML for karaoke spans ── */
  function _esc(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ══════════════════════════════════
     KARAOKE ENGINE
  ══════════════════════════════════ */
  function _buildKaraoke(text) {
    const display = document.getElementById('sp-karaoke-display');
    if (!display) return;
    let html = '', i = 0;
    while (i < text.length) {
      if (text[i] === '\n') {
        html += '<br>'; i++;
      } else if (text[i] === ' ' || text[i] === '\t') {
        let j = i;
        while (j < text.length && (text[j] === ' ' || text[j] === '\t')) j++;
        html += text.slice(i, j); i = j;
      } else {
        let j = i;
        while (j < text.length && text[j] !== ' ' && text[j] !== '\t' && text[j] !== '\n') j++;
        html += '<span class="sp-word" data-start="' + i + '">' + _esc(text.slice(i, j)) + '</span>';
        i = j;
      }
    }
    display.innerHTML = html;
    display.scrollTop = 0;
  }

  function _showKaraoke() {
    document.getElementById('sp-textarea')?.classList.add('sp-hidden');
    document.getElementById('sp-karaoke-display')?.classList.add('sp-active');
  }

  function _hideKaraoke() {
    document.getElementById('sp-textarea')?.classList.remove('sp-hidden');
    const kd = document.getElementById('sp-karaoke-display');
    if (kd) { kd.classList.remove('sp-active'); kd.innerHTML = ''; }
  }

  function _highlightWord(charIndex) {
    // Mark past words
    document.querySelectorAll('#sp-karaoke-display .sp-word.sp-word-active').forEach(s => {
      s.classList.remove('sp-word-active');
      s.classList.add('sp-word-past');
    });
    // Find word at charIndex (exact or nearest)
    let target = null, minDiff = Infinity;
    document.querySelectorAll('#sp-karaoke-display .sp-word').forEach(s => {
      const st = parseInt(s.dataset.start);
      if (st === charIndex) { target = s; minDiff = 0; }
      else if (st <= charIndex) {
        const diff = charIndex - st;
        if (diff < minDiff) { minDiff = diff; target = s; }
      }
    });
    if (target) {
      target.classList.remove('sp-word-past');
      target.classList.add('sp-word-active');
      target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /* ══════════════════════════════════
     PANEL TOGGLE
  ══════════════════════════════════ */
  window.toggleSpeechPanel = function () {
    const panel = document.getElementById('speech-panel');
    const btn   = document.getElementById('speech-toggle-btn');
    const isOpen = panel.classList.toggle('sp-open');
    btn.textContent = isOpen ? '✕' : '💬';
    btn.title       = isOpen ? 'Đóng hộp thoại' : 'Mở hộp thoại giảng dạy';
    if (isOpen) {
      _spPopulateVoices();
      _spPopulateDevices();
      // Cập nhật tiêu đề theo chế độ hiện tại
      if (typeof _spUpdateContextUI === 'function' && typeof _currentAppMode !== 'undefined') {
        _spUpdateContextUI(_currentAppMode);
      }
    }
  };

  /* ── Language ── */
  window.spSetLang = function (btnEl) {
    _spLang  = btnEl.dataset.lang;
    _spVoice = null;
    document.querySelectorAll('.sp-lang-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    _spPopulateVoices();
  };

  /* ── Rate / Pitch ── */
  window.spUpdateRate  = function (v) { _spRate  = parseFloat(v); const rl = document.getElementById('sp-rate-label');  if (rl) rl.textContent  = parseFloat(v).toFixed(1) + '×'; };
  window.spUpdatePitch = function (v) { _spPitch = parseFloat(v); const pl = document.getElementById('sp-pitch-label'); if (pl) pl.textContent = parseFloat(v).toFixed(1); };

  /* ── Voice ── */
  window.spSelectVoice = function (name) {
    _spVoice = _synth.getVoices().find(v => v.name === name) || null;
  };

  function _spPopulateVoices() {
    if (!_synth) return;
    const sel = document.getElementById('sp-voice');
    if (!sel) return;
    const voices   = _synth.getVoices();
    const filtered = voices.filter(v => v.lang.startsWith(_spLang.slice(0, 2)));
    sel.innerHTML  = '';
    const addGroup = (list, label) => {
      if (!list.length) return;
      const g = document.createElement('optgroup');
      g.label = label;
      list.forEach(v => {
        const o = document.createElement('option');
        o.value = v.name;
        o.textContent = v.name + (v.localService ? ' ✓' : '');
        g.appendChild(o);
      });
      sel.appendChild(g);
    };
    addGroup(filtered, '🔤 Khớp ngôn ngữ');
    addGroup(voices.filter(v => !v.lang.startsWith(_spLang.slice(0, 2))), 'Giọng khác');
    if (_spVoice) sel.value = _spVoice.name;
    else if (filtered.length) { sel.value = filtered[0].name; _spVoice = filtered[0]; }
  }
  if (_synth && _synth.onvoiceschanged !== undefined) _synth.onvoiceschanged = _spPopulateVoices;

  /* ══════════════════════════════════
     AUDIO OUTPUT DEVICE SELECTION
     – Dùng AudioContext.setSinkId() (Chromium 110+) để route audio.
     – speechSynthesis vẫn theo thiết bị mặc định Windows, nhưng
       AudioContext giúp xác nhận thiết bị đang hoạt động (test beep).
     – Nút "Cài đặt Windows" mở ms-settings:sound để đổi thiết bị mặc định.
  ══════════════════════════════════ */
  let _spDeviceId  = 'default';
  let _spDeviceCtx = null;   // AudioContext bound to selected device
  let _spDeviceOsc = null;   // silent oscillator keeping context alive

  function _spDeviceBadge(msg, cls) {
    const badge = document.getElementById('sp-device-badge');
    const msgEl = document.getElementById('sp-device-msg');
    if (!badge) return;
    badge.className = 'dev-' + (cls || 'def');
    if (msgEl) msgEl.innerHTML = msg;
  }

  async function _spReleaseDeviceCtx() {
    if (_spDeviceOsc) { try { _spDeviceOsc.stop(); } catch(e){} _spDeviceOsc = null; }
    if (_spDeviceCtx) { try { await _spDeviceCtx.close(); } catch(e){} _spDeviceCtx = null; }
  }

  async function _spBindDevice(deviceId) {
    await _spReleaseDeviceCtx();
    if (!deviceId || deviceId === 'default') return 'default';

    if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') {
      return 'no-ctx';
    }
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (typeof ctx.setSinkId !== 'function') {
      ctx.close();
      return 'no-sink';
    }
    try {
      await ctx.setSinkId(deviceId);
    } catch(e) {
      ctx.close();
      return 'error:' + (e.message || e);
    }
    // Silent oscillator – keeps context active so device stays "claimed"
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.000001; // ~–120 dB
    osc.frequency.value = 220;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    _spDeviceCtx = ctx;
    _spDeviceOsc = osc;
    return 'ok';
  }

  async function _spPopulateDevices() {
    const sel = document.getElementById('sp-device');
    if (!sel || !navigator.mediaDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const outputs = devices.filter(function(d) { return d.kind === 'audiooutput'; });
      sel.innerHTML = '<option value="default">🔊 Mặc định hệ thống</option>';
      outputs.forEach(function(d) {
        if (d.deviceId === 'communications') return; // skip virtual comms device
        const opt = document.createElement('option');
        opt.value       = d.deviceId;
        opt.textContent = d.label
          ? (d.label.length > 44 ? d.label.slice(0, 42) + '…' : d.label)
          : ('Thiết bị #' + d.deviceId.slice(0, 8) + '…');
        sel.appendChild(opt);
      });
      sel.value = _spDeviceId;
      if (outputs.length === 0) {
        _spDeviceBadge('Không tìm thấy thiết bị – hãy cấp quyền micro để xem nhãn', 'warn');
      }
    } catch(e) {
      _spDeviceBadge('⚠️ Không thể liệt kê thiết bị: ' + e.message, 'warn');
    }
  }

  window.spSelectDevice = async function(deviceId) {
    _spDeviceId = deviceId;
    if (!deviceId || deviceId === 'default') {
      await _spReleaseDeviceCtx();
      _spDeviceBadge('🔊 Thiết bị mặc định &nbsp;·&nbsp;<a href="#" onclick="spOpenSoundSettings();return false;" style="color:#4fc3f7;text-decoration:none">Cài đặt Windows</a>', 'def');
      return;
    }
    _spDeviceBadge('⏳ Đang kết nối…', 'def');
    const result = await _spBindDevice(deviceId);
    if (result === 'ok') {
      _spDeviceBadge('🎧 Đã kết nối &nbsp;·&nbsp; nhấn ▶ để kiểm tra &nbsp;·&nbsp; <a href="#" onclick="spOpenSoundSettings();return false;" style="color:#4fc3f7;text-decoration:none">Cài đặt Windows</a>', 'ok');
    } else if (result === 'no-sink') {
      _spDeviceBadge('⚠️ Electron chưa hỗ trợ AudioContext.setSinkId() &nbsp;·&nbsp; <a href="#" onclick="spOpenSoundSettings();return false;" style="color:#ff9800;text-decoration:none">Mở cài đặt Windows ›</a>', 'warn');
    } else if (result === 'default') {
      /* already handled above */
    } else {
      _spDeviceBadge('⚠️ ' + result.replace('error:', '') + ' &nbsp;·&nbsp; <a href="#" onclick="spOpenSoundSettings();return false;" style="color:#ff9800;text-decoration:none">Mở cài đặt ›</a>', 'warn');
    }
  };

  window.spRefreshDevices = function() { _spPopulateDevices(); };

  /* ── Test beep: phát tiếng bíp ngắn qua thiết bị đang chọn ── */
  window.spTestDevice = function() {
    const ctx = _spDeviceCtx || new (window.AudioContext || window.webkitAudioContext)();
    const own = !_spDeviceCtx; // we own this ctx if it's a temp one

    function doBeep() {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const now  = ctx.currentTime;
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(660, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
      if (own) osc.onended = function() { ctx.close(); };
    }

    if (ctx.state === 'suspended') {
      ctx.resume().then(doBeep);
    } else {
      doBeep();
    }
  };

  /* ── Mở Windows Sound Settings (ms-settings:sound) ── */
  window.spOpenSoundSettings = function() {
    if (window.audioBridge && window.audioBridge.openSoundSettings) {
      window.audioBridge.openSoundSettings();
    } else {
      // Fallback: open via shell if available
      window.open('ms-settings:sound');
    }
  };

  /* ── Lắng nghe khi cắm/rút thiết bị mới ── */
  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
    navigator.mediaDevices.addEventListener('devicechange', _spPopulateDevices);
  }

  /* ── Status / buttons ── */
  function _spSetStatus(text, cls) {
    const el = document.getElementById('sp-status');
    if (!el) return;
    el.textContent = text;
    el.className   = cls ? 'sp-' + cls : '';
  }

  function _spSetButtons(state) {
    const play  = document.getElementById('sp-play-btn');
    const pause = document.getElementById('sp-pause-btn');
    const stop  = document.getElementById('sp-stop-btn');
    if (!play) return;
    if (state === 'playing') {
      play.disabled  = true; pause.disabled = false; stop.disabled = false;
      pause.textContent = '⏸'; pause.onclick = window.spPause;
    } else if (state === 'paused') {
      play.disabled  = true; pause.disabled = false; stop.disabled = false;
      pause.textContent = '▶'; pause.onclick = window.spResume;
    } else {
      play.disabled  = false; pause.disabled = true; stop.disabled = true;
      pause.textContent = '⏸'; pause.onclick = window.spPause;
    }
  }

  /* ══════════════════════════════════
     READ (with karaoke)
  ══════════════════════════════════ */
  window.spRead = function () {
    if (!_synth) { _spSetStatus('⚠️ Không hỗ trợ TTS', 'error'); return; }
    const text = (document.getElementById('sp-textarea')?.value || '').trim();
    if (!text) { _spSetStatus('⚠️ Chưa có nội dung để đọc', 'warn'); return; }

    // Resume AudioContext nếu bị suspend bởi chính sách autoplay
    if (_spDeviceCtx && _spDeviceCtx.state === 'suspended') {
      _spDeviceCtx.resume().catch(function(){});
    }

    _synth.cancel();
    _buildKaraoke(text);
    _showKaraoke();

    const utt   = new SpeechSynthesisUtterance(text);
    utt.lang    = _spLang;
    utt.rate    = _spRate;
    utt.pitch   = _spPitch;
    if (_spVoice) utt.voice = _spVoice;

    /* ── KARAOKE word boundary ── */
    utt.onboundary = function (e) {
      if (e.name === 'word') _highlightWord(e.charIndex);
    };

    utt.onstart  = () => { _spSetStatus('🔊 Đang đọc...', 'reading'); _spSetButtons('playing'); };
    utt.onend    = () => {
      _spSetStatus('✅ Đã đọc xong', 'done');
      _spSetButtons('idle');
      _hideKaraoke();
      if      (_spAutoTeach)   _spAutoAdvance();
      else if (_spTeachSingle) _spFinishSingleSlide();
      else if (typeof window._kbOnSpeechEnd === 'function') window._kbOnSpeechEnd();
    };
    utt.onerror  = (e) => {
      const m = e.error || 'unknown';
      _spSetStatus((m === 'interrupted' || m === 'canceled') ? 'Đã dừng' : '⚠️ Lỗi: ' + m,
                   (m === 'interrupted' || m === 'canceled') ? '' : 'error');
      _spSetButtons('idle');
      _hideKaraoke();
      // Khi lỗi trong auto-play kịch bản, tiếp tục bước tiếp
      if (m !== 'interrupted' && m !== 'canceled' &&
          typeof window._kbOnSpeechEnd === 'function') window._kbOnSpeechEnd();
    };
    utt.onpause  = () => { _spSetStatus('⏸ Tạm dừng', '');          _spSetButtons('paused'); };
    utt.onresume = () => { _spSetStatus('🔊 Đang đọc...', 'reading'); _spSetButtons('playing'); };

    _synth.speak(utt);
    _spSetStatus('🔊 Đang đọc...', 'reading');
    _spSetButtons('playing');
  };

  window.spPause  = () => { if (_synth.speaking && !_synth.paused) _synth.pause(); };
  window.spResume = () => { if (_synth.paused) _synth.resume(); };

  /* ── Đọc text thẳng vào element karaoke tùy chỉnh (không mở speech panel) ── */
  window.spReadText = function (text, karaokeEl, onEnd) {
    if (!_synth || !text) return;
    text = text.trim();
    if (!text) return;

    _synth.cancel();

    /* Build karaoke spans trong element tùy chỉnh */
    function buildInlineKaraoke(el) {
      let html = '', i = 0;
      while (i < text.length) {
        if (text[i] === '\n') { html += '<br>'; i++; }
        else if (text[i] === ' ' || text[i] === '\t') {
          let j = i;
          while (j < text.length && (text[j] === ' ' || text[j] === '\t')) j++;
          html += text.slice(i, j); i = j;
        } else {
          let j = i;
          while (j < text.length && text[j] !== ' ' && text[j] !== '\t' && text[j] !== '\n') j++;
          html += '<span class="sp-word" data-start="' + i + '">' + _esc(text.slice(i, j)) + '</span>';
          i = j;
        }
      }
      el.innerHTML = html;
      el.scrollTop = 0;
    }

    if (karaokeEl) {
      buildInlineKaraoke(karaokeEl);
      karaokeEl.style.display = '';
    }

    function highlightInline(charIndex) {
      if (!karaokeEl) return;
      karaokeEl.querySelectorAll('.sp-word.sp-word-active').forEach(s => {
        s.classList.remove('sp-word-active'); s.classList.add('sp-word-past');
      });
      let target = null, minDiff = Infinity;
      karaokeEl.querySelectorAll('.sp-word').forEach(s => {
        const st = parseInt(s.dataset.start);
        const diff = charIndex - st;
        if (diff >= 0 && diff < minDiff) { minDiff = diff; target = s; }
      });
      if (target) {
        target.classList.remove('sp-word-past');
        target.classList.add('sp-word-active');
        target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    const utt   = new SpeechSynthesisUtterance(text);
    utt.lang    = _spLang;
    utt.rate    = _spRate;
    utt.pitch   = _spPitch;
    if (_spVoice) utt.voice = _spVoice;

    utt.onboundary = function (e) { if (e.name === 'word') highlightInline(e.charIndex); };
    utt.onend = function () {
      if (karaokeEl) {
        karaokeEl.querySelectorAll('.sp-word').forEach(s => {
          s.classList.remove('sp-word-active', 'sp-word-past');
        });
      }
      if (typeof onEnd === 'function') onEnd();
      if (typeof window._kbOnSpeechEnd === 'function') window._kbOnSpeechEnd();
    };
    utt.onerror = function (e) {
      const m = e.error || '';
      if (m !== 'interrupted' && m !== 'canceled' && typeof window._kbOnSpeechEnd === 'function')
        window._kbOnSpeechEnd();
    };

    _synth.speak(utt);
  };

  window.spStop = function () {
    _synth.cancel();
    _spSetStatus('Đã dừng', '');
    _spSetButtons('idle');
    _hideKaraoke();
    if (_spTeachSingle) { _spTeachSingle = false; _spUpdateSingleBtn(false); }
  };

  window.spToggleAuto = (checked) => { _spAutoRead = checked; };

  window.spClear = function () {
    const ta = document.getElementById('sp-textarea');
    if (ta) { ta.value = ''; ta.focus(); }
    window.spStop();
    _spSetStatus('Sẵn sàng', '');
  };

  /* ══════════════════════════════════
     SCRIPT LOADING
  ══════════════════════════════════ */
  window.spLoadCurrentSlideScript = function () {
    if (typeof Reveal === 'undefined') return;
    const { h, v } = Reveal.getIndices();
    const key    = h + '-' + (v ?? 0);
    const script = SLIDE_SCRIPTS[key];
    const ta     = document.getElementById('sp-textarea');
    if (!ta) return;
    if (script) {
      ta.value = script;
      _spSetStatus('📖 Đã tải lời thoại slide ' + key, 'done');
    } else {
      _spSetStatus('ℹ️ Chưa có lời thoại cho slide này', 'warn');
    }
  };

  window.spLoadAllScripts = function () {
    const ta = document.getElementById('sp-textarea');
    if (!ta) return;
    const allText = Object.entries(SLIDE_SCRIPTS)
      .map(([k, v]) => '=== Slide ' + k + ' ===\n' + v)
      .join('\n\n');
    ta.value = allText;
    _spSetStatus('📋 Đã tải toàn bộ ' + Object.keys(SLIDE_SCRIPTS).length + ' lời thoại', 'done');
  };

  /* ── Load script theo ngữ cảnh hiện tại ── */
  window.spLoadContextScript = function (modeOverride) {
    const mode = modeOverride || (typeof _currentAppMode !== 'undefined' ? _currentAppMode : 'slides');
    const ta   = document.getElementById('sp-textarea');
    if (!ta) return;

    if (mode === 'slides' || mode === 'edit') {
      // Tải script của slide đang hiển thị
      window.spLoadCurrentSlideScript();
      return;
    }

    if (mode === 'code') {
      // Tải script của playground đang mở
      const key     = typeof currentPresetKey !== 'undefined' ? currentPresetKey : 'demo_bien';
      const intro   = (typeof PLAYGROUND_SCRIPTS !== 'undefined') ? (PLAYGROUND_SCRIPTS[key] || '') : '';
      const outro   = (typeof PLAYGROUND_SCRIPTS !== 'undefined') ? (PLAYGROUND_SCRIPTS[key + '_outro'] || '') : '';
      const text    = [intro, outro].filter(Boolean).join('\n\n');
      ta.value      = text || CONTEXT_SCRIPTS['code'] || '';
      _spSetStatus('📖 Đã tải lời thoại Playground: ' + key, 'done');
      return;
    }

    // cq, chon, game
    const script = (typeof CONTEXT_SCRIPTS !== 'undefined') ? (CONTEXT_SCRIPTS[mode] || '') : '';
    ta.value = script;
    if (script) _spSetStatus('📖 Đã tải lời thoại: ' + (_SP_MODE_LABELS[mode] || mode), 'done');
    else        _spSetStatus('ℹ️ Chưa có lời thoại cho mục này', 'warn');
  };

  /* ══════════════════════════════════
     AUTO-TEACH (đọc xong → sang slide tiếp → đọc tiếp)
  ══════════════════════════════════ */
  /* ── Cập nhật trạng thái nút Slide này ── */
  function _spUpdateSingleBtn(on) {
    const btn = document.getElementById('sp-single-btn');
    if (!btn) return;
    btn.classList.toggle('sp-teach-on', on);
    btn.textContent = on ? '⏹ Dừng' : '🎓 Slide này';
  }

  /* ── Hoàn tất dạy slide đơn: hiện câu hỏi nếu có, rồi dừng ── */
  async function _spFinishSingleSlide() {
    if (!_spTeachSingle) return;
    if (typeof Reveal === 'undefined') { _spTeachSingle = false; _spUpdateSingleBtn(false); return; }
    const { h, v } = Reveal.getIndices();
    const key    = h + '-' + (v ?? 0);
    const qId    = (typeof SLIDE_QUESTION_MAP !== 'undefined') ? SLIDE_QUESTION_MAP[key] : null;
    const qSeen  = 'q:' + key;
    if (qId && !_spSeenPg.has(qSeen)) {
      _spSeenPg.add(qSeen);
      _spSetStatus('❓ Câu hỏi kiểm tra...', 'reading');
      if (typeof cq_presentInteractive === 'function') {
        await cq_presentInteractive(qId, 30);
      }
    }
    _spTeachSingle = false;
    _spUpdateSingleBtn(false);
    _spSetStatus('✅ Đã dạy xong slide này', 'done');
  }

  /* ── Dạy chỉ slide hiện tại (tải script → đọc → câu hỏi → dừng) ── */
  window.spTeachCurrentSlide = function () {
    // Nếu đang dạy toàn bài → tắt
    if (_spAutoTeach) { window.spToggleAutoTeach(); return; }

    _spTeachSingle = !_spTeachSingle;
    _spUpdateSingleBtn(_spTeachSingle);

    if (_spTeachSingle) {
      _spSeenPg.clear();
      window.spLoadCurrentSlideScript();
      setTimeout(window.spRead, 300);
    } else {
      window.spStop();
    }
  };

  /* ══════════════════════════════════
     AUTO-TEACH TOÀN BÀI (đọc xong → sang slide tiếp → đọc tiếp)
  ══════════════════════════════════ */
  window.spToggleAutoTeach = function () {
    // Nếu đang dạy slide này → tắt trước
    if (_spTeachSingle) { _spTeachSingle = false; _spUpdateSingleBtn(false); window.spStop(); }

    _spAutoTeach = !_spAutoTeach;
    const btn = document.getElementById('sp-autoteach-btn');
    if (btn) {
      btn.classList.toggle('sp-autoteach-on', _spAutoTeach);
      btn.textContent = _spAutoTeach ? '⏹ Dừng' : '📚 Toàn bài';
    }
    if (_spAutoTeach) {
      _spSeenPg.clear();
      if (typeof ltStart === 'function') ltStart();
      window.spLoadCurrentSlideScript();
      setTimeout(window.spRead, 300);
    } else {
      window.spStop();
      // Nếu đang ở chế độ code/playground → quay về slides
      if (typeof closePlayground === 'function') closePlayground();
      if (typeof setMode === 'function') setMode('slides');
    }
  };

  /* ── Async helpers cho playground teaching ── */
  function _spReadAsync(text) {
    return new Promise(function (resolve) {
      if (!_spAutoTeach || !text || !_synth) { resolve(); return; }
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang  = _spLang; utt.rate = _spRate; utt.pitch = _spPitch;
      if (_spVoice) utt.voice = _spVoice;
      utt.onend = resolve; utt.onerror = resolve;
      _synth.speak(utt);
    });
  }
  function _spDelay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function _stripHtml(s) {
    return (s || '').replace(/<[^>]+>/g,'')
      .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ');
  }

  /* ── Giảng dạy playground tự động ── */
  async function _spAutoTeachPlayground(pgKey) {
    if (!_spAutoTeach) return;
    _spSeenPg.add(pgKey);

    // Mở playground
    if (typeof openPlayground === 'function') openPlayground(pgKey);
    await _spDelay(700);

    // Helper: hiển thị trong step-explain-box
    const setExpl = function (html) {
      const el  = document.getElementById('step-explain-text');
      const box = document.getElementById('step-explain-box');
      if (el)  el.innerHTML  = html || '';
      if (box) box.classList.toggle('has-content', !!html);
    };

    _spSetStatus('🎬 Giải thích code: ' + pgKey, 'reading');

    // Đọc lời mở đầu
    const intro = (typeof PLAYGROUND_SCRIPTS !== 'undefined') ? PLAYGROUND_SCRIPTS[pgKey] : '';
    if (intro && _spAutoTeach) {
      setExpl('🎓 &nbsp;' + intro);
      await _spReadAsync(intro);
    }

    // Chạy từng bước + đọc giải thích
    const demo = (typeof _pgGetDemos === 'function') ? _pgGetDemos()[pgKey] : null;
    if (demo && demo.steps) {
      for (let i = 0; i < demo.steps.length; i++) {
        if (!_spAutoTeach) break;
        if (typeof doStep === 'function') doStep();
        await _spDelay(350);
        const expl = _stripHtml(demo.steps[i].expl || '');
        if (expl && _spAutoTeach) await _spReadAsync(expl);
        else await _spDelay(700);
      }
    }

    // Đọc lời kết
    const outro = (typeof PLAYGROUND_SCRIPTS !== 'undefined') ? PLAYGROUND_SCRIPTS[pgKey + '_outro'] : '';
    if (outro && _spAutoTeach) {
      setExpl('✅ &nbsp;' + outro);
      await _spReadAsync(outro);
    }

    setExpl('');
    await _spDelay(1000);

    if (_spAutoTeach) {
      if (typeof closePlayground === 'function') closePlayground();
      if (typeof setMode === 'function') setMode('slides');
      await _spDelay(600);
      _spAutoAdvance(); // sẽ bỏ qua playground (đã trong _spSeenPg) → chuyển slide
    }
  }

  /* ── Chuyển sang slide tiếp theo (dùng chung) ── */
  function _spGoNextSlide(h, v) {
    if (typeof SLIDE_MAP === 'undefined') return;
    const idx = SLIDE_MAP.findIndex(s => s.h === h && s.v === (v ?? 0));
    if (idx < 0 || idx >= SLIDE_MAP.length - 1) {
      _spAutoTeach = false;
      const btn = document.getElementById('sp-autoteach-btn');
      if (btn) { btn.classList.remove('sp-autoteach-on'); btn.textContent = '📚 Toàn bài'; }
      _spSetStatus('🎉 Đã kết thúc toàn bộ bài giảng!', 'done');
      return;
    }
    const next = SLIDE_MAP[idx + 1];
    _spSetStatus('⏭ Chuyển sang slide tiếp theo...', 'reading');
    setTimeout(function () { Reveal.slide(next.h, next.v); }, 1600);
  }

  /* ── Hiển thị câu hỏi tương tác trong chế độ tự dạy ── */
  async function _spAutoAskQuestion(qId, h, v) {
    if (!_spAutoTeach) return;
    _spSetStatus('❓ Câu hỏi tương tác – chờ học sinh trả lời...', 'reading');
    if (typeof cq_presentInteractive === 'function') {
      await cq_presentInteractive(qId, 30);
    }
    if (_spAutoTeach) _spGoNextSlide(h, v);
  }

  /* ── Auto-advance: kiểm tra playground + câu hỏi trước khi chuyển slide ── */
  function _spAutoAdvance() {
    if (!_spAutoTeach || typeof Reveal === 'undefined') return;
    const { h, v } = Reveal.getIndices();
    const key   = h + '-' + (v ?? 0);

    // 1. Slide này có playground và chưa dạy?
    const pgKey = (typeof SLIDE_PLAYGROUND_MAP !== 'undefined') ? SLIDE_PLAYGROUND_MAP[key] : null;
    if (pgKey && !_spSeenPg.has(pgKey)) {
      _spAutoTeachPlayground(pgKey);
      return;
    }

    // 2. Slide này có câu hỏi tương tác và chưa hỏi?
    const qId    = (typeof SLIDE_QUESTION_MAP !== 'undefined') ? SLIDE_QUESTION_MAP[key] : null;
    const qSeen  = 'q:' + key;
    if (qId && !_spSeenPg.has(qSeen)) {
      _spSeenPg.add(qSeen);
      _spAutoAskQuestion(qId, h, v);
      return;
    }

    // 3. Chuyển sang slide tiếp theo
    _spGoNextSlide(h, v);
  }

  /* ══════════════════════════════════
     SLIDE CHANGE HOOKS
  ══════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof Reveal === 'undefined') return;

    Reveal.on('slidechanged', function ({ indexh, indexv }) {
      const panel = document.getElementById('speech-panel');
      if (!panel || !panel.classList.contains('sp-open')) return;

      const key  = indexh + '-' + (indexv ?? 0);
      const ta   = document.getElementById('sp-textarea');

      // Auto-teach mode: tải script slide mới, đọc ngay
      if (_spAutoTeach) {
        const script = SLIDE_SCRIPTS[key];
        if (ta && script) ta.value = script;
        _synth.cancel();
        _spSetButtons('idle');
        _hideKaraoke();
        if (script) {
          setTimeout(window.spRead, 800);
        } else {
          _spSetStatus('ℹ️ Chưa có lời thoại – tự động bỏ qua...', 'warn');
          setTimeout(_spAutoAdvance, 1500);
        }
        return;
      }

      // Auto-read mode (thủ công): đọc lại nội dung hiện có
      if (_spAutoRead) {
        const text = (ta?.value || '').trim();
        if (!text) return;
        _synth.cancel();
        _spSetButtons('idle');
        _hideKaraoke();
        setTimeout(window.spRead, 500);
      }
    });
  });

  /* ── Ctrl+Space: đọc / tạm dừng / tiếp tục ── */
  document.addEventListener('keydown', function (e) {
    if (!e.ctrlKey || e.key !== ' ') return;
    const panel = document.getElementById('speech-panel');
    if (!panel || !panel.classList.contains('sp-open')) return;
    if (document.activeElement === document.getElementById('sp-textarea')) return;
    e.preventDefault();
    if (_synth.speaking && !_synth.paused) window.spPause();
    else if (_synth.paused)                window.spResume();
    else                                   window.spRead();
  }, { capture: true });

})();
