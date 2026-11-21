/* ===== CREATE IT: studio, canvas editor, tools ===== */
const DESIGN_TYPES = {
  poster: { label: 'כרזה / פוסטר', icon: '📰', w: 600, h: 800, name: 'כרזה' },
  invitation: { label: 'הזמנה לאירוע', icon: '💌', w: 600, h: 800, name: 'הזמנה' },
  card: { label: 'כרטיס ברכה', icon: '🎴', w: 800, h: 600, name: 'כרטיס ברכה' },
  wallpaper: { label: 'רקע לטלפון', icon: '📱', w: 540, h: 960, name: 'רקע' },
  journal: { label: 'יומן דיגיטלי', icon: '📔', w: 600, h: 800, name: 'יומן' },
  collage: { label: 'קולאז׳ תמונות', icon: '🖼️', w: 700, h: 700, name: 'קולאז׳' },
  drawing: { label: 'ציור דיגיטלי', icon: '🖌️', w: 700, h: 700, name: 'ציור' },
  sticker: { label: 'מדבקה אישית', icon: '🏷️', w: 500, h: 500, name: 'מדבקה' },
  tshirt: { label: 'עיצוב חולצה', icon: '👕', w: 700, h: 700, name: 'חולצה' },
  bookcover: { label: 'כריכת ספר', icon: '📕', w: 600, h: 800, name: 'כריכה' },
  moodboard: { label: 'לוח השראה', icon: '📌', w: 700, h: 700, name: 'לוח השראה' },
  palette: { label: 'פלטת צבעים', icon: '🎨', w: 700, h: 500, name: 'פלטה' }
};

const TYPE_PALETTES = {
  poster: [['#8B5CF6', '#C4B5FD'], ['#F472B6', '#FDE68A'], ['#0EA5E9', '#A7F3D0'], ['#2C2540', '#8B5CF6']],
  invitation: [['#F9A8D4', '#FDE68A'], ['#A78BFA', '#BAE6FD'], ['#7FA98B', '#F3E7D9'], ['#FBCFE8', '#C4B5FD']],
  card: [['#FDE68A', '#F9A8D4'], ['#BAE6FD', '#C4B5FD'], ['#E7F2E9', '#FBF4EC'], ['#FBCFE8', '#FFF1F2']],
  wallpaper: [['#6D4BD1', '#F9A8D4'], ['#0EA5E9', '#A7F3D0'], ['#2C2540', '#8B5CF6'], ['#FDE68A', '#F9A8D4']],
  journal: [['#FBF4EC', '#F3E7D9'], ['#EDE7FF', '#E3F6FF'], ['#FDE7F3', '#FBF4EC'], ['#E7F2E9', '#FBF4EC']],
  collage: [['#FFFFFF', '#F5F1FF']],
  drawing: [['#FFFFFF', '#FFFFFF']],
  sticker: [['#FFFFFF', '#EDE7FF']],
  tshirt: [['#FFFFFF', '#F1F7FF']],
  bookcover: [['#2C2540', '#8B5CF6'], ['#8B5CF6', '#F9A8D4'], ['#7FA98B', '#FBF4EC']],
  moodboard: [['#FBF4EC', '#EDE7FF'], ['#F5F1FF', '#E3F6FF']],
  palette: [['#FBF8FF', '#F5F1FF']]
};

function mkText(text, o) {
  return Object.assign({
    id: uid('el'), type: 'text', text: text, x: 40, y: 60, w: 300, size: 40,
    font: 'Heebo', weight: 800, color: '#2C2540', align: 'center', rot: 0, lineH: 1.22
  }, o || {});
}
function mkEmoji(char, o) {
  return Object.assign({ id: uid('el'), type: 'emoji', char: char, x: 200, y: 200, size: 120, rot: 0 }, o || {});
}
function mkShape(shape, o) {
  return Object.assign({ id: uid('el'), type: 'shape', shape: shape, x: 200, y: 200, w: 200, h: 200, color: '#8B5CF6', opacity: 1, rot: 0 }, o || {});
}
function mkImage(src, o) {
  return Object.assign({ id: uid('el'), type: 'image', src: src, x: 60, y: 120, w: 400, h: 400, radius: 18, rot: 0 }, o || {});
}

function layoutFor(type, w, h) {
  const cx = w / 2;
  switch (type) {
    case 'poster':
      return [
        mkEmoji('✨', { x: cx, y: h * 0.16, size: Math.round(w * 0.16) }),
        mkText('הכרזה שלי', { x: w * 0.08, y: h * 0.28, w: w * 0.84, size: Math.round(w * 0.12), weight: 900, color: '#FFFFFF' }),
        mkText('כותרת משנה שמוסיפה הקשר', { x: w * 0.12, y: h * 0.46, w: w * 0.76, size: Math.round(w * 0.045), weight: 600, color: '#FFFFFF', lineH: 1.4 }),
        mkText('פרטים · מקום · תאריך', { x: w * 0.12, y: h * 0.86, w: w * 0.76, size: Math.round(w * 0.035), weight: 700, color: '#FFFFFF' })
      ];
    case 'invitation':
      return [
        mkEmoji('🎉', { x: cx, y: h * 0.14, size: Math.round(w * 0.14) }),
        mkText('מוזמנים!', { x: w * 0.08, y: h * 0.26, w: w * 0.84, size: Math.round(w * 0.13), weight: 900, color: '#4C1D95' }),
        mkText('לאירוע שלא תשכחו', { x: w * 0.12, y: h * 0.42, w: w * 0.76, size: Math.round(w * 0.045), weight: 600, color: '#5B5470' }),
        mkText('יום שישי · 19:00', { x: w * 0.12, y: h * 0.56, w: w * 0.76, size: Math.round(w * 0.05), weight: 800, color: '#2C2540' }),
        mkText('בית משפחת ישראלי, הרצל 12', { x: w * 0.1, y: h * 0.64, w: w * 0.8, size: Math.round(w * 0.038), weight: 600, color: '#5B5470' }),
        mkText('נא לאשר הגעה', { x: w * 0.12, y: h * 0.86, w: w * 0.76, size: Math.round(w * 0.032), weight: 700, color: '#8B5CF6' })
      ];
    case 'card':
      return [
        mkEmoji('🎈', { x: cx, y: h * 0.2, size: Math.round(w * 0.12) }),
        mkText('מזל טוב!', { x: w * 0.08, y: h * 0.36, w: w * 0.84, size: Math.round(w * 0.11), weight: 900, color: '#9D174D' }),
        mkText('מאחלים לך שנה מלאה בשמחות,', { x: w * 0.12, y: h * 0.58, w: w * 0.76, size: Math.round(w * 0.04), weight: 600, color: '#5B5470' }),
        mkText('חוויות חדשות ואנשים טובים 💜', { x: w * 0.12, y: h * 0.66, w: w * 0.76, size: Math.round(w * 0.04), weight: 600, color: '#5B5470' })
      ];
    case 'wallpaper':
      return [
        mkEmoji('🌙', { x: cx, y: h * 0.3, size: Math.round(w * 0.3) }),
        mkText('תשמרי על השקט שלך', { x: w * 0.1, y: h * 0.52, w: w * 0.8, size: Math.round(w * 0.062), weight: 800, color: '#FFFFFF' }),
        mkText('MIXIT', { x: w * 0.1, y: h * 0.9, w: w * 0.8, size: Math.round(w * 0.03), weight: 700, color: 'rgba(255,255,255,.75)' })
      ];
    case 'journal':
      return [
        mkText('היומן שלי', { x: w * 0.08, y: h * 0.1, w: w * 0.84, size: Math.round(w * 0.1), weight: 900, color: '#5B3FBF' }),
        mkText('מה קרה היום?', { x: w * 0.1, y: h * 0.24, w: w * 0.8, size: Math.round(w * 0.04), weight: 600, color: '#8B84A0' })
      ];
    case 'collage':
      return [mkText('הקולאז׳ שלי', { x: w * 0.1, y: h * 0.44, w: w * 0.8, size: Math.round(w * 0.06), weight: 800, color: '#8B5CF6' })];
    case 'drawing':
      return [];
    case 'sticker':
      return [
        mkShape('circle', { x: cx, y: h * 0.42, w: w * 0.62, h: w * 0.62, color: '#EDE7FF' }),
        mkEmoji('💜', { x: cx, y: h * 0.36, size: Math.round(w * 0.2) }),
        mkText('שלי', { x: w * 0.15, y: h * 0.58, w: w * 0.7, size: Math.round(w * 0.1), weight: 900, color: '#8B5CF6' })
      ];
    case 'tshirt':
      return [
        mkEmoji('🌈', { x: cx, y: h * 0.36, size: Math.round(w * 0.2) }),
        mkText('GOOD VIBES', { x: w * 0.1, y: h * 0.56, w: w * 0.8, size: Math.round(w * 0.075), weight: 900, color: '#2C2540' }),
        mkText('MIXIT STUDIO', { x: w * 0.1, y: h * 0.68, w: w * 0.8, size: Math.round(w * 0.028), weight: 700, color: '#8B84A0' })
      ];
    case 'bookcover':
      return [
        mkText('שם הספר', { x: w * 0.1, y: h * 0.2, w: w * 0.8, size: Math.round(w * 0.12), weight: 900, color: '#FFFFFF' }),
        mkText('מאת רוני', { x: w * 0.1, y: h * 0.72, w: w * 0.8, size: Math.round(w * 0.045), weight: 600, color: 'rgba(255,255,255,.85)' }),
        mkEmoji('📖', { x: cx, y: h * 0.48, size: Math.round(w * 0.18) })
      ];
    case 'moodboard':
      return [
        mkText('לוח ההשראה שלי', { x: w * 0.08, y: h * 0.08, w: w * 0.84, size: Math.round(w * 0.07), weight: 900, color: '#5B3FBF' }),
        mkText('צבעים, מילים ותמונות שמדברים אליי', { x: w * 0.1, y: h * 0.17, w: w * 0.8, size: Math.round(w * 0.035), weight: 600, color: '#8B84A0' })
      ];
    default:
      return [mkText('העיצוב שלי', { x: w * 0.1, y: h * 0.42, w: w * 0.8, size: Math.round(w * 0.1), weight: 900, color: '#8B5CF6' })];
  }
}

