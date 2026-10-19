(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fams=[
    {id:'ace',name:'ACE-13',tags:['Countertop','Flagship'],head:'Every water, one touch away.',
     d:'The ACE-13 puts thirteen plates and a full-colour touchscreen on your counter. Turn the jog dial or tap the screen, and the machine shows the pH before you pour.',
     spec:[['Installation','Countertop'],['Plates','13 platinum-coated titanium'],['Controls','Colour touchscreen and jog dial'],['Water types','7, from acidic to turbo'],['Filtration','Two-stage filters']],
     g:[['ace','ACE-13 three-quarter view',1],['ace-front','ACE-13 front',1],['ace-touch','Touchscreen in use',0],['ace-jog','Jog dial',0],['ace-screens','Screen menus',0],['life-baby','Measured quantity for a baby bottle',0],['life-turbo','Turbo water for vegetables',0],['life-alkali','Alkaline water after a workout',0]]},
    {id:'hybrid',name:'H2-Hybrid',tags:['Countertop','Hydrogen'],head:'An ionizer and a hydrogen generator in one.',
     d:'Switch between ionized water for the kitchen and hydrogen-rich water for drinking. An illuminated dial and colour LCD make every setting easy to read.',
     spec:[['Installation','Countertop'],['Cell','Hybrid ionizing and hydrogen cell'],['Controls','Illuminated dial and colour LCD'],['Modes','Ionized and H₂ water'],['Power','Hybrid power supply']],
     g:[['hybrid','H2-Hybrid front',1],['hybrid-dial','Hydrogen dial',0],['hybrid-close','Side profile',0],['cell','The water cell',1],['life-sleep','Morning glass',0],['life-dog','Water for the dog',0],['life-mom','At home with family',0],['life-water','Drinking at home',0]]},
    {id:'uce',name:'UCE-13 Plus',tags:['Under-counter','4 finishes'],head:'Hidden below. Only the faucet shows.',
     d:'The ionizer fits inside your cabinet. Above the sink you get a slim faucet with its own touchscreen, in Satin Silver, Matte Black, Gold or Antique.',
     spec:[['Installation','Under-counter with faucet'],['Plates','13 platinum-coated titanium'],['Controls','Touchscreen on the faucet'],['Finishes','Satin Silver, Matte Black, Gold, Antique'],['Counter space','Only the faucet']],
     fin:[['Satin Silver','#C9CDD3','f-silver'],['Matte Black','#1B1D21','f-black'],['Gold','#C9A85E','f-gold'],['Antique','#7A5A48','f-antique']],
     g:[['uce-set2','Ionizer with faucet',1],['uce-set','Satin silver set',1],['uce-touch','Faucet touchscreen',1],['uce-gold-situ','Gold faucet on marble',0],['uce-outlet','Black faucet pouring',0],['uce-box','Ionizer unit',1],['life-acidic','Acidic water for skin',0],['life-q2','Rinsing with acidic water',0]]},
    {id:'nmp',name:'NMP Series',tags:['Countertop','5–11 plates'],head:'The everyday Tyent, sized to your family.',
     d:'Choose five, seven, nine or eleven plates depending on how many people drink from it. A wide LCD shows your setting, and an illuminated button starts the flow.',
     spec:[['Installation','Countertop'],['Plates','5, 7, 9 or 11'],['Controls','Wide LCD and illuminated button'],['Power','Eco mode'],['Best for','Matching size to household']],
     g:[['nmp9','NMP-9',1],['nmp57','NMP-5 and NMP-7',1],['edge-angle','Angled view',0],['edge-screen','LCD close-up',0],['life-edge','In the kitchen',0],['life-turbo','Washing vegetables',0],['life-sleep','First glass of the day',0],['life-dog','For pets too',0]]},
    {id:'q',name:'Q-Series',tags:['Countertop','Eco'],head:'Soft lines. Simple settings.',
     d:'A rounded, compact design with colour-coded water settings the whole family can read at a glance, and an eco mode that saves power between pours.',
     spec:[['Installation','Countertop'],['Controls','Soft-touch panel'],['Settings','Colour-coded water types'],['Power','Eco mode'],['Design','Compact, rounded body']],
     g:[['q','Q-Series with eco mode',1],['q-front','Front view',0],['q-screens','Water settings',1],['life-q1','Everyday use',0],['life-q2','Acidic face wash',0],['life-water','A glass at home',0],['life-alkali','After a workout',0],['life-acidic','Fresh face',0]]}
  ];
  var host=document.getElementById('fams');
  host.outerHTML=fams.map(function(f,i){
    var flip=i%2?' flip':'';
    var gal=f.g.slice(0,4).map(function(g,j){return '<button aria-pressed="'+(j===0)+'" data-src="'+g[0]+'" data-cut="'+g[2]+'" aria-label="'+g[1]+'"><img src="img/'+g[0]+'.webp" alt="" loading="lazy"></button>'}).join('');
    var fin=f.fin?'<div class="sws" role="group" aria-label="Faucet finish">'+f.fin.map(function(s,j){return '<button class="sw" aria-pressed="'+(j===0)+'" aria-label="'+s[0]+'" data-n="'+s[0]+'" data-src="'+s[2]+'" style="background:'+s[1]+'"></button>'}).join('')+'<span class="fname">'+f.fin[0][0]+'</span></div>':'';
    return '<section id="'+f.id+'" class="pfam" aria-labelledby="'+f.id+'-h"><div class="wrap two'+flip+'">'+
      '<div><div class="tt" data-fam="'+f.id+'" tabindex="0" role="group" aria-roledescription="turntable" aria-label="Tyent '+f.name+'. Drag, or use the arrow keys, to turn it."><div class="tt-floor" aria-hidden="true"><div class="tt-ring"></div></div><div class="tt-stage"><img class="tt-img" src="img/'+f.g[0][0]+'.webp" alt="Tyent '+f.name+'" draggable="false"><div class="tt-hs"></div></div><img class="tt-photo" alt="" hidden><span class="tt-hint" aria-hidden="true"><i></i>Drag to turn</span><span class="tt-deg" aria-hidden="true">0°</span></div><div class="gal">'+gal+'</div></div>'+
      '<div><div class="fam-top">'+f.tags.map(function(t,j){return '<span class="tagx'+(j===0?' blue':'')+'">'+t+'</span>'}).join('')+'</div>'+
      '<h2 class="h2" id="'+f.id+'-h" style="font-size:clamp(2.6rem,5.4vw,4.6rem)">'+f.name+'</h2><p style="font-family:var(--f-display);font-size:1.4rem;letter-spacing:-.02em;margin-top:10px">'+f.head+'</p>'+
      '<p class="body">'+f.d+'</p>'+fin+
      '<dl class="spec">'+f.spec.map(function(s){return '<dt>'+s[0]+'</dt><dd>'+s[1]+'</dd>'}).join('')+'</dl>'+
      '<div style="display:flex;gap:12px;margin-top:28px;flex-wrap:wrap"><a class="btn btn-p" href="contact.html#enquire">Get price &amp; demo <span class="arr">→</span></a><a class="btn btn-g" href="why-tyent.html">Why Tyent</a></div></div>'+
      '</div></section>';
  }).join('');

  /* ---------- drag-to-turn turntable ---------- */
  /* views: real camera angles we have for each family (a = the angle that photo faces);
     hotspots in % of that photo: [x, y, title, detail] */
  var TT={
    ace:[{src:'ace-front',a:-10,hs:[[40,23,'Colour touchscreen','Pick any of 7 waters and see the pH before you pour.'],[71,72,'Jog dial','Turn to change setting, press to pour.'],[52,52,'Two filters inside','Carbon and ultra-filtration, behind the front panel.'],[6,55,'Flexible spout','Swings to fill a glass, jug or pot.']]},
         {src:'ace',a:24,hs:[[31,30,'Colour touchscreen','Pick any of 7 waters and see the pH before you pour.'],[71,81,'Jog dial','Turn to change setting, press to pour.'],[55,58,'Two filters inside','Carbon and ultra-filtration, behind the front panel.'],[4,66,'Flexible spout','Swings to fill a glass, jug or pot.']]}],
    hybrid:[{src:'hybrid',a:0,hs:[[62,27,'Colour LCD','Shows your water type and pH.'],[13,80,'Hydrogen dial','Switch between ionized and H₂ water.'],[50,60,'Filters inside','Two-stage filtration before the cell.'],[4,66,'Flexible spout','Swings to fill a glass, jug or pot.']]}],
    uce:[{src:'uce-set',a:-6,hs:[[88,41,'Touchscreen faucet','Choose your water right at the sink.'],[30,28,'Ionizer under the sink','The machine hides in your cabinet.'],[33,64,'Filters inside','Swap them through the front door.'],[86,62,'Separate outlets','Acidic water never mixes with drinking water.']]},
         {src:'uce-set2',a:20,hs:[[89,38,'Touchscreen faucet','Choose your water right at the sink.'],[32,20,'Ionizer under the sink','The machine hides in your cabinet.'],[30,62,'Filters inside','Swap them through the front door.'],[87,60,'Separate outlets','Acidic water never mixes with drinking water.']]}],
    nmp:[{src:'nmp9',a:0,hs:[[46,19,'Wide LCD','Your setting and pH at a glance.'],[80,86,'Start button','One press to pour.'],[50,55,'Filters inside','Two-stage filtration before the plates.']]}],
    q:[{src:'q',a:12,hs:[[37,22,'Colour-coded panel','Each water type has its own colour.'],[80,47,'Eco mode','Saves power between pours.'],[30,62,'Filters inside','Two-stage filtration before the plates.']]}]
  };
  document.querySelectorAll('.pfam').forEach(function(sec){
    var tt=sec.querySelector('.tt');if(!tt)return;
    var V=TT[tt.dataset.fam]||[],stage=tt.querySelector('.tt-stage'),img=tt.querySelector('.tt-img'),hsBox=tt.querySelector('.tt-hs'),ring=tt.querySelector('.tt-ring'),photo=tt.querySelector('.tt-photo'),deg=tt.querySelector('.tt-deg');
    var name=sec.querySelector('h2').textContent,cur=-1,A=V[0]?V[0].a:0,T=A,drag=null,last=0,idle=true,vis=false,raf=0,t0=performance.now();
    V.forEach(function(v){var im=new Image();im.src='img/'+v.src+'.webp'});
    function nearest(a){var b=0;V.forEach(function(v,i){if(Math.abs(v.a-a)<Math.abs(V[b].a-a))b=i});return b}
    function setView(i){if(i===cur||!V[i])return;cur=i;var v=V[i];
      img.style.opacity=.15;setTimeout(function(){img.src='img/'+v.src+'.webp';img.style.opacity=1},still?0:120);
      hsBox.innerHTML=v.hs.map(function(h,k){return '<button class="hs" style="left:'+h[0]+'%;top:'+h[1]+'%" aria-label="'+h[2]+': '+h[3]+'"><span class="hs-dot"></span><span class="hs-card'+(h[0]>60?' l':'')+'"><b>'+h[2]+'</b>'+h[3]+'</span></button>'}).join('')}
    function render(){var i=nearest(A);setView(i);var tilt=Math.max(-26,Math.min(26,(A-V[i].a)*.9));
      stage.style.transform='rotateY('+tilt.toFixed(2)+'deg)';ring.style.transform='rotateX(74deg) rotateZ('+(A*5).toFixed(1)+'deg)';
      tt.classList.toggle('hs-on',Math.abs(tilt)<9&&!drag);deg.textContent=Math.round(A)+'°'}
    function loop(now){raf=0;if(!vis)return;var dt=Math.min(.05,(now-last)/1000||0);last=now;
      if(!drag){if(idle&&!still){T=V[nearest(T)].a+Math.sin((now-t0)/1400)*9}A+=(T-A)*Math.min(1,dt*7)}
      render();raf=requestAnimationFrame(loop)}
    function kick(){if(!raf&&vis){last=performance.now();raf=requestAnimationFrame(loop)}}
    if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)kick()}).observe(tt);else{vis=true;kick()}
    var idleT;function wake(){idle=false;tt.classList.add('touched');clearTimeout(idleT);idleT=setTimeout(function(){idle=true;t0=performance.now()},3500)}
    tt.addEventListener('pointerdown',function(e){if(tt.classList.contains('photo')||e.target.closest('.hs'))return;drag={x:e.clientX,a:A};tt.setPointerCapture(e.pointerId);tt.classList.add('dragging');wake();kick()});
    tt.addEventListener('pointermove',function(e){if(!drag)return;var a=drag.a+(e.clientX-drag.x)*.28;if(a>40)a=40+(a-40)*.3;if(a<-40)a=-40+(a+40)*.3;A=T=a;render()});
    function end(){if(!drag)return;drag=null;tt.classList.remove('dragging');T=V[nearest(Math.max(-36,Math.min(36,A)))].a;wake();kick()}
    tt.addEventListener('pointerup',end);tt.addEventListener('pointercancel',end);
    tt.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();T=Math.max(-36,Math.min(36,T+(e.key==='ArrowRight'?12:-12)));T=V[nearest(T)].a+(V.length>1?0:(e.key==='ArrowRight'?14:-14));wake();kick()}});
    hsBox.addEventListener('click',function(e){var b=e.target.closest('.hs');if(!b)return;var on=b.classList.contains('open');hsBox.querySelectorAll('.hs').forEach(function(x){x.classList.remove('open')});if(!on)b.classList.add('open');wake()});
    render();
    /* gallery thumbs: real angles turn the machine; other shots open as photos */
    function showPhoto(src,cut,label){tt.classList.add('photo');photo.hidden=false;photo.style.opacity=0;photo.classList.toggle('contain',cut);
      setTimeout(function(){photo.src='img/'+src+'.webp';photo.alt='Tyent '+name+', '+label;photo.style.opacity=1},still?0:150)}
    function showMachine(i){tt.classList.remove('photo');photo.hidden=true;T=V[i].a;A=T+(i?-14:14);wake();kick()}
    var btns=[].slice.call(sec.querySelectorAll('.gal button'));
    btns.forEach(function(b){b.addEventListener('click',function(){btns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      var i=-1;V.forEach(function(v,k){if(v.src===b.dataset.src)i=k});if(i>=0)showMachine(i);else showPhoto(b.dataset.src,b.dataset.cut==='1',b.getAttribute('aria-label'))})});
    var sws=[].slice.call(sec.querySelectorAll('.sw'));
    sws.forEach(function(s){s.addEventListener('click',function(){sws.forEach(function(x){x.setAttribute('aria-pressed',x===s)});sec.querySelector('.fname').textContent=s.dataset.n;btns.forEach(function(x){x.setAttribute('aria-pressed','false')});showPhoto(s.dataset.src,false,s.dataset.n+' faucet')})});
  });
  /* sticky family nav follows the scroll */
  var sn=document.getElementById('subnav'),ind=document.getElementById('ind'),links=[].slice.call(sn.querySelectorAll('a'));
  function spy(){var cur=null;links.forEach(function(a){var t=document.getElementById(a.getAttribute('href').slice(1));if(t&&t.getBoundingClientRect().top<innerHeight*.45)cur=a});
    links.forEach(function(a){a.classList.toggle('on',a===cur)});
    if(cur){ind.style.opacity=1;ind.style.left=cur.offsetLeft+'px';ind.style.width=cur.offsetWidth+'px';if(sn.scrollWidth>sn.clientWidth)sn.scrollTo({left:cur.offsetLeft-40,behavior:'smooth'})}else ind.style.opacity=0}
  addEventListener('scroll',spy,{passive:true});addEventListener('resize',spy);spy();
  if(location.hash){var t=document.getElementById(location.hash.slice(1));if(t)setTimeout(function(){t.scrollIntoView()},60)}
})();
