/* ===== GAMES WORLD: 12 new games inside MIXIT ===== */
const GAME_LIST = [
  { id: 'memory', name: 'זיכרון', icon: '🧠', desc: 'מצאו את כל הזוגות', mode: 'min', unit: 'מהלכים' },
  { id: 'g2048', name: '2048', icon: '🔢', desc: 'חברו אריחים עד 2048', mode: 'max', unit: 'נקודות' },
  { id: 'ttt', name: 'איקס עיגול', icon: '⭕', desc: 'נגד המחשב או חבר', mode: 'max', unit: 'ניצחונות' },
  { id: 'sudoku', name: 'סודוקו 4×4', icon: '🔲', desc: 'מלאו את הריבוע', mode: 'min', unit: 'שניות' },
  { id: 'slide', name: 'פאזל הזזה', icon: '🧩', desc: 'סדרו מ-1 עד 8', mode: 'min', unit: 'מהלכים' },
  { id: 'simon', name: 'סיימון', icon: '🎵', desc: 'חזרו על הרצף', mode: 'max', unit: 'שלבים' },
  { id: 'reaction', name: 'מהירות תגובה', icon: '⚡', desc: 'לחצו כשמתחלף לירוק', mode: 'min', unit: 'מ״ש' },
  { id: 'math', name: 'מרתון חשבון', icon: '➗', desc: '60 שניות של תרגילים', mode: 'max', unit: 'נקודות' },
  { id: 'words', name: 'מילים מבולבלות', icon: '🔤', desc: 'סדרו את האותיות', mode: 'max', unit: 'מילים' },
  { id: 'trivia', name: 'טריוויה', icon: '❓', desc: '10 שאלות, כמה תדעו?', mode: 'max', unit: 'נקודות' },
  { id: 'rps', name: 'אבן נייר ומספריים', icon: '✊', desc: 'הטוב מ-5', mode: 'max', unit: 'ניצחונות' },
  { id: 'guess', name: 'נחש את המספר', icon: '🎯', desc: 'בין 1 ל-100', mode: 'min', unit: 'ניסיונות' }
];

const WORDS_GAME = [
  ['מחשב', 'מכשיר עם מסך ומקלדת'], ['שמש', 'זורחת בבוקר'], ['ספר', 'קוראים אותו'], ['חלום', 'קורה בלילה'],
  ['גיטרה', 'כלי מיתר'], ['פרח', 'גדל בגינה'], ['תפוח', 'פרי אדום'], ['מזוודה', 'לוקחים לטיול'],
  ['חופשה', 'זמן בלי בית ספר'], ['משפחה', 'האנשים הקרובים'], ['עיפרון', 'כותבים איתו'], ['קשת', 'בשמיים אחרי גשם'],
  ['תמונה', 'מצלמים אותה'], ['מסעדה', 'אוכלים בה'], ['כדורגל', 'משחק עם כדור'], ['חורף', 'העונה הקרה'],
  ['מטריה', 'מגנה מגשם'], ['שוקולד', 'ממתק חום'], ['מכונית', 'נוסעים בה'], ['שמיים', 'מעל כולם'],
  ['עוגה', 'אופים ליום הולדת'], ['יער', 'הרבה עצים'], ['מפתח', 'פותח דלת'], ['כוכב', 'זורח בלילה'],
  ['מקלחת', 'מתקלחים בה'], ['תיק', 'שמים בו דברים'], ['מרפסת', 'בחוץ, בבית'], ['קיץ', 'העונה החמה']
];

