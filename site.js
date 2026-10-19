/* Tyent India: shared behaviour for every page (theme, header, menus, reveals, counters, forms) */
(function(){
  var root=document.documentElement,still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return document.getElementById(id)}

  /* theme: white by default, dark on request */
  try{if(localStorage.getItem('tyent-theme')==='dark')root.setAttribute('data-theme','dark')}catch(e){}
  var tb=$('theme');
  if(tb)tb.addEventListener('click',function(){
    var d=root.getAttribute('data-theme')==='dark';
    if(d)root.removeAttribute('data-theme');else root.setAttribute('data-theme','dark');
    tb.setAttribute('aria-label',d?'Switch to dark theme':'Switch to white theme');
    try{localStorage.setItem('tyent-theme',d?'light':'dark')}catch(e){}
  });

  /* header state */
  var hdr=$('hdr');
  function hs(){if(hdr)hdr.classList.toggle('scrolled',scrollY>10)}
  addEventListener('scroll',hs,{passive:true});hs();

  /* dropdowns: hover on desktop, tap anywhere */
  var dds=[].slice.call(document.querySelectorAll('.dd'));
  function closeAll(except){dds.forEach(function(d){if(d!==except){d.classList.remove('open');d.querySelector('.dd-btn').setAttribute('aria-expanded','false')}})}
  dds.forEach(function(d){
    var b=d.querySelector('.dd-btn');
    b.addEventListener('click',function(e){e.stopPropagation();var o=!d.classList.contains('open');closeAll(d);d.classList.toggle('open',o);b.setAttribute('aria-expanded',o)});
    d.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches){closeAll(d);d.classList.add('open');b.setAttribute('aria-expanded','true')}});
    d.addEventListener('mouseleave',function(){if(matchMedia('(hover:hover)').matches){d.classList.remove('open');b.setAttribute('aria-expanded','false')}});
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.dd'))closeAll()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();closeDrawer()}});

  /* mobile drawer */
  var drawer=$('drawer'),burger=$('burger');
  function openDrawer(){if(!drawer)return;drawer.hidden=false;requestAnimationFrame(function(){drawer.classList.add('show')});burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'}
  function closeDrawer(){if(!drawer||drawer.hidden)return;drawer.classList.remove('show');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';setTimeout(function(){drawer.hidden=true},still?0:350)}
  if(burger)burger.addEventListener('click',openDrawer);
  if(drawer){drawer.querySelector('.dr-close').addEventListener('click',closeDrawer);drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeDrawer)})}

  /* cursor light and magnetic buttons */
  var fine=matchMedia('(pointer:fine)').matches&&!still,glow=$('glow');
  if(fine&&glow){
    addEventListener('pointermove',function(e){glow.style.opacity=1;glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
    document.querySelectorAll('.mag').forEach(function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)'});
      b.addEventListener('pointerleave',function(){b.style.transform=''});
    });
  }

  /* reveal on scroll: content is visible at rest, only its position animates */
  var rvs=[].slice.call(document.querySelectorAll('.sec-head,.show,.uce,.trust,.demo,.rail-head,.choose,.rv-auto,.band,.quote,.guide-wrap,.feat,.two>div:not(.frame)'));
  rvs.forEach(function(el){el.classList.add('rv')});
  if('IntersectionObserver' in window&&!still){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.remove('pre');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rvs.forEach(function(el){if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el)}});
  }

  /* count-up numbers */
  var nums=[].slice.call(document.querySelectorAll('[data-to]'));
  if('IntersectionObserver' in window&&!still){
    var io2=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;io2.unobserve(en.target);
      var el=en.target,to=+el.dataset.to,suf=el.dataset.suf||'',t0=performance.now();
      (function st(t){var k=Math.min(1,(t-t0)/1300);el.textContent=Math.round(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(st)})(t0)})},{threshold:.6});
    nums.forEach(function(n){io2.observe(n)});
  }

  /* accordions */
  document.querySelectorAll('.acc button').forEach(function(b){
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',o);$(b.getAttribute('aria-controls')).hidden=!o});
  });

  /* enquiry forms (no backend in this concept) */
  document.querySelectorAll('form[data-enquiry]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var nm=f.querySelector('[name=name]').value.trim(),mob=f.querySelector('[name=mobile]').value.replace(/\D/g,''),c=f.querySelector('[name=city]').value.trim(),ok=f.querySelector('.ok');
      if(!nm||mob.length<10||!c){ok.classList.remove('done');ok.textContent='Add your name, a 10-digit mobile number and your city to continue.';return}
      ok.classList.add('done');ok.innerHTML='<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" fill="var(--ph7)"/><path d="M8 14.5l4 4 8-9" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Thanks, '+nm.split(' ')[0].replace(/</g,'')+'. On the live site this request goes straight to the Tyent team in '+c.replace(/</g,'')+'.</span>';
    });
  });

  /* copy buttons */
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){var t=b.getAttribute('data-copy'),lab=b.textContent;
      function done(){b.textContent='Copied';setTimeout(function(){b.textContent=lab},1600)}
      if(navigator.clipboard){navigator.clipboard.writeText(t).then(done,function(){})}});
  });
})();

