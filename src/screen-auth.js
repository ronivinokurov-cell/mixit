/* ===== onboarding + signup ===== */
const INTRO_SLIDES = [
  {
    art: '🌈', bg: 'linear-gradient(140deg,#8B5CF6,#A78BFA 55%,#7DD3FC)',
    title: 'MIXIT', sub: 'כל העולם שלך באפליקציה אחת',
    text: 'ארגון, רעיונות וסטודיו יצירה — שלושה עולמות שמתחברים למקום אחד יפה ושימושי.'
  },
  {
    art: '🗂️', bg: 'linear-gradient(140deg,#7C5CE0,#C4B5FD)',
    title: 'MIXIT ORGANIZER', sub: 'היום שלך, מסודר',
    text: 'יומן, משימות, שיעורי בית, מטרות, קניות, תקציב ומערכת שעות. עם טיימרים וספירה לאחור לאירועים שחשובים לך.'
  },
  {
    art: '🎲', bg: 'linear-gradient(140deg,#38BDF8,#7DD3FC 60%,#A7F3D0)',
    title: 'WHAT’S NEXT', sub: 'מה עושים עכשיו?',
    text: 'מחולל פעילויות חכם: לפי זמן פנוי, תקציב ומספר משתתפים. לא אהבתם? הגרלה נוספת בלחיצה.'
  },
  {
    art: '🎨', bg: 'linear-gradient(140deg,#F472B6,#F9A8D4 55%,#FDE68A)',
    title: 'CREATE IT', sub: 'הסטודיו היצירתי שלך',
    text: 'כרזות, הזמנות, כרטיסי ברכה, רקעים, קולאז׳ים וציור דיגיטלי — עם פונטים, צבעים, מדבקות ומסגרות. מורידים ושומרים.'
  },
  {
    art: '💜', bg: 'linear-gradient(140deg,#6D4BD1,#C084FC 60%,#F9A8D4)',
    title: 'הכל אישי', sub: 'פרופיל, צבעים והישגים',
    text: 'בוחרים ערכת צבעים, רקע ואייקונים, מסדרים את מסך הבית ומרוויחים תגים על כל התקדמות.'
  }
];

const AVATARS = ['🦄', '🌈', '🐣', '🍓', '🎨', '🚀', '🌸', '🧁', '🐬', '🦊', '🎧', '🌻', '🐼', '🍋', '⭐', '🪐'];