const TRIVIA = [
  ['מהי עיר הבירה של ישראל?', ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע'], 1],
  ['כמה ימים יש בשבוע?', ['5', '6', '7', '8'], 2],
  ['איזה בעל חיים הוא היונק הגדול בעולם?', ['פיל', 'לווייתן כחול', 'ג׳ירפה', 'דוב'], 1],
  ['מהו הצבע שמתקבל מערבוב כחול וצהוב?', ['ירוק', 'סגול', 'כתום', 'חום'], 0],
  ['כמה צלעות יש למשולש?', ['2', '3', '4', '5'], 1],
  ['מה שותים דביבונים?', ['חלב', 'מים', 'מיץ', 'תה'], 1],
  ['איזו עונה מגיעה אחרי האביב?', ['חורף', 'סתיו', 'קיץ', 'אביב'], 2],
  ['מהו הכוכב הקרוב ביותר לכדור הארץ?', ['הירח', 'השמש', 'מאדים', 'נוגה'], 1],
  ['כמה דקות יש בשעה?', ['30', '45', '60', '100'], 2],
  ['איזה כלי נגינה הוא בעל קלידים?', ['חליל', 'פסנתר', 'תוף', 'כינור'], 1],
  ['מהי היבשת הגדולה בעולם?', ['אפריקה', 'אסיה', 'אירופה', 'אמריקה'], 1],
  ['כמה חודשים יש בשנה?', ['10', '11', '12', '13'], 2],
  ['מהו המטבע בישראל?', ['דולר', 'שקל', 'אירו', 'לירה'], 1],
  ['איזה חומר נוצר מדבורים?', ['חלב', 'דבש', 'חמאה', 'שמן'], 1],
  ['כמה רגליים יש לעכביש?', ['6', '8', '10', '12'], 1],
  ['מהו האוקיינוס הגדול בעולם?', ['השקט', 'האטלנטי', 'ההודי', 'הצפוני'], 0],
  ['איזה צבע יש לעלים בדרך כלל?', ['כחול', 'ירוק', 'אדום', 'צהוב'], 1],
  ['כמה שניות יש בדקה?', ['30', '60', '90', '100'], 1],
  ['מה אוכלים בדרך כלל בבוקר?', ['ארוחת בוקר', 'ארוחת ערב', 'צהריים', 'קינוח'], 0],
  ['איזו עיר ידועה כמרכז הטכנולוגיה בישראל?', ['אילת', 'תל אביב', 'טבריה', 'עכו'], 1],
  ['כמה עיניים יש לחתול?', ['1', '2', '3', '4'], 1],
  ['מהו הפרי הצהוב הארוך?', ['בננה', 'תפוח', 'ענב', 'אגס'], 0],
  ['מה עושה המצלמה?', ['מצלמת', 'כותבת', 'שרה', 'מציירת'], 0],
  ['מהו המקום שבו גרים ספרים?', ['ספרייה', 'מטבח', 'מרפסת', 'מחסן'], 0],
  ['כמה כנפיים יש לציפור?', ['1', '2', '3', '4'], 1],
  ['מהו הצבע של שלג?', ['שחור', 'לבן', 'כחול', 'אפור'], 1],
  ['מהו הכלי שמודד טמפרטורה?', ['ברומטר', 'מדחום', 'מצפן', 'שעון'], 1],
  ['איזה ירק הוא כתום?', ['מלפפון', 'גזר', 'עגבנייה', 'חסה'], 1],
  ['כמה אצבעות יש ביד אחת?', ['4', '5', '6', '10'], 1],
  ['מהו שם הים שמזרחית לישראל?', ['הים האדום', 'הים התיכון', 'ים המלח', 'הכנרת'], 1]
];

const Games = {
  timer: null, raf: null, current: null, _cleanup: null,
  stop() {
    clearInterval(this.timer); this.timer = null;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    if (this._cleanup) { try { this._cleanup(); } catch (e) {} this._cleanup = null; }
    this.current = null;
  },
  store() {
    if (!S.games) S.games = { best: {}, plays: 0, wins: 0 };
    return S.games;
  },
  bestOf(id) { return this.store().best[id]; },
  saveBest(id, value) {
    const g = this.store();
    const meta = GAME_LIST.find((x) => x.id === id);
    const cur = g.best[id];
    const better = cur == null || (meta.mode === 'max' ? value > cur : value < cur);
    if (better) g.best[id] = value;
    save(); checkAchievements();
    return better;
  },
  win(id, value, label) {
    const isBest = this.saveBest(id, value);
    if (isBest) { this.store().wins = (this.store().wins || 0) + 1; save(); }
    toast((isBest ? 'שיא חדש! 🏆 ' : 'כל הכבוד! ') + label, 'ok', 3200);
  },

  hub(view) {
    this.stop();
    const g = this.store();
    view.innerHTML = '<div class="shell">' +
      '<div class="row" style="margin-bottom:10px"><button class="icon-btn" id="gm-back">›</button>' +
      '<div class="sp"><div class="h1">פינת המשחקים</div>' +
      '<div class="sub">12 משחקים חדשים, בלי הורדות ובלי פרסומות</div></div>' +
      '<button class="icon-btn" id="gm-search">🔍</button></div>' +
      '<div class="grid g3" style="margin-bottom:16px">' +
      '<div class="stat"><b>' + (g.plays || 0) + '</b><span>משחקים ששוחקו</span></div>' +
      '<div class="stat"><b>' + Object.keys(g.best || {}).length + '</b><span>שיאים אישיים</span></div>' +
      '<div class="stat"><b>' + (g.wins || 0) + '</b><span>ניצחונות</span></div>' +
      '</div>' +
      '<div class="grid g2">' + GAME_LIST.map((game) => {
        const best = g.best[game.id];
        return '<button class="tile" data-game="' + game.id + '">' +
          '<i>' + game.icon + '</i><b>' + game.name + '</b><span>' + game.desc + '</span>' +
          (best != null ? '<span class="badge" style="margin-top:4px">🏆 ' + best + ' ' + game.unit + '</span>' : '') +
          '</button>';
      }).join('') + '</div>' +
      '<div class="section"><div class="card tight"><div class="row"><span style="font-size:20px">💡</span>' +
      '<div class="sp"><div class="h3">איך זה עובד?</div><div class="tiny">כל המשחקים עובדים על המסך, בלי אינטרנט נוסף. השיאים נשמרים במכשיר שלך.</div></div></div></div></div>' +
      '</div>';
    document.getElementById('gm-back').onclick = () => go('next');
    document.getElementById('gm-search').onclick = openSearch;
    $$('[data-game]', view).forEach((b) => { b.onclick = () => this.play(b.dataset.game); });
  },

  play(id) {
    const meta = GAME_LIST.find((x) => x.id === id);
    if (!meta) return;
    this.stop();
    this.current = id;
    const st = this.store();
    st.plays = (st.plays || 0) + 1;
    save(); checkAchievements();
    const view = document.getElementById('view');
    view.innerHTML = '<div class="shell">' +
      '<div class="row" style="margin-bottom:12px"><button class="icon-btn" id="g-back">›</button>' +
      '<div class="sp"><div class="h1" style="font-size:22px">' + meta.icon + ' ' + meta.name + '</div>' +
      '<div class="tiny">' + meta.desc + '</div></div>' +
      '<button class="btn ghost sm" id="g-restart">↻ התחלה</button></div>' +
      '<div id="game-area"></div></div>';
    document.getElementById('g-back').onclick = () => { this.stop(); go('next'); };
    document.getElementById('g-restart').onclick = () => this.play(id);
    const area = document.getElementById('game-area');
    const impl = GAME_IMPL[id];
    if (impl) impl(area, meta);
  }
};

const GAME_IMPL = {};

/* ---------- 1. memory ---------- */
GAME_IMPL.memory = (el, meta) => {
  const icons = ['🍓', '🌙', '🦋', '🎈', '🍀', '⭐', '🧁', '🎨'];
  let deck = icons.concat(icons).map((c, i) => ({ c: c, r: Math.random() + i * 0.001 })).sort((a, b) => a.r - b.r)
    .map((x, i) => ({ id: i, c: x.c, open: false, done: false }));
  let first = null, moves = 0, lock = false;
  const t0 = Date.now();

  const paint = () => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">מהלכים: ' + moves + '</span><span class="badge sky">זוגות: ' + deck.filter((d) => d.done).length / 2 + '/8</span></div>' +
      '<div class="game-grid" style="grid-template-columns:repeat(4,1fr)">' +
      deck.map((c) => '<button class="mem-card ' + (c.open || c.done ? 'open ' : '') + (c.done ? 'done' : '') + '" data-c="' + c.id + '">' +
        (c.open || c.done ? c.c : '') + '</button>').join('') + '</div>';
    $$('[data-c]', el).forEach((b) => { b.onclick = () => flip(Number(b.dataset.c)); });
  };
  const flip = (i) => {
    const c = deck[i];
    if (lock || c.open || c.done) return;
    c.open = true; paint();
    if (first == null) { first = i; return; }
    moves++;
    const a = deck[first], b = deck[i];
    if (a.c === b.c) {
      a.done = b.done = true; first = null; paint();
      if (deck.every((x) => x.done)) {
        const secs = Math.round((Date.now() - t0) / 1000);
        Games.win('memory', moves, 'סיימת ב-' + moves + ' מהלכים ו-' + secs + ' שניות');
      }
    } else {
      lock = true;
      setTimeout(() => { a.open = b.open = false; first = null; lock = false; paint(); }, 700);
    }
  };
  paint();
};

