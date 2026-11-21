/* ===== MIXIT core: state, storage, router, ui helpers ===== */
const DB_KEY = 'mixit.v1';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const uid = (p) => (p || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function defaultState() {
  return {
    v: 1,
    user: null,
    seenIntro: false,
    theme: { preset: 'lavender', brand: '#8B5CF6', brand2: '#A78BFA', bg: 'aurora' },
    prefs: {
      homeSections: ['hero', 'quick', 'today', 'idea', 'stats', 'ach'],
      iconSet: 'soft',
      notify: false,
      weekStart: 0
    },
    events: [], tasks: [], homework: [], goals: [], shopping: [], wishes: [],
    budget: { limit: 0, entries: [] },
    timetable: [], countdowns: [],
    activities: { favorites: [], custom: [], history: [] },
    designs: [], folders: [], notes: [],
    achievements: {}, stats: { tasksDone: 0, designs: 0, ideas: 0, minutes: 0, areas: {}, days: [] },
    streak: { last: null, count: 0 },
    daily: { date: null, ideaId: null, challengeDone: false },
    introSeenAt: null
  };
}

let S = defaultState();
const UI = { screen: 'home', tab: {}, cal: {}, studio: null, searchOpen: false };

function deepMerge(base, extra) {
  if (Array.isArray(base)) return Array.isArray(extra) ? extra : base;
  if (base && typeof base === 'object') {
    const out = Object.assign({}, base);
    if (extra && typeof extra === 'object') {
      for (const k in extra) out[k] = k in base ? deepMerge(base[k], extra[k]) : extra[k];
    }
    return out;
  }
  return extra === undefined ? base : extra;
}

function load() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return deepMerge(defaultState(), parsed);
  } catch (e) {
    console.warn('load failed', e);
    return defaultState();
  }
}

let saveTimer = null;
function save(immediate) {
  const write = () => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(S));
    } catch (e) {
      console.warn('save failed', e);
      toast('שמירה נכשלה: אין מקום באחסון הדפדפן. נסו למחוק עיצובים ישנים.', 'err', 6000);
    }
  };
  clearTimeout(saveTimer);
  if (immediate) write();
  else saveTimer = setTimeout(write, 220);
}

/* ---------- dates ---------- */
const HEB_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const HEB_DOW = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const HEB_DOW_S = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

