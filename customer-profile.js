/*
⚠️ OLD CODE BACKUP - 29 JUNE 2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena - SAFE HIDE

let uploadedPhotoURL = null;

// Page Load Pe Old Data Load Karo
window.addEventListener('load', function() {
    loadExistingProfile();
    document.getElementById('changePhotoBtn').addEventListener('click', () => {
        document.getElementById('photoInput').click();
    });
    document.getElementById('photoInput').addEventListener('change', uploadPhotoToFirebase);
    document.getElementById('saveChangesBtn').addEventListener('click', saveProfile);
});

// Purana Data Load Karo LocalStorage Se
function loadExistingProfile() {
    const saved = localStorage.getItem('santra_customer_profile');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('editName').value = data.name || '';
        document.getElementById('editLoginMobile').value = data.loginMobile || '';
        document.getElementById('editDeliveryMobile').value = data.mobile || '';
        document.getElementById('editEmail').value = data.email || '';
        document.getElementById('editLocation').value = data.location || '';
        document.getElementById('editPhoto').src = data.photo || 'https://via.placeholder.com/120?text=Photo';
        uploadedPhotoURL = data.photo;
    }
}

OLD CODE BACKUP END - 29 JUNE WALA SAFE HAI
*/

// ===== CUSTOMER PROFILE JS - FINAL 15 JULY 2026 - CONSTANTS.JS SUPPORT + FULL CONNECT =====

let uploadedPhotoURL = null;

// ✅ NAYA: Keys constants.js se - ZINDAGI BHAR KA FIX
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
const ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";
const ADMIN_EMAIL = window.ADMIN_EMAIL || "santramarketshoppingmall@gmail.com";
const BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";

// ✅ Firebase Config - window se lo
const firebaseConfig = window.firebaseConfig || {
  apiKey: "AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",
  authDomain: "santramarketshoppingmall.firebaseapp.com",
  projectId: "santramarketshoppingmall",
  storageBucket: "santramarketshoppingmall.appspot.com",
  messagingSenderId: "398490252924",
  appId: "1:398490252924:web:d1b6348b549183b93b7bf9"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ✅ Page Load
window.addEventListener('load', function() {
    loadExistingProfile();

    const changeBtn = document.getElementById('changePhotoBtn');
    const photoInput = document.getElementById('photoInput');
    const saveBtn = document.getElementById('saveChangesBtn');

    if(changeBtn) changeBtn.addEventListener('click', () => {
        photoInput.click();
    });
    if(photoInput) photoInput.addEventListener('change', uploadPhotoToFirebase);
    if(saveBtn) saveBtn.addEventListener('click', saveProfile);

    // Parent ko height bhejo - customer-account.html ke liye
    setTimeout(()=>{ sendHeightToParent(); }, 500);
});

function sendHeightToParent(){
  try{
    window.parent.postMessage({type:'resizeIframe', height: document.body.scrollHeight, iframeId: 'profileFrame'}, '*');
  }catch(e){}
}

// ✅ Profile Load - Firebase + Local + CUSTOMER_KEY CONNECT
function loadExistingProfile() {
    const currentMobile = localStorage.getItem(CUSTOMER_KEY + '_whatsapp_mobile') || localStorage.getItem(CUSTOMER_KEY + '_customer_mobile') || localStorage.getItem(CUSTOMER_KEY + '_login_mobile');

    if(!currentMobile){
      console.log('⚠️ No login found');
      return;
    }

    document.getElementById('editLoginMobile').value = currentMobile;

    // 1. Local se fast dikhao
    const savedLocal = localStorage.getItem(CUSTOMER_KEY + '_profile') || localStorage.getItem('temp_profile_' + currentMobile);
    if (savedLocal) {
        const data = JSON.parse(savedLocal);
        document.getElementById('editName').value = data.name || '';
        document.getElementById('editLoginMobile').value = data.loginMobile || currentMobile;
        document.getElementById('editDeliveryMobile').value = data.mobile || currentMobile;
        document.getElementById('editEmail').value = data.email || '';
        document.getElementById('editLocation').value = data.location || data.address || '';
        if(data.photo){
          document.getElementById('editPhoto').src = data.photo;
          uploadedPhotoURL = data.photo;
        }
        console.log('✅ Profile loaded from Local:', CUSTOMER_KEY);
    }

    // 2. Firebase se real data - Admin panel wala
    db.collection('customers').doc(currentMobile).get().then(doc=>{
      if(doc.exists){
        const data = doc.data();
        document.getElementById('editName').value = data.name || '';
        document.getElementById('editLoginMobile').value = data.loginMobile || currentMobile;
        document.getElementById('editDeliveryMobile').value = data.mobile || currentMobile;
        document.getElementById('editEmail').value = data.email || '';
        document.getElementById('editLocation').value = data.location || data.address || '';
        document.getElementById('editPhoto').src = data.photo || 'https://via.placeholder.com/120?text=Photo';
        uploadedPhotoURL = data.photo;
        // Local update bhi kar do
        localStorage.setItem(CUSTOMER_KEY + '_profile', JSON.stringify(data));
        console.log('✅ Profile loaded from Firebase - Updated');
        sendHeightToParent();
      }
    }).catch(err=>{
      console.warn('Firebase profile load error:', err.message);
      if(err.message.includes('permissions')){
        showToast('⚠️ Firebase Rule Publish karo - Profile save nahi hoga', true);
      }
    });
}

// ✅ Photo Upload Firebase Storage Me + 2MB Check
function uploadPhotoToFirebase() {
    const file = document.getElementById('photoInput').files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast('❌ Photo 2MB se kam honi chahiye!', true);

    const mobile = document.getElementById('editLoginMobile').value.trim() || 'temp_user';
    const loader = document.getElementById('uploadLoader');
    if(loader) loader.style.display = 'block';

    const fileName = `profile_photos/${mobile}/${Date.now()}.jpg`;
    const storageRef = storage.ref(fileName);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if(loader) loader.innerText = `⏳ Uploading... ${Math.round(progress)}%`;
        },
        (error) => {
            if(loader) loader.style.display = 'none';
            showToast('❌ Upload failed: ' + error.message, true);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                document.getElementById('editPhoto').src = downloadURL;
                uploadedPhotoURL = downloadURL;
                if(loader) loader.style.display = 'none';
                showToast('✅ Photo uploaded!');
                sendHeightToParent();
            });
        }
    );
}

