(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return document.getElementById(id)}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function sm(a,b,v){var t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)}
  function lerp(a,b,t){return a+(b-a)*t}
  var desk=function(){return matchMedia('(min-width:901px)').matches};
  var dpr=Math.min(devicePixelRatio||1,1.5);

  /* ---------- hero: arch window (transform/opacity only, no canvas) ---------- */
  var hz=$('hz'),arch=$('hzarch'),mach=$('hzmach'),stage=$('hzstage');
  var M=[{n:'Acidic · skin care',ph:'6.0',c:'#F09A3A',c2:'#FFD9A8'},{n:'Purified · medicine',ph:'7.0',c:'#2FB36E',c2:'#BFEBD2'},{n:'Alkaline · drinking',ph:'9.5',c:'#29AAE2',c2:'#BDE7FA'},{n:'Turbo · washing produce',ph:'11.5',c:'#4E4BD8',c2:'#CFCDF7'}];
  var mb=[].slice.call($('hzmodes').children);
  function mode(i){var m=M[i];mb.forEach(function(b,j){b.setAttribute('aria-pressed',j===i)});hz.style.setProperty('--hz-c',m.c);hz.style.setProperty('--hz-c2',m.c2);$('hzph').textContent=m.ph;$('hzname').textContent=m.n}
  mb.forEach(function(b){b.addEventListener('click',function(){mode(+b.dataset.i)})});
  mode(2);
  /* one rAF-throttled scroll handler, transforms only */
  var ticking=false;
  function hzScroll(){ticking=false;if(still)return;var y=Math.min(scrollY,innerHeight);var k=y/innerHeight;
    arch.style.transform='translate3d(0,'+(k*40)+'px,0) scale('+(1+k*.06)+')';mach.style.transform='translate3d(0,'+(k*-70)+'px,0)'}
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(hzScroll)}},{passive:true});
  /* gentle tilt toward the pointer, desktop only */
  if(matchMedia('(pointer:fine)').matches&&!still){var tx=0,ty=0,cx=0,cy=0,run=false;
    stage.addEventListener('pointermove',function(e){var r=stage.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;if(!run){run=true;requestAnimationFrame(tilt)}});
    stage.addEventListener('pointerleave',function(){tx=0;ty=0;if(!run){run=true;requestAnimationFrame(tilt)}});
    function tilt(){cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;stage.style.setProperty('--rx',(cy*-6).toFixed(2)+'deg');stage.style.setProperty('--ry',(cx*8).toFixed(2)+'deg');
      if(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)requestAnimationFrame(tilt);else run=false}}

  /* ---------- technology reveal ---------- */
  var T=$('tech'),hs=[].slice.call(T.querySelectorAll('.hs')),tl=[].slice.call($('tlist').children),tbar=$('tbar');
  function tech(){
    if(!desk()){hs.forEach(function(h){h.classList.add('on')});tl.forEach(function(d){d.classList.add('on')});var P0=$('p3d');if(P0&&P0.setState&&!P0._cyc){P0._cyc=1;var n0=0;setInterval(function(){n0=(n0+1)%4;P0.setState(n0)},2600)}return}
    var r=T.getBoundingClientRect(),q=clamp(-r.top/(T.offsetHeight-innerHeight),0,1),act=Math.min(3,Math.floor(q*4.2));
    hs.forEach(function(h,i){h.classList.toggle('on',i===act)});tl.forEach(function(d,i){d.classList.toggle('on',i===act)});tbar.style.width=(q*100)+'%';var P=$('p3d');if(P&&P.setState)P.setState(act);
  }
  addEventListener('scroll',tech,{passive:true});addEventListener('resize',tech);tech();
  tl.forEach(function(d,i){d.addEventListener('pointerenter',function(){if(!desk())return;hs.forEach(function(h,j){h.classList.toggle('on',j===i)});tl.forEach(function(x,j){x.classList.toggle('on',j===i)});var P=$('p3d');if(P&&P.setState)P.setState(i)})});
  (function(){var c=$('techbub'),x=c.getContext('2d'),w,h,B=[];
    function sz(){w=c.offsetWidth;h=c.offsetHeight;c.width=w*dpr;c.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0);B=[];for(var i=0;i<60;i++)B.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2.4+.5,s:Math.random()*.5+.2})}
    sz();addEventListener('resize',sz);var vis=false;if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(T);
    (function lp(){if(vis||still){x.clearRect(0,0,w,h);x.strokeStyle='rgba(142,216,248,.5)';B.forEach(function(b){if(!still){b.y-=b.s;if(b.y<-5){b.y=h+5;b.x=Math.random()*w}}x.globalAlpha=.25+b.r*.1;x.beginPath();x.arc(b.x,b.y,b.r,0,6.28);x.stroke()})}if(!still)requestAnimationFrame(lp)})();
  })();

  /* ---------- trust badges + family moments ---------- */
  var bd=$('badges');
  if('IntersectionObserver' in window&&!still){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){bd.classList.add('on');io.disconnect()}},{threshold:.5});io.observe(bd)}else bd.classList.add('on');
  var caps=[['The one thing everyone at home shares.','Family moments · 1 of 3'],['Fresh water, wherever the day takes you.','Family moments · 2 of 3'],['Even the smallest member of the family.','Family moments · 3 of 3']];
  var imgs=[].slice.call($('slides').children),dots=[].slice.call($('dots').children),cur=0,timer;
  function go(i){cur=i;imgs.forEach(function(m,j){m.classList.toggle('on',j===i)});dots.forEach(function(d,j){d.setAttribute('aria-pressed',j===i)});$('capt').textContent=caps[i][0];$('caps').textContent=caps[i][1]}
  dots.forEach(function(d,i){d.addEventListener('click',function(){go(i);clearInterval(timer)})});
  if(!still)timer=setInterval(function(){go((cur+1)%3)},4800);

  /* ---------- demo: water surface ---------- */
  (function(){var c=$('waves'),x=c.getContext('2d'),w,h;
    function sz(){w=c.offsetWidth;h=c.offsetHeight;c.width=w*dpr;c.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
    sz();addEventListener('resize',sz);var vis=false;if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(c);
    function frame(tm){var t=tm*.001;x.clearRect(0,0,w,h);
      [[.42,.9,'rgba(142,216,248,.10)',22],[.55,1.3,'rgba(41,170,226,.16)',16],[.7,1.7,'rgba(10,60,120,.55)',12]].forEach(function(L,k){
        x.beginPath();x.moveTo(0,h);for(var X=0;X<=w;X+=12){var Y=h*L[0]+Math.sin(X*.006*L[1]+t*(.6+k*.25))*L[3]+Math.sin(X*.013+t*1.1+k)*L[3]*.4;x.lineTo(X,Y)}x.lineTo(w,h);x.closePath();x.fillStyle=L[2];x.fill()});
      x.strokeStyle='rgba(223,245,255,.35)';x.lineWidth=1.2;x.beginPath();for(var X2=0;X2<=w;X2+=12){var Y2=h*.42+Math.sin(X2*.0054+t*.6)*22+Math.sin(X2*.013+t*1.1)*8.8;if(X2===0)x.moveTo(X2,Y2);else x.lineTo(X2,Y2)}x.stroke()}
    (function lp(tm){if(vis||still)frame(tm||0);if(!still)requestAnimationFrame(lp)})();
  })();

  /* ---------- the collection: vertical scroll drives a horizontal track ---------- */
  var CS=$('showroom'),track=$('track'),slides=[].slice.call(track.children),cnum=$('cnum'),cbar=$('cbar'),maxX=0;
  function csize(){if(!desk()){CS.style.height='';track.style.transform='';maxX=0;return}maxX=Math.max(0,track.scrollWidth-innerWidth);CS.style.height=(innerHeight+maxX)+'px'}
  function cscroll(){
    if(!desk()){var sl=track.scrollLeft,mw=track.scrollWidth-track.clientWidth;var q2=mw>0?sl/mw:0;cnum.textContent=('0'+(Math.round(q2*(slides.length-1))+1)).slice(-2);cbar.style.width=(q2*100)+'%';return}
    var r=CS.getBoundingClientRect(),q=clamp(-r.top/Math.max(1,CS.offsetHeight-innerHeight),0,1);
    track.style.transform='translate3d('+(-q*maxX)+'px,0,0)';cbar.style.width=(q*100)+'%';cnum.textContent=('0'+(Math.round(q*(slides.length-1))+1)).slice(-2);
    if(!still)slides.forEach(function(sl){var b=sl.getBoundingClientRect(),off=(b.left+b.width/2-innerWidth/2)/innerWidth;
      sl.querySelector('.stage2 img').style.transform='translateX('+(off*-60)+'px) rotate('+(off*-4)+'deg)';sl.querySelector('.ghost').style.transform='translate(calc(-50% + '+(off*160)+'px),-50%)'});
  }
  csize();cscroll();addEventListener('resize',function(){csize();cscroll()});addEventListener('scroll',cscroll,{passive:true});track.addEventListener('scroll',cscroll,{passive:true});
  if(document.fonts)document.fonts.ready.then(function(){csize();cscroll()});

  /* ---------- find your ionizer ---------- */
  var Q=[
    {q:'How many people will drink from it?',k:'size',o:[['1–2','Couples and small homes'],['3–4','A typical family'],['5+','A big household']]},
    {q:'Where would you like it to live?',k:'place',o:[['On the counter','Easy to see and reach'],['Under the sink','Only a slim faucet shows']]},
    {q:'What matters most to you?',k:'want',o:[['Everyday alkaline water','Simple and reliable'],['Hydrogen-rich water','For your daily glass'],['Maximum performance','The most plates'],['Simple and eco','Easy settings, saves power']]},
    {q:'Where does your water come from?',k:'src',o:[['Municipal supply','City pipeline'],['Borewell','Ground water'],['Tanker','Delivered water'],['Not sure','We will test it']]}
  ];
  var R={
    nmp:{n:'NMP Series',im:'nmp9',h:'nmp',d:'The everyday Tyent, with a plate count matched to your family.'},
    ace:{n:'ACE-13',im:'ace',h:'ace',d:'Thirteen plates and a colour touchscreen for homes that want the best on the counter.'},
    hybrid:{n:'H2-Hybrid',im:'hybrid',h:'hybrid',d:'An ionizer and hydrogen water generator in one machine.'},
    uce:{n:'UCE-13 Plus',im:'uce-set2',h:'uce',d:'Thirteen plates hidden under your sink, with a touchscreen faucet in four finishes.'},
    q:{n:'Q-Series',im:'q',h:'q',d:'Soft design, colour-coded settings and an energy-saving eco mode.'}
  };
  var body=$('qz-body'),ans={},step=0,L='ABCD';
  function show(){
    $('qz-bar').style.width=((step+1)/(Q.length+1)*100)+'%';
    if(step>=Q.length)return result();
    var s=Q[step];$('qz-lab').textContent='Question '+(step+1)+' of '+Q.length;
    body.innerHTML='<div class="qz-step"><h3>'+s.q+'</h3><div class="qz-opts" role="group" aria-label="'+s.q+'">'+s.o.map(function(o,i){return '<button aria-pressed="'+(ans[s.k]===i)+'" data-i="'+i+'"><span class="e">'+L[i]+'</span><b>'+o[0]+'</b><small>'+o[1]+'</small></button>'}).join('')+'</div><div class="qz-nav"><button class="qz-back"'+(step?'':' disabled')+'>← Back</button><span style="font-size:.84rem;color:var(--muted)">Choose one to continue</span></div></div>';
    body.querySelectorAll('.qz-opts button').forEach(function(b){b.addEventListener('click',function(){ans[s.k]=+b.dataset.i;b.setAttribute('aria-pressed','true');setTimeout(function(){step++;show()},still?0:260)})});
    body.querySelector('.qz-back').addEventListener('click',function(){step=Math.max(0,step-1);show()});
  }
  function result(){
    var k=ans.place===1?'uce':ans.want===1?'hybrid':(ans.want===2||ans.size===2)?'ace':ans.want===3?'q':'nmp',r=R[k];
    var why=[];
    why.push(['Ideal for couples and small homes','Sized well for a family of three or four','Built for a busy, bigger household'][ans.size]);
    why.push(ans.place===1?'Keeps your counter clear with only the faucet on show':'Sits neatly on the counter beside your sink');
    if(k==='nmp')why.push(ans.size===0?'NMP-5 or NMP-7 will be plenty':ans.size===1?'NMP-9 is the sweet spot':'Go for NMP-11');
    why.push(ans.src===1||ans.src===2?'We will likely add a pre-filter or Scale Remover for '+(ans.src===1?'borewell':'tanker')+' water':ans.src===3?'Our free water test will confirm the right pre-filter':'City water usually needs no extra pre-filter');
    $('qz-lab').textContent='Your match';
    body.innerHTML='<div class="qz-step qz-res"><div class="im"><img src="img/'+r.im+'.webp" alt="Tyent '+r.n+'"></div><div><p class="kicker">We recommend</p><h3 class="serif">'+r.n+'</h3><p>'+r.d+'</p><ul class="why">'+why.map(function(w){return '<li>'+w+'</li>'}).join('')+'</ul><div class="acts"><a class="btn btn-p" href="#demo" id="qz-book">Book a demo of the '+r.n+' <span class="arr">→</span></a><a class="btn btn-g" href="products.html#'+r.h+'">See details</a><button class="qz-back" id="qz-again">Start again</button></div></div></div>';
    $('qz-again').addEventListener('click',function(){ans={};step=0;show()});
    $('qz-book').addEventListener('click',function(){var sel=$('d-md');if(sel)[].slice.call(sel.options).forEach(function(o,i){if(o.text===r.n)sel.selectedIndex=i})});
  }
  show();

  /* ---------- the pour: water leaves the ACE-13 spout, runs down the page edge, fills the demo glass ---------- */
  (function(){
    if(still||!matchMedia('(min-width:768px)').matches)return;
    var spoutImg=document.querySelector('.hz-mach img'),glassSvg=document.querySelector('.hx-demo .glass-s svg');if(!spoutImg||!glassSvg)return;
    var gw=glassSvg.querySelector('.gwater'),gs=glassSvg.querySelector('.gsurf'),gb=glassSvg.querySelector('.gbub');
    var cv=document.createElement('canvas');cv.className='pour';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
    var lastScroll=performance.now(),cx=cv.getContext('2d'),W,H,pts=[],segEnd=0,mouth={x:0,y:0},GX=13,flow=0,lastT=0,running=false,need=true;
    function size(){W=innerWidth;H=innerHeight;cv.width=W;cv.height=H;need=true}
    function docRect(el){var r=el.getBoundingClientRect();return {x:r.left,y:r.top+scrollY,w:r.width,h:r.height}}
    function bez(p0,p1,p2,p3,n,out){for(var i=1;i<=n;i++){var t=i/n,u=1-t;out.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]])}}
    /* the path after the hero (gutter run + curve into the glass) depends only on layout, so build it on resize */
    function build(){var g=docRect(glassSvg);mouth={x:g.x+g.w*.5,y:g.y+g.h*.05};var hz=docRect(document.getElementById('hz'));
      var B=[GX,hz.y+hz.h*.98],C=[GX,mouth.y-240];pts=[];
      for(var y=B[1];y<C[1];y+=36)pts.push([GX,y]);
      bez(C,[GX,C[1]+150],[mouth.x,mouth.y-170],[mouth.x,mouth.y-4],40,pts);segEnd=pts.length}
    function spout(){var r=spoutImg.getBoundingClientRect();return [r.left+r.width*.03,r.top+r.height*.73+scrollY]}
    function head(){return scrollY+H*.66}
    function draw(){var S=spout(),hz=document.getElementById('hz'),hb=hz.getBoundingClientRect().bottom+scrollY;
      /* fall straight down from the spout, turn along the empty band at the bottom of the hero, then into the left edge */
      var X=S[0]-5,Yt=hb-12,first=[S];
      bez(S,[S[0]-1,S[1]+18],[X,S[1]+30],[X,S[1]+60],8,first);
      for(var yy=S[1]+90;yy<Yt-70;yy+=40)first.push([X,yy]);
      bez([X,Math.max(S[1]+60,Yt-70)],[X,Yt-20],[X-30,Yt],[X-80,Yt],12,first);
      for(var xx=X-120;xx>GX+90;xx-=60)first.push([xx,Yt]);
      bez([GX+90,Yt],[GX+30,Yt],[GX,Yt+10],[GX,Yt+60],12,first);
      var all=first.concat(pts),hy=head(),sy=scrollY;
      cx.clearRect(0,0,W,H);
      if(hy<S[1]){level(0);return}
      /* progress along the path by length: map head depth to distance travelled */
      var L=[0];for(var q=1;q<all.length;q++){L.push(L[q-1]+Math.hypot(all[q][0]-all[q-1][0],all[q][1]-all[q-1][1]))}
      var dist=(hy-S[1])*1.0+Math.max(0,Math.min(hy-S[1],hb-S[1]))*1.6;
      var n=0;while(n<all.length&&L[n]<=dist)n++;
      var end=Math.min(n,all.length);if(end<2){level(0);return}
      /* interpolate the leading point so the stream advances smoothly */
      var tip=all[end-1];if(end<all.length){var a=all[end-1],b=all[end],seg=Math.max(1,L[end]-L[end-1]),k=Math.max(0,Math.min(1,(dist-L[end-1])/seg));tip=[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k]}
      cx.save();cx.translate(0,-sy);cx.lineCap='round';cx.lineJoin='round';
      function path(){cx.beginPath();var started=false;for(var i=0;i<end;i++){var p=all[i];if(p[1]<sy-60&&all[i+1]&&all[i+1][1]<sy-60)continue;if(!started){cx.moveTo(p[0],p[1]);started=true}else cx.lineTo(p[0],p[1])}cx.lineTo(tip[0],tip[1])}
      path();cx.strokeStyle='rgba(41,170,226,.16)';cx.lineWidth=16;cx.stroke();
      path();var gr=cx.createLinearGradient(0,sy,0,sy+H);gr.addColorStop(0,'rgba(92,198,242,.95)');gr.addColorStop(1,'rgba(28,107,214,.95)');cx.strokeStyle=gr;cx.lineWidth=5;cx.stroke();
      path();cx.setLineDash([14,26]);cx.lineDashOffset=-flow;cx.strokeStyle='rgba(255,255,255,.75)';cx.lineWidth=1.6;cx.stroke();cx.setLineDash([]);
      /* the falling head: a drop with a few droplets ahead of it */
      var arrived=end>=all.length;
      if(!arrived){cx.fillStyle='rgba(92,198,242,.95)';cx.beginPath();cx.ellipse(tip[0],tip[1]+3,4.2,6.5,0,0,6.283);cx.fill();
        cx.fillStyle='rgba(142,216,248,.8)';for(var d=1;d<=3;d++){var yy=tip[1]+12+d*14+((flow*.6+d*9)%14);cx.beginPath();cx.arc(tip[0]+Math.sin(d*2.1+flow*.05)*1.5,yy,2.4-d*.5,0,6.283);cx.fill()}}
      else{cx.strokeStyle='rgba(142,216,248,.55)';cx.lineWidth=1.2;for(var r=0;r<2;r++){var rr=((flow*.5+r*22)%44);cx.globalAlpha=1-rr/44;cx.beginPath();cx.ellipse(mouth.x,mouth.y+glassSvg.getBoundingClientRect().height*.18,8+rr,2+rr*.22,0,0,6.283);cx.stroke()}cx.globalAlpha=1}
      cx.restore();
      level(arrived?Math.min(1,(hy-mouth.y)/(H*.45)):0)}
    var lastLv=-1;function level(f){if(Math.abs(f-lastLv)<.004)return;lastLv=f;var y=286-f*206;gw.setAttribute('y',y.toFixed(1));gs.setAttribute('cy',y.toFixed(1));gs.style.opacity=f>.02?.9:0;gb.style.opacity=f>.3?.8:0}
    function frame(now){running=false;var dt=Math.min(.1,(now-lastT)/1000||0);lastT=now;flow+=dt*70;draw();
      /* keep flowing while the stream is on screen, ~30fps */
      if(head()>spout()[1]&&now-lastScroll<3500){running=true;setTimeout(function(){requestAnimationFrame(frame)},33)}}
    function kick(){if(!running){running=true;lastT=performance.now();requestAnimationFrame(frame)}}
    level(0);size();build();kick();
    addEventListener('resize',function(){size();build();kick()});
    addEventListener('scroll',function(){lastScroll=performance.now();kick()},{passive:true});
    if(document.fonts)document.fonts.ready.then(function(){build();kick()});
    addEventListener('load',function(){build();kick()});
    document.addEventListener('visibilitychange',function(){if(!document.hidden)kick()});
  })();

  /* ---------- build your water: the signature glass ---------- */
  (function(){
    var G=$('bwGlass');if(!G)return;
    var S=[
      {ph:5.5,name:'Acidic 2',c:[240,154,58],use:'This is your <em>hair rinse.</em>',d:'Mildly acidic water for a final rinse after shampoo, especially in hard-water cities.',t:['Skin & hair','Not for drinking'],h:.06,bl:'Gentle'},
      {ph:6.0,name:'Acidic 1',c:[236,180,64],use:'This is your <em>face-wash glass.</em>',d:'Soft, mildly acidic water for washing your face morning and night.',t:['Skin care','Not for drinking'],h:.1,bl:'Gentle'},
      {ph:7.0,name:'Purified',c:[47,179,110],use:'This is <em>baby\'s bottle.</em>',d:'Filtered, neutral water with no ionization. Use it for baby formula and for taking medicines.',t:['Drink','Baby formula','Medicines'],h:.16,bl:'None'},
      {ph:8.5,name:'Alkaline 1',c:[37,172,155],use:'This is your <em>first-week glass.</em>',d:'The gentlest alkaline level. Start here for your first two weeks, and use it for pets too.',t:['Drink','Start here','Pets'],h:.45,bl:'Light'},
      {ph:9.0,name:'Alkaline 2',c:[41,170,226],use:'This is your <em>morning glass.</em>',d:'Smooth, light water for the first glass of the day, and for tea and coffee.',t:['Drink','Tea & coffee'],h:.66,bl:'Medium'},
      {ph:9.5,name:'Alkaline 3',c:[46,127,222],use:'This is your <em>everyday glass.</em>',d:'Your all-day drinking water, after a walk and with meals, and for cooking dal and rice.',t:['Drink','Cooking'],h:.82,bl:'Strong'},
      {ph:11.5,name:'Turbo',c:[78,75,216],use:'This is your <em>vegetable wash.</em>',d:'Strong alkaline water for soaking fruit and vegetables before you cook. Never drink it.',t:['Washing produce','Not for drinking'],h:1,bl:'Maximum'}
    ];
    var R=$('bwR'),N=$('bwN'),NM=$('bwName'),U=$('bwUse'),D=$('bwDesc'),TG=$('bwTags'),CP=$('bwCopy'),BAR=$('bwBar'),BL=$('bwBarL'),CN=$('bwChipN'),sec=$('build');
    var MIN=5.5,MAX=11.5;function pct(v){return (v-MIN)/(MAX-MIN)*100}
    $('bwTicks').innerHTML=S.map(function(o,i){return '<button style="left:'+pct(o.ph)+'%" data-i="'+i+'" aria-label="pH '+o.ph.toFixed(1)+', '+o.name+'"><i></i><span>'+o.ph.toFixed(1)+'</span></button>'}).join('');
    var ticks=[].slice.call($('bwTicks').children);
    function nearest(v){var b=0;S.forEach(function(o,i){if(Math.abs(o.ph-v)<Math.abs(S[b].ph-v))b=i});return b}
    var idx=-1,col=S[4].c.slice(),hz=S[4].h,phShown=9,phT=9;
    function choose(i,instant){if(i===idx)return;idx=i;var o=S[i];
      ticks.forEach(function(t,j){t.classList.toggle('on',j===i)});
      R.setAttribute('aria-valuetext','pH '+o.ph.toFixed(1)+', '+o.name+'. '+o.use.replace(/<[^>]+>/g,''));
      NM.textContent=o.name;phT=o.ph;BAR.style.transform='scaleX('+Math.max(.04,o.h)+')';BL.textContent=o.bl;
      sec.style.setProperty('--bw','rgb('+o.c.join(',')+')');
      function txt(){U.innerHTML=o.use;D.textContent=o.d;TG.innerHTML=o.t.map(function(x){return '<span class="'+(/Not for/.test(x)?'no':/Drink/.test(x)?'yes':'')+'">'+x+'</span>'}).join('')}
      if(instant||still){txt();return}
      CP.classList.add('swap');setTimeout(function(){txt();CP.classList.remove('swap')},180)}
    /* canvas glass */
    var cv=$('bwc'),cx=cv.getContext('2d'),W,H,k,dprB=Math.min(devicePixelRatio||1,2);
    function size(){var r=G.getBoundingClientRect();W=r.width;H=r.width*500/360;cv.width=W*dprB;cv.height=H*dprB;k=W/360;cx.setTransform(dprB*k,0,0,dprB*k,0,0)}
    var TOP=134,BOT=482,level=still?.82:0,levelT=.82,pour=0,pourT=0,amp=0,lastIn=0,B=[],drops=[],tt=0,vis=false,raf=0,last=0;
    function xl(y){return 63+(y-134)*(85-63)/(482-134)}function xr(y){return 297-(y-134)*(297-275)/(482-134)}
    function interior(){cx.beginPath();cx.moveTo(63,134);cx.lineTo(297,134);cx.lineTo(276,470);cx.quadraticCurveTo(275,482,262,482);cx.lineTo(98,482);cx.quadraticCurveTo(85,482,84,470);cx.closePath()}
    function rgba(c,a){return 'rgba('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+','+a+')'}
    function draw(dt){tt+=dt;cx.clearRect(0,0,360,500);
      var tc=S[idx].c;for(var q=0;q<3;q++)col[q]+=(tc[q]-col[q])*Math.min(1,dt*3.2);hz+=(S[idx].h-hz)*Math.min(1,dt*2.5);
      level+=(levelT-level)*Math.min(1,dt*(pour>.2?1.6:3));pour+=(pourT-pour)*Math.min(1,dt*6);amp+=((pour>.1?5:1.2)-amp)*Math.min(1,dt*3);
      if(performance.now()-lastIn>650)pourT=0;
      phShown+=(phT-phShown)*Math.min(1,dt*8);var pv=phShown.toFixed(1);if(N.textContent!==pv){N.textContent=pv;CN.textContent=pv}
      var sy=BOT-level*(BOT-150);
      /* stream from the spout */
      if(pour>.02&&level>0){var w=7*pour;var g=cx.createLinearGradient(0,73,0,sy);g.addColorStop(0,rgba(col,.55*pour+.1));g.addColorStop(1,rgba(col,.75*pour));
        cx.beginPath();cx.moveTo(196-w/2,72);for(var y=72;y<=sy;y+=8){cx.lineTo(196-w/2+Math.sin(y*.09-tt*14)*1.2*pour,y)}for(var y2=sy;y2>=72;y2-=8){cx.lineTo(196+w/2+Math.sin(y2*.09-tt*14+1)*1.2*pour,y2)}cx.closePath();cx.fillStyle=g;cx.fill();
        cx.fillStyle='rgba(255,255,255,'+(.5*pour)+')';cx.fillRect(195-w*.15,72,1.4,Math.max(0,sy-72));
        if(Math.random()<pour*.8)drops.push({x:196,y:sy,vx:(Math.random()-.5)*90,vy:-60-Math.random()*90,l:1})}
      cx.save();interior();cx.clip();
      if(level>.003){
        /* water body */
        cx.beginPath();cx.moveTo(40,sy);for(var x=40;x<=320;x+=6){cx.lineTo(x,sy+Math.sin(x*.05+tt*3.2)*amp*.6+Math.sin(x*.11-tt*4.6)*amp*.35)}cx.lineTo(320,500);cx.lineTo(40,500);cx.closePath();
        var wg=cx.createLinearGradient(0,sy,0,BOT);wg.addColorStop(0,rgba(col,.32));wg.addColorStop(.5,rgba(col,.52));wg.addColorStop(1,rgba(col,.78));cx.fillStyle=wg;cx.fill();
        /* light through the water */
        var lg=cx.createLinearGradient(63,0,297,0);lg.addColorStop(0,'rgba(255,255,255,.28)');lg.addColorStop(.3,'rgba(255,255,255,0)');lg.addColorStop(.75,'rgba(255,255,255,0)');lg.addColorStop(1,'rgba(255,255,255,.18)');cx.fillStyle=lg;cx.fill();
        /* meniscus */
        cx.beginPath();for(var x2=40;x2<=320;x2+=6){var yy=sy+Math.sin(x2*.05+tt*3.2)*amp*.6+Math.sin(x2*.11-tt*4.6)*amp*.35;if(x2===40)cx.moveTo(x2,yy);else cx.lineTo(x2,yy)}cx.strokeStyle='rgba(255,255,255,.75)';cx.lineWidth=2;cx.stroke();
        /* hydrogen bubbles: more and faster as the setting rises */
        var rate=(4+hz*70)*(still?0:1);if(Math.random()<rate*dt)B.push({x:xl(BOT)+12+Math.random()*(xr(BOT)-xl(BOT)-24),y:BOT-4,r:.8+Math.random()*(1.2+hz*2.2),v:18+hz*90+Math.random()*30,w:Math.random()*6})}
      for(var i=B.length-1;i>=0;i--){var b=B[i];b.y-=b.v*dt*(.7+hz*.6);b.w+=dt*4;b.x+=Math.sin(b.w)*.25;if(b.y<sy+2||level<.02){B.splice(i,1);continue}
        cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.283);cx.strokeStyle='rgba(255,255,255,.85)';cx.lineWidth=.9;cx.stroke();cx.fillStyle='rgba(255,255,255,.18)';cx.fill()}
      if(B.length>220)B.splice(0,B.length-220);
      cx.restore();
      for(var d=drops.length-1;d>=0;d--){var p=drops[d];p.vy+=420*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt*2.2;if(p.l<=0||p.y>sy+4&&p.vy>0){drops.splice(d,1);continue}cx.globalAlpha=Math.max(0,p.l);cx.fillStyle=rgba(col,.8);cx.beginPath();cx.arc(p.x,p.y,1.6,0,6.283);cx.fill()}
      cx.globalAlpha=1}
    function loop(now){raf=0;if(!vis)return;var dt=Math.min(.05,(now-last)/1000||.016);last=now;draw(dt);raf=requestAnimationFrame(loop)}
    function kick(){if(!raf&&vis){last=performance.now();raf=requestAnimationFrame(loop)}}
    function pourNow(){lastIn=performance.now();pourT=1;levelT=Math.min(.86,levelT+.02);setTimeout(function(){levelT=.82},500);kick()}
    R.addEventListener('input',function(){choose(nearest(+R.value));pourNow()});
    R.addEventListener('change',function(){R.value=S[idx].ph;pourNow()});
    ticks.forEach(function(t){t.addEventListener('click',function(){var i=+t.dataset.i;R.value=S[i].ph;choose(i);pourNow()})});
    size();addEventListener('resize',function(){size();if(still)draw(0)});
    choose(4,true);
    if(still){level=.82;draw(0);return}
    var filled=false;
    if('IntersectionObserver' in window){new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis){if(!filled){filled=true;level=0;levelT=.82;pourT=1;lastIn=performance.now()+900}kick()}},{threshold:.25}).observe(G)}
    else{level=.82;vis=true;kick()}
  })();
})();
