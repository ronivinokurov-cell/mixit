/* ===== PROFILE ===== */
const HOME_SECTIONS = [
  ['hero', 'ברכה וסיכום יומי'], ['quick', 'קיצורי דרך'], ['today', 'מה להיום'],
  ['idea', 'רעיון ואתגר היום'], ['stats', 'התקדמות'], ['ach', 'הישגים אחרונים']
];

const Profile = {
  render(view) {
    const u = S.user || {};
    const ach = ACHIEVEMENTS;
    const got = ach.filter((a) => S.achievements[a.key]);
    const t = S.theme || {};
    const favs = (S.activities.favorites || []).map((id) => ACTIVITIES.concat(S.activities.custom || []).find((a) => a.id === id)).filter(Boolean);

    view.innerHTML = '<div class="shell">' +
      '<div class="hero" style="background:linear-gradient(135deg,' + (t.brand || '#8B5CF6') + ',' + (t.brand2 || '#A78BFA') + ' 60%,#7DD3FC)">' +
      '<div class="row"><div class="avatar lg" style="background:rgba(255,255,255,.25);border-color:rgba(255,255,255,.4)" id="pf-avatar">' + (u.avatar || '🌈') + '</div>' +
      '<div class="sp"><div class="h1" style="color:#fff">' + esc(u.first || '') + ' ' + esc(u.last || '') + '</div>' +
      '<div class="sub" style="color:rgba(255,255,255,.9)">' + (u.age ? 'בן/בת ' + u.age + ' · ' : '') + 'איתנו מ-' + (u.joined ? fmtShort(u.joined) : 'היום') + '</div>' +
      '<div class="badge" style="background:rgba(255,255,255,.24);color:#fff;margin-top:6px">🔥 רצף ' + S.streak.count + ' ימים</div></div></div>' +
      '</div>' +

      '<div class="grid g4" style="margin-top:14px">' +
      '<div class="stat"><b>' + (S.stats.tasksDone || 0) + '</b><span>משימות</span></div>' +
      '<div class="stat"><b>' + S.designs.length + '</b><span>עיצובים</span></div>' +
      '<div class="stat"><b>' + (S.stats.ideas || 0) + '</b><span>רעיונות</span></div>' +
      '<div class="stat"><b>' + got.length + '</b><span>הישגים</span></div>' +
      '</div>' +

      '<div class="section"><div class="section-head"><div class="h2">🎨 מראה האפליקציה</div></div>' +
      '<div class="card">' +
      '<div class="h3" style="margin-bottom:8px">ערכת צבעים</div>' +
      '<div class="chips" style="margin-bottom:14px">' + Object.keys(THEME_PRESETS).map((k) => {
        const p = THEME_PRESETS[k];
        return '<button class="chip ' + (t.preset === k ? 'on' : '') + '" data-theme="' + k + '">' +
          '<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:' + p.brand + ';margin-inline-end:5px"></span>' + p.name + '</button>';
      }).join('') + '</div>' +
      '<div class="h3" style="margin-bottom:8px">רקע</div>' +
      '<div class="chips" style="margin-bottom:14px">' + Object.keys(BG_OPTIONS).map((k) =>
        '<button class="chip ' + (t.bg === k ? 'on' : '') + '" data-bg="' + k + '">' + BG_OPTIONS[k] + '</button>').join('') + '</div>' +
      '<div class="h3" style="margin-bottom:8px">סט אייקונים</div>' +
      '<div class="chips">' + [['soft', 'רך'], ['emoji', 'אימוג׳י'], ['minimal', 'מינימלי']].map((s) =>
        '<button class="chip ' + ((S.prefs.iconSet || 'soft') === s[0] ? 'on' : '') + '" data-icons="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>' +
      '</div></div>' +

      '<div class="section"><div class="section-head"><div class="h2">🏠 מסך הבית</div></div>' +
      '<div class="card tight">' + HOME_SECTIONS.map((s) => {
        const on = (S.prefs.homeSections || []).includes(s[0]);
        return '<div class="kv"><span>' + s[1] + '</span><button class="switch ' + (on ? 'on' : '') + '" data-sec="' + s[0] + '"></button></div>';
      }).join('') + '</div></div>' +

      '<div class="section"><div class="section-head"><div class="h2">🗂️ תיקיות פרויקטים</div>' +
      '<button class="btn soft xs" id="pf-folder">+ תיקייה</button></div>' +
      '<div class="card tight">' +
      (S.folders.length ? S.folders.map((f) => {
        const n = S.designs.filter((d) => d.folder === f.id).length;
        return '<div class="kv"><span>📁 ' + esc(f.name) + '</span><span class="row" style="gap:6px"><span class="badge">' + n + ' עיצובים</span>' +
          '<button class="del" data-del-folder="' + f.id + '">🗑</button></span></div>';
      }).join('') : '<div class="empty" style="border:none;background:transparent">אין תיקיות עדיין. תיקייה עוזרת לסדר עיצובים לפי פרויקט.</div>') +
      '</div></div>' +

      '<div class="section"><div class="section-head"><div class="h2">🏅 הישגים</div><span class="badge">' + got.length + '/' + ach.length + '</span></div>' +
      '<div class="bar" style="margin-bottom:12px"><i style="width:' + Math.round((got.length / ach.length) * 100) + '%"></i></div>' +
      '<div class="ach">' + ach.map((a) => '<div class="ach-card ' + (S.achievements[a.key] ? '' : 'locked') + '">' +
        '<i>' + a.icon + '</i><b>' + esc(a.title) + '</b><span>' + esc(a.desc) + '</span></div>').join('') + '</div></div>' +

      '<div class="section"><div class="section-head"><div class="h2">💖 מועדפים</div></div>' +
      (favs.length ? '<div class="list-plain">' + favs.slice(0, 8).map((a) => '<div class="item"><span style="font-size:17px">' + a.icon + '</span>' +
        '<span class="sp"><span class="item-title">' + esc(a.title) + '</span><span class="item-sub">' + a.min + ' דק׳ · ' + esc(a.budget) + '</span></span></div>').join('') + '</div>'
        : '<div class="empty">אין מועדפים עדיין. אפשר לשמור רעיונות ב-“מה עושים עכשיו”.</div>') + '</div>' +

      '<div class="section"><div class="section-head"><div class="h2">🎨 עיצובים שמורים</div>' +
      '<button class="btn ghost xs" id="pf-create">לסטודיו</button></div>' +
      (S.designs.length ? '<div class="scroll-x">' + S.designs.slice(0, 8).map((d) => '<button class="design-card" data-pf-design="' + d.id + '" style="min-width:132px">' +
        '<img src="' + (d.thumb || '') + '" alt=""><div class="dc-body"><b>' + esc(d.title || 'עיצוב') + '</b><span>' + DESIGN_TYPES[d.type].label + '</span></div></button>').join('') + '</div>'
        : '<div class="empty">עוד אין עיצובים</div>') + '</div>' +

      '<div class="section"><div class="section-head"><div class="h2">⚙️ הגדרות</div></div>' +
      '<div class="card tight">' +
      '<div class="kv"><span>🔔 תזכורות והתראות</span><button class="switch ' + (S.prefs.notify ? 'on' : '') + '" id="pf-notify"></button></div>' +
      '<div class="kv"><span>👤 עריכת פרופיל</span><button class="btn ghost xs" id="pf-edit">עריכה</button></div>' +
      '<div class="kv"><span>💾 גיבוי נתונים</span><button class="btn ghost xs" id="pf-export">ייצוא</button></div>' +
      '<div class="kv"><span>📥 שחזור מגיבוי</span><button class="btn ghost xs" id="pf-import">ייבוא</button></div>' +
      '<div class="kv"><span>🧹 איפוס מלא</span><button class="btn danger xs" id="pf-reset">איפוס</button></div>' +
      '</div></div>' +

      '<div class="section" style="text-align:center;padding-bottom:10px">' +
      '<div class="brand" style="justify-content:center"><span class="brand-mark">🌈</span> MIXIT</div>' +
      '<p class="tiny" style="margin-top:8px">כל העולם שלך באפליקציה אחת · נשמר מקומית במכשיר</p></div>' +
      '</div>';

    const saveRender = () => { save(); render(); };

    $$('[data-theme]', view).forEach((b) => {
      b.onclick = () => {
        const p = THEME_PRESETS[b.dataset.theme];
        S.theme = Object.assign({}, S.theme, { preset: b.dataset.theme, brand: p.brand, brand2: p.brand2 });
        applyTheme(); saveRender(); toast('ערכת הצבעים עודכנה 🎨', 'ok', 1600);
      };
    });
    $$('[data-bg]', view).forEach((b) => {
      b.onclick = () => { S.theme.bg = b.dataset.bg; applyTheme(); saveRender(); };
    });
    $$('[data-icons]', view).forEach((b) => {
      b.onclick = () => { S.prefs.iconSet = b.dataset.icons; saveRender(); toast('סט האייקונים עודכן', 'ok', 1500); };
    });
    $$('[data-sec]', view).forEach((b) => {
      b.onclick = () => {
        const k = b.dataset.sec;
        const arr = S.prefs.homeSections || [];
        const i = arr.indexOf(k);
        if (i >= 0) arr.splice(i, 1); else arr.push(k);
        S.prefs.homeSections = arr;
        saveRender();
      };
    });
    $('#pf-avatar', view).onclick = () => {
      openSheet({
        title: 'בחירת אווטאר',
        body: '<div class="emoji-grid" style="grid-template-columns:repeat(8,1fr);max-height:none">' + AVATARS.map((a) => '<button data-av="' + a + '">' + a + '</button>').join('') + '</div>',
        onMount: (root) => {
          $$('[data-av]', root).forEach((b) => {
            b.onclick = () => { S.user.avatar = b.dataset.av; save(); closeSheet(); render(); toast('האווטאר עודכן', 'ok'); };
          });
        }
      });
    };
    $('#pf-folder', view).onclick = () => formSheet('תיקייה חדשה', [
      { name: 'name', label: 'שם התיקייה', required: true, ph: 'עיצובים ליום הולדת' }
    ], (v) => {
      S.folders.push({ id: uid('f'), name: v.name });
      save(); toast('התיקייה נוצרה 📁', 'ok'); render();
    }, 'יצירה');
    $$('[data-del-folder]', view).forEach((b) => {
      b.onclick = () => confirmSheet('למחוק תיקייה?', 'העיצובים יישארו, רק התיקייה תיעלם.', () => {
        const id = b.dataset.delFolder;
        S.folders = S.folders.filter((f) => f.id !== id);
        S.designs.forEach((d) => { if (d.folder === id) d.folder = null; });
        save(); render(); toast('התיקייה נמחקה', 'ok');
      });
    });
    $$('[data-pf-design]', view).forEach((b) => { b.onclick = () => Studio.openSaved(b.dataset.pfDesign); });
    $('#pf-create', view).onclick = () => go('create');
    $('#pf-notify', view).onclick = () => {
      if (S.prefs.notify) { S.prefs.notify = false; save(); render(); toast('התראות כבויות', 'info'); }
      else askNotifications();
    };
    $('#pf-edit', view).onclick = () => formSheet('עריכת פרופיל', [
      { name: 'first', label: 'שם פרטי', value: u.first, required: true },
      { name: 'last', label: 'שם משפחה', value: u.last },
      { name: 'age', label: 'גיל', type: 'number', value: u.age || '', min: 6 }
    ], (v) => {
      S.user.first = v.first; S.user.last = v.last; S.user.age = v.age ? Number(v.age) : null;
      save(); toast('הפרופיל עודכן', 'ok'); render();
    }, 'שמירה');
    $('#pf-export', view).onclick = () => {
      const data = JSON.stringify(S, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mixit-backup-' + todayISO() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      toast('הגיבוי יורד למכשיר 💾', 'ok');
    };
    $('#pf-import', view).onclick = () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'application/json,.json';
      inp.onchange = () => {
        const f = inp.files[0]; if (!f) return;
        const fr = new FileReader();
        fr.onload = () => {
          try {
            const parsed = JSON.parse(fr.result);
            if (!parsed || typeof parsed !== 'object') throw new Error('bad');
            S = deepMerge(defaultState(), parsed);
            save(true); applyTheme();
            toast('הנתונים שוחזרו בהצלחה ✅', 'ok', 3000);
            UI.screen = 'home'; render();
          } catch (e) { toast('הקובץ לא תקין', 'err'); }
        };
        fr.readAsText(f);
      };
      inp.click();
    };
    $('#pf-reset', view).onclick = () => confirmSheet('לאפס הכל?', 'כל המשימות, האירועים, העיצובים וההישגים יימחקו מהמכשיר. אי אפשר לשחזר בלי גיבוי.', () => {
      localStorage.removeItem(DB_KEY);
      S = defaultState();
      UI.screen = 'home';
      ScreensAuth.slide = 0;
      applyTheme(); render();
      toast('האפליקציה אופסה', 'ok');
    }, 'כן, לאפס');
  }
};

SCREENS.profile = (v) => Profile.render(v);
