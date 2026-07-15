// ==================== CUSTOMER-ACCOUNT.JS - FINAL 15 JULY 2026 ====================
// OLD CODE BACKUP - 30-JUNE-2026 02:15 PM - UPDATED - SAFE HIDE - TERI PURANI FILE YAHAN HAI
/*
OLD CODE BACKUP - 29-JUNE-2026 03:20 PM
ISSUE FIXED: Cannot read properties of null (reading 'classList')
REASON: Acode me elements nahi mile to error aata tha
FIX: safeGet() helper add kiya - har getElementById check karega

window.addEventListener('load', function() {
  try {
    if (typeof firebase === 'undefined') {
      showToast('❌ Firebase load nahi hua. Internet check karo', true);
      return;
    }
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = firebase.storage();
    let currentCustomer = null;
    let uploadedPhotoURL = null;
    function safeGet(id){... }
    function safeClass(id, action, cls){... }
    function safeShow(id, show=true){... }
   ... sendLoginOTP, verifyLoginOTP, loadProfile, enableEditMode, saveProfile, loadStats, customerLogout...
  } catch(e) {
    alert('JavaScript Error: ' + e.message + '\n\nsecrets.js file check karo!');
  }
});

OLD CODE BACKUP END - 29 & 30 JUNE WALA SAFE HAI - HATAYA NAHI
*/

// ==================== NAYA CODE - 15 JULY 2026 - CONSTANTS.JS SUPPORT + FULL CONNECT + BUG FIX ====================

