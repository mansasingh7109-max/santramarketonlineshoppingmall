// ===== FIREBASE - COMPAT VERSION - NO IMPORT NEEDED =====
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// ===== GLOBAL VARS =====
window.currentAILanguage = 'hindi';
window.currentAILanguageP = 'hindi';
window.uploadedImages = [];

// ===== DASHBOARD LOAD - ADMIN PHOTO + DETAILS =====
window.initDashboardTab = async function() {
  const companySnap = await db.collection("company").doc("details").get();
  if(companySnap.exists) {
    const data = companySnap.data();
    document.getElementById('dashAdminName').innerText = data.adminName || 'Admin';
    document.getElementById('dashAdminMobile').innerText = data.adminMobile || 'Not Set';
    document.getElementById('dashAdminEmail').innerText = data.adminEmail || 'Not Set';
    if(data.adminPhoto) {
      document.getElementById('dashAdminPhoto').src = data.adminPhoto;
      document.getElementById('dashAdminPhoto').style.display = 'block';
    }
  }

  const productsSnap = await db.collection("products").get();
  document.getElementById('totalProducts').innerText = productsSnap.size;

  const ordersSnap = await db.collection("orders").get();
  document.getElementById('totalOrders').innerText = ordersSnap.size;

  const customersSnap = await db.collection("customers").get();
  document.getElementById('totalCustomers').innerText = customersSnap.size;

  let revenue = 0;
  ordersSnap.forEach(doc => {
    const data = doc.data();
    if(data.status === 'Delivered') revenue += Number(data.total || 0);
  });
  document.getElementById('totalRevenue').innerText = '₹' + revenue;
}

// ===== AI LANGUAGE TOGGLE =====
window.setAILang = function(lang) {
  window.currentAILanguage = lang;
  document.getElementById('currentLang').innerText = lang === 'hindi'? 'Hindi' : 'English';
  document.getElementById('langHindi').style.background = lang === 'hindi'? '#6f42c1' : '#e9ecef';
  document.getElementById('langHindi').style.color = lang === 'hindi'? 'white' : '#333';
  document.getElementById('langEnglish').style.background = lang === 'english'? '#6f42c1' : '#e9ecef';
  document.getElementById('langEnglish').style.color = lang === 'english'? 'white' : '#333';
}

window.setAILangP = function(lang) {
  window.currentAILanguageP = lang;
  document.getElementById('currentLangP').innerText = lang === 'hindi'? 'Hindi' : 'English';
  document.getElementById('langHindiP').style.background = lang === 'hindi'? '#6f42c1' : '#e9ecef';
  document.getElementById('langHindiP').style.color = lang === 'hindi'? 'white' : '#333';
  document.getElementById('langEnglishP').style.background = lang === 'english'? '#6f42c1' : '#e9ecef';
  document.getElementById('langEnglishP').style.color = lang === 'english'? 'white' : '#333';
}

// ===== AI CHAT COMPANY =====
window.askAICompany = async function() {
  const query = document.getElementById('aiChatInput').value.toLowerCase();
  const lang = window.currentAILanguage;
  document.getElementById('aiChatResponse').innerHTML = '⏳ AI soch raha hai...';

  setTimeout(() => {
    let response = '';
    if(query.includes('about') || query.includes('company')) {
      response = lang === 'english'
     ? 'SANTRA MALL is India\'s #1 trusted online shopping platform. Since 2024, we provide 100% genuine products with COD and 2-day delivery across India.'
        : 'SANTRA MALL INDIA ka #1 trusted online shopping platform hai. 2024 se hum 100% genuine products, COD aur 2-din delivery dete hain.';
      document.getElementById('cAbout').value = response;
    }
    if(query.includes('feature')) {
      response = lang === 'english'
     ? '✓ 100% Original Products\n✓ Cash on Delivery Available\n✓ 24/7 WhatsApp Support: 9829508335\n✓ Free Delivery Above ₹500\n✓ 7 Day Easy Returns'
        : '✓ 100% Original Products\n✓ Cash on Delivery\n✓ 24/7 WhatsApp Support: 9829508335\n✓ Free Delivery Above ₹500\n✓ 7 Day Easy Return';
      document.getElementById('cFeatures').value = response;
    }
    if(query.includes('rule') || query.includes('policy')) {
      response = lang === 'english'
     ? '1. All prices include GST\n2. 7 Day Return Policy\n3. No refund on opened products\n4. COD charges ₹50 below ₹500\n5. Delivery in 2-5 days'
        : '1. Sabhi prices GST included hain\n2. 7 Din Return Policy\n3. Khule products ka refund nahi\n4. COD charges ₹50 below ₹500\n5. Delivery 2-5 din me';
      document.getElementById('cRules').value = response;
    }
    document.getElementById('aiChatResponse').innerHTML = '✅ ' + (response || 'Command samajh nahi aaya. "About", "Features" ya "Rules" likho');
  }, 1000);
}