function iso(d) {
  const x = d instanceof Date ? d : new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate());
}
function todayISO() { return iso(new Date()); }
function parseISO(s) {
  if (!s) return new Date(NaN);
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmtShort(s) { const d = parseISO(s); return d.getDate() + '.' + (d.getMonth() + 1); }
function fmtLong(s) { const d = parseISO(s); return d.getDate() + ' ב' + HEB_MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
function fmtNice(s) {
  const d = parseISO(s), t = new Date();
  const diff = Math.round((parseISO(todayISO()) - parseISO(s)) / 86400000);
  if (diff === 0) return 'היום';
  if (diff === 1) return 'אתמול';
  if (diff === -1) return 'מחר';
  if (diff === -2) return 'מחרתיים';
  if (diff > 1) return 'לפני ' + diff + ' ימים';
  if (diff < -1 && diff > -7) return 'בעוד ' + (-diff) + ' ימים';
  return fmtShort(s);
}
function daysUntil(s) { return Math.round((parseISO(s) - parseISO(todayISO())) / 86400000); }
function weekDates(startISO) {
  const base = startISO ? parseISO(startISO) : new Date();
  const start = addDays(base, -((base.getDay() - 0 + 7) % 7));
  return Array.from({ length: 7 }, (_, i) => iso(addDays(start, i)));
}
function isSameWeek(isoStr) {
  const d = parseISO(isoStr); const now = new Date();
  const a = addDays(now, -((now.getDay()) % 7));
  return d >= parseISO(iso(a)) && d < addDays(parseISO(iso(a)), 7);
}
function dayIndex(i) { return HEB_DOW[i % 7]; }

/* ---------- theme ---------- */
const THEME_PRESETS = {
  lavender: { brand: '#8B5CF6', brand2: '#A78BFA', soft: '#EDE7FF', name: 'סגול לבנדר' },
  sky: { brand: '#38BDF8', brand2: '#7DD3FC', soft: '#E3F6FF', name: 'תכלת בהיר' },
  pink: { brand: '#F472B6', brand2: '#F9A8D4', soft: '#FDE7F3', name: 'ורוד עדין' },
  sage: { brand: '#7FA98B', brand2: '#A7C4A0', soft: '#E7F2E9', name: 'ירוק מרווה' },
  beige: { brand: '#C89B6D', brand2: '#E6C9A8', soft: '#FBF1E5', name: 'בז׳ חם' },
  berry: { brand: '#C05C8B', brand2: '#E8A0BE', soft: '#FBE7EF', name: 'פוקסיה עמוק' }
};
const BG_OPTIONS = {
  aurora: 'אורורה סגולה', plain: 'נקי ורגוע', warm: 'חם ובז׳', sage: 'מרווה טבעי', night: 'לילה כהה'
};

function applyTheme() {
  const t = S.theme || {};
  const p = THEME_PRESETS[t.preset] || THEME_PRESETS.lavender;
  const root = document.documentElement.style;
  root.setProperty('--brand', t.brand || p.brand);
  root.setProperty('--brand-2', t.brand2 || p.brand2);
  root.setProperty('--brand-soft', p.soft);
  document.body.dataset.bg = t.bg || 'aurora';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t.brand || p.brand);
}

/* ---------- toasts ---------- */
function toast(msg, type, ms) {
  let wrap = $('#toasts');
  if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toasts'; wrap.className = 'toasts'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast ' + (type || 'info');
  const icon = type === 'ok' ? '✅' : type === 'err' ? '⚠️' : '✨';
  t.innerHTML = '<span>' + icon + '</span><span>' + esc(msg) + '</span>';
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 260); }, ms || 2400);
}