/* ---------- 2. 2048 ---------- */
GAME_IMPL.g2048 = (el, meta) => {
  let grid, score, over;
  const COLORS = { 2: '#F5F1FF', 4: '#EDE7FF', 8: '#DDD0FF', 16: '#C9B6FF', 32: '#B49CFF', 64: '#A78BFA', 128: '#8B5CF6', 256: '#7C3AED', 512: '#6D28D9', 1024: '#5B21B6', 2048: '#4C1D95' };
  const start = () => {
    grid = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    score = 0; over = false;
    add(); add(); paint();
  };
  const add = () => {
    const empty = [];
    grid.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  };
  const paint = () => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">ניקוד: ' + score + '</span>' +
      '<span class="badge sky">שיא: ' + (Games.bestOf('g2048') || 0) + '</span></div>' +
      '<div class="board2048">' + grid.map((row) => row.map((v) => '<div class="t2048" style="background:' + (v ? COLORS[v] || '#4C1D95' : 'rgba(139,92,246,.08)') + ';color:' + (v > 4 ? '#fff' : '#2C2540') + '">' + (v || '') + '</div>').join('')).join('') + '</div>' +
      (over ? '<div class="card" style="margin-top:12px;text-align:center"><div class="h2">נגמר המשחק</div><div class="sub">ניקוד: ' + score + '</div>' +
        '<button class="btn block" style="margin-top:10px" id="g2048-again">עוד סיבוב</button></div>' : '') +
      '<div class="row" style="margin-top:12px;gap:8px;justify-content:center">' +
      '<button class="btn ghost" data-dir="left">→</button><button class="btn ghost" data-dir="up">↑</button>' +
      '<button class="btn ghost" data-dir="down">↓</button><button class="btn ghost" data-dir="right">←</button></div>' +
      '<p class="tiny" style="text-align:center;margin-top:8px">אפשר גם עם חצים במקלדת או החלקה על המסך</p>';
    $$('[data-dir]', el).forEach((b) => { b.onclick = () => move(b.dataset.dir); });
    const again = document.getElementById('g2048-again');
    if (again) again.onclick = start;
  };
  const rotate = (g) => g[0].map((_, i) => g.map((row) => row[i]).reverse());
  const slideLeft = (g) => {
    let gained = 0;
    const out = g.map((row) => {
      const vals = row.filter((v) => v);
      const merged = [];
      for (let i = 0; i < vals.length; i++) {
        if (vals[i] === vals[i + 1]) { merged.push(vals[i] * 2); gained += vals[i] * 2; i++; }
        else merged.push(vals[i]);
      }
      while (merged.length < 4) merged.push(0);
      return merged;
    });
    return { g: out, gained: gained };
  };
  const move = (dir) => {
    if (over) return;
    let g = grid.map((r) => r.slice());
    let times = dir === 'left' ? 0 : dir === 'up' ? 1 : dir === 'right' ? 2 : 3;
    for (let i = 0; i < times; i++) g = rotate(g);
    const res = slideLeft(g);
    g = res.g;
    for (let i = 0; i < (4 - times) % 4; i++) g = rotate(g);
    const changed = JSON.stringify(g) !== JSON.stringify(grid);
    if (!changed) return;
    grid = g; score += res.gained;
    add();
    if (!canMove()) { over = true; Games.win('g2048', score, 'הגעת ל-' + score + ' נקודות'); }
    paint();
  };
  const canMove = () => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      if (!grid[r][c]) return true;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
    }
    return false;
  };
  const keyHandler = (e) => {
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
  };
  document.addEventListener('keydown', keyHandler);
  Games._cleanup = () => document.removeEventListener('keydown', keyHandler);
  let sx = 0, sy = 0;
  el.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  });
  start();
};