// ===== AI CHAT PRODUCT =====
window.askAIProduct = async function() {
  const query = document.getElementById('aiChatInputP').value.toLowerCase();
  const lang = window.currentAILanguageP;
  document.getElementById('aiChatResponseP').innerHTML = '⏳ AI soch raha hai...';

  setTimeout(() => {
    let response = '';
    if(query.includes('oil') || query.includes('liquid')) {
      response = lang === 'hindi'
      ? 'Yeh 100% pure mustard oil hai. Cooking ke liye best hai. Cold pressed, chemical free. COD available hai. 7 din return policy.'
        : 'This is 100% pure mustard oil. Best for cooking. Cold pressed, chemical free. COD available. 7 days return policy.';
      document.getElementById('pName').value = 'Mustard Oil - Premium Quality';
    } else if(query.includes('suit') || query.includes('kurti') || query.includes('dress')) {
      response = lang === 'hindi'
      ? 'Premium cotton suit hai. Summer ke liye perfect. Soft fabric, comfortable fit. Machine wash. COD available.'
        : 'Premium cotton suit. Perfect for summer. Soft fabric, comfortable fit. Machine washable. COD available.';
      document.getElementById('pName').value = 'Cotton Suit - Designer';
    } else if(query.includes('electronic')) {
      response = lang === 'hindi'
      ? 'High quality electronic product. 1 year warranty. Latest features. Fast delivery. COD available.'
        : 'High quality electronic product. 1 year warranty. Latest features. Fast delivery. COD available.';
    } else {
      response = lang === 'hindi'
      ? 'Yeh premium quality product hai. Daily use ke liye best hai. COD available hai. 7 din return policy.'
        : 'This is a premium quality product. Best for daily use. COD available. 7 days return policy.';
    }
    document.getElementById('pDesc').value = response;
    document.getElementById('aiChatResponseP').innerHTML = '✅ ' + response;
  }, 1000);
}

// ===== FILL WITH AI - AUTO BUTTON =====
window.fillWithAI = async function(prompt) {
  const lang = window.currentAILanguage;
  if(prompt.includes('product dress suit')) {
    if(lang === 'hindi') {
      document.getElementById('pName').value = 'Designer Cotton Suit';
      document.getElementById('pDesc').value = 'Premium cotton fabric ka suit. Summer ke liye perfect. Soft aur comfortable. Machine wash.';
      document.getElementById('pCode').value = 'SUIT001';
    } else {
      document.getElementById('pName').value = 'Designer Cotton Suit';
      document.getElementById('pDesc').value = 'Premium cotton fabric suit. Perfect for summer. Soft and comfortable. Machine washable.';
      document.getElementById('pCode').value = 'SUIT001';
    }
  } else if(prompt.includes('product oil liquid')) {
    if(lang === 'hindi') {
      document.getElementById('pName').value = 'Mustard Oil - Pure';
      document.getElementById('pDesc').value = '100% pure mustard oil. Cooking ke liye best. Cold pressed, chemical free.';
      document.getElementById('pCode').value = 'OIL001';
    } else {
      document.getElementById('pName').value = 'Mustard Oil - Pure';
      document.getElementById('pDesc').value = '100% pure mustard oil. Best for cooking. Cold pressed, chemical free.';
      document.getElementById('pCode').value = 'OIL001';
    }
  } else if(prompt.includes('company details')) {
    if(lang === 'english') {
      document.getElementById('cAbout').value = 'SANTRA MALL is India\'s #1 trusted online shopping platform. Since 2024, we provide 100% genuine products with COD and 2-day delivery.';
      document.getElementById('cFeatures').value = '✓ 100% Original Products\n✓ Cash on Delivery\n✓ 24/7 Support: 9829508335\n✓ Free Delivery Above ₹500\n✓ 7 Day Easy Returns';
      document.getElementById('cRules').value = '1. All prices include GST\n2. 7 Day Return Policy\n3. COD charges ₹50 below ₹500\n4. Delivery in 2-5 days';
    } else {
      document.getElementById('cAbout').value = 'SANTRA MALL INDIA ka #1 trusted online shopping platform hai. 2024 se hum 100% genuine products, COD aur 2-din delivery dete hain.';
      document.getElementById('cFeatures').value = '✓ 100% Original Products\n✓ Cash on Delivery\n✓ 24/7 Support: 9829508335\n✓ Free Delivery Above ₹500\n✓ 7 Din Easy Return';
      document.getElementById('cRules').value = '1. Sabhi prices GST included hain\n2. 7 Din Return Policy\n3. COD charges ₹50 below ₹500\n4. Delivery 2-5 din me';
    }
  }
  alert('✅ AI ne fields bhar diye!');
}

