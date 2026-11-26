/* ===== shared quick actions ===== */
const Actions = {
  toggleTask(id) {
    const t = S.tasks.find((x) => x.id === id);
    if (!t) return;
    t.done = !t.done;
    t.doneAt = t.done ? todayISO() : null;
    if (t.done) { S.stats.tasksDone = (S.stats.tasksDone || 0) + 1; toast('משימה הושלמה! 🎉', 'ok'); }
    save(); checkAchievements(); render();
  },
  addTask(preset) {
    formSheet('משימה חדשה', [
      { name: 'title', label: 'מה צריך לעשות?', required: true, ph: 'למשל: לסדר את השיעור' },
      { name: 'due', label: 'מתי?', type: 'date', value: todayISO() },
      { name: 'priority', label: 'עדיפות', type: 'select', options: [{ v: 'normal', t: 'רגיל' }, { v: 'high', t: 'דחוף' }, { v: 'low', t: 'בהמשך' }], value: 'normal' },
      { name: 'notes', label: 'הערה (לא חובה)', type: 'textarea', ph: 'פרטים, קישור או מה שצריך לזכור' }
    ], (v) => {
      S.tasks.unshift({ id: uid('t'), title: v.title, due: v.due, priority: v.priority, notes: v.notes, image: null, done: false, doneAt: null, created: todayISO() });
      save(); toast('המשימה נוספה', 'ok'); render();
    }, 'הוספה');
  },
  addEvent(preset) {
    formSheet('אירוע חדש', [
      { name: 'title', label: 'שם האירוע', required: true, ph: 'למשל: יום הולדת של נועה' },
      { name: 'type', label: 'סוג', type: 'select', options: [{ v: 'event', t: 'אירוע' }, { v: 'birthday', t: 'יום הולדת' }, { v: 'exam', t: 'מבחן' }, { v: 'reminder', t: 'תזכורת' }], value: (preset && preset.type) || 'event' },
      { name: 'date', label: 'תאריך', type: 'date', value: (preset && preset.date) || todayISO(), required: true },
      { name: 'time', label: 'שעה (לא חובה)', type: 'time' },
      { name: 'notes', label: 'הערות', type: 'textarea' }
    ], (v) => {
      S.events.push({ id: uid('e'), title: v.title, type: v.type, date: v.date, time: v.time, notes: v.notes, image: null, done: false, notified: false });
      S.events.sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
      save(); toast('האירוע נשמר ביומן', 'ok'); checkAchievements(); render();
    }, 'שמירה');
  },
  toggleEvent(id) {
    const e = S.events.find((x) => x.id === id);
    if (!e) return;
    e.done = !e.done; save(); render();
  },
  addShopping() {
    formSheet('פריט לקניות', [
      { name: 'name', label: 'מה לקנות?', required: true, ph: 'חלב, לחם, סוללה…' },
      { name: 'qty', label: 'כמות (לא חובה)', ph: '2 יחידות' }
    ], (v) => {
      S.shopping.push({ id: uid('s'), name: v.name, qty: v.qty, done: false });
      save(); toast('נוסף לרשימת הקניות', 'ok'); render();
    }, 'הוספה');
  },
  addWish() {
    formSheet('משאלה חדשה', [
      { name: 'title', label: 'מה בא לך?', required: true, ph: 'ספר, אוזניות, טיול…' },
      { name: 'price', label: 'מחיר משוער (₪)', type: 'number', min: 0 },
      { name: 'note', label: 'הערה', ph: 'למי, לאיזה אירוע, קישור…' }
    ], (v) => {
      S.wishes.push({ id: uid('w'), title: v.title, price: v.price, note: v.note, got: false });
      save(); toast('נשמר ברשימת המשאלות', 'ok'); render();
    }, 'שמירה');
  },
  addNote() {
    formSheet('הערה חדשה', [
      { name: 'text', label: 'מה לרשום?', type: 'textarea', required: true, ph: 'מחשבה, רעיון, משהו לזכור…' }
    ], (v) => {
      S.notes.unshift({ id: uid('n'), text: v.text, date: todayISO() });
      save(); toast('ההערה נשמרה', 'ok'); render();
    }, 'שמירה');
  },
  addGoal() {
    formSheet('מטרה חדשה', [
      { name: 'title', label: 'מה המטרה?', required: true, ph: 'למשל: לקרוא 5 ספרים' },
      { name: 'target', label: 'יעד מספרי', type: 'number', min: 1, value: 10, required: true },
      { name: 'unit', label: 'יחידה', ph: 'ספרים / ק"מ / דקות' },
      { name: 'deadline', label: 'עד מתי?', type: 'date' }
    ], (v) => {
      S.goals.push({ id: uid('g'), title: v.title, target: Number(v.target) || 1, current: 0, unit: v.unit || '', deadline: v.deadline, created: todayISO() });
      save(); toast('המטרה נוצרה 💪', 'ok'); render();
    }, 'יצירה');
  }
};

