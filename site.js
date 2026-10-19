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
      (function st(t){var k=Math.min(1,(t-t0)/1300);var vv=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=(el.dataset.fmt?vv.toLocaleString('en-IN'):vv)+suf;if(k<1)requestAnimationFrame(st)})(t0)})},{threshold:.6});
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
  document.querySelectorAll('.sec-head h2,.hx-head h2,.rail-head h2,h2.h2,.ch-copy h2,.pin-copy h2,.band h2,.trust h2,.uce h2,.hx-coll-head h2,.hx-demo h2,.hx-tech-copy h2,.hx-trust h2,.hx-faq h2,.mo-head h2').forEach(function(h){
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
  var H=[].slice.call(document.querySelectorAll('.sec-head h2,.hx-head h2,.rail-head h2,h2.h2,.ch-copy h2,.pin-copy h2,.band h2,.trust h2,.uce h2,.hx-coll-head h2,.hx-demo h2,.hx-tech-copy h2,.hx-trust h2,.hx-faq h2,.mo-head h2'));
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

/* ===== V12c: footer logo fills with water. Small canvas, max 30fps, only while visible ===== */
(function(){
  var fm=document.getElementById('fmark'),cv=document.getElementById('fmcv');if(!fm||!cv)return;
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches,cx=cv.getContext('2d'),RES=.6,W=0,H=0,mk=null,ready=false;
  var img=new Image();img.onload=function(){ready=true;size();draw(0)};img.src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22168 378 744 282%22 preserveAspectRatio=%22none%22 width=%22744%22 height=%22282%22%3E%3Cg fill=%22%23000%22%3E%3Cpath d=%22M457.66,501.61c0,6.52,0,12.11,0,18.4c42.91,0,85.79,0,128.95,0c0,7.91,0,15.12,0,23.12 c-42.92,0-85.8,0-128.56,0c-2.09,13.74,2.09,18.66,15.11,18.66c35.9,0,71.81,0,107.71-0.01c1.79,0,3.57,0,5.69,0 c0,7.62,0,14.83,0,22.85c-1.47,0-3.04,0-4.62,0c-36.07,0.02-72.15-0.42-108.2,0.21c-25.22,0.44-39.66-17.17-39.51-39.11 c0.08-11.25-0.02-22.51-0.04-33.76c0-1.59,0-3.18-1.04-5.18c-5.1,6.17-10.22,12.32-15.31,18.5c-5.77,7.03-11.34,14.23-17.34,21.05 c-2.74,3.11-3.72,6.29-3.62,10.31c0.21,9.08,0.07,18.16,0.07,27.63c-7.68,0-15,0-22.99,0c0-9.38-0.13-18.75,0.06-28.12 c0.08-3.84-0.86-6.84-3.42-9.88c-11.61-13.77-22.91-27.81-34.45-41.64c-1.11-1.33-3.13-2.69-4.74-2.71 c-22.17-0.16-44.34-0.09-66.51-0.05c-0.63,0-1.25,0.27-2.48,0.54c0,27.22,0,54.45,0,81.95c-7.84,0-15.06,0-22.78,0 c0-27.27,0-54.5,0-82.57c-2.39,0-4.29,0-6.18,0c-17.87,0-35.74-0.11-53.61,0.1c-3.97,0.05-5.27-1.15-5.03-5.06 c0.3-4.78,0.21-9.6,0.04-14.39c-0.11-3,0.92-4.15,3.99-4.01c4.46,0.2,8.93,0.06,13.4,0.05c48.48-0.01,96.96,0.06,145.43-0.14 c4.34-0.02,6.93,1.44,9.49,4.66c11.62,14.62,23.44,29.08,35.2,43.58c0.92,1.14,1.95,2.19,3.17,3.55 c11.28-13.71,22.89-26.84,33.3-40.86c6.22-8.37,13.03-11.24,23.49-11.09c46.15,0.64,92.32,0.28,138.48,0.28c1.79,0,3.58,0,5.72,0 c0,7.85,0,15.2,0,23.13C543.74,501.61,500.97,501.61,457.66,501.61z%22/%3E%3Cpath d=%22M743.61,478.77c54.12,0,107.49,0,161.54,0c0,7,0.05,13.73-0.02,20.47c-0.03,3.53-2.84,2.58-4.77,2.58 c-17.7,0.05-35.41,0.01-53.11-0.01c-1.96,0-3.92,0-6.43,0c0,27.62,0,54.84,0,82.44c-7.87,0-15.18,0-23,0c0-27.31,0-54.52,0-82.1 c-17.26,0-34.03,0-51.37,0c0,1.94,0,3.71,0,5.48c0,17.88,0.13,35.75-0.03,53.63c-0.12,13.16-8.94,23.18-21.8,24.74 c-8.43,1.02-15.52-2.35-21.49-8.15c-25.87-25.11-51.69-50.27-77.6-75.34c-1.71-1.66-3.99-2.73-7.28-4.93c0,30.01,0,58.22,0,86.75 c-7.82,0-15,0-22.56,0c-0.15-1.23-0.42-2.48-0.42-3.73c0-26.15-0.07-52.31,0.11-78.46c0.09-12.63,7.52-22.42,19.12-25.19 c9.08-2.16,17.5-0.2,24.33,6.39c20.94,20.22,41.75,40.58,62.62,60.87c5.57,5.42,11.13,10.86,16.81,16.16 c1.1,1.03,2.75,1.47,4.14,2.18c0.41-1.49,1.16-2.98,1.16-4.47c0.07-24.5,0.04-48.99,0.04-73.49 C743.61,482.8,743.61,481.01,743.61,478.77z%22/%3E%3Cpath d=%22M470.42,451.87c-8.73,0.67-15.11,0.75-21.46-5.36c-22.22-21.37-49.24-34.64-78.59-43.27 c-27.69-8.15-56.1-11.06-84.81-9.17c-38.42,2.53-74.82,12.23-107.41,33.7c-0.52,0.34-1.11,0.59-1.97,1.05 c14.54-21.4,84.24-43.84,134.52-42.65C371.74,387.61,425.43,407.57,470.42,451.87z%22/%3E%3Cpath d=%22M895.63,609.91c-54.83,56.26-168.89,53.76-221.19,2.51c33.46,22.96,70.75,33.09,110.93,32.82 C825.69,644.95,862.89,634.49,895.63,609.91z%22/%3E%3Cpath d=%22M194.99,438.87c54.71-44.11,156.05-45.43,213.25-0.66c-32.92-19.73-69.06-27.27-106.8-27.24 C263.7,411,227.69,418.74,194.99,438.87z%22/%3E%3Cpath d=%22M244.32,613.83v-2.22h13.33v2.22l-6.12,0.62h-1.21L244.32,613.83z M251.53,635.92l6.12,0.62v2.22h-13.33 v-2.22l6-0.62H251.53z M247.5,624.42c0-4.26,0-8.55-0.12-12.81h7.19c-0.12,4.17-0.12,8.47-0.12,12.81v1.5 c0,4.29,0,8.58,0.12,12.84h-7.19c0.12-4.17,0.12-8.47,0.12-12.81V624.42z%22/%3E%3Cpath d=%22M293.23,636.54l4.4-0.62h1.18l5.32,0.62v2.22h-10.9V636.54z M295.39,613.07l2.38,1.17l-4.48-0.38v-2.25h9.33 l14.82,20.35v6.89h-3.5L295.39,613.07z M296.75,611.61l2.66,2.25v24.9h-2.66V611.61z M310.06,611.61h10.9v2.22l-4.19,0.62h-1.15 l-5.56-0.62V611.61z M314.78,611.61h2.66v27.23l-2.66-2.66V611.61z%22/%3E%3Cpath d=%22M356.14,613.83v-2.22h6.65v2.84h-0.65L356.14,613.83z M362.79,635.92v2.84h-6.65v-2.22l6-0.62H362.79z M359.32,624.42c0-4.26,0-8.55-0.12-12.81h7.19c-0.12,4.17-0.12,8.47-0.12,12.81v1.36c0,4.42,0,8.72,0.12,12.98h-7.19 c0.12-4.17,0.12-8.47,0.12-12.95V624.42z M362.79,636.38h4.91c4.73,0,7.66-4.05,7.66-11.22c0-7.27-2.93-11.18-7.58-11.18h-4.99 v-2.38h5.63c8.81,0,14.11,5.14,14.11,13.5c0,8.63-5.82,13.65-14.85,13.65h-4.89V636.38z%22/%3E%3Cpath d=%22M417.38,613.83v-2.22h13.33v2.22l-6.12,0.62h-1.21L417.38,613.83z M424.59,635.92l6.12,0.62v2.22h-13.33 v-2.22l6-0.62H424.59z M420.56,624.42c0-4.26,0-8.55-0.12-12.81h7.19c-0.12,4.17-0.12,8.47-0.12,12.81v1.5 c0,4.29,0,8.58,0.12,12.84h-7.19c0.12-4.17,0.12-8.47,0.12-12.81V624.42z%22/%3E%3Cpath d=%22M465.47,636.54l4.25-0.62h0.74l3.92,0.62v2.22h-8.91V636.54z M477.22,611.55h4.27l9.3,27.21h-7.06 l-7.05-22.19l1.55-2.09l-7.89,24.28h-2.45L477.22,611.55z M472.78,628.46h11.16l0.93,2.41h-12.78L472.78,628.46z M479.72,636.63 l4.67-0.62h2.76l5.3,0.62v2.13h-12.74V636.63z%22/%3E%3C/g%3E%3C/svg%3E";
  function size(){var r=fm.getBoundingClientRect();W=Math.max(2,Math.round(r.width*RES));H=Math.max(2,Math.round(r.height*RES));cv.width=W;cv.height=H;
    if(ready){mk=document.createElement('canvas');mk.width=W;mk.height=H;mk.getContext('2d').drawImage(img,0,0,W,H)}}
  var cur=.9,target=.9,ang=0,angT=0,boost=0,amp=1,ampT=1,vis=false,last=0,t=0;
  var B=[];for(var i=0;i<9;i++)B.push({x:Math.random(),p:Math.random(),s:.06+Math.random()*.08,r:1+Math.random()*1.6});
  function goal(){var r=fm.getBoundingClientRect(),vh=innerHeight,k=(vh-r.top)/(vh*.55+r.height*.6);k=Math.max(0,Math.min(1,k));return .9-.43*(k*k*(3-2*k))}
  function wave(y0,A,P,ph,fill){cx.beginPath();cx.moveTo(-W*.2,H*1.6);for(var x=-W*.2;x<=W*1.2;x+=W/40){cx.lineTo(x,y0+Math.sin(x/(P*W)*6.283+ph)*A)}cx.lineTo(W*1.2,H*1.6);cx.closePath();cx.fillStyle=fill;cx.fill()}
  function draw(dt){if(!ready||!mk)return;t+=dt;
    cur+=(target-cur)*.12;ang+=(angT-ang)*.12;amp+=(ampT-amp)*.08;
    cx.globalCompositeOperation='source-over';cx.clearRect(0,0,W,H);
    cx.fillStyle='rgba(142,216,248,.08)';cx.fillRect(0,0,W,H);
    var y=(cur-boost)*H;cx.save();cx.translate(W/2,y);cx.rotate(ang*Math.PI/180);cx.translate(-W/2,-y);
    var A=H*.022*amp;
    var gb=cx.createLinearGradient(0,y-A,0,H);gb.addColorStop(0,'rgba(63,174,230,.55)');gb.addColorStop(1,'rgba(28,63,170,.55)');
    wave(y-A*.6,A*1.2,.33,-t*.7,gb);
    var gf=cx.createLinearGradient(0,y-A,0,H);gf.addColorStop(0,'#A6E4FC');gf.addColorStop(.12,'#5CC6F2');gf.addColorStop(.35,'#29AAE2');gf.addColorStop(1,'#1C3FAA');
    wave(y,A,.25,t*1.05,gf);
    cx.fillStyle='rgba(230,247,255,.8)';
    for(var i=0;i<B.length;i++){var b=B[i];b.p+=b.s*dt;if(b.p>1){b.p=0;b.x=Math.random()}var by=H-(H-y)*b.p;if(by>y+A){cx.globalAlpha=Math.sin(b.p*3.14)*.9;cx.beginPath();cx.arc(b.x*W,by,b.r*RES*2,0,6.283);cx.fill()}}
    cx.globalAlpha=1;cx.restore();
    cx.globalCompositeOperation='destination-in';cx.drawImage(mk,0,0);cx.globalCompositeOperation='source-over'}
  function loop(now){if(!vis)return;requestAnimationFrame(loop);if(now-last<33)return;var dt=Math.min(.1,(now-last)/1000||0);last=now;draw(dt)}
  if(still){cur=target=.47;addEventListener('resize',function(){size();draw(0)});return}
  addEventListener('resize',function(){size()});
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){var was=vis;vis=e[0].isIntersecting;if(vis){target=goal();if(!was){last=performance.now();requestAnimationFrame(loop)}}},{rootMargin:'80px'}).observe(fm);
  else{vis=true;requestAnimationFrame(loop)}
  addEventListener('scroll',function(){if(vis)target=goal()},{passive:true});
  var calm;
  fm.addEventListener('pointermove',function(e){var r=fm.getBoundingClientRect();angT=((e.clientX-r.left)/r.width-.5)*-7;boost=.05;ampT=2;fm.style.setProperty('--glow',1);clearTimeout(calm);calm=setTimeout(function(){ampT=1},700)});
  fm.addEventListener('pointerleave',function(){angT=0;boost=0;ampT=1;fm.style.setProperty('--glow',.6)});
  fm.addEventListener('pointerdown',function(){ampT=2.6;boost=.09;setTimeout(function(){boost=.05},400)});
})();