window.addEventListener('load', function() {
  try {
    // ✅ CONSTANTS.JS se keys lo - ZINDAGI BHAR KA FIX
    const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
    const ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";
    const BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";

    const firebaseConfig = window.firebaseConfig || {
      apiKey: "AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",
      authDomain: "santramarketshoppingmall.firebaseapp.com",
      projectId: "santramarketshoppingmall",
      storageBucket: "santramarketshoppingmall.appspot.com",
      messagingSenderId: "398490252924",
      appId: "1:398490252924:web:d1b6348b549183b93b7bf9"
    };

    if (typeof firebase === 'undefined') {
      showToast('❌ Firebase load nahi hua. Internet check karo', true);
      return;
    }
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();
    const storage = firebase.storage();

    let currentCustomer = null;
    let uploadedPhotoURL = null;

    // ✅ SAFE HELPER - Ye error khatam karega - classList wala bug fix
    function safeGet(id){
      const el = document.getElementById(id);
      return el;
    }
    function safeClass(id, action, cls){
      const el = safeGet(id);
      if(el && el.classList) el.classList[action](cls);
    }
    function safeShow(id, show=true){
      const el = safeGet(id);
      if(el) el.style.display = show? 'block' : 'none';
    }
    function safeText(id, val){
      const el = safeGet(id);
      if(el) el.innerText = val;
    }

    // ✅ EVENT LISTENERS - safe check ke saath
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
    if(photoInput) photoInput.addEventListener('change', uploadPhotoToFirebase);
    if(saveChangesBtn) saveChangesBtn.addEventListener('click', saveProfile);
    if(cancelEditBtn) cancelEditBtn.addEventListener('click', cancelEdit);
    if(displayPhoto) displayPhoto.addEventListener('click', () => {
      const viewMode = safeGet('viewMode');
      if(viewMode &&!viewMode.classList.contains('hide')) {
        enableEditMode();
      }
    });

    checkLoginAndLoad();
    if(typeof updateCartBadge === 'function') updateCartBadge();

    function checkLoginAndLoad() {
      // ✅ FIX: CUSTOMER_KEY se check karo - customer-login.html se connect
      let customer = localStorage.getItem(CUSTOMER_KEY + '_profile') || localStorage.getItem(CUSTOMER_KEY + '_whatsapp_mobile') || localStorage.getItem('santra_customer');
      let mobile = localStorage.getItem(CUSTOMER_KEY + '_whatsapp_mobile');

      if(!mobile){
        // Agar old key me hai to new me convert karo
        try{
          let old = JSON.parse(localStorage.getItem('santra_customer')||'null');
          if(old && old.isLoggedIn){
            mobile = old.loginMobile || old.mobile;
            localStorage.setItem(CUSTOMER_KEY + '_whatsapp_mobile', mobile);
          }
        }catch(e){}
      }

      if(!mobile) {
        safeClass('loginBox','remove','hide');
        safeClass('viewMode','add','hide');
        safeClass('editMode','add','hide');
        return;
      }

      // Profile load karo
      db.collection('customers').doc(mobile).get().then(doc=>{
        if(doc.exists){
          currentCustomer = doc.data();
          currentCustomer.isLoggedIn = true;
          safeClass('loginBox','add','hide');
          safeClass('viewMode','remove','hide');
          safeClass('editMode','add','hide');
          document.title = `👤 My Profile - ${currentCustomer.name} - SANTRA MALL`;
          loadProfile();
          loadStats();
        } else {
          safeClass('loginBox','remove','hide');
        }
      }).catch(()=>{
        safeClass('loginBox','remove','hide');
      });
    }

    function sendLoginOTP() {
      const btn = safeGet('sendOtpBtn');
      const mobileEl = safeGet('loginMobile');
      if(!mobileEl) return;
      const mobile = mobileEl.value.trim();
      if(mobile.length!== 10) return showToast('❌ 10 digit mobile daalo', true);

      if(btn){ btn.disabled = true; btn.innerText = 'Sending...'; }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      db.collection('login_requests').doc(mobile + '_' + Date.now()).set({
        mobile: mobile,
        otp: otp,
        isVerified: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'profile_login'
      }).then(() => {
        db.collection('login_otps').doc(mobile).set({
          otp: otp,
          mobile: mobile,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          expireHours: 4
        });

        const msg = `🔐 *SANTRA MALL LOGIN OTP*\n\nYour OTP: *${otp}*\n\nValid for 4 hours.\n\nProfile: ${BASE_URL}/customer-account.html`;
        window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
        safeShow('otpVerifyBox', true);
        showToast('📲 OTP Request Admin ko bheja! 4 hour valid');
        if(btn){ btn.disabled = false; btn.innerText = '📲 Send OTP on WhatsApp'; }
      }).catch(err => {
        showToast('❌ Error: ' + err.message, true);
        if(btn){ btn.disabled = false; btn.innerText = '📲 Send OTP on WhatsApp'; }
      });
    }

    function verifyLoginOTP() {
      const mobileEl = safeGet('loginMobile');
      const otpEl = safeGet('loginOTP');
      if(!mobileEl ||!otpEl) return;
      const mobile = mobileEl.value.trim();
      const enteredOTP = otpEl.value.trim();
      if(enteredOTP.length!== 6) return showToast('❌ 6 digit OTP daalo!', true);

      db.collection('login_otps').doc(mobile).get().then((doc) => {
        if(!doc.exists) return showToast('❌ OTP not found! Resend karo', true);
        const data = doc.data();
        const otpTime = data.timestamp?.toDate?.() || new Date();
        const diffHours = (new Date() - otpTime) / 1000 / 60 / 60;
        if(diffHours > 4) return showToast('❌ OTP expire (4 hours)! Resend karo', true);

        if(data.otp === enteredOTP) {
          return db.collection('customers').doc(mobile).get();
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
          db.collection('customers').doc(mobile).set(currentCustomer, {merge:true});
        }
        localStorage.setItem(CUSTOMER_KEY + '_whatsapp_mobile', mobile);
        localStorage.setItem(CUSTOMER_KEY + '_customer_mobile', mobile);
        localStorage.setItem(CUSTOMER_KEY + '_profile', JSON.stringify(currentCustomer));
        localStorage.setItem('santra_customer', JSON.stringify(currentCustomer));

        showToast('✅ Login Successful! OTP Verified');
        setTimeout(() => location.reload(), 1000);
      }).catch(err => {
        if(err!== 'WRONG_OTP') showToast('❌ Error: ' + err, true);
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
      setText('displayLocation', currentCustomer.location || currentCustomer.address || 'Not provided');
      setSrc('displayPhoto', currentCustomer.photo || 'https://via.placeholder.com/120?text=Photo');
      const badge = safeGet('verifiedBadge');
      if(badge && currentCustomer.otpVerified) badge.classList.remove('hide');

      // Parent ko batao - customer-account.html ke liye
      window.parent.postMessage({type: 'profileUpdated', photo: currentCustomer.photo||''}, '*');
    }

    function enableEditMode() {
      safeClass('viewMode','add','hide');
      safeShow('editMode', true);
      const setVal = (id, val) => { const el = safeGet(id); if(el) el.value = val; };
      setVal('editName', currentCustomer.name || '');
      setVal('editLoginMobile', currentCustomer.loginMobile || currentCustomer.mobile || '');
      setVal('editDeliveryMobile', currentCustomer.mobile || '');
      setVal('editEmail', currentCustomer.email || '');
      setVal('editLocation', currentCustomer.location || currentCustomer.address || '');
      const editPhoto = safeGet('editPhoto');
      if(editPhoto) editPhoto.src = currentCustomer.photo || 'https://via.placeholder.com/120?text=Photo';
    }

    function cancelEdit() {
      safeShow('editMode', false);
      safeClass('viewMode','remove','hide');
    }

    function uploadPhotoToFirebase() {
      const fileInput = safeGet('photoInput');
      if(!fileInput ||!fileInput.files[0]) return;
      const file = fileInput.files[0];
      if(file.size > 2 * 1024 * 1024) return showToast('❌ Photo 2MB se kam honi chahiye!', true);

      const loader = safeGet('uploadLoader');
      if(loader) loader.style.display = 'block';

      const mobile = currentCustomer.loginMobile || currentCustomer.mobile;
      const fileName = `profile_photos/${mobile}/${Date.now()}.jpg`;
      storage.ref(fileName).put(file).then(snap => snap.ref.getDownloadURL()).then((downloadURL) => {
        const editPhoto = safeGet('editPhoto');
        if(editPhoto) editPhoto.src = downloadURL;
        uploadedPhotoURL = downloadURL;
        if(loader) loader.style.display = 'none';
        showToast('✅ Photo uploaded!');
      }).catch((error) => {
        if(loader) loader.style.display = 'none';
        showToast('❌ Upload failed: ' + error.message, true);
      });
    }

    function saveProfile() {
      const getVal = (id) => safeGet(id)?.value.trim() || '';
      const name = getVal('editName');
      const loginMobile = getVal('editLoginMobile');
      const deliveryMobile = getVal('editDeliveryMobile');
      const email = getVal('editEmail');
      const location = getVal('editLocation');
      const photo = uploadedPhotoURL || safeGet('editPhoto')?.src;

      if(!name ||!loginMobile ||!deliveryMobile ||!location) return showToast('❌ Sab field bharo!', true);
      if(loginMobile.length!== 10 || deliveryMobile.length!== 10) return showToast('❌ 10 digit mobile!', true);

      const customerData = {
        name, loginMobile, mobile: deliveryMobile, email, photo, location, address: location,
        isLoggedIn: true, otpVerified: true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // ✅ FIX: Doc ID hamesha loginMobile - Yahi pehle ka bug tha!
      db.collection('customers').doc(loginMobile).set(customerData, { merge: true })
     .then(() => {
        localStorage.setItem(CUSTOMER_KEY + '_whatsapp_mobile', loginMobile);
        localStorage.setItem(CUSTOMER_KEY + '_customer_mobile', deliveryMobile);
        localStorage.setItem(CUSTOMER_KEY + '_profile', JSON.stringify(customerData));
        localStorage.setItem('santra_customer', JSON.stringify(customerData));
        localStorage.setItem('temp_profile_' + loginMobile, JSON.stringify(customerData));

        currentCustomer = customerData;
        showToast('✅ Profile Saved! Orders me bhi dikhega');
        setTimeout(() => { cancelEdit(); loadProfile(); loadStats(); }, 1000);
      })
     .catch(err => showToast('❌ Error: ' + err, true));
    }

    function loadStats() {
      if(!currentCustomer) return;
      const mobileToUse = currentCustomer.loginMobile || currentCustomer.mobile;
      db.collection('orders').where('customerMobile', '==', mobileToUse).get()
     .then(snap => {
        let totalOrders = snap.size;
        let totalSpent = 0;
        snap.forEach(doc => { totalSpent += doc.data().totalAmount || doc.data().total || 0; });
        safeText('statOrders', totalOrders);
        safeText('statSpent', `₹${totalSpent}`);
        safeText('displayOrders', totalOrders);
      }).catch(()=>{
        // Fallback - mobile field se check
        db.collection('orders').where('mobile', '==', mobileToUse).get().then(snap=>{
          safeText('statOrders', snap.size);
        });
      });
    }

    function customerLogout() {
      if(confirm('Logout karna hai?')) {
        localStorage.removeItem('santra_customer');
        localStorage.removeItem(CUSTOMER_KEY + '_whatsapp_mobile');
        localStorage.removeItem(CUSTOMER_KEY + '_customer_mobile');
        localStorage.removeItem(CUSTOMER_KEY + '_login_mobile');
        localStorage.removeItem(CUSTOMER_KEY + '_profile');
        localStorage.setItem(CUSTOMER_KEY + '_logout_signal', Date.now());
        window.parent.postMessage({type:'logout'}, '*');
        showToast('✅ Logged out');
        setTimeout(() => { window.location.href = 'index.html'; }, 800);
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
    console.error(e);
    alert('JS Error: ' + e.message + '\n\nconstants.js check karo!');
  }
});

console.log("✅ customer-account.js FINAL 15 JULY - SAFEGET + CONSTANTS + 4 HOUR OTP");