(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return document.getElementById(id)}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function sm(a,b,v){var t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)}
  function lerp(a,b,t){return a+(b-a)*t}
  var desk=function(){return matchMedia('(min-width:901px)').matches};

  /* ---------- journey: hero → ribbon → glass ---------- */
  var J=$('journey'),stick=J.querySelector('.hx-stick'),l1=$('l1'),l2=$('l2'),hcopy=$('hcopy'),hmach=$('hmach'),hscroll=$('hscroll'),hcopy2=$('hcopy2'),hglass=$('hglass'),bg=l2.querySelector('.bg');
  var water=hglass.querySelector('.gwater'),surf=hglass.querySelector('.gsurf'),bub=hglass.querySelector('.gbub');
  var cv=$('ribbon'),cx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(devicePixelRatio||1,2),p=0;
  function size(){var el=desk()?stick:l1;W=el.offsetWidth;H=el.offsetHeight;cv.style.height=H+'px';cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
  function level(k){var y=lerp(286,78,k);water.setAttribute('y',y);surf.setAttribute('cy',y);surf.style.opacity=k>.02?.9:0;bub.style.opacity=k>.3?.8:0}

  function layout(){
    if(!desk()){p=0;l2.style.opacity=1;level(.82);[hcopy,hmach,hcopy2,hglass,bg].forEach(function(e){e.style.transform='';e.style.opacity=''});return}
    var r=J.getBoundingClientRect(),span=J.offsetHeight-innerHeight;p=clamp(-r.top/span,0,1);
    var a=sm(.16,.36,p);
    hcopy.style.opacity=1-a;hcopy.style.transform='translateY(calc(-46% - '+(a*90)+'px))';
    var m=sm(.22,.5,p);
    hmach.style.opacity=1-sm(.34,.52,p);hmach.style.transform='translate('+(-m*14)+'vw,calc(-50% + '+(-p*60)+'px)) scale('+(1-m*.22)+') rotate('+(-m*4)+'deg)';
    hscroll.style.opacity=1-sm(0,.06,p);
    var o2=sm(.4,.58,p);l2.style.opacity=o2;
    bg.style.transform='scale('+(1.1-.08*o2)+')';
    hglass.style.transform='translateX(-50%) translateY('+((1-sm(.42,.6,p))*70)+'px)';
    level(sm(.6,.88,p));
    var c2=sm(.7,.88,p);hcopy2.style.opacity=c2;hcopy2.style.transform='translateY(calc(-58% + '+((1-c2)*50)+'px))';
  }

  /* ribbon geometry: three key paths, blended by scroll */
  function glassMouth(){var s=stick.getBoundingClientRect(),g=hglass.getBoundingClientRect();return [(g.left-s.left+g.width*.5)/W,(g.top-s.top+g.height*.06)/H]}
  function bez(P,t){var u=1-t;return [u*u*u*P[0][0]+3*u*u*t*P[1][0]+3*u*t*t*P[2][0]+t*t*t*P[3][0],u*u*u*P[0][1]+3*u*u*t*P[1][1]+3*u*t*t*P[2][1]+t*t*t*P[3][1]]}
  function mix(A,B,k){return A.map(function(pt,i){return [lerp(pt[0],B[i][0],k),lerp(pt[1],B[i][1],k)]})}
  var drops=[],rmx=.5,rmy=.5,rtx=.5,rty=.5;
  addEventListener('pointermove',function(e){rtx=e.clientX/innerWidth;rty=e.clientY/innerHeight},{passive:true});
  function draw(time){
    if(!W)return;cx.clearRect(0,0,W,H);
    var t=time*.001,mob=!desk();
    var A=mob?[[-.05,.78],[.3,1.02],[.62,.42],[1.05,.55]]:[[.3,.86],[.58,1.08],[.6,.06],[1.02,.16]];
    var B=[[-.08,.7],[.32,.12],[.66,1.0],[1.08,.3]];
    var gm=mob?[.5,.8]:glassMouth();
    var C=[[.18,.06],[.42,-.02],[gm[0]-.02,gm[1]-.32],[gm[0],gm[1]]];
    var k1=sm(.2,.48,p),k2=sm(.48,.7,p),P=mix(mix(A,B,k1),C,k2);
    rmx+=(rtx-rmx)*.05;rmy+=(rty-rmy)*.05;
    P[1][1]+=Math.sin(t*.7)*.03+(rmy-.5)*.16*(1-k2);P[2][0]+=Math.cos(t*.5)*.025+(rmx-.5)*.12*(1-k2);P[1][0]+=(rmx-.5)*.1*(1-k2);
    var s0=sm(.66,.86,p);if(s0>=.995)return;
    var dark=1-sm(.4,.56,p);
    var width=(mob?.11:.13)*Math.min(W,H)*(1+k1*.7-k2*.8);var edges=[];
    cx.globalCompositeOperation=dark>.5?'lighter':'source-over';
    var N=22,steps=90;
    for(var i=0;i<N;i++){
      var f=i/(N-1)-.5,core=1-Math.abs(f)*2;
      cx.beginPath();var ed=(i===0||i===N-1)?[]:null;
      for(var j=0;j<=steps;j++){
        var tt=lerp(s0,1,j/steps),pt=bez(P,tt),pt2=bez(P,Math.min(1,tt+.01));
        var dx=pt2[0]*W-pt[0]*W,dy=pt2[1]*H-pt[1]*H,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
        var taper=Math.pow(Math.sin(Math.PI*clamp(tt,0,1)),.55)*(1-.85*k2*tt*tt);
        var twist=Math.cos(tt*5.2-t*1.1+f*.6);
        var off=width*(f*twist+Math.sin(tt*9+t*1.7+i*.9)*.12)*taper;
        var x=pt[0]*W+nx*off,y=pt[1]*H+ny*off;
        if(j===0)cx.moveTo(x,y);else cx.lineTo(x,y);if(ed)ed.push([x,y]);
      }
      if(ed)edges.push(ed);
      var a=(.08+core*.3)*(dark>.5?1:.9);
      var e0=bez(P,s0),e1=bez(P,1);var g=cx.createLinearGradient(e0[0]*W,e0[1]*H,e1[0]*W,e1[1]*H);
      var col=dark>.5?'210,240,255':'40,130,205';
      g.addColorStop(0,'rgba('+col+',0)');g.addColorStop(.25,'rgba('+col+','+a+')');g.addColorStop(.7,'rgba('+col+','+(a*1.2)+')');g.addColorStop(1,'rgba('+col+','+(k2>.5?a:0)+')');
      cx.strokeStyle=g;cx.lineWidth=core>.7?2.2:1.1;
      if(core>.85&&dark>.5){cx.shadowColor='rgba(142,216,248,.9)';cx.shadowBlur=14}else cx.shadowBlur=0;
      cx.stroke();
    }
    cx.shadowBlur=0;
    /* translucent body of the ribbon */
    if(edges.length===2){var e0b=bez(P,s0),e1b=bez(P,1),gb=cx.createLinearGradient(e0b[0]*W,e0b[1]*H,e1b[0]*W,e1b[1]*H),cb=dark>.5?'120,200,245':'60,150,220';
      gb.addColorStop(0,'rgba('+cb+',0)');gb.addColorStop(.35,'rgba('+cb+',.13)');gb.addColorStop(.75,'rgba('+cb+',.16)');gb.addColorStop(1,'rgba('+cb+','+(k2>.5?.12:0)+')');
      cx.beginPath();edges[0].forEach(function(q,n){if(n)cx.lineTo(q[0],q[1]);else cx.moveTo(q[0],q[1])});for(var n=edges[1].length-1;n>=0;n--)cx.lineTo(edges[1][n][0],edges[1][n][1]);cx.closePath();cx.fillStyle=gb;cx.fill()}
    /* droplets thrown off the ribbon */
    if(!still&&drops.length<70&&Math.random()<.6){var tt=lerp(s0,1,Math.random()),pt=bez(P,tt);drops.push({x:pt[0]*W,y:pt[1]*H,vx:(Math.random()-.5)*2.2,vy:-Math.random()*2.2,r:Math.random()*2.6+.6,life:1})}
    for(var d=drops.length-1;d>=0;d--){var q=drops[d];q.x+=q.vx;q.y+=q.vy;q.vy+=.06;q.life-=.012;if(q.life<=0){drops.splice(d,1);continue}
      cx.globalAlpha=q.life*(dark>.5?.85:.5);cx.fillStyle=dark>.5?'#DFF5FF':'#3C8FD0';cx.beginPath();cx.arc(q.x,q.y,q.r,0,6.28);cx.fill()}
    cx.globalAlpha=1;cx.globalCompositeOperation='source-over';
  }
  var jVis=true;
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){jVis=e[0].isIntersecting},{rootMargin:'100px'}).observe(J);
  function loop(time){if(jVis)draw(time);if(!still)requestAnimationFrame(loop)}
  size();layout();
  if(still)draw(0);else requestAnimationFrame(loop);
  addEventListener('resize',function(){size();layout();if(still)draw(0)});
  addEventListener('scroll',function(){layout();if(still)draw(0)},{passive:true});

  /* hero parallax with the cursor */
  if(matchMedia('(pointer:fine)').matches&&!still){
    l1.addEventListener('pointermove',function(e){if(p>.05)return;var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;hmach.style.transform='translate('+(x*-18)+'px,calc(-50% + '+(y*-14)+'px)) rotate('+(x*2)+'deg)'});
  }

  /* ---------- technology reveal ---------- */
  var T=$('tech'),hs=[].slice.call(T.querySelectorAll('.hs')),tl=[].slice.call($('tlist').children),tbar=$('tbar');
  function tech(){
    if(!desk()){hs.forEach(function(h){h.classList.add('on')});tl.forEach(function(d){d.classList.add('on')});return}
    var r=T.getBoundingClientRect(),q=clamp(-r.top/(T.offsetHeight-innerHeight),0,1),act=Math.min(3,Math.floor(q*4.2));
    hs.forEach(function(h,i){h.classList.toggle('on',i===act)});tl.forEach(function(d,i){d.classList.toggle('on',i===act)});tbar.style.width=(q*100)+'%';
  }
  addEventListener('scroll',tech,{passive:true});addEventListener('resize',tech);tech();
  tl.forEach(function(d,i){d.addEventListener('pointerenter',function(){if(!desk())return;hs.forEach(function(h,j){h.classList.toggle('on',j===i)});tl.forEach(function(x,j){x.classList.toggle('on',j===i)})})});
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
})();
