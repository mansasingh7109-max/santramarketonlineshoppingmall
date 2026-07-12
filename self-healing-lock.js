// self-healing-lock.js - v2.0 - Santra Auto-Heal
(function(){
  // Config aur Secrets se auto-read
  const LOCK = window.SM_LOCK || {};
  const SEC = window.SM_SECRETS || {};
  
  const WISH_KEY = LOCK.wishlistKey || 'santraWishlist';
  const CART_KEYS = LOCK.cartKeys || ['santraCart'];
  const VERSION = LOCK.version || '2.0';
  
  const PHONE = LOCK.notifyPhone || '918769171078';
  const EMAIL = LOCK.notifyEmail || 'santramarketshoppingmall@gmail.com';
  const WA_KEY = SEC.WHATSAPP_KEY || '';
  const EJ_PUB = SEC.EMAILJS_PUBLIC || '';
  const EJ_SVC = SEC.EMAILJS_SERVICE || '';
  const EJ_TMP = SEC.EMAILJS_TEMPLATE || '';

  // Protected files list - NAYA
  const PROTECTED_FILES = [
    'santra-home.js',
    'santra-admin.js',
    'santra-master-auto.js',
    'index.html',
    'config.js',
    'secrets.js'
  ];

  // Notification
  function sendAlert(type, detail){
    const msg = `🚨 SANTRA ${type}: ${detail} | v${VERSION}`;
    console.warn(msg);
    if(WA_KEY) {
      fetch(`https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${encodeURIComponent(msg)}&apikey=${WA_KEY}`).catch(()=>{});
    }
    if(EJ_PUB && window.emailjs) {
      emailjs.send(EJ_SVC, EJ_TMP, {to_email:EMAIL, message:msg}).catch(()=>{});
    }
  }

  // Protect Wishlist
  window.protectWishlist = function(){ 
    try{ 
      JSON.parse(localStorage.getItem(WISH_KEY)||'[]'); 
    }catch(e){ 
      sendAlert('WISHLIST CORRUPT','auto-fix'); 
      localStorage.setItem(WISH_KEY,'[]'); 
    } 
  };

  // Protect Cart - NAYA KEY
  window.protectCart = function(){ 
    CART_KEYS.forEach(k=>{ 
      try{ 
        JSON.parse(localStorage.getItem(k)||'[]'); 
      }catch(e){ 
        sendAlert('CART CORRUPT',k); 
        localStorage.setItem(k,'[]'); 
      } 
    }); 
  };

  // Toggle Wishlist - Santra version
  if(typeof toggleWishlist !== 'function'){
    window.toggleWishlist = function(id){
      let list = JSON.parse(localStorage.getItem(WISH_KEY)||'[]');
      list = list.includes(id) ? list.filter(x=>x!==id) : [...list,id];
      localStorage.setItem(WISH_KEY, JSON.stringify(list));
      sendAlert('WISHLIST UPDATE', id);
    };
  }

  // NAYA: Home page alive check
  window.protectHome = function(){
    const alive = localStorage.getItem('homeAlive');
    if(!alive || (Date.now() - alive) > 30000){
      sendAlert('HOME DOWN','santra-home.js not responding');
      // auto-reload home functions
      if(window.healHome) window.healHome();
    }
  };

  // Auto-run har 5 sec
  setInterval(()=>{ 
    window.protectWishlist(); 
    window.protectCart();
    window.protectHome();
  }, 5000);

  window.addEventListener('load', ()=> {
    console.log("✅ SANTRA-LOCK v"+VERSION+" connected");
    console.log("Protected:", PROTECTED_FILES.join(', '));
    sendAlert('SYSTEM START','Lock active');
  });

  // Expose for admin panel
  window.SantraLock = { VERSION, PROTECTED_FILES, sendAlert };
})();