/* ---------- 3. tic tac toe ---------- */
GAME_IMPL.ttt = (el, meta) => {
  let board = Array(9).fill('');
  let vsAI = true, turn = 'X', done = false;
  const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const winner = (b) => {
    for (const w of wins) if (b[w[0]] && b[w[0]] === b[w[1]] && b[w[1]] === b[w[2]]) return b[w[0]];
    return b.every((x) => x) ? 'draw' : null;
  };
  const minimax = (b, player) => {
    const w = winner(b);
    if (w === 'O') return { score: 10 };
    if (w === 'X') return { score: -10 };
    if (w === 'draw') return { score: 0 };
    let best = null;
    b.forEach((v, i) => {
      if (v) return;
      const nb = b.slice(); nb[i] = player;
      const res = minimax(nb, player === 'O' ? 'X' : 'O');
      const score = res.score + (player === 'O' ? -0.1 : 0.1);
      if (!best || (player === 'O' ? score > best.score : score < best.score)) best = { score: score, move: i };
    });
    return best || { score: 0 };
  };
  const paint = () => {
    const w = winner(board);
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<div class="chips"><button class="chip ' + (vsAI ? 'on' : '') + '" data-mode="ai">נגד המחשב</button>' +
      '<button class="chip ' + (!vsAI ? 'on' : '') + '" data-mode="two">שני שחקנים</button></div>' +
      '<span class="badge">' + (w ? (w === 'draw' ? 'תיקו' : 'ניצחון ל-' + w) : 'תור ' + turn) + '</span></div>' +
      '<div class="board3">' + board.map((v, i) => '<button class="cell3 ' + (v === 'X' ? 'x' : v === 'O' ? 'o' : '') + '" data-i="' + i + '">' + v + '</button>').join('') + '</div>' +
      '<button class="btn ghost block" style="margin-top:12px" id="ttt-new">משחק חדש</button>';
    $$('[data-mode]', el).forEach((b) => {
      b.onclick = () => { vsAI = b.dataset.mode === 'ai'; board = Array(9).fill(''); turn = 'X'; paint(); };
    });
    $$('[data-i]', el).forEach((b) => { b.onclick = () => play(Number(b.dataset.i)); });
    document.getElementById('ttt-new').onclick = () => { board = Array(9).fill(''); turn = 'X'; paint(); };
    if (w && w !== 'draw' && w === 'X') Games.saveBest('ttt', (Games.bestOf('ttt') || 0) + 1);
  };
  const play = (i) => {
    if (board[i] || winner(board)) return;
    board[i] = turn; turn = turn === 'X' ? 'O' : 'X';
    if (vsAI && !winner(board)) {
      const res = minimax(board, 'O');
      if (res.move != null) board[res.move] = 'O';
      turn = 'X';
    }
    const w = winner(board);
    paint();
    if (w === 'draw') toast('תיקו! 🤝', 'info');
    else if (w === 'X') toast('ניצחת! 🎉', 'ok');
    else if (w === 'O') toast('המחשב ניצח. עוד סיבוב?', 'err');
  };
  paint();
};

/* ---------- 4. sudoku 4x4 ---------- */
GAME_IMPL.sudoku = (el, meta) => {
  const base = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
  const digits = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
  let sol = base.map((r) => r.map((v) => digits[v - 1]));
  if (Math.random() < 0.5) sol = sol.map((r) => r.slice().reverse());
  let puzzle = sol.map((r) => r.slice());
  let blanks = [];
  sol.forEach((r, i) => r.forEach((v, j) => blanks.push([i, j])));
  blanks.sort(() => Math.random() - 0.5).slice(0, 8).forEach(([i, j]) => { puzzle[i][j] = 0; });
  let sel = null, start = Date.now(), solved = false;

  const paint = () => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">מלאו את המשבצות הריקות</span><span class="badge sky">⏱ ' + Math.round((Date.now() - start) / 1000) + ' שנ׳</span></div>' +
      '<div class="board4">' + puzzle.map((row, i) => row.map((v, j) =>
        '<button class="cell4 ' + (sel && sel[0] === i && sel[1] === j ? 'sel ' : '') + (sol[i][j] && base[i][j] === 0 ? '' : '') + '" data-r="' + i + '" data-c="' + j + '">' + (v || '') + '</button>').join('')).join('') + '</div>' +
      '<div class="row" style="margin-top:12px;gap:8px;justify-content:center">' +
      [1, 2, 3, 4].map((n) => '<button class="btn ghost" data-n="' + n + '" style="min-width:52px">' + n + '</button>').join('') +
      '<button class="btn ghost" data-n="0">⌫</button></div>';
    $$('[data-r]', el).forEach((b) => { b.onclick = () => { sel = [Number(b.dataset.r), Number(b.dataset.c)]; paint(); }; });
    $$('[data-n]', el).forEach((b) => {
      b.onclick = () => {
        if (!sel) { toast('בחרו משבצת קודם', 'err', 1500); return; }
        const [r, c] = sel;
        if (puzzle[r][c] && puzzle[r][c] === sol[r][c] && blanks.findIndex(([i, j]) => i === r && j === c) < 0) return;
        puzzle[r][c] = Number(b.dataset.n);
        paint();
        check();
      };
    });
  };
  const check = () => {
    const full = puzzle.every((row) => row.every((v) => v));
    if (!full) return;
    const ok = puzzle.every((row, i) => row.every((v, j) => v === sol[i][j]));
    if (ok) {
      solved = true;
      Games.win('sudoku', Math.round((Date.now() - start) / 1000), 'פתרת את הסודוקו');
      toast('פתרון מושלם! 🎉', 'ok');
    } else {
      toast('כמעט — יש מספר לא נכון', 'err');
    }
  };
  paint();
  Games.timer = setInterval(() => {
    const badge = el.querySelector('.badge.sky');
    if (badge) badge.textContent = '⏱ ' + Math.round((Date.now() - start) / 1000) + ' שנ׳';
  }, 1000);
};

