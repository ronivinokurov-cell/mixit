/* ===== ORGANIZER part B: lists, budget, timetable, timers, countdown, summary, notes ===== */
const BUDGET_CATS = ['אוכל', 'תחבורה', 'בילויים', 'קניות', 'לימודים', 'מתנות', 'בריאות', 'אחר'];
const BUDGET_COLORS = ['#8B5CF6', '#38BDF8', '#F472B6', '#8FB89A', '#E6A96B', '#C084FC', '#6EC6E8', '#B0A8C9'];

Object.assign(Organizer, {
  /* ---------- lists ---------- */
  lists(box) {
    const shopOpen = S.shopping.filter((s) => !s.done);
    const wishTotal = S.wishes.filter((w) => !w.got).reduce((a, w) => a + (Number(w.price) || 0), 0);
    box.innerHTML =
      '<div class="card">' +
      '<div class="row" style="margin-bottom:10px"><div class="h2 sp">🛒 רשימת קניות</div>' +
      '<span class="badge">' + shopOpen.length + ' פריטים</span></div>' +
      '<div class="row" style="gap:8px;margin-bottom:12px"><input class="input" id="shop-quick" placeholder="מה חסר בבית?">' +
      '<button class="btn sm" id="shop-add">+</button></div>' +
      (S.shopping.length ? '<div class="list-plain">' + S.shopping.map((s) => '<div class="item ' + (s.done ? 'done' : '') + '">' +
        '<button class="check ' + (s.done ? 'on' : '') + '" data-shop="' + s.id + '">✓</button>' +
        '<span class="sp"><span class="item-title">' + esc(s.name) + '</span>' + (s.qty ? '<span class="item-sub">' + esc(s.qty) + '</span>' : '') + '</span>' +
        '<button class="del" data-del-shop="' + s.id + '">🗑</button></div>').join('') + '</div>'
        : '<div class="empty">הרשימה ריקה. מה צריך לקנות?</div>') +
      (S.shopping.some((s) => s.done) ? '<button class="btn ghost block sm" style="margin-top:10px" id="shop-clear">הסרת מה שנקנה</button>' : '') +
      '</div>' +

      '<div class="card" style="margin-top:14px">' +
      '<div class="row" style="margin-bottom:10px"><div class="h2 sp">🎁 רשימת משאלות</div>' +
      '<button class="btn soft xs" id="wish-add">+ משאלה</button></div>' +
      '<div class="tiny" style="margin-bottom:10px">סה״כ משאלות פתוחות: ' + wishTotal + ' ₪</div>' +
      (S.wishes.length ? '<div class="list-plain">' + S.wishes.map((w) => '<div class="item ' + (w.got ? 'done' : '') + '">' +
        '<button class="check ' + (w.got ? 'on' : '') + '" data-wish="' + w.id + '">✓</button>' +
        '<span class="sp"><span class="item-title">' + esc(w.title) + '</span><span class="item-sub">' +
        (w.price ? w.price + ' ₪' : 'בלי מחיר') + (w.note ? ' · ' + esc(w.note) : '') + '</span></span>' +
        '<button class="del" data-del-wish="' + w.id + '">🗑</button></div>').join('') + '</div>'
        : '<div class="empty">מה בא לך לקבל או להשיג? רשמו כאן ✨</div>') +
      '</div>' +

      '<div class="section"><div class="card tight"><div class="row"><span style="font-size:20px">📝</span>' +
      '<div class="sp"><div class="h3">הערות מהירות</div><div class="tiny">' + S.notes.length + ' הערות שמורות</div></div>' +
      '<button class="btn ghost xs" id="go-notes">פתיחה</button></div></div></div>';

    const quick = $('[data-none]', box);
    const inp = $('#shop-quick', box);
    const addShop = () => {
      const v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      S.shopping.push({ id: uid('s'), name: v, qty: '', done: false });
      save(); toast('נוסף לרשימה', 'ok'); this.lists(box);
    };
    $('#shop-add', box).onclick = addShop;
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') addShop(); });
    const clr = $('#shop-clear', box);
    if (clr) clr.onclick = () => { S.shopping = S.shopping.filter((s) => !s.done); save(); this.lists(box); toast('הרשימה נוקתה', 'ok'); };
    $('#wish-add', box).onclick = () => Actions.addWish();
    $('#go-notes', box).onclick = () => { UI.tab.organizer = 'notes'; this.render(document.getElementById('view')); };
    $$('[data-shop]', box).forEach((b) => {
      b.onclick = () => { const s = S.shopping.find((x) => x.id === b.dataset.shop); if (!s) return; s.done = !s.done; save(); this.lists(box); };
    });
    $$('[data-del-shop]', box).forEach((b) => {
      b.onclick = () => { S.shopping = S.shopping.filter((x) => x.id !== b.dataset.delShop); save(); this.lists(box); };
    });
    $$('[data-wish]', box).forEach((b) => {
      b.onclick = () => { const w = S.wishes.find((x) => x.id === b.dataset.wish); if (!w) return; w.got = !w.got; save(); if (w.got) toast('איזה כיף! 🎁', 'ok'); this.lists(box); };
    });
    $$('[data-del-wish]', box).forEach((b) => {
      b.onclick = () => { S.wishes = S.wishes.filter((x) => x.id !== b.dataset.delWish); save(); this.lists(box); };
    });
  },

  /* ---------- budget ---------- */
  budget(box) {
    const now = new Date();
    const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const monthEntries = S.budget.entries.filter((e) => (e.date || '').startsWith(ym));
    const expense = monthEntries.filter((e) => e.type === 'expense').reduce((a, e) => a + Number(e.amount || 0), 0);
    const income = monthEntries.filter((e) => e.type === 'income').reduce((a, e) => a + Number(e.amount || 0), 0);
    const limit = Number(S.budget.limit || 0);
    const remain = limit - expense;
    const pct = limit ? Math.min(100, Math.round((expense / limit) * 100)) : 0;
    const byCat = {};
    monthEntries.filter((e) => e.type === 'expense').forEach((e) => { byCat[e.cat || 'אחר'] = (byCat[e.cat || 'אחר'] || 0) + Number(e.amount || 0); });
    const cats = Object.keys(byCat).sort((a, b) => byCat[b] - byCat[a]);

    box.innerHTML =
      '<div class="card">' +
      '<div class="row" style="margin-bottom:12px"><div class="sp"><div class="h2">💰 תקציב ' + HEB_MONTHS[now.getMonth()] + '</div>' +
      '<div class="tiny">הוצאות מול תקציב חודשי</div></div>' +
      '<button class="btn sm" id="b-add">+ הוצאה</button></div>' +
      '<div class="grid g3" style="margin-bottom:12px">' +
      '<div class="stat"><b>' + expense + ' ₪</b><span>הוצאות</span></div>' +
      '<div class="stat"><b>' + income + ' ₪</b><span>הכנסות</span></div>' +
      '<div class="stat"><b style="color:' + (remain < 0 ? '#C2334D' : 'var(--brand)') + '">' + remain + ' ₪</b><span>' + (limit ? 'נשאר מהתקציב' : 'לא הוגדר תקציב') + '</span></div>' +
      '</div>' +
      '<div class="row" style="justify-content:space-between;margin-bottom:6px"><span class="tiny" style="font-weight:800">' + (limit ? pct + '% מהתקציב' : 'הגדירו תקציב חודשי') + '</span>' +
      '<button class="tiny" id="b-limit" style="text-decoration:underline;font-weight:800">' + (limit ? 'עריכה' : 'הגדרה') + '</button></div>' +
      '<div class="bar ' + (pct > 85 ? 'pink' : '') + '"><i style="width:' + pct + '%"></i></div>' +
      (limit && remain < 0 ? '<div class="badge red" style="margin-top:10px">חריגה של ' + Math.abs(remain) + ' ₪</div>' : '') +
      '</div>' +

      (cats.length ? '<div class="section"><div class="section-head"><div class="h2">פילוח לפי קטגוריה</div></div><div class="card tight">' +
        cats.map((c, i) => '<div style="margin-bottom:10px"><div class="row" style="justify-content:space-between;font-size:12.5px;font-weight:700"><span>' + esc(c) + '</span><span>' + byCat[c] + ' ₪</span></div>' +
          '<div class="bar" style="height:7px;margin-top:4px"><i style="width:' + Math.round((byCat[c] / expense) * 100) + '%;background:' + BUDGET_COLORS[i % BUDGET_COLORS.length] + '"></i></div></div>').join('') +
        '</div></div>' : '') +

      '<div class="section"><div class="section-head"><div class="h2">תנועות החודש</div><span class="badge">' + monthEntries.length + '</span></div>' +
      (monthEntries.length ? '<div class="list-plain">' + monthEntries.slice().reverse().map((e) => '<div class="item">' +
        '<span style="font-size:17px">' + (e.type === 'income' ? '💵' : '🧾') + '</span>' +
        '<span class="sp"><span class="item-title">' + esc(e.desc) + '</span><span class="item-sub">' + esc(e.cat || 'אחר') + ' · ' + fmtShort(e.date) + '</span></span>' +
        '<b style="color:' + (e.type === 'income' ? '#3F6B4C' : '#8B5CF6') + '">' + (e.type === 'income' ? '+' : '−') + Number(e.amount) + ' ₪</b>' +
        '<button class="del" data-del-b="' + e.id + '">🗑</button></div>').join('') + '</div>'
        : '<div class="empty">עוד אין תנועות החודש. מוסיפים הוצאה ראשונה?</div>') + '</div>';

    $('#b-add', box).onclick = () => this.budgetForm();
    $('#b-limit', box).onclick = () => formSheet('תקציב חודשי', [
      { name: 'limit', label: 'תקציב לחודש (₪)', type: 'number', min: 0, value: S.budget.limit || 0, required: true }
    ], (v) => { S.budget.limit = Number(v.limit) || 0; save(); toast('התקציב עודכן', 'ok'); checkAchievements(); this.budget(box); }, 'שמירה');
    $$('[data-del-b]', box).forEach((b) => {
      b.onclick = () => { S.budget.entries = S.budget.entries.filter((x) => x.id !== b.dataset.delB); save(); this.budget(box); toast('נמחק', 'ok'); };
    });
  },

  budgetForm() {
    formSheet('תנועה חדשה', [
      { name: 'desc', label: 'על מה?', required: true, ph: 'קפה, אוטובוס, מתנה…' },
      { name: 'amount', label: 'סכום (₪)', type: 'number', min: 0, required: true },
      { name: 'type', label: 'סוג', type: 'select', options: [{ v: 'expense', t: 'הוצאה' }, { v: 'income', t: 'הכנסה' }], value: 'expense' },
      { name: 'cat', label: 'קטגוריה', type: 'select', options: BUDGET_CATS.map((c) => ({ v: c, t: c })), value: 'אוכל' },
      { name: 'date', label: 'תאריך', type: 'date', value: todayISO(), required: true }
    ], (v) => {
      S.budget.entries.push({ id: uid('b'), desc: v.desc, amount: Number(v.amount) || 0, type: v.type, cat: v.cat, date: v.date });
      save(); toast(v.type === 'expense' ? 'ההוצאה נרשמה' : 'ההכנסה נרשמה', 'ok');
      checkAchievements(); render();
    }, 'שמירה');
  },

  /* ---------- timetable ---------- */
  timetable(box) {
    const lessons = 8;
    const colors = ['#EDE7FF', '#E3F6FF', '#FDE7F3', '#E7F2E9', '#FBF1E5', '#F3E8FF'];
    const cellFor = (d, l) => S.timetable.find((x) => x.day === d && x.lesson === l);
    let head = '<div class="cal-dow" style="text-align:center"></div>' + HEB_DOW.slice(0, 6).map((d) => '<div class="cal-dow" style="text-align:center">' + d + '</div>').join('');
    let rows = '';
    for (let l = 1; l <= lessons; l++) {
      rows += '<div class="cal-dow" style="display:flex;align-items:center;justify-content:center;font-size:11px">' + l + '</div>';
      for (let d = 0; d < 6; d++) {
        const c = cellFor(d, l);
        const isToday = new Date().getDay() === d;
        rows += '<button data-cell="' + d + '-' + l + '" style="min-height:52px;border-radius:12px;padding:5px;font-size:11.5px;font-weight:800;line-height:1.2;' +
          'background:' + (c ? c.color : 'rgba(139,92,246,.05)') + ';border:1px solid ' + (isToday ? 'var(--brand)' : 'rgba(139,92,246,.10)') + ';color:#3B3355;overflow:hidden">' +
          (c ? esc(c.subject) + (c.room ? '<div style="font-size:9.5px;font-weight:600;opacity:.7">' + esc(c.room) + '</div>' : '') : '<span style="opacity:.3">+</span>') + '</button>';
      }
    }
    box.innerHTML =
      '<div class="row" style="margin-bottom:12px"><div class="sp"><div class="h2">🕘 מערכת שעות אישית</div>' +
      '<div class="tiny">לוחצים על משבצת כדי להוסיף שיעור. שישי ושבת בחופש 😌</div></div>' +
      '<button class="btn ghost sm" id="tt-clear">ניקוי</button></div>' +
      '<div class="card tight" style="overflow-x:auto"><div style="min-width:520px;display:grid;grid-template-columns:28px repeat(6,1fr);gap:4px">' + head + rows + '</div></div>' +
      (S.timetable.length ? '<div class="section"><div class="card tight"><div class="h3" style="margin-bottom:6px">השיעורים שלך</div>' +
        '<div class="chips">' + Array.from(new Set(S.timetable.map((x) => x.subject))).map((s) => '<span class="chip mini">' + esc(s) + '</span>').join('') + '</div></div></div>' : '');

    $$('[data-cell]', box).forEach((b) => {
      b.onclick = () => {
        const [d, l] = b.dataset.cell.split('-').map(Number);
        const c = cellFor(d, l);
        openSheet({
          title: HEB_DOW[d] + ' · שיעור ' + l,
          body: '<div class="field" style="margin-bottom:10px"><label>מקצוע</label><input class="input" id="tt-sub" value="' + esc(c ? c.subject : '') + '" placeholder="מתמטיקה"></div>' +
            '<div class="field" style="margin-bottom:10px"><label>מורה / חדר</label><input class="input" id="tt-room" value="' + esc(c ? c.room : '') + '" placeholder="חדר 12"></div>' +
            '<div class="field" style="margin-bottom:14px"><label>צבע</label><div class="swatches">' +
            colors.map((col) => '<button class="sw ' + (c && c.color === col ? 'on' : '') + '" data-color="' + col + '" style="background:' + col + '"></button>').join('') + '</div></div>' +
            '<div class="row"><button class="btn block" id="tt-save">שמירה</button>' + (c ? '<button class="btn danger block" id="tt-del">הסרה</button>' : '') + '</div>',
          onMount: (root) => {
            let color = c ? c.color : colors[(d + l) % colors.length];
            $$('[data-color]', root).forEach((sb) => { sb.onclick = () => { color = sb.dataset.color; $$('[data-color]', root).forEach((x) => x.classList.toggle('on', x === sb)); }; });
            root.querySelector('#tt-save').onclick = () => {
              const subject = root.querySelector('#tt-sub').value.trim();
              const room = root.querySelector('#tt-room').value.trim();
              if (!subject) { toast('צריך שם מקצוע', 'err'); return; }
              if (c) Object.assign(c, { subject, room, color });
              else S.timetable.push({ id: uid('tt'), day: d, lesson: l, subject, room, color });
              save(); closeSheet(); toast('המערכת עודכנה', 'ok'); render();
            };
            const dl = root.querySelector('#tt-del');
            if (dl) dl.onclick = () => { S.timetable = S.timetable.filter((x) => !(x.day === d && x.lesson === l)); save(); closeSheet(); render(); toast('השיעור הוסר', 'ok'); };
          }
        });
      };
    });
    const cl = $('#tt-clear', box);
    if (cl) cl.onclick = () => confirmSheet('לנקות מערכת שעות?', 'כל השיעורים יוסרו.', () => { S.timetable = []; save(); render(); toast('נוקה', 'ok'); });
  },

  /* ---------- timers tab ---------- */
  timersTab(box) {
    box.innerHTML = '<div id="timer-slot"></div>' +
      '<div class="section"><div class="card tight"><div class="h3" style="margin-bottom:5px">למה טיימר עוזר?</div>' +
      '<div class="sub">25 דקות עבודה ממוקדת ואז 5 דקות הפסקה. המוח עובד טוב יותר בהפסקות קצובות מאשר בשעות ארוכות.</div></div></div>';
    Timers.mount($('#timer-slot', box), null);
  },

  /* ---------- countdown ---------- */
  countdown(box) {
    const items = S.countdowns.slice().sort((a, b) => a.date.localeCompare(b.date));
    const upcoming = S.events.filter((e) => daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
    box.innerHTML =
      '<div class="row" style="margin-bottom:12px"><div class="sp"><div class="h2">⏳ ספירה לאחור</div>' +
      '<div class="tiny">לאירועים שמחכים להם</div></div><button class="btn sm" id="cd-add">+ ספירה</button></div>' +
      (items.length ? '<div class="stack">' + items.map((c) => {
        const d = daysUntil(c.date);
        return '<div class="card tight" style="display:flex;align-items:center;gap:12px">' +
          '<span style="font-size:28px">' + (c.emoji || '🎉') + '</span>' +
          '<div class="sp"><div class="h3">' + esc(c.title) + '</div><div class="tiny">' + fmtLong(c.date) + '</div></div>' +
          '<div style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--brand)">' + (d < 0 ? '✓' : d) + '</div>' +
          '<div class="tiny">' + (d < 0 ? 'עבר' : d === 0 ? 'היום!' : 'ימים') + '</div></div>' +
          '<button class="del" data-del-cd="' + c.id + '">🗑</button></div>';
      }).join('') + '</div>' : '<div class="empty">עוד לא הוספת ספירה לאחור. יום הולדת? טיול? מבחן?</div>') +
      '<div class="section"><div class="section-head"><div class="h2">מה כבר ביומן</div></div>' +
      (upcoming.length ? '<div class="list-plain">' + upcoming.map((e) => '<div class="item">' +
        '<span style="font-size:17px">' + (EV_TYPES[e.type] || EV_TYPES.event).icon + '</span>' +
        '<span class="sp"><span class="item-title">' + esc(e.title) + '</span><span class="item-sub">' + fmtLong(e.date) + '</span></span>' +
        '<button class="btn ghost xs" data-add-cd="' + e.id + '">להוסיף לספירה</button></div>').join('') + '</div>'
        : '<div class="empty">אין אירועים עתידיים</div>') + '</div>';

    $('#cd-add', box).onclick = () => formSheet('ספירה לאחור חדשה', [
      { name: 'title', label: 'לאיזה אירוע?', required: true, ph: 'טיול לקפריסין' },
      { name: 'date', label: 'תאריך', type: 'date', value: iso(addDays(new Date(), 30)), required: true },
      { name: 'emoji', label: 'אימוג׳י', value: '🎉' }
    ], (v) => {
      S.countdowns.push({ id: uid('cd'), title: v.title, date: v.date, emoji: v.emoji || '🎉' });
      save(); toast('נוסף לספירה', 'ok'); render();
    }, 'הוספה');
    $$('[data-del-cd]', box).forEach((b) => { b.onclick = () => { S.countdowns = S.countdowns.filter((x) => x.id !== b.dataset.delCd); save(); render(); }; });
    $$('[data-add-cd]', box).forEach((b) => {
      b.onclick = () => {
        const e = S.events.find((x) => x.id === b.dataset.addCd);
        if (!e) return;
        if (S.countdowns.some((c) => c.title === e.title && c.date === e.date)) { toast('כבר בספירה', 'err'); return; }
        S.countdowns.push({ id: uid('cd'), title: e.title, date: e.date, emoji: (EV_TYPES[e.type] || EV_TYPES.event).icon });
        save(); toast('נוסף לספירה', 'ok'); render();
      };
    });
  },

  /* ---------- weekly summary ---------- */
  summary(box) {
    const week = weekDates();
    const inWeek = (d) => d && week.includes(d);
    const doneTasks = S.tasks.filter((t) => t.done && inWeek(t.doneAt));
    const createdTasks = S.tasks.filter((t) => inWeek(t.created));
    const events = S.events.filter((e) => inWeek(e.date));
    const spent = S.budget.entries.filter((e) => e.type === 'expense' && inWeek(e.date)).reduce((a, e) => a + Number(e.amount || 0), 0);
    const designs = S.designs.filter((d) => inWeek(iso(new Date(d.createdAt || Date.now()))));
    const hwDone = S.homework.filter((h) => h.done);
    const newAch = ACHIEVEMENTS.filter((a) => S.achievements[a.key] && inWeek(S.achievements[a.key]));
    const perDay = week.map((d) => doneTasks.filter((t) => t.doneAt === d).length);
    const maxDay = Math.max(1, ...perDay);

    box.innerHTML =
      '<div class="hero" style="background:linear-gradient(135deg,#6D4BD1,#A78BFA 55%,#7DD3FC)">' +
      '<div class="h2" style="color:#fff">השבוע שלך ב-MIXIT</div>' +
      '<div class="sub" style="margin-top:4px">' + fmtShort(week[0]) + ' – ' + fmtShort(week[6]) + ' · רצף ' + S.streak.count + ' ימים</div>' +
      '<div style="margin-top:14px;font-size:13.5px;line-height:1.6;font-weight:600">' +
      (doneTasks.length ? 'סיימת ' + doneTasks.length + ' משימות' : 'עוד לא סימנת משימות השבוע') +
      (events.length ? ', ויש ' + events.length + ' אירועים ביומן' : '') +
      (designs.length ? ', ויצרת ' + designs.length + ' עיצובים' : '') + '. ' +
      (doneTasks.length >= 5 ? 'שבוע חזק 💪' : 'כל צעד קטן נחשב ✨') + '</div></div>' +

      '<div class="grid g4" style="margin-top:14px">' +
      '<div class="stat"><b>' + doneTasks.length + '</b><span>משימות שהושלמו</span></div>' +
      '<div class="stat"><b>' + createdTasks.length + '</b><span>משימות חדשות</span></div>' +
      '<div class="stat"><b>' + events.length + '</b><span>אירועים</span></div>' +
      '<div class="stat"><b>' + spent + ' ₪</b><span>הוצאות</span></div></div>' +

      '<div class="section"><div class="card"><div class="h3" style="margin-bottom:12px">משימות לפי יום</div>' +
      '<div style="display:flex;align-items:flex-end;gap:8px;height:120px">' +
      perDay.map((v, i) => '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;height:100%">' +
        '<div style="flex:1;display:flex;align-items:flex-end;width:100%"><div style="width:100%;height:' + Math.max(6, (v / maxDay) * 100) + '%;border-radius:9px 9px 4px 4px;background:linear-gradient(180deg,var(--brand),var(--brand-2));opacity:' + (v ? 1 : .25) + '"></div></div>' +
        '<span class="tiny" style="font-weight:800">' + HEB_DOW_S[parseISO(week[i]).getDay()] + '</span>' +
        '<span class="tiny">' + v + '</span></div>').join('') +
      '</div></div></div>' +

      '<div class="section"><div class="card tight">' +
      '<div class="kv"><span>שיעורי בית שהושלמו</span><b>' + hwDone.length + '</b></div>' +
      '<div class="kv"><span>רעיונות שהוגרלו (סה״כ)</span><b>' + S.stats.ideas + '</b></div>' +
      '<div class="kv"><span>עיצובים בסטודיו</span><b>' + S.designs.length + '</b></div>' +
      '<div class="kv"><span>דקות טיימר</span><b>' + S.stats.minutes + '</b></div>' +
      '<div class="kv"><span>הישגים חדשים השבוע</span><b>' + newAch.length + '</b></div>' +
      '</div></div>' +

      (doneTasks.length ? '<div class="section"><div class="section-head"><div class="h2">מה סיימת</div></div><div class="list-plain">' +
        doneTasks.slice(0, 12).map((t) => '<div class="item done"><span class="check on">✓</span><span class="sp"><span class="item-title">' + esc(t.title) + '</span><span class="item-sub">' + (t.doneAt ? fmtNice(t.doneAt) : '') + '</span></span></div>').join('') + '</div></div>' : '') +

      '<div class="section"><button class="btn block" id="sum-save">📌 שמירת סיכום לתזכורת</button>' +
      ((S.summaries || []).length ? '<div class="list-plain" style="margin-top:12px">' + S.summaries.slice(-4).reverse().map((s) => '<div class="item"><span style="font-size:17px">📌</span><span class="sp"><span class="item-title">' + esc(s.text) + '</span><span class="item-sub">' + fmtShort(s.date) + '</span></span></div>').join('') + '</div>' : '') +
      '</div>';

    $('#sum-save', box).onclick = () => {
      S.summaries = S.summaries || [];
      S.summaries.push({
        id: uid('sum'), date: todayISO(),
        text: 'השבוע: ' + doneTasks.length + ' משימות, ' + events.length + ' אירועים, ' + designs.length + ' עיצובים'
      });
      save(); toast('הסיכום נשמר', 'ok'); this.summary(box);
    };
  },

  /* ---------- notes ---------- */
  notes(box) {
    box.innerHTML =
      '<div class="row" style="margin-bottom:12px"><div class="sp"><div class="h2">📝 הערות שלי</div>' +
      '<div class="tiny">מחשבות, רעיונות, דברים לזכור</div></div><button class="btn sm" id="n-add">+ הערה</button></div>' +
      (S.notes.length ? '<div class="stack">' + S.notes.map((n) => '<div class="card tight">' +
        '<div class="row" style="margin-bottom:6px"><span class="tiny sp">' + fmtLong(n.date) + '</span>' +
        '<button class="del" data-del-note="' + n.id + '">🗑</button></div>' +
        '<div class="sub" style="white-space:pre-wrap;color:var(--ink)">' + esc(n.text) + '</div>' +
        (n.image ? '<img src="' + n.image + '" alt="" style="width:100%;border-radius:14px;margin-top:10px">' : '') + '</div>').join('') + '</div>'
        : '<div class="empty">עוד אין הערות. לפעמים מספיק משפט אחד כדי לסדר את הראש.</div>') +
      '<div class="section"><button class="btn ghost block" id="n-img">📷 הערה עם תמונה</button></div>';

    $('#n-add', box).onclick = () => Actions.addNote();
    $('#n-img', box).onclick = () => {
      pickImage((d) => {
        openSheet({
          title: 'הערה עם תמונה',
          body: '<img src="' + d + '" style="width:100%;border-radius:14px;margin-bottom:10px">' +
            '<div class="field"><label>מה לזכור על התמונה?</label><textarea class="input" id="ni-text" placeholder="רגע, מקום, מחשבה…"></textarea></div>' +
            '<button class="btn block" style="margin-top:12px" id="ni-save">שמירה</button>',
          onMount: (root) => {
            root.querySelector('#ni-save').onclick = () => {
              S.notes.unshift({ id: uid('n'), text: root.querySelector('#ni-text').value || 'תמונה', date: todayISO(), image: d });
              save(); closeSheet(); toast('ההערה נשמרה', 'ok'); render();
            };
          }
        });
      }, 900);
    };
    $$('[data-del-note]', box).forEach((b) => {
      b.onclick = () => { S.notes = S.notes.filter((x) => x.id !== b.dataset.delNote); save(); render(); toast('נמחק', 'ok'); };
    });
  }
});

SCREENS.organizer = (v) => Organizer.render(v);

/* ===== Timers ===== */
const Timers = {
  timer: { running: false, endAt: 0, remain: 25 * 60000, dur: 25 * 60000 },
  sw: { running: false, startAt: 0, elapsed: 0 },
  mode: 'timer',
  interval: null,
  root: null,

  mount(root, initialMin) {
    this.root = root;
    if (initialMin) this.setTimer(initialMin * 60000);
    this.render();
    this.startLoop();
  },
  setTimer(ms) {
    this.timer.dur = ms;
    this.timer.remain = ms;
    this.timer.running = false;
    this.timer.endAt = 0;
  },
  startLoop() {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.tick(), 200);
  },
  fmt(ms) {
    ms = Math.max(0, ms);
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60), s = total % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  },
  swFmt(ms) {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60), s = total % 60, cs = Math.floor((ms % 1000) / 100);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + cs;
  },
  render() {
    if (!this.root) return;
    const isT = this.mode === 'timer';
    const remain = this.timer.running ? Math.max(0, this.timer.endAt - Date.now()) : this.timer.remain;
    const pct = isT ? Math.max(0, Math.min(100, 100 - (remain / this.timer.dur) * 100)) : 0;
    const swMs = this.sw.running ? this.sw.elapsed + (Date.now() - this.sw.startAt) : this.sw.elapsed;
    this.root.innerHTML =
      '<div class="card">' +
      '<div class="tabs" style="margin-bottom:16px"><button class="tab ' + (isT ? 'on' : '') + '" data-mode="timer">⏳ טיימר</button>' +
      '<button class="tab ' + (isT ? '' : 'on') + '" data-mode="sw">⏱️ סטופר</button></div>' +
      '<div style="text-align:center;position:relative;padding:10px 0 4px">' +
      '<div class="ring" style="width:190px;height:190px;margin:0 auto">' +
      '<svg width="190" height="190"><circle cx="95" cy="95" r="84" fill="none" stroke="rgba(139,92,246,.12)" stroke-width="13"/>' +
      '<circle cx="95" cy="95" r="84" fill="none" stroke="url(#tgrad)" stroke-width="13" stroke-linecap="round" stroke-dasharray="' + (2 * Math.PI * 84).toFixed(1) + '" stroke-dashoffset="' + (2 * Math.PI * 84 * (1 - (isT ? pct / 100 : 0))).toFixed(1) + '" transform="rotate(-90 95 95)"/></svg>' +
      '<defs><linearGradient id="tgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--brand)"/><stop offset="1" stop-color="var(--accent)"/></linearGradient></defs>' +
      '<span id="t-display" style="font-size:' + (isT ? 38 : 30) + 'px;font-weight:900;letter-spacing:-1px">' + (isT ? this.fmt(remain) : this.swFmt(swMs)) + '</span></div>' +
      '<div class="tiny" style="margin-top:8px">' + (isT ? (this.timer.running ? 'הטיימר רץ…' : this.timer.remain === this.timer.dur ? 'מוכן להתחלה' : 'מושהה') : (this.sw.running ? 'הסטופר רץ' : 'סטופר')) + '</div>' +
      '</div>' +
      (isT ? '<div class="chips" style="justify-content:center;margin:14px 0">' +
        [5, 15, 25, 45, 60].map((m) => '<button class="chip ' + (this.timer.dur === m * 60000 ? 'on' : '') + '" data-min="' + m + '">' + m + ' דק׳</button>').join('') + '</div>' : '') +
      '<div class="row" style="gap:8px;margin-top:6px">' +
      (isT
        ? '<button class="btn block" data-action="toggle">' + (this.timer.running ? '⏸ השהיה' : '▶ התחלה') + '</button>' +
          '<button class="btn ghost" data-action="reset">איפוס</button>'
        : '<button class="btn block" data-action="swtoggle">' + (this.sw.running ? '⏸ עצירה' : '▶ התחלה') + '</button>' +
          '<button class="btn ghost" data-action="swreset">איפוס</button>') +
      '</div></div>';

    $$('[data-mode]', this.root).forEach((b) => { b.onclick = () => { this.mode = b.dataset.mode; this.render(); }; });
    $$('[data-min]', this.root).forEach((b) => {
      b.onclick = () => { this.setTimer(Number(b.dataset.min) * 60000); this.render(); };
    });
    const act = this.root.querySelector('[data-action]');
    if (act) {
      act.onclick = () => {
        const a = act.dataset.action;
        if (a === 'toggle') {
          if (this.timer.running) {
            this.timer.remain = Math.max(0, this.timer.endAt - Date.now());
            this.timer.running = false;
          } else {
            if (this.timer.remain <= 0) this.timer.remain = this.timer.dur;
            this.timer.endAt = Date.now() + this.timer.remain;
            this.timer.running = true;
            toast('הטיימר התחיל ⏳', 'ok', 1400);
          }
          this.render();
        } else if (a === 'reset') {
          this.setTimer(this.timer.dur); this.render(); toast('אופס', 'info', 1200);
        } else if (a === 'swtoggle') {
          if (this.sw.running) { this.sw.elapsed += Date.now() - this.sw.startAt; this.sw.running = false; }
          else { this.sw.startAt = Date.now(); this.sw.running = true; }
          this.render();
        } else if (a === 'swreset') {
          this.sw = { running: false, startAt: 0, elapsed: 0 }; this.render();
        }
      };
    }
  },
  tick() {
    if (!this.root || !document.body.contains(this.root)) { this.interval && clearInterval(this.interval); this.interval = null; return; }
    const disp = this.root.querySelector('#t-display');
    if (!disp) return;
    if (this.mode === 'timer') {
      if (!this.timer.running) return;
      const remain = Math.max(0, this.timer.endAt - Date.now());
      disp.textContent = this.fmt(remain);
      if (remain <= 0) {
        this.timer.running = false;
        this.timer.remain = this.timer.dur;
        S.stats.minutes = (S.stats.minutes || 0) + Math.round(this.timer.dur / 60000);
        save(); checkAchievements();
        this.beep();
        toast('הזמן נגמר! ⏰ עשית ' + Math.round(this.timer.dur / 60000) + ' דקות', 'ok', 4000);
        this.render();
      } else {
        const pct = 100 - (remain / this.timer.dur) * 100;
        const circ = this.root.querySelector('circle[stroke-dashoffset]');
        if (circ) circ.setAttribute('stroke-dashoffset', (2 * Math.PI * 84 * (1 - pct / 100)).toFixed(1));
      }
    } else if (this.sw.running) {
      disp.textContent = this.swFmt(this.sw.elapsed + (Date.now() - this.sw.startAt));
    }
  },
  beep() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      [0, 0.25, 0.5].forEach((t, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 660 + i * 220;
        g.gain.setValueAtTime(0.001, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.22);
        o.connect(g); g.connect(ctx.destination);
        o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.24);
      });
      setTimeout(() => ctx.close(), 1200);
    } catch (e) { /* ignore */ }
  },
  open(minutes) {
    openSheet({
      title: 'טיימר וסטופר',
      body: '<div id="timer-sheet-slot"></div>',
      onMount: (root) => {
        this.mode = 'timer';
        if (minutes) this.setTimer(minutes * 60000);
        this.mount(root.querySelector('#timer-sheet-slot'), minutes || null);
      }
    });
  }
};
