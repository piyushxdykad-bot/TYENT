(function(){
  var C=[
    ['c-gd','design','Design award','Good Design Korea','Korea\'s national design award, given to products judged for appearance, function and usability.'],
    ['c-tuv','safety','Testing and certification','TÜV Rheinland','An independent German testing body that checks products against safety and quality standards.'],
    ['c-nsf','water','Public health','NSF','A public health organisation that writes standards and tests products, including water treatment equipment.'],
    ['c-wqa','water','Water industry','Water Quality Association','A not-for-profit association for the water treatment industry, known for its product testing programme.'],
    ['c-ansi','safety','Standards','ANSI','The American National Standards Institute coordinates standards in the US, including those used to test water treatment products.'],
    ['c-kfda','water','Regulator','Korea Food and Drug Administration','Korea\'s food and drug safety regulator, now known as the Ministry of Food and Drug Safety.'],
    ['c-ce','safety','European conformity','CE marking','Shows the product meets European Union health, safety and environmental requirements.'],
    ['c-rohs','env','Hazardous substances','RoHS compliant','Restricts lead, mercury and other hazardous substances in electrical and electronic equipment.'],
    ['c-gmp','safety','Manufacturing','Good Manufacturing Practice','A quality system that keeps manufacturing consistent and controlled, batch after batch.'],
    ['c-epa','env','Environment','US EPA','The United States Environmental Protection Agency, the federal body for environmental protection.'],
    ['c-fda','water','Regulator','US FDA','The United States Food and Drug Administration, which oversees food safety and medical products.'],
    ['c-jp','design','Technology','Japanese technology','Tyent\'s mark for the ionization technology heritage behind its machines.'],
    ['c-usa','design','Brand recognition','Best-selling brand in the USA','Tyent\'s recognition as one of the best-selling water ionizer brands in the United States.']
  ];
  var cg=document.getElementById('cg');
  cg.innerHTML=C.map(function(c){return '<article class="cert" data-k="'+c[1]+'"><div class="lg"><img src="img/'+c[0]+'.webp" alt="'+c[3]+' logo" loading="lazy"></div><div class="tx"><small>'+c[2]+'</small><h3>'+c[3]+'</h3><p>'+c[4]+'</p></div></article>'}).join('');
  var bs=[].slice.call(document.querySelectorAll('#cf button'));
  bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    var cs=[].slice.call(cg.querySelectorAll('.cert'));cs.forEach(function(c){c.classList.add('out')});setTimeout(function(){cs.forEach(function(c){c.hidden=!(b.dataset.k==='all'||c.dataset.k===b.dataset.k)});requestAnimationFrame(function(){cs.forEach(function(c,i){setTimeout(function(){c.classList.remove('out')},i*40)})})},220)})});
})();
