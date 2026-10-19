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
    var gx=0,gy=0,gq=false;addEventListener('pointermove',function(e){gx=e.clientX;gy=e.clientY;if(!gq){gq=true;requestAnimationFrame(function(){gq=false;glow.style.opacity=1;glow.style.transform='translate3d('+gx+'px,'+gy+'px,0)'})}},{passive:true});
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

  /* page heroes: arch frame (CSS-animated, no canvas) + per-page tint from the pH spectrum */
  var tints={'about.html':['#29AAE2','#BDE7FA'],'products.html':['#1C6BD6','#C7DAF7'],'why-tyent.html':['#4E4BD8','#D3D2F7'],'why-water-ionizer.html':['#2FB36E','#C4EBD5'],'certifications.html':['#25AC9B','#C2ECE6'],'blogs.html':['#F09A3A','#FBDDB8'],'contact.html':['#29AAE2','#BDE7FA']};
  var pg=location.pathname.split('/').pop()||'index.html',tn=tints[pg]||tints['about.html'];
  document.querySelectorAll('.phero').forEach(function(ph){ph.style.setProperty('--hz-c',tn[0]);ph.style.setProperty('--hz-c2',tn[1])});
  document.querySelectorAll('.phero-media').forEach(function(m){
    var photo=m.querySelector('img.photo'),cut=m.querySelector('img.cut');
    m.classList.add(photo?'is-photo':'is-cut');
    var arch=document.createElement('div');arch.className='p-arch';arch.setAttribute('aria-hidden','true');
    arch.innerHTML='<div class="hz-tint"></div>'+(photo?'':'<div class="hz-causw"><div class="hz-caus a"></div><div class="hz-caus b"></div></div>')+'<div class="hz-sheen"></div>';
    if(photo){arch.prepend(photo)}
    m.prepend(arch);
    var shadow=document.createElement('div');shadow.className='hz-shadow';m.appendChild(shadow);
    if(fine){var card=m.closest('.phero-card'),tx=0,ty=0,cx2=0,cy2=0,run=false;
      card.addEventListener('pointermove',function(e){var r=card.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;if(!run){run=true;requestAnimationFrame(tick)}});
      card.addEventListener('pointerleave',function(){tx=ty=0;if(!run){run=true;requestAnimationFrame(tick)}});
      function tick(){cx2+=(tx-cx2)*.1;cy2+=(ty-cy2)*.1;m.style.setProperty('--px',(cx2*-16).toFixed(1)+'px');m.style.setProperty('--py',(cy2*-12).toFixed(1)+'px');
        if(Math.abs(tx-cx2)>.002||Math.abs(ty-cy2)>.002)requestAnimationFrame(tick);else run=false}}
  });

  /* editorial headings: last word becomes the italic accent */
  document.querySelectorAll('.sec-head h2,.hx-head h2,.rail-head h2,h2.h2,.ch-copy h2,.pin-copy h2,.band h2,.trust h2,.uce h2,.hx-coll-head h2,.hx-demo h2,.hx-tech-copy h2,.hx-trust h2,.hx-faq h2').forEach(function(h){
    if(h.querySelector('em,b'))return;var t=h.lastChild;if(!t||t.nodeType!==3)return;
    var m=t.textContent.match(/^([\s\S]*?)(\S+?)([.?!]?)\s*$/);if(!m||!m[2])return;
    t.textContent=m[1];var em=document.createElement('em');em.textContent=m[2];h.appendChild(em);if(m[3])h.appendChild(document.createTextNode(m[3]));
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

/* ===== water cursor, click ripples ===== */
(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches&&!still,dpr=Math.min(devicePixelRatio||1,1.5);
  /* water cursor + ripples (desktop pointers only) */
  if(!fine)return;
  document.documentElement.classList.add('has-cur');
  var ring=document.createElement('div');ring.id='cur';var dot=document.createElement('div');dot.id='curdot';
  var rc=document.createElement('canvas');rc.id='ripples';rc.setAttribute('aria-hidden','true');
  document.body.appendChild(rc);document.body.appendChild(ring);document.body.appendChild(dot);
  var x=innerWidth/2,y=innerHeight/2,rx=x,ry=y,rx2=rc.getContext('2d'),RW,RH,rips=[],dirty=false;
  function rs(){RW=innerWidth;RH=innerHeight;rc.width=RW*dpr;rc.height=RH*dpr;rx2.setTransform(dpr,0,0,dpr,0,0)}rs();addEventListener('resize',rs);
  addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;ring.classList.add('on');dot.classList.add('on');
    var t=e.target.closest&&e.target.closest('a,button,[role="button"],input,select,textarea,label,.hx-p,.post,.feat');ring.classList.toggle('big',!!t&&!e.target.closest('input,select,textarea'))});
  document.addEventListener('pointerleave',function(){ring.classList.remove('on');dot.classList.remove('on')});
  addEventListener('pointerdown',function(e){ring.classList.add('press');for(var k=0;k<3;k++)rips.push({x:e.clientX,y:e.clientY,r:4,d:k*7,a:.6})});
  addEventListener('pointerup',function(){ring.classList.remove('press')});
  (function lp(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;ring.style.transform='translate('+rx+'px,'+ry+'px)'+(ring.classList.contains('press')?' scale(.8)':'');dot.style.transform='translate('+x+'px,'+y+'px)';
    if(rips.length||dirty){rx2.clearRect(0,0,RW,RH);dirty=rips.length>0}
    for(var i=rips.length-1;i>=0;i--){var r=rips[i];if(r.d>0){r.d--;continue}r.r+=3.2;r.a*=.955;if(r.a<.02){rips.splice(i,1);continue}
      rx2.beginPath();rx2.arc(r.x,r.y,r.r,0,6.28);rx2.strokeStyle='rgba(41,170,226,'+r.a+')';rx2.lineWidth=1.5;rx2.stroke()}
    requestAnimationFrame(lp)})();
})();