/* ===== V6 motion layer ===== */
(function(){
  var root=document.documentElement,still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(pointer:fine)').matches&&!still;
  function $(id){return document.getElementById(id)}

  /* progress bar + hide-on-scroll header */
  var bar=document.createElement('div');bar.id='progress';document.body.appendChild(bar);
  var hdr=$('hdr'),lastY=scrollY;
  function onScroll(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')';
    var y=scrollY,down=y>lastY;if(hdr&&!document.querySelector('.dd.open')){var hide=down&&y>260;hdr.classList.toggle('hide',hide);document.body.classList.toggle('hdr-hidden',hide)}lastY=y}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* page transitions between our own pages */
  if(!still){
    var logo='<img src="img/logo-white.webp" alt="">';
    var arrived=false;try{arrived=sessionStorage.getItem('tyent-pt')==='1';sessionStorage.removeItem('tyent-pt')}catch(e){}
    if(arrived){var c=document.createElement('div');c.className='curtain reveal';c.innerHTML=logo;document.body.appendChild(c);setTimeout(function(){c.remove()},1000)}
    document.addEventListener('click',function(e){
      var a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;
      var href=a.getAttribute('href');if(!href||href.charAt(0)==='#'||/^(https?:|mailto:|tel:)/.test(href))return;
      var url=new URL(a.href,location.href);if(url.pathname===location.pathname){return}
      e.preventDefault();var c=document.createElement('div');c.className='curtain cover';c.innerHTML=logo;
      c.style.setProperty('--cx',e.clientX+'px');c.style.setProperty('--cy',e.clientY+'px');document.body.appendChild(c);
      try{sessionStorage.setItem('tyent-pt','1')}catch(err){}
      setTimeout(function(){location.href=a.href},520);
    });
    addEventListener('pageshow',function(ev){if(ev.persisted)document.querySelectorAll('.curtain').forEach(function(c){c.remove()})});
  }

  /* split page headlines into rising words */
  function split(el){var i=0;
    (function walk(node){[].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;
        if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(' '));return}
        var w=document.createElement('span');w.className='wd';var inner=document.createElement('span');inner.textContent=t;inner.style.setProperty('--i',i++);
        if(node.classList&&node.classList.contains('grad-t'))inner.className='grad-t';w.appendChild(inner);f.appendChild(w)});node.replaceChild(f,n)}
      else if(n.nodeType===1){if(n.classList.contains('grad-t')){n.classList.remove('grad-t');n.classList.add('was-grad');walkGrad(n)}else walk(n)}})})(el);
    function walkGrad(n){[].slice.call(n.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(' '));return}
      var w=document.createElement('span');w.className='wd';var inner=document.createElement('span');inner.className='grad-t';inner.textContent=t;inner.style.setProperty('--i',i++);w.appendChild(inner);f.appendChild(w)});n.replaceChild(f,c)}})}
  }
  if(!still)document.querySelectorAll('.phero h1').forEach(split);

  /* staggered grids + image zooms */
  var grids=[].slice.call(document.querySelectorAll('.cards,.certgrid,.posts,.ccards,.stats,.tline,.marks,.care,.cgrid,.promise,.nums,.models'));
  grids.forEach(function(g){g.classList.add('stagger');[].slice.call(g.children).forEach(function(c,i){c.style.setProperty('--i',i%6)})});
  var zooms=[].slice.call(document.querySelectorAll('.frame:not(.cut),.wcard .ph,.ccard .im,.feat .im'));
  zooms.forEach(function(z){z.classList.add('zoom')});
  if('IntersectionObserver' in window&&!still){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.remove('pre');io.unobserve(en.target)}})},{rootMargin:'0px 0px -6% 0px'});
    grids.concat(zooms).forEach(function(el){if(el.getBoundingClientRect().top>innerHeight*.92){el.classList.add('pre');io.observe(el)}});
  }

  /* tilt + spotlight cards */
  if(fine){
    document.querySelectorAll('.vcard,.cert,.cc,.ccard,.promise article').forEach(function(c){
      c.classList.add('tilt');
      c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',y*100+'%');
        c.style.transform='perspective(1000px) rotateX('+((.5-y)*6)+'deg) rotateY('+((x-.5)*8)+'deg) translateY(-6px)'});
      c.addEventListener('pointerleave',function(){c.style.transform=''});
    });
    document.addEventListener('pointerover',function(e){var b=e.target.closest('.btn');if(!b)return;var r=b.getBoundingClientRect();b.style.setProperty('--x',(e.clientX-r.left)+'px');b.style.setProperty('--y',(e.clientY-r.top)+'px')});
    var g=document.querySelector('.giant');
    if(g){g.addEventListener('pointermove',function(e){var r=g.getBoundingClientRect();g.classList.add('lit');g.style.setProperty('--gx',(e.clientX-r.left)+'px');g.style.setProperty('--gy',(e.clientY-r.top)+'px')});g.addEventListener('pointerleave',function(){g.classList.remove('lit')})}
  }

  /* water bubbles in page heroes */
  document.querySelectorAll('.phero-card').forEach(function(card){
    var cv=document.createElement('canvas');cv.className='bub';cv.setAttribute('aria-hidden','true');card.prepend(cv);
    var cx=cv.getContext('2d'),W,H,B=[],dpr=Math.min(devicePixelRatio||1,2),col;
    function size(){W=card.offsetWidth;H=card.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);B=[];var n=Math.round(W*H/7000);
      for(var i=0;i<n;i++)B.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*3+.6,s:Math.random()*.45+.12,w:Math.random()*6.28})}
    function tone(){col=getComputedStyle(root).getPropertyValue('--accent').trim()||'#1C6BD6'}
    size();tone();addEventListener('resize',size);
    new MutationObserver(tone).observe(root,{attributes:true,attributeFilter:['data-theme']});
    var vis=true;if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(card);
    (function loop(){if(vis){cx.clearRect(0,0,W,H);cx.strokeStyle=col;cx.lineWidth=1;
      for(var i=0;i<B.length;i++){var b=B[i];if(!still){b.y-=b.s;b.w+=.02;b.x+=Math.sin(b.w)*.25;if(b.y<-6){b.y=H+6;b.x=Math.random()*W}}
        cx.globalAlpha=.12+b.r*.06;cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.28);cx.stroke()}}
      if(!still)requestAnimationFrame(loop)})();
    /* gentle parallax on hero media */
    var m=card.querySelector('.phero-media');
    if(m&&fine){card.addEventListener('pointermove',function(e){var r=card.getBoundingClientRect();m.style.transform='translate('+((e.clientX-r.left)/r.width-.5)*-18+'px,'+((e.clientY-r.top)/r.height-.5)*-14+'px)'});card.addEventListener('pointerleave',function(){m.style.transform=''})}
  });

  /* timeline draws with scroll */
  var tl=document.querySelector('.tline');
  if(tl&&!still){var steps=[].slice.call(tl.children);
    function tlScroll(){var r=tl.getBoundingClientRect(),k=Math.max(0,Math.min(1,(innerHeight*.8-r.top)/(r.height+innerHeight*.3)));tl.style.setProperty('--tp',k.toFixed(3));
      steps.forEach(function(s,i){s.classList.toggle('lit',k>=(i+.5)/steps.length)})}
    addEventListener('scroll',tlScroll,{passive:true});tlScroll()}
})();

