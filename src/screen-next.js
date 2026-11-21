/* ===== WHAT'S NEXT: activity generator ===== */
const Next = {
  get state() {
    UI.next = UI.next || { min: null, budget: null, people: null, cats: [], place: null, current: null, revealed: false };
    return UI.next;
  },
  pool() {
    const st = this.state;
    const all = ACTIVITIES.concat(S.activities.custom || []);
    return all.filter((a) => {
      if (st.min && a.min > st.min) return false;
      if (st.budget) {
        const order = BUDGETS.indexOf(a.budget);
        if (order < 0 || order > BUDGETS.indexOf(st.budget)) return false;
      }
      if (st.people && a.people !== st.people) return false;
      if (st.place && a.place !== st.place) return false;
      if (st.cats.length && !st.cats.includes(a.cat)) return false;
      return true;
    });
  },
  draw() {
    const st = this.state;
    const pool = this.pool();
    if (!pool.length) { toast('אין התאמות. אפשר להסיר חלק מהסינונים', 'err'); return; }
    let pick = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && st.current) {
      let guard = 0;
      while (pick.id === st.current && guard++ < 20) pick = pool[Math.floor(Math.random() * pool.length)];
    }
    st.current = pick.id;
    st.revealed = false;
    S.stats.ideas = (S.stats.ideas || 0) + 1;
    S.activities.history = (S.activities.history || []).concat([{ id: pick.id, at: new Date().toISOString() }]).slice(-60);
    save(); checkAchievements();
    this.renderBody();
  },
  showById(id) {
    const all = ACTIVITIES.concat(S.activities.custom || []);
    const a = all.find((x) => x.id === id);
    if (!a) return;
    this.state.current = id;
    this.renderBody();
    const card = document.getElementById('idea-slot');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  currentActivity() {
    const all = ACTIVITIES.concat(S.activities.custom || []);
    return all.find((a) => a.id === this.state.current) || null;
  },
  render(view) {
    const st = this.state;
    const pool = this.pool();
    const custom = S.activities.custom || [];
    const favs = (S.activities.favorites || []).map((id) => ACTIVITIES.concat(custom).find((a) => a.id === id)).filter(Boolean);

    view.innerHTML = '<div class="shell">' +
      '<div class="row" style="margin-bottom:12px"><div class="sp"><div class="h1">WHAT’S NEXT</div>' +
      '<div class="sub">מה עושים עכשיו? בוחרים סינון ומגרילים 🎲</div></div>' +
      '<button class="icon-btn" id="nx-search">🔍</button></div>' +

      '<div class="card">' +
      '<div class="h3" style="margin-bottom:8px">⏱ כמה זמן יש?</div>' +
      '<div class="chips" style="margin-bottom:14px">' +
      [['', 'לא משנה'], ['5', '5 דק׳'], ['15', '15 דק׳'], ['30', 'חצי שעה'], ['60', 'שעה+']].map((t) =>
        '<button class="chip ' + (String(st.min || '') === t[0] ? 'on' : '') + '" data-min="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>' +
      '<div class="h3" style="margin-bottom:8px">💰 תקציב</div>' +
      '<div class="chips" style="margin-bottom:14px">' +
      [['', 'לא משנה'], ['חינם', 'חינם'], ['עד 20 ₪', 'עד 20 ₪'], ['עד 50 ₪', 'עד 50 ₪']].map((t) =>
        '<button class="chip ' + (String(st.budget || '') === t[0] ? 'on' : '') + '" data-budget="' + esc(t[0]) + '">' + t[1] + '</button>').join('') + '</div>' +
      '<div class="h3" style="margin-bottom:8px">👥 עם מי?</div>' +
      '<div class="chips" style="margin-bottom:14px">' +
      [['', 'לא משנה'], ['1', 'לבד'], ['2', 'זוג / חבר'], ['4', 'חבורה']].map((t) =>
        '<button class="chip ' + (String(st.people || '') === t[0] ? 'on' : '') + '" data-people="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>' +
      '<div class="h3" style="margin-bottom:8px">📍 איפה?</div>' +
      '<div class="chips" style="margin-bottom:14px">' +
      [['', 'לא משנה'], ['בבית', 'בבית'], ['בחוץ', 'בחוץ']].map((t) =>
        '<button class="chip ' + (String(st.place || '') === t[0] ? 'on' : '') + '" data-place="' + esc(t[0]) + '">' + t[1] + '</button>').join('') + '</div>' +
      '<div class="row" style="justify-content:space-between;margin-bottom:8px"><div class="h3">🎨 סוג פעילות</div>' +
      '<button class="tiny" id="nx-clearcats" style="text-decoration:underline;font-weight:800">ניקוי</button></div>' +
      '<div class="chips">' + Object.keys(CATS).map((k) => '<button class="chip ' + (st.cats.includes(k) ? 'on' : '') + '" data-cat="' + k + '">' + CATS[k].icon + ' ' + CATS[k].label + '</button>').join('') + '</div>' +
      '</div>' +

      '<div class="section"><div id="idea-slot"></div>' +
      '<div class="row" style="margin-top:10px;gap:8px">' +
      '<button class="btn block" id="nx-draw">🎲 ' + (this.currentActivity() ? 'עוד רעיון' : 'הגרל פעילות') + '</button>' +
      '<button class="btn ghost" id="nx-fav" title="שמירה במועדפים">' + (this.currentActivity() && (S.activities.favorites || []).includes(this.currentActivity().id) ? '💖' : '🤍') + '</button>' +
      '</div>' +
      '<div class="tiny" style="text-align:center;margin-top:8px">' + pool.length + ' רעיונות מתאימים לסינון שלך</div>' +
      '</div>' +

      '<div class="section"><div class="section-head"><div class="h2">🧠 חידת היום</div>' +
      '<button class="btn ghost xs" id="nx-riddle">גלה תשובה</button></div>' +
      '<div class="card"><div class="h3" style="line-height:1.5">' + esc(this.riddle().q) + '</div>' +
      '<div id="riddle-a" class="sub" style="margin-top:10px;display:none;background:var(--brand-soft);padding:10px;border-radius:12px">💡 ' + esc(this.riddle().a) + '</div></div></div>' +

      '<div class="section"><div class="section-head"><div class="h2">💖 מועדפים</div><span class="badge">' + favs.length + '</span></div>' +
      (favs.length ? '<div class="scroll-x">' + favs.map((a) => '<button class="pill-card" data-open="' + a.id + '" style="text-align:start">' +
        '<div style="font-size:24px">' + a.icon + '</div><div class="h3" style="margin-top:6px">' + esc(a.title) + '</div>' +
        '<div class="tiny">' + a.min + ' דק׳ · ' + esc(a.budget) + '</div></button>').join('') + '</div>'
        : '<div class="empty">עוד אין מועדפים. לחצו על 🤍 ברעיון שתאהבו.</div>') + '</div>' +

      '<div class="section"><div class="section-head"><div class="h2">✨ הפעילויות שלי</div>' +
      '<button class="btn soft xs" id="nx-custom">+ פעילות</button></div>' +
      (custom.length ? '<div class="list-plain">' + custom.map((a) => '<div class="item">' +
        '<span style="font-size:18px">' + (a.icon || '⭐') + '</span>' +
        '<span class="sp" data-open="' + a.id + '" style="cursor:pointer"><span class="item-title">' + esc(a.title) + '</span>' +
        '<span class="item-sub">' + a.min + ' דק׳ · ' + esc(a.budget) + ' · ' + esc(a.place) + '</span></span>' +
        '<button class="del" data-del-custom="' + a.id + '">🗑</button></div>').join('') + '</div>'
        : '<div class="empty">כתבו פעילות משלכם שתופיע בהגרלות 🎈</div>') + '</div>' +

      '<div class="section"><div class="section-head"><div class="h2">📚 כל הקטגוריות</div></div>' +
      '<div class="grid g3">' + Object.keys(CATS).map((k) => {
        const n = ACTIVITIES.filter((a) => a.cat === k).length;
        return '<button class="tile" data-cat-only="' + k + '"><i>' + CATS[k].icon + '</i><b>' + CATS[k].label + '</b><span>' + n + ' רעיונות</span></button>';
      }).join('') + '</div></div>' +
      '</div>';

    const rebind = () => {
      $$('[data-min]', view).forEach((b) => { b.onclick = () => { this.state.min = b.dataset.min ? Number(b.dataset.min) : null; this.render(view); }; });
      $$('[data-budget]', view).forEach((b) => { b.onclick = () => { this.state.budget = b.dataset.budget || null; this.render(view); }; });
      $$('[data-people]', view).forEach((b) => { b.onclick = () => { this.state.people = b.dataset.people ? Number(b.dataset.people) : null; this.render(view); }; });
      $$('[data-place]', view).forEach((b) => { b.onclick = () => { this.state.place = b.dataset.place || null; this.render(view); }; });
      $$('[data-cat]', view).forEach((b) => {
        b.onclick = () => {
          const k = b.dataset.cat, arr = this.state.cats;
          const i = arr.indexOf(k);
          if (i >= 0) arr.splice(i, 1); else arr.push(k);
          this.render(view);
        };
      });
      $$('[data-cat-only]', view).forEach((b) => {
        b.onclick = () => { this.state.cats = [b.dataset.catOnly]; this.state.current = null; this.draw(); };
      });
      $$('[data-open]', view).forEach((b) => { b.onclick = () => this.showById(b.dataset.open); });
      $$('[data-del-custom]', view).forEach((b) => {
        b.onclick = () => {
          S.activities.custom = S.activities.custom.filter((x) => x.id !== b.dataset.delCustom);
          S.activities.favorites = S.activities.favorites.filter((x) => x !== b.dataset.delCustom);
          save(); toast('הפעילות נמחקה', 'ok'); this.render(view);
        };
      });
      $('#nx-clearcats', view).onclick = () => { this.state.cats = []; this.render(view); };
      $('#nx-search', view).onclick = openSearch;
      $('#nx-draw', view).onclick = () => this.draw();
      $('#nx-fav', view).onclick = () => {
        const a = this.currentActivity();
        if (!a) { toast('קודם מגרילים רעיון', 'err'); return; }
        const favs = S.activities.favorites = S.activities.favorites || [];
        const i = favs.indexOf(a.id);
        if (i >= 0) { favs.splice(i, 1); toast('הוסר מהמועדפים'); }
        else { favs.push(a.id); toast('נשמר במועדפים 💖', 'ok'); checkAchievements(); }
        save(); this.render(view);
      };
      $('#nx-riddle', view).onclick = () => {
        const el = $('#riddle-a', view);
        if (!el) return;
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
      };
      $('#nx-custom', view).onclick = () => this.customForm(view);
    };
    rebind();
    this.renderBody();
  },
  renderBody() {
    const slot = document.getElementById('idea-slot');
    if (!slot) return;
    const a = this.currentActivity();
    if (!a) {
      slot.innerHTML = '<div class="card" style="text-align:center;padding:28px 18px">' +
        '<div style="font-size:44px">🎲</div><div class="h2" style="margin-top:8px">מוכנים?</div>' +
        '<div class="sub" style="margin-top:6px">בחרו סינון ולחצו על הכפתור. יש כאן ' + this.pool().length + ' רעיונות שמחכים.</div></div>';
      return;
    }
    const cat = CATS[a.cat] || CATS.home;
    slot.innerHTML = '<div class="idea-card" style="background:linear-gradient(140deg,' + cat.color + ',#A78BFA 120%)">' +
      '<div class="row" style="justify-content:space-between"><div class="big">' + a.icon + '</div>' +
      '<span class="badge" style="background:rgba(255,255,255,.24);color:#fff">' + cat.icon + ' ' + cat.label + '</span></div>' +
      '<h3>' + esc(a.title) + '</h3><p>' + esc(a.desc) + '</p>' +
      '<div class="meta"><span>⏱ ' + a.min + ' דק׳</span><span>💰 ' + esc(a.budget) + '</span><span>👥 ' + (a.people === 1 ? 'לבד' : a.people + ' משתתפים') + '</span><span>📍 ' + esc(a.place) + '</span></div>' +
      '</div>' +
      '<div class="row" style="margin-top:10px;gap:8px">' +
      '<button class="btn sage sm" id="nx-did">✅ עשיתי את זה</button>' +
      '<button class="btn ghost sm" id="nx-create">🎨 ליצור מזה עיצוב</button>' +
      '<button class="btn ghost sm" id="nx-cal">📅 לקבוע ביומן</button></div>';
    const did = document.getElementById('nx-did');
    if (did) did.onclick = () => {
      toast('כל הכבוד! רעיון אחד פחות לנצח 🎉', 'ok', 3000);
      bump('ideas', 1);
      this.draw();
    };
    const cr = document.getElementById('nx-create');
    if (cr) cr.onclick = () => { closeSheet(); go('create'); };
    const cal = document.getElementById('nx-cal');
    if (cal) cal.onclick = () => Actions.addEvent({ date: todayISO() });
  },
  riddle() {
    const seed = Math.floor(parseISO(todayISO()).getTime() / 86400000);
    const r = RIDDLES[seed % RIDDLES.length];
    return { q: r[0], a: r[1] };
  },
  customForm(view) {
    formSheet('פעילות משלכם', [
      { name: 'title', label: 'שם הפעילות', required: true, ph: 'ערב קריוקי במרפסת' },
      { name: 'desc', label: 'מה עושים?', type: 'textarea', ph: 'כמה משפטים שיעזרו לכם אחר כך' },
      { name: 'cat', label: 'קטגוריה', type: 'select', options: Object.keys(CATS).map((k) => ({ v: k, t: CATS[k].label })), value: 'home' },
      { name: 'min', label: 'זמן (דקות)', type: 'select', options: TIMES.map((t) => ({ v: t, t: t + ' דקות' })), value: 30 },
      { name: 'budget', label: 'תקציב', type: 'select', options: BUDGETS.map((b) => ({ v: b, t: b })), value: 'חינם' },
      { name: 'people', label: 'משתתפים', type: 'select', options: [{ v: 1, t: 'לבד' }, { v: 2, t: 'זוג' }, { v: 4, t: 'חבורה' }], value: 2 },
      { name: 'place', label: 'איפה', type: 'select', options: [{ v: 'בבית', t: 'בבית' }, { v: 'בחוץ', t: 'בחוץ' }], value: 'בבית' }
    ], (v) => {
      S.activities.custom = S.activities.custom || [];
      S.activities.custom.unshift({
        id: uid('c'), title: v.title, desc: v.desc || 'פעילות אישית שלי', icon: '⭐',
        cat: v.cat, min: Number(v.min), budget: v.budget, people: Number(v.people), place: v.place, custom: true
      });
      save(); toast('הפעילות נוספה להגרלות', 'ok'); this.render(view);
    }, 'הוספה');
  }
};

SCREENS.next = (v) => Next.render(v);