/* ===== V11 motion layer: headings, waves, icon sketching, photo drift, quote scrub, stack, marquee lean ===== */
(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches,IO='IntersectionObserver' in window;
  function watch(els,cls,opts){if(!els.length)return;if(!IO||still){els.forEach(function(e){e.classList.remove('pre');e.classList.add(cls||'in')});return}
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.remove('pre');en.target.classList.add(cls||'in');io.unobserve(en.target)}})},opts||{rootMargin:'0px 0px -10% 0px'});
    els.forEach(function(e){if(e.getBoundingClientRect().top>innerHeight*.9)e.classList.add('pre');else e.classList.add(cls||'in');io.observe(e)})}
  var WAVE='<svg class="wave" viewBox="0 0 120 10" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M1 6 C 9 1, 16 1, 24 5 S 39 9, 47 5 S 62 1, 70 5 S 85 9, 93 5 S 108 1, 119 4"/></svg>';

  /* 1. section headings: split into rising words, draw a wave under the accent */
  var H=[].slice.call(document.querySelectorAll('.sec-head h2,.hx-head h2,.rail-head h2,h2.h2,.ch-copy h2,.pin-copy h2,.band h2,.trust h2,.uce h2,.hx-coll-head h2,.hx-demo h2,.hx-tech-copy h2,.hx-trust h2,.hx-faq h2'));
  H.forEach(function(h){var i=0;h.classList.add('split');h.setAttribute('aria-label',h.textContent.replace(/\s+/g,' ').trim());
    function wrap(node){[].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(' '));return}
        var w=document.createElement('span');w.className='wl';w.setAttribute('aria-hidden','true');var s=document.createElement('span');s.textContent=t;s.style.setProperty('--i',i++);w.appendChild(s);f.appendChild(w)});node.replaceChild(f,n)}
      else if(n.nodeType===1&&n.tagName!=='svg'){wrap(n)}})}
    wrap(h);h.querySelectorAll('em').forEach(function(em){em.insertAdjacentHTML('beforeend',WAVE)});
  });
  watch(H,'in');

  /* 2. icons sketch themselves */
  var ics=[].slice.call(document.querySelectorAll('.vcard .ic svg,.hx-feats svg,.cc .ic svg,.ccard .ic svg,.hx-feat-list .ic svg,.dd-panel .ic svg'));
  ics.forEach(function(sv){sv.querySelectorAll('path,circle,rect,line,polyline,ellipse').forEach(function(p){p.setAttribute('pathLength','1')});sv.classList.add('draw')});
  if(!IO||still)ics.forEach(function(s){s.classList.add('drawn')});
  else{var io2=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('drawn');io2.unobserve(en.target)}})},{threshold:.6});ics.forEach(function(s){io2.observe(s)})}
  document.querySelectorAll('.dd').forEach(function(d){d.addEventListener('mouseenter',function(){d.querySelectorAll('.draw').forEach(function(s){s.classList.add('drawn')})})});

  /* 3. footer word settles */
  watch([].slice.call(document.querySelectorAll('footer .giant')),'in',{threshold:.3});

  /* 4. quotes light up word by word as you read */
  var Q=[].slice.call(document.querySelectorAll('.quote p'));var qWords=[];
  Q.forEach(function(q){var ws=[];q.childNodes.forEach&&[].slice.call(q.childNodes).forEach(function(n){if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return}var s=document.createElement('i');s.className='qw';s.textContent=t;ws.push(s);f.appendChild(s)});q.replaceChild(f,n)}});qWords.push([q,ws])});

  /* 5. photo drift + stack depth + marquee lean: one rAF-throttled scroll loop */
  var pars=[].slice.call(document.querySelectorAll('.frame:not(.cut),.feat .im')).filter(function(f){return f.querySelector('img')});
  pars.forEach(function(f){f.classList.add('par');f.querySelector('img').style.scale='1.12'});
  var vis=new Set();if(IO){var io3=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting)vis.add(en.target);else vis.delete(en.target)})},{rootMargin:'100px'});pars.forEach(function(p){io3.observe(p)})}
  var stack=[].slice.call(document.querySelectorAll('.stack>.vcard'));stack.forEach(function(c,i){c.style.setProperty('--i',i)});
  var bands=[].slice.call(document.querySelectorAll('.wordband,.certs'));
  var lastY=scrollY,vel=0,ticking=false;
  function frame(){ticking=false;var vh=innerHeight;
    if(!still){vis.forEach(function(f){var r=f.getBoundingClientRect(),k=(r.top+r.height/2-vh/2)/vh;f.querySelector('img').style.translate='0 '+(k*-6).toFixed(2)+'%'});}
    qWords.forEach(function(q){var r=q[0].getBoundingClientRect();if(r.bottom<0||r.top>vh)return;var k=(vh*.85-r.top)/(r.height+vh*.4),n=q[1].length;q[1].forEach(function(w,i){var t=Math.max(0,Math.min(1,k*n-i+1));w.style.setProperty('--o',(.22+.78*t).toFixed(2))})});
    stack.forEach(function(c,i){var nx=stack[i+1];if(!nx)return;var a=c.getBoundingClientRect(),b=nx.getBoundingClientRect(),cover=Math.max(0,Math.min(1,(a.bottom-b.top)/a.height));c.style.transform=still?'':'scale('+(1-cover*.05).toFixed(3)+')';c.classList.toggle('under',cover>.3)});
    if(!still){var y=scrollY;vel+=((y-lastY)-vel)*.2;lastY=y;var sk=Math.max(-8,Math.min(8,vel*.25));bands.forEach(function(b){b.style.transform='skewX('+(-sk).toFixed(2)+'deg)'});if(Math.abs(vel)>.3){ticking=true;requestAnimationFrame(frame)}}
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});frame();
})();

