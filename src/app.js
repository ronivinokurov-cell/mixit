/* ===== app shell + boot ===== */
const ICON_SETS = {
  soft: { home: '🏡', organizer: '🗂️', next: '🎲', create: '🎨', profile: '👤' },
  emoji: { home: '🏠', organizer: '📅', next: '✨', create: '🖌️', profile: '🙂' },
  minimal: { home: '⌂', organizer: '☰', next: '✧', create: '◧', profile: '☺' }
};
const NAV_ITEMS = [
  ['home', 'בית'], ['organizer', 'ארגון'], ['next', 'מה עכשיו?'], ['create', 'יצירה'], ['profile', 'פרופיל']
];

function buildShell() {
  const app = document.getElementById('app');
  app.innerHTML =
    '<div class="topbar" id="topbar"><div class="topbar-in">' +
    '<div class="brand"><span class="brand-mark">🌈</span><div>MIXIT<small id="topTitle">בית</small></div></div>' +
    '<div class="topbar-sp"></div>' +
    '<button class="icon-btn" id="navSearch" aria-label="חיפוש">🔍</button>' +
    '<button class="icon-btn" id="navTimer" aria-label="טיימר">⏱️</button>' +
    '</div></div>' +
    '<main id="view" class="view"></main>' +
    '<nav class="nav" id="nav"></nav>' +
    '<div class="toasts" id="toasts"></div>';

  document.getElementById('navSearch').onclick = openSearch;
  document.getElementById('navTimer').onclick = () => Timers.open();

  const nav = document.getElementById('nav');
  const icons = ICON_SETS[S.prefs.iconSet] || ICON_SETS.soft;
  nav.innerHTML = NAV_ITEMS.map((n) =>
    '<button data-go="' + n[0] + '"><i>' + icons[n[0]] + '</i>' + n[1] +
    (n[0] === 'organizer' ? '<span class="dot hidden" id="navDot"></span>' : '') + '</button>').join('');
  $$('button', nav).forEach((b) => {
    b.onclick = () => {
      if (b.dataset.go === 'create') UI.tab.folder = 'all';
      go(b.dataset.go);
    };
  });
}

function syncChrome() {
  const hasUser = !!S.user;
  const tb = document.getElementById('topbar');
  const nav = document.getElementById('nav');
  if (tb) tb.style.display = hasUser ? '' : 'none';
  if (nav) nav.style.display = hasUser ? '' : 'none';
  const dot = document.getElementById('navDot');
  if (dot) {
    const t = todayISO();
    const due = S.tasks.some((x) => !x.done && x.due && x.due <= t);
    dot.classList.toggle('hidden', !due);
  }
  const title = document.getElementById('topTitle');
  if (title && hasUser) title.textContent = ({ home: 'בית', organizer: 'ארגון', next: 'מה עושים עכשיו?', create: 'יצירה ועיצוב', profile: 'הפרופיל שלי' })[UI.screen] || 'MIXIT';
}

function boot() {
  S = load();
  applyTheme();
  buildShell();
  if (S.user) touchStreak();
  const baseRender = render;
  render = function () {
    if (UI.screen !== 'games' && window.Games && Games.current) Games.stop();
    baseRender();
    syncChrome();
  };
  if (S.user) {
    UI.screen = 'home';
  }
  render();
  initReminders();
  checkAchievements();
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (S.user) openSearch(); }
    if (e.key === 'Escape') closeSheet();
  });
  window.addEventListener('beforeunload', () => save(true));
  // returning from background: refresh daily content and reminders
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && S.user) {
      const before = S.daily && S.daily.date;
      Home.ensureDaily();
      if (before !== S.daily.date) render();
    }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