const ScreensAuth = {
  slide: 0, timer: null, playing: true, form: null,

  render(view) {
    clearInterval(this.timer);
    if (!S.seenIntro) this.renderIntro(view);
    else this.renderSignup(view);
  },

  renderIntro(view) {
    const self = this;
    const s = INTRO_SLIDES[this.slide] || INTRO_SLIDES[0];
    view.innerHTML =
      '<div class="onb">' +
      '<div class="orb" style="width:300px;height:300px;background:#A78BFA;top:-90px;inset-inline-start:-80px"></div>' +
      '<div class="orb" style="width:260px;height:260px;background:#7DD3FC;bottom:-70px;inset-inline-end:-70px"></div>' +
      '<div class="onb-card">' +
      '<div style="text-align:center;margin-bottom:16px">' +
      '<div class="brand" style="justify-content:center;font-size:23px"><span class="brand-mark">🌈</span> MIXIT</div>' +
      '</div>' +
      '<div class="slide" style="background:' + s.bg + '">' +
      '<div class="art">' + s.art + '</div>' +
      '<div class="badge" style="background:rgba(255,255,255,.24);color:#fff">' + esc(s.sub) + '</div>' +
      '<h2>' + esc(s.title) + '</h2>' +
      '<p>' + esc(s.text) + '</p>' +
      '</div>' +
      '<div class="slide-dots">' + INTRO_SLIDES.map((_, i) => '<i class="' + (i === this.slide ? 'on' : '') + '"></i>').join('') + '</div>' +
      '<div class="onb-controls">' +
      '<button class="icon-btn" data-prev aria-label="הקודם">‹</button>' +
      '<button class="btn ghost sm" data-play>' + (this.playing ? '⏸ עצור' : '▶ הפעל') + '</button>' +
      (this.slide === INTRO_SLIDES.length - 1
        ? '<button class="btn" data-next>יאללה, מתחילים ✨</button>'
        : '<button class="icon-btn" data-next aria-label="הבא">›</button>') +
      '</div>' +
      '<div style="text-align:center;margin-top:14px"><button class="muted" data-skip style="text-decoration:underline">דלגו על ההסבר</button></div>' +
      '</div></div>';

    const next = () => {
      if (this.slide >= INTRO_SLIDES.length - 1) { this.finishIntro(); return; }
      this.slide++; this.renderIntro(view); this.startAuto(view);
    };
    $('[data-next]', view).onclick = next;
    $('[data-prev]', view).onclick = () => { this.slide = Math.max(0, this.slide - 1); this.renderIntro(view); this.startAuto(view); };
    $('[data-play]', view).onclick = () => { this.playing = !this.playing; this.renderIntro(view); this.startAuto(view); };
    $('[data-skip]', view).onclick = () => this.finishIntro();
    this.startAuto(view);
  },

  startAuto(view) {
    clearInterval(this.timer);
    if (!this.playing) return;
    const self = this;
    this.timer = setInterval(() => {
      if (self.slide >= INTRO_SLIDES.length - 1) { clearInterval(self.timer); return; }
      self.slide++;
      const v = document.getElementById('view');
      if (v) { self.renderIntro(v); self.startAuto(v); }
    }, 6200);
  },

  finishIntro() {
    clearInterval(this.timer);
    S.seenIntro = true;
    S.introSeenAt = new Date().toISOString();
    save();
    const v = document.getElementById('view');
    if (v) this.renderSignup(v);
  },

  renderSignup(view) {
    const self = this;
    const f = this.form || { first: '', last: '', avatar: AVATARS[0], age: '' };
    this.form = f;
    view.innerHTML =
      '<div class="onb"><div class="orb" style="width:320px;height:320px;background:#C4B5FD;top:-100px;inset-inline-end:-90px"></div>' +
      '<div class="orb" style="width:250px;height:250px;background:#A7F3D0;bottom:-60px;inset-inline-start:-70px"></div>' +
      '<div class="onb-card">' +
      '<div style="text-align:center;margin-bottom:18px">' +
      '<div class="brand" style="justify-content:center;font-size:24px;margin-bottom:6px"><span class="brand-mark">🌈</span> MIXIT</div>' +
      '<p class="sub">נשארו שני פרטים ונפתחים לך שלושה עולמות: ארגון, רעיונות ויצירה.</p>' +
      '</div>' +
      '<div class="card">' +
      '<div class="field" style="margin-bottom:12px"><label>איך קוראים לך?</label>' +
      '<input class="input" id="fn" placeholder="שם פרטי" value="' + esc(f.first) + '" autocomplete="given-name"></div>' +
      '<div class="field" style="margin-bottom:14px"><label>שם משפחה</label>' +
      '<input class="input" id="ln" placeholder="שם משפחה" value="' + esc(f.last) + '" autocomplete="family-name"></div>' +
      '<div class="field" style="margin-bottom:14px"><label>בחרו אווטאר</label>' +
      '<div class="emoji-grid" style="grid-template-columns:repeat(8,1fr);max-height:none">' +
      AVATARS.map((a) => '<button data-av="' + a + '" style="' + (a === f.avatar ? 'background:var(--brand-soft)' : '') + '">' + a + '</button>').join('') +
      '</div></div>' +
      '<div class="field" style="margin-bottom:16px"><label>גיל (לא חובה)</label>' +
      '<input class="input" id="age" type="number" min="6" max="120" placeholder="בן/בת כמה?" value="' + esc(f.age) + '"></div>' +
      '<button class="btn block" data-start>בואו נתחיל ✨</button>' +
      '<p class="tiny" style="text-align:center;margin-top:12px">הכל נשמר מקומית במכשיר שלך. אין צורך בסיסמה.</p>' +
      '</div>' +
      '<div style="text-align:center;margin-top:14px"><button class="muted" data-back style="text-decoration:underline">חזרה להצגה</button></div>' +
      '</div></div>';

    const fn = $('#fn', view), ln = $('#ln', view), age = $('#age', view);
    fn.oninput = () => { f.first = fn.value; };
    ln.oninput = () => { f.last = ln.value; };
    age.oninput = () => { f.age = age.value; };
    $$('[data-av]', view).forEach((b) => {
      b.onclick = () => { f.avatar = b.dataset.av; this.renderSignup(view); };
    });
    $('[data-back]', view).onclick = () => { S.seenIntro = false; this.slide = 0; this.renderIntro(view); };
    const submit = () => {
      const first = fn.value.trim(), last = ln.value.trim();
      if (first.length < 2) { toast('צריך שם פרטי (לפחות 2 אותיות)', 'err'); fn.focus(); return; }
      S.user = {
        first: first,
        last: last,
        avatar: f.avatar || AVATARS[0],
        age: age.value ? Number(age.value) : null,
        joined: todayISO()
      };
      S.seenIntro = true;
      save(true);
      touchStreak();
      checkAchievements();
      UI.screen = 'home';
      render();
      toast('ברוכים הבאים ל-MIXIT, ' + first + '! 🎉', 'ok', 3200);
    };
    $('[data-start]', view).onclick = submit;
    [fn, ln, age].forEach((el) => el.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); }));
    setTimeout(() => fn.focus(), 200);
  }
};