// ===== DYNAMIC FIELDS CATEGORY WISE =====
window.showCategoryFields = function() {
  const cat = document.getElementById('pCategory').value;
  const div = document.getElementById('dynamicFields');
  let html = '<h4>Category Specific Fields:</h4>';

  if(cat === 'fabric') {
    html += `
      <input type="text" id="pLength" placeholder="Length: 2.5 meter" class="w-48">
      <input type="text" id="pWidth" placeholder="Width: 44 inch" class="w-48">
      <input type="text" id="pFabricType" placeholder="Fabric: Cotton/Silk/Georgette" class="w-48">
      <input type="text" id="pColor" placeholder="Color: Red/Blue/Multi" class="w-48">
      <input type="text" id="pWashCare" placeholder="Wash Care: Machine Wash/Dry Clean">
    `;
  } else if(cat === 'liquid') {
    html += `
      <input type="number" id="pQty" placeholder="Quantity: 500" class="w-32">
      <select id="pUnit" class="w-32"><option>ML</option><option>Litre</option><option>Kg</option><option>Gram</option></select>
      <input type="date" id="pExpiry" placeholder="Expiry Date" class="w-32">
      <input type="text" id="pIngredients" placeholder="Ingredients: Mustard Oil, etc">
    `;
  } else if(cat === 'electronics') {
    html += `
      <input type="text" id="pBrand" placeholder="Brand: Samsung/Mi/Boat" class="w-48">
      <input type="text" id="pModel" placeholder="Model No: XYZ123" class="w-48">
      <input type="text" id="pWarranty" placeholder="Warranty: 1 Year/6 Months" class="w-48">
      <input type="text" id="pPower" placeholder="Power: 100W / 220V" class="w-48">
    `;
  } else if(cat === 'plastic') {
    html += `
      <input type="text" id="pMaterial" placeholder="Material: Plastic/Steel" class="w-48">
      <input type="text" id="pSize" placeholder="Size: Large/Medium/Small" class="w-48">
      <input type="text" id="pCapacity" placeholder="Capacity: 1 Litre/500ml" class="w-48">
      <input type="text" id="pReusable" placeholder="Reusable: Yes/No" class="w-48">
    `;
  } else if(cat === 'grocery') {
    html += `
      <input type="text" id="pWeight" placeholder="Weight: 1Kg/500gm" class="w-48">
      <input type="date" id="pExpiryG" placeholder="Expiry Date" class="w-48">
      <select id="pVeg" class="w-48"><option>Veg</option><option>Non-Veg</option><option>Egg</option></select>
      <input type="text" id="pFssai" placeholder="FSSAI No" class="w-48">
    `;
  } else {
    html += `<p style="color:#666">Other category - koi extra field nahi</p>`;
  }
  div.innerHTML = html;
}

