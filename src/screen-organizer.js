/* ===== ORGANIZER: calendar, tasks, study, goals ===== */
const EV_TYPES = {
  event: { label: 'אירוע', icon: '📅', color: '#8B5CF6' },
  birthday: { label: 'יום הולדת', icon: '🎂', color: '#F472B6' },
  exam: { label: 'מבחן', icon: '📚', color: '#F59E0B' },
  reminder: { label: 'תזכורת', icon: '🔔', color: '#38BDF8' }
};

const Organizer = {
  tabs() {
    return [
      ['calendar', '🗓️ יומן'], ['tasks', '✅ משימות'], ['study', '📚 לימודים'],
      ['goals', '🎯 מטרות'], ['lists', '🛒 רשימות'], ['budget', '💰 תקציב'],
      ['timetable', '🕘 מערכת שעות'], ['timers', '⏱️ טיימרים'], ['countdown', '⏳ ספירה לאחור'],
      ['summary', '📈 סיכום שבועי'], ['notes', '📝 הערות']
    ];
  },
  render(view) {
    const tab = UI.tab.organizer || 'calendar';
    let html = '<div class="shell">' +
      '<div class="row" style="margin-bottom:12px"><div class="sp"><div class="h1">MIXIT ORGANIZER</div>' +
      '<div class="sub">היום שלך, מסודר במקום אחד</div></div>' +
      '<button class="icon-btn" data-search>🔍</button></div>' +
      '<div class="tabs" style="margin-bottom:14px">' +
      this.tabs().map((t) => '<button class="tab ' + (tab === t[0] ? 'on' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>').join('') +
      '</div><div id="org-body"></div></div>';
    view.innerHTML = html;
    $$('[data-tab]', view).forEach((b) => {
      b.onclick = () => { UI.tab.organizer = b.dataset.tab; this.render(view); };
    });
    const s = $('[data-search]', view); if (s) s.onclick = openSearch;
    const body = $('#org-body', view);
    const map = {
      calendar: () => this.calendar(body), tasks: () => this.tasks(body), study: () => this.study(body),
      goals: () => this.goals(body), lists: () => this.lists(body), budget: () => this.budget(body),
      timetable: () => this.timetable(body), timers: () => this.timersTab(body), countdown: () => this.countdown(body),
      summary: () => this.summary(body), notes: () => this.notes(body)
    };
    (map[tab] || map.calendar)();
  },

  /* ---------- calendar ---------- */
  calendar(box) {
    const now = new Date();
    if (!UI.cal.month) UI.cal.month = { y: now.getFullYear(), m: now.getMonth() };
    if (!UI.cal.sel) UI.cal.sel = todayISO();
    const { y, m } = UI.cal.month;
    const first = new Date(y, m, 1);
    const startDow = first.getDay();
    const daysIn = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    const byDate = {};
    S.events.forEach((e) => { (byDate[e.date] = byDate[e.date] || []).push(e); });

    let cells = '';
    for (let i = 0; i < startDow; i++) {
      const d = prevDays - startDow + i + 1;
      cells += '<div class="cal-day out">' + d + '</div>';
    }
    for (let d = 1; d <= daysIn; d++) {
      const dateStr = iso(new Date(y, m, d));
      const evs = byDate[dateStr] || [];
      const isToday = dateStr === todayISO();
      const sel = dateStr === UI.cal.sel;
      cells += '<button class="cal-day ' + (isToday ? 'today ' : '') + (sel && !isToday ? 'sel ' : '') + '" data-date="' + dateStr + '">' + d +
        '<span class="dots">' + evs.slice(0, 3).map((e) => '<i style="background:' + EV_TYPES[e.type].color + '"></i>').join('') + '</span></button>';
    }
    const total = startDow + daysIn;
    for (let d = 1; d <= (42 - total); d++) cells += '<div class="cal-day out">' + d + '</div>';

    const selEvents = (byDate[UI.cal.sel] || []).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    const upcoming = S.events.filter((e) => !e.done && daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);

    box.innerHTML =
      '<div class="card">' +
      '<div class="cal-head"><button class="icon-btn" data-prev>›</button>' +
      '<div class="h2">' + HEB_MONTHS[m] + ' ' + y + '</div>' +
      '<button class="icon-btn" data-next>‹</button></div>' +
      '<div class="cal-grid">' + HEB_DOW_S.map((d) => '<div class="cal-dow">' + d + '</div>').join('') + '</div>' +
      '<div class="cal-grid" style="margin-top:4px">' + cells + '</div>' +
      '<div class="row" style="margin-top:10px;gap:6px;flex-wrap:wrap">' +
      Object.keys(EV_TYPES).map((k) => '<span class="badge" style="background:' + EV_TYPES[k].color + '22;color:' + EV_TYPES[k].color + '">' + EV_TYPES[k].icon + ' ' + EV_TYPES[k].label + '</span>').join('') +
      '</div></div>' +

      '<div class="section"><div class="section-head"><div class="h2">' + fmtLong(UI.cal.sel) + '</div>' +
      '<button class="btn soft xs" data-add-event>+ אירוע</button></div>' +
      (selEvents.length ? '<div class="list-plain">' + selEvents.map((e) => this.eventRow(e)).join('') + '</div>'
        : '<div class="empty">אין כלום ביום הזה. יום פנוי או הזדמנות להוסיף 🎈</div>') +
      '</div>' +

      '<div class="section"><div class="section-head"><div class="h2">⏭️ בקרוב</div></div>' +
      (upcoming.length ? '<div class="list-plain">' + upcoming.map((e) => this.eventRow(e, true)).join('') + '</div>'
        : '<div class="empty">אין אירועים קרובים</div>') + '</div>';

    const move = (dir) => {
      let nm = m + dir, ny = y;
      if (nm < 0) { nm = 11; ny--; } if (nm > 11) { nm = 0; ny++; }
      UI.cal.month = { y: ny, m: nm };
      this.calendar(box);
    };
    $('[data-prev]', box).onclick = () => move(-1);
    $('[data-next]', box).onclick = () => move(1);
    $$('[data-date]', box).forEach((b) => { b.onclick = () => { UI.cal.sel = b.dataset.date; this.calendar(box); }; });
    $('[data-add-event]', box).onclick = () => Actions.addEvent({ date: UI.cal.sel });
    this.bindEvents(box);
  },

  eventRow(e, showDate) {
    const t = EV_TYPES[e.type] || EV_TYPES.event;
    return '<div class="item ' + (e.done ? 'done' : '') + '" data-evrow="' + e.id + '">' +
      '<button class="check ' + (e.done ? 'on' : '') + '" data-evtoggle="' + e.id + '">✓</button>' +
      '<span class="sp" data-evopen="' + e.id + '" style="cursor:pointer">' +
      '<span class="item-title">' + t.icon + ' ' + esc(e.title) + '</span>' +
      '<span class="item-sub">' + (showDate ? fmtLong(e.date) + ' · ' : '') + esc(e.time || 'כל היום') + (e.notes ? ' · ' + esc(e.notes) : '') + '</span></span>' +
      '<span class="badge" style="background:' + t.color + '22;color:' + t.color + '">' + t.label + '</span>' +
      '<button class="del" data-evdel="' + e.id + '">🗑</button></div>';
  },

  bindEvents(box) {
    $$('[data-evtoggle]', box).forEach((b) => { b.onclick = () => Actions.toggleEvent(b.dataset.evtoggle); });
    $$('[data-evdel]', box).forEach((b) => {
      b.onclick = () => confirmSheet('למחוק אירוע?', 'האירוע יימחק מהיומן.', () => {
        S.events = S.events.filter((x) => x.id !== b.dataset.evdel); save(); toast('האירוע נמחק', 'ok'); render();
      });
    });
    $$('[data-evopen]', box).forEach((b) => {
      b.onclick = () => {
        const e = S.events.find((x) => x.id === b.dataset.evopen);
        if (!e) return;
        formSheet('עריכת אירוע', [
          { name: 'title', label: 'שם', value: e.title, required: true },
          { name: 'type', label: 'סוג', type: 'select', options: Object.keys(EV_TYPES).map((k) => ({ v: k, t: EV_TYPES[k].label })), value: e.type },
          { name: 'date', label: 'תאריך', type: 'date', value: e.date, required: true },
          { name: 'time', label: 'שעה', type: 'time', value: e.time },
          { name: 'notes', label: 'הערות', type: 'textarea', value: e.notes }
        ], (v) => {
          Object.assign(e, v, { notified: false });
          save(); toast('האירוע עודכן', 'ok'); render();
        }, 'עדכון');
      };
    });
  },

  /* ---------- tasks ---------- */
  tasks(box) {
    const f = UI.tab.taskFilter || 'open';
    const t = todayISO();
    let list = S.tasks.slice();
    if (f === 'open') list = list.filter((x) => !x.done);
    if (f === 'today') list = list.filter((x) => !x.done && x.due && x.due <= t);
    if (f === 'done') list = list.filter((x) => x.done);
    list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const pa = a.priority === 'high' ? 0 : a.priority === 'low' ? 2 : 1;
      const pb = b.priority === 'high' ? 0 : b.priority === 'low' ? 2 : 1;
      if (pa !== pb) return pa - pb;
      return (a.due || '9999').localeCompare(b.due || '9999');
    });
    const counts = {
      open: S.tasks.filter((x) => !x.done).length,
      today: S.tasks.filter((x) => !x.done && x.due && x.due <= t).length,
      done: S.tasks.filter((x) => x.done).length
    };
    box.innerHTML =
      '<div class="row" style="margin-bottom:12px"><div class="chips sp">' +
      [['open', 'פתוחות (' + counts.open + ')'], ['today', 'להיום (' + counts.today + ')'], ['done', 'הושלמו (' + counts.done + ')'], ['all', 'הכל']].map((c) =>
        '<button class="chip ' + (f === c[0] ? 'on' : '') + '" data-filter="' + c[0] + '">' + c[1] + '</button>').join('') +
      '</div><button class="btn sm" data-add>+ חדשה</button></div>' +
      (list.length ? '<div class="list-plain">' + list.map((x) => this.taskRow(x)).join('') + '</div>'
        : '<div class="empty">' + (f === 'done' ? 'עוד לא סימנת משימות כהושלמו' : 'אין משימות כאן. מוסיפים אחת?') + '</div>') +
      (f === 'done' && counts.done ? '<button class="btn ghost block" style="margin-top:12px" data-clear>נקה משימות שהושלמו</button>' : '');

    $$('[data-filter]', box).forEach((b) => { b.onclick = () => { UI.tab.taskFilter = b.dataset.filter; this.tasks(box); }; });
    $('[data-add]', box).onclick = () => Actions.addTask();
    const cl = $('[data-clear]', box);
    if (cl) cl.onclick = () => confirmSheet('לנקות הושלמו?', 'כל המשימות המסומנות יימחקו.', () => {
      S.tasks = S.tasks.filter((x) => !x.done); save(); toast('נוקה', 'ok'); render();
    });
    $$('[data-task]', box).forEach((b) => { b.onclick = () => Actions.toggleTask(b.dataset.task); });
    $$('[data-open-task]', box).forEach((b) => { b.onclick = () => this.taskDetail(b.dataset.openTask); });
    $$('[data-del-task]', box).forEach((b) => {
      b.onclick = () => confirmSheet('למחוק משימה?', 'אי אפשר לשחזר.', () => {
        S.tasks = S.tasks.filter((x) => x.id !== b.dataset.delTask); save(); toast('נמחק', 'ok'); render();
      });
    });
  },

  taskRow(x) {
    return '<div class="item ' + (x.done ? 'done' : '') + '">' +
      '<button class="check ' + (x.done ? 'on' : '') + '" data-task="' + x.id + '">✓</button>' +
      '<span class="sp" data-open-task="' + x.id + '" style="cursor:pointer">' +
      '<span class="item-title">' + esc(x.title) + '</span>' +
      '<span class="item-sub">' + (x.priority === 'high' ? '🔴 דחוף · ' : x.priority === 'low' ? '🔵 בהמשך · ' : '') +
      (x.due ? fmtNice(x.due) : 'בלי תאריך') + (x.notes ? ' · ' + esc(x.notes.slice(0, 40)) : '') + '</span></span>' +
      (x.image ? '<img src="' + x.image + '" alt="" style="width:38px;height:38px;border-radius:10px;object-fit:cover">' : '') +
      '<button class="del" data-del-task="' + x.id + '">🗑</button></div>';
  },

  taskDetail(id) {
    const t = S.tasks.find((x) => x.id === id);
    if (!t) return;
    openSheet({
      title: 'פרטי משימה',
      body:
        '<div class="field" style="margin-bottom:10px"><label>מה לעשות</label><input class="input" id="td-title" value="' + esc(t.title) + '"></div>' +
        '<div class="grid g2" style="margin-bottom:10px">' +
        '<div class="field"><label>תאריך</label><input class="input" type="date" id="td-due" value="' + esc(t.due || '') + '"></div>' +
        '<div class="field"><label>עדיפות</label><select class="input" id="td-pri">' +
        ['high', 'normal', 'low'].map((p) => '<option value="' + p + '"' + (t.priority === p ? ' selected' : '') + '>' + (p === 'high' ? 'דחוף' : p === 'low' ? 'בהמשך' : 'רגיל') + '</option>').join('') +
        '</select></div></div>' +
        '<div class="field" style="margin-bottom:10px"><label>הערות</label><textarea class="input" id="td-notes">' + esc(t.notes || '') + '</textarea></div>' +
        '<div class="field" style="margin-bottom:12px"><label>תמונה</label>' +
        '<div class="row">' + (t.image ? '<img src="' + t.image + '" alt="" style="width:64px;height:64px;border-radius:12px;object-fit:cover">' : '') +
        '<button class="btn ghost sm" id="td-img">' + (t.image ? 'החלפת תמונה' : '📷 הוספת תמונה') + '</button>' +
        (t.image ? '<button class="btn danger sm" id="td-imgdel">הסרה</button>' : '') + '</div></div>' +
        '<div class="row"><button class="btn block" id="td-save">שמירה</button>' +
        '<button class="btn ghost block" id="td-done">' + (t.done ? 'סימון כפתוחה' : 'סימון כהושלמה') + '</button></div>',
      onMount: (root) => {
        root.querySelector('#td-img').onclick = () => pickImage((d) => { t.image = d; save(); closeSheet(); render(); toast('התמונה נוספה', 'ok'); }, 900);
        const dl = root.querySelector('#td-imgdel');
        if (dl) dl.onclick = () => { t.image = null; save(); closeSheet(); render(); };
        root.querySelector('#td-save').onclick = () => {
          t.title = root.querySelector('#td-title').value.trim() || t.title;
          t.due = root.querySelector('#td-due').value;
          t.priority = root.querySelector('#td-pri').value;
          t.notes = root.querySelector('#td-notes').value;
          save(); closeSheet(); render(); toast('המשימה עודכנה', 'ok');
        };
        root.querySelector('#td-done').onclick = () => { closeSheet(); Actions.toggleTask(t.id); };
      }
    });
  },

  /* ---------- study ---------- */
  study(box) {
    const exams = S.events.filter((e) => e.type === 'exam' && !e.done).sort((a, b) => a.date.localeCompare(b.date));
    const hw = S.homework.slice().sort((a, b) => (a.done - b.done) || (a.due || '').localeCompare(b.due || ''));
    const openHw = hw.filter((h) => !h.done);
    const weekHw = hw.filter((h) => h.done && isSameWeek(h.due || todayISO())).length;
    box.innerHTML =
      '<div class="grid g3" style="margin-bottom:14px">' +
      '<div class="stat"><b>' + openHw.length + '</b><span>שיעורי בית פתוחים</span></div>' +
      '<div class="stat"><b>' + exams.length + '</b><span>מבחנים קרובים</span></div>' +
      '<div class="stat"><b>' + weekHw + '</b><span>הושלמו השבוע</span></div></div>' +
      '<div class="section-head"><div class="h2">📚 שיעורי בית</div><button class="btn soft xs" data-add-hw>+ הוספה</button></div>' +
      (hw.length ? '<div class="list-plain">' + hw.map((h) => '<div class="item ' + (h.done ? 'done' : '') + '">' +
        '<button class="check ' + (h.done ? 'on' : '') + '" data-hw="' + h.id + '">✓</button>' +
        '<span class="sp"><span class="item-title">' + esc(h.title) + '</span><span class="item-sub">' + esc(h.subject) + ' · ' + fmtNice(h.due) + (h.notes ? ' · ' + esc(h.notes) : '') + '</span></span>' +
        '<button class="del" data-del-hw="' + h.id + '">🗑</button></div>').join('') + '</div>'
        : '<div class="empty">אין שיעורי בית. מוסיפים את הראשון?</div>') +
      '<div class="section"><div class="section-head"><div class="h2">✏️ מבחנים</div><button class="btn soft xs" data-add-exam>+ מבחן</button></div>' +
      (exams.length ? '<div class="list-plain">' + exams.map((e) => '<div class="item">' +
        '<span style="font-size:18px">📚</span><span class="sp"><span class="item-title">' + esc(e.title) + '</span>' +
        '<span class="item-sub">' + fmtLong(e.date) + (e.time ? ' · ' + esc(e.time) : '') + ' · ' + (daysUntil(e.date) === 0 ? 'היום!' : 'בעוד ' + daysUntil(e.date) + ' ימים') + '</span></span>' +
        '<button class="btn ghost xs" data-study-plan="' + e.id + '">תוכנית</button></div>').join('') + '</div>'
        : '<div class="empty">אין מבחנים ביומן</div>') + '</div>' +
      '<div class="section"><div class="card tight"><div class="h3" style="margin-bottom:6px">💡 טיפ ללמידה</div>' +
      '<div class="sub">שיטת 25/5: 25 דקות למידה ממוקדת, 5 דקות הפסקה. אחרי 4 סבבים — הפסקה ארוכה. אפשר להפעיל טיימר מהטאב “טיימרים”.</div>' +
      '<button class="btn ghost sm" style="margin-top:10px" data-study-timer>⏱️ הפעלת טיימר 25 דקות</button></div></div>';

    $('[data-add-hw]', box).onclick = () => formSheet('שיעורי בית חדש', [
      { name: 'subject', label: 'מקצוע', required: true, ph: 'מתמטיקה, היסטוריה…' },
      { name: 'title', label: 'מה צריך להכין?', required: true },
      { name: 'due', label: 'להגשה עד', type: 'date', value: iso(addDays(new Date(), 2)) },
      { name: 'notes', label: 'פרטים', type: 'textarea' }
    ], (v) => {
      S.homework.push({ id: uid('hw'), subject: v.subject, title: v.title, due: v.due, notes: v.notes, done: false, notified: false });
      save(); toast('נוסף ללימודים', 'ok'); render();
    }, 'הוספה');
    $('[data-add-exam]', box).onclick = () => Actions.addEvent({ type: 'exam', date: iso(addDays(new Date(), 5)) });
    $$('[data-hw]', box).forEach((b) => {
      b.onclick = () => {
        const h = S.homework.find((x) => x.id === b.dataset.hw);
        if (!h) return;
        h.done = !h.done; save();
        if (h.done) { toast('שיעורי בית הושלמו 🎉', 'ok'); S.stats.tasksDone = (S.stats.tasksDone || 0) + 1; checkAchievements(); }
        render();
      };
    });
    $$('[data-del-hw]', box).forEach((b) => {
      b.onclick = () => { S.homework = S.homework.filter((x) => x.id !== b.dataset.delHw); save(); render(); toast('נמחק', 'ok'); };
    });
    $$('[data-study-plan]', box).forEach((b) => {
      b.onclick = () => {
        const e = S.events.find((x) => x.id === b.dataset.studyPlan);
        if (!e) return;
        const d = daysUntil(e.date);
        const plan = d <= 0 ? ['חזרה מהירה על הסיכומים', 'פתרון שאלה אחת מכל נושא', 'שינה טובה לפני המבחן']
          : d === 1 ? ['חזרה על נושאים חלשים', 'תרגול 3 שאלות', 'סידור ציוד ומנוחה']
            : ['חלוקה: ' + Math.max(1, d - 1) + ' ימים של למידה', 'כל יום 45 דקות + סיכום קצר', 'יום לפני: חזרה בלבד'];
        openSheet({
          title: 'תוכנית ל' + e.title,
          body: '<div class="stack">' + plan.map((p, i) => '<div class="item"><span class="badge">' + (i + 1) + '</span><span class="sp item-title">' + esc(p) + '</span></div>').join('') + '</div>' +
            '<button class="btn block" style="margin-top:14px" id="plan-timer">⏱️ להתחיל 25 דקות למידה</button>',
          onMount: (root) => { root.querySelector('#plan-timer').onclick = () => { closeSheet(); Timers.open(25); }; }
        });
      };
    });
    $('[data-study-timer]', box).onclick = () => Timers.open(25);
  },

  /* ---------- goals ---------- */
  goals(box) {
    const gs = S.goals.slice();
    const doneCount = gs.filter((g) => Number(g.current) >= Number(g.target) && Number(g.target) > 0).length;
    box.innerHTML =
      '<div class="row" style="margin-bottom:12px"><div class="sp"><div class="h2">🎯 המטרות שלי</div>' +
      '<div class="tiny">' + doneCount + ' הושגו מתוך ' + gs.length + '</div></div>' +
      '<button class="btn sm" data-add-goal>+ מטרה</button></div>' +
      (gs.length ? '<div class="stack">' + gs.map((g) => {
        const pct = Math.min(100, Math.round((Number(g.current) / Math.max(1, Number(g.target))) * 100));
        const done = pct >= 100;
        return '<div class="card tight">' +
          '<div class="row" style="margin-bottom:8px"><span class="sp"><div class="h3">' + (done ? '🏆 ' : '') + esc(g.title) + '</div>' +
          '<div class="tiny">' + g.current + ' / ' + g.target + ' ' + esc(g.unit || '') + (g.deadline ? ' · עד ' + fmtShort(g.deadline) : '') + '</div></span>' +
          '<button class="del" data-del-goal="' + g.id + '">🗑</button></div>' +
          '<div class="bar ' + (done ? 'sage' : '') + '"><i style="width:' + pct + '%"></i></div>' +
          '<div class="row" style="margin-top:10px;gap:6px">' +
          '<button class="btn ghost xs" data-goal-step="' + g.id + '" data-step="1">+1</button>' +
          '<button class="btn ghost xs" data-goal-step="' + g.id + '" data-step="5">+5</button>' +
          '<button class="btn ghost xs" data-goal-step="' + g.id + '" data-step="-1">−1</button>' +
          '<span class="sp"></span><span class="badge ' + (done ? 'sage' : '') + '">' + pct + '%</span></div>' +
          '</div>';
      }).join('') + '</div>' : '<div class="empty">עוד לא הצבת מטרות. מטרה אחת קטנה מתחילה הכל 🎯</div>') +
      '<div class="section"><div class="card tight"><div class="h3" style="margin-bottom:5px">רעיונות למטרות</div>' +
      '<div class="chips">' + ['לקרוא 3 ספרים', '30 אימונים', 'לחסוך 300 ₪', '10 עיצובים', '20 ימי כתיבה'].map((x) => '<button class="chip mini" data-quick-goal="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div></div></div>';

    $('[data-add-goal]', box).onclick = () => Actions.addGoal();
    $$('[data-quick-goal]', box).forEach((b) => {
      b.onclick = () => {
        const t = b.dataset.quickGoal;
        S.goals.push({ id: uid('g'), title: t, target: Number((t.match(/\d+/) || [10])[0]), current: 0, unit: '', deadline: '', created: todayISO() });
        save(); toast('מטרה נוספה', 'ok'); render();
      };
    });
    $$('[data-goal-step]', box).forEach((b) => {
      b.onclick = () => {
        const g = S.goals.find((x) => x.id === b.dataset.goalStep);
        if (!g) return;
        const before = Number(g.current) >= Number(g.target);
        g.current = Math.max(0, Number(g.current) + Number(b.dataset.step));
        save();
        if (!before && Number(g.current) >= Number(g.target)) { toast('הגעת ליעד! 🏆 ' + g.title, 'ok', 3200); checkAchievements(); }
        render();
      };
    });
    $$('[data-del-goal]', box).forEach((b) => {
      b.onclick = () => confirmSheet('למחוק מטרה?', 'ההתקדמות שלה תימחק.', () => {
        S.goals = S.goals.filter((x) => x.id !== b.dataset.delGoal); save(); render(); toast('נמחק', 'ok');
      });
    });
  }
};
