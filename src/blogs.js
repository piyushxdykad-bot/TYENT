(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var A=[
    {id:'what-is-ionized-water',cat:'Basics',date:'12 Oct 2026',min:5,img:'life-water',
     t:'What is alkaline ionized water, in plain words?',
     x:'A simple explanation of how a water ionizer works and what comes out of each spout.',
     b:'<p>Alkaline ionized water is tap water that has been filtered and then passed through an electrical process called electrolysis. The result is water with a higher pH than ordinary tap water, along with dissolved hydrogen.</p><h3>How it is made</h3><p>Inside a Tyent, water first moves through two filter stages that remove chlorine, rust and sediment. It then flows between platinum-coated titanium plates. When the plates are charged, the water separates into two streams: an alkaline stream for drinking and cooking, and an acidic stream for cleaning and skin care.</p><h3>What you can choose</h3><ul><li>Alkaline levels for everyday drinking, around pH 8.5 to 9.5.</li><li>Purified, neutral water at pH 7 for medicines and baby formula.</li><li>Acidic levels for washing your face, rinsing hair and cleaning.</li><li>Turbo settings for washing produce and sanitising surfaces. These are not for drinking.</li></ul><h3>What it is not</h3><p>Ionized water is a pleasant, clean way to drink more water at home. It is not a medicine, and it does not replace advice from your doctor. If you have a health condition, ask them about what you drink.</p>'},
    {id:'ph-settings',cat:'Basics',date:'4 Oct 2026',min:4,img:'q-screens',
     t:'A guide to the seven settings on your Tyent',
     x:'Which button to press for drinking, cooking, formula, skin care and cleaning.',
     b:'<p>Your Tyent has seven water settings. Each one has a job, and learning them takes about a week of everyday use.</p><h3>For drinking</h3><p><strong>Alkaline 1</strong> is the gentlest, around pH 8.5. Start here for your first two weeks. <strong>Alkaline 2</strong> and <strong>Alkaline 3</strong> step up to around pH 9 and 9.5, which most families settle on for daily drinking, tea and cooking.</p><h3>For medicine and babies</h3><p><strong>Purified</strong> water is filtered but not ionized, so it stays neutral at pH 7. Use it for taking tablets and preparing baby formula.</p><h3>For skin and cleaning</h3><p><strong>Acidic 1 and 2</strong> are mildly acidic and suit washing your face and rinsing hair. <strong>Turbo</strong> gives very strong alkaline water for soaking fruit and vegetables, and strong acidic water for wiping down surfaces. Never drink turbo water.</p><p class="note">Exact values depend on your source water. Your installer calibrates each setting during setup.</p>'},
    {id:'ro-or-ionizer',cat:'Basics',date:'27 Sep 2026',min:6,img:'nmp9',cut:1,
     t:'RO purifier or water ionizer: which does your home need?',
     x:'An honest comparison for Indian homes, including when RO is still the right call.',
     b:'<p>Reverse osmosis (RO) purifiers are in millions of Indian kitchens, and for good reason. In areas where water carries very high levels of dissolved solids, RO is often the right first step.</p><h3>What RO does well</h3><p>RO pushes water through a very fine membrane that removes most dissolved salts. That makes it effective for very hard or brackish water. It also removes most natural minerals, and many RO units store water in a tank.</p><h3>What an ionizer adds</h3><p>A Tyent filters out chlorine, rust and sediment while keeping natural minerals, then gives you a choice of seven water types from one tap. Water is poured fresh, with no storage tank.</p><h3>How to decide</h3><ul><li>If your TDS is moderate, an ionizer on its own usually works well.</li><li>If your TDS is very high, we may suggest pre-treatment before the ionizer.</li><li>Either way, start with a water test, not a guess.</li></ul><p>A free Tyent India home demo includes that water test, so you will know which setup fits your supply.</p>'},
    {id:'cooking',cat:'Kitchen',date:'19 Sep 2026',min:4,img:'life-turbo',
     t:'Cooking with alkaline water: dal, rice and chai',
     x:'Small kitchen habits that make the most of your ionizer every day.',
     b:'<p>Most families begin by drinking alkaline water and then slowly move it into the kitchen. Here is how people use it day to day.</p><h3>Rice and dal</h3><p>Use Alkaline 2 or 3 for soaking and cooking. Many cooks find dal softens evenly and rice comes out light.</p><h3>Tea and coffee</h3><p>Filtered water without chlorine lets the flavour of your tea leaves or coffee come through. Try Alkaline 1 or Purified and see which you prefer.</p><h3>Washing vegetables</h3><p>Fill a bowl with turbo alkaline water and soak fruit and vegetables for a few minutes before rinsing. Turbo water is for washing only, never for drinking or cooking.</p><h3>Baby food</h3><p>For anything a baby eats or drinks, switch to Purified. It is filtered, neutral water.</p>'},
    {id:'acidic-water-home',cat:'Home',date:'10 Sep 2026',min:4,img:'life-acidic',
     t:'Five ways to use the acidic water you used to throw away',
     x:'From face washing to houseplants, the second stream has plenty of jobs.',
     b:'<p>Every time you pour alkaline water, a smaller stream of acidic water leaves through a separate hose. Instead of letting it go down the drain, keep a jug beside the sink.</p><h3>1. Washing your face</h3><p>Mildly acidic water (Acidic 1, around pH 6) is gentle on skin. Many people use it for their morning and evening face wash.</p><h3>2. Rinsing hair</h3><p>A final rinse with Acidic 2 after shampoo is a common routine in homes with hard water.</p><h3>3. Houseplants</h3><p>Most indoor plants are happy with mildly acidic water.</p><h3>4. Glass and mirrors</h3><p>Wipe glass with acidic water and a microfibre cloth for fewer streaks.</p><h3>5. Kitchen surfaces</h3><p>Strong acidic turbo water is useful for wiping chopping boards and counters. Keep it away from drinking glasses and label the bottle.</p>'},
    {id:'filters',cat:'Care',date:'1 Sep 2026',min:3,img:'filters',cut:1,
     t:'When to change your ionizer filters, and why it matters',
     x:'What the filter reminder means and how to keep every glass tasting fresh.',
     b:'<p>Filters do the first and most important job in your Tyent. They protect both your water and the plates inside the machine.</p><h3>How you know it is time</h3><p>Your display counts the litres that pass through the filters. When they reach their limit, the screen shows a reminder. How quickly that happens depends on your water quality and how much your family uses.</p><h3>Signs to watch for</h3><ul><li>The water tastes different from usual.</li><li>Flow becomes slower.</li><li>The reminder appears on the screen.</li></ul><h3>Why genuine filters</h3><p>Tyent filters are made to fit your model exactly and to work with its plates. Tyent India delivers genuine replacements to your door, and our team can fit them for you.</p>'},
    {id:'hard-water',cat:'Care',date:'22 Aug 2026',min:4,img:'scale',
     t:'Hard water in Indian cities and how to protect your machine',
     x:'Why scale builds up, and how automatic cleaning and the Scale Remover help.',
     b:'<p>Many Indian cities have hard water, rich in calcium and magnesium. Those minerals are fine to drink, but over time they can leave scale inside pipes and appliances.</p><h3>How Tyent protects itself</h3><p>Every Tyent runs an automatic cleaning cycle that briefly reverses the charge on the plates. This loosens mineral build-up before it can harden.</p><h3>When to add a Scale Remover</h3><p>In very hard water areas, we may recommend the Tyent Scale Remover as an extra stage. It reduces scale reaching the machine and helps keep output steady over the years.</p><h3>Start with a test</h3><p>We check hardness during your free home demo and tell you whether your home needs the extra protection.</p>'}
  ];
  var feat=document.getElementById('featured'),posts=document.getElementById('posts');
  function card(a){return '<button class="post" data-id="'+a.id+'"><div class="im"'+(a.cut?' style="display:grid;place-items:center"':'')+'><img src="img/'+a.img+'.webp" alt="" loading="lazy"'+(a.cut?' style="width:auto;height:80%;object-fit:contain"':'')+'></div><p class="meta"><b>'+a.cat+'</b><span>'+a.date+'</span><span>'+a.min+' min read</span></p><h3>'+a.t+'</h3><p>'+a.x+'</p></button>'}
  function render(k){
    var list=A.filter(function(a){return k==='all'||a.cat===k});
    var f=list[0];
    feat.innerHTML=f?'<button class="feat" data-id="'+f.id+'"><div class="im"><img src="img/'+f.img+'.webp" alt=""'+(f.cut?' style="object-fit:contain;padding:30px;background:var(--tint)"':'')+'></div><div class="tx"><p class="meta"><b>Featured · '+f.cat+'</b><span>'+f.date+'</span><span>'+f.min+' min read</span></p><h2>'+f.t+'</h2><p style="color:var(--muted)">'+f.x+'</p><span class="btn btn-p" style="align-self:flex-start">Read the article <span class="arr">→</span></span></div></button>':'';
    posts.innerHTML=list.slice(1).map(card).join('');
    document.querySelectorAll('[data-id]').forEach(function(b){b.addEventListener('click',function(){open(b.dataset.id,b)})});
  }
  var bs=[].slice.call(document.querySelectorAll('#bf button'));
  bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});[].slice.call(document.querySelectorAll('.post,.feat')).forEach(function(p){p.classList.add('out')});setTimeout(function(){render(b.dataset.k);var ps=[].slice.call(document.querySelectorAll('.post'));ps.forEach(function(p,i){p.classList.add('out');setTimeout(function(){p.classList.remove('out')},60+i*60)})},still?0:240)})});
  render('all');

  var rd=document.getElementById('reader'),opener=null;
  function open(id,from){var a=A.filter(function(x){return x.id===id})[0];if(!a)return;opener=from;
    document.getElementById('rd-img').src='img/'+a.img+'.webp';document.getElementById('rd-img').style.objectFit=a.cut?'contain':'cover';document.getElementById('rd-img').style.background=a.cut?'var(--tint)':'';
    document.getElementById('rd-meta').innerHTML='<b>'+a.cat+'</b><span>'+a.date+'</span><span>'+a.min+' min read</span><span>Tyent India team</span>';
    document.getElementById('rd-t').textContent=a.t;document.getElementById('rd-prose').innerHTML=a.b;
    rd.hidden=false;document.body.style.overflow='hidden';requestAnimationFrame(function(){rd.classList.add('show')});rd.querySelector('.rd').scrollTop=0;document.getElementById('rd-close').focus()}
  function close(){rd.classList.remove('show');document.body.style.overflow='';setTimeout(function(){rd.hidden=true;if(opener)opener.focus()},still?0:300)}
  var rdEl=rd.querySelector('.rd'),rdp=document.getElementById('rdp');rdEl.addEventListener('scroll',function(){var h=rdEl.scrollHeight-rdEl.clientHeight;rdp.style.width=(h>0?rdEl.scrollTop/h*100:0)+'%'});
  document.getElementById('rd-close').addEventListener('click',close);document.getElementById('rd-back').addEventListener('click',close);
  rd.addEventListener('click',function(e){if(e.target===rd)close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!rd.hidden)close()});
})();