/* ---------- 5. sliding puzzle ---------- */
GAME_IMPL.slide = (el, meta) => {
  let tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let moves = 0;
  const solved = () => tiles.every((v, i) => v === (i === 8 ? 0 : i + 1));
  const shuffle = () => {
    let blank = 8;
    for (let i = 0; i < 120; i++) {
      const r = Math.floor(blank / 3), c = blank % 3;
      const opts = [];
      if (r > 0) opts.push(blank - 3); if (r < 2) opts.push(blank + 3);
      if (c > 0) opts.push(blank - 1); if (c < 2) opts.push(blank + 1);
      const pick = opts[Math.floor(Math.random() * opts.length)];
      tiles[blank] = tiles[pick]; tiles[pick] = 0; blank = pick;
    }
    moves = 0;
    if (solved()) shuffle();
  };
  const paint = () => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">מהלכים: ' + moves + '</span><span class="badge sky">שיא: ' + (Games.bestOf('slide') || '—') + '</span></div>' +
      '<div class="board3">' + tiles.map((v, i) => '<button class="slide-tile ' + (v ? '' : 'blank') + '" data-i="' + i + '">' + (v || '') + '</button>').join('') + '</div>' +
      '<button class="btn ghost block" style="margin-top:12px" id="slide-new">ערבוב מחדש</button>';
    $$('[data-i]', el).forEach((b) => { b.onclick = () => tap(Number(b.dataset.i)); });
    document.getElementById('slide-new').onclick = () => { shuffle(); paint(); };
  };
  const tap = (i) => {
    const blank = tiles.indexOf(0);
    const [r1, c1] = [Math.floor(i / 3), i % 3], [r2, c2] = [Math.floor(blank / 3), blank % 3];
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;
    tiles[blank] = tiles[i]; tiles[i] = 0; moves++;
    paint();
    if (solved()) Games.win('slide', moves, 'סידרת את הפאזל ב-' + moves + ' מהלכים');
  };
  shuffle(); paint();
};

/* ---------- 6. simon ---------- */
GAME_IMPL.simon = (el, meta) => {
  const pads = [
    { c: '#8B5CF6', i: '🟣', f: 329 }, { c: '#38BDF8', i: '🔵', f: 392 },
    { c: '#F472B6', i: '🩷', f: 440 }, { c: '#8FB89A', i: '🟢', f: 523 }
  ];
  let seq = [], input = 0, level = 0, playing = false;
  const paint = (active) => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">שלב: ' + level + '</span><span class="badge sky">שיא: ' + (Games.bestOf('simon') || 0) + '</span></div>' +
      '<div class="simon-grid">' + pads.map((p, i) =>
        '<button class="simon-pad ' + (active === i ? 'lit' : '') + '" data-p="' + i + '" style="background:' + p.c + '">' + p.i + '</button>').join('') + '</div>' +
      '<p class="tiny" style="text-align:center;margin-top:10px">' + (playing ? 'הקשיבו…' : 'חזרו על הרצף לפי הסדר') + '</p>' +
      (level === 0 ? '<button class="btn block" style="margin-top:10px" id="simon-start">▶ התחלה</button>' : '');
    $$('[data-p]', el).forEach((b) => { b.onclick = () => press(Number(b.dataset.p)); });
    const st = document.getElementById('simon-start');
    if (st) st.onclick = next;
  };
  const beep = (f) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      Games.audio = Games.audio || new Ctx();
      const ctx = Games.audio;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f; o.type = 'sine';
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.26);
    } catch (e) { /* ignore */ }
  };
  const flash = (i, ms) => {
    paint(i); beep(pads[i].f);
    setTimeout(() => paint(null), ms || 320);
  };
  const next = () => {
    seq.push(Math.floor(Math.random() * 4));
    level = seq.length; input = 0; playing = true;
    paint(null);
    seq.forEach((p, idx) => setTimeout(() => { if (playing) flash(p, 300); }, 520 * idx + 400));
    setTimeout(() => { playing = false; paint(null); }, 520 * seq.length + 500);
  };
  const press = (i) => {
    if (playing || !seq.length) return;
    flash(i, 180);
    if (seq[input] === i) {
      input++;
      if (input === seq.length) {
        Games.saveBest('simon', level);
        setTimeout(next, 520);
      }
    } else {
      toast('הרצף נשבר בשלב ' + level, 'err', 2600);
      Games.saveBest('simon', level);
      seq = []; level = 0; input = 0; playing = false;
      setTimeout(() => paint(null), 350);
    }
  };
  paint(null);
};

