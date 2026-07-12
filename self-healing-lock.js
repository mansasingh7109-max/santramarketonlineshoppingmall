// self-healing-lock.js - v2.1 - Santra Dev-Only Prompt
(function(){
  // --- 1) SIRF TUMHARE LIYE CHALEGA, CUSTOMER KE LIYE NAHI ---
  const IS_DEV = window.location.hostname === 'localhost'
              || window.location.search.includes('dev=1')
              || localStorage.getItem('santra_admin') === 'true';
  if (!IS_DEV) return; // customer ko kuch nahi dikhega

  const LOCK = window.SM_LOCK || {};
  const SEC = window.SM_SECRETS || {};
  
  const VERSION = '2.1-dev';
  const PHONE = LOCK.notifyPhone || '918769171078';
  const EMAIL = LOCK.notifyEmail || 'santramarketshoppingmall@gmail.com';

  const PROTECTED_FILES = [
    'santra-home.js',
    'santra-admin.js',
    'santra-master-auto.js',
    'index.html',
    'config.js',
    'secrets.js',
    'product.html',
    'cart.html',
    'checkout.html'   // <— checkout bhi add kiya
  ];

  // --- 2) AUTO-CORRECT BAND, PROMPT ON ---
  function sendAlert(type, detail){
    const msg = `🚨 SANTRA ${type}: ${detail} | v${VERSION}`;
    console.warn(msg);
  }

  async function checkFile(file){
    try{
      const res = await fetch(file + '?t=' + Date.now(), {cache:'no-store'});
      const newCode = await res.text();
      const oldCode = localStorage.getItem('lock_baseline_'+file);

      if(!oldCode){
        localStorage.setItem('lock_baseline_'+file, newCode);
        console.log("✅ Baseline saved:", file);
        return;
      }
      if(oldCode !== newCode){
        // kaunsi line badli
        const oldLines = oldCode.split('\n');
        const newLines = newCode.split('\n');
        let diff = '';
        for(let i=0;i<Math.max(oldLines.length,newLines.length);i++){
          if(oldLines[i] !== newLines[i]){
            diff += `Line ${i+1}:\n- ${oldLines[i]||''}\n+ ${newLines[i]||''}\n`;
            break; // pehli change dikhao
          }
        }
        console.group("⚠️ LOCK ALERT: " + file);
        console.log(diff);

        const choice = confirm(file + " badli hai.\n\n" + diff + "\n\nOK = nayi accept karo\nCancel = purani wapas lao");
        if(choice){
          localStorage.setItem('lock_baseline_'+file, newCode);
          sendAlert('ACCEPT EDIT', file);
        }else{
          sendAlert('RESTORE PREVIOUS', file);
          // purani wapas lane ke liye GitHub se revert karna padega
          alert("Purani wapas lane ke liye GitHub > "+file+" > History > kal wala version restore karo");
        }
        console.groupEnd();
      }
    }catch(e){}
  }

  // har 10 sec me check (sirf dev me)
  setInterval(()=>{
    PROTECTED_FILES.forEach(checkFile);
  },10000);

  window.addEventListener('load', ()=> {
    console.log("✅ SANTRA-LOCK v"+VERSION+" (DEV ONLY) connected");
    console.log("Protected:", PROTECTED_FILES.join(', '));
  });

  window.SantraLock = { VERSION, PROTECTED_FILES };
})();