/* ===== V14: 3D plate stack (built here, driven by scroll on the home page or auto elsewhere) ===== */
(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches&&!still;
  var CAPS=['13 plates, dipped in platinum','Smart power reads your water','Polarity reverses to clean itself','Water flows between every plate'];
  document.querySelectorAll('.p3d').forEach(function(el){
    var N=+el.dataset.n||13,h='<div class="p3d-stack" style="--mid:'+((N-1)/2)+'"><div class="p3d-floor"></div>';
    for(var i=0;i<N;i++)h+='<div class="pl" style="--i:'+i+'"><b>'+(i%2?'−':'+')+'</b></div>';
    h+='<div class="p3d-ions">';for(var k=0;k<18;k++)h+='<i style="--x:'+(30+Math.random()*40).toFixed(1)+'%;--y:'+(18+Math.random()*64).toFixed(1)+'%;--t:'+(1.6+Math.random()*1.6).toFixed(2)+'s;--d:-'+(Math.random()*3).toFixed(2)+'s"></i>';
    h+='</div></div>';el.innerHTML=h;
    var stack=el.firstChild,wrap=el.parentNode,cap=wrap.querySelector('.p3d-cap');
    /* state setter, used by the home page's scroll story and by the auto cycle */
    el.setState=function(s){if(el.dataset.state===String(s))return;el.dataset.state=s;if(cap){cap.classList.add('swap');setTimeout(function(){cap.textContent=s==0?N+' plates, dipped in platinum':CAPS[s];cap.classList.remove('swap')},still?0:220)}
      var ds=wrap.querySelectorAll('.p3d-dots button');ds.forEach(function(b,j){b.setAttribute('aria-pressed',j===+s)})};
    /* rotation follows scroll position; tilt follows the pointer */
    var ry=-52,tx=0,ty=0,cx=0,cy=0,raf=0;
    function render(){raf=0;cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;stack.style.transform='rotateX('+(-12+cy*-8).toFixed(2)+'deg) rotateY('+(ry+cx*14).toFixed(2)+'deg)';if(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002)raf=requestAnimationFrame(render)}
    function onScroll(){if(still)return;var r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var k=(r.top+r.height/2)/innerHeight;ry=-66+k*30;if(!raf)raf=requestAnimationFrame(render)}
    addEventListener('scroll',onScroll,{passive:true});onScroll();
    if(fine){wrap.addEventListener('pointermove',function(e){var r=wrap.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;if(!raf)raf=requestAnimationFrame(render)});
      wrap.addEventListener('pointerleave',function(){tx=ty=0;if(!raf)raf=requestAnimationFrame(render)})}
    /* auto pages: dots + gentle cycle while visible */
    if(el.dataset.auto){var dots=document.createElement('div');dots.className='p3d-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','Plate stack stages');
      CAPS.forEach(function(c,j){var b=document.createElement('button');b.setAttribute('aria-label',c);b.setAttribute('aria-pressed',j===0);b.addEventListener('click',function(){el.setState(j);clearInterval(tm);tm=null});dots.appendChild(b)});wrap.appendChild(dots);
      var tm=null,n=0;if(!still&&'IntersectionObserver' in window)new IntersectionObserver(function(e){if(e[0].isIntersecting){if(!tm&&dots.dataset.stop!=='1')tm=setInterval(function(){n=(+el.dataset.state+1)%4;el.setState(n)},2600)}else{clearInterval(tm);tm=null}}).observe(el)}
  });
})();

