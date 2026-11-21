const fs = require('fs');
const path = require('path');

const css = fs.readFileSync('src/styles.css', 'utf8');
const files = [
  'core.js', 'data-activities.js', 'screen-auth.js', 'screen-home.js',
  'screen-organizer.js', 'screen-organizer-b.js', 'screen-next.js',
  'screen-create.js', 'screen-profile.js', 'app.js'
];
const js = files.map((f) => '/* ===== ' + f + ' ===== */\n' + fs.readFileSync(path.join('src', f), 'utf8')).join('\n\n');

const fontFamilies = 'Heebo:wght@400;600;700;800;900|Rubik:wght@400;600;700;800;900|Assistant:wght@400;600;700;800|Frank+Ruhl+Libre:wght@400;700;900|Suez+One|Secular+One';

const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>MIXIT · כל העולם שלך באפליקציה אחת</title>
<meta name="description" content="MIXIT — ארגון אישי, מחולל פעילויות וסטודיו עיצוב דיגיטלי במקום אחד. יומן, משימות, תקציב, רעיונות לפעילויות, כרזות, הזמנות וקולאז׳ים.">
<meta name="theme-color" content="#8B5CF6">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="MIXIT">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MIXIT">
<meta property="og:title" content="MIXIT · כל העולם שלך באפליקציה אחת">
<meta property="og:description" content="ארגון, רעיונות וסטודיו יצירה — שלושה עולמות באפליקציה אחת.">
<meta property="og:locale" content="he_IL">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌈</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap" rel="stylesheet">
<style>
${css}
</style>
</head>
<body data-bg="aurora">
<div id="app"></div>
<div id="boot" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;background:linear-gradient(160deg,#FBF8FF,#F1F7FF);font-family:Heebo,system-ui,sans-serif;color:#5B5470;z-index:999">
<div style="font-size:44px">🌈</div>
<div style="font-weight:900;font-size:20px;color:#2C2540">MIXIT</div>
<div style="font-size:13.5px">טוען את העולמות שלך…</div>
</div>
<script>window.addEventListener('error',function(e){var b=document.getElementById('boot');if(b){b.style.color='#C2334D';b.innerHTML='<div style="font-size:34px">⚠️</div><div>שגיאה בטעינה: '+(e.message||'unknown')+'</div>';}});</script>
<noscript><div style="padding:40px;text-align:center;font-family:sans-serif">MIXIT דורש JavaScript. הפעילו אותו בדפדפן ונסו שוב.</div></noscript>
<script>
${js}
</script>
</body>
</html>
`;

fs.writeFileSync('index.html', html);
const kb = (html.length / 1024).toFixed(1);
console.log('built index.html · ' + kb + 'KB · ' + files.length + ' modules');
console.log('activities: ' + (js.match(/\['a\d{2}'/g) || []).length);
