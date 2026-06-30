// ==================== CUSTOMER-ACCOUNT.JS ====================
// 30-JUNE-2026 02:15 PM - UPDATED
// OLD CODE BACKUP - 29-JUNE-2026 03:20 PM
// ISSUE FIXED: Cannot read properties of null (reading 'classList')
// REASON: Acode me elements nahi mile to error aata tha
// FIX: safeGet() helper add kiya - har getElementById check karega
// =============================================================

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

    // ✅ SAFE HELPER - ye error khatam karega
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

    // ✅ EVENT LISTENERS - safe
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
      if(viewMode && !viewMode.classList.contains('hide')) {
        enableEditMode();
      }
    });

    checkLoginAndLoad();
    if(typeof updateCartBadge === 'function') updateCartBadge();

    function checkLoginAndLoad() {
      let customer = localStorage.getItem('santra_customer');
      if(!customer || !JSON.parse(customer).isLoggedIn) {
        safeClass('loginBox','remove','hide');
        safeClass('viewMode','add','hide');
        return;
      }
      currentCustomer = JSON.parse(customer);
      safeClass('loginBox','add','hide');
      safeClass('viewMode','remove','hide');
      document.title = `👤 My Profile - ${currentCustomer.name} - SANTRA MALL`;
      loadProfile();
      loadStats();
    }

    function sendLoginOTP() {
      const btn = safeGet('sendOtpBtn');
      const mobileEl = safeGet('loginMobile');
      if(!mobileEl) return;
      const mobile = mobileEl.value.trim();
      if(mobile.length !== 10) return showToast('❌ 10 digit mobile daalo', true);

      if(btn){ btn.disabled = true; btn.innerText = 'Sending...'; }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      db.collection('login_requests').doc(mobile).set({
        otp: otp,
        inVerified: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'profile_login'
      }).then(() => {
        const msg = `🔐 *SANTRA MALL LOGIN OTP*\n\nYour OTP: *${otp}*\n\nValid for 10 minutes.`;
        const waUrl = `https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
        safeShow('otpVerifyBox', true);
        showToast('📲 OTP sent on WhatsApp!');
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

      db.collection('login_requests').doc(mobile).get().then((doc) => {
        if(!doc.exists) return showToast('❌ OTP not found! Send again', true);
        const data = doc.data();
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
          db.collection('customers').doc(mobile).set(currentCustomer);
        }
        db.collection('login_requests').doc(mobile).update({
          inVerified: true, verifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        localStorage.setItem('santra_customer', JSON.stringify(currentCustomer));
        
        if(typeof sendAdminNotification === 'function') {
            sendAdminNotification({ type: 'NEW_CUSTOMER_LOGIN', name: currentCustomer.name, mobile: mobile });
        }
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

      db.collection('customers').doc(currentCustomer.loginMobile || currentCustomer.mobile).get().then(doc => {
        if(doc.exists) {
          const data = doc.data();
          setText('displayOrders', data.totalOrders || 0);
          setText('displayJoined', data.createdAt || 'N/A');
          const updatedCustomer = {...currentCustomer,...data};
          localStorage.setItem('santra_customer', JSON.stringify(updatedCustomer));
          currentCustomer = updatedCustomer;
        }
      });
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

    function uploadPhotoToFirebase() {
      const fileInput = safeGet('photoInput');
      if(!fileInput || !fileInput.files[0]) return;
      const file = fileInput.files[0];
      if(file.size > 2 * 1024 * 1024) return showToast('❌ Photo size 2MB se kam honi chahiye!', true);
      
      const loader = safeGet('uploadLoader');
      if(loader) loader.style.display = 'block';
      
      const fileName = `profile_photos/${currentCustomer.loginMobile}/${Date.now()}.jpg`;
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

      if(!name || !loginMobile || !deliveryMobile || !location) return showToast('❌ Name, Dono Mobile aur Location required hai!', true);
      if(loginMobile.length !== 10 || deliveryMobile.length !== 10) return showToast('❌ 10 digit mobile daalo', true);

      const customerData = { name, loginMobile, mobile: deliveryMobile, email, photo, location,
        isLoggedIn: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };

      db.collection('customers').doc(loginMobile).set(customerData, { merge: true })
      .then(() => {
        localStorage.setItem('santra_customer', JSON.stringify(customerData));
        currentCustomer = customerData;
        showToast('✅ Profile Saved Successfully!');
        setTimeout(() => { cancelEdit(); loadProfile(); }, 1000);
      })
      .catch(err => showToast('❌ Error: ' + err, true));
    }

    function loadStats() {
      if(!currentCustomer) return;
      const mobileToUse = currentCustomer.mobile || currentCustomer.loginMobile;
      db.collection('orders').where('customerMobile', '==', mobileToUse).get()
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
        localStorage.removeItem('santra_cart');
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
    alert('JavaScript Error: ' + e.message + '\n\nsecrets.js file check karo!');
    console.error(e);
  }
});