// ===== IMGBB UPLOAD =====
window.uploadImgBB = function() {
  document.getElementById('pMedia').click();
  document.getElementById('pMedia').onchange = async function(e) {
    const files = e.target.files;
    for(let file of files) {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('https://api.imgbb.com/1/upload?key=YOUR_IMGBB_KEY', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if(data.success) {
        window.uploadedImages.push(data.data.url);
        document.getElementById('mediaPreview').innerHTML += `<img src="${data.data.url}" style="width:80px;height:80px;object-fit:cover;border-radius:5px">`;
      }
    }
    alert('✅ ImgBB Upload Complete!');
  }
}

// ===== FIREBASE UPLOAD =====
window.uploadFirebase = function() {
  document.getElementById('pMedia').click();
  document.getElementById('pMedia').onchange = async function(e) {
    const files = e.target.files;
    for(let file of files) {
      const storageRef = storage.ref(`products/${Date.now()}_${file.name}`);
      const snap = await storageRef.put(file);
      const url = await snap.ref.getDownloadURL();
      window.uploadedImages.push(url);
      document.getElementById('mediaPreview').innerHTML += `<img src="${url}" style="width:80px;height:80px;object-fit:cover;border-radius:5px">`;
    }
    alert('✅ Firebase Upload Complete!');
  }
}

// ===== ADD FROM URL =====
window.addFromUrl = function() {
  const url = document.getElementById('pMediaUrl').value;
  if(url) {
    window.uploadedImages.push(url);
    document.getElementById('mediaPreview').innerHTML += `<img src="${url}" style="width:80px;height:80px;object-fit:cover;border-radius:5px">`;
    document.getElementById('pMediaUrl').value = '';
  }
}

// ===== SAVE PRODUCT =====
window.saveProduct = async function() {
  const btn = document.getElementById('saveBtn');
  btn.innerText = '⏳ Saving...';
  btn.disabled = true;

  if(!document.getElementById('pName').value ||!document.getElementById('pCategory').value ||!document.getElementById('pPrice').value){
    alert('Product Name, Category, Price required hai!');
    btn.innerText = '💾 Save Product - HOME PAGE PE TURANT DIKHEGA';
    btn.disabled = false;
    return;
  }

  const productData = {
    name: document.getElementById('pName').value,
    code: document.getElementById('pCode').value,
    category: document.getElementById('pCategory').value,
    desc: document.getElementById('pDesc').value,
    price: Number(document.getElementById('pPrice').value),
    mrp: Number(document.getElementById('pMrp').value),
    stock: Number(document.getElementById('pStock').value),
    images: window.uploadedImages,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uploadedBy: auth.currentUser?.email || 'Admin'
  };

  const cat = document.getElementById('pCategory').value;
  if(cat === 'fabric') {
    productData.length = document.getElementById('pLength')?.value;
    productData.width = document.getElementById('pWidth')?.value;
    productData.fabricType = document.getElementById('pFabricType')?.value;
    productData.color = document.getElementById('pColor')?.value;
    productData.washCare = document.getElementById('pWashCare')?.value;
  } else if(cat === 'liquid') {
    productData.qty = document.getElementById('pQty')?.value;
    productData.unit = document.getElementById('pUnit')?.value;
    productData.expiry = document.getElementById('pExpiry')?.value;
    productData.ingredients = document.getElementById('pIngredients')?.value;
  } else if(cat === 'electronics') {
    productData.brand = document.getElementById('pBrand')?.value;
    productData.model = document.getElementById('pModel')?.value;
    productData.warranty = document.getElementById('pWarranty')?.value;
    productData.power = document.getElementById('pPower')?.value;
  } else if(cat === 'plastic') {
    productData.material = document.getElementById('pMaterial')?.value;
    productData.size = document.getElementById('pSize')?.value;
    productData.capacity = document.getElementById('pCapacity')?.value;
    productData.reusable = document.getElementById('pReusable')?.value;
  } else if(cat === 'grocery') {
    productData.weight = document.getElementById('pWeight')?.value;
    productData.expiryG = document.getElementById('pExpiryG')?.value;
    productData.veg = document.getElementById('pVeg')?.value;
    productData.fssai = document.getElementById('pFssai')?.value;
  }

  await db.collection("products").add(productData);

  btn.innerText = '✅ Saved! HOME PAGE PE TURANT DIKHEGA';
  setTimeout(() => {
    btn.innerText = '💾 Save Product - HOME PAGE PE TURANT DIKHEGA';
    btn.disabled = false;
    window.uploadedImages = [];
    document.getElementById('mediaPreview').innerHTML = '';
    if(window.loadProducts) loadProducts();
  }, 2000);
}

// ===== SAVE COMPANY =====
window.saveCompanyDetails = async function() {
  const btn = event.target;
  btn.innerText = '⏳ Saving...';
  btn.disabled = true;

  const loadingPopup = document.createElement('div');
  loadingPopup.className = 'modal';
  loadingPopup.innerHTML = `
    <div class="modal-content" style="text-align:center">
      <div class="spinner"></div>
      <h3>Saving Company Details...</h3>
      <p>Please wait</p>
    </div>
  `;
  document.body.appendChild(loadingPopup);

  let photoUrl = '';
  const file = document.getElementById('adminPhoto').files[0];
  if(file) {
    const storageRef = storage.ref(`admin/${auth.currentUser.uid}_photo.jpg`);
    const snap = await storageRef.put(file);
    photoUrl = await snap.ref.getDownloadURL();
  }

  await db.collection("company").doc("details").set({
    about: document.getElementById('cAbout').value,
    features: document.getElementById('cFeatures').value,
    rules: document.getElementById('cRules').value,
    adminName: document.getElementById('adminName').value,
    adminMobile: document.getElementById('adminMobile').value,
    adminEmail: document.getElementById('adminEmail').value,
    adminPhoto: photoUrl,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.body.removeChild(loadingPopup);
  btn.innerText = '✅ Saved! Dashboard Pe Dikhega';
  setTimeout(() => {
    btn.innerText = '💾 Save All - Live Update';
    btn.disabled = false;
    if(window.initDashboardTab) initDashboardTab();
  }, 2000);
}

window.previewAdminPhoto = function() {
  const file = document.getElementById('adminPhoto').files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('adminPhotoPreview').src = e.target.result;
      document.getElementById('adminPhotoPreview').style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
}

// ===== COMPANY EDITOR POPUP =====
window.openCompanyEditor = function() {
  const modal = document.getElementById('companyModal');
  modal.classList.remove('hide');
  db.collection("company").doc("details").get().then(doc => {
    if(doc.exists) {
      const data = doc.data();
      document.getElementById('m_cAbout').value = data.about || '';
      document.getElementById('m_cFeatures').value = data.features || '';
      document.getElementById('m_cRules').value = data.rules || '';
      document.getElementById('m_adminName').value = data.adminName || '';
      document.getElementById('m_adminMobile').value = data.adminMobile || '';
      document.getElementById('m_adminEmail').value = data.adminEmail || '';
    }
  });
}

window.closeCompanyEditor = function() {
  document.getElementById('companyModal').classList.add('hide');
}

window.saveCompanyFromModal = async function() {
  const btn = event.target;
  btn.innerText = '⏳ Saving...';
  btn.disabled = true;

  await db.collection("company").doc("details").update({
    about: document.getElementById('m_cAbout').value,
    features: document.getElementById('m_cFeatures').value,
    rules: document.getElementById('m_cRules').value,
    adminName: document.getElementById('m_adminName').value,
    adminMobile: document.getElementById('m_adminMobile').value,
    adminEmail: document.getElementById('m_adminEmail').value,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  btn.innerText = '✅ Saved!';
  setTimeout(() => {
    closeCompanyEditor();
    initDashboardTab();
    loadCompanyDetails();
  }, 1500);
}

// ===== LOAD COMPANY DETAILS =====
window.loadCompanyDetails = async function() {
  const companySnap = await db.collection("company").doc("details").get();
  if(companySnap.exists) {
    const data = companySnap.data();
    document.getElementById('cAbout').value = data.about || '';
    document.getElementById('cFeatures').value = data.features || '';
    document.getElementById('cRules').value = data.rules || '';
    document.getElementById('adminName').value = data.adminName || '';
    document.getElementById('adminMobile').value = data.adminMobile || '';
    document.getElementById('adminEmail').value = data.adminEmail || '';
    if(data.adminPhoto) {
      document.getElementById('adminPhotoPreview').src = data.adminPhoto;
      document.getElementById('adminPhotoPreview').style.display = 'block';
    }
  }
}

// ===== LOAD PRODUCTS =====
window.loadProducts = async function() {
  const productsSnap = await db.collection("products").orderBy("createdAt", "desc").get();
  let html = '<table width="100%" border="1" style="border-collapse:collapse"><thead style="background:#f8f9fa"><tr><th style="padding:8px">Image</th><th style="padding:8px">Name</th><th style="padding:8px">Category</th><th style="padding:8px">Price</th><th style="padding:8px">Stock</th><th style="padding:8px">Action</th></tr></thead><tbody>';

  productsSnap.forEach(doc => {
    const p = doc.data();
    html += `
      <tr>
        <td style="padding:8px"><img src="${p.images?.[0] || 'https://via.placeholder.com/50'}" style="width:50px;height:50px;object-fit:cover"></td>
        <td style="padding:8px">${p.name}</td>
        <td style="padding:8px">${p.category}</td>
        <td style="padding:8px">₹${p.price}</td>
        <td style="padding:8px">${p.stock}</td>
        <td style="padding:8px"><button onclick="deleteProduct('${doc.id}')" style="background:#ef4444;padding:5px 10px">Delete</button></td>
      </tr>
    `;
  });
  html += '</tbody></table>';
  document.getElementById('productsList').innerHTML = html;
}

window.deleteProduct = async function(id) {
  if(confirm('Delete this product?')) {
    await db.collection("products").doc(id).delete();
    loadProducts();
  }
}

// ===== AUTO INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('dashAdminName')) initDashboardTab();
  if(document.getElementById('productsList')) loadProducts();
  if(document.getElementById('cAbout')) loadCompanyDetails();
});

console.log('✅ SANTRA MALL Admin Panel v4.0 Loaded - All Features Active');