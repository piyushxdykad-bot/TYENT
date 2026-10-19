(function(){
  var certs=[['c-gd','Good Design Korea'],['c-tuv','TÜV Rheinland certified'],['c-nsf','NSF'],['c-kfda','Korea Food and Drug Administration'],['c-ce','CE'],['c-wqa','Water Quality Association'],['c-ansi','ANSI'],['c-rohs','RoHS compliant'],['c-gmp','Good Manufacturing Practice'],['c-epa','US EPA'],['c-fda','US FDA'],['c-jp','Japanese technology']];
  var ct='';for(var r=0;r<2;r++)certs.forEach(function(c){ct+='<img src="img/'+c[0]+'.webp" alt="'+(r?'':c[1])+'"'+(r?' aria-hidden="true"':'')+'>'});
  document.getElementById('ctrack').innerHTML=ct;
})();