/* ---------- sheets ---------- */
let sheetEl = null;
function openSheet(opts) {
  closeSheet(true);
  const back = document.createElement('div');
  back.className = 'backdrop';
  back.innerHTML = '<div class="sheet" role="dialog" aria-modal="true"><div class="sheet-grab"></div>' +
    '<div class="sheet-head"><div class="h2">' + esc(opts.title || '') + '</div>' +
    '<button class="icon-btn" data-close aria-label="סגירה">✕</button></div>' +
    '<div class="sheet-body">' + (opts.body || '') + '</div></div>';
  back.addEventListener('click', (e) => { if (e.target === back) closeSheet(); });
  back.querySelector('[data-close]').addEventListener('click', () => closeSheet());
  document.body.appendChild(back);
  sheetEl = back;
  document.body.style.overflow = 'hidden';
  if (opts.onMount) opts.onMount(back.querySelector('.sheet'));
  return back;
}
function closeSheet(silent) {
  if (sheetEl) { sheetEl.remove(); sheetEl = null; }
  if (!silent) document.body.style.overflow = '';
  else document.body.style.overflow = '';
}
function confirmSheet(title, text, onYes, yesLabel) {
  openSheet({
    title: title,
    body: '<p class="sub" style="margin-bottom:16px">' + esc(text) + '</p>' +
      '<div class="row"><button class="btn danger block" data-yes>' + esc(yesLabel || 'כן, למחוק') + '</button>' +
      '<button class="btn ghost block" data-no>ביטול</button></div>',
    onMount: (root) => {
      root.querySelector('[data-yes]').onclick = () => { closeSheet(); onYes(); };
      root.querySelector('[data-no]').onclick = () => closeSheet();
    }
  });
}
function formSheet(title, fields, onSubmit, submitLabel) {
  const body = fields.map((f) => {
    const id = 'f_' + f.name;
    let input;
    if (f.type === 'textarea') input = '<textarea class="input" id="' + id + '" placeholder="' + esc(f.ph || '') + '">' + esc(f.value || '') + '</textarea>';
    else if (f.type === 'select') input = '<select class="input" id="' + id + '">' + f.options.map((o) => '<option value="' + esc(o.v) + '"' + (String(o.v) === String(f.value) ? ' selected' : '') + '>' + esc(o.t) + '</option>').join('') + '</select>';
    else if (f.type === 'date') input = '<input class="input" type="date" id="' + id + '" value="' + esc(f.value || todayISO()) + '">';
    else if (f.type === 'time') input = '<input class="input" type="time" id="' + id + '" value="' + esc(f.value || '') + '">';
    else if (f.type === 'number') input = '<input class="input" type="number" id="' + id + '" value="' + esc(f.value == null ? '' : f.value) + '" placeholder="' + esc(f.ph || '') + '"' + (f.min != null ? ' min="' + f.min + '"' : '') + '>';
    else if (f.type === 'color') input = '<input type="color" id="' + id + '" value="' + esc(f.value || '#8B5CF6') + '">';
    else input = '<input class="input" id="' + id + '" value="' + esc(f.value || '') + '" placeholder="' + esc(f.ph || '') + '"' + (f.maxlength ? ' maxlength="' + f.maxlength + '"' : '') + '>';
    return '<div class="field" style="margin-bottom:12px"><label for="' + id + '">' + esc(f.label) + '</label>' + input + '</div>';
  }).join('');
  openSheet({
    title: title,
    body: body + '<button class="btn block" data-submit style="margin-top:6px">' + esc(submitLabel || 'שמירה') + '</button>',
    onMount: (root) => {
      const submit = () => {
        const out = {};
        let ok = true;
        fields.forEach((f) => {
          const el = root.querySelector('#f_' + f.name);
          let v = el.value;
          if (f.type === 'number') v = v === '' ? '' : Number(v);
          if (f.required && (v === '' || v == null)) { ok = false; el.style.borderColor = '#E11D48'; }
          out[f.name] = v;
        });
        if (!ok) { toast('צריך למלא את השדות המסומנים', 'err'); return; }
        closeSheet();
        onSubmit(out);
      };
      root.querySelector('[data-submit]').onclick = submit;
      const first = root.querySelector('.input');
      if (first) setTimeout(() => first.focus(), 120);
      root.querySelectorAll('.input').forEach((el) => {
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' && el.tagName !== 'TEXTAREA') { e.preventDefault(); submit(); } });
      });
    }
  });
}

/* ---------- images ---------- */
function compressImage(file, max, quality) {
  max = max || 1100; quality = quality || 0.78;
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width: w, height: h } = img;
        const scale = Math.min(1, max / Math.max(w, h));
        w = Math.round(w * scale); h = Math.round(h * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        try { resolve(c.toDataURL('image/jpeg', quality)); } catch (e) { reject(e); }
      };
      img.onerror = reject;
      img.src = fr.result;
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
function pickImage(cb, max) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.style.display = 'none';
  document.body.appendChild(inp);
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    inp.remove();
    if (!f) return;
    if (f.size > 12 * 1024 * 1024) { toast('התמונה גדולה מדי (מקסימום 12MB)', 'err'); return; }
    compressImage(f, max || 1100).then(cb).catch(() => toast('לא הצלחתי לקרוא את התמונה', 'err'));
  };
  inp.click();
}
function pickImages(cb, max) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
  inp.style.display = 'none';
  document.body.appendChild(inp);
  inp.onchange = async () => {
    const files = Array.from(inp.files || []).slice(0, 9);
    inp.remove();
    if (!files.length) return;
    try {
      const out = [];
      for (const f of files) out.push(await compressImage(f, max || 1000));
      cb(out);
    } catch (e) { toast('שגיאה בטעינת התמונות', 'err'); }
  };
  inp.click();
}