/* ---------- 7. reaction ---------- */
GAME_IMPL.reaction = (el, meta) => {
  let state = 'idle', times = [], t0 = 0, timer = null;
  const paint = (color, text, sub) => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">שיא: ' + (Games.bestOf('reaction') || '—') + ' מ״ש</span>' +
      '<span class="badge sky">סבבים: ' + times.length + '/5</span></div>' +
      '<button id="react-btn" style="width:100%;min-height:260px;border-radius:24px;font-size:22px;font-weight:900;color:#fff;background:' + color + ';display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;box-shadow:var(--shadow-m)">' +
      '<span style="font-size:40px">' + (state === 'go' ? '⚡' : state === 'wait' ? '⏳' : state === 'done' ? '🏁' : '👆') + '</span>' +
      '<span>' + text + '</span>' + (sub ? '<span style="font-size:13px;font-weight:600;opacity:.9">' + sub + '</span>' : '') + '</button>' +
      (times.length ? '<div class="row" style="margin-top:12px;gap:6px;flex-wrap:wrap;justify-content:center">' +
        times.map((t, i) => '<span class="badge">' + (i + 1) + ': ' + t + ' מ״ש</span>').join('') + '</div>' : '');
    document.getElementById('react-btn').onclick = tap;
  };
  const tap = () => {
    if (state === 'idle' || state === 'done') {
      if (times.length >= 5) times = [];
      state = 'wait';
      paint('#F59E0B', 'המתינו לירוק…', 'אל תלחצו מוקדם מדי');
      timer = setTimeout(() => {
        state = 'go'; t0 = performance.now();
        paint('#22C55E', 'לחצו!', 'עכשיו');
      }, 1200 + Math.random() * 2600);
    } else if (state === 'wait') {
      clearTimeout(timer);
      state = 'idle';
      paint('#EF4444', 'מוקדם מדי 😅', 'לחצו להתחלה חדשה');
      times = [];
    } else if (state === 'go') {
      const ms = Math.round(performance.now() - t0);
      times.push(ms);
      if (times.length >= 5) {
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        state = 'done';
        paint('#8B5CF6', 'ממוצע: ' + avg + ' מ״ש', 'לחצו לסיבוב נוסף');
        Games.win('reaction', avg, 'ממוצע תגובה ' + avg + ' מ״ש');
      } else {
        state = 'idle';
        paint('#8B5CF6', ms + ' מ״ש', 'לחצו לסבב הבא');
      }
    }
  };
  paint('#8B5CF6', 'לחצו להתחלה', '5 סבבים, נמדוד ממוצע');
};

/* ---------- 8. math sprint ---------- */
GAME_IMPL.math = (el, meta) => {
  let score = 0, timeLeft = 60, q = null, running = false;
  const make = () => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 2 + Math.floor(Math.random() * 12), b = 2 + Math.floor(Math.random() * 12);
    if (op === '-' && b > a) { const t = a; a = b; b = t; }
    const ans = op === '+' ? a + b : op === '-' ? a - b : a * b;
    const opts = [ans];
    while (opts.length < 4) {
      const delta = [-3, -2, -1, 1, 2, 3, 5][Math.floor(Math.random() * 7)];
      const v = ans + delta;
      if (v >= 0 && !opts.includes(v)) opts.push(v);
    }
    opts.sort(() => Math.random() - 0.5);
    return { text: a + ' ' + op + ' ' + b + ' = ?', ans: ans, opts: opts };
  };
  const paint = () => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">ניקוד: ' + score + '</span><span class="badge ' + (timeLeft <= 10 ? 'red' : 'sky') + '">⏱ ' + timeLeft + ' שנ׳</span></div>' +
      (q ? '<div class="card" style="text-align:center;padding:26px 16px"><div style="font-size:30px;font-weight:900;letter-spacing:-1px">' + q.text + '</div></div>' +
        '<div class="grid g2" style="margin-top:12px">' + q.opts.map((o) => '<button class="btn ghost" data-ans="' + o + '" style="font-size:19px;padding:16px">' + o + '</button>').join('') + '</div>'
        : '<button class="btn block" id="math-start">▶ התחלה (60 שניות)</button>');
    $$('[data-ans]', el).forEach((b) => {
      b.onclick = () => {
        if (!running) return;
        if (Number(b.dataset.ans) === q.ans) { score += 10; toast('נכון! +10', 'ok', 900); }
        else { score = Math.max(0, score - 5); toast('לא נכון. ' + q.ans, 'err', 1200); }
        q = make(); paint();
      };
    });
    const st = document.getElementById('math-start');
    if (st) st.onclick = start;
  };
  const start = () => {
    score = 0; timeLeft = 60; running = true; q = make(); paint();
    Games.timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(Games.timer); running = false;
        Games.win('math', score, 'סיימת עם ' + score + ' נקודות');
        el.innerHTML = '<div class="card" style="text-align:center;padding:26px"><div style="font-size:40px">🏁</div>' +
          '<div class="h2">הזמן נגמר</div><div class="sub">ניקוד: ' + score + '</div>' +
          '<button class="btn block" style="margin-top:12px" id="math-again">עוד סיבוב</button></div>';
        document.getElementById('math-again').onclick = () => { timeLeft = 60; start(); };
        return;
      }
      paint();
    }, 1000);
  };
  paint();
};