function newDesign(type, variant) {
  const t = DESIGN_TYPES[type] || DESIGN_TYPES.poster;
  const pals = TYPE_PALETTES[type] || TYPE_PALETTES.poster;
  const p = pals[(variant || 0) % pals.length];
  const d = {
    id: uid('d'), type: type, title: t.name + ' חדש', w: t.w, h: t.h,
    bg: { kind: 'gradient', c1: p[0], c2: p[1], angle: 135, pattern: 'none' },
    frame: { style: 'none', color: '#FFFFFF' },
    elements: layoutFor(type, t.w, t.h),
    folder: null, createdAt: Date.now(), updatedAt: Date.now(), thumb: null
  };
  return d;
}

/* ---------- canvas drawing ---------- */
function wrapLines(ctx, text, maxW) {
  const out = [];
  String(text).split('\n').forEach((para) => {
    const words = para.split(' ');
    let line = '';
    words.forEach((w) => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; }
      else line = test;
    });
    out.push(line);
  });
  return out;
}

function drawPattern(ctx, kind, w, h, color) {
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = color; ctx.fillStyle = color;
  if (kind === 'dots') {
    for (let y = 20; y < h; y += 42) for (let x = 20; x < w; x += 42) { ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); }
  } else if (kind === 'stripes') {
    ctx.lineWidth = 8;
    for (let x = -h; x < w + h; x += 46) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke(); }
  } else if (kind === 'grid') {
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  } else if (kind === 'lines') {
    ctx.globalAlpha = 0.35; ctx.lineWidth = 1.5;
    for (let y = 140; y < h - 40; y += 46) { ctx.beginPath(); ctx.moveTo(36, y); ctx.lineTo(w - 36, y); ctx.stroke(); }
  } else if (kind === 'hearts') {
    ctx.globalAlpha = 0.13;
    for (let y = 40; y < h; y += 90) for (let x = 40; x < w; x += 90) {
      ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.fillText('💜', x, y);
    }
  }
  ctx.restore();
}

function drawFrame(ctx, f, w, h) {
  if (!f || f.style === 'none') return;
  ctx.save();
  ctx.strokeStyle = f.color || '#fff';
  if (f.style === 'thin') { ctx.lineWidth = 3; ctx.strokeRect(18, 18, w - 36, h - 36); }
  else if (f.style === 'thick') { ctx.lineWidth = 10; ctx.strokeRect(26, 26, w - 52, h - 52); }
  else if (f.style === 'double') {
    ctx.lineWidth = 3; ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.lineWidth = 2; ctx.strokeRect(30, 30, w - 60, h - 60);
  } else if (f.style === 'dashed') {
    ctx.lineWidth = 4; ctx.setLineDash([16, 12]); ctx.strokeRect(20, 20, w - 40, h - 40); ctx.setLineDash([]);
  } else if (f.style === 'corners') {
    ctx.lineWidth = 6; ctx.lineCap = 'round';
    const L = 54, m = 22;
    [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]].forEach(([x, y, dx, dy]) => {
      ctx.beginPath(); ctx.moveTo(x + dx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * L); ctx.stroke();
    });
  }
  ctx.restore();
}

function heartPath(ctx, x, y, w, h) {
  const top = y + h * 0.3;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h);
  ctx.bezierCurveTo(x - w * 0.1, y + h * 0.6, x + w * 0.08, y + h * 0.05, x + w / 2, top);
  ctx.bezierCurveTo(x + w * 0.92, y + h * 0.05, x + w * 1.1, y + h * 0.6, x + w / 2, y + h);
  ctx.closePath();
}
function starPath(ctx, x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2, R = Math.min(w, h) / 2, r = R * 0.45;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 ? r : R;
    const px = cx + Math.cos(ang) * rad, py = cy + Math.sin(ang) * rad;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
}

