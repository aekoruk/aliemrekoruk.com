/* Ali Emre Koruk · research portfolio */
(()=>{
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s=>document.querySelector(s), $$ = s=>[...document.querySelectorAll(s)];

/* ---------- colormap (haline) ---------- */
const STOPS=[[0,[42,24,108]],[.2,[22,68,155]],[.4,[31,111,139]],[.6,[58,149,134]],[.8,[125,191,106]],[1,[253,239,154]]];
function hal(t){t=Math.max(0,Math.min(1,t));for(let i=1;i<STOPS.length;i++){if(t<=STOPS[i][0]){const[a,ca]=STOPS[i-1],[b,cb]=STOPS[i];const k=(t-a)/(b-a);return[ca[0]+(cb[0]-ca[0])*k,ca[1]+(cb[1]-ca[1])*k,ca[2]+(cb[2]-ca[2])*k]}}return STOPS[5][1]}

/* ---------- smooth nav ---------- */
$$('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=document.getElementById(a.dataset.go);if(t)t.scrollIntoView({behavior:RM?'auto':'smooth'});$('#navList').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false')}));
$('#menuBtn').addEventListener('click',()=>{const o=$('#navList').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',o)});
const nav=$('#nav'),prog=$('#progress');
const secs=['threads','research','experience','publications','field','education','honors','contact'].map(id=>document.getElementById(id));
function onScroll(){const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;nav.classList.toggle('solid',y>40);prog.style.transform=`scaleX(${h>0?y/h:0})`;
  let cur=null;secs.forEach(s=>{if(s&&s.getBoundingClientRect().top<innerHeight*.35)cur=s.id});
  $$('#navList a').forEach(a=>a.classList.toggle('on',a.dataset.go===cur));}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- name: build + water-particle assembly ---------- */
const nameEl=$('#name');
$$('#name .row').forEach(row=>{
  [...row.dataset.text].forEach(c=>{const s=document.createElement('span');s.className='ch'+(c===' '?' sp':'');s.textContent=c===' '?' ':c;s.dataset.c=c;s.setAttribute('aria-hidden','true');row.appendChild(s)});
});
const chars=$$('#name .ch:not(.sp)');
function swell(){chars.forEach((s,i)=>setTimeout(()=>{s.classList.remove('wave');void s.offsetWidth;s.classList.add('wave')},i*70))}
chars.forEach(s=>s.addEventListener('mouseenter',()=>{s.classList.remove('wave');void s.offsetWidth;s.classList.add('wave')}));
let formedDone=false;
function finishName(){if(formedDone)return;formedDone=true;nameEl.classList.add('formed');nameEl.classList.remove('forming');setTimeout(swell,500)}
function formName(){
  const fx=$('#nameFx'),hero=$('.hero'),hr=hero.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  fx.width=hr.width*d;fx.height=hr.height*d;const g=fx.getContext('2d');g.setTransform(d,0,0,d,0,0);
  const off=document.createElement('canvas');off.width=Math.ceil(hr.width);off.height=Math.ceil(hr.height);const o=off.getContext('2d',{willReadFrequently:true});o.fillStyle='#fff';
  const nr=nameEl.getBoundingClientRect();
  chars.forEach(s=>{const r=s.getBoundingClientRect(),cs=getComputedStyle(s),fs=parseFloat(cs.fontSize);o.font=`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m=o.measureText(s.dataset.c),asc=m.fontBoundingBoxAscent||fs*.8,desc=m.fontBoundingBoxDescent||fs*.2,L=parseFloat(cs.lineHeight)||fs*.82;
    o.fillText(s.dataset.c,r.left-hr.left,r.top-hr.top+(L-(asc+desc))/2+asc)});
  const Wd=off.width,Hd=off.height,data=o.getImageData(0,0,Wd,Hd).data,fs=parseFloat(getComputedStyle(chars[0]).fontSize);
  let step=Math.max(3,Math.round(fs/42)),pts=[];
  const collect=()=>{pts=[];for(let y=0;y<Hd;y+=step)for(let x=0;x<Wd;x+=step)if(data[(y*Wd+x)*4+3]>140)pts.push(x,y)};
  collect();while(pts.length>9000){step++;collect()}
  const n=pts.length/2,nl=nr.left-hr.left,nw=nr.width||1,P=new Float32Array(n*6),B=24,bucket=Array.from({length:B},()=>[]);
  for(let i=0;i<n;i++){const tx=pts[2*i],ty=pts[2*i+1],k=(tx-nl)/nw;
    P[i*6]=tx;P[i*6+1]=ty;P[i*6+2]=-40-Math.random()*hr.width*.45+k*nw*.15;P[i*6+3]=ty+90+Math.random()*260;P[i*6+4]=k*.95+Math.random()*.35;P[i*6+5]=Math.random()*6.283;
    bucket[Math.min(B-1,Math.floor((.12+.88*k)*B))].push(i)}
  const cols=bucket.map((_,b)=>{const c=hal((b+.5)/B);return `rgb(${c[0]|0},${c[1]|0},${c[2]|0})`});
  const DUR=1.55,END=.95+.35+DUR,sz=Math.min(3.2,Math.max(1.8,step*.6)),t0=performance.now();
  const frame=now=>{const T=(now-t0)/1000;
    g.globalCompositeOperation='destination-out';g.fillStyle='rgba(0,0,0,.28)';g.fillRect(0,0,hr.width,hr.height);g.globalCompositeOperation='source-over';
    const fade=T>END?Math.max(0,1-(T-END)/.9):1;g.globalAlpha=fade;
    for(let b=0;b<B;b++){g.fillStyle=cols[b];for(const i of bucket[b]){const j=i*6,k=Math.max(0,Math.min(1,(T-P[j+4])/DUR));if(k<=0)continue;const e=1-Math.pow(1-k,3);
      const x=P[j+2]+(P[j]-P[j+2])*e,y=P[j+3]+(P[j+1]-P[j+3])*e+Math.sin(P[j+5]+k*9)*30*(1-e)-(T>END?(T-END)*12:0);g.fillRect(x,y,sz,sz)}}
    g.globalAlpha=1;
    if(T>END-.15)finishName();
    if(T<END+1)requestAnimationFrame(frame);else g.clearRect(0,0,hr.width,hr.height)};
  requestAnimationFrame(frame)}
if(RM){formedDone=true}else{
  nameEl.classList.add('forming');
  let started=false;const go=()=>{if(started)return;started=true;try{formName()}catch(e){finishName()}};
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(go,250));setTimeout(go,1600);
  setTimeout(finishName,7000);
  setInterval(swell,8000);
}

/* ---------- role roller ---------- */
const rs=$$('#roller span');let ri=0;
// size roller to widest
const roller=$('#roller');
if(!RM)setInterval(()=>{const a=rs[ri];a.classList.remove('on');a.classList.add('out');ri=(ri+1)%rs.length;const b=rs[ri];b.classList.remove('out');b.classList.add('on');setTimeout(()=>a.classList.remove('out'),800)},2600);

/* ---------- marquee ---------- */
const words=['COAWST','ROMS','Bonnet Carré Spillway','SHAP','XGBoost','WAVEWATCH III','Mann–Kendall','IPTA','Oyster HSI','Mississippi Sound','CTD profiling','Salinity dynamics','Estuarine circulation','Explainable AI','Coastal resilience','Pearl River','Gulf of Mexico'];
$('#marquee').innerHTML=[...words,...words].map(w=>`<span>${w}</span>`).join('');

/* ---------- HERO: northern Gulf of Mexico salinity map ---------- */
const hero=$('.hero'),mapC=$('#map'),mc=mapC.getContext('2d'),cv=$('#flow'),cx=cv.getContext('2d'),vec=$('#vec'),vx=vec.getContext('2d');
const K=Math.cos(30*Math.PI/180),MOBILE=matchMedia('(max-width:700px)').matches,GS=6;
let W=0,H=0,DPR,S,LON0,LAT0,OX,OY,mask,mw,mh,SG,sgw,sgh,parts=[],tracers=[],mouse={x:-999,y:-999},t=0,frameN=0,landPath,running=false,heroVisible=true,ready=false;
const px=(lo,la)=>[OX+(lo-LON0)*S*K,OY-(la-LAT0)*S], ll=(x,y)=>[LON0+(x-OX)/(S*K),LAT0-(y-OY)/S];
// salinity colour scale: fresh (blue) -> salty (red), matches the colour bar
const SAL=[[0,[49,54,149]],[.2,[69,117,180]],[.38,[116,173,209]],[.52,[171,217,233]],[.62,[254,224,144]],[.74,[253,174,97]],[.86,[244,109,67]],[1,[215,48,39]]];
function sc(v){v=Math.max(0,Math.min(1,v));for(let i=1;i<SAL.length;i++)if(v<=SAL[i][0]){const[a,ca]=SAL[i-1],[b,cb]=SAL[i],k=(v-a)/(b-a);return[ca[0]+(cb[0]-ca[0])*k,ca[1]+(cb[1]-ca[1])*k,ca[2]+(cb[2]-ca[2])*k]}return SAL[SAL.length-1][1]}
const SRC=[[-89.25,29.12,24,.42],[-89.42,28.95,18,.3],[-89.55,30.2,18,.28],[-88.57,30.36,12,.2],[-88.02,30.5,20,.32],[-90.1,30.18,29,.45],[-89.95,29.35,12,.32],[-89.7,29.98,12,.25],[-89.0,29.3,10,.3]];
function salt(lo,la){const wl=lo+.07*Math.sin(la*22+lo*9)+.035*Math.sin(la*47-lo*31),wa=la+.05*Math.cos(lo*19-la*13)+.02*Math.sin(lo*41);
  let s=35;for(const[a,b,A,L]of SRC){const dx=(wl-a)*K,dy=wa-b;s-=A*Math.exp(-(dx*dx+dy*dy)/(L*L))}
  s-=8*Math.exp(-Math.max(0,30.42-wa)/.2);return Math.max(0,Math.min(35,s))}
const WMSS=[[-89.55,30.305],[-89.155,30.40],[-89.065,30.17],[-89.47,30.08]];
const LBL=[['LAKE PONTCHARTRAIN',-90.13,30.19,15],['LAKE BORGNE',-89.63,30.04,13],['MISSISSIPPI SOUND',-88.8,30.29,15],['CHANDELEUR SOUND',-89.2,29.84,13],['BRETON SOUND',-89.48,29.52,12],['GULF OF MEXICO',-88.35,29.28,26]];
const CITY=[['New Orleans',-90.07,29.95],['Biloxi',-88.89,30.4],['Gulfport',-89.09,30.37]];
const RIV=[['West Pearl',-89.66,30.165],['Pearl',-89.48,30.19],['Jourdan',-89.37,30.34],['Wolf',-89.27,30.345],['Biloxi R.',-89.01,30.41]];
const BCS=[-90.43,29.98];
const isLand=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return true;return mask[(((y/3)|0)*mw+((x/3)|0))*4+3]>100};
const salAt=(x,y)=>SG[Math.min(sgh-1,Math.max(0,(y/GS)|0))*sgw+Math.min(sgw-1,Math.max(0,(x/GS)|0))];
function spawn(){for(let k=0;k<20;k++){const x=Math.random()*W,y=Math.random()*H;if(!isLand(x,y))return{x,y,a:Math.random()*200|0}}return{x:-9,y:-9,a:999}}
function sizeMap(){DPR=Math.min(devicePixelRatio||1,MOBILE?1.25:1.5);W=hero.clientWidth;H=hero.clientHeight;
  for(const c of [mapC,cv,vec]){c.width=Math.round(W*DPR);c.height=Math.round(H*DPR);c.getContext('2d').setTransform(DPR,0,0,DPR,0,0)}
  S=Math.max(W/(3.05*K),H/1.72);LON0=W>900?-89.05:-89.2;LAT0=29.92;OX=W*(W>900?.55:.5);OY=H*.5;
  landPath=new Path2D();for(const r of window.COAST.land){for(let i=0;i<r.length;i+=2){const[x,y]=px(r[i],r[i+1]);i?landPath.lineTo(x,y):landPath.moveTo(x,y)}landPath.closePath()}
  mw=Math.ceil(W/3);mh=Math.ceil(H/3);const m=document.createElement('canvas');m.width=mw;m.height=mh;const g=m.getContext('2d',{willReadFrequently:true});g.scale(1/3,1/3);g.fill(landPath,'evenodd');mask=g.getImageData(0,0,mw,mh).data;
  // salinity computed once on a coarse grid; particles and the map read from it
  sgw=Math.ceil(W/GS)+1;sgh=Math.ceil(H/GS)+1;SG=new Float32Array(sgw*sgh);
  for(let j=0;j<sgh;j++)for(let i=0;i<sgw;i++){const[lo,la]=ll(i*GS,j*GS);SG[j*sgw+i]=salt(lo,la)}
  parts=Array.from({length:Math.round(Math.min(MOBILE?380:850,W*H/1500))},spawn);tracers=[];cx.clearRect(0,0,W,H);
  drawMap();drawVec();ready=true}
function drawMap(){const g=mc;g.clearRect(0,0,W,H);
  const sm=document.createElement('canvas');sm.width=sgw;sm.height=sgh;const sg=sm.getContext('2d'),img=sg.createImageData(sgw,sgh);
  for(let k=0;k<SG.length;k++){const c=sc(SG[k]/35),o=k*4;img.data[o]=c[0]*.72;img.data[o+1]=c[1]*.72;img.data[o+2]=c[2]*.72;img.data[o+3]=255}
  sg.putImageData(img,0,0);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(sm,0,0,sgw*GS,sgh*GS);
  // land
  g.save();g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=12;const lg=g.createLinearGradient(0,0,W*.6,H);lg.addColorStop(0,'#3e4c2b');lg.addColorStop(.55,'#35432a');lg.addColorStop(1,'#4a4a30');g.fillStyle=lg;g.fill(landPath,'evenodd');g.restore();
  g.save();g.clip(landPath,'evenodd');const nd=Math.min(3500,W*H/350);for(let i=0;i<nd;i++){const x=Math.random()*W,y=Math.random()*H,v=Math.random();g.fillStyle=v<.5?`rgba(95,120,65,${.15+v*.25})`:v<.8?`rgba(150,135,90,${.1+v*.12})`:'rgba(20,28,16,.3)';g.fillRect(x,y,1+Math.random()*3,1+Math.random()*2)}g.restore();
  g.strokeStyle='rgba(235,240,230,.45)';g.lineWidth=.8;g.stroke(landPath);
  g.strokeStyle='rgba(124,196,255,.5)';g.lineWidth=1;g.beginPath();for(const r of window.COAST.rivers){for(let i=0;i<r.length;i+=2){const[x,y]=px(r[i],r[i+1]);i?g.lineTo(x,y):g.moveTo(x,y)}}g.stroke();
  // graticule
  g.strokeStyle='rgba(233,241,242,.08)';g.lineWidth=1;g.fillStyle='rgba(233,241,242,.5)';g.font='500 10px "IBM Plex Mono",monospace';g.beginPath();
  for(let lo=-91;lo<=-87;lo+=.5){const[x]=px(lo,0);if(x<0||x>W)continue;g.moveTo(x,0);g.lineTo(x,H);g.textAlign='center';g.fillText(`${Math.abs(lo).toFixed(1)}°W`,x,H-12)}
  for(let la=28.5;la<=31;la+=.5){const[,y]=px(0,la);if(y<70||y>H-30)continue;g.moveTo(0,y);g.lineTo(W,y);g.textAlign='right';g.fillText(`${la.toFixed(1)}°N`,W-12,y-5)}g.stroke();
  // study region
  g.beginPath();WMSS.forEach(([lo,la],i)=>{const[x,y]=px(lo,la);i?g.lineTo(x,y):g.moveTo(x,y)});g.closePath();g.fillStyle='rgba(253,239,154,.08)';g.fill();g.setLineDash([6,5]);g.strokeStyle='rgba(253,239,154,.9)';g.lineWidth=1.5;g.stroke();g.setLineDash([]);
  {const[x,y]=px(-89.53,30.33);g.fillStyle='#fdef9a';g.textAlign='left';g.font='600 11px "IBM Plex Mono",monospace';g.fillText('WMSS · STUDY REGION',x,y-8)}
  g.textAlign='center';
  for(const[n,lo,la,f]of LBL){const[x,y]=px(lo,la);g.font=`700 ${f}px "Big Shoulders Display","Arial Narrow",sans-serif`;try{g.letterSpacing=(f*.28)+'px'}catch(e){}g.fillStyle=f>20?'rgba(255,255,255,.5)':'rgba(255,255,255,.62)';g.fillText(n,x,y)}
  try{g.letterSpacing='0px'}catch(e){}
  g.font='500 11px "Schibsted Grotesk",sans-serif';g.textAlign='left';
  for(const[n,lo,la]of CITY){const[x,y]=px(lo,la);g.fillStyle='#fff';g.beginPath();g.arc(x,y,2.6,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.fillText(n,x+6,y-5)}
  g.font='500 9.5px "IBM Plex Mono",monospace';
  for(const[n,lo,la]of RIV){const[x,y]=px(lo,la);g.fillStyle='#7cc4ff';g.beginPath();g.moveTo(x-4,y-4);g.lineTo(x+4,y-4);g.lineTo(x,y+3);g.closePath();g.fill();g.fillStyle='rgba(180,220,255,.9)';g.textAlign='center';g.fillText(n.toUpperCase(),x,y-9)}
  {const[x,y]=px(...BCS);g.fillStyle='#ffd0c2';g.font='600 11px "IBM Plex Mono",monospace';g.textAlign='left';g.fillText('BONNET CARRÉ SPILLWAY',x+12,y+18)}
}
function field(lo,la){return[-.3+.8*Math.cos(la*14+t*.3)+.5*Math.sin((lo+la)*10-t*.25),.7*Math.sin(lo*12-t*.3)+.4*Math.cos((lo-la)*9+t*.2)]}
function drawVec(){vx.clearRect(0,0,W,H);const sp=MOBILE?56:70;vx.lineWidth=1.1;vx.strokeStyle='rgba(255,255,255,.38)';vx.fillStyle='rgba(255,255,255,.38)';
  const shafts=new Path2D(),heads=new Path2D();
  for(let y=sp*.8;y<H;y+=sp)for(let x=sp*.6+((y/sp|0)%2)*sp/2;x<W;x+=sp){if(isLand(x,y))continue;const[lo,la]=ll(x,y),[u,v]=field(lo,la),m=Math.hypot(u,v)||1,L=8+m*6,ux=u/m,uy=-v/m;
    const x2=x+ux*L,y2=y+uy*L;shafts.moveTo(x-ux*L*.4,y-uy*L*.4);shafts.lineTo(x2,y2);heads.moveTo(x2+ux*3,y2+uy*3);heads.lineTo(x2-ux*3-uy*2.6,y2-uy*3+ux*2.6);heads.lineTo(x2-ux*3+uy*2.6,y2-uy*3-ux*2.6);heads.closePath()}
  vx.stroke(shafts);vx.fill(heads);
  const[bx,by]=px(...BCS),ph=(t*.7)%1;vx.fillStyle='#ff7a59';vx.beginPath();vx.arc(bx,by,4,0,6.283);vx.fill();vx.strokeStyle=`rgba(255,122,89,${1-ph})`;vx.lineWidth=1.5;vx.beginPath();vx.arc(bx,by,4+ph*22,0,6.283);vx.stroke()}
// freshwater pulse: tracer parcels that ride the currents and stay in the water
function release(x,y){if(!ready)return;if(isLand(x,y)){let ok=false;for(let r=4;r<60&&!ok;r+=4)for(let a=0;a<6.283;a+=.4){const xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r;if(!isLand(xx,yy)){x=xx;y=yy;ok=true;break}}if(!ok)return}
  const n=MOBILE?150:260;for(let i=0;i<n;i++){const a=Math.random()*6.283,sp=.3+Math.random()*1.8;tracers.push({x:x+(Math.random()-.5)*5,y:y+(Math.random()-.5)*5,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,age:0,life:8+Math.random()*8})}
  if(tracers.length>2600)tracers.splice(0,tracers.length-2600)}
function stepMap(){if(!heroVisible||document.hidden){running=false;return}
  t+=.016;frameN++;
  cx.globalCompositeOperation='destination-out';cx.fillStyle='rgba(0,0,0,.09)';cx.fillRect(0,0,W,H);cx.globalCompositeOperation='source-over';
  // current streaks: one path, one stroke
  const path=new Path2D();
  for(const p of parts){const[lo,la]=ll(p.x,p.y),[u,v]=field(lo,la);let dx=u*1.1,dy=-v*1.1;
    const mx=p.x-mouse.x,my=p.y-mouse.y,d2=mx*mx+my*my;if(d2<14000){const f=(1-d2/14000)*2;dx+=-my*.012*f+mx*.004*f;dy+=mx*.012*f+my*.004*f}
    const nx=p.x+dx,ny=p.y+dy;path.moveTo(p.x,p.y);path.lineTo(nx,ny);p.x=nx;p.y=ny;p.a++;if(p.a>240||isLand(p.x,p.y))Object.assign(p,spawn(),{a:0})}
  cx.lineWidth=1.2;cx.lineCap='round';cx.strokeStyle='rgba(255,255,255,.5)';cx.stroke(path);
  // tracers
  if(tracers.length){const bands=[new Path2D(),new Path2D(),new Path2D()];
    tracers=tracers.filter(p=>{p.age+=.016;if(p.age>p.life)return false;const[lo,la]=ll(p.x,p.y),[u,v]=field(lo,la);p.vx*=.965;p.vy*=.965;
      let nx=p.x+u*.8+p.vx+(Math.random()-.5)*.8,ny=p.y-v*.8+p.vy+(Math.random()-.5)*.8;
      if(isLand(nx,ny)){p.vx*=-.4;p.vy*=-.4;nx=p.x+(Math.random()-.5)*1.5;ny=p.y+(Math.random()-.5)*1.5;if(isLand(nx,ny)){nx=p.x;ny=p.y}}
      p.x=nx;p.y=ny;const k=p.age/p.life;bands[k<.45?0:k<.75?1:2].rect(p.x-1.2,p.y-1.2,2.4,2.4);return true});
    const A=['rgba(150,210,255,.95)','rgba(110,180,255,.65)','rgba(80,140,230,.35)'];bands.forEach((b,i)=>{cx.fillStyle=A[i];cx.fill(b)})}
  if(frameN%2===0)drawVec();
  requestAnimationFrame(stepMap)}
function startMap(){if(running||RM||!ready)return;running=true;requestAnimationFrame(stepMap)}
new IntersectionObserver(es=>{heroVisible=es[0].isIntersecting;if(heroVisible)startMap()}).observe(hero);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)startMap()});
let rt,lastW=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(Math.abs(hero.clientWidth-lastW)>40||Math.abs(hero.clientHeight-H)>120){lastW=hero.clientWidth;sizeMap()}},250)});
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
hero.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-999});
hero.addEventListener('click',e=>{if(e.target.closest('a,button'))return;const r=hero.getBoundingClientRect();release(e.clientX-r.left,e.clientY-r.top)});
// paint text first, build the map on the next frame
requestAnimationFrame(()=>setTimeout(()=>{sizeMap();lastW=W;if(document.fonts)document.fonts.ready.then(()=>{if(ready)drawMap()});
  if(!RM){const go=()=>formedDone?startMap():setTimeout(go,200);go();const src=[[-90.38,30.06],[-89.52,30.16],[-89.24,29.16]];let si=0;const auto=()=>{if(running){const[x,y]=px(...src[si++%src.length]);release(x,y)}};setTimeout(auto,2600);setInterval(auto,8000)}},0));

/* ---------- counters ---------- */
const io=(el,fn,opt={threshold:.35})=>{const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fn(e.target);o.unobserve(e.target)}}),opt);o.observe(el)};
if(!RM)$$('[data-count]').forEach(el=>io(el,el=>{const end=+el.dataset.count,dec=+(el.dataset.dec||0),t0=performance.now(),D=1600;
  const f=n=>{const k=Math.min(1,(n-t0)/D),e=1-Math.pow(1-k,3);el.textContent=(end*e).toFixed(dec);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}));

/* ---------- THREADS by year ---------- */
const THREADS=[
 {n:'Degrees & coursework',c:'#a9c3ff',y:{2016:['Civil Engineering, Bursa Technical University'],2017:['Civil Engineering, Bursa Technical University (GPA 3.85)'],2018:['B.S. Civil Engineering begins, Uludağ University'],2019:['B.S. Civil Engineering','Second track in Industrial Engineering'],2020:['B.S. Civil Engineering','Industrial Engineering studies'],2021:['Graduated 1st in Civil Engineering and the College of Engineering','Commencement speaker','M.S. coursework in Hydraulic Sciences begins'],2022:['M.S. coursework completed (GPA 4.00)','Ph.D. in Marine Science begins at USM'],2023:['Ph.D. in Marine Science, USM'],2024:['Ph.D. in Marine Science, USM','Advanced Time Series Analysis workshop (PSI)'],2025:['Ph.D. in Marine Science, USM (GPA 3.93)'],2026:['Ph.D. research as Marine Science Scholar Fellow','CSC 648 Deep Learning','Research Ethics & Open Science certification']}},
 {n:'Spillway hydrodynamic modeling',c:'#3a9586',y:{2022:['msbCOAWST framework development (USCRP / USACE ERDC / GOMESA)'],2023:['Model validation for the 2019 opening (Bays & Bayous)'],2024:['Twin experiments of the 2018–2020 openings (Ocean Sciences Meeting)','USCRP progress update','2019 operational impacts (Bays & Bayous)'],2025:['Scenario-based circulation & salinity study (AGU Fall Meeting)','Modeling contribution to the USCRP final report'],2026:['ICCE26 and Siltanen symposium talks','2019 double-opening manuscript in final proofreading']}},
 {n:'ML surrogates & XAI',c:'#fdef9a',y:{2026:['XGBoost / Gradient Boosting / Random Forest surrogates with Tulane University','SHAP drivers: 30–60-day discharge and time since last opening','Abstracts for Bays & Bayous 2027 and State of the Coast 2027']}},
 {n:'Climate & trend analysis',c:'#7dbf6a',y:{2021:['TÜBİTAK research internship: hydraulic modeling and hydroclimatic trends'],2022:['Susurluk Basin flow trends (National Hydrology Congress)'],2023:['Precipitation trends in NW Türkiye (Physics and Chemistry of the Earth)'],2024:['Advanced time-series methods applied to Gulf data'],2025:['Mississippi & Pearl River discharge trends (AMS Annual Meeting)','Gulf wave & wind climate at 24 WW3 stations (AGU poster)'],2026:['Wind-wave climatology paper in Ocean Engineering','River discharge manuscript in preparation']}},
 {n:'Habitat & fisheries',c:'#8fe0cf',y:{2025:['Species distribution shifts under freshwater inflow (AFS)','Fish & shellfish under alternative operations (CERF)'],2026:['Oyster habitat suitability scenarios (GulfCon26)','USM-ERDC Oyster Lease Project']}},
 {n:'Field campaigns',c:'#5fb0d9',y:{2022:['R/V Jim Franks research cruise, CTD profiling'],2023:['Hydrographic survey training, Stennis Space Center','Pearl River monitoring campaign'],2024:['Pearl River monitoring campaign'],2026:['Oyster lease sampling in the Mississippi Sound']}},
 {n:'Teaching & mentoring',c:'#f2c48d',y:{2023:['STEM NOLA volunteer','Graduate orientation volunteer'],2024:['Graduate orientation volunteer'],2025:['TA, MAR 300L Marine Science I Lab (Fall, 9 students)','Research mentor, GenSea program'],2026:['TA, MAR 151L, two sections (Spring, 33 students)','Research mentor, GenSea program']}},
 {n:'Leadership & service',c:'#c9b6ff',y:{2019:['Student representative, College of Engineering'],2020:['Student representative, College of Engineering'],2021:['Student representative, College of Engineering'],2023:['OCEANS 2023 with IEEE OES travel award; BEACON article','USM Environmental Sustainability Committee'],2024:['Vice President, IEEE OES USM chapter','Environmental Sustainability Committee'],2025:['Vice President, IEEE OES USM chapter'],2026:['Vice President, IEEE OES USM chapter']}}
];
const YEARS=[];for(let y=2016;y<=2026;y++)YEARS.push(y);
const thEl=$('#th'),colsEl=$('#thCols');
$('#thKey').innerHTML=THREADS.map((T,i)=>`<span data-i="${i}"><b style="background:${T.c}"></b>${T.n}</span>`).join('');
colsEl.innerHTML=YEARS.map((y,yi)=>{const act=THREADS.map((T,i)=>T.y[y]?i:-1).filter(i=>i>=0);
  return `<button class="th-col" type="button" role="tab" id="th-${y}" data-y="${y}" aria-label="${y}: ${act.length} lines of work"><span class="num">${act.length}</span><span class="stack">${act.map((i,k)=>`<i style="background:${THREADS[i].c};animation-delay:${yi*70+k*60}ms" title="${THREADS[i].n}"></i>`).join('')}</span><span class="yl"><span class="f">${y}</span><span class="s">’${String(y).slice(2)}</span></span></button>`}).join('');
let thYear=2026,playing=null;
function thSelect(y,anim=true){thYear=y;const act=THREADS.filter(T=>T.y[y]);
  $$('.th-col').forEach(c=>{const on=+c.dataset.y===y;c.classList.toggle('on',on);c.setAttribute('aria-selected',on)});
  $$('#thKey span').forEach(s=>s.classList.toggle('off',!THREADS[+s.dataset.i].y[y]));
  $('#thYear').textContent=y;$('#thCount').textContent=`${act.length} line${act.length>1?'s':''} of work`;$('#thSub').textContent=act.length>1?'running in parallel':'in focus';
  $('#thCards').innerHTML=act.map((T,i)=>`<div class="tc${anim&&!RM?' in':''}" style="animation-delay:${i*60}ms"><h4><b style="background:${T.c}"></b>${T.n}</h4><ul>${T.y[y].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}
function thStop(){if(playing){clearInterval(playing);playing=null;$('#thPlay').textContent='Play 2016 → 2026'}}
function thPlay(){thStop();let i=0;thSelect(YEARS[0]);$('#thPlay').textContent='Pause';playing=setInterval(()=>{i++;if(i>=YEARS.length){thStop();return}thSelect(YEARS[i])},1500)}
colsEl.addEventListener('click',e=>{const c=e.target.closest('.th-col');if(!c)return;thStop();thSelect(+c.dataset.y)});
$('#thPlay').addEventListener('click',()=>playing?thStop():thPlay());
thSelect(2026,false);
if(!RM)io(thEl,()=>{thEl.classList.add('grow');setTimeout(thPlay,1200)},{threshold:.35});

/* ---------- RACE ---------- */
let raceRun=0;
function race(){const id=++raceRun;const bS=$('#bSlow'),bF=$('#bFast'),tS=$('#tSlow'),tF=$('#tFast');const D=4200,t0=performance.now();
  const f=n=>{if(id!==raceRun)return;const k=Math.min(1,(n-t0)/D);
    const kf=Math.min(1,(n-t0)/260);bF.style.width=kf*100+'%';tF.textContent=(kf*3).toFixed(1)+' s';
    bS.style.width=k*100+'%';tS.textContent=(k*3).toFixed(1)+' days';if(k<1)requestAnimationFrame(f);else tS.textContent='days of HPC time'};requestAnimationFrame(f)}
$('#raceBtn').addEventListener('click',race);
if(RM){$('#bSlow').style.width='100%';$('#bFast').style.width='100%';$('#tSlow').textContent='days of HPC time';$('#tFast').textContent='seconds'}
else io($('.race'),race,{threshold:.5});
// leave a sensible resting state
$('#tSlow').textContent='days of HPC time';$('#tFast').textContent='seconds';$('#bSlow').style.width='100%';$('#bFast').style.width='100%';

/* ---------- small canvases ---------- */
function mini(id,draw){const c=document.getElementById(id),x=c.getContext('2d');let w,h,vis=false,tt=0;
  const rs=()=>{const d=Math.min(devicePixelRatio||1,2);w=c.clientWidth;h=c.clientHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0)};rs();addEventListener('resize',rs);
  new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(c);
  const loop=()=>{if(vis){tt+=.016;draw(x,w,h,tt)}requestAnimationFrame(loop)};
  if(RM){draw(x,w,h,1)}else{draw(x,w,h,0);loop()}}
mini('wavesViz',(x,w,h,t)=>{x.clearRect(0,0,w,h);const L=7;
  for(let i=0;i<L;i++){const c=hal(i/(L-1));x.strokeStyle=`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${.35+i*.08})`;x.lineWidth=1.6;x.beginPath();
    const base=h*.2+i*h*.09,amp=8+i*3.2,trend=(i-3)*.04;
    for(let X=0;X<=w;X+=4){const y=base+Math.sin(X*.018+t*(.8+i*.15)+i)*amp+Math.sin(X*.047-t*1.3+i*2)*amp*.35-X*trend;X?x.lineTo(X,y):x.moveTo(X,y)}x.stroke()}
  // trend line
  x.setLineDash([5,6]);x.strokeStyle='rgba(253,239,154,.7)';x.lineWidth=1.2;x.beginPath();x.moveTo(0,h*.82);x.lineTo(w,h*.62);x.stroke();x.setLineDash([])});
mini('hsiViz',(x,w,h,t)=>{x.clearRect(0,0,w,h);const n=Math.max(10,Math.round(w/26)),m=Math.round(h/26),cw=w/n,ch=h/m;
  for(let i=0;i<n;i++)for(let j=0;j<m;j++){const v=.5+.5*Math.sin(i*.45+t*.6)*Math.cos(j*.5-t*.4)+.25*Math.sin((i+j)*.3+t);const k=Math.max(0,Math.min(1,v*.75));
    const c=hal(k);x.fillStyle=`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${.25+k*.6})`;const s=Math.min(cw,ch)*(.35+k*.5);x.beginPath();x.roundRect?x.roundRect(i*cw+(cw-s)/2,j*ch+(ch-s)/2,s,s,3):x.rect(i*cw+(cw-s)/2,j*ch+(ch-s)/2,s,s);x.fill()}});

/* ---------- PUBLICATIONS ---------- */
const D='https://drive.google.com/file/d/',G='https://docs.google.com/document/d/';
const PUBS=[
 {y:2027,t:'review',ti:'AI-Driven Surrogate Modelling for Mitigation of Water Quality Response to Bonnet Carré Spillway Operations',au:'Koruk, A.E., Mermer, O., Cambazoglu, M.K., Armstrong, B., Wiggert, J.D., Demir, I.',ve:'Abstract under review · <i>State of the Coast 2027</i>, May 11–13, 2027 · New Orleans, LA'},
 {y:2027,t:'review',ti:'Interpretable Machine Learning Surrogates for Evaluating the Impact of Bonnet Carré Spillway Operations on the Mississippi Sound',au:'Koruk, A.E., Mermer, O., Cambazoglu, M.K., Armstrong, B., Wiggert, J.D., Demir, I.',ve:'Abstract under review (ID bbs27288) · <i>Bays and Bayous Symposium 2027</i>, Jan 12–14 · Mobile, AL'},
 {y:2026,t:'journal',ti:'Multi-Scale Trend Analysis of Wind-Wave Climatology in the Gulf of Mexico Using Innovative Approaches',au:'Koruk, A.E., Shankar, C.G., & Cambazoglu, M.K.',ve:'<i>Ocean Engineering</i>',l:[['DOI','https://doi.org/10.1016/j.oceaneng.2026.127054']]},
 {y:2026,t:'oral',ti:'Scenario-Based Modeling of Bonnet Carré Spillway: Hydrodynamic Response to River Inflows',au:'Koruk, A.E., Cambazoglu, M.K., Armstrong, B., Wiggert, J.D.',ve:'<i>International Conference on Coastal Engineering (ICCE26)</i>, May 17–22 · Galveston, TX',l:[['Abstract',G+'1PogZpk5xQfM2o14sW4inZJtTHahqZfBv/edit']]},
 {y:2026,t:'oral',ti:'Scenario-Based Modeling of Bonnet Carré Spillway and Riverine Inflow Sensitivity on Oyster Habitat Suitability in the Mississippi Sound',au:'Koruk, A.E., Milroy, S., Cambazoglu, M.K., Armstrong, B., Wiggert, J.D.',ve:'<i>Gulf of America Alliance – GulfCon26</i>, May 4–7 · Mobile, AL',l:[['Abstract',D+'11sYNfJRrWHKxeBS_ITaMkhfE960sssF_/view']]},
 {y:2026,t:'oral',ti:'How Spillway Operations Shape Salinity and Circulation: A Scenario-Based Modeling Study of the Bonnet Carré Spillway',au:'Koruk, A.E., Armstrong, B., Cambazoglu, M.K., Wiggert, J.',ve:'<i>Susan A. Siltanen Graduate Student Research Symposium</i>, USM, Apr 16 · Hattiesburg, MS',l:[['Slides',D+'1aGAZzn1bDLjGrLauWQF9dfTwp4bTbbB4/view']]},
 {y:2025,t:'oral',ti:'Evaluating the Impact of Bonnet Carré Spillway Operations on Estuarine Circulation and Salinity in the Mississippi Sound Using Scenario-Based Hydrodynamic Modeling',au:'Koruk, A.E., Armstrong, B., Cambazoglu, M.K., Wiggert, J.',ve:'<i>AGU Fall Meeting 2025</i>, Dec 18 · New Orleans, LA',l:[['Slides',D+'1dbZHNQGDQoFmy8afGQky5JvkTBFjDLdp/view']]},
 {y:2025,t:'poster',ti:'Trend Analysis of Wave and Wind Climate in the Gulf of Mexico Using Multi-Scale Innovative Approaches with the WW3 Model Results',au:'Cambazoglu, M.K., Koruk, A.E. (presenting), Shankar, C.G.',ve:'<i>AGU Fall Meeting 2025</i>, Dec 19 · New Orleans, LA',l:[['Poster',D+'169DVuyy10Kcf5w0ehM-nnf0cBXv7mx_D/view']]},
 {y:2025,t:'oral',ti:'Investigating Alternative Bonnet Carré Spillway Operations on Mississippi Sound and Bight Fish and Shellfish',au:'de Mutsert, K., Ridall, A., May, D., Koruk, A.E., Cambazoglu, M.K., Armstrong, B., Milroy, S., Wiggert, J.',ve:'<i>Coastal and Estuarine Research Federation (CERF) Biennial Conference</i>, Nov 2025 · co-author',l:[['Abstract',G+'1_9MuoU-oGXZlvBUn6AQOvc8889FX8gQq/edit']]},
 {y:2025,t:'oral',ti:'Species Distribution Models Reveal Distribution Shifts in Response to Freshwater Inflow',au:'May, D., de Mutsert, K., Koruk, A.E.',ve:'<i>American Fisheries Society Annual Meeting</i>, Aug 2025 · Honolulu, HI · co-author',l:[['Abstract',G+'1TTuA5ZbkqlRvzGotb7E0hg-EQXS4ctNB/edit']]},
 {y:2025,t:'oral',ti:'Investigating Monthly Average Discharge Trends in the Mississippi and Pearl Rivers Using Innovative Approaches',au:'Koruk, A.E., Cambazoglu, M.K.',ve:'<i>AMS 105th Annual Meeting</i>, Jan 13 · New Orleans, LA',l:[['Slides',D+'1eHI_Ely_0LTxvxtsN2JVUGe0lXYn1m4h/view']]},
 {y:2024,t:'oral',ti:'Integrated Assessment of the Operational Impacts of the 2019 Bonnet Carré Spillway Openings in the Mississippi Sound and Bight',au:'Koruk, A.E., Cambazoglu, M.K., Armstrong, B., Wiggert, J.',ve:'<i>Bays and Bayous Symposium</i>, Nov 19–20 · Biloxi, MS',l:[['Slides',D+'10siS2M0Kq5Mr13-x6wVbeIPMAx5EvI__/view']]},
 {y:2024,t:'poster',ti:'Investigation of Freshwater Diversion Events: Experimental Studies for Recent Bonnet Carré Spillway Openings',au:'Koruk, A.E., Cambazoglu, M.K., Armstrong, B., Wiggert, J.',ve:'<i>Ocean Sciences Meeting (OSM24)</i>, Feb 18–23 · New Orleans, LA',l:[['Poster',D+'1pb5GYfrLTBd8dt4sI-HfiYevvAOJ1Hiv/view']]},
 {y:2024,t:'oral',ti:'Modeling Framework Update for Spillway Operation Scenarios and Ecosystem Impacts in the Mississippi Sound',au:'Koruk, A.E.',ve:'<i>USCRP Project Meeting</i>, progress presentation to program managers, Feb 6',l:[['Slides',D+'1GxFW1buSHqtPQJ6o1R14Se3jt54oWcON/view']]},
 {y:2023,t:'journal',ti:'Trend Analysis of Precipitation Using Innovative Approaches in Northwestern Turkey',au:'Koruk, A.E., Kankal, M., Yıldız, M.B., Akçay, F., Şan, M., & Nacar, S.',ve:'<i>Physics and Chemistry of the Earth</i>, 131, 103416',l:[['DOI','https://doi.org/10.1016/j.pce.2023.103416'],['PDF',D+'1HpUIZpoTY5yHasZ1UGagrJ2Deua1TiO6/view']]},
 {y:2023,t:'proc',ti:'The Experience from the Global Members of the IEEE Oceanic Engineering Society Student Branch Chapters at the OCEANS 2023 Gulf Coast Conference',au:'Rizal, A.M., Koruk, A.E., Abdulfatai, M., Fourniol, N., Bermudez, J., & Correa, A.',ve:'<i>OES BEACON</i> – Newsletter of the IEEE Oceanic Engineering Society, 12(4), 70–71'},
 {y:2023,t:'oral',ti:'Validation of a Modeling System for Freshwater Diversion Events: A Case Study for 2019 Bonnet Carré Opening',au:'Cambazoglu, M.K., Saran, S., Koruk, A.E., Armstrong, B., Wiggert, J.',ve:'<i>Bays and Bayous Symposium</i>, Jan 2023 · Mobile, AL · co-author',l:[['Slides',D+'1hrqTg6Dgdp7zCif676kh9jeJXkuORiwr/view']]},
 {y:2022,t:'proc',ti:'Trend Analysis of Susurluk Basin Monthly Average Flows',au:'Koruk, A.E., Yıldız, M.B., Şan, M., & Kankal, M.',ve:'<i>Proceedings of the 11th National Hydrology Congress</i>, Oct 2022 · Gaziantep, Türkiye',l:[['ResearchGate','https://www.researchgate.net/publication/367464732'],['PDF',D+'1CF5i4R_p-VlxANJFh_omJucApQqvnmAv/view']]},
];
const TYPES={all:'All',journal:'Journal',proc:'Proceedings',oral:'Talks',poster:'Posters',review:'Under review'};
const BADGE={journal:['b-journal','Journal article'],proc:['b-proc','Proceedings'],oral:['b-oral','Oral presentation'],poster:['b-poster','Poster'],review:['b-review','Under review']};
const esc=s=>s.replace(/Koruk, A\.E\.( \(presenting\))?/,m=>`<b>${m}</b>`);
$('#pubs').innerHTML=PUBS.map(p=>`<article class="pub" data-t="${p.t}"><div class="y">${p.y}</div><div><h4>${p.ti}</h4><div class="au">${esc(p.au)}</div><div class="ve">${p.ve}</div></div><div class="side"><span class="badge ${BADGE[p.t][0]}">${BADGE[p.t][1]}</span>${p.l?`<div class="links">${p.l.map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener">${n} ↗</a>`).join('')}</div>`:''}</div></article>`).join('');
$('#filters').innerHTML=Object.entries(TYPES).map(([k,v],i)=>`<button type="button" role="tab" id="f-${k}" class="${i?'':'on'}" data-f="${k}" aria-selected="${!i}">${v}<sup>${k==='all'?PUBS.length:PUBS.filter(p=>p.t===k).length}</sup></button>`).join('');
$$('#filters button').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.f;$$('#filters button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
  $$('.pub').forEach((p,i)=>{const show=f==='all'||p.dataset.t===f;p.classList.toggle('hide',!show);if(show&&!RM)p.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:450,delay:Math.min(i,8)*35,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'})})}));

/* ---------- MANUSCRIPTS ---------- */
// stage: 0 analysis, 1 drafting, 2 proofreading, 3 submission
const MS=[
 {ti:'Hydrodynamic Impacts of the 2019 Bonnet Carré Spillway Double Openings',d:'High-resolution COAWST simulations of how the unprecedented dual opening and hypothetical operations altered salinity, circulation and recovery time in the Mississippi Sound and Bight.',n:'Final proofreading · submission & preprint planned late October 2026',s:2},
 {ti:'Interpretable Machine Learning Surrogates for Evaluating the Impact of Bonnet Carré Spillway Operations on Mississippi Sound Salinity',d:'Ensemble surrogates trained on eight msbCOAWST simulations predict salinity in seconds; SHAP identifies 30–60-day discharge and time since last opening as dominant drivers. r = 0.97–0.99 on unseen scenarios. With Tulane University.',n:'In preparation · linked to Bays & Bayous 2027',s:1},
 {ti:'AI-Driven Surrogate Modeling for Mitigation of Water Quality Response to Bonnet Carré Spillway Operations',d:'Extends surrogates from retrospective assessment to proactive mitigation: gate timing and dynamic discharge thresholds, toward an early-warning and decision-support framework. With Tulane University.',n:'In preparation · linked to State of the Coast 2027',s:1},
 {ti:'River Discharge Variability in the Mississippi and Pearl River Basins',d:'Seasonal, interannual and decadal discharge trends from Mann–Kendall and IPTA across multiple USGS stations, with implications for flood and freshwater management.',n:'Planned submission · Fall 2026',s:1},
 {ti:'Scenario-Based Assessment of Consecutive Bonnet Carré Spillway Operations (2018–2020)',d:'Cumulative hydrodynamic and ecological responses to consecutive diversions, testing modified discharge thresholds and timing for adaptive management.',n:'Planned submission · end of Fall 2026',s:1},
 {ti:'Riverine Inflow Sensitivity and Oyster Habitat Suitability in the Mississippi Sound',d:'Hydrodynamic outputs integrated with HSI analysis to assess oyster habitat under alternative inflow scenarios. Presented at GulfCon 2026.',n:'Planned submission · Spring 2027',s:0},
 {ti:'Hydrodynamic Response of the Mississippi Sound to Alternative Bonnet Carré Spillway Operations',d:'Scenario-based study of diversion strategies and circulation under varying river discharge. Presented at ICCE 2026.',n:'Planned submission · end of Spring 2027',s:0},
];
$('#msList').innerHTML=MS.map(m=>`<div class="ms reveal"><div><h4>${m.ti}</h4><p>${m.d}</p><div class="note">${m.n}</div></div><div><div class="steps" data-s="${m.s}"><div class="fill"></div>${[0,1,2,3].map(i=>`<i class="${i<m.s?'done':i===m.s?'cur':''}"></i>`).join('')}</div><div class="steps-lbl"><span>Analysis</span><span>Drafting</span><span>Proofread</span><span>Submit</span></div></div></div>`).join('');
$$('.steps').forEach(s=>{const set=()=>{s.querySelector('.fill').style.width=(+s.dataset.s/3*75)+'%'};if(RM)set();else{io(s,set,{threshold:.6});setTimeout(set,8000)}});
// head copy matches count
document.querySelector('#pipeline .head p').textContent=`${MS.length} first-author manuscripts linking hydrodynamic modeling, machine learning, climate trends and ecosystem response in the northern Gulf.`;

/* ---------- copy ---------- */
$$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const v=b.dataset.copy;try{await navigator.clipboard.writeText(v);b.textContent='Copied'}catch(e){const r=document.createRange();r.selectNodeContents(b.previousElementSibling);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected'}setTimeout(()=>b.textContent='Copy',1600)}));
})();
