(function(){
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return document.getElementById(id)}
  /* gallery: product cut-outs sit on the arch, lifestyle shots fill it */
  var stage=$('pdStage'),img=$('pdImg'),name=document.querySelector('.pd-name').textContent;
  function show(src,cut,label){if(!img)return;img.style.opacity=0;img.style.transform='translate3d(0,14px,0) scale(.97)';
    setTimeout(function(){img.onload=function(){img.style.opacity=1;img.style.transform=''};img.src='img/'+src+'.webp';img.alt='Tyent '+name+', '+label;img.classList.toggle('cut',cut);stage.classList.toggle('photo',!cut);if(img.complete)img.onload()},still?0:220)}
  var th=[].slice.call(document.querySelectorAll('.pd-thumbs button'));
  th.forEach(function(b){b.addEventListener('click',function(){th.forEach(function(x){x.setAttribute('aria-pressed',x===b)});show(b.dataset.src,b.dataset.cut==='1',b.getAttribute('aria-label'))})});
  var sws=[].slice.call(document.querySelectorAll('.pd-fin .sw'));
  sws.forEach(function(s){s.addEventListener('click',function(){sws.forEach(function(x){x.setAttribute('aria-pressed',x===s)});document.querySelector('.pd-fin .fname').textContent=s.dataset.n;th.forEach(function(x){x.setAttribute('aria-pressed','false')});show(s.dataset.src,false,s.dataset.n+' faucet')})});
  /* pointer parallax on the stage (desktop only) */
  if(stage&&!still&&matchMedia('(pointer:fine)').matches){var raf=0,tx=0,ty=0;
    stage.addEventListener('pointermove',function(e){var r=stage.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;if(!raf)raf=requestAnimationFrame(function(){raf=0;stage.style.setProperty('--px',tx.toFixed(3));stage.style.setProperty('--py',ty.toFixed(3))})});
    stage.addEventListener('pointerleave',function(){stage.style.setProperty('--px',0);stage.style.setProperty('--py',0)})}

  /* seven waters: the glass fills and changes colour with the pH */
  var wc=$('pdWater');
  if(wc){var bs=[].slice.call(wc.querySelectorAll('.pd-wlist button')),ph=$('pdWph'),wl=$('pdWl'),wu=$('pdWu'),auto=null,cur=2,num=9,shown=9;
    function pick(i,user){var b=bs[i];if(!b)return;cur=i;wc.style.setProperty("--wc",b.style.getPropertyValue("--c"));bs.forEach(function(x){x.setAttribute('aria-selected',x===b);x.tabIndex=x===b?0:-1});
      var v=+b.dataset.ph;wc.style.setProperty('--wph',v);wl.textContent=b.dataset.l;wu.textContent=b.dataset.use;num=v;ph.dataset.label=b.dataset.v;
      if(still){ph.textContent=b.dataset.v}else tick();if(user&&auto){clearInterval(auto);auto=null}}
    function tick(){shown+=(num-shown)*.18;if(Math.abs(num-shown)<.02)shown=num;ph.textContent=Math.abs(shown-num)<.05?ph.dataset.label:shown.toFixed(1);if(shown!==num)requestAnimationFrame(tick)}
    bs.forEach(function(b,i){b.addEventListener('click',function(){pick(i,true)});
      b.addEventListener('keydown',function(e){var d=e.key==='ArrowDown'||e.key==='ArrowRight'?1:e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();var n=(i+d+bs.length)%bs.length;pick(n,true);bs[n].focus()}})});
    pick(2);
    if(!still&&'IntersectionObserver' in window)new IntersectionObserver(function(e){wc.classList.toggle('live',e[0].isIntersecting);if(e[0].isIntersecting){if(!auto&&wc.dataset.stop!=='1')auto=setInterval(function(){pick((cur+1)%bs.length)},2800)}else{clearInterval(auto);auto=null}},{threshold:.4}).observe(wc);
    wc.addEventListener('pointerdown',function(){wc.dataset.stop='1';clearInterval(auto);auto=null})}

  /* full specification toggle */
  var more=document.querySelector('.pd-more'),spec=$('pdSpec');
  if(more)more.addEventListener('click',function(){var o=!spec.classList.contains('open');spec.classList.toggle('open',o);more.setAttribute('aria-expanded',o);more.textContent=o?'Show fewer specifications':more.textContent.replace('fewer','all');
    if(!o){more.textContent='Show all '+spec.querySelectorAll('.r').length+' specifications';spec.scrollIntoView({block:'start'})}});

  /* sticky buy bar once the hero's buy block scrolls away */
  var bar=$('pdBar'),buy=document.querySelector('.pd-buy'),foot=document.querySelector('footer');
  if(bar&&buy&&'IntersectionObserver' in window){var past=false,nearFoot=false;
    function set(){var on=past&&!nearFoot;bar.classList.toggle('on',on);bar.setAttribute('aria-hidden',!on);bar.querySelectorAll('button').forEach(function(b){b.tabIndex=on?0:-1})}
    new IntersectionObserver(function(e){past=!e[0].isIntersecting&&e[0].boundingClientRect.top<0;set()}).observe(buy);
    if(foot)new IntersectionObserver(function(e){nearFoot=e[0].isIntersecting;set()}).observe(foot);
    bar.querySelector('.pd-bar-add').addEventListener('click',function(){buy.querySelector('.add').click()});
    bar.querySelector('.pd-bar-call').addEventListener('click',function(){buy.querySelector('.call').click()});
  }
})();