// ✅ Email to Admin - Dummy function (aapke config.js me hoga)
function sendEmailToAdmin(subject, body, mobile){
  try{
    if(window.sendEmail){
      window.sendEmail(ADMIN_EMAIL, subject, body);
    } else {
      console.log('📧 Email to Admin:', subject, body);
    }
  }catch(e){ console.log('Email error', e); }
}

// ✅ Profile Save - Firebase + Local + Activity Log + Parent Connect
function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    const loginMobile = document.getElementById('editLoginMobile').value.trim();
    const deliveryMobile = document.getElementById('editDeliveryMobile').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const location = document.getElementById('editLocation').value.trim();
    const photo = uploadedPhotoURL || document.getElementById('editPhoto').src;

    if (!name ||!loginMobile ||!deliveryMobile ||!location) {
        return showToast('❌ Name, Dono Mobile aur Address required!', true);
    }
    if (loginMobile.length!== 10 || deliveryMobile.length!== 10) {
        return showToast('❌ 10 digit mobile daalo', true);
    }

    const btn = document.getElementById('saveChangesBtn');
    btn.disabled = true;
    btn.innerText = '⏳ Saving...';

    const customerData = {
        name: name,
        loginMobile: loginMobile,
        mobile: deliveryMobile,
        email: email,
        photo: photo,
        location: location,
        address: location,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedVia: 'profile_page_final'
    };

    // Local pehle save - Turant dikhega + customer-account.html + orders.html me
    localStorage.setItem(CUSTOMER_KEY + '_profile', JSON.stringify(customerData));
    localStorage.setItem('temp_profile_' + loginMobile, JSON.stringify(customerData));
    localStorage.setItem(CUSTOMER_KEY + '_whatsapp_mobile', loginMobile);
    localStorage.setItem(CUSTOMER_KEY + '_customer_mobile', loginMobile);

    db.collection('customers').doc(loginMobile).set(customerData, { merge: true })
 .then(() => {
        // Activity Log
        db.collection('activity_logs').add({
            customerMobile: loginMobile,
            customerName: name,
            type: 'profile_update',
            action: `Profile Updated: ${name}, ${location}`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            via: 'profile_page_final',
            newData: customerData
        }).catch(()=>{});

        const emailBody = `Customer Profile Updated:\nName: ${name}\nWhatsApp: ${loginMobile}\nDelivery: ${deliveryMobile}\nEmail: ${email || 'N/A'}\nAddress: ${location}\nTime: ${new Date().toLocaleString('en-IN')}\nLink: ${BASE_URL}/customer-account.html`;
        sendEmailToAdmin('🔔 Profile Updated - SANTRA MALL', emailBody, loginMobile);

        showToast('✅ Profile Saved! Admin panel me bhi dikhega');
        btn.disabled = false;
        btn.innerText = '💾 Save Profile';

        // Parent ko batao - customer-account.html header photo update karega
        window.parent.postMessage({type: 'profileUpdated'}, '*');

        setTimeout(() => {
            // Agar customer-account.html ke andar hai to reload mat karo
            if(window.parent!== window){
              // Iframe me hai
              console.log('✅ Profile saved inside iframe');
            } else {
              window.location.href = 'index.html';
            }
        }, 1000);
    })
 .catch(err => {
        showToast('❌ Error: ' + err.message + ' - Local save ho gaya!', true);
        btn.disabled = false;
        btn.innerText = '💾 Save Profile';
        // Firebase fail bhi ho to parent ko batao
        window.parent.postMessage({type: 'profileUpdated'}, '*');
    });
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if(!toast){ alert(message); return; }
    toast.innerText = message;
    toast.classList.add('show');
    if (isError) toast.classList.add('error');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.remove('error');
    }, 3500);
}

console.log("✅ customer-profile.js FINAL 15 JULY - CONSTANTS.JS + FIREBASE + CONNECT");