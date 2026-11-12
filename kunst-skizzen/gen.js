const fs=require('fs');
// ---------- 1A ----------
function face(color){
  const skin=color?'#e2b490':'#b9b9b9', skinSh=color?'#c99873':'#9f9f9f', hair=color?'#4a3222':'#3c3c3c',
        hood=color?'#8d96a3':'#8a8a8a', hoodD=color?'#6f7885':'#6c6c6c', wall=color?'#efe6d6':'#dcdcdc', lip=color?'#b0584f':'#7d7d7d';
  const mouth=color?'<path d="M262 468 Q300 492 342 462" stroke="'+lip+'" stroke-width="7" fill="none" stroke-linecap="round"/>'
                   :'<path d="M262 474 L338 474" stroke="'+lip+'" stroke-width="7" fill="none" stroke-linecap="round"/>';
  return `<rect width="600" height="800" fill="${wall}"/>
  <path d="M40 800 Q60 600 210 570 L390 570 Q540 600 560 800Z" fill="${hood}"/>
  <path d="M210 570 Q300 660 390 570 L370 545 L230 545Z" fill="${hoodD}"/>
  <path d="M285 640 L280 760 M315 640 L320 760" stroke="#eee" stroke-width="5"/>
  <rect x="255" y="500" width="90" height="90" fill="${skinSh}"/>
  <ellipse cx="300" cy="370" rx="140" ry="175" fill="${skin}"/>
  <path d="M160 350 Q150 170 300 165 Q450 170 440 350 Q420 250 300 245 Q180 250 160 350Z" fill="${hair}"/>
  <ellipse cx="158" cy="385" rx="16" ry="34" fill="${skinSh}"/><ellipse cx="442" cy="385" rx="16" ry="34" fill="${skinSh}"/>
  <path d="M215 325 L275 322 M325 322 L385 325" stroke="${hair}" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="245" cy="360" rx="24" ry="13" fill="#fff"/><ellipse cx="355" cy="360" rx="24" ry="13" fill="#fff"/>
  <circle cx="245" cy="360" r="11" fill="#2a2a2a"/><circle cx="355" cy="360" r="11" fill="#2a2a2a"/>
  <path d="M225 385 Q245 393 265 385 M335 385 Q355 393 375 385" stroke="${skinSh}" stroke-width="4" fill="none"/>
  <path d="M300 370 L288 430 Q300 440 314 430" stroke="${skinSh}" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${mouth}`;
}
const days=['Mo','Di','Mi','Do','Fr','Sa','So'], offs=[0,7,-5,4,-8,6,-3], x0=55, w=70;
let strips='',seams='',labels='';
for(let i=0;i<7;i++){
  const x=x0+i*w, col=i===5;
  strips+=`<clipPath id="c${i}"><rect x="${x}" y="${90+offs[i]}" width="${w}" height="640"/></clipPath>
  <g clip-path="url(#c${i})"><g transform="translate(0,${offs[i]})">${face(col)}</g></g>`;
  labels+=`<text x="${x+w/2}" y="${760}" text-anchor="middle" font-size="20" fill="${col?'#b0584f':'#666'}" font-family="Georgia,serif" font-style="italic">${days[i]}</text>`;
  if(i>0){ for(let y=100;y<725;y+=22){ seams+=`<line x1="${x-9}" y1="${y}" x2="${x+9}" y2="${y+9}" stroke="#555" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x-9}" cy="${y}" r="1.6" fill="#333"/><circle cx="${x+9}" cy="${y+9}" r="1.6" fill="#333"/>`;}
    seams+=`<path d="M${x} 725 q${6+i} 25 ${-4} 48" stroke="#555" stroke-width="2" fill="none"/>`; }
}
const a=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="1200" height="1600">
<rect width="600" height="800" fill="#f6f2ea"/><rect x="45" y="78" width="510" height="664" fill="#fff" filter="drop-shadow(0 4px 8px rgba(0,0,0,.3))"/>
${strips}${seams}${labels}
<text x="300" y="45" text-anchor="middle" font-size="26" font-family="Georgia,serif" fill="#333">1A · „Montag bis Sonntag“</text></svg>`;
// ---------- 2A ----------
function stitch(pts,col='#e0262b'){let s='';for(let i=0;i<pts.length;i++){const [x1,y1]=pts[i],[x2,y2]=pts[(i+1)%pts.length];const n=Math.max(2,Math.round(Math.hypot(x2-x1,y2-y1)/16));
  for(let k=0;k<n;k++){const t=(k+.5)/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t,dx=(y2-y1),dy=-(x2-x1),l=Math.hypot(dx,dy),ux=dx/l*8,uy=dy/l*8;
  s+=`<line x1="${x-ux}" y1="${y-uy}" x2="${x+ux}" y2="${y+uy}" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;}}return s;}