/* footer water line */
(function(){var c=document.querySelector('footer canvas.fwave');if(!c)return;var x=c.getContext('2d'),w,h,d=Math.min(devicePixelRatio||1,2),still=matchMedia('(prefers-reduced-motion: reduce)').matches,vis=false;
  function sz(){w=c.offsetWidth;h=c.offsetHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0)}sz();addEventListener('resize',sz);
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(c);
  function f(tm){var t=(tm||0)*.001;x.clearRect(0,0,w,h);[[.3,'rgba(142,216,248,.25)',10,.5],[.45,'rgba(41,170,226,.18)',14,.8]].forEach(function(L){x.beginPath();for(var X=0;X<=w;X+=10){var Y=h*L[0]+Math.sin(X*.008+t*L[3])*L[2];if(X===0)x.moveTo(X,Y);else x.lineTo(X,Y)}x.strokeStyle=L[1];x.lineWidth=1.4;x.stroke()})}
  (function lp(tm){if(vis||still)f(tm);if(!still)requestAnimationFrame(lp)})();})();

/* ===== V8: page-hero water ribbons, water cursor, click ripples ===== */
(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches&&!still,dpr=Math.min(devicePixelRatio||1,2);
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function bez(P,t){var u=1-t;return [u*u*u*P[0][0]+3*u*u*t*P[1][0]+3*u*t*t*P[2][0]+t*t*t*P[3][0],u*u*u*P[0][1]+3*u*u*t*P[1][1]+3*u*t*t*P[2][1]+t*t*t*P[3][1]]}
  var presets=[
    [[.42,1.02],[.62,.62],[.72,-.1],[1.06,.28]],
    [[.38,.12],[.7,.02],[.6,1.1],[1.05,.78]],
    [[.45,.95],[.55,.25],[.95,.95],[1.06,.12]],
    [[.36,.55],[.62,1.15],[.82,-.15],[1.06,.6]]
  ];
  var name=(location.pathname.split('/').pop()||'x'),h=0;for(var i=0;i<name.length;i++)h=(h*31+name.charCodeAt(i))>>>0;
  document.querySelectorAll('.phero-card').forEach(function(card,ci){
    var floor=document.createElement('div');floor.className='floor';card.appendChild(floor);
    var cv=document.createElement('canvas');cv.className='rib';cv.setAttribute('aria-hidden','true');card.appendChild(cv);
    var cx=cv.getContext('2d'),W,H,mx=.5,my=.5,tx=.5,ty=.5,drops=[],vis=true,base=presets[(h+ci)%presets.length];
    function size(){W=card.offsetWidth;H=card.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
    size();addEventListener('resize',size);
    if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(card);
    if(fine)card.addEventListener('pointermove',function(e){var r=card.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=(e.clientY-r.top)/r.height});
    if(W<700)base=[[-.05,.9],[.4,.55],[.7,1.1],[1.05,.62]];
    function draw(tm){var t=tm*.001;mx+=(tx-mx)*.05;my+=(ty-my)*.05;cx.clearRect(0,0,W,H);
      var P=base.map(function(p){return p.slice()});
      P[1][0]+=(mx-.5)*.12;P[1][1]+=(my-.5)*.18+Math.sin(t*.6)*.03;P[2][0]+=(mx-.5)*.1+Math.cos(t*.5)*.025;P[2][1]+=(my-.5)*.14;
      var width=Math.min(W,H)*(W<700?.12:.11),N=20,steps=80,edges=[];
      cx.globalCompositeOperation='lighter';
      for(var i=0;i<N;i++){var f=i/(N-1)-.5,core=1-Math.abs(f)*2,ed=(i===0||i===N-1)?[]:null;cx.beginPath();
        for(var j=0;j<=steps;j++){var tt=j/steps,pt=bez(P,tt),p2=bez(P,Math.min(1,tt+.01)),dx=(p2[0]-pt[0])*W,dy=(p2[1]-pt[1])*H,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
          var taper=Math.pow(Math.sin(Math.PI*tt),.55),off=width*(f*Math.cos(tt*5-t*1.1+f*.6)+Math.sin(tt*9+t*1.6+i*.9)*.12)*taper,x=pt[0]*W+nx*off,y=pt[1]*H+ny*off;
          if(j)cx.lineTo(x,y);else cx.moveTo(x,y);if(ed)ed.push([x,y])}
        if(ed)edges.push(ed);
        var a=.07+core*.28,e0=bez(P,0),e1=bez(P,1),g=cx.createLinearGradient(e0[0]*W,e0[1]*H,e1[0]*W,e1[1]*H);
        g.addColorStop(0,'rgba(210,240,255,0)');g.addColorStop(.3,'rgba(210,240,255,'+a+')');g.addColorStop(.75,'rgba(210,240,255,'+a*1.1+')');g.addColorStop(1,'rgba(210,240,255,0)');
        cx.strokeStyle=g;cx.lineWidth=core>.7?2:1;cx.shadowBlur=core>.85?14:0;cx.shadowColor='rgba(142,216,248,.9)';cx.stroke()}
      cx.shadowBlur=0;
      if(edges.length===2){var e0b=bez(P,0),e1b=bez(P,1),gb=cx.createLinearGradient(e0b[0]*W,e0b[1]*H,e1b[0]*W,e1b[1]*H);gb.addColorStop(0,'rgba(120,200,245,0)');gb.addColorStop(.45,'rgba(120,200,245,.12)');gb.addColorStop(1,'rgba(120,200,245,0)');
        cx.beginPath();edges[0].forEach(function(q,n){if(n)cx.lineTo(q[0],q[1]);else cx.moveTo(q[0],q[1])});for(var n=edges[1].length-1;n>=0;n--)cx.lineTo(edges[1][n][0],edges[1][n][1]);cx.closePath();cx.fillStyle=gb;cx.fill()}
      if(!still&&drops.length<50&&Math.random()<.5){var pt=bez(P,Math.random());drops.push({x:pt[0]*W,y:pt[1]*H,vx:(Math.random()-.5)*2,vy:-Math.random()*2,r:Math.random()*2.4+.5,l:1})}
      for(var d=drops.length-1;d>=0;d--){var q=drops[d];q.x+=q.vx;q.y+=q.vy;q.vy+=.05;q.l-=.013;if(q.l<=0){drops.splice(d,1);continue}cx.globalAlpha=q.l*.8;cx.fillStyle='#DFF5FF';cx.beginPath();cx.arc(q.x,q.y,q.r,0,6.28);cx.fill()}
      cx.globalAlpha=1;cx.globalCompositeOperation='source-over'}
    (function lp(tm){if(vis||still)draw(tm||0);if(!still)requestAnimationFrame(lp)})();
  });

  /* water cursor + ripples (desktop pointers only) */
  if(!fine)return;
  document.documentElement.classList.add('has-cur');
  var ring=document.createElement('div');ring.id='cur';var dot=document.createElement('div');dot.id='curdot';
  var rc=document.createElement('canvas');rc.id='ripples';rc.setAttribute('aria-hidden','true');
  document.body.appendChild(rc);document.body.appendChild(ring);document.body.appendChild(dot);
  var x=innerWidth/2,y=innerHeight/2,rx=x,ry=y,rx2=rc.getContext('2d'),RW,RH,rips=[];
  function rs(){RW=innerWidth;RH=innerHeight;rc.width=RW*dpr;rc.height=RH*dpr;rx2.setTransform(dpr,0,0,dpr,0,0)}rs();addEventListener('resize',rs);
  addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;ring.classList.add('on');dot.classList.add('on');
    var t=e.target.closest&&e.target.closest('a,button,[role="button"],input,select,textarea,label,.hx-p,.post,.feat');ring.classList.toggle('big',!!t&&!e.target.closest('input,select,textarea'))});
  document.addEventListener('pointerleave',function(){ring.classList.remove('on');dot.classList.remove('on')});
  addEventListener('pointerdown',function(e){ring.classList.add('press');for(var k=0;k<3;k++)rips.push({x:e.clientX,y:e.clientY,r:4,d:k*7,a:.6})});
  addEventListener('pointerup',function(){ring.classList.remove('press')});
  (function lp(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;ring.style.transform='translate('+rx+'px,'+ry+'px)'+(ring.classList.contains('press')?' scale(.8)':'');dot.style.transform='translate('+x+'px,'+y+'px)';
    rx2.clearRect(0,0,RW,RH);
    for(var i=rips.length-1;i>=0;i--){var r=rips[i];if(r.d>0){r.d--;continue}r.r+=3.2;r.a*=.955;if(r.a<.02){rips.splice(i,1);continue}
      rx2.beginPath();rx2.arc(r.x,r.y,r.r,0,6.28);rx2.strokeStyle='rgba(41,170,226,'+r.a+')';rx2.lineWidth=1.5;rx2.stroke()}
    requestAnimationFrame(lp)})();
})();
