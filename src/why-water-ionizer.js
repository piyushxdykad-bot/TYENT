(function(){
  var cols=['#E5483B','#E9573A','#EC6A39','#F08139','#F09A3A','#D9A93A','#8CB54C','#2FB36E','#25AC9B','#29AAE2','#2E8FDE','#3A78DB','#4463D9','#4E4BD8','#5B3FC4'];
  var info=[
    ['Very strong acid','Far too acidic for any home use.','Battery acid'],
    ['Strong acid','Not used in the home.','Stomach acid'],
    ['Strong acidic setting','Turbo acidic water, around pH 2.5, for wiping kitchen surfaces. Never drink it.','Lemon juice'],
    ['Acidic','Too acidic to drink regularly.','Orange juice, cola'],
    ['Acidic','Not a Tyent setting.','Tomato juice'],
    ['Acidic 2','Around pH 5.5, a mild rinse for hair and skin.','Black coffee'],
    ['Acidic 1','Around pH 6, for washing your face.','Milk'],
    ['Purified','Neutral, filtered water for medicines and baby formula.','Pure water'],
    ['Alkaline 1','Around pH 8.5, the gentlest drinking level and a good place to start.','Sea water'],
    ['Alkaline 2 and 3','Around pH 9 to 9.5, smooth daily drinking water for the whole family.','A pinch of baking soda in water'],
    ['Strongly alkaline','Not a drinking setting.','Milk of magnesia'],
    ['Turbo','Around pH 11.5, for soaking fruit and vegetables. Never drink it.','Household ammonia'],
    ['Very alkaline','Not used in the home.','Soapy water'],
    ['Very alkaline','Not used in the home.','Bleach'],
    ['Extremely alkaline','Far too alkaline for any home use.','Drain cleaner']
  ];
  var sc=document.getElementById('scale14');
  sc.innerHTML=cols.map(function(c,i){return '<div role="button" tabindex="0" aria-label="pH '+i+'" data-i="'+i+'" style="background:'+c+';--sc:'+c+'">'+i+'</div>'}).join('');
  var cells=[].slice.call(sc.children);
  function pick(i){cells.forEach(function(c,j){c.classList.toggle('on',j===i);c.setAttribute('aria-pressed',j===i)});
    var n=document.getElementById('pi-n');n.textContent=i;n.style.color=cols[i];document.getElementById('pi-t').textContent=info[i][0];document.getElementById('pi-d').textContent=info[i][1];document.getElementById('pi-x').textContent='Similar to: '+info[i][2]}
  cells.forEach(function(c){c.addEventListener('click',function(){pick(+c.dataset.i)});c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(+c.dataset.i)}})});
  pick(9);
  /* sweep across the scale once when it comes into view */
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    var done=false,io=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!done){done=true;io.disconnect();var k=0;(function step(){pick(k);k++;if(k<=9)setTimeout(step,90)})()}},{threshold:.6});io.observe(sc)}
})();