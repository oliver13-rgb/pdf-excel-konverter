// Erzeugt realistische Handy-Screenshots als Collage-Material (Augen / Mund / Ohr)
const fs=require('fs'), path=require('path');
const OUT=path.join(__dirname,'ausschnitte');
const font=`-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif`;

// --- fotoähnliche Motive (SVG mit Verläufen, Unschärfe und Filmkorn) ---
let uid=0;
function photo(kind,w=300,h=400){
  const id='p'+(uid++);
  const grain=`<filter id="g${id}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${uid}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter><filter id="b${id}"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="bb${id}"><feGaussianBlur stdDeviation="9"/></filter>`;
  const S={
    sunset:`<linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1f4f"/><stop offset=".45" stop-color="#e2557a"/><stop offset=".62" stop-color="#ffb35c"/><stop offset=".63" stop-color="#3a5d86"/><stop offset="1" stop-color="#0f2236"/></linearGradient>
      <rect width="300" height="400" fill="url(#s${id})"/><circle cx="150" cy="245" r="38" fill="#ffe2a0" filter="url(#bb${id})"/><circle cx="150" cy="248" r="26" fill="#fff3cf"/>
      <g filter="url(#b${id})" fill="#ffd38a" opacity=".7"><rect x="105" y="262" width="90" height="4"/><rect x="118" y="280" width="64" height="3"/><rect x="128" y="300" width="44" height="3"/><rect x="138" y="322" width="24" height="2"/></g>
      <path d="M0 400 L0 360 Q60 345 120 368 T300 350 L300 400Z" fill="#0b1520"/>`,
    mountain:`<linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb4e6"/><stop offset=".5" stop-color="#cfe4f4"/><stop offset="1" stop-color="#2f5d4e"/></linearGradient>
      <rect width="300" height="400" fill="url(#s${id})"/><path d="M-10 250 L70 120 L110 170 L170 70 L250 190 L310 140 L310 260Z" fill="#5d6f85"/><path d="M150 100 L170 70 L192 104 L178 98 L166 110Z M62 134 L70 120 L80 135Z" fill="#fff"/>
      <path d="M-10 250 L70 160 L130 220 L200 150 L310 230 L310 270 L-10 270Z" fill="#3f5a52" filter="url(#b${id})"/>
      <rect y="262" width="300" height="140" fill="#2c6e78"/><path d="M-10 262 L70 340 L110 300 L170 380 L250 290 L310 330 L310 262Z" fill="#4a6a80" opacity=".45" filter="url(#b${id})"/>
      <path d="M0 400 L0 330 L30 300 L45 330 L60 290 L80 340 L100 400Z M300 400 L300 320 L275 280 L260 330 L240 300 L225 400Z" fill="#14281f"/>`,
    city:`<linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0f2a"/><stop offset=".7" stop-color="#3b2366"/><stop offset="1" stop-color="#e06aa0"/></linearGradient>
      <rect width="300" height="400" fill="url(#s${id})"/>
      ${Array.from({length:14},(_,i)=>{const x=i*22-6,hh=120+((i*53)%170);return `<rect x="${x}" y="${400-hh}" width="20" height="${hh}" fill="#0d1022"/>`+Array.from({length:Math.floor(hh/14)},(_,j)=>((i*7+j*3)%4?`<rect x="${x+4+((j%2)*7)}" y="${400-hh+6+j*14}" width="4" height="5" fill="#ffd27a" opacity="${.5+((i+j)%3)*.2}"/>`:'')).join('')}).join('')}
      <g filter="url(#bb${id})" opacity=".8"><circle cx="60" cy="380" r="18" fill="#ff4f8b"/><circle cx="210" cy="372" r="22" fill="#4fc3ff"/><circle cx="260" cy="390" r="14" fill="#ffb84f"/></g>`,
    concert:`<rect width="300" height="400" fill="#07040f"/>
      <g opacity=".55" filter="url(#b${id})"><path d="M150 0 L40 400 L90 400Z" fill="#7a3cff"/><path d="M150 0 L210 400 L260 400Z" fill="#ff3ca8"/><path d="M60 0 L150 400 L190 400Z" fill="#3cc9ff"/><path d="M240 0 L120 400 L150 400Z" fill="#7a3cff"/></g>
      <g filter="url(#bb${id})"><circle cx="150" cy="10" r="30" fill="#fff"/><circle cx="60" cy="0" r="20" fill="#bde"/><circle cx="240" cy="0" r="20" fill="#fbd"/></g>
      ${Array.from({length:22},(_,i)=>`<circle cx="${i*15-5}" cy="${352+(i%3)*9}" r="${15+(i%4)}" fill="#020106"/>`).join('')}
      <rect y="365" width="300" height="40" fill="#020106"/>
      <rect x="196" y="290" width="26" height="46" rx="4" fill="#020106"/><rect x="199" y="294" width="20" height="36" rx="2" fill="#9fd4ff" opacity=".9"/><rect x="204" y="330" width="9" height="40" fill="#020106"/>`,
    food:`<radialGradient id="s${id}" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#cfa982"/><stop offset="1" stop-color="#6e4a33"/></radialGradient>
      <rect width="300" height="400" fill="url(#s${id})"/><ellipse cx="150" cy="215" rx="125" ry="118" fill="#f4f1ea"/><ellipse cx="150" cy="210" rx="100" ry="94" fill="#e8dfcf"/>
      <g filter="url(#b${id})"><ellipse cx="150" cy="210" rx="92" ry="86" fill="#efe2b7"/></g>
      <g><circle cx="110" cy="180" r="24" fill="#e85d4a"/><circle cx="112" cy="178" r="16" fill="#f07a62"/><path d="M160 150 q30 10 40 40 q-30 -6 -40 -40z" fill="#5fae4f"/><path d="M180 230 q25 -15 40 5 q-20 18 -40 -5z" fill="#88c46a"/>
      <ellipse cx="140" cy="245" rx="34" ry="18" fill="#f6c25a"/><ellipse cx="140" cy="245" rx="14" ry="8" fill="#f39b2b"/><circle cx="190" cy="190" r="10" fill="#3a2a22"/><circle cx="205" cy="205" r="7" fill="#3a2a22"/><circle cx="100" cy="230" r="9" fill="#f4e5c3"/></g>
      <rect x="250" y="40" width="10" height="200" rx="5" fill="#c8c8c8" transform="rotate(18 255 140)"/>`,
    beach:`<linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ab8f0"/><stop offset=".42" stop-color="#bde6fb"/><stop offset=".43" stop-color="#1b8fb5"/><stop offset=".62" stop-color="#40c5c9"/><stop offset=".63" stop-color="#e9f8f3"/><stop offset=".68" stop-color="#ecd9b0"/><stop offset="1" stop-color="#d9bd8a"/></linearGradient>
      <rect width="300" height="400" fill="url(#s${id})"/><g filter="url(#bb${id})" fill="#fff" opacity=".8"><ellipse cx="70" cy="60" rx="50" ry="14"/><ellipse cx="220" cy="95" rx="60" ry="12"/></g>
      <path d="M0 252 Q75 244 150 254 T300 250" stroke="#fff" stroke-width="5" fill="none" opacity=".8" filter="url(#b${id})"/>
      <path d="M232 400 Q228 300 246 230" stroke="#6b4b2f" stroke-width="9" fill="none"/><g fill="#2d7a3a"><path d="M246 230 q-50 -10 -70 20 q40 -30 70 -20z"/><path d="M246 230 q40 -30 70 0 q-40 -16 -70 0z"/><path d="M246 230 q-10 -45 30 -60 q-20 25 -30 60z"/><path d="M246 230 q-40 -30 -60 -10 q30 -5 60 10z"/></g>
      <rect x="60" y="320" width="70" height="26" rx="3" fill="#ff6b6b" transform="rotate(-8 95 333)"/><rect x="60" y="320" width="70" height="8" fill="#fff" opacity=".7" transform="rotate(-8 95 333)"/>`,
    forest:`<linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f3d8"/><stop offset=".5" stop-color="#8ab673"/><stop offset="1" stop-color="#1f3a22"/></linearGradient>
      <rect width="300" height="400" fill="url(#s${id})"/>
      <g opacity=".5" filter="url(#b${id})"><path d="M120 0 L60 400 L140 400Z" fill="#fffbe0"/><path d="M190 0 L170 400 L230 400Z" fill="#fffbe0"/></g>
      ${[20,70,130,210,265].map((x,i)=>`<rect x="${x}" y="0" width="${18+i%3*8}" height="400" fill="#2b2014" opacity="${.75+i%2*.2}"/>`).join('')}
      <path d="M0 400 L0 340 Q150 310 300 345 L300 400Z" fill="#203c1f"/><path d="M110 400 Q150 330 180 400Z" fill="#b6935f"/>`,
    gym:`<linearGradient id="s${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#191919"/><stop offset="1" stop-color="#3a3a3a"/></linearGradient>
      <rect width="300" height="400" fill="url(#s${id})"/><rect x="20" y="40" width="260" height="10" rx="5" fill="#ff2e63" filter="url(#b${id})"/><rect x="20" y="40" width="260" height="4" rx="2" fill="#ffd0dc"/>
      <rect x="0" y="300" width="300" height="100" fill="#111"/>
      <rect x="40" y="230" width="220" height="10" rx="4" fill="#b8b8b8"/><rect x="30" y="190" width="22" height="92" rx="5" fill="#222"/><rect x="56" y="200" width="16" height="72" rx="4" fill="#333"/><rect x="248" y="190" width="22" height="92" rx="5" fill="#222"/><rect x="228" y="200" width="16" height="72" rx="4" fill="#333"/>
      <circle cx="150" cy="120" r="30" fill="#0f0f0f"/><path d="M90 300 Q100 170 150 160 Q200 170 210 300Z" fill="#0f0f0f"/>`,
    sky:`<linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2066c8"/><stop offset="1" stop-color="#a8d4ff"/></linearGradient>
      <rect width="300" height="400" fill="url(#s${id})"/><g filter="url(#bb${id})" fill="#fff"><ellipse cx="90" cy="150" rx="80" ry="40"/><ellipse cx="150" cy="130" rx="60" ry="45"/><ellipse cx="220" cy="170" rx="80" ry="38"/><ellipse cx="200" cy="300" rx="90" ry="30" opacity=".8"/></g>
      <path d="M40 60 L260 20" stroke="#fff" stroke-width="2" opacity=".8"/><path d="M236 24 l18 -6 l4 4 l-18 6z" fill="#e8eef5"/>`,
    skate:`<linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0a46a"/><stop offset=".55" stop-color="#f7d6a9"/><stop offset=".56" stop-color="#9a9a9a"/><stop offset="1" stop-color="#5e5e5e"/></linearGradient>
      <rect width="300" height="400" fill="url(#s${id})"/><path d="M0 222 Q150 160 300 222 L300 260 L0 260Z" fill="#b5b5b5"/>
      <g transform="rotate(-14 160 180)"><circle cx="160" cy="110" r="16" fill="#1c1c1c"/><path d="M146 126 L174 126 L180 190 L140 190Z" fill="#1c1c1c"/><path d="M140 190 L118 236 M180 190 L200 230 M146 138 L110 160 M174 138 L210 120" stroke="#1c1c1c" stroke-width="12" stroke-linecap="round"/><rect x="96" y="238" width="120" height="9" rx="4" fill="#d6322c"/><circle cx="114" cy="252" r="5" fill="#eee"/><circle cx="198" cy="252" r="5" fill="#eee"/></g>`,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" width="${w}" height="${h}" style="display:block"><defs>${grain}</defs>${S[kind]}<rect width="300" height="400" filter="url(#g${id})" fill="#888"/></svg>`;
}

// --- gemeinsame Bausteine ---
const statusbar=(dark,time='23:47',bat=12)=>`<div style="height:47px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 26px 8px 34px;color:${dark?'#fff':'#000'};font-weight:600;font-size:16px">
  <span>${time}</span><span style="display:flex;gap:6px;align-items:center">
  <svg width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5" width="3" height="7" rx="1" fill="currentColor"/><rect x="10" y="2" width="3" height="10" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" opacity=".35"/></svg>
  <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 L5.5 8.6 A3.6 3.6 0 0 1 10.5 8.6Z M3.6 6.6 A6.3 6.3 0 0 1 12.4 6.6 L11.2 7.9 A4.6 4.6 0 0 0 4.8 7.9Z M1.6 4.5 A9.2 9.2 0 0 1 14.4 4.5 L13.2 5.8 A7.5 7.5 0 0 0 2.8 5.8Z" fill="currentColor"/></svg>
  <span style="display:inline-flex;align-items:center"><span style="width:24px;height:12px;border:1.5px solid currentColor;border-radius:4px;opacity:.9;padding:1.5px;display:inline-flex"><span style="width:${bat}%;background:${bat<20?'#ff3b30':'currentColor'};border-radius:1.5px"></span></span><span style="width:2px;height:5px;background:currentColor;opacity:.5;margin-left:1px;border-radius:0 1px 1px 0"></span></span></span></div>`;
const homebar=dark=>`<div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:134px;height:5px;border-radius:3px;background:${dark?'#fff':'#000'}"></div>`;
const screen=(body,bg,dark)=>`<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0;padding:0}body{width:390px;height:844px;overflow:hidden;background:${bg};font-family:${font};position:relative;-webkit-font-smoothing:antialiased}</style></head><body>${statusbar(dark)}${body}${homebar(dark)}</body></html>`;
const ico={
  heart:(c='#fff',f='none')=>`<svg width="32" height="32" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.2 0 3.6 1.3 5.3 3.2 1.7-1.9 3.1-3.2 5.3-3.2 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill="${f}" stroke="${c}" stroke-width="1.8"/></svg>`,
  comment:`<svg width="32" height="32" viewBox="0 0 24 24"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.6z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  share:`<svg width="30" height="30" viewBox="0 0 24 24"><path d="M21.5 3 2.8 10.2l7.3 2.9 2.9 7.4L21.5 3z M10.1 13.1 21.5 3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  save:`<svg width="28" height="28" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-5-6 5z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  dots:c=>`<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8" fill="${c}"/><circle cx="12" cy="12" r="1.8" fill="${c}"/><circle cx="19" cy="12" r="1.8" fill="${c}"/></svg>`,
  play:(c,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="${c}"/></svg>`,
  pause:(c,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="6" y="4.5" width="4" height="15" rx="1" fill="${c}"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="${c}"/></svg>`,
  mic:c=>`<svg width="26" height="26" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="${c}"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`,
  ticks:`<svg width="18" height="11" viewBox="0 0 18 11"><path d="M1 6l3 3 6-7M7 8.5l1 1 7-8" stroke="#34b7f1" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
const avatar=(a,b,letter,s=38)=>`<div style="width:${s}px;height:${s}px;border-radius:50%;background:linear-gradient(135deg,${a},${b});display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${s*.42}px;flex:none">${letter}</div>`;

// =============== AUGEN 1: Kurzvideo-Feed (Vollbild) ===============
const augenReel=screen(`
<div style="position:absolute;inset:0;z-index:-1">${photo('concert',390,844)}</div>
<div style="position:absolute;inset:0;z-index:-1;background:linear-gradient(transparent 55%,rgba(0,0,0,.65))"></div>
<div style="display:flex;justify-content:center;gap:22px;color:#fff;font-size:17px;font-weight:600;margin-top:8px;text-shadow:0 1px 3px rgba(0,0,0,.5)"><span style="opacity:.7">Folge ich</span><span style="border-bottom:2.5px solid #fff;padding-bottom:4px">Für dich</span></div>
<div style="position:absolute;right:12px;bottom:150px;display:flex;flex-direction:column;align-items:center;gap:18px;color:#fff;font-size:13px;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,.6)">
  <div style="position:relative;margin-bottom:6px">${avatar('#ff7a59','#ff2d55','M',46)}<div style="position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);width:20px;height:20px;border-radius:50%;background:#ff2d55;color:#fff;font-size:16px;line-height:19px;text-align:center">+</div></div>
  <div style="text-align:center">${ico.heart('#ff2d55','#ff2d55')}<div>1,2 Mio.</div></div>
  <div style="text-align:center">${ico.comment}<div>8.431</div></div>
  <div style="text-align:center">${ico.save}<div>96 Tsd.</div></div>
  <div style="text-align:center">${ico.share}<div>Teilen</div></div>
</div>
<div style="position:absolute;left:14px;right:84px;bottom:92px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.6)">
  <div style="font-weight:700;font-size:16px;margin-bottom:6px">@mila.vibes</div>
  <div style="font-size:14.5px;line-height:1.35">bestes konzert meines lebens 😭🔥 wer war noch da?? <b>#konzert #fyp #nachtleben</b></div>
  <div style="font-size:13.5px;margin-top:8px;display:flex;gap:6px;align-items:center">♫ Originalton – mila.vibes</div>
</div>
<div style="position:absolute;left:0;right:0;bottom:78px;height:3px;background:rgba(255,255,255,.3)"><div style="width:63%;height:100%;background:#fff"></div></div>
<div style="position:absolute;left:0;right:0;bottom:0;height:78px;background:#000;display:flex;justify-content:space-around;align-items:flex-start;padding-top:12px;color:#fff;font-size:11px">
  <span style="text-align:center">⌂<br>Start</span><span style="text-align:center;opacity:.7">⌕<br>Entdecken</span><span style="background:#fff;color:#000;border-radius:9px;padding:2px 13px;font-size:20px;font-weight:700;margin-top:2px">+</span><span style="text-align:center;opacity:.7">✉︎<br>Postfach</span><span style="text-align:center;opacity:.7">◯<br>Profil</span>
</div>`,'#000',true);

// =============== AUGEN 2: Entdecken-Raster ===============
const kinds=['sunset','city','mountain','food','beach','gym','forest','sky','skate','concert','sunset','city'];
const views=['2,1 Mio.','847 Tsd.','5,6 Mio.','312 Tsd.','1,9 Mio.','73 Tsd.','4,4 Mio.','990 Tsd.','2,7 Mio.','12 Mio.','658 Tsd.','3,1 Mio.'];
const augenGrid=screen(`
<div style="padding:6px 14px 10px"><div style="background:#efeff0;border-radius:11px;height:38px;display:flex;align-items:center;gap:8px;padding:0 12px;color:#8a8a8e;font-size:16px">⌕ Suchen</div></div>
<div style="display:flex;gap:14px;padding:0 14px 12px;overflow:hidden">${[['#feda75','#d62976','S'],['#4facfe','#00f2fe','J'],['#43e97b','#38f9d7','L'],['#fa709a','#fee140','N'],['#a18cd1','#fbc2eb','E'],['#f6d365','#fda085','T']].map(([a,b,l],i)=>`<div style="text-align:center;font-size:11.5px;color:#222"><div style="padding:3px;border-radius:50%;background:${i<4?'conic-gradient(#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)':'#ccc'}"><div style="padding:2.5px;background:#fff;border-radius:50%">${avatar(a,b,l,56)}</div></div><div style="margin-top:4px">${['story','jonas_','lea.mrz','n1ck','emma','tim.k'][i]}</div></div>`).join('')}</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px">${kinds.map((k,i)=>`<div style="position:relative;height:172px;overflow:hidden">${photo(k,130,172)}<div style="position:absolute;left:6px;bottom:5px;color:#fff;font-size:12.5px;font-weight:600;display:flex;align-items:center;gap:3px;text-shadow:0 1px 3px rgba(0,0,0,.7)">${ico.play('#fff',13)}${views[i]}</div></div>`).join('')}</div>
<div style="position:absolute;left:0;right:0;bottom:0;height:80px;background:#fff;border-top:1px solid #e3e3e3;display:flex;justify-content:space-around;padding-top:14px;font-size:24px;color:#111"><span>⌂</span><span style="font-weight:700">⌕</span><span>⊕</span><span>▷</span><span>◯</span></div>`,'#fff',false);

// =============== MUND 1: Chat ===============
const msgs=[['in','bist du noch wach','23:12'],['out','jaa','23:12'],['in','hast du das video gesehen 😂😂😂','23:13'],['out','welches','23:13'],['in','schick ich dir gleich','23:13'],['out','ok','23:14'],['in','💀💀','23:20'],['out','lol','23:21'],['in','morgen schule?','23:31'],['out','keine ahnung','23:31'],['out','gute nacht','23:45'],['in','👍','23:46']];
const mundChat=screen(`
<div style="height:58px;display:flex;align-items:center;gap:10px;padding:0 12px;border-bottom:1px solid #d9d9d9;background:#f6f6f6">
  <span style="color:#007aff;font-size:30px;font-weight:300;margin-top:-4px">‹</span><span style="color:#007aff;font-size:16px;margin-left:-6px">12</span>
  ${avatar('#7f7fd5','#86a8e7','J',38)}<div style="flex:1"><div style="font-weight:600;font-size:16.5px">Jonas</div><div style="font-size:12.5px;color:#8e8e93">online</div></div>
  <span style="color:#007aff;font-size:20px">✆</span></div>
<div style="padding:10px 10px 0;background:#efe7de;height:418px;display:flex;flex-direction:column;gap:5px;overflow:hidden;justify-content:flex-end">
${msgs.map(([d,t,tm])=>`<div style="align-self:${d=='out'?'flex-end':'flex-start'};max-width:75%;background:${d=='out'?'#dcf8c6':'#fff'};border-radius:${d=='out'?'14px 14px 4px 14px':'14px 14px 14px 4px'};padding:6px 10px 5px;box-shadow:0 1px .5px rgba(0,0,0,.13);font-size:${/^[^a-z]+$/i.test(t)&&t.length<6?'30px':'16px'};line-height:1.3;display:flex;gap:8px;align-items:flex-end">${t}<span style="font-size:11px;color:#8e8e93;white-space:nowrap;display:flex;gap:2px;align-items:center">${tm}${d=='out'?ico.ticks:''}</span></div>`).join('')}
  <div style="align-self:flex-start;background:#fff;border-radius:14px;padding:10px 14px;display:flex;gap:4px;margin-bottom:8px">${[0,1,2].map(i=>`<span style="width:7px;height:7px;border-radius:50%;background:#9a9a9a;opacity:${.4+i*.25}"></span>`).join('')}</div>
</div>
<div style="background:#f6f6f6;padding:6px 8px;display:flex;align-items:center;gap:8px;border-top:1px solid #d9d9d9"><span style="font-size:26px;color:#007aff">+</span><div style="flex:1;background:#fff;border:1px solid #d1d1d6;border-radius:18px;height:34px;padding:0 12px;display:flex;align-items:center;font-size:16px">ich auc<span style="width:2px;height:20px;background:#007aff;margin-left:1px"></span></div>${ico.mic('#007aff')}</div>
<div style="background:#d1d3d9;padding:6px 3px 40px">
  <div style="display:flex;justify-content:space-around;font-size:15px;color:#333;padding:4px 0 8px">${['ich','auch','auch 😂'].map(s=>`<span>${s}</span>`).join('<span style="color:#aaa">|</span>')}</div>
  ${['qwertzuiopü','asdfghjklöä','⇧yxcvbnm⌫'].map((r,ri)=>`<div style="display:flex;justify-content:center;gap:5px;margin-bottom:10px">${[...r].map(k=>`<div style="background:${'⇧⌫'.includes(k)?'#abb0ba':'#fff'};border-radius:5px;box-shadow:0 1px 0 #888;width:${'⇧⌫'.includes(k)?42:31}px;height:42px;display:flex;align-items:center;justify-content:center;font-size:${'⇧⌫'.includes(k)?18:21}px;color:#000">${k}</div>`).join('')}</div>`).join('')}
  <div style="display:flex;gap:5px;justify-content:center"><div style="background:#abb0ba;border-radius:5px;width:86px;height:42px;display:flex;align-items:center;justify-content:center;font-size:16px">123 😊</div><div style="background:#fff;border-radius:5px;width:190px;height:42px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 1px 0 #888">Leerzeichen</div><div style="background:#abb0ba;border-radius:5px;width:86px;height:42px;display:flex;align-items:center;justify-content:center;font-size:16px">Senden</div></div>
</div>`,'#f6f6f6',false);

// =============== MUND 2: Emoji-Tastatur + Reaktionen ===============
const em='😂😭🔥💀❤️🙏😍🥺👀😅🤣✨😊💯🫶😬🤡😴🙄😮‍💨🥲👍👋😎🤔😳💔🫠😤🤯🥳😇🙈💬📱🎧🔔📸🎮🎵';
const mundEmoji=screen(`
<div style="padding:14px 16px 0;background:#000;height:452px;display:flex;flex-direction:column;justify-content:flex-end;gap:10px">
  <div style="align-self:flex-start;background:#262628;color:#fff;border-radius:20px;padding:10px 14px;font-size:16px;position:relative">alles gut bei dir?<div style="position:absolute;right:-6px;bottom:-14px;background:#333;border:2px solid #000;border-radius:14px;padding:1px 6px;font-size:15px">😂</div></div>
  <div style="align-self:flex-end;background:linear-gradient(135deg,#7b2ff7,#f107a3);color:#fff;border-radius:20px;padding:9px 14px;font-size:38px;margin-top:10px">😂😂😂</div>
  <div style="align-self:flex-end;background:linear-gradient(135deg,#7b2ff7,#f107a3);color:#fff;border-radius:20px;padding:10px 14px;font-size:16px">jaja alles gut 👍</div>
  <div style="align-self:flex-start;background:#262628;color:#fff;border-radius:20px;padding:9px 14px;font-size:38px">🫶</div>
  <div style="align-self:flex-end;color:#8e8e93;font-size:12px;margin:-4px 4px 10px">Gesehen</div>
  <div style="display:flex;align-self:center;gap:8px;background:#262628;border-radius:30px;padding:8px 14px;font-size:30px;margin-bottom:14px">❤️ 😂 😮 😢 😡 👍</div>
</div>
<div style="background:#2b2b2d;height:345px;padding:8px 10px">
  <div style="color:#8e8e93;font-size:12px;font-weight:600;margin:2px 4px 8px">HÄUFIG BENUTZT</div>
  <div style="display:grid;grid-template-columns:repeat(8,1fr);row-gap:10px;font-size:31px;text-align:center">${[...new Intl.Segmenter().segment(em)].map(s=>`<span>${s.segment}</span>`).join('')}</div>
  <div style="display:flex;justify-content:space-around;color:#8e8e93;font-size:20px;margin-top:16px"><span style="color:#fff">🕘</span><span>☺︎</span><span>🐻</span><span>🍔</span><span>⚽︎</span><span>🚗</span><span>💡</span><span>♡</span><span>⚑</span></div>
</div>`,'#000',true);

// =============== OHR 1: Sprachnachrichten ===============
function wave(seed,n,played,col,pcol){let s='',x=seed;for(let i=0;i<n;i++){x=(x*9301+49297)%233280;const h=4+Math.round((x/233280)*22*(0.5+0.5*Math.sin(i/3)));s+=`<rect x="${i*4}" y="${15-h/2}" width="2.4" height="${h}" rx="1.2" fill="${i/n<played?pcol:col}"/>`;}return `<svg width="${n*4}" height="30">${s}</svg>`;}
const vm=(d,dur,played,tm,seed,speed)=>`<div style="align-self:${d=='out'?'flex-end':'flex-start'};background:${d=='out'?'#dcf8c6':'#fff'};border-radius:${d=='out'?'14px 14px 4px 14px':'14px 14px 14px 4px'};padding:8px 10px 6px;box-shadow:0 1px .5px rgba(0,0,0,.13);width:290px">
  <div style="display:flex;align-items:center;gap:8px">${d=='in'?avatar('#7f7fd5','#86a8e7','J',40):''}<div style="color:#7a7a7a">${played>0&&played<1?ico.pause('#7a7a7a',26):ico.play('#7a7a7a',26)}</div>
  <div style="position:relative">${wave(seed,40,played,'#b4b4b4','#34b7f1')}${played>0?`<div style="position:absolute;top:8px;left:${played*160-6}px;width:13px;height:13px;border-radius:50%;background:#34b7f1"></div>`:''}</div>${speed?`<span style="background:#7a7a7a;color:#fff;border-radius:10px;font-size:11px;padding:1px 6px;font-weight:600">2×</span>`:''}</div>
  <div style="display:flex;justify-content:space-between;font-size:11px;color:#8e8e93;margin:2px 0 0 ${d=='in'?82:34}px"><span>${dur}</span><span style="display:flex;gap:2px;align-items:center">${tm}${d=='out'?ico.ticks:''}</span></div></div>`;
const ohrVoice=screen(`
<div style="height:58px;display:flex;align-items:center;gap:10px;padding:0 12px;border-bottom:1px solid #d9d9d9;background:#f6f6f6">
  <span style="color:#007aff;font-size:30px;font-weight:300;margin-top:-4px">‹</span>${avatar('#7f7fd5','#86a8e7','J',38)}<div style="flex:1"><div style="font-weight:600;font-size:16.5px">Jonas</div><div style="font-size:12.5px;color:#8e8e93">nimmt Sprachnachricht auf …</div></div></div>
<div style="padding:12px 10px;background:#efe7de;height:648px;display:flex;flex-direction:column;gap:8px;justify-content:flex-end">
  <div style="align-self:center;background:#e1f3fb;color:#555;font-size:12px;border-radius:8px;padding:4px 10px;margin-bottom:4px">HEUTE</div>
  ${vm('in','4:52',1,'21:03',7)}${vm('in','2:13',1,'21:09',42,1)}${vm('out','0:47',0,'21:15',13)}${vm('in','6:31',.38,'22:40',99,1)}${vm('in','3:05',0,'22:47',5)}${vm('in','1:58',0,'23:02',77)}
</div>
<div style="background:#f6f6f6;padding:8px 10px;display:flex;align-items:center;gap:10px;border-top:1px solid #d9d9d9"><div style="flex:1;color:#ff3b30;font-size:16px;display:flex;align-items:center;gap:8px"><span style="width:10px;height:10px;border-radius:50%;background:#ff3b30"></span>0:14 &nbsp;<span style="color:#8e8e93">‹ Zum Abbrechen wischen</span></div><div style="background:#007aff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center">${ico.mic('#fff')}</div></div>`,'#f6f6f6',false);

// =============== OHR 2: Sperrbildschirm mit Musik + Benachrichtigungen ===============
const notif=(app,col,title,text,time)=>`<div style="background:rgba(245,245,245,.72);backdrop-filter:blur(20px);border-radius:20px;padding:12px 14px;display:flex;gap:11px;align-items:flex-start;margin:0 10px 8px"><div style="width:36px;height:36px;border-radius:9px;background:${col};flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-size:19px">${app}</div><div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;font-size:15px"><b>${title}</b><span style="color:#6e6e73;font-size:13px">${time}</span></div><div style="font-size:14.5px;color:#1c1c1e;line-height:1.3">${text}</div></div></div>`;
const ohrLock=screen(`
<div style="position:absolute;inset:0;z-index:-1;filter:saturate(1.2)">${photo('city',390,844)}</div>
<div style="position:absolute;inset:0;z-index:-1;background:rgba(0,0,0,.18)"></div>
<div style="text-align:center;color:#fff;margin-top:6px"><div style="font-size:18px;font-weight:600">Montag, 23. November</div><div style="font-size:92px;font-weight:600;line-height:1;letter-spacing:-2px">23:47</div></div>
<div style="margin-top:22px">
${notif('🔔','#ff9500','Bildschirmzeit','Deine tägliche Bildschirmzeit lag letzte Woche bei durchschnittlich <b>7 Std. 42 Min.</b> (+23 %)','jetzt')}
${notif('✉︎','#34c759','Jonas','🎤 Sprachnachricht (6:31)','vor 2 Min.')}
${notif('✉︎','#34c759','Klassenchat 11b','<b>47 neue Nachrichten</b>','vor 5 Min.')}
${notif('♥︎','#ff2d55','Neue Likes','mila.vibes und 128 weitere gefällt dein Beitrag','vor 9 Min.')}
</div>
<div style="position:absolute;left:10px;right:10px;bottom:118px;background:rgba(30,30,30,.55);backdrop-filter:blur(24px);border-radius:24px;padding:16px;color:#fff">
  <div style="display:flex;gap:12px;align-items:center"><div style="width:56px;height:56px;border-radius:10px;overflow:hidden;flex:none">${photo('sunset',56,56)}</div><div style="flex:1"><div style="font-weight:600;font-size:16px">nachts wach</div><div style="opacity:.7;font-size:14.5px">Lo-Fi Beats zum Einschlafen</div></div><span style="font-size:20px;opacity:.8">🎧</span></div>
  <div style="display:flex;align-items:center;gap:8px;font-size:11.5px;opacity:.75;margin-top:14px"><span>1:24</span><div style="flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,.3)"><div style="width:38%;height:100%;background:#fff;border-radius:3px"></div></div><span>-2:16</span></div>
  <div style="display:flex;justify-content:center;gap:46px;align-items:center;margin-top:10px"><span style="font-size:26px">⏮︎</span>${ico.pause('#fff',38)}<span style="font-size:26px">⏭︎</span></div>
</div>
<div style="position:absolute;left:46px;bottom:50px;width:50px;height:50px;border-radius:50%;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px">🔦</div>
<div style="position:absolute;right:46px;bottom:50px;width:50px;height:50px;border-radius:50%;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px">📷</div>`,'#000',true);

const shots={'augen-1-videofeed':augenReel,'augen-2-entdecken':augenGrid,'mund-1-chat':mundChat,'mund-2-emojis':mundEmoji,'ohr-1-sprachnachrichten':ohrVoice,'ohr-2-sperrbildschirm':ohrLock};

(async()=>{
  const {chromium}=require('playwright');const br=await chromium.launch();
  const p=await br.newPage({viewport:{width:390,height:844},deviceScaleFactor:3});
  for(const [n,html] of Object.entries(shots)){await p.setContent(html,{waitUntil:'load'});await p.waitForTimeout(150);await p.screenshot({path:path.join(OUT,n+'.png')});}
  // Druckbogen: Seite 1 klein (für A4-Porträt), Seite 2 groß (für A3-Porträt)
  const img=n=>'data:image/png;base64,'+fs.readFileSync(path.join(OUT,n+'.png')).toString('base64');
  const lab={'augen':'AUGEN','mund':'MUND','ohr':'OHR'};
  const cell=(n,w)=>`<figure style="margin:0;text-align:center"><img src="${img(n)}" style="width:${w}cm;display:block;border:.2mm solid #bbb"><figcaption style="font:8pt Arial;color:#666;margin-top:1mm">${lab[n.split('-')[0]]} · ${n.split('-').slice(2).join(' ')}</figcaption></figure>`;
  const names=Object.keys(shots);
  const page=(w,list,title)=>`<section style="page-break-after:always;padding:1cm"><h1 style="font:bold 13pt Arial;margin:0 0 .25cm">${title}</h1><p style="font:9pt Arial;color:#555;margin:0 0 .4cm">Ausdrucken, Bereiche (z. B. Augenpartie, Chatblasen, Wellenform) mit Schere/Cutter oder gerissen herauslösen und einnähen.</p><div style="display:flex;flex-wrap:wrap;gap:.5cm;justify-content:center">${list.map(n=>cell(n,w)).join('')}</div></section>`;
  const html=`<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:0}body{margin:0}</style></head><body>
   ${page(5.6,names,'Collage-Material „Zusammengenähtes Ich“ – klein (Basis-Porträt A4)')}
   ${page(8.6,names.slice(0,2),'Groß (Basis-Porträt A3) – AUGEN')}${page(8.6,names.slice(2,4),'Groß (Basis-Porträt A3) – MUND')}${page(8.6,names.slice(4,6),'Groß (Basis-Porträt A3) – OHR')}</body></html>`;
  await p.setContent(html,{waitUntil:'load'});await p.pdf({path:path.join(OUT,'druckbogen-ausschnitte.pdf'),format:'A4',printBackground:true});
  // Übersicht
  const ov=await br.newPage({viewport:{width:1300,height:950},deviceScaleFactor:1});
  await ov.setContent(`<body style="margin:0;background:#eee;padding:20px;display:flex;gap:16px;flex-wrap:wrap;font-family:Arial">${names.map(n=>`<div style="text-align:center;font-size:13px"><img src="${img(n)}" style="width:195px;border-radius:14px;box-shadow:0 3px 10px rgba(0,0,0,.25)"><div style="margin-top:6px">${n}</div></div>`).join('')}</body>`,{waitUntil:'load'});
  await ov.screenshot({path:path.join(OUT,'uebersicht.png'),fullPage:true});
  await br.close();
})();
