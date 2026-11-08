const filters = [...document.querySelectorAll('[data-filter]')];
const lessons = [...document.querySelectorAll('[data-category]')];
const rows = [...document.querySelectorAll('[data-name="Lesson row"]')];

filters.forEach(filter => filter.addEventListener('click', () => {
  const category = filter.dataset.filter;
  filters.forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
  lessons.forEach(lesson => {
    lesson.hidden = category !== 'all' && lesson.dataset.category !== category;
  });
  rows.forEach(row => {
    row.hidden = !row.querySelector('[data-category]:not([hidden])');
  });
}));

const checks = [...document.querySelectorAll('#training input[type="checkbox"]')];
const progress = document.querySelector('[aria-live="polite"]');
const bar = document.querySelector('[data-name="Empty progress bar"] span');
const storageKey = 'the-next-xi-week';

try {
  const previous = JSON.parse(localStorage.getItem(storageKey)) || [];
  checks.forEach((check, index) => { check.checked = previous[index] === true; });
} catch {
  // The weekly plan still works when browser storage is unavailable.
}

function updateProgress() {
  const state = checks.map(check => check.checked);
  const complete = state.filter(Boolean).length;
  progress.textContent = `${complete} of ${checks.length} activities complete`;
  bar.style.width = `${100 * complete / checks.length}%`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Progress remains available until the page is closed.
  }
}

checks.forEach(check => check.addEventListener('change', updateProgress));
document.querySelector('#reset-week').addEventListener('click', () => {
  checks.forEach(check => { check.checked = false; });
  updateProgress();
});
updateProgress();