/* ---------- achievements ---------- */
const ACHIEVEMENTS = [
  { key: 'hello', icon: '🌟', title: 'ברוכים הבאים', desc: 'נרשמת ל-MIXIT', test: () => !!S.user },
  { key: 'first_task', icon: '✅', title: 'משימה ראשונה', desc: 'סימנת משימה שהושלמה', test: () => S.stats.tasksDone >= 1 },
  { key: 'tasks10', icon: '🧺', title: 'עשר ביד', desc: 'השלמת 10 משימות', test: () => S.stats.tasksDone >= 10 },
  { key: 'tasks50', icon: '🏆', title: 'מכונת ביצוע', desc: 'השלמת 50 משימות', test: () => S.stats.tasksDone >= 50 },
  { key: 'first_event', icon: '📅', title: 'על היומן', desc: 'הוספת אירוע ראשון', test: () => S.events.length >= 1 },
  { key: 'first_design', icon: '🎨', title: 'יוצר/ת', desc: 'שמרת עיצוב ראשון', test: () => S.stats.designs >= 1 },
  { key: 'designs10', icon: '🖼️', title: 'סטודיו פעיל', desc: '10 עיצובים שמורים', test: () => S.stats.designs >= 10 },
  { key: 'first_idea', icon: '🎲', title: 'רעיון ראשון', desc: 'הגרלת פעילות', test: () => S.stats.ideas >= 1 },
  { key: 'ideas10', icon: '💡', title: 'מלאי רעיונות', desc: '10 פעילויות שהוגרלו', test: () => S.stats.ideas >= 10 },
  { key: 'fav5', icon: '💖', title: 'אוסף מועדפים', desc: '5 פעילויות במועדפים', test: () => S.activities.favorites.length >= 5 },
  { key: 'goal_done', icon: '🎯', title: 'יעד הושג', desc: 'הגעת ליעד שהצבת', test: () => S.goals.some((g) => Number(g.current) >= Number(g.target) && Number(g.target) > 0) },
  { key: 'budget', icon: '💰', title: 'בשליטה', desc: 'הגדרת תקציב חודשי', test: () => S.budget.limit > 0 },
  { key: 'streak3', icon: '🔥', title: 'רצף 3 ימים', desc: 'נכנסת 3 ימים ברצף', test: () => S.streak.count >= 3 },
  { key: 'streak7', icon: '⚡', title: 'שבוע ברצף', desc: 'נכנסת 7 ימים ברצף', test: () => S.streak.count >= 7 },
  { key: 'focus', icon: '⏱️', title: 'פוקוס', desc: 'צברת 25 דקות טיימר', test: () => S.stats.minutes >= 25 },
  { key: 'allround', icon: '🌈', title: 'הכל בכל', desc: 'ביקרת בכל 5 האזורים', test: () => ['home', 'organizer', 'next', 'create', 'profile'].every((k) => S.stats.areas[k]) }
];

function unlockedCount() { return ACHIEVEMENTS.filter((a) => S.achievements[a.key]).length; }
function checkAchievements() {
  let newOnes = [];
  ACHIEVEMENTS.forEach((a) => {
    if (S.achievements[a.key]) return;
    let ok = false;
    try { ok = !!a.test(); } catch (e) { ok = false; }
    if (ok) { S.achievements[a.key] = todayISO(); newOnes.push(a); }
  });
  if (newOnes.length) {
    save();
    newOnes.forEach((a, i) => setTimeout(() => toast('הישג חדש: ' + a.icon + ' ' + a.title, 'ok', 3200), i * 700));
  }
  return newOnes;
}
function bump(key, n) {
  S.stats[key] = (S.stats[key] || 0) + (n == null ? 1 : n);
  checkAchievements();
}

/* ---------- streak ---------- */
function touchStreak() {
  const t = todayISO();
  if (S.streak.last === t) return;
  const y = iso(addDays(new Date(), -1));
  S.streak.count = S.streak.last === y ? (S.streak.count || 1) + 1 : 1;
  S.streak.last = t;
  S.stats.days = (S.stats.days || []).concat([t]).slice(-400);
  save();
}