const P=p=>p.map(q=>q.join(',')).join(' ');
const eyeL=[[185,295],[262,280],[285,300],[275,352],[200,362],[176,330]], eyeR=[[318,285],[410,292],[424,335],[395,360],[325,350],[312,318]],
      mou=[[232,440],[300,428],[372,444],[362,492],[292,502],[240,486]], hole=[[392,392],[440,380],[452,430],[420,452],[388,430]];
const b=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="1200" height="1600">
<defs><radialGradient id="glow" cx="50%" cy="100%" r="75%"><stop offset="0" stop-color="#bfe3ff"/><stop offset=".45" stop-color="#5d8fc4"/><stop offset="1" stop-color="#16263d"/></radialGradient>
<radialGradient id="bg" cx="50%" cy="92%" r="70%"><stop offset="0" stop-color="#20395c"/><stop offset=".6" stop-color="#0a0f1a"/><stop offset="1" stop-color="#040508"/></radialGradient>
<linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaf6ff"/><stop offset="1" stop-color="#9fd0ff"/></linearGradient></defs>
<rect width="600" height="800" fill="#f6f2ea"/><rect x="45" y="78" width="510" height="690" fill="url(#bg)" filter="drop-shadow(0 4px 8px rgba(0,0,0,.4))"/>
<clipPath id="fr"><rect x="45" y="78" width="510" height="690"/></clipPath><g clip-path="url(#fr)">
<path d="M40 800 Q70 590 220 560 L380 560 Q530 590 560 800Z" fill="#131c2b"/>
<path d="M220 560 Q300 640 380 560 L360 530 L240 530Z" fill="#22344f"/>
<rect x="258" y="495" width="84" height="80" fill="#3f6694"/>
<ellipse cx="300" cy="365" rx="140" ry="172" fill="url(#glow)"/>
<path d="M160 345 Q150 165 300 160 Q450 165 440 345 Q420 250 300 242 Q180 250 160 345Z" fill="#070a10"/>
<path d="M300 365 L289 418 Q300 428 313 418" stroke="#dff0ff" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M215 520 Q300 548 385 520" stroke="#cfe8ff" stroke-width="3" fill="none" opacity=".6"/>
<!-- Risse -->
<path d="M45 250 L120 262 L170 240 L176 330" stroke="#f3efe6" stroke-width="5" fill="none"/><path d="M424 335 L480 320 L520 345 L555 338" stroke="#f3efe6" stroke-width="5" fill="none"/>
<path d="M240 486 L190 540 L150 560 L100 620" stroke="#f3efe6" stroke-width="5" fill="none"/>
<!-- Screenshot-Fragmente -->
<polygon points="${P(eyeL)}" fill="#fff" stroke="#f3efe6" stroke-width="4"/>
<clipPath id="e1"><polygon points="${P(eyeL)}"/></clipPath><g clip-path="url(#e1)"><rect x="170" y="275" width="120" height="90" fill="#fdf1f6"/>
<rect x="186" y="292" width="62" height="20" rx="10" fill="#34c759"/><rect x="214" y="318" width="60" height="20" rx="10" fill="#0a84ff"/><rect x="186" y="343" width="48" height="16" rx="8" fill="#34c759"/>
<circle cx="268" cy="298" r="11" fill="#ff3b30"/><text x="268" y="303" font-size="13" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">9</text></g>
<polygon points="${P(eyeR)}" fill="#fff" stroke="#f3efe6" stroke-width="4"/>
<clipPath id="e2"><polygon points="${P(eyeR)}"/></clipPath><g clip-path="url(#e2)"><rect x="310" y="280" width="120" height="85" fill="#fff7d6"/>
<rect x="318" y="288" width="100" height="44" fill="#ff9f0a"/><circle cx="345" cy="310" r="12" fill="#ffd60a"/><path d="M318 332 L350 305 L380 325 L400 312 L418 332Z" fill="#bf5af2"/>
<path d="M330 345 c-6 -8 -16 0 0 11 c16 -11 6 -19 0 -11" fill="#ff2d55"/><rect x="346" y="341" width="50" height="6" rx="3" fill="#888"/></g>
<polygon points="${P(mou)}" fill="#fff" stroke="#f3efe6" stroke-width="4"/>
<clipPath id="m"><polygon points="${P(mou)}"/></clipPath><g clip-path="url(#m)"><rect x="225" y="425" width="155" height="80" fill="#e8f4ff"/>
<path d="M262 458 c-9 -12 -24 0 0 17 c24 -17 9 -29 0 -17" fill="#ff2d55"/><path d="M300 456 c-9 -12 -24 0 0 17 c24 -17 9 -29 0 -17" fill="#ff2d55"/><path d="M338 458 c-9 -12 -24 0 0 17 c24 -17 9 -29 0 -17" fill="#ff2d55"/>
<rect x="250" y="484" width="100" height="7" rx="3.5" fill="#0a84ff"/></g>
<!-- Loch -->
<polygon points="${P(hole)}" fill="#f6f2ea" stroke="#fff" stroke-width="3"/>
${stitch(eyeL)}${stitch(eyeR)}${stitch(mou)}
<!-- Hände + Handy -->
<rect x="240" y="640" width="120" height="150" rx="14" fill="#0b0b0d" stroke="#333" stroke-width="3"/><rect x="248" y="650" width="104" height="140" rx="8" fill="url(#scr)"/>
<path d="M200 800 Q205 700 242 690 L250 800Z M400 800 Q395 700 358 690 L350 800Z" fill="#4c78aa"/>
<!-- Fäden -->
<g fill="none" stroke="#e0262b" stroke-width="2.6" stroke-linecap="round">
<path d="M270 655 C250 560 215 470 230 362"/><path d="M290 652 C285 580 280 540 292 502"/><path d="M310 652 C320 580 325 540 310 500"/><path d="M330 655 C360 560 395 470 372 358"/>
<path d="M300 650 C298 600 300 560 300 502"/></g>
<g fill="#e0262b"><circle cx="270" cy="655" r="4"/><circle cx="290" cy="652" r="4"/><circle cx="310" cy="652" r="4"/><circle cx="330" cy="655" r="4"/><circle cx="300" cy="650" r="4"/></g>
</g>
<text x="300" y="45" text-anchor="middle" font-size="26" font-family="Georgia,serif" fill="#333">2A · „Zusammengenähtes Ich“</text></svg>`;
fs.writeFileSync('skizze-1A.svg',a);fs.writeFileSync('skizze-2A.svg',b);
(async()=>{const {chromium}=require('playwright');const br=await chromium.launch();const p=await br.newPage({viewport:{width:1200,height:1600}});
for(const n of['1A','2A']){await p.setContent(`<body style="margin:0">${fs.readFileSync('skizze-'+n+'.svg','utf8')}</body>`);await p.screenshot({path:'skizze-'+n+'.png'});}await br.close();})();