/* ---------- 9. scrambled words ---------- */
GAME_IMPL.words = (el, meta) => {
  let idx = Math.floor(Math.random() * WORDS_GAME.length), built = '', score = 0, checked = false;
  const letters = () => {
    const w = WORDS_GAME[idx][0];
    let arr = w.split('');
    if (arr.length > 2) {
      const first = arr[0];
      do { arr.sort(() => Math.random() - 0.5); } while (arr.join('') === w);
    }
    return arr;
  };
  let pool = [];
  const paint = () => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">מילים: ' + score + '</span><span class="badge sky">שיא: ' + (Games.bestOf('words') || 0) + '</span></div>' +
      '<div class="card" style="text-align:center"><div class="tiny">רמז</div><div class="h3" style="margin:4px 0 10px">' + esc(WORDS_GAME[idx][1]) + '</div>' +
      '<div class="word-slots">' + (built || ' ').split('').map((c) => '<span class="slot">' + esc(c) + '</span>').join('') + '</div></div>' +
      '<div class="chips" style="margin-top:12px;justify-content:center">' +
      pool.map((c, i) => '<button class="letter" data-l="' + i + '"' + (c.used ? ' disabled style="opacity:.25"' : '') + '>' + esc(c.ch) + '</button>').join('') + '</div>' +
      '<div class="row" style="margin-top:12px;gap:8px">' +
      '<button class="btn ghost" id="w-back">⌫</button>' +
      '<button class="btn block" id="w-check">בדיקה</button>' +
      '<button class="btn ghost" id="w-skip">דלג</button></div>';
    $$('[data-l]', el).forEach((b) => {
      b.onclick = () => {
        const i = Number(b.dataset.l);
        if (pool[i].used) return;
        pool[i].used = true; built += pool[i].ch; paint();
      };
    });
    document.getElementById('w-back').onclick = () => {
      if (!built) return;
      const ch = built.slice(-1); built = built.slice(0, -1);
      const slot = pool.find((p) => p.used && p.ch === ch);
      if (slot) slot.used = false;
      paint();
    };
    document.getElementById('w-check').onclick = () => {
      if (built === WORDS_GAME[idx][0]) {
        score++; Games.saveBest('words', score);
        toast('נכון! 🎉', 'ok', 1200);
        nextWord();
      } else {
        toast('עוד לא — נסו שוב', 'err', 1400);
      }
    };
    document.getElementById('w-skip').onclick = () => nextWord();
  };
  const nextWord = () => {
    idx = (idx + 1 + Math.floor(Math.random() * (WORDS_GAME.length - 1))) % WORDS_GAME.length;
    built = '';
    pool = letters().map((ch) => ({ ch: ch, used: false }));
    paint();
  };
  pool = letters().map((ch) => ({ ch: ch, used: false }));
  paint();
};

/* ---------- 10. trivia ---------- */
GAME_IMPL.trivia = (el, meta) => {
  let pool = TRIVIA.slice().sort(() => Math.random() - 0.5).slice(0, 10);
  let i = 0, score = 0, locked = false;
  const paint = (picked) => {
    if (i >= pool.length) {
      el.innerHTML = '<div class="card" style="text-align:center;padding:26px"><div style="font-size:40px">' + (score >= 80 ? '🏆' : score >= 50 ? '👏' : '💪') + '</div>' +
        '<div class="h2">' + score + ' מתוך 100</div>' +
        '<div class="sub">' + (score >= 80 ? 'אלופים! ידע מרשים.' : score >= 50 ? 'יפה מאוד! אפשר לשפר.' : 'עוד סיבוב ותהיו בפנים.') + '</div>' +
        '<button class="btn block" style="margin-top:12px" id="tq-again">עוד סיבוב</button></div>';
      document.getElementById('tq-again').onclick = () => { pool = TRIVIA.slice().sort(() => Math.random() - 0.5).slice(0, 10); i = 0; score = 0; paint(); };
      Games.win('trivia', score, 'טריוויה: ' + score + ' נקודות');
      return;
    }
    const q = pool[i];
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">שאלה ' + (i + 1) + '/10</span><span class="badge sky">ניקוד: ' + score + '</span></div>' +
      '<div class="card"><div class="h2" style="line-height:1.4">' + esc(q[0]) + '</div></div>' +
      '<div class="stack" style="margin-top:12px">' + q[1].map((opt, oi) =>
        '<button class="btn ghost" data-o="' + oi + '" style="justify-content:flex-start;text-align:start;padding:14px' +
        (picked != null && oi === q[2] ? ';background:#E7F2E9;color:#2F5A3D;border-color:#8FB89A' : '') +
        (picked != null && oi === picked && picked !== q[2] ? ';background:#FDECEF;color:#B3243B;border-color:#F08CA0' : '') + '">' + esc(opt) + '</button>').join('') + '</div>';
    $$('[data-o]', el).forEach((b) => {
      b.onclick = () => {
        if (locked) return;
        locked = true;
        const picked2 = Number(b.dataset.o);
        if (picked2 === q[2]) { score += 10; toast('נכון! +10', 'ok', 900); }
        else toast('התשובה הנכונה: ' + q[1][q[2]], 'err', 1800);
        paint(picked2);
        setTimeout(() => { i++; locked = false; paint(); }, 1000);
      };
    });
  };
  paint();
};

