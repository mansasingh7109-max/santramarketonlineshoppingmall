// ==================== CUSTOMER-ACCOUNT.JS - OLD 30 JUNE + CONSTANTS.JS FIX + NO BLAZE ====================

// ✅ FIX: Tere constants.js sirf CART_KEY, BASE_URL deta hai - Baaki fallback se lo
if(typeof window.CUSTOMER_KEY === 'undefined'){ window.CUSTOMER_KEY = "santra_customer"; }
if(typeof window.ADMIN_WHATSAPP === 'undefined'){ window.ADMIN_WHATSAPP = "918769171078"; }
if(typeof window.BASE_URL === 'undefined'){ window.BASE_URL = "https://santramarketshoppingmall.web.app"; }
if(typeof window.COLLECTIONS === 'undefined'){ 
  window.COLLECTIONS = { CUSTOMERS: 'customers', LOGIN_REQUESTS: 'login_requests', LOGIN_OTPS: 'login_otps', ORDERS: 'orders' }; 
}
if(typeof window.firebaseConfig === 'undefined'){
  window.firebaseConfig = {
    apiKey: "AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",
    authDomain: "santramarketshoppingmall.firebaseapp.com",
    projectId: "santramarketshoppingmall",
    storageBucket: "santramarketshoppingmall.appspot.com",
    messagingSenderId: "398490252924",
    appId: "1:398490252924:web:d1b6348b549183b93b7bf9"
  };
}

const CUSTOMER_KEY = window.CUSTOMER_KEY;
const ADMIN_WHATSAPP = window.ADMIN_WHATSAPP;
const BASE_URL = window.BASE_URL;
const COLLECTIONS = window.COLLECTIONS;

console.log("✅ customer-account.js - CART_KEY:", window.CART_KEY, "CUSTOMER_KEY:", CUSTOMER_KEY);

