// ══════════════════════════════════
// LIBRARY NAVIGATION
// ══════════════════════════════════
function goToLibrary() {
  if (window.navBridge) {
    window.navBridge.openLibrary();
  } else {
    window.location.href = 'library.html';
  }
}

// ── Library Dropdown ──
let _libGrade = 10;

function _libBuildGrades() {
  const gradesEl = document.getElementById('lib-dd-grades');
  if (!gradesEl || typeof LESSON_CATALOG === 'undefined') return;
  gradesEl.innerHTML = LESSON_CATALOG.grades.map(g =>
    `<button class="lib-dd-grade${g.grade === _libGrade ? ' active' : ''}"
      onclick="libShowGrade(${g.grade});event.stopPropagation()">Lớp ${g.grade}</button>`
  ).join('');
}

function libShowGrade(grade) {
  _libGrade = grade;
  document.querySelectorAll('.lib-dd-grade').forEach(b =>
    b.classList.toggle('active', b.textContent.trim() === 'Lớp ' + grade)
  );
  const lessonsEl = document.getElementById('lib-dd-lessons');
  if (!lessonsEl || typeof LESSON_CATALOG === 'undefined') return;
  const gradeData = LESSON_CATALOG.grades.find(g => g.grade === grade);
  if (!gradeData) { lessonsEl.innerHTML = ''; return; }

  const currentPath = location.pathname.replace(/\\/g, '/');
  const currentLesson = new URLSearchParams(location.search).get('lesson') || '';
  let html = '';
  gradeData.topics.forEach(topic => {
    topic.lessons.forEach(lesson => {
      const avail = lesson.status === 'available' && lesson.path;
      if (!avail) return;
      let isCur = false;
      if (lesson.path.startsWith('lesson:')) {
        isCur = currentLesson === lesson.path.slice(7);
      } else {
        const absPath = lesson.path.startsWith('http') ? lesson.path
          : new URL(lesson.path, location.href).pathname.replace(/\\/g, '/');
        isCur = currentPath.endsWith(absPath) ||
                (lesson.path === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')));
      }
      html += `<a class="lib-dd-item${isCur ? ' lib-dd-current' : ''}" href="#" data-lpath="${lesson.path}" onclick="_libNavTo(this);return false;">
        <span class="lib-dd-num">B${lesson.no}</span>
        <span class="lib-dd-title">${lesson.title}</span>
        ${isCur ? '<span class="lib-dd-cur-badge">• đang xem</span>' : ''}
      </a>`;
    });
  });
  if (!html) html = '<div class="lib-dd-empty">Chưa có bài nào cho lớp này</div>';
  lessonsEl.innerHTML = html;
}

function toggleLibraryDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById('lib-dropdown');
  if (!dd) return;
  const opening = !dd.classList.contains('open');
  dd.classList.toggle('open');
  if (opening) {
    _libBuildGrades();
    libShowGrade(_libGrade);
    setTimeout(() => document.addEventListener('click', _closeLibDd, { once: true }), 0);
  }
}

function closeLibraryDropdown() {
  const dd = document.getElementById('lib-dropdown');
  if (dd) dd.classList.remove('open');
}

function _closeLibDd(e) {
  const wrap = document.getElementById('lib-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) closeLibraryDropdown();
}

function _libNavTo(el) {
  const path = el.dataset.lpath;
  if (window.navBridge) window.navBridge.openLesson(path);
  else window.location.href = path;
}