/* ---------- 11. rock paper scissors ---------- */
GAME_IMPL.rps = (el, meta) => {
  const moves = [{ k: 'rock', i: '✊', n: 'אבן' }, { k: 'paper', i: '✋', n: 'נייר' }, { k: 'scissors', i: '✌️', n: 'מספריים' }];
  let you = 0, cpu = 0, round = 1, last = null, over = false;
  const paint = () => {
    el.innerHTML = '<div class="row" style="justify-content:space-between;margin-bottom:10px">' +
      '<span class="badge">אתה: ' + you + '</span><span class="badge sky">מחשב: ' + cpu + '</span></div>' +
      '<div class="card" style="text-align:center;padding:20px">' +
      '<div class="row" style="justify-content:center;gap:26px;font-size:44px">' +
      '<div><div class="tiny">אתה</div>' + (last ? last.you.i : '❔') + '</div>' +
      '<div style="font-size:20px;align-self:center">VS</div>' +
      '<div><div class="tiny">מחשב</div>' + (last ? last.cpu.i : '❔') + '</div></div>' +
      '<div class="h3" style="margin-top:10px">' + (over ? (you > cpu ? 'ניצחת במשחק! 🏆' : you < cpu ? 'המחשב ניצח 😅' : 'תיקו 🤝') : (last ? last.text : 'סבב ' + round + ' מתוך 5')) + '</div></div>' +
      (over ? '<button class="btn block" style="margin-top:12px" id="rps-again">משחק חדש</button>' :
        '<div class="row" style="margin-top:12px;gap:8px">' + moves.map((m) => '<button class="btn ghost block" data-m="' + m.k + '" style="font-size:30px;padding:16px 0">' + m.i + '<span style="font-size:12px;display:block">' + m.n + '</span></button>').join('') + '</div>');
    $$('[data-m]', el).forEach((b) => { b.onclick = () => play(b.dataset.m); });
    const ag = document.getElementById('rps-again');
    if (ag) ag.onclick = () => { you = 0; cpu = 0; round = 1; last = null; over = false; paint(); };
  };
  const play = (k) => {
    if (over) return;
    const mine = moves.find((m) => m.k === k);
    const theirs = moves[Math.floor(Math.random() * 3)];
    let text;
    if (mine.k === theirs.k) text = 'תיקו בסבב';
    else if ((mine.k === 'rock' && theirs.k === 'scissors') || (mine.k === 'paper' && theirs.k === 'rock') || (mine.k === 'scissors' && theirs.k === 'paper')) { you++; text = 'נקודה לך! 🎉'; }
    else { cpu++; text = 'נקודה למחשב'; }
    last = { you: mine, cpu: theirs, text: text };
    round++;
    if (you === 3 || cpu === 3 || round > 5) {
      over = true;
      if (you > cpu) Games.saveBest('rps', (Games.bestOf('rps') || 0) + 1);
    }
    paint();
  };
  paint();
};

/* ---------- 12. guess the number ---------- */
GAME_IMPL.guess = (el, meta) => {
  let secret = Math.floor(Math.random() * 100) + 1, tries = 0, done = false, history = [];
  const paint = (msg, tone) => {
    el.innerHTML = '<div class="card" style="text-align:center;padding:22px">' +
      '<div style="font-size:36px">' + (done ? '🎯' : '🤔') + '</div>' +
      '<div class="h2" style="margin-top:6px">' + (done ? 'זה היה ' + secret + '!' : 'ניחשת ' + tries + ' פעמים') + '</div>' +
      '<div class="sub" style="margin-top:4px">' + (msg || 'מספר בין 1 ל-100. אני אגיד גבוה או נמוך.') + '</div></div>' +
      (done ? '<button class="btn block" style="margin-top:12px" id="g-new">מספר חדש</button>' :
        '<div class="row" style="margin-top:12px;gap:8px"><input class="input" id="guess-in" type="number" min="1" max="100" placeholder="המספר שלך" style="text-align:center;font-size:20px;font-weight:800">' +
        '<button class="btn" id="guess-go">נחש</button></div>') +
      (history.length ? '<div class="chips" style="margin-top:12px;justify-content:center">' + history.map((h) => '<span class="chip mini">' + h.n + ' ' + h.e + '</span>').join('') + '</div>' : '');
    if (!done) {
      const inp = document.getElementById('guess-in');
      const go = () => {
        const v = Number(inp.value);
        if (!v || v < 1 || v > 100) { toast('מספר בין 1 ל-100', 'err', 1500); return; }
        tries++;
        if (v === secret) {
          done = true;
          Games.win('guess', tries, 'מצאת ב-' + tries + ' ניסיונות');
          paint('', 'ok');
        } else {
          const hi = v > secret;
          history.unshift({ n: v, e: hi ? '↓' : '↑' });
          paint(hi ? 'גבוה מדי, נסה נמוך יותר' : 'נמוך מדי, נסה גבוה יותר');
        }
      };
      document.getElementById('guess-go').onclick = go;
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
      setTimeout(() => inp.focus(), 80);
    } else {
      document.getElementById('g-new').onclick = () => { secret = Math.floor(Math.random() * 100) + 1; tries = 0; done = false; history = []; paint(); };
    }
  };
  paint();
};

/* ===== games area entry points ===== */
const GamesScreen = {
  render(view) { Games.hub(view); }
};
SCREENS.games = (v) => GamesScreen.render(v);

ACHIEVEMENTS.push(
  { key: 'first_game', icon: '🕹️', title: 'שחקן/ית', desc: 'שיחקת במשחק ראשון', test: () => (S.games && S.games.plays >= 1) },
  { key: 'games10', icon: '🎮', title: 'גיימר/ית', desc: 'שיחקת 10 סיבובים', test: () => (S.games && S.games.plays >= 10) }
);
