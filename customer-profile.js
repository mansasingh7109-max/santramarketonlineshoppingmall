// ===== CUSTOMER PROFILE JS - OLD 29-JUNE-2026 + CONSTANTS.JS FIX - 16 JULY 2026 - SAFE - KUCH HATAYA NAHI =====
/*
⚠️ OLD CODE BACKUP - 29 JUNE + 16 JULY - SAFE - KUCH HATAYA NAHI
Original tumhara bheja hua:
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
const ADMIN_EMAIL = window.ADMIN_EMAIL || "santramarketshoppingmall@gmail.com";
const COLLECTIONS = window.COLLECTIONS || { CUSTOMERS: 'customers', ACTIVITY_LOGS: 'activity_logs' };
let uploadedPhotoURL = null;
window.addEventListener('load', function() { loadExistingProfile();... changePhotoBtn... photoInput... saveChangesBtn });
function loadExistingProfile() { const currentMobile = localStorage.getItem(CUSTOMER_KEY + '_whatsapp_mobile') || localStorage.getItem(CUSTOMER_KEY + '_customer_mobile');... }
function uploadPhotoToFirebase() {... storage.ref... }
function saveProfile() { const name =... loginMobile... deliveryMobile... email... location... }
OLD CODE END - OLD SAFE - AB V21 UPDATE - Login No=OTP + Extra Delivery + Full Address
*/

// ===== V21 FINAL - OLD SAVE + Login No=OTP + Extra Mobile for Delivery + Full Address Save =====
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
const ADMIN_EMAIL = window.ADMIN_EMAIL || "santramarketshoppingmall@gmail.com";
const COLLECTIONS = window.COLLECTIONS || { CUSTOMERS: 'customers', ACTIVITY_LOGS: 'activity_logs' };
let uploadedPhotoURL = null;

window.addEventListener('load', function() {
    loadExistingProfile();
    try{
      let cBtn=document.getElementById('changePhotoBtn'); if(cBtn) cBtn.addEventListener('click', () => { document.getElementById('photoInput').click(); });
      let pInput=document.getElementById('photoInput'); if(pInput) pInput.addEventListener('change', uploadPhotoToFirebase);
      let sBtn=document.getElementById('saveChangesBtn'); if(sBtn) sBtn.addEventListener('click', saveProfile);
    }catch(e){}
});

