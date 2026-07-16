// ===== CUSTOMER PROFILE JS - OLD 29-JUNE-2026 + CONSTANTS.JS FIX - 16 JULY 2026 =====

// ✅ NAYA: Bas ye 4 line add ki hai - Baaki sab old jaisa hi hai
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
const ADMIN_EMAIL = window.ADMIN_EMAIL || "santramarketshoppingmall@gmail.com";
const COLLECTIONS = window.COLLECTIONS || { CUSTOMERS: 'customers', ACTIVITY_LOGS: 'activity_logs' };
// Firebase db aur storage window se aayega - config.js se

let uploadedPhotoURL = null;

// ✅ Page Load Pe Old Data Load Karo - OLD WALA SAME
window.addEventListener('load', function() {
    loadExistingProfile();

    document.getElementById('changePhotoBtn').addEventListener('click', () => {
        document.getElementById('photoInput').click();
    });
    document.getElementById('photoInput').addEventListener('change', uploadPhotoToFirebase);
    document.getElementById('saveChangesBtn').addEventListener('click', saveProfile);
});

// ✅ Purana Data Load Karo - OLD + CUSTOMER_KEY FIX
function loadExistingProfile() {
    // ✅ FIX: Pehle login wale key se dhoondo, nahi mile to purane wale se
    const currentMobile = localStorage.getItem(CUSTOMER_KEY + '_whatsapp_mobile') || localStorage.getItem(CUSTOMER_KEY + '_customer_mobile');
    let saved = null;

    if(currentMobile){
        // Naya key
        saved = localStorage.getItem(CUSTOMER_KEY + '_profile');
        if(!saved) saved = localStorage.getItem('temp_profile_' + currentMobile);
    }
    // Old key fallback - Taki purana data gayab na ho
    if(!saved) saved = localStorage.getItem('santra_customer_profile');

    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('editName').value = data.name || '';
        document.getElementById('editLoginMobile').value = data.loginMobile || currentMobile || '';
        document.getElementById('editDeliveryMobile').value = data.mobile || '';
        document.getElementById('editEmail').value = data.email || '';
        document.getElementById('editLocation').value = data.location || '';
        document.getElementById('editPhoto').src = data.photo || 'https://via.placeholder.com/120?text=Photo';
        uploadedPhotoURL = data.photo;
    } else if(currentMobile){
        // Agar local me nahi to login ka mobile to dikha do
        document.getElementById('editLoginMobile').value = currentMobile;
        document.getElementById('editDeliveryMobile').value = currentMobile;
    }

    // ✅ Firebase se bhi laao - Admin panel wala
    if(currentMobile && window.db){
        window.db.collection(COLLECTIONS.CUSTOMERS).doc(currentMobile).get().then(doc=>{
            if(doc.exists){
                const data = doc.data();
                document.getElementById('editName').value = data.name || '';
                document.getElementById('editLoginMobile').value = data.loginMobile || currentMobile;
                document.getElementById('editDeliveryMobile').value = data.mobile || currentMobile;
                document.getElementById('editEmail').value = data.email || '';
                document.getElementById('editLocation').value = data.location || '';
                document.getElementById('editPhoto').src = data.photo || 'https://via.placeholder.com/120?text=Photo';
                uploadedPhotoURL = data.photo;
            }
        });
    }
}

// ✅ Photo Upload Firebase Storage Me - OLD WALA SAME
function uploadPhotoToFirebase() {
    const file = document.getElementById('photoInput').files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast('❌ Photo 2MB se kam honi chahiye!', true);

    const mobile = document.getElementById('editLoginMobile').value.trim() || 'temp_user';
    document.getElementById('uploadLoader').style.display = 'block';

    const fileName = `profile_photos/${mobile}/${Date.now()}.jpg`;
    const storageRef = window.storage.ref(fileName);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById('uploadLoader').innerText = `⏳ Uploading... ${Math.round(progress)}%`;
        },
        (error) => {
            document.getElementById('uploadLoader').style.display = 'none';
            showToast('❌ Upload failed: ' + error.message, true);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                document.getElementById('editPhoto').src = downloadURL;
                uploadedPhotoURL = downloadURL;
                document.getElementById('uploadLoader').style.display = 'none';
                showToast('✅ Photo uploaded!');
            });
        }
    );
}

// ✅ Profile Save Karo - OLD WALA SAME + CUSTOMER_KEY FIX
function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    const loginMobile = document.getElementById('editLoginMobile').value.trim();
    const deliveryMobile = document.getElementById('editDeliveryMobile').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const location = document.getElementById('editLocation').value.trim();
    const photo = uploadedPhotoURL || document.getElementById('editPhoto').src;

    if (!name ||!loginMobile ||!deliveryMobile ||!location) {
        return showToast('❌ Name, Dono Mobile aur Address required hai!', true);
    }
    if (loginMobile.length!== 10 || deliveryMobile.length!== 10) {
        return showToast('❌ 10 digit mobile daalo', true);
    }

    const btn = document.getElementById('saveChangesBtn');
    btn.disabled = true;
    btn.innerText = 'Saving...';

    const customerData = {
        name: name,
        loginMobile: loginMobile,
        mobile: deliveryMobile,
        email: email,
        photo: photo,
        location: location,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedVia: 'profile_page_old_flow'
    };

    // ✅ FIX: Dono key me save karo - Naya + Purana - Taki kuch gayab na ho
    localStorage.setItem(CUSTOMER_KEY + '_profile', JSON.stringify(customerData));
    localStorage.setItem('santra_customer_profile', JSON.stringify(customerData)); // Old fallback
    localStorage.setItem(CUSTOMER_KEY + '_whatsapp_mobile', loginMobile);

    window.db.collection(COLLECTIONS.CUSTOMERS).doc(loginMobile).set(customerData, { merge: true })
  .then(() => {
        window.db.collection(COLLECTIONS.ACTIVITY_LOGS).add({
            customerMobile: loginMobile,
            customerName: name,
            type: 'profile_update',
            action: `Profile Updated: ${name}, ${location}`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            via: 'profile_page',
            newData: customerData
        });

        const emailBody = `Customer Profile Updated:\nName: ${name}\nWhatsApp: ${loginMobile}\nDelivery: ${deliveryMobile}\nEmail: ${email || 'Not provided'}\nAddress: ${location}\nTime: ${new Date().toLocaleString('en-IN')}`;
        if(window.sendEmailToAdmin) sendEmailToAdmin('🔔 Profile Updated - SANTRA MALL', emailBody, loginMobile);

        showToast('✅ Profile Saved Successfully!');
        btn.disabled = false;
        btn.innerText = '💾 Save Profile';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    })
  .catch(err => {
        showToast('❌ Error: ' + err.message, true);
        btn.disabled = false;
        btn.innerText = '💾 Save Profile';
    });
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    if (isError) toast.classList.add('error');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.remove('error');
    }, 3000);
}

console.log("✅ customer-profile.js OLD FLOW + CONSTANTS.JS");