/* ===== V12: footer logo fills with water as you arrive, sloshes toward the cursor ===== */
(function(){
  var fm=document.getElementById('fmark');if(!fm)return;
  var lvl=document.getElementById('fmlevel'),still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur=.12,target=.12,ang=0,angT=0,boost=0,running=false,vis=false;
  function goal(){var r=fm.getBoundingClientRect(),vh=innerHeight,k=(vh-r.top)/(vh*.55+r.height*.6);k=Math.max(0,Math.min(1,k));return .1+.43*(k*k*(3-2*k))}
  function apply(){var L=660-(cur+boost)*282;lvl.setAttribute('transform','translate(0 '+L.toFixed(2)+') rotate('+ang.toFixed(2)+' 540 0)')}
  if(still){cur=.5;apply();return}
  function tick(){cur+=(target-cur)*.06;ang+=(angT-ang)*.08;apply();
    if(Math.abs(target-cur)>.0008||Math.abs(angT-ang)>.01){requestAnimationFrame(tick)}else running=false}
  function kick(){if(!running){running=true;requestAnimationFrame(tick)}}
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis){target=goal();kick()}},{rootMargin:'200px'}).observe(fm);
  addEventListener('scroll',function(){if(!vis)return;target=goal();kick()},{passive:true});
  var calm;
  fm.addEventListener('pointermove',function(e){var r=fm.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5;angT=x*-7;boost=.05;fm.classList.add('stir');fm.style.setProperty('--glow',1);clearTimeout(calm);calm=setTimeout(function(){fm.classList.remove('stir')},700);kick()});
  fm.addEventListener('pointerleave',function(){angT=0;boost=0;fm.classList.remove('stir');fm.style.setProperty('--glow',.6);kick()});
  fm.addEventListener('pointerdown',function(){fm.classList.add('stir');boost=.09;kick();setTimeout(function(){boost=.05;kick()},400)});
  apply();
})();