/* ===== V15: floating talk-to-us drop (WhatsApp + call back) ===== */
(function(){
  /* Put Tyent India's WhatsApp number here, digits only with country code, e.g. '919876543210'.
     While it is empty, "WhatsApp us" collects the visitor's number so the team can message them. */
  var WHATSAPP='';
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var waIcon='<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.7 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';
  var phIcon='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';
  var msg=encodeURIComponent("Hi Tyent India, I'd like to know more about your water ionizers.");
  var waOpt=WHATSAPP?'<a class="wp-opt wa" href="https://wa.me/'+WHATSAPP+'?text='+msg+'" target="_blank" rel="noopener"><span class="ic">'+waIcon+'</span><span><b>Chat on WhatsApp</b><small>Usually replies within minutes</small></span><span class="go">→</span></a>'
                    :'<button class="wp-opt wa" data-mode="wa"><span class="ic">'+waIcon+'</span><span><b>WhatsApp us</b><small>Leave your number, we\'ll message you</small></span><span class="go">→</span></button>';
  var el=document.createElement('div');el.className='wpill';el.id='wpill';
  el.innerHTML='<div class="wp-panel" id="wp-panel" role="dialog" aria-label="Talk to Tyent India" hidden>'+
    '<div class="wp-top"><p class="wp-h">Talk to <em>Tyent India</em></p><button class="wp-x" aria-label="Close">✕</button></div>'+
    '<p class="wp-sub">Questions about a machine, prices or your water? We\'re here.</p>'+
    '<div class="wp-opts">'+waOpt+'<button class="wp-opt cb" data-mode="cb"><span class="ic">'+phIcon+'</span><span><b>Call me back</b><small>Within 10 minutes in working hours</small></span><span class="go">→</span></button></div>'+
    '<form class="wp-form" novalidate hidden><p class="wp-fh"></p><label class="sr-only" for="wp-nm">Your name</label><input id="wp-nm" autocomplete="name" placeholder="Your name"><label class="sr-only" for="wp-mob">Mobile number</label><input id="wp-mob" inputmode="tel" autocomplete="tel" placeholder="Mobile number"><button class="btn btn-p" type="submit">Request <span class="arr">→</span></button><button class="wp-back" type="button">← Back</button><p class="wp-ok" role="status"></p></form>'+
  '</div>'+
  '<button class="wp-drop" aria-expanded="false" aria-controls="wp-panel" aria-label="Talk to Tyent India"><span class="wp-ring"></span><span class="wp-ring b"></span>'+
    '<svg class="wp-ico" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z"/></svg>'+
    '<svg class="wp-x2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
  '<span class="wp-tip" aria-hidden="true">Need help choosing?</span>';
  document.body.appendChild(el);
  var drop=el.querySelector('.wp-drop'),panel=el.querySelector('.wp-panel'),form=el.querySelector('.wp-form'),opts=el.querySelector('.wp-opts'),fh=el.querySelector('.wp-fh'),ok=el.querySelector('.wp-ok'),mode='cb';
  function open(o){el.classList.toggle('open',o);drop.setAttribute('aria-expanded',o);if(o){panel.hidden=false;requestAnimationFrame(function(){panel.classList.add('in')})}else{panel.classList.remove('in');setTimeout(function(){if(!el.classList.contains('open'))panel.hidden=true},still?0:300);reset()}}
  function reset(){form.hidden=true;opts.hidden=false;ok.textContent='';ok.classList.remove('done')}
  drop.addEventListener('click',function(){open(!el.classList.contains('open'));el.classList.add('seen')});
  el.querySelector('.wp-x').addEventListener('click',function(){open(false);drop.focus()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&el.classList.contains('open')){open(false);drop.focus()}});
  document.addEventListener('click',function(e){if(el.classList.contains('open')&&!el.contains(e.target))open(false)});
  el.querySelectorAll('.wp-opt[data-mode]').forEach(function(b){b.addEventListener('click',function(){mode=b.dataset.mode;fh.textContent=mode==='wa'?'We\'ll message you on WhatsApp':'We\'ll call you back';opts.hidden=true;form.hidden=false;el.querySelector('#wp-nm').focus()})});
  el.querySelector('.wp-back').addEventListener('click',reset);
  addEventListener('tyent:call',function(e){var ctx=e.detail||'';setTimeout(function(){openCall(ctx)},0)});
  function openCall(ctx){open(true);el.classList.add('seen');mode='cb';fh.textContent=ctx?'Call to order · '+ctx:'We\'ll call you back';opts.hidden=true;form.hidden=false;ok.textContent='';ok.classList.remove('done');setTimeout(function(){el.querySelector('#wp-nm').focus()},350)}
  form.addEventListener('submit',function(e){e.preventDefault();var nm=el.querySelector('#wp-nm').value.trim(),mob=el.querySelector('#wp-mob').value.replace(/\D/g,'');
    if(!nm||mob.length<10){ok.classList.remove('done');ok.textContent='Add your name and a 10-digit mobile number.';return}
    ok.classList.add('done');ok.textContent='Thanks, '+nm.split(' ')[0].replace(/</g,'')+'. '+(mode==='wa'?'On the live site the Tyent team will message you on WhatsApp shortly.':'On the live site the Tyent team will call you back shortly.')});
  /* a gentle nudge once per visit */
  var nudged=false;try{nudged=!!sessionStorage.getItem('tyent-tip')}catch(e){}
  if(!nudged&&!still)setTimeout(function(){if(el.classList.contains('open')||el.classList.contains('seen'))return;el.classList.add('tip');try{sessionStorage.setItem('tyent-tip','1')}catch(e){}setTimeout(function(){el.classList.remove('tip')},4200)},9000);
})();


/* ===== V17: shop. Prices, add to basket, call to order, slide-in basket, order request ===== */
(function(){
  /* PRICES in rupees. null shows "Price on request" (our team confirms it when the order comes in). */
  var CATALOG={
    ace:{name:'ACE-13',img:'ace',price:null,tag:'Countertop · 13 plates',url:'ace-13.html'},
    hybrid:{name:'H2-Hybrid',img:'hybrid',price:367000,tag:'Countertop · twin cell',url:'hybrid-h2.html'},
    uce9:{name:'UCE-9 Plus',img:'uce-set2',tag:'Under-counter · 9 plates',vlabel:'Finish',variants:[['Satin Silver',325000],['Matte Black',325000],['Gold',325000],['Antique',325000]],finishFromSwatch:true,url:'uce-9-plus.html'},
    uce11:{name:'UCE-11 Plus',img:'uce-set2',tag:'Under-counter · 11 plates',vlabel:'Finish',variants:[['Satin Silver',346000],['Matte Black',346000],['Gold',346000],['Antique',346000]],finishFromSwatch:true,url:'uce-11-plus.html'},
    uce:{name:'UCE-13 Plus',img:'uce-set2',tag:'Under-counter · 13 plates',vlabel:'Finish',variants:[['Satin Silver',367000],['Matte Black',367000],['Gold',367000],['Antique',367000]],finishFromSwatch:true,url:'uce-13-plus.html'},
    nmp:{name:'NMP Series',img:'nmp9',tag:'Countertop',vlabel:'Plates',variants:[['NMP-5',168000],['NMP-7',205000],['NMP-9',238000],['NMP-11',272000]],url:'nmp-9.html'},
    nmp5:{name:'NMP-5',img:'nmp57',price:168000,tag:'Countertop · 5 plates',url:'nmp-5.html'},
    nmp7:{name:'NMP-7',img:'nmp57',price:205000,tag:'Countertop · 7 plates',url:'nmp-7.html'},
    nmp9:{name:'NMP-9',img:'nmp9',price:238000,tag:'Countertop · 9 plates',url:'nmp-9.html'},
    nmp11:{name:'NMP-11',img:'nmp9',price:272000,tag:'Countertop · 11 plates',url:'nmp-11.html'},
    q:{name:'Q-Series',img:'q',price:null,tag:'Countertop · eco',url:'q-series.html'},
    filters:{name:'Replacement filter set',img:'filters',price:null,tag:'Stage 1 + stage 2',url:'filters.html'},
    scale:{name:'Tyent Scale Remover',img:'scale',price:null,tag:'For hard water',url:'scale-remover.html'},
    soap:{name:'TM-X Beauty Soap',img:'soap',price:999,tag:'Fermentation soap · 80 g',url:'tm-x-soap.html'}
  };
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches,KEY='tyent-basket';
  function $(id){return document.getElementById(id)}
  function rs(n){return '₹'+Number(n).toLocaleString('en-IN')}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function priceOf(id,v){var p=CATALOG[id];if(!p)return null;if(p.variants){var hit=p.variants.filter(function(x){return x[0]===v})[0]||p.variants[0];return hit[1]}return p.price}
  var basket=[];try{basket=JSON.parse(localStorage.getItem(KEY)||'[]')||[]}catch(e){basket=[]}
  basket=basket.filter(function(i){return CATALOG[i.id]});
  function save(){try{localStorage.setItem(KEY,JSON.stringify(basket))}catch(e){}}
  function count(){return basket.reduce(function(a,i){return a+i.q},0)}

  /* static prices anywhere on the site: <span data-price-of="ace"> */
  document.querySelectorAll('[data-price-of]').forEach(function(el){var id=el.dataset.priceOf,p=CATALOG[id];if(!p)return;
    if(p.variants){var ps=p.variants.map(function(v){return v[1]}).filter(function(x){return x!=null});el.innerHTML=ps.length?'From <b>'+rs(Math.min.apply(null,ps))+'</b>':'<i>On request</i>'}
    else el.innerHTML=p.price!=null?'<b>'+rs(p.price)+'</b>':'<i>On request</i>'});

  /* buy blocks: <div class="buy" data-prod="nmp"> */
  document.querySelectorAll('.buy[data-prod]').forEach(function(b){var id=b.dataset.prod,p=CATALOG[id];if(!p)return;
    var mini=b.classList.contains('mini'),compact=b.classList.contains('compact'),sel=p.variants?(id==='nmp'?3:0):-1,q=1;
    var showVariants=p.variants&&!p.finishFromSwatch&&!mini;
    b.innerHTML='<div class="buy-price"><b class="bp"></b><small class="bs"></small></div>'+
      (showVariants?'<div class="buy-var" role="group" aria-label="'+p.vlabel+'">'+p.variants.map(function(v,i){return '<button type="button" aria-pressed="'+(i===sel)+'" data-i="'+i+'">'+v[0]+'</button>'}).join('')+'</div>':'')+
      '<div class="buy-acts">'+(mini||compact?'':'<div class="qty" role="group" aria-label="Quantity"><button type="button" class="qm" aria-label="One fewer">−</button><span class="qn" aria-live="polite">1</span><button type="button" class="qp" aria-label="One more">+</button></div>')+
      '<button type="button" class="btn btn-p add"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>'+(mini?'Add':'Add to basket')+'</button>'+
      '<button type="button" class="btn btn-g call"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>'+(mini?'Call':'Call to order')+'</button></div>';
    var bp=b.querySelector('.bp'),bs=b.querySelector('.bs');
    function variant(){if(!p.variants)return '';if(p.finishFromSwatch){var sw=b.closest('section')&&b.closest('section').querySelector('.sw[aria-pressed="true"]');return sw?sw.dataset.n:p.variants[0][0]}return p.variants[Math.max(0,sel)][0]}
    function paint(){var v=variant(),pr=priceOf(id,v);
      if(mini&&p.variants&&!p.finishFromSwatch){var ps=p.variants.map(function(x){return x[1]}).filter(function(x){return x!=null});bp.textContent=ps.length?'From '+rs(Math.min.apply(null,ps)):'Price on request';bs.textContent=ps.length?'NMP-5 to NMP-11':'We\'ll confirm today\'s price'}
      else{bp.textContent=pr!=null?rs(pr):'Price on request';bs.textContent=pr!=null?(b.classList.contains('pd-buy')?'M.R.P. · ':'')+(v?v+' · ':'')+'installation arranged by our team':(v?v+' · ':'')+'our team confirms the price when you order'}
      b.classList.toggle('req',bp.textContent==='Price on request')}
    paint();
    b.querySelectorAll('.buy-var button').forEach(function(x){x.addEventListener('click',function(){sel=+x.dataset.i;b.querySelectorAll('.buy-var button').forEach(function(y){y.setAttribute('aria-pressed',y===x)});paint()})});
    if(p.finishFromSwatch){var sec=b.closest('section');if(sec)sec.querySelectorAll('.sw').forEach(function(sw){sw.addEventListener('click',function(){setTimeout(paint,0)})})}
    var qn=b.querySelector('.qn');if(qn){b.querySelector('.qm').addEventListener('click',function(){q=Math.max(1,q-1);qn.textContent=q});b.querySelector('.qp').addEventListener('click',function(){q=Math.min(9,q+1);qn.textContent=q})}
    b.querySelector('.add').addEventListener('click',function(e){var v=mini&&p.variants&&!p.finishFromSwatch?p.variants[id==='nmp'?3:0][0]:variant();add(id,v,q,b);if(qn){q=1;qn.textContent=1}});
    b.querySelector('.call').addEventListener('click',function(){var v=variant();dispatchEvent(new CustomEvent('tyent:call',{detail:p.name+(v&&v!==p.name?' ('+v+')':'')}))});
  });

  /* basket drawer */
  var dr=document.createElement('div');dr.className='bk';dr.id='basket';dr.hidden=true;
  dr.innerHTML='<div class="bk-scrim"></div><aside class="bk-panel" role="dialog" aria-modal="true" aria-labelledby="bk-h">'+
    '<header class="bk-top"><h2 id="bk-h">Your <em>basket</em></h2><span class="bk-c" id="bkC"></span><button class="icon-btn bk-x" aria-label="Close basket">✕</button></header>'+
    '<div class="bk-body" id="bkBody"></div><footer class="bk-foot" id="bkFoot"></footer></aside>';
  document.body.appendChild(dr);
  var body=$('bkBody'),foot=$('bkFoot'),cBtn=$('cartBtn'),cN=$('cartN'),opener=null,view='list';
  function badge(bump){var n=count();if(cN){cN.textContent=n;cN.hidden=!n}if(cBtn)cBtn.setAttribute('aria-label',n?'Basket, '+n+' item'+(n>1?'s':''):'Basket, empty');
    if(bump&&cBtn&&!still){cBtn.classList.remove('bump');void cBtn.offsetWidth;cBtn.classList.add('bump')}}
  function totals(){var sum=0,req=0;basket.forEach(function(i){var pr=priceOf(i.id,i.v);if(pr==null)req+=i.q;else sum+=pr*i.q});return {sum:sum,req:req}}
  function render(){var n=count();$('bkC').textContent=n?n+' item'+(n>1?'s':''):'';
    if(view==='done')return;
    if(!basket.length){view='list';body.innerHTML='<div class="bk-empty"><div class="bk-glass"><span></span></div><h3>Your basket is empty.</h3><p>Pick a machine and we\'ll take care of the water test and installation.</p><a class="btn btn-p" href="products.html">Explore ionizers <span class="arr">→</span></a></div>';foot.innerHTML='';return}
    if(view==='checkout')return renderCheckout();
    body.innerHTML='<ul class="bk-list">'+basket.map(function(i,k){var p=CATALOG[i.id],pr=priceOf(i.id,i.v);
      return '<li class="bk-item"><div class="bk-im"><img src="img/'+p.img+'.webp" alt=""></div><div class="bk-info"><b>'+(p.url?'<a href="'+p.url+'">'+esc(p.name)+'</a>':esc(p.name))+'</b><small>'+esc(i.v&&i.v!==p.name?i.v:p.tag)+'</small>'+
      '<div class="bk-row"><div class="qty" role="group" aria-label="Quantity of '+esc(p.name)+'"><button type="button" data-k="'+k+'" data-d="-1" aria-label="One fewer">−</button><span>'+i.q+'</span><button type="button" data-k="'+k+'" data-d="1" aria-label="One more">+</button></div>'+
      '<span class="bk-pr">'+(pr!=null?rs(pr*i.q):'<i>Price on request</i>')+'</span></div></div><button class="bk-rm" data-rm="'+k+'" aria-label="Remove '+esc(p.name)+'">✕</button></li>'}).join('')+'</ul>'+
      '<div class="bk-perks"><span>✓ Free water test before installation</span><span>✓ Installation arranged by Tyent India</span><span>✓ Genuine filters delivered to your door</span></div>';
    var t=totals();
    foot.innerHTML='<div class="bk-sum"><span>Subtotal</span><b>'+(t.sum?rs(t.sum):'—')+'</b></div>'+(t.req?'<p class="bk-note">+ '+t.req+' item'+(t.req>1?'s':'')+' priced on request. Our team confirms the final price on the call.</p>':'<p class="bk-note">Our team calls to confirm the order, payment and installation date.</p>')+
      '<button class="btn btn-p bk-go">Place order request <span class="arr">→</span></button><button class="btn btn-g bk-call">Call to order instead</button>';
    foot.querySelector('.bk-go').addEventListener('click',function(){view='checkout';render()});
    foot.querySelector('.bk-call').addEventListener('click',function(){close();var names=basket.map(function(i){return CATALOG[i.id].name}).join(', ');dispatchEvent(new CustomEvent('tyent:call',{detail:names}))});
  }
  function renderCheckout(){var t=totals();
    body.innerHTML='<button class="bk-back">← Back to basket</button><h3 class="bk-h3">Where should we deliver?</h3><p class="bk-sub">No payment now. Our team calls to confirm the price, payment and installation date.</p>'+
      '<form class="bk-form" id="bkForm" novalidate><label for="bk-nm">Full name</label><input id="bk-nm" autocomplete="name" placeholder="Ananya Sharma">'+
      '<label for="bk-mob">Mobile</label><input id="bk-mob" inputmode="tel" autocomplete="tel" placeholder="98765 43210">'+
      '<label for="bk-city">City</label><input id="bk-city" autocomplete="address-level2" placeholder="Lucknow">'+
      '<label for="bk-addr">Address <small>(optional)</small></label><textarea id="bk-addr" autocomplete="street-address" placeholder="Flat, building, street, area"></textarea>'+
      '<fieldset class="bk-pref"><legend>Best way to reach you</legend><input type="radio" name="bkp" id="bkp1" value="call" checked><label for="bkp1">Phone call</label><input type="radio" name="bkp" id="bkp2" value="wa"><label for="bkp2">WhatsApp</label></fieldset>'+
      '<p class="bk-err" id="bkErr" role="alert"></p></form>';
    foot.innerHTML='<div class="bk-sum"><span>'+count()+' item'+(count()>1?'s':'')+'</span><b>'+(t.sum?rs(t.sum)+(t.req?' + on request':''):'Price on request')+'</b></div><button class="btn btn-p bk-send" form="bkForm" type="submit">Send order request <span class="arr">→</span></button>';
    body.querySelector('.bk-back').addEventListener('click',function(){view='list';render()});
    $('bkForm').addEventListener('submit',function(e){e.preventDefault();var nm=$('bk-nm').value.trim(),mob=$('bk-mob').value.replace(/\D/g,''),city=$('bk-city').value.trim();
      if(!nm||mob.length<10||!city){$('bkErr').textContent='Add your name, a 10-digit mobile number and your city to continue.';return}
      var ref='TY-'+Math.floor(100000+Math.random()*900000),items=basket.slice(),by=document.querySelector('input[name=bkp]:checked').value;
      view='done';basket=[];save();badge();
      body.innerHTML='<div class="bk-done"><svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#2FB36E"/><path d="M19 33l9 9 17-19" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
        '<h3>Order request received.</h3><p class="bk-ref">Reference <b>'+ref+'</b></p><p>Thanks, '+esc(nm.split(' ')[0])+'. On the live site this goes straight to the Tyent India team in '+esc(city)+', who will '+(by==='wa'?'message you on WhatsApp':'call you')+' to confirm the price, payment and installation date.</p>'+
        '<ul class="bk-mini">'+items.map(function(i){return '<li>'+i.q+' × '+esc(CATALOG[i.id].name)+(i.v&&i.v!==CATALOG[i.id].name?' · '+esc(i.v):'')+'</li>'}).join('')+'</ul></div>';
      foot.innerHTML='<button class="btn btn-g bk-close2">Continue browsing</button>';foot.querySelector('.bk-close2').addEventListener('click',close);$('bkC').textContent='';
    });
  }
  body.addEventListener('click',function(e){var d=e.target.closest('[data-d]'),r=e.target.closest('[data-rm]');
    if(d){var k=+d.dataset.k;basket[k].q=Math.max(0,Math.min(9,basket[k].q+(+d.dataset.d)));if(!basket[k].q)basket.splice(k,1);save();badge();render()}
    if(r){var li=r.closest('li');li.classList.add('gone');setTimeout(function(){basket.splice(+r.dataset.rm,1);save();badge();render()},still?0:260)}});
  function open(){opener=document.activeElement;if(view==='done')view='list';render();dr.hidden=false;requestAnimationFrame(function(){dr.classList.add('in')});document.body.style.overflow='hidden';setTimeout(function(){dr.querySelector('.bk-x').focus()},60)}
  function close(){dr.classList.remove('in');document.body.style.overflow='';setTimeout(function(){dr.hidden=true;if(view==='done')view='list'},still?0:420);if(opener&&opener.focus)opener.focus()}
  if(cBtn)cBtn.addEventListener('click',open);
  dr.querySelector('.bk-x').addEventListener('click',close);dr.querySelector('.bk-scrim').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dr.hidden)close()});

  /* add: fly the product image into the basket, bump the badge, show a toast */
  var toast=document.createElement('div');toast.className='bk-toast';toast.setAttribute('role','status');document.body.appendChild(toast);var tt;
  function add(id,v,q,fromEl){var hit=basket.filter(function(i){return i.id===id&&i.v===v})[0];if(hit)hit.q=Math.min(9,hit.q+q);else basket.push({id:id,v:v,q:q});save();
    var p=CATALOG[id],src=fromEl&&(fromEl.closest('section,article,.hx-slide')||document).querySelector('.tt-img,img'),cart=cBtn&&cBtn.getBoundingClientRect();
    if(src&&cart&&!still){var r=src.getBoundingClientRect(),f=document.createElement('img');f.src='img/'+p.img+'.webp';f.className='bk-fly';var s0=Math.min(r.width,220);
      f.style.cssText='left:'+(r.left+r.width/2-s0/2)+'px;top:'+(r.top+r.height/2-s0/2)+'px;width:'+s0+'px';document.body.appendChild(f);
      requestAnimationFrame(function(){requestAnimationFrame(function(){var dx=cart.left+cart.width/2-(r.left+r.width/2),dy=cart.top+cart.height/2-(r.top+r.height/2);f.style.transform='translate('+dx+'px,'+dy+'px) scale(.08) rotate(-12deg)';f.style.opacity='.4'})});
      setTimeout(function(){f.remove();badge(true)},760)}else badge(true);
    toast.innerHTML='<img src="img/'+p.img+'.webp" alt=""><span><b>'+esc(p.name)+(v&&v!==p.name?' · '+esc(v):'')+'</b> added to your basket</span><button type="button">View basket</button>';
    toast.querySelector('button').addEventListener('click',open);toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},3600)}
  badge();
  window.TyentShop={add:add,open:open,catalog:CATALOG};
})();