// ✅ Purana Data Load - V21 Login+Extra + Full Address
function loadExistingProfile() {
    const currentLoginMobile = localStorage.getItem(CUSTOMER_KEY + '_whatsapp_mobile') || localStorage.getItem('santra_whatsapp_mobile') || localStorage.getItem('santra_mobile') || localStorage.getItem(CUSTOMER_KEY + '_customer_mobile') || '';
    const currentDeliveryMobile = localStorage.getItem('santra_deliveryMobile') || localStorage.getItem(CUSTOMER_KEY + '_delivery_mobile') || '';
    let saved = null;

    // Naya key se dhoondo
    if(currentLoginMobile){
        saved = localStorage.getItem(CUSTOMER_KEY + '_profile');
        if(!saved) saved = localStorage.getItem('santra_customer'); // V19/V20 wala main key
        if(!saved) saved = localStorage.getItem('temp_profile_' + currentLoginMobile);
    }
    // Old key fallback
    if(!saved) saved = localStorage.getItem('santra_customer_profile');

    if (saved) {
        try{
          const data = JSON.parse(saved);
          let nameEl=document.getElementById('editName'); if(nameEl) nameEl.value = data.name || '';
          let loginEl=document.getElementById('editLoginMobile'); if(loginEl) loginEl.value = data.loginMobile || data.whatsappMobile || currentLoginMobile || '';
          let deliveryEl=document.getElementById('editDeliveryMobile'); if(deliveryEl) deliveryEl.value = data.deliveryMobile || data.extraDeliveryMobile || data.alternateMobile || data.mobile || currentDeliveryMobile || '';
          let emailEl=document.getElementById('editEmail'); if(emailEl) emailEl.value = data.email || '';
          let locEl=document.getElementById('editLocation'); if(locEl) locEl.value = data.location || data.fullAddress || data.address || '';
          let photoEl=document.getElementById('editPhoto'); if(photoEl) photoEl.src = data.photo || 'https://via.placeholder.com/120?text=Photo';
          uploadedPhotoURL = data.photo;
          // Full address extra fields if exist
          let pincodeEl=document.getElementById('editPincode'); if(pincodeEl) pincodeEl.value = data.pincode || '';
          let landmarkEl=document.getElementById('editLandmark'); if(landmarkEl) landmarkEl.value = data.landmark || '';
          let cityEl=document.getElementById('editCity'); if(cityEl) cityEl.value = data.city || '';
          let stateEl=document.getElementById('editState'); if(stateEl) stateEl.value = data.state || '';
        }catch(e){}
    } else if(currentLoginMobile){
        let loginEl=document.getElementById('editLoginMobile'); if(loginEl) loginEl.value = currentLoginMobile;
        let deliveryEl=document.getElementById('editDeliveryMobile'); if(deliveryEl) deliveryEl.value = currentDeliveryMobile || currentLoginMobile;
    }

    // Firebase se bhi laao - Login No primary
    if(currentLoginMobile && window.db){
        window.db.collection(COLLECTIONS.CUSTOMERS).doc(currentLoginMobile).get().then(doc=>{
            if(doc.exists){
                const data = doc.data();
                let nameEl=document.getElementById('editName'); if(nameEl) nameEl.value = data.name || nameEl.value || '';
                let loginEl=document.getElementById('editLoginMobile'); if(loginEl) loginEl.value = data.loginMobile || data.whatsappMobile || currentLoginMobile;
                let deliveryEl=document.getElementById('editDeliveryMobile'); if(deliveryEl) deliveryEl.value = data.deliveryMobile || data.extraDeliveryMobile || data.alternateMobile || data.mobile || currentDeliveryMobile || '';
                let emailEl=document.getElementById('editEmail'); if(emailEl) emailEl.value = data.email || '';
                let locEl=document.getElementById('editLocation'); if(locEl) locEl.value = data.location || data.fullAddress || data.address || '';
                let photoEl=document.getElementById('editPhoto'); if(photoEl && data.photo) photoEl.src = data.photo;
                if(data.photo) uploadedPhotoURL = data.photo;
                // Extra fields sync to localStorage V21
                try{
                  let existing={}; try{existing=JSON.parse(localStorage.getItem('santra_customer')||'{}')}catch(e){}
                  let updated={...existing,...data, loginMobile: data.loginMobile||currentLoginMobile, whatsappMobile: data.loginMobile||currentLoginMobile, deliveryMobile: data.deliveryMobile||data.extraDeliveryMobile||currentDeliveryMobile, extraDeliveryMobile: data.deliveryMobile||data.extraDeliveryMobile||currentDeliveryMobile};
                  localStorage.setItem('santra_customer', JSON.stringify(updated));
                  if(data.deliveryMobile) localStorage.setItem('santra_deliveryMobile', data.deliveryMobile);
                }catch(e){}
            }
        }).catch(()=>{});
    }
}

function uploadPhotoToFirebase() {
    const file = document.getElementById('photoInput').files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast('❌ Photo 2MB se kam honi chahiye!', true);
    const mobile = document.getElementById('editLoginMobile').value.trim() || localStorage.getItem('santra_mobile') || 'temp_user';
    let loader=document.getElementById('uploadLoader'); if(loader) loader.style.display = 'block';
    const fileName = `profile_photos/${mobile}/${Date.now()}.jpg`;
    const storageRef = window.storage.ref(fileName);
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
                let photoEl=document.getElementById('editPhoto'); if(photoEl) photoEl.src = downloadURL;
                uploadedPhotoURL = downloadURL;
                if(loader) loader.style.display = 'none';
                showToast('✅ Photo uploaded!');
            });
        }
    );
}

