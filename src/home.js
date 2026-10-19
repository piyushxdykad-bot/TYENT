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
})();