const Studio = {
  d: null, sel: null, panel: 'style', drag: null, bounds: {}, root: null,

  draw(ctx, d) {
    const w = d.w, h = d.h;
    ctx.clearRect(0, 0, w, h);
    if (d.bg.kind === 'gradient') {
      const a = ((d.bg.angle || 135) * Math.PI) / 180;
      const x1 = w / 2 - Math.cos(a) * w / 2, y1 = h / 2 - Math.sin(a) * h / 2;
      const x2 = w / 2 + Math.cos(a) * w / 2, y2 = h / 2 + Math.sin(a) * h / 2;
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, d.bg.c1); g.addColorStop(1, d.bg.c2);
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = d.bg.c1 || '#fff';
    }
    ctx.fillRect(0, 0, w, h);
    if (d.bg.pattern && d.bg.pattern !== 'none') drawPattern(ctx, d.bg.pattern, w, h, d.bg.c2 || '#000');
    drawFrame(ctx, d.frame, w, h);

    const b = {};
    (d.elements || []).forEach((el) => {
      ctx.save();
      if (el.type === 'text') {
        ctx.translate(el.x + el.w / 2, el.y);
        ctx.rotate(((el.rot || 0) * Math.PI) / 180);
        ctx.font = (el.weight || 700) + ' ' + el.size + 'px "' + el.font + '", "Heebo", sans-serif';
        ctx.fillStyle = el.color; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        const lines = wrapLines(ctx, el.text, el.w);
        const lh = el.size * (el.lineH || 1.22);
        lines.forEach((ln, i) => ctx.fillText(ln, 0, i * lh));
        b[el.id] = { x: el.x, y: el.y, w: el.w, h: Math.max(el.size, lines.length * lh) };
      } else if (el.type === 'emoji') {
        ctx.translate(el.x, el.y); ctx.rotate(((el.rot || 0) * Math.PI) / 180);
        ctx.font = el.size + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(el.char, 0, 0);
        b[el.id] = { x: el.x - el.size / 2, y: el.y - el.size / 2, w: el.size, h: el.size };
      } else if (el.type === 'image') {
        ctx.translate(el.x + el.w / 2, el.y + el.h / 2);
        ctx.rotate(((el.rot || 0) * Math.PI) / 180);
        const r = Math.min(el.radius || 0, Math.min(el.w, el.h) / 2);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-el.w / 2, -el.h / 2, el.w, el.h, r);
        else ctx.rect(-el.w / 2, -el.h / 2, el.w, el.h);
        ctx.save(); ctx.clip();
        const img = this.imgCache[el.src];
        if (img && img.complete && img.naturalWidth) {
          const s = Math.max(el.w / img.naturalWidth, el.h / img.naturalHeight);
          const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
          ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
        } else {
          ctx.fillStyle = '#EDE7FF'; ctx.fill();
          ctx.fillStyle = '#8B84A0'; ctx.font = '20px "Heebo",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('תמונה', 0, 0);
        }
        ctx.restore();
        b[el.id] = { x: el.x, y: el.y, w: el.w, h: el.h };
      } else if (el.type === 'shape') {
        ctx.translate(el.x + el.w / 2, el.y + el.h / 2);
        ctx.rotate(((el.rot || 0) * Math.PI) / 180);
        ctx.globalAlpha = el.opacity == null ? 1 : el.opacity;
        ctx.fillStyle = el.color; ctx.strokeStyle = el.color;
        const hw = el.w / 2, hh = el.h / 2;
        if (el.shape === 'circle') { ctx.beginPath(); ctx.ellipse(0, 0, hw, hh, 0, 0, 7); ctx.fill(); }
        else if (el.shape === 'rect') { ctx.fillRect(-hw, -hh, el.w, el.h); }
        else if (el.shape === 'line') { ctx.fillRect(-hw, -3, el.w, 6); }
        else if (el.shape === 'heart') { heartPath(ctx, -hw, -hh, el.w, el.h); ctx.fill(); }
        else if (el.shape === 'star') { starPath(ctx, -hw, -hh, el.w, el.h); ctx.fill(); }
        else if (el.shape === 'triangle') { ctx.beginPath(); ctx.moveTo(0, -hh); ctx.lineTo(hw, hh); ctx.lineTo(-hw, hh); ctx.closePath(); ctx.fill(); }
        b[el.id] = { x: el.x, y: el.y, w: el.w, h: el.h };
      }
      ctx.restore();
    });
    this.bounds = b;
  },

  imgCache: {},

  loadImages(d) {
    (d.elements || []).forEach((el) => {
      if (el.type === 'image' && el.src && !this.imgCache[el.src]) {
        const img = new Image();
        img.onload = () => this.paint();
        img.src = el.src;
        this.imgCache[el.src] = img;
      }
    });
  },

  paint() {
    const c = document.getElementById('stage');
    if (!c || !this.d) return;
    const ctx = c.getContext('2d');
    this.draw(ctx, this.d);
    if (this.sel) {
      const bb = this.bounds[this.sel];
      if (bb) {
        ctx.save();
        ctx.strokeStyle = '#8B5CF6'; ctx.lineWidth = 2; ctx.setLineDash([8, 6]);
        ctx.strokeRect(bb.x - 4, bb.y - 4, bb.w + 8, bb.h + 8);
        ctx.setLineDash([]);
        ctx.fillStyle = '#fff'; ctx.strokeStyle = '#8B5CF6';
        [[bb.x - 4, bb.y - 4], [bb.x + bb.w + 4, bb.y - 4], [bb.x - 4, bb.y + bb.h + 4], [bb.x + bb.w + 4, bb.y + bb.h + 4]].forEach(([x, y]) => {
          ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); ctx.stroke();
        });
        ctx.restore();
      }
    }
  },

  openNew(type, variant) {
    const d = newDesign(type, variant);
    S.designs.unshift(d);
    S.stats.designs = (S.stats.designs || 0) + 1;
    save();
    this.open(d.id);
  },
  openSaved(id) {
    const d = S.designs.find((x) => x.id === id);
    if (!d) { toast('העיצוב לא נמצא', 'err'); return; }
    this.open(id);
  },
  open(id) {
    const d = S.designs.find((x) => x.id === id);
    if (!d) return;
    this.d = d; this.sel = null; this.panel = 'style';
    this.loadImages(d);
    UI.screen = 'create';
    this.renderEditor();
  },

  renderEditor() {
    const view = document.getElementById('view');
    const d = this.d;
    view.innerHTML = '<div class="shell">' +
      '<div class="row" style="margin-bottom:10px">' +
      '<button class="icon-btn" id="st-back">›</button>' +
      '<div class="sp"><input class="input" id="st-title" value="' + esc(d.title) + '" style="padding:8px 12px;font-weight:800">' +
      '<div class="tiny" style="margin-top:3px">' + DESIGN_TYPES[d.type].icon + ' ' + DESIGN_TYPES[d.type].label + ' · ' + d.w + '×' + d.h + '</div></div>' +
      '</div>' +
      '<div class="studio-wrap">' +
      '<div class="stage-box"><canvas id="stage" width="' + d.w + '" height="' + d.h + '"></canvas></div>' +
      '<div class="row" style="gap:8px">' +
      '<button class="btn sm" id="st-save">💾 שמירה</button>' +
      '<button class="btn ghost sm" id="st-png">⬇️ הורדה</button>' +
      '<button class="btn ghost sm" id="st-share">📤 שיתוף</button>' +
      '<span class="sp"></span><button class="btn danger sm" id="st-del">🗑</button>' +
      '</div>' +
      '<div class="tool-tabs">' +
      [['style', '🎨 עיצוב'], ['add', '➕ הוספה'], ['layer', '🧩 שכבה'], ['templates', '✨ תבניות']].map((t) =>
        '<button class="tool-tab ' + (this.panel === t[0] ? 'on' : '') + '" data-panel="' + t[0] + '">' + t[1] + '</button>').join('') +
      '</div>' +
      '<div class="tool-panel" id="st-panel"></div>' +
      '</div></div>';

    const c = document.getElementById('stage');
    c.style.width = '100%';
    c.style.maxWidth = (d.w > d.h ? '560px' : '400px');

    document.getElementById('st-back').onclick = () => { this.commit(); go('create'); };
    document.getElementById('st-title').oninput = (e) => { d.title = e.target.value; save(); };
    document.getElementById('st-save').onclick = () => { this.commit(); toast('העיצוב נשמר 💾', 'ok'); };
    document.getElementById('st-png').onclick = () => this.download();
    document.getElementById('st-share').onclick = () => this.share();
    document.getElementById('st-del').onclick = () => confirmSheet('למחוק עיצוב?', 'העיצוב יימחק לצמיתות.', () => {
      S.designs = S.designs.filter((x) => x.id !== d.id);
      save(); toast('העיצוב נמחק', 'ok'); go('create');
    });
    $$('[data-panel]', view).forEach((b) => {
      b.onclick = () => { this.panel = b.dataset.panel; this.renderEditor(); };
    });
    this.bindCanvas(c);
    this.paint();
    this.renderPanel();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.paint());
  },

  bindCanvas(c) {
    const self = this;
    const toLocal = (e) => {
      const r = c.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (self.d.w / r.width), y: (e.clientY - r.top) * (self.d.h / r.height) };
    };
    const hit = (p) => {
      const els = self.d.elements || [];
      for (let i = els.length - 1; i >= 0; i--) {
        const bb = self.bounds[els[i].id];
        if (bb && p.x >= bb.x - 6 && p.x <= bb.x + bb.w + 6 && p.y >= bb.y - 6 && p.y <= bb.y + bb.h + 6) return els[i];
      }
      return null;
    };
    c.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      c.setPointerCapture(e.pointerId);
      const p = toLocal(e);
      const el = hit(p);
      self.sel = el ? el.id : null;
      if (el) {
        self.drag = { id: el.id, dx: p.x - el.x, dy: p.y - el.y, moved: false };
        if (self.panel !== 'layer') self.panel = 'layer';
        self.renderPanel();
      } else {
        self.drag = null;
        self.renderPanel();
      }
      c.classList.add('dragging');
      self.paint();
    });
    c.addEventListener('pointermove', (e) => {
      if (!self.drag) return;
      const p = toLocal(e);
      const el = (self.d.elements || []).find((x) => x.id === self.drag.id);
      if (!el) return;
      el.x = Math.round(p.x - self.drag.dx);
      el.y = Math.round(p.y - self.drag.dy);
      self.drag.moved = true;
      self.paint();
    });
    const end = () => {
      if (self.drag && self.drag.moved) { self.d.updatedAt = Date.now(); save(); }
      self.drag = null;
      c.classList.remove('dragging');
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('pointerleave', end);
  },

  selEl() { return (this.d.elements || []).find((x) => x.id === this.sel) || null; },

  renderPanel() {
    const p = document.getElementById('st-panel');
    if (!p) return;
    const d = this.d;
    const el = this.selEl();
    let html = '';

    if (this.panel === 'style') {
      html += '<div class="h3" style="margin-bottom:8px">רקע</div>' +
        '<div class="tool-row" style="margin-bottom:10px">' +
        [['solid', 'צבע'], ['gradient', 'גרדיאנט']].map((k) => '<button class="chip ' + (d.bg.kind === k[0] ? 'on' : '') + '" data-bgkind="' + k[0] + '">' + k[1] + '</button>').join('') +
        '<span class="sp"></span>' +
        '<input type="color" data-bgc1 value="' + (d.bg.c1 || '#8B5CF6') + '">' +
        (d.bg.kind === 'gradient' ? '<input type="color" data-bgc2 value="' + (d.bg.c2 || '#A78BFA') + '">' : '') +
        '</div>' +
        (d.bg.kind === 'gradient' ? '<div class="field" style="margin-bottom:10px"><label>זווית: ' + (d.bg.angle || 135) + '°</label><input type="range" min="0" max="360" value="' + (d.bg.angle || 135) + '" data-bgangle></div>' : '') +
        '<div class="field" style="margin-bottom:12px"><label>דוגמה ברקע</label><select class="input" data-pattern>' +
        [['none', 'בלי'], ['dots', 'נקודות'], ['stripes', 'פסים'], ['grid', 'משבצות'], ['lines', 'שורות (ליומן)'], ['hearts', 'לבבות']].map((o) =>
          '<option value="' + o[0] + '"' + ((d.bg.pattern || 'none') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>' +
        '<div class="h3" style="margin-bottom:8px">פלטות מוכנות</div>' +
        '<div class="chips" style="margin-bottom:14px">' + COLOR_SETS.map((cs, i) =>
          '<button class="chip mini" data-pal="' + i + '" style="background:linear-gradient(90deg,' + cs.colors[0] + ',' + cs.colors[1] + ');color:#fff">' + cs.name + '</button>').join('') + '</div>' +
        '<div class="h3" style="margin-bottom:8px">מסגרת</div>' +
        '<div class="chips" style="margin-bottom:10px">' +
        [['none', 'בלי'], ['thin', 'דקה'], ['thick', 'עבה'], ['double', 'כפולה'], ['dashed', 'מקווקוות'], ['corners', 'פינות']].map((f) =>
          '<button class="chip mini ' + ((d.frame.style || 'none') === f[0] ? 'on' : '') + '" data-frame="' + f[0] + '">' + f[1] + '</button>').join('') + '</div>' +
        '<div class="tool-row"><span class="tiny">צבע מסגרת</span><input type="color" data-framecolor value="' + (d.frame.color || '#FFFFFF') + '"></div>';
    } else if (this.panel === 'add') {
      html += '<div class="h3" style="margin-bottom:8px">הוספה מהירה</div>' +
        '<div class="tool-row" style="margin-bottom:14px">' +
        '<button class="btn soft sm" data-add="text">✏️ טקסט</button>' +
        '<button class="btn soft sm" data-add="headline">🔠 כותרת</button>' +
        '<button class="btn soft sm" data-add="image">🖼️ תמונה</button>' +
        '<button class="btn soft sm" data-add="shape">⬛ צורה</button>' +
        '</div>' +
        '<div class="h3" style="margin-bottom:8px">מדבקות ואיורים</div>' +
        '<div class="emoji-grid" style="margin-bottom:12px">' + EMOJI_PACK.map((e) => '<button data-emoji="' + e + '">' + e + '</button>').join('') + '</div>' +
        '<div class="h3" style="margin-bottom:8px">צורות</div>' +
        '<div class="tool-row">' +
        ['circle', 'rect', 'line', 'heart', 'star', 'triangle'].map((s) =>
          '<button class="tool-btn" data-shape="' + s + '">' + ({ circle: '⚪', rect: '⬛', line: '➖', heart: '❤️', star: '⭐', triangle: '🔺' }[s]) + '</button>').join('') +
        '</div>';
    } else if (this.panel === 'layer') {
      if (!el) {
        html += '<div class="empty">בחרו אלמנט על הקנבס כדי לערוך אותו. אפשר גם להוסיף טקסט, מדבקה או תמונה בטאב “הוספה”.</div>';
        if ((d.elements || []).length) {
          html += '<div class="h3" style="margin:14px 0 8px">שכבות בעיצוב</div><div class="list-plain">' +
            d.elements.slice().reverse().map((x) => '<div class="item" data-pick="' + x.id + '"><span style="font-size:16px">' +
              (x.type === 'text' ? '✏️' : x.type === 'emoji' ? x.char : x.type === 'image' ? '🖼️' : '⬛') + '</span>' +
              '<span class="sp item-title">' + esc(x.type === 'text' ? x.text.slice(0, 22) : x.type === 'emoji' ? x.char : x.type === 'image' ? 'תמונה' : 'צורה') + '</span>' +
              '<button class="del" data-del-el="' + x.id + '">🗑</button></div>').join('') + '</div>';
        }
      } else {
        html += '<div class="row" style="margin-bottom:10px"><div class="h3 sp">' + (el.type === 'text' ? '✏️ טקסט' : el.type === 'emoji' ? '😊 מדבקה' : el.type === 'image' ? '🖼️ תמונה' : '⬛ צורה') + '</div>' +
          '<button class="btn ghost xs" data-dup>שכפול</button><button class="btn danger xs" data-del-el="' + el.id + '">מחיקה</button></div>';
        if (el.type === 'text') {
          html += '<div class="field" style="margin-bottom:10px"><label>טקסט</label><textarea class="input" id="el-text">' + esc(el.text) + '</textarea></div>' +
            '<div class="grid g2" style="margin-bottom:10px">' +
            '<div class="field"><label>פונט</label><select class="input" id="el-font">' + FONTS.map((f) => '<option value="' + f.v + '"' + (el.font === f.v ? ' selected' : '') + '>' + f.t + '</option>').join('') + '</select></div>' +
            '<div class="field"><label>משקל</label><select class="input" id="el-weight">' + [[400, 'רגיל'], [600, 'בינוני'], [700, 'מודגש'], [900, 'שמן']].map((w2) => '<option value="' + w2[0] + '"' + (Number(el.weight) === w2[0] ? ' selected' : '') + '>' + w2[1] + '</option>').join('') + '</select></div>' +
            '</div>' +
            '<div class="field" style="margin-bottom:10px"><label>גודל: ' + el.size + 'px</label><input type="range" min="10" max="' + Math.round(d.w / 2) + '" value="' + el.size + '" data-size></div>' +
            '<div class="field" style="margin-bottom:10px"><label>רוחב תיבה: ' + Math.round(el.w) + '</label><input type="range" min="60" max="' + d.w + '" value="' + el.w + '" data-width></div>' +
            '<div class="field" style="margin-bottom:10px"><label>יישור</label><div class="chips">' +
            ['right', 'center', 'left'].map((a) => '<button class="chip mini ' + (el.align === a ? 'on' : '') + '" data-align="' + a + '">' + (a === 'right' ? 'ימין' : a === 'center' ? 'מרכז' : 'שמאל') + '</button>').join('') + '</div></div>';
        } else if (el.type === 'emoji') {
          html += '<div class="emoji-grid" style="margin-bottom:10px">' + EMOJI_PACK.map((e) => '<button data-emoji-sel="' + e + '" style="' + (e === el.char ? 'background:var(--brand-soft)' : '') + '">' + e + '</button>').join('') + '</div>' +
            '<div class="field" style="margin-bottom:10px"><label>גודל: ' + el.size + '</label><input type="range" min="24" max="' + Math.round(d.w * 0.8) + '" value="' + el.size + '" data-size></div>';
        } else if (el.type === 'image') {
          html += '<div class="row" style="margin-bottom:10px"><button class="btn ghost sm" data-replace>החלפת תמונה</button>' +
            '<button class="btn ghost sm" data-fit>התאמה לרוחב</button></div>' +
            '<div class="field" style="margin-bottom:10px"><label>רוחב: ' + Math.round(el.w) + '</label><input type="range" min="60" max="' + d.w + '" value="' + el.w + '" data-width></div>' +
            '<div class="field" style="margin-bottom:10px"><label>פינות מעוגלות: ' + (el.radius || 0) + '</label><input type="range" min="0" max="120" value="' + (el.radius || 0) + '" data-radius></div>';
        } else if (el.type === 'shape') {
          html += '<div class="chips" style="margin-bottom:10px">' + ['circle', 'rect', 'line', 'heart', 'star', 'triangle'].map((s) =>
            '<button class="chip mini ' + (el.shape === s ? 'on' : '') + '" data-shapesel="' + s + '">' + ({ circle: 'עיגול', rect: 'מלבן', line: 'קו', heart: 'לב', star: 'כוכב', triangle: 'משולש' }[s]) + '</button>').join('') + '</div>' +
            '<div class="field" style="margin-bottom:10px"><label>רוחב: ' + Math.round(el.w) + '</label><input type="range" min="20" max="' + d.w + '" value="' + el.w + '" data-width></div>' +
            '<div class="field" style="margin-bottom:10px"><label>גובה: ' + Math.round(el.h) + '</label><input type="range" min="4" max="' + d.h + '" value="' + el.h + '" data-height></div>' +
            '<div class="field" style="margin-bottom:10px"><label>אטימות: ' + Math.round((el.opacity == null ? 1 : el.opacity) * 100) + '%</label><input type="range" min="10" max="100" value="' + Math.round((el.opacity == null ? 1 : el.opacity) * 100) + '" data-opacity></div>';
        }
        if (el.type !== 'image') {
          html += '<div class="row" style="margin-bottom:10px;gap:8px;align-items:center"><span class="tiny" style="min-width:44px">צבע</span>' +
            '<input type="color" data-elcolor value="' + (el.color || '#2C2540') + '">' +
            '<div class="swatches">' + ['#2C2540', '#FFFFFF', '#8B5CF6', '#F472B6', '#38BDF8', '#7FA98B', '#E6A96B'].map((c) => '<button class="sw" data-elcolor-set="' + c + '" style="background:' + c + ';width:26px;height:26px"></button>').join('') + '</div></div>';
        }
        html += '<div class="field" style="margin-bottom:10px"><label>סיבוב: ' + (el.rot || 0) + '°</label><input type="range" min="-180" max="180" value="' + (el.rot || 0) + '" data-rot></div>' +
          '<div class="row" style="gap:6px"><button class="btn ghost xs" data-move="up">⬆️ קדימה</button>' +
          '<button class="btn ghost xs" data-move="down">⬇️ אחורה</button>' +
          '<button class="btn ghost xs" data-move="center">מרכוז</button></div>';
      }
    } else if (this.panel === 'templates') {
      const pals = TYPE_PALETTES[d.type] || TYPE_PALETTES.poster;
      html += '<div class="h3" style="margin-bottom:8px">וריאציות צבע מהירות</div><div class="chips" style="margin-bottom:14px">' +
        pals.map((p2, i) => '<button class="chip mini" data-variant="' + i + '" style="background:linear-gradient(90deg,' + p2[0] + ',' + p2[1] + ');color:#fff">וריאציה ' + (i + 1) + '</button>').join('') + '</div>' +
        '<div class="h3" style="margin-bottom:8px">פריסות</div><div class="chips" style="margin-bottom:14px">' +
        '<button class="chip mini" data-relayout>פריסה מחדש</button>' +
        '<button class="chip mini" data-clear-els>ניקוי אלמנטים</button></div>' +
        '<div class="h3" style="margin-bottom:8px">עיצוב חדש מאותו סוג</div>' +
        '<button class="btn ghost sm" data-new-type>צור עיצוב חדש</button>';
    }
    p.innerHTML = html;
    this.bindPanel(p);
  },

  bindPanel(p) {
    const d = this.d, self = this;
    const el = this.selEl();
    const repaint = () => { d.updatedAt = Date.now(); this.paint(); save(); };

    $$('[data-bgkind]', p).forEach((b) => { b.onclick = () => { d.bg.kind = b.dataset.bgkind; repaint(); this.renderPanel(); }; });
    const c1 = p.querySelector('[data-bgc1]'); if (c1) c1.oninput = () => { d.bg.c1 = c1.value; repaint(); };
    const c2 = p.querySelector('[data-bgc2]'); if (c2) c2.oninput = () => { d.bg.c2 = c2.value; repaint(); };
    const ang = p.querySelector('[data-bgangle]'); if (ang) ang.oninput = () => { d.bg.angle = Number(ang.value); repaint(); };
    const pat = p.querySelector('[data-pattern]'); if (pat) pat.onchange = () => { d.bg.pattern = pat.value; repaint(); };
    $$('[data-pal]', p).forEach((b) => {
      b.onclick = () => {
        const cs = COLOR_SETS[Number(b.dataset.pal)];
        d.bg.kind = 'gradient'; d.bg.c1 = cs.colors[0]; d.bg.c2 = cs.colors[1];
        repaint(); this.renderPanel(); toast('הפלטה הוחלה', 'ok', 1500);
      };
    });
    $$('[data-frame]', p).forEach((b) => { b.onclick = () => { d.frame.style = b.dataset.frame; repaint(); this.renderPanel(); }; });
    const fc = p.querySelector('[data-framecolor]'); if (fc) fc.oninput = () => { d.frame.color = fc.value; repaint(); };

    $$('[data-add]', p).forEach((b) => {
      b.onclick = () => {
        const kind = b.dataset.add;
        if (kind === 'text') {
          d.elements.push(mkText('טקסט חדש', { x: d.w * 0.1, y: d.h * 0.45, w: d.w * 0.8, size: Math.round(d.w * 0.06), color: '#2C2540' }));
        } else if (kind === 'headline') {
          d.elements.push(mkText('כותרת', { x: d.w * 0.08, y: d.h * 0.2, w: d.w * 0.84, size: Math.round(d.w * 0.11), weight: 900, color: '#8B5CF6' }));
        } else if (kind === 'image') {
          pickImage((src) => {
            d.elements.push(mkImage(src, { x: d.w * 0.12, y: d.h * 0.3, w: d.w * 0.76, h: d.w * 0.6 }));
            this.loadImages(d); repaint(); this.sel = d.elements[d.elements.length - 1].id; this.panel = 'layer'; this.renderPanel(); this.paint();
            toast('התמונה נוספה', 'ok');
          }, 1200);
          return;
        } else if (kind === 'shape') {
          d.elements.push(mkShape('circle', { x: d.w * 0.3, y: d.h * 0.35, w: d.w * 0.4, h: d.w * 0.4, color: '#C4B5FD' }));
        }
        this.sel = d.elements[d.elements.length - 1].id;
        this.panel = 'layer'; repaint(); this.renderPanel();
      };
    });
    $$('[data-emoji]', p).forEach((b) => {
      b.onclick = () => {
        d.elements.push(mkEmoji(b.dataset.emoji, { x: d.w / 2, y: d.h / 2, size: Math.round(d.w * 0.2) }));
        this.sel = d.elements[d.elements.length - 1].id;
        this.panel = 'layer'; repaint(); this.renderPanel();
      };
    });
    $$('[data-shape]', p).forEach((b) => {
      b.onclick = () => {
        d.elements.push(mkShape(b.dataset.shape, { x: d.w * 0.3, y: d.h * 0.35, w: d.w * 0.4, h: d.w * 0.4, color: '#C4B5FD' }));
        this.sel = d.elements[d.elements.length - 1].id;
        this.panel = 'layer'; repaint(); this.renderPanel();
      };
    });
    $$('[data-pick]', p).forEach((b) => { b.onclick = () => { this.sel = b.dataset.pick; repaint(); this.renderPanel(); }; });
    $$('[data-del-el]', p).forEach((b) => {
      b.onclick = () => {
        d.elements = d.elements.filter((x) => x.id !== b.dataset.delEl);
        if (this.sel === b.dataset.delEl) this.sel = null;
        repaint(); this.renderPanel(); toast('האלמנט נמחק', 'ok', 1400);
      };
    });
    const dup = p.querySelector('[data-dup]');
    if (dup && el) dup.onclick = () => {
      const copy = JSON.parse(JSON.stringify(el));
      copy.id = uid('el'); copy.x += 22; copy.y += 22;
      d.elements.push(copy); this.sel = copy.id; repaint(); this.renderPanel();
    };
    const t = p.querySelector('#el-text');
    if (t && el) t.oninput = () => { el.text = t.value; repaint(); };
    const f = p.querySelector('#el-font');
    if (f && el) f.onchange = () => { el.font = f.value; repaint(); };
    const wt = p.querySelector('#el-weight');
    if (wt && el) wt.onchange = () => { el.weight = Number(wt.value); repaint(); };
    const sz = p.querySelector('[data-size]');
    if (sz && el) sz.oninput = () => { el.size = Number(sz.value); repaint(); };
    const wd = p.querySelector('[data-width]');
    if (wd && el) wd.oninput = () => { el.w = Number(wd.value); repaint(); };
    const ht = p.querySelector('[data-height]');
    if (ht && el) ht.oninput = () => { el.h = Number(ht.value); repaint(); };
    const rd = p.querySelector('[data-radius]');
    if (rd && el) rd.oninput = () => { el.radius = Number(rd.value); repaint(); };
    const op = p.querySelector('[data-opacity]');
    if (op && el) op.oninput = () => { el.opacity = Number(op.value) / 100; repaint(); };
    const rot = p.querySelector('[data-rot]');
    if (rot && el) rot.oninput = () => { el.rot = Number(rot.value); repaint(); };
    const ec = p.querySelector('[data-elcolor]');
    if (ec && el) ec.oninput = () => { el.color = ec.value; repaint(); };
    $$('[data-elcolor-set]', p).forEach((b) => { if (el) b.onclick = () => { el.color = b.dataset.elcolorSet; repaint(); this.renderPanel(); }; });
    $$('[data-align]', p).forEach((b) => { if (el) b.onclick = () => { el.align = b.dataset.align; repaint(); this.renderPanel(); }; });
    $$('[data-emoji-sel]', p).forEach((b) => { if (el) b.onclick = () => { el.char = b.dataset.emojiSel; repaint(); this.renderPanel(); }; });
    $$('[data-shapesel]', p).forEach((b) => { if (el) b.onclick = () => { el.shape = b.dataset.shapesel; repaint(); this.renderPanel(); }; });
    const rep = p.querySelector('[data-replace]');
    if (rep && el) rep.onclick = () => pickImage((src) => { el.src = src; this.loadImages(d); repaint(); }, 1200);
    const fit = p.querySelector('[data-fit]');
    if (fit && el) fit.onclick = () => { el.w = d.w * 0.8; el.h = el.h * (el.w / (el.w || 1)); el.x = d.w * 0.1; repaint(); this.renderPanel(); };
    $$('[data-move]', p).forEach((b) => {
      if (!el) return;
      b.onclick = () => {
        const arr = d.elements;
        const i = arr.findIndex((x) => x.id === el.id);
        if (b.dataset.move === 'up' && i < arr.length - 1) { arr.splice(i, 1); arr.splice(i + 1, 0, el); }
        if (b.dataset.move === 'down' && i > 0) { arr.splice(i, 1); arr.splice(i - 1, 0, el); }
        if (b.dataset.move === 'center') { el.x = Math.round((d.w - (el.w || el.size || 0)) / 2); }
        repaint(); this.renderPanel();
      };
    });
    $$('[data-variant]', p).forEach((b) => {
      b.onclick = () => {
        const pals = TYPE_PALETTES[d.type] || TYPE_PALETTES.poster;
        const pal = pals[Number(b.dataset.variant)];
        d.bg.kind = 'gradient'; d.bg.c1 = pal[0]; d.bg.c2 = pal[1];
        repaint(); toast('הצבעים הוחלפו', 'ok', 1500);
      };
    });
    const rl = p.querySelector('[data-relayout]');
    if (rl) rl.onclick = () => { d.elements = layoutFor(d.type, d.w, d.h); this.sel = null; repaint(); this.renderPanel(); toast('הפריסה חודשה', 'ok'); };
    const ce = p.querySelector('[data-clear-els]');
    if (ce) ce.onclick = () => { d.elements = []; this.sel = null; repaint(); this.renderPanel(); };
    const nt = p.querySelector('[data-new-type]');
    if (nt) nt.onclick = () => this.openNew(d.type, Math.floor(Math.random() * 4));
  },

  commit() {
    const d = this.d;
    if (!d) return;
    d.thumb = this.thumb();
    d.updatedAt = Date.now();
    const i = S.designs.findIndex((x) => x.id === d.id);
    if (i < 0) S.designs.unshift(d);
    save(true);
  },
  thumb() {
    try {
      const d = this.d;
      const c = document.createElement('canvas');
      const W = 300, H = Math.round((300 * d.h) / d.w);
      c.width = W; c.height = H;
      const ctx = c.getContext('2d');
      ctx.scale(W / d.w, H / d.h);
      this.draw(ctx, d);
      return c.toDataURL('image/jpeg', 0.72);
    } catch (e) { return null; }
  },
  exportCanvas(scale) {
    const d = this.d;
    const c = document.createElement('canvas');
    c.width = Math.round(d.w * (scale || 2));
    c.height = Math.round(d.h * (scale || 2));
    const ctx = c.getContext('2d');
    ctx.scale(scale || 2, scale || 2);
    this.draw(ctx, d);
    return c;
  },
  download() {
    try {
      const c = this.exportCanvas(2);
      const url = c.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mixit-' + (this.d.title || 'design').replace(/[^\w\u0590-\u05FF\- ]/g, '') + '.png';
      document.body.appendChild(a); a.click(); a.remove();
      toast('הקובץ יורד עכשיו ⬇️', 'ok');
    } catch (e) { toast('לא הצלחתי להוריד את התמונה', 'err'); }
  },
  async share() {
    try {
      const c = this.exportCanvas(2);
      const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
      const file = new File([blob], 'mixit-design.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: this.d.title, text: 'נוצר ב-MIXIT 🎨' });
        toast('נשלח לשיתוף', 'ok');
      } else {
        this.download();
        toast('הדפדפן לא תומך בשיתוף ישיר — הורדנו את התמונה', 'info', 3800);
      }
    } catch (e) { this.download(); }
  }
};

/* ===== CREATE screen ===== */
const Create = {
  render(view) {
    const filter = UI.tab.folder || 'all';
    let designs = S.designs.slice();
    if (filter !== 'all') designs = designs.filter((d) => d.folder === filter);
    const favDesigns = designs.slice(0, 60);

    view.innerHTML = '<div class="shell">' +
      '<div class="row" style="margin-bottom:12px"><div class="sp"><div class="h1">CREATE IT</div>' +
      '<div class="sub">הסטודיו שלך — כרזות, הזמנות, קולאז׳ים ועוד</div></div>' +
      '<button class="icon-btn" id="cr-search">🔍</button></div>' +

      '<div class="grid g2" style="margin-bottom:6px">' +
      '<button class="tile" id="cr-new" style="background:linear-gradient(140deg,#8B5CF6,#A78BFA);color:#fff;border:none">' +
      '<i>✨</i><b style="color:#fff">עיצוב חדש</b><span style="color:rgba(255,255,255,.85)">בוחרים סוג ומתחילים</span></button>' +
      '<button class="tile" id="cr-draw" style="background:linear-gradient(140deg,#F472B6,#F9A8D4);color:#fff;border:none">' +
      '<i>🖌️</i><b style="color:#fff">ציור דיגיטלי</b><span style="color:rgba(255,255,255,.85)">מכחול, צבעים ומחיקה</span></button>' +
      '</div>' +

      '<div class="section"><div class="section-head"><div class="h2">🎨 מה יוצרים היום?</div></div>' +
      '<div class="grid g3">' + Object.keys(DESIGN_TYPES).map((k) => {
        const t = DESIGN_TYPES[k];
        return '<button class="tile" data-type="' + k + '"><i>' + t.icon + '</i><b>' + t.label + '</b><span>' + t.w + '×' + t.h + '</span></button>';
      }).join('') + '</div></div>' +

      '<div class="section"><div class="section-head"><div class="h2">🛠️ כלים</div></div>' +
      '<div class="grid g3">' +
      '<button class="tile" id="tool-palette"><i>🌈</i><b>פלטת צבעים</b><span>הרמוניות מוכנות</span></button>' +
      '<button class="tile" id="tool-collage"><i>🖼️</i><b>קולאז׳</b><span>מתמונות שלך</span></button>' +
      '<button class="tile" id="tool-sticker"><i>🏷️</i><b>מדבקה</b><span>אישית ומהירה</span></button>' +
      '</div></div>' +

      '<div class="section"><div class="section-head"><div class="h2">🗂️ העיצובים שלי</div>' +
      '<span class="badge">' + S.designs.length + '</span></div>' +
      (S.folders.length ? '<div class="chips" style="margin-bottom:12px">' +
        '<button class="chip ' + (filter === 'all' ? 'on' : '') + '" data-folder="all">הכל</button>' +
        S.folders.map((f) => '<button class="chip ' + (filter === f.id ? 'on' : '') + '" data-folder="' + f.id + '">' + esc(f.name) + '</button>').join('') + '</div>' : '') +
      (favDesigns.length ? '<div class="design-grid">' + favDesigns.map((d) => '<div class="design-card">' +
        '<button data-open-design="' + d.id + '" style="display:block;width:100%"><img src="' + (d.thumb || '') + '" alt=""></button>' +
        '<div class="dc-body"><b>' + esc(d.title || 'עיצוב') + '</b><span>' + DESIGN_TYPES[d.type].icon + ' ' + DESIGN_TYPES[d.type].label + '</span>' +
        '<div class="row" style="gap:4px;margin-top:6px"><button class="btn ghost xs" data-open-design="' + d.id + '">עריכה</button>' +
        '<button class="btn ghost xs" data-dl-design="' + d.id + '">⬇️</button>' +
        '<button class="del" data-del-design="' + d.id + '">🗑</button></div></div></div>').join('') + '</div>'
        : '<div class="empty">עוד אין עיצובים. בוחרים סוג למעלה ומתחילים ליצור 🎨</div>') +
      '</div>' +

      '<div class="section"><div class="card tight"><div class="row"><span style="font-size:20px">💡</span>' +
      '<div class="sp"><div class="h3">טיפ מהסטודיו</div><div class="tiny">כל עיצוב נשמר אוטומטית. אפשר לחזור ולערוך אותו בכל רגע, להוריד אותו כתמונה או לשתף.</div></div></div></div></div>' +
      '</div>';

    $('#cr-search', view).onclick = openSearch;
    $('#cr-new', view).onclick = () => this.typePicker();
    $('#cr-draw', view).onclick = () => Draw.open();
    $('#tool-palette', view).onclick = () => Palette.open();
    $('#tool-collage', view).onclick = () => this.collage();
    $('#tool-sticker', view).onclick = () => this.sticker();
    $$('[data-type]', view).forEach((b) => { b.onclick = () => Studio.openNew(b.dataset.type, 0); });
    $$('[data-folder]', view).forEach((b) => { b.onclick = () => { UI.tab.folder = b.dataset.folder; this.render(view); }; });
    $$('[data-open-design]', view).forEach((b) => { b.onclick = () => Studio.openSaved(b.dataset.openDesign); });
    $$('[data-dl-design]', view).forEach((b) => {
      b.onclick = () => {
        const d = S.designs.find((x) => x.id === b.dataset.dlDesign);
        if (!d) return;
        const prev = Studio.d; Studio.d = d;
        Studio.download();
        Studio.d = prev;
      };
    });
    $$('[data-del-design]', view).forEach((b) => {
      b.onclick = () => confirmSheet('למחוק עיצוב?', 'העיצוב יימחק מהסטודיו.', () => {
        S.designs = S.designs.filter((x) => x.id !== b.dataset.delDesign);
        save(); toast('נמחק', 'ok'); this.render(view);
      });
    });
  },

  typePicker() {
    openSheet({
      title: 'מה יוצרים?',
      body: '<div class="grid g2">' + Object.keys(DESIGN_TYPES).map((k) => {
        const t = DESIGN_TYPES[k];
        return '<button class="tile" data-pick-type="' + k + '"><i>' + t.icon + '</i><b>' + t.label + '</b><span>' + t.w + '×' + t.h + '</span></button>';
      }).join('') + '</div>',
      onMount: (root) => {
        $$('[data-pick-type]', root).forEach((b) => { b.onclick = () => { closeSheet(); Studio.openNew(b.dataset.pickType, 0); }; });
      }
    });
  },

  collage() {
    openSheet({
      title: 'קולאז׳ תמונות',
      body: '<p class="sub" style="margin-bottom:12px">בוחרים 2 עד 9 תמונות, ואנחנו מסדרים אותן בעיצוב שאפשר לערוך.</p>' +
        '<button class="btn block" id="col-pick">🖼️ בחירת תמונות</button>' +
        '<div class="field" style="margin-top:14px"><label>פריסה</label><select class="input" id="col-layout">' +
        '<option value="grid">רשת מסודרת</option><option value="hero">תמונה גדולה + קטנות</option><option value="strip">רצועה אופקית</option></select></div>',
      onMount: (root) => {
        root.querySelector('#col-pick').onclick = () => {
          pickImages((imgs) => {
            const layout = root.querySelector('#col-layout').value;
            closeSheet();
            this.makeCollage(imgs, layout);
          }, 1000);
        };
      }
    });
  },
  makeCollage(imgs, layout) {
    const d = newDesign('collage', 0);
    d.bg = { kind: 'solid', c1: '#FFFFFF', c2: '#FFFFFF', angle: 0, pattern: 'none' };
    d.elements = [];
    const pad = 24, W = d.w, H = d.h;
    const n = imgs.length;
    if (layout === 'strip' && n >= 2) {
      const gap = 12, cw = (W - pad * 2 - gap * (n - 1)) / n;
      imgs.forEach((src, i) => d.elements.push(mkImage(src, { x: pad + i * (cw + gap), y: H * 0.2, w: cw, h: H * 0.6, radius: 14 })));
    } else if (layout === 'hero' && n >= 2) {
      d.elements.push(mkImage(imgs[0], { x: pad, y: pad, w: W - pad * 2, h: H * 0.52, radius: 20 }));
      const rest = imgs.slice(1, 5);
      const gap = 12, cw = (W - pad * 2 - gap * (rest.length - 1)) / rest.length;
      rest.forEach((src, i) => d.elements.push(mkImage(src, { x: pad + i * (cw + gap), y: H * 0.52 + pad + 12, w: cw, h: H * 0.38, radius: 14 })));
    } else {
      const cols = Math.ceil(Math.sqrt(n));
      const rows = Math.ceil(n / cols);
      const gap = 12;
      const cw = (W - pad * 2 - gap * (cols - 1)) / cols;
      const ch = (H - pad * 2 - gap * (rows - 1)) / rows;
      imgs.forEach((src, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        d.elements.push(mkImage(src, { x: pad + c * (cw + gap), y: pad + r * (ch + gap), w: cw, h: ch, radius: 16 }));
      });
    }
    S.designs.unshift(d);
    S.stats.designs = (S.stats.designs || 0) + 1;
    save(); checkAchievements();
    Studio.open(d.id);
    toast('הקולאז׳ נוצר! אפשר לגרור ולסדר', 'ok', 3000);
  },
  sticker() {
    openSheet({
      title: 'מדבקה אישית',
      body: '<div class="field" style="margin-bottom:10px"><label>מה יהיה על המדבקה?</label><input class="input" id="stk-text" value="שלי" placeholder="מילה או שם"></div>' +
        '<div class="field" style="margin-bottom:14px"><label>אימוג׳י</label><div class="emoji-grid">' + EMOJI_PACK.map((e) => '<button data-stk-emoji="' + e + '">' + e + '</button>').join('') + '</div></div>' +
        '<button class="btn block" id="stk-create">יצירת מדבקה</button>',
      onMount: (root) => {
        let chosen = '💜';
        $$('[data-stk-emoji]', root).forEach((b) => {
          b.onclick = () => { chosen = b.dataset.stkEmoji; $$('[data-stk-emoji]', root).forEach((x) => x.style.background = x === b ? 'var(--brand-soft)' : ''); };
        });
        root.querySelector('#stk-create').onclick = () => {
          const text = root.querySelector('#stk-text').value.trim() || 'שלי';
          const d = newDesign('sticker', 0);
          d.bg = { kind: 'solid', c1: '#FFFFFF', c2: '#FFFFFF', angle: 0, pattern: 'none' };
          d.elements = [
            mkShape('circle', { x: 60, y: 60, w: 380, h: 380, color: '#EDE7FF' }),
            mkShape('circle', { x: 84, y: 84, w: 332, h: 332, color: '#FFFFFF', opacity: 1 }),
            mkEmoji(chosen, { x: 250, y: 195, size: 130 }),
            mkText(text, { x: 80, y: 320, w: 340, size: 54, weight: 900, color: '#8B5CF6' })
          ];
          S.designs.unshift(d);
          S.stats.designs = (S.stats.designs || 0) + 1;
          save(); checkAchievements(); closeSheet(); Studio.open(d.id);
          toast('המדבקה נוצרה 🏷️', 'ok');
        };
      }
    });
  }
};

SCREENS.create = (v) => Create.render(v);

/* ===== drawing tool ===== */
const Draw = {
  canvas: null, ctx: null, color: '#8B5CF6', size: 8, erasing: false, history: [], drawing: false,
  open() {
    openSheet({
      title: 'ציור דיגיטלי',
      body: '<div class="stage-box" style="padding:8px"><canvas id="draw-canvas" width="700" height="700" style="width:100%;max-width:420px;background:#fff;border-radius:12px;touch-action:none"></canvas></div>' +
        '<div class="row" style="margin-top:12px;gap:6px;flex-wrap:wrap">' +
        '<input type="color" id="dr-color" value="#8B5CF6">' +
        '<input type="range" id="dr-size" min="1" max="40" value="8" style="max-width:110px">' +
        '<button class="btn ghost sm" id="dr-eraser">🧽 מחיקה</button>' +
        '<button class="btn ghost sm" id="dr-undo">↩️ ביטול</button>' +
        '<button class="btn ghost sm" id="dr-clear">ניקוי</button>' +
        '</div>' +
        '<button class="btn block" style="margin-top:12px" id="dr-save">💾 שמירה בסטודיו</button>' +
        '<p class="tiny" style="text-align:center;margin-top:8px">מציירים עם האצבע או העכבר. הציור נשמר כתמונה שאפשר להוריד ולשתף.</p>',
      onMount: (root) => {
        const c = root.querySelector('#draw-canvas');
        this.canvas = c; this.ctx = c.getContext('2d');
        this.ctx.fillStyle = '#fff'; this.ctx.fillRect(0, 0, 700, 700);
        this.history = [];
        const pos = (e) => {
          const r = c.getBoundingClientRect();
          return { x: (e.clientX - r.left) * (700 / r.width), y: (e.clientY - r.top) * (700 / r.height) };
        };
        const start = (e) => {
          e.preventDefault();
          c.setPointerCapture(e.pointerId);
          this.pushHistory();
          this.drawing = true;
          const p = pos(e);
          this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y);
          this.ctx.lineCap = 'round'; this.ctx.lineJoin = 'round';
          this.ctx.lineWidth = this.size;
          this.ctx.strokeStyle = this.erasing ? '#FFFFFF' : this.color;
        };
        const move = (e) => {
          if (!this.drawing) return;
          const p = pos(e);
          this.ctx.lineTo(p.x, p.y);
          this.ctx.stroke();
        };
        const end = () => { this.drawing = false; };
        c.addEventListener('pointerdown', start);
        c.addEventListener('pointermove', move);
        c.addEventListener('pointerup', end);
        c.addEventListener('pointercancel', end);
        root.querySelector('#dr-color').oninput = (e) => { this.color = e.target.value; this.erasing = false; root.querySelector('#dr-eraser').classList.remove('on'); };
        root.querySelector('#dr-size').oninput = (e) => { this.size = Number(e.target.value); };
        root.querySelector('#dr-eraser').onclick = (e) => { this.erasing = !this.erasing; e.target.classList.toggle('on', this.erasing); };
        root.querySelector('#dr-undo').onclick = () => {
          if (!this.history.length) return;
          const img = this.history.pop();
          const tmp = new Image();
          tmp.onload = () => { this.ctx.clearRect(0, 0, 700, 700); this.ctx.drawImage(tmp, 0, 0); };
          tmp.src = img;
        };
        root.querySelector('#dr-clear').onclick = () => { this.pushHistory(); this.ctx.fillStyle = '#fff'; this.ctx.fillRect(0, 0, 700, 700); };
        root.querySelector('#dr-save').onclick = () => {
          const url = c.toDataURL('image/png');
          const d = newDesign('drawing', 0);
          d.bg = { kind: 'solid', c1: '#FFFFFF', c2: '#FFFFFF', angle: 0, pattern: 'none' };
          d.elements = [mkImage(url, { x: 0, y: 0, w: 700, h: 700, radius: 0 })];
          d.thumb = url;
          d.title = 'ציור ' + fmtShort(todayISO());
          S.designs.unshift(d);
          S.stats.designs = (S.stats.designs || 0) + 1;
          save(); checkAchievements();
          closeSheet();
          toast('הציור נשמר בסטודיו 🖌️', 'ok');
          if (UI.screen === 'create') render();
        };
      }
    });
  },
  pushHistory() {
    try {
      this.history.push(this.canvas.toDataURL('image/png'));
      if (this.history.length > 12) this.history.shift();
    } catch (e) { /* ignore */ }
  }
};