/* ---------- reminders ---------- */
let reminderTimer = null;
function initReminders() {
  if (reminderTimer) return;
  const tick = () => {
    if (!S.user || !S.prefs.notify) return;
    const now = new Date();
    const t = todayISO();
    const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    S.events.forEach((ev) => {
      if (ev.date !== t || !ev.time || ev.notified || ev.done) return;
      if (ev.time === hhmm) {
        ev.notified = true; save();
        const msg = 'תזכורת: ' + ev.title + ' בשעה ' + ev.time;
        toast(msg, 'info', 5000);
        notifyNative('MIXIT · ' + ev.title, ev.time + (ev.notes ? ' · ' + ev.notes : ''));
      }
    });
    // due-day reminders for homework
    S.homework.forEach((hw) => {
      if (hw.done || hw.notified || hw.due !== t) return;
      hw.notified = true; save();
      toast('שיעורי בית להיום: ' + hw.title, 'info', 4200);
    });
  };
  reminderTimer = setInterval(tick, 30000);
  tick();
}
function notifyNative(title, body) {
  try {
    if (S.prefs.notify && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: body, icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌈</text></svg>' });
    }
  } catch (e) { /* ignore */ }
}
function askNotifications() {
  if (!('Notification' in window)) { toast('הדפדפן הזה לא תומך בהתראות', 'err'); return; }
  if (Notification.permission === 'granted') { S.prefs.notify = true; save(); toast('התראות פעילות', 'ok'); render(); return; }
  Notification.requestPermission().then((p) => {
    S.prefs.notify = p === 'granted';
    save(); render();
    toast(p === 'granted' ? 'התראות הופעלו' : 'לא אושרו התראות. אפשר להפעיל בהגדרות הדפדפן', p === 'granted' ? 'ok' : 'err');
  }).catch(() => toast('לא הצלחתי להפעיל התראות', 'err'));
}

/* ---------- global search ---------- */
function searchAll(q) {
  q = (q || '').trim().toLowerCase();
  if (!q) return [];
  const out = [];
  const push = (type, icon, title, sub, screen, extra) => out.push({ type, icon, title, sub, screen, extra });
  S.tasks.forEach((t) => { if ((t.title + ' ' + (t.notes || '')).toLowerCase().includes(q)) push('משימה', '✅', t.title, (t.done ? 'הושלמה' : 'פתוחה') + (t.notes ? ' · ' + t.notes : ''), 'organizer', { tab: 'tasks' }); });
  S.events.forEach((e) => { if ((e.title + ' ' + (e.notes || '')).toLowerCase().includes(q)) push('יומן', '📅', e.title, fmtLong(e.date) + (e.time ? ' · ' + e.time : ''), 'organizer', { tab: 'calendar' }); });
  S.homework.forEach((h) => { if ((h.title + ' ' + h.subject).toLowerCase().includes(q)) push('לימודים', '📚', h.title, h.subject + ' · ' + fmtNice(h.due), 'organizer', { tab: 'study' }); });
  S.goals.forEach((g) => { if (g.title.toLowerCase().includes(q)) push('מטרה', '🎯', g.title, g.current + '/' + g.target + ' ' + (g.unit || ''), 'organizer', { tab: 'goals' }); });
  S.shopping.forEach((s) => { if (s.name.toLowerCase().includes(q)) push('קניות', '🛒', s.name, s.done ? 'נקנה' : 'ברשימה', 'organizer', { tab: 'lists' }); });
  S.wishes.forEach((w) => { if (w.title.toLowerCase().includes(q)) push('משאלות', '🎁', w.title, w.got ? 'יש!' : (w.price ? w.price + ' ₪' : ''), 'organizer', { tab: 'lists' }); });
  S.budget.entries.forEach((b) => { if ((b.desc + ' ' + b.cat).toLowerCase().includes(q)) push('תקציב', '💰', b.desc, b.amount + ' ₪ · ' + fmtShort(b.date), 'organizer', { tab: 'budget' }); });
  S.designs.forEach((d) => { if ((d.title || '').toLowerCase().includes(q)) push('עיצוב', '🎨', d.title || 'עיצוב', d.type, 'create', { open: d.id }); });
  ACTIVITIES.forEach((a) => { if ((a.title + ' ' + a.desc).toLowerCase().includes(q)) push('פעילות', a.icon || '🎲', a.title, a.desc.slice(0, 60), 'next', { activity: a.id }); });
  S.activities.custom.forEach((a) => { if ((a.title + ' ' + (a.desc || '')).toLowerCase().includes(q)) push('פעילות שלי', '⭐', a.title, a.desc || '', 'next', { activity: a.id }); });
  return out.slice(0, 40);
}

function openSearch() {
  openSheet({
    title: 'חיפוש בכל MIXIT',
    body: '<input class="input" id="q" placeholder="חפשו משימה, אירוע, עיצוב, רעיון…" autocomplete="off">' +
      '<div id="results" style="margin-top:14px"></div>',
    onMount: (root) => {
      const q = root.querySelector('#q');
      const res = root.querySelector('#results');
      const draw = () => {
        const items = searchAll(q.value);
        if (!q.value.trim()) {
          res.innerHTML = '<p class="muted" style="text-align:center;padding:18px">אפשר לחפש בכל חלקי האפליקציה: משימות, יומן, לימודים, תקציב, עיצובים ורעיונות.</p>';
          return;
        }
        if (!items.length) { res.innerHTML = '<div class="empty">לא נמצאו תוצאות עבור “' + esc(q.value) + '”</div>'; return; }
        res.innerHTML = items.map((it, i) => '<button class="item" data-i="' + i + '" style="width:100%;text-align:start;margin-bottom:8px">' +
          '<span style="font-size:19px">' + it.icon + '</span><span class="sp"><span class="item-title">' + esc(it.title) + '</span>' +
          '<span class="item-sub">' + esc(it.type) + ' · ' + esc(it.sub) + '</span></span><span style="color:var(--ink-3)">›</span></button>').join('');
        $$('[data-i]', res).forEach((b) => {
          b.onclick = () => {
            const it = items[Number(b.dataset.i)];
            closeSheet();
            if (it.extra && it.extra.tab) UI.tab.organizer = it.extra.tab;
            go(it.screen);
            if (it.extra && it.extra.open && window.Studio) setTimeout(() => Studio.openSaved(it.extra.open), 240);
            if (it.extra && it.extra.activity && window.Next) setTimeout(() => Next.showById(it.extra.activity), 240);
          };
        });
      };
      q.addEventListener('input', draw);
      draw();
      setTimeout(() => q.focus(), 150);
    }
  });
}

/* ---------- router ---------- */
const SCREENS = {};
function go(name, opts) {
  UI.screen = name;
  S.stats.areas = S.stats.areas || {};
  S.stats.areas[name] = true;
  save();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
  if (opts && opts.after) setTimeout(opts.after, 60);
  checkAchievements();
}
function render() {
  const view = $('#view');
  if (!view) return;
  if (!S.user) { ScreensAuth.render(view); return; }
  const fn = SCREENS[UI.screen] || SCREENS.home;
  view.innerHTML = '';
  fn(view);
  const nav = $('#nav');
  if (nav) {
    $$('button', nav).forEach((b) => b.classList.toggle('on', b.dataset.go === UI.screen));
  }
  const top = $('#topTitle');
  if (top) top.textContent = ({ home: 'בית', organizer: 'ארגון', next: 'מה עושים עכשיו?', create: 'יצירה ועיצוב', profile: 'הפרופיל שלי' })[UI.screen] || 'MIXIT';
}