/* ===== home screen ===== */
const Home = {
  greeting() {
    const h = new Date().getHours();
    if (h < 5) return 'לילה טוב';
    if (h < 12) return 'בוקר טוב';
    if (h < 17) return 'צהריים טובים';
    if (h < 21) return 'ערב טוב';
    return 'לילה טוב';
  },
  ensureDaily() {
    const t = todayISO();
    if (!S.daily || S.daily.date !== t) {
      const seed = Math.floor(parseISO(t).getTime() / 86400000);
      S.daily = { date: t, ideaId: ACTIVITIES[seed % ACTIVITIES.length].id, challengeDone: false, seed: seed };
      save();
    }
    if (S.daily.seed == null) S.daily.seed = Math.floor(parseISO(t).getTime() / 86400000);
    return S.daily;
  },
  todaysTasks() {
    const t = todayISO();
    return S.tasks.filter((x) => !x.done && (!x.due || x.due <= t)).slice(0, 6);
  },
  todaysEvents() {
    const t = todayISO();
    return S.events.filter((e) => !e.done && e.date === t).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  },
  render(view) {
    const d = this.ensureDaily();
    const idea = ACTIVITIES.find((a) => a.id === d.ideaId) || ACTIVITIES[0];
    const challenge = CHALLENGES[d.seed % CHALLENGES.length];
    const tasks = this.todaysTasks();
    const events = this.todaysEvents();
    const u = S.user;
    const sec = S.prefs.homeSections || [];
    const openTasks = S.tasks.filter((x) => !x.done).length;
    const weekDone = S.tasks.filter((x) => x.done && x.doneAt && isSameWeek(x.doneAt)).length;
    const nextEv = S.events.filter((e) => !e.done && daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
    const doneToday = S.tasks.filter((x) => x.done && x.doneAt === todayISO()).length;
    const totalToday = doneToday + tasks.length;
    const pct = totalToday ? Math.round((doneToday / totalToday) * 100) : 0;

    let html = '<div class="shell">';

    if (sec.includes('hero')) {
      html += '<div class="hero fade">' +
        '<div class="row" style="gap:12px">' +
        '<div class="avatar lg" style="background:rgba(255,255,255,.24);border-color:rgba(255,255,255,.35)">' + (u.avatar || '🌈') + '</div>' +
        '<div class="sp"><div style="font-size:12.5px;font-weight:800;opacity:.9">' + esc(this.greeting()) + ', ' + esc(u.first) + ' 👋</div>' +
        '<div class="h1" style="color:#fff">' + (totalToday ? (doneToday + ' מתוך ' + totalToday + ' להיום') : 'יום נקי, אפשר להתחיל') + '</div>' +
        '<div class="sub" style="font-size:12.5px;margin-top:3px">' + HEB_DOW[new Date().getDay()] + ', ' + fmtLong(todayISO()) +
        (S.streak.count > 1 ? ' · רצף ' + S.streak.count + ' ימים 🔥' : '') + '</div></div>' +
        '<div class="ring" style="width:58px;height:58px"><svg width="58" height="58"><circle cx="29" cy="29" r="25" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="6"/>' +
        '<circle cx="29" cy="29" r="25" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (157 * pct / 100).toFixed(1) + ' 157"/></svg>' +
        '<span style="color:#fff;font-size:12px">' + pct + '%</span></div>' +
        '</div>' +
        (nextEv ? '<div style="margin-top:14px;background:rgba(255,255,255,.18);border-radius:14px;padding:9px 12px;font-size:12.5px;font-weight:700">' +
          '⏳ ' + esc(nextEv.title) + ' · ' + (daysUntil(nextEv.date) === 0 ? 'היום' : 'בעוד ' + daysUntil(nextEv.date) + ' ימים') + '</div>' : '') +
        '</div>';
    }

    if (sec.includes('quick')) {
      html += '<div class="section"><div class="quick">' +
        '<button data-q="task"><i>✅</i>משימה</button>' +
        '<button data-q="event"><i>📅</i>אירוע</button>' +
        '<button data-q="idea"><i>🎲</i>רעיון</button>' +
        '<button data-q="design"><i>🎨</i>עיצוב</button>' +
        '<button data-q="timer"><i>⏱️</i>טיימר</button>' +
        '<button data-q="shop"><i>🛒</i>קניות</button>' +
        '<button data-q="goal"><i>🎯</i>מטרה</button>' +
        '<button data-q="games"><i>🕹️</i>משחקים</button>' +
        '<button data-q="search"><i>🔍</i>חיפוש</button>' +
        '</div></div>';
    }

    if (sec.includes('today')) {
      html += '<div class="section"><div class="section-head"><div class="h2">🗓️ להיום</div>' +
        '<button class="btn soft xs" data-add-task>+ משימה</button></div>';
      html += '<div class="card tight">';
      if (!tasks.length && !events.length) {
        html += '<div class="empty">אין כלום להיום. זה הזמן להוסיף משימה או להגריל פעילות 🎲</div>';
      } else {
        events.forEach((e) => {
          html += '<div class="item" style="margin-bottom:8px"><span style="font-size:18px">' + this.evIcon(e.type) + '</span>' +
            '<span class="sp"><span class="item-title">' + esc(e.title) + '</span><span class="item-sub">' + esc(e.time || 'כל היום') + ' · ' + esc(this.typeLabel(e.type)) + '</span></span>' +
            '<button class="check" data-ev="' + e.id + '">✓</button></div>';
        });
        tasks.forEach((t) => {
          html += '<div class="item" style="margin-bottom:8px"><button class="check" data-task="' + t.id + '">✓</button>' +
            '<span class="sp"><span class="item-title">' + esc(t.title) + '</span>' +
            '<span class="item-sub">' + (t.priority === 'high' ? '🔴 דחוף · ' : '') + (t.due ? fmtNice(t.due) : 'בלי תאריך') + '</span></span></div>';
        });
      }
      html += '</div></div>';
    }

    if (sec.includes('idea')) {
      html += '<div class="section"><div class="section-head"><div class="h2">✨ הרעיון של היום</div>' +
        '<button class="btn ghost xs" data-idea-more>עוד רעיונות</button></div>' +
        '<div class="idea-card" style="background:linear-gradient(140deg,' + (CATS[idea.cat] ? CATS[idea.cat].color : '#8B5CF6') + ',#A78BFA)">' +
        '<div class="big">' + idea.icon + '</div>' +
        '<h3>' + esc(idea.title) + '</h3><p>' + esc(idea.desc) + '</p>' +
        '<div class="meta"><span>⏱ ' + idea.min + ' דק׳</span><span>👥 ' + (idea.people === 1 ? 'לבד' : idea.people + ' אנשים') + '</span><span>💰 ' + idea.budget + '</span><span>📍 ' + idea.place + '</span></div>' +
        '</div>' +
        '<div class="card tight" style="margin-top:12px;display:flex;align-items:center;gap:12px">' +
        '<span style="font-size:26px">' + challenge[0] + '</span>' +
        '<div class="sp"><div class="h3">' + esc(challenge[1]) + '</div><div class="tiny">' + esc(challenge[2]) + '</div></div>' +
        '<button class="btn ' + (d.challengeDone ? 'sage' : 'soft') + ' xs" data-challenge>' + (d.challengeDone ? 'הושלם ✓' : 'אתגר אותי') + '</button>' +
        '</div></div>';
    }

    if (sec.includes('stats')) {
      html += '<div class="section"><div class="section-head"><div class="h2">📊 ההתקדמות שלך</div>' +
        '<button class="btn ghost xs" data-go-profile>פירוט</button></div>' +
        '<div class="grid g4">' +
        '<div class="stat"><b>' + weekDone + '</b><span>משימות השבוע</span></div>' +
        '<div class="stat"><b>' + S.stats.ideas + '</b><span>רעיונות</span></div>' +
        '<div class="stat"><b>' + S.designs.length + '</b><span>עיצובים</span></div>' +
        '<div class="stat"><b>' + unlockedCount() + '/' + ACHIEVEMENTS.length + '</b><span>הישגים</span></div>' +
        '</div>' +
        '<div class="card tight" style="margin-top:12px">' +
        '<div class="row" style="justify-content:space-between;margin-bottom:7px"><span class="tiny" style="font-weight:800">משימות פתוחות</span><span class="tiny">' + openTasks + ' ממתינות</span></div>' +
        '<div class="bar"><i style="width:' + Math.min(100, Math.round((weekDone / Math.max(1, weekDone + openTasks)) * 100)) + '%"></i></div>' +
        '</div></div>';
    }

    if (sec.includes('ach')) {
      const got = ACHIEVEMENTS.filter((a) => S.achievements[a.key]).slice(-4);
      if (got.length) {
        html += '<div class="section"><div class="section-head"><div class="h2">🏅 הישגים אחרונים</div>' +
          '<button class="btn ghost xs" data-go-profile>כולם</button></div><div class="ach">' +
          got.map((a) => '<div class="ach-card"><i>' + a.icon + '</i><b>' + esc(a.title) + '</b><span>' + esc(a.desc) + '</span></div>').join('') +
          '</div></div>';
      }
    }

    html += '<div class="section"><div class="card tight" style="display:flex;align-items:center;gap:12px">' +
      '<span style="font-size:24px">💜</span><div class="sp"><div class="h3">MIXIT בשבילך</div>' +
      '<div class="tiny">כל מה שתעדכנו נשמר אוטומטית במכשיר. אפשר לחזור לזה מחר.</div></div>' +
      '<button class="icon-btn" data-q="search">🔍</button></div></div>';

    html += '</div>';
    view.innerHTML = html;

    $$('[data-q]', view).forEach((b) => {
      b.onclick = () => {
        const q = b.dataset.q;
        if (q === 'task') Actions.addTask();
        else if (q === 'event') Actions.addEvent();
        else if (q === 'idea') go('next');
        else if (q === 'design') go('create');
        else if (q === 'timer') Timers.open();
        else if (q === 'shop') { UI.tab.organizer = 'lists'; go('organizer'); }
        else if (q === 'goal') Actions.addGoal();
        else if (q === 'games') go('games');
        else if (q === 'search') openSearch();
      };
    });
    $$('[data-task]', view).forEach((b) => { b.onclick = () => Actions.toggleTask(b.dataset.task); });
    $$('[data-ev]', view).forEach((b) => { b.onclick = () => Actions.toggleEvent(b.dataset.ev); });
    const at = $('[data-add-task]', view); if (at) at.onclick = () => Actions.addTask();
    const im = $('[data-idea-more]', view); if (im) im.onclick = () => go('next');
    const ch = $('[data-challenge]', view);
    if (ch) ch.onclick = () => {
      S.daily.challengeDone = !S.daily.challengeDone; save();
      if (S.daily.challengeDone) { bump('ideas', 0); toast('אתגר היום הושלם 💪', 'ok'); }
      render();
    };
    const gp = $('[data-go-profile]', view); if (gp) gp.onclick = () => go('profile');
  },
  evIcon(type) { return type === 'birthday' ? '🎂' : type === 'exam' ? '📚' : type === 'reminder' ? '🔔' : '📅'; },
  typeLabel(type) { return type === 'birthday' ? 'יום הולדת' : type === 'exam' ? 'מבחן' : type === 'reminder' ? 'תזכורת' : 'אירוע'; }
};

SCREENS.home = (v) => Home.render(v);
