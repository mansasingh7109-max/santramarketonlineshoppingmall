// OLD BACKUP V12 SAFE - ?v= wale safe - past wala safe
/*
 // OLD BACKUP V11 SAFE - past?v= wale safe
 // OLD BACKUP END
 // AUTO-LOADER.JS V12 FINAL 26 JULY - NO VERSION + < ERROR FIX
 (function(){ var t=Date.now(); ... files=[...] ... s.src=src+'?t='+t; ... })();
 OLD BACKUP END V12 SAFE
*/

// AUTO-LOADER.JS V13 FINAL 27 JULY - WITHOUT VERSION - NO ?v= NO ?t= - < ERROR FIX - OLD SAVE WITH UPDATE
(function(){
  console.log("✅ Auto-loader V13 FINAL - WITHOUT VERSION - Old Save - No ?v= No ?t= - < error fix");
  // Jo file 404 de rahi hai usko skip karo - < error fix
  var skip404 = ['backup-all-image.js','time-fix.js','double-code-safeguard.js','cache-buster.js','santra-safe-start.js','mychoice.js'];
  var files=[
    'constants.js',
    'config.js',
    'secrets.js',
    'order-saver.js',
    'santra-image-link-fix.js',
    'santra-mychoice-sync-fix.js',
    'cart.js',
    'share.js'
  ];
  files.forEach(function(src){
    if(skip404.indexOf(src)!==-1) return;
    // Agar already bina version ke loaded hai to skip
    if(document.querySelector('script[src="'+src+'"]')) return;
    if(document.querySelector('script[src*="'+src+'?v="]')) return;
    if(document.querySelector('script[src*="'+src+'?t="]')) return;
    var s=document.createElement('script');
    s.src=src; // BINA VERSION KE - NO ?v= NO ?t=
    s.async=false;
    s.onerror=function(){ console.log("⏭️ Skip 404 "+src+" - < error fix"); this.remove(); };
    document.head.appendChild(s);
  });
  console.log("✅ Auto-loader V13 - WITHOUT VERSION - LAST LINE OK");
})();