window.addEventListener('load', function() {
  try {
    if (typeof firebase === 'undefined') {
      showToast('❌ Firebase load nahi hua. Internet check karo', true);
      return;
    }
    // ✅ TERA config.js FOLLOW - initFirebaseOnce
    try{
      if(typeof window.initFirebaseOnce === 'function'){
        window.initFirebaseOnce(window.firebaseConfig);
      } else if (!firebase.apps.length){
        firebase.initializeApp(window.firebaseConfig);
      }
    }catch(e){ console.log("Firebase init:", e.message); }
    
    const db = window.db || firebase.firestore();
    // ❌ const storage = firebase.storage(); // HATA DIYA - Blaze maangta hai

    let currentCustomer = null;
    let uploadedPhotoURL = null;

    function safeGet(id){
      const el = document.getElementById(id);
      if(!el) console.warn('Element not found:', id);
      return el;
    }
    function safeClass(id, action, cls){
      const el = safeGet(id);
      if(el && el.classList) el.classList[action](cls);
    }
    function safeShow(id, show=true){
      const el = safeGet(id);
      if(el) el.style.display = show ? 'block' : 'none';
    }

    const sendOtpBtn = safeGet('sendOtpBtn');
    const verifyOtpBtn = safeGet('verifyOtpBtn');
    const editProfileBtn = safeGet('editProfileBtn');
    const logoutBtn = safeGet('logoutBtn');
    const changePhotoBtn = safeGet('changePhotoBtn');
    const photoInput = safeGet('photoInput');
    const saveChangesBtn = safeGet('saveChangesBtn');
    const cancelEditBtn = safeGet('cancelEditBtn');
    const displayPhoto = safeGet('displayPhoto');

    if(sendOtpBtn) sendOtpBtn.addEventListener('click', sendLoginOTP);
    if(verifyOtpBtn) verifyOtpBtn.addEventListener('click', verifyLoginOTP);
    if(editProfileBtn) editProfileBtn.addEventListener('click', enableEditMode);
    if(logoutBtn) logoutBtn.addEventListener('click', customerLogout);
    if(changePhotoBtn) changePhotoBtn.addEventListener('click', () => photoInput && photoInput.click());
    if(photoInput) photoInput.addEventListener('change', uploadPhotoFree); // ✅ FREE WALA
    if(saveChangesBtn) saveChangesBtn.addEventListener('click', saveProfile);
    if(cancelEditBtn) cancelEditBtn.addEventListener('click', cancelEdit);
    if(displayPhoto) displayPhoto.addEventListener('click', () => {
      const viewMode = safeGet('viewMode');
      if(viewMode && !viewMode.classList.contains('hide')) {
        enableEditMode();
      }
    });

    checkLoginAndLoad();

    function checkLoginAndLoad() {
      let customerStr = localStorage.getItem(CUSTOMER_KEY + '_profile') || localStorage.getItem('santra_customer');
      let mobile = localStorage.getItem(CUSTOMER_KEY + '_whatsapp_mobile') || localStorage.getItem(CUSTOMER_KEY + '_customer_mobile') || localStorage.getItem('santra_whatsapp_mobile');
      
      if(!mobile && customerStr){
        try{
          let old = JSON.parse(customerStr);
          if(old && old.isLoggedIn) mobile = old.loginMobile || old.mobile;
        }catch(e){}
      }

      if(!mobile) {
        safeClass('loginBox','remove','hide');
        safeClass('viewMode','add','hide');
        return;
      }
      
      db.collection(COLLECTIONS.CUSTOMERS).doc(mobile).get().then(doc=>{
        if(doc.exists){
          currentCustomer = doc.data();
          currentCustomer.isLoggedIn = true;
          safeClass('loginBox','add','hide');
          safeClass('viewMode','remove','hide');
          document.title = `👤 My Profile - ${currentCustomer.name} - SANTRA MALL`;
          loadProfile();
          loadStats();
        } else if(customerStr){
          currentCustomer = JSON.parse(customerStr);
          currentCustomer.isLoggedIn = true;
          safeClass('loginBox','add','hide');
          safeClass('viewMode','remove','hide');
          loadProfile();
          loadStats();
        }
      });
    }

    function sendLoginOTP() {
      const btn = safeGet('sendOtpBtn');
      const mobileEl = safeGet('loginMobile');
      if(!mobileEl) return;
      const mobile = mobileEl.value.trim();
      if(mobile.length !== 10) return showToast('❌ 10 digit mobile daalo', true);

      if(btn){ btn.disabled = true; btn.innerText = 'Sending...'; }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      db.collection(COLLECTIONS.LOGIN_REQUESTS).doc(mobile + '_' + Date.now()).set({
        mobile: mobile,
        otp: otp,
        isVerified: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'profile_login'
      }).then(() => {
        db.collection(COLLECTIONS.LOGIN_OTPS).doc(mobile).set({
          otp: otp,
          mobile: mobile,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        const msg = `🔐 *SANTRA MALL LOGIN OTP*\n\nYour OTP: *${otp}*\n\nValid for 4 hours.`;
        window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
        safeShow('otpVerifyBox', true);
        showToast('📲 OTP Request Admin ko bheja!');
        if(btn){ btn.disabled = false; btn.innerText = '📲 Send OTP on WhatsApp'; }
      }).catch(err => {
        showToast('❌ Error: ' + err.message, true);
        if(btn){ btn.disabled = false; btn.innerText = '📲 Send OTP on WhatsApp'; }
      });
    }

    function verifyLoginOTP() {
      const mobileEl = safeGet('loginMobile');
      const otpEl = safeGet('loginOTP');
      if(!mobileEl || !otpEl) return;
      const mobile = mobileEl.value.trim();
      const enteredOTP = otpEl.value.trim();
      if(enteredOTP.length !== 6) return showToast('❌ 6 digit OTP daalo!', true);

      db.collection(COLLECTIONS.LOGIN_OTPS).doc(mobile).get().then((doc) => {
        if(!doc.exists) return showToast('❌ OTP not found! Send again', true);
        const data = doc.data();
        if(data.otp === enteredOTP) {
          return db.collection(COLLECTIONS.CUSTOMERS).doc(mobile).get();
        } else {
          showToast('❌ Wrong OTP!', true);
          return Promise.reject('WRONG_OTP');
        }
      }).then((custDoc) => {
        if(custDoc && custDoc.exists) {
          currentCustomer = custDoc.data();
          currentCustomer.isLoggedIn = true;
          currentCustomer.otpVerified = true;
        } else {
          currentCustomer = {
            loginMobile: mobile, mobile: mobile, name: 'Customer', email: '',
            photo: '', location: '', isLoggedIn: true, isOldCustomer: false,
            otpVerified: true, totalOrders: 0, createdAt: new Date().toLocaleDateString('en-IN')
          };
          db.collection(COLLECTIONS.CUSTOMERS).doc(mobile).set(currentCustomer, {merge:true});
        }
        localStorage.setItem(CUSTOMER_KEY + '_whatsapp_mobile', mobile);
        localStorage.setItem(CUSTOMER_KEY + '_customer_mobile', mobile);
        localStorage.setItem(CUSTOMER_KEY + '_profile', JSON.stringify(currentCustomer));
        localStorage.setItem('santra_customer', JSON.stringify(currentCustomer));
        localStorage.setItem('santra_whatsapp_mobile', mobile);
        
        showToast('✅ Login Successful!');
        setTimeout(() => location.reload(), 1000);
      }).catch(err => {
        if(err !== 'WRONG_OTP') showToast('❌ Error: ' + err, true);
      });
    }

    function loadProfile() {
      if(!currentCustomer) return;
      const setText = (id, val) => { const el = safeGet(id); if(el) el.innerText = val; };
      const setSrc = (id, val) => { const el = safeGet(id); if(el) el.src = val; };
      
      setText('displayName', currentCustomer.name || 'Customer');
      setText('displayMobile', `+91 ${currentCustomer.mobile}`);
      setText('displayLoginMobile', currentCustomer.loginMobile || currentCustomer.mobile);
      setText('displayDeliveryMobile', currentCustomer.mobile || 'Not provided');
      setText('displayEmail', currentCustomer.email || 'Not provided');
      setText('displayLocation', currentCustomer.location || 'Not provided');
      setSrc('displayPhoto', currentCustomer.photo || 'https://via.placeholder.com/120?text=Photo');
      if(currentCustomer.otpVerified) safeClass('verifiedBadge','remove','hide');
    }

    function enableEditMode() {
      safeClass('viewMode','add','hide');
      safeShow('editMode', true);
      const setVal = (id, val) => { const el = safeGet(id); if(el) el.value = val; };
      setVal('editName', currentCustomer.name || '');
      setVal('editLoginMobile', currentCustomer.loginMobile || currentCustomer.mobile || '');
      setVal('editDeliveryMobile', currentCustomer.mobile || '');
      setVal('editEmail', currentCustomer.email || '');
      setVal('editLocation', currentCustomer.location || '');
      const editPhoto = safeGet('editPhoto');
      if(editPhoto) editPhoto.src = currentCustomer.photo || 'https://via.placeholder.com/120?text=Photo';
    }

    function cancelEdit() {
      safeShow('editMode', false);
      safeClass('viewMode','remove','hide');
    }

    // ✅ FREE PLAN - NO BLAZE - Base64 compress
    function uploadPhotoFree() {
      const fileInput = safeGet('photoInput');
      if(!fileInput || !fileInput.files[0]) return;
      const file = fileInput.files[0];
      if(file.size > 5 * 1024 * 1024) return showToast('❌ Photo size 5MB se kam rakho!', true);
      
      const loader = safeGet('uploadLoader');
      if(loader) loader.style.display = 'block';
      
      const reader = new FileReader();
      reader.onload = function(e){
        const img = new Image();
        img.onload = function(){
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          let width = img.width;
          let height = img.height;
          if(width > MAX_WIDTH){
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.6);
          
          const editPhoto = safeGet('editPhoto');
          if(editPhoto) editPhoto.src = base64;
          uploadedPhotoURL = base64;
          if(loader) loader.style.display = 'none';
          showToast('✅ Photo ready! Save karo - Free plan');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function saveProfile() {
      const getVal = (id) => safeGet(id)?.value.trim() || '';
      const name = getVal('editName');
      const loginMobile = getVal('editLoginMobile');
      const deliveryMobile = getVal('editDeliveryMobile');
      const email = getVal('editEmail');
      const location = getVal('editLocation');
      const photo = uploadedPhotoURL || safeGet('editPhoto')?.src;

      if(!name || !loginMobile || !deliveryMobile || !location) return showToast('❌ Name, Dono Mobile aur Location required hai!', true);
      if(loginMobile.length !== 10 || deliveryMobile.length !== 10) return showToast('❌ 10 digit mobile daalo', true);

      const customerData = { name, loginMobile, mobile: deliveryMobile, email, photo, location,
        isLoggedIn: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };

      db.collection(COLLECTIONS.CUSTOMERS).doc(loginMobile).set(customerData, { merge: true })
      .then(() => {
        localStorage.setItem(CUSTOMER_KEY + '_whatsapp_mobile', loginMobile);
        localStorage.setItem(CUSTOMER_KEY + '_profile', JSON.stringify(customerData));
        localStorage.setItem('santra_customer', JSON.stringify(customerData));
        localStorage.setItem('santra_whatsapp_mobile', loginMobile);
        currentCustomer = customerData;
        showToast('✅ Profile Saved Successfully! - Free plan');
        setTimeout(() => { cancelEdit(); loadProfile(); }, 1000);
      })
      .catch(err => showToast('❌ Error: ' + err, true));
    }

    function loadStats() {
      if(!currentCustomer) return;
      const mobileToUse = currentCustomer.mobile || currentCustomer.loginMobile;
      db.collection(COLLECTIONS.ORDERS).where('customerMobile', '==', mobileToUse).get()
      .then(snap => {
        let totalOrders = snap.size;
        let totalSpent = 0;
        snap.forEach(doc => { totalSpent += doc.data().totalAmount || 0; });
        const setText = (id, val) => { const el = safeGet(id); if(el) el.innerText = val; };
        setText('statOrders', totalOrders);
        setText('statSpent', `₹${totalSpent}`);
        setText('displayOrders', totalOrders);
      });
    }

    function customerLogout() {
      if(confirm('Logout karna hai?')) {
        localStorage.removeItem('santra_customer');
        localStorage.removeItem(CUSTOMER_KEY + '_whatsapp_mobile');
        localStorage.removeItem(CUSTOMER_KEY + '_customer_mobile');
        localStorage.removeItem(CUSTOMER_KEY + '_profile');
        localStorage.removeItem('santra_whatsapp_mobile');
        localStorage.setItem(CUSTOMER_KEY + '_logout_signal', Date.now());
        showToast('✅ Logged out successfully');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
      }
    }

    function showToast(message, isError = false) {
      const toast = safeGet('toast');
      if(!toast) return alert(message);
      toast.innerText = message;
      toast.classList.add('show');
      if(isError) toast.classList.add('error');
      setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.remove('error');
      }, 3000);
    }

  } catch(e) {
    alert('JavaScript Error: ' + e.message + '\n\nconstants.js check karo!');
    console.error(e);
  }
});
console.log("✅ customer-account.js OLD 30 JUNE + CONSTANTS.JS SAFE + NO BLAZE");