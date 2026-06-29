// ===== CUSTOMER PROFILE JS - NO LOGIN - 29-JUNE-2026 =====

let uploadedPhotoURL = null;

// ✅ Page Load Pe Old Data Load Karo
window.addEventListener('load', function() {
    loadExistingProfile();

    // Buttons ke events
    document.getElementById('changePhotoBtn').addEventListener('click', () => {
        document.getElementById('photoInput').click();
    });
    document.getElementById('photoInput').addEventListener('change', uploadPhotoToFirebase);
    document.getElementById('saveChangesBtn').addEventListener('click', saveProfile);
});

// ✅ Purana Data Load Karo LocalStorage Se
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

// ✅ Photo Upload Firebase Storage Me
function uploadPhotoToFirebase() {
    const file = document.getElementById('photoInput').files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast('❌ Photo 2MB se kam honi chahiye!', true);

    const mobile = document.getElementById('editLoginMobile').value.trim() || 'temp_user';
    document.getElementById('uploadLoader').style.display = 'block';

    const fileName = `profile_photos/${mobile}/${Date.now()}.jpg`;
    const storageRef = storage.ref(fileName);
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

// ✅ Profile Save Karo - Firebase + Email
function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    const loginMobile = document.getElementById('editLoginMobile').value.trim();
    const deliveryMobile = document.getElementById('editDeliveryMobile').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const location = document.getElementById('editLocation').value.trim();
    const photo = uploadedPhotoURL || document.getElementById('editPhoto').src;

    // Validation
    if (!name ||!loginMobile ||!deliveryMobile ||!location) {
        return showToast('❌ Name, Dono Mobile aur Address required hai!', true);
    }
    if (loginMobile.length!== 10 || deliveryMobile.length!== 10) {
        return showToast('❌ 10 digit mobile daalo', true);
    }

    const btn = document.getElementById('saveChangesBtn');
    btn.disabled = true;
    btn.innerText = 'Saving...';

    // ✅ Data Object
    const customerData = {
        name: name,
        loginMobile: loginMobile,
        mobile: deliveryMobile, // Delivery number
        email: email,
        photo: photo,
        location: location,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedVia: 'profile_page'
    };

    // ✅ 1. Firebase Me Save - Admin Panel Me Dikh Jayega
    db.collection('customers').doc(loginMobile).set(customerData, { merge: true })
   .then(() => {
        // ✅ 2. LocalStorage Me Save
        localStorage.setItem('santra_customer_profile', JSON.stringify(customerData));

        // ✅ 3. Activity Log - Admin History Ke Liye
        db.collection('activity_logs').add({
            customerMobile: loginMobile,
            customerName: name,
            type: 'profile_update',
            action: `Profile Updated: ${name}, ${location}`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            via: 'profile_page',
            newData: customerData
        });

        // ✅ 4. Email To Admin
        const emailBody = `
            Customer Profile Updated:
            Name: ${name}
            WhatsApp: ${loginMobile}
            Delivery: ${deliveryMobile}
            Email: ${email || 'Not provided'}
            Address: ${location}
            Time: ${new Date().toLocaleString('en-IN')}
        `;
        sendEmailToAdmin('🔔 Profile Updated - SANTRA MALL', emailBody, loginMobile);

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

// ✅ Toast Message
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