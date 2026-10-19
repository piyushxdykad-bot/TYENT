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
      '<div><div class="frame cut gal-wrap" style="aspect-ratio:1.15"><img class="gal-main" src="img/'+f.g[0][0]+'.webp" alt="Tyent '+f.name+', '+f.g[0][1]+'"></div><div class="gal">'+gal+'</div></div>'+
      '<div><div class="fam-top">'+f.tags.map(function(t,j){return '<span class="tagx'+(j===0?' blue':'')+'">'+t+'</span>'}).join('')+'</div>'+
      '<h2 class="h2" id="'+f.id+'-h" style="font-size:clamp(2.6rem,5.4vw,4.6rem)">'+f.name+'</h2><p style="font-family:var(--f-display);font-size:1.4rem;letter-spacing:-.02em;margin-top:10px">'+f.head+'</p>'+
      '<p class="body">'+f.d+'</p>'+fin+
      '<dl class="spec">'+f.spec.map(function(s){return '<dt>'+s[0]+'</dt><dd>'+s[1]+'</dd>'}).join('')+'</dl>'+
      '<div style="display:flex;gap:12px;margin-top:28px;flex-wrap:wrap"><a class="btn btn-p" href="contact.html#enquire">Get price &amp; demo <span class="arr">→</span></a><a class="btn btn-g" href="why-tyent.html">Why Tyent</a></div></div>'+
      '</div></section>';
  }).join('');

  document.querySelectorAll('.pfam').forEach(function(sec){
    var main=sec.querySelector('.gal-main');if(!main)return;var wrap=sec.querySelector('.gal-wrap');var name=sec.querySelector('h2').textContent;
    function show(src,cut,label){main.style.opacity=0;setTimeout(function(){main.src='img/'+src+'.webp';main.alt='Tyent '+name+', '+label;
      wrap.style.padding=cut?'':'0';main.style.maxWidth=cut?'':'100%';main.style.maxHeight=cut?'':'none';main.style.width=cut?'':'100%';main.style.height=cut?'':'100%';main.style.objectFit=cut?'contain':'cover';main.style.filter=cut?'':'none';main.style.opacity=1},still?0:220)}
    var btns=[].slice.call(sec.querySelectorAll('.gal button'));
    btns.forEach(function(b){b.addEventListener('click',function(){btns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});show(b.dataset.src,b.dataset.cut==='1',b.getAttribute('aria-label'))})});
    var sws=[].slice.call(sec.querySelectorAll('.sw'));
    sws.forEach(function(s){s.addEventListener('click',function(){sws.forEach(function(x){x.setAttribute('aria-pressed',x===s)});sec.querySelector('.fname').textContent=s.dataset.n;btns.forEach(function(x){x.setAttribute('aria-pressed','false')});show(s.dataset.src,false,s.dataset.n+' faucet')})});
  });
  /* sticky family nav follows the scroll */
  var sn=document.getElementById('subnav'),ind=document.getElementById('ind'),links=[].slice.call(sn.querySelectorAll('a'));
  function spy(){var cur=null;links.forEach(function(a){var t=document.getElementById(a.getAttribute('href').slice(1));if(t&&t.getBoundingClientRect().top<innerHeight*.45)cur=a});
    links.forEach(function(a){a.classList.toggle('on',a===cur)});
    if(cur){ind.style.opacity=1;ind.style.left=cur.offsetLeft+'px';ind.style.width=cur.offsetWidth+'px';if(sn.scrollWidth>sn.clientWidth)sn.scrollTo({left:cur.offsetLeft-40,behavior:'smooth'})}else ind.style.opacity=0}
  addEventListener('scroll',spy,{passive:true});addEventListener('resize',spy);spy();
  if(location.hash){var t=document.getElementById(location.hash.slice(1));if(t)setTimeout(function(){t.scrollIntoView()},60)}
})();