/* ===== palette generator ===== */
const Palette = {
  open() {
    openSheet({
      title: 'מחולל פלטות צבעים',
      body: '<div class="field" style="margin-bottom:12px"><label>צבע בסיס</label><input type="color" id="pal-base" value="#8B5CF6" style="width:100%;height:52px"></div>' +
        '<div class="field" style="margin-bottom:14px"><label>סוג הרמוניה</label><select class="input" id="pal-type">' +
        '<option value="analog">אנלוגי (שכנים)</option><option value="comp">משלים</option><option value="triad">שילוש</option><option value="mono">מונוכרום</option><option value="pastel">פסטלי</option></select></div>' +
        '<div id="pal-out"></div>' +
        '<button class="btn block" style="margin-top:14px" id="pal-save">💾 שמירה בסטודיו</button>',
      onMount: (root) => {
        const base = root.querySelector('#pal-base'), type = root.querySelector('#pal-type'), out = root.querySelector('#pal-out');
        let colors = [];
        const draw = () => {
          colors = this.generate(base.value, type.value);
          out.innerHTML = '<div class="palette-bar" style="height:70px">' + colors.map((c) => '<i style="background:' + c + '"></i>').join('') + '</div>' +
            '<div class="grid g5" style="grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px">' +
            colors.map((c) => '<button data-copy="' + c + '" style="font-size:10px;font-weight:800;color:var(--ink-2)">' + c + '</button>').join('') + '</div>' +
            '<p class="tiny" style="text-align:center;margin-top:8px">לחיצה על צבע מעתיקה את הקוד</p>';
          $$('[data-copy]', out).forEach((b) => {
            b.onclick = () => {
              const v = b.dataset.copy;
              if (navigator.clipboard) navigator.clipboard.writeText(v).then(() => toast('הועתק: ' + v, 'ok', 1600)).catch(() => toast(v, 'info'));
              else toast(v, 'info');
            };
          });
        };
        base.oninput = draw; type.onchange = draw; draw();
        root.querySelector('#pal-save').onclick = () => {
          const d = newDesign('palette', 0);
          d.title = 'פלטה · ' + type.options[type.selectedIndex].text;
          d.bg = { kind: 'solid', c1: '#FBF8FF', c2: '#FBF8FF', angle: 0, pattern: 'none' };
          d.elements = [];
          colors.forEach((c, i) => {
            d.elements.push(mkShape('rect', { x: 0, y: i * (d.h / colors.length), w: d.w, h: d.h / colors.length, color: c, opacity: 1 }));
            d.elements.push(mkText(c.toUpperCase(), { x: 40, y: i * (d.h / colors.length) + (d.h / colors.length) / 2 - 18, w: 240, size: 26, weight: 700, color: this.textColor(c), align: 'right' }));
          });
          S.designs.unshift(d);
          S.stats.designs = (S.stats.designs || 0) + 1;
          save(); checkAchievements(); closeSheet();
          toast('הפלטה נשמרה בסטודיו 🎨', 'ok');
          if (UI.screen === 'create') render();
        };
      }
    });
  },
  textColor(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 150 ? '#2C2540' : '#FFFFFF';
  },
  generate(base, type) {
    const hsl = this.toHSL(base);
    const rot = (d) => (hsl.h + d + 360) % 360;
    const mk = (h, s, l) => this.fromHSL(h, Math.max(0, Math.min(100, s)), Math.max(0, Math.min(100, l)));
    if (type === 'analog') return [mk(rot(-40), hsl.s, hsl.l), mk(rot(-20), hsl.s, hsl.l), base, mk(rot(20), hsl.s, hsl.l), mk(rot(40), hsl.s, hsl.l)];
    if (type === 'comp') return [mk(rot(0), hsl.s, hsl.l), mk(rot(0), hsl.s * 0.6, hsl.l * 1.25), mk(rot(180), hsl.s, hsl.l), mk(rot(180), hsl.s * 0.7, hsl.l * 1.2), mk(rot(0), hsl.s * 0.4, hsl.l * 0.6)];
    if (type === 'triad') return [base, mk(rot(120), hsl.s, hsl.l), mk(rot(240), hsl.s, hsl.l), mk(rot(0), hsl.s * 0.5, hsl.l * 1.3), mk(rot(0), hsl.s, hsl.l * 0.6)];
    if (type === 'mono') return [mk(hsl.h, hsl.s, hsl.l * 0.5), mk(hsl.h, hsl.s, hsl.l * 0.75), base, mk(hsl.h, hsl.s * 0.8, Math.min(92, hsl.l * 1.2)), mk(hsl.h, hsl.s * 0.5, Math.min(96, hsl.l * 1.45))];
    return [mk(rot(0), Math.min(70, hsl.s * 0.7), 88), mk(rot(30), Math.min(70, hsl.s * 0.8), 82), mk(rot(0), hsl.s, hsl.l), mk(rot(180), Math.min(60, hsl.s * 0.6), 85), mk(rot(-30), Math.min(70, hsl.s * 0.75), 78)];
  },
  toHSL(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const r = parseInt(c.substr(0, 2), 16) / 255, g = parseInt(c.substr(2, 2), 16) / 255, b = parseInt(c.substr(4, 2), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h, s: s * 100, l: l * 100 };
  },
  fromHSL(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const to = (x) => Math.round(255 * x).toString(16).padStart(2, '0');
    return '#' + to(f(0)) + to(f(8)) + to(f(4));
  }
};