// ✅ Profile Save - V21 Login=OTP + Extra Delivery + Full Address
function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    const loginMobile = document.getElementById('editLoginMobile').value.trim().replace(/\D/g,'').slice(-10);
    const deliveryMobile = document.getElementById('editDeliveryMobile').value.trim().replace(/\D/g,'').slice(-10);
    const email = document.getElementById('editEmail')?.value.trim() || '';
    const location = document.getElementById('editLocation').value.trim();
    const pincode = document.getElementById('editPincode')?.value.trim() || '';
    const landmark = document.getElementById('editLandmark')?.value.trim() || '';
    const city = document.getElementById('editCity')?.value.trim() || '';
    const state = document.getElementById('editState')?.value.trim() || '';
    const house = document.getElementById('editHouse')?.value.trim() || '';
    const photo = uploadedPhotoURL || document.getElementById('editPhoto')?.src || '';

    if (!name ||!loginMobile ||!location) {
        return showToast('❌ Name, Login OTP No aur Full Address required hai!', true);
    }
    if (loginMobile.length!==10) {
        return showToast('❌ Login/WhatsApp OTP No 10 digit daalo - OTP isi pe ayega', true);
    }
    if (deliveryMobile && deliveryMobile.length!==10) {
        return showToast('❌ Extra Delivery Mobile 10 digit ya khali chhodo - OTP ispe nahi ayega', true);
    }

    const btn = document.getElementById('saveChangesBtn');
    if(btn){ btn.disabled = true; btn.innerText = 'Saving... Login+Extra'; }

    const customerData = {
        name: name,
        loginMobile: loginMobile,
        whatsappMobile: loginMobile,
        mobile: loginMobile, // login primary
        deliveryMobile: deliveryMobile||'',
        extraDeliveryMobile: deliveryMobile||'',
        alternateMobile: deliveryMobile||'',
        email: email,
        photo: photo,
        location: location,
        address: location,
        fullAddress: location,
        pincode: pincode,
        landmark: landmark,
        city: city,
        state: state,
        house: house,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedVia: 'profile_page_V21_LoginExtra'
    };

    // Local me save - V21 flow
    try{
      localStorage.setItem(CUSTOMER_KEY + '_profile', JSON.stringify(customerData));
      localStorage.setItem('santra_customer_profile', JSON.stringify(customerData));
      localStorage.setItem('santra_customer', JSON.stringify(customerData));
      localStorage.setItem(CUSTOMER_KEY + '_whatsapp_mobile', loginMobile);
      localStorage.setItem('santra_whatsapp_mobile', loginMobile);
      localStorage.setItem('santra_mobile', loginMobile);
      localStorage.setItem('santra_deliveryMobile', deliveryMobile||'');
      localStorage.setItem(CUSTOMER_KEY + '_delivery_mobile', deliveryMobile||'');
      localStorage.setItem('santra_customer_name', name);
      localStorage.setItem('santra_customer_addr', location);
    }catch(e){}

    if(!window.db){ showToast('❌ DB not connected', true); if(btn){btn.disabled=false; btn.innerText='💾 Save Profile';} return; }

    window.db.collection(COLLECTIONS.CUSTOMERS).doc(loginMobile).set(customerData, { merge: true })
 .then(() => {
        try{
          window.db.collection(COLLECTIONS.ACTIVITY_LOGS).add({
            customerMobile: loginMobile,
            loginMobile: loginMobile,
            deliveryMobile: deliveryMobile||'Same as Login',
            customerName: name,
            type: 'profile_update_V21_LoginExtra',
            action: `Profile Updated V21: ${name}, Login:${loginMobile} (OTP isi pe), Extra Delivery:${deliveryMobile||'Same'}, Addr:${location} Pincode:${pincode} Landmark:${landmark} City:${city} State:${state}`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            via: 'profile_page_V21',
            newData: customerData
          });
        }catch(e){}

        const emailBody = `Customer Profile Updated V21 - Login+Extra:\nName: ${name}\nLogin/WhatsApp OTP No: ${loginMobile} (OTP isi pe)\nExtra Mobile for Delivery: ${deliveryMobile||'Same as Login'} (OTP ispe nahi)\nEmail: ${email || 'Not provided'}\nFull Address: ${location}\nHouse: ${house}\nPincode: ${pincode}\nLandmark: ${landmark}\nCity: ${city}\nState: ${state}\nTime: ${new Date().toLocaleString('en-IN')}`;
        if(window.sendEmailToAdmin) try{ sendEmailToAdmin('🔔 Profile Updated V21 Login+Extra - SANTRA MALL', emailBody, loginMobile); }catch(e){}

        showToast('✅ Profile Saved! Login:'+loginMobile+' (OTP isi pe) Extra:'+(deliveryMobile||'Same'));
        if(btn){ btn.disabled = false; btn.innerText = '💾 Save Profile - Login+Extra'; }
        try{ window.parent.postMessage({type:'profileUpdated', loginMobile: loginMobile, deliveryMobile: deliveryMobile, mobile: loginMobile}, '*'); }catch(e){}
        setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    })
 .catch(err => {
        showToast('❌ Error: ' + err.message, true);
        if(btn){ btn.disabled = false; btn.innerText = '💾 Save Profile'; }
    });
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if(!toast) return alert(message);
    toast.innerText = message;
    toast.classList.add('show');
    if (isError) toast.classList.add('error');
    setTimeout(() => { toast.classList.remove('show'); toast.classList.remove('error'); }, 4000);
}

console.log("✅ customer-profile.js V21 FINAL - Login No=OTP + Extra Mobile for Delivery + Full Address - OLD SAVE + CONSTANTS.JS - LAST LINE OK");