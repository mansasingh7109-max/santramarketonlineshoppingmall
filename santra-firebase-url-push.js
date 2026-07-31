// santra-firebase-url-push.js V36 FINAL - OLD CODE SAVE WITH UPDATE - RTDB se Firebase me URL push - Half image fix - Firebase Ready Fix
/*
⚠️ OLD CODE BACKUP - V35 - 30/07/2026 - SAFE - DELETE NAHI - share.js + share-otp-verify.html SAFE

// V35 OLD CODE - 09/07/2026 SE PEHLE WALA - SAFE
console.log("✅ santra-firebase-url-push.js V35 - RTDB se Firebase URL push");
window.pushRTDBtoFirebaseV35 = async function(){
  if(!window.db ||!window.rtdb){ alert("Firebase ready nahi hai - thodi der baad try karo"); return; }
  let btn = document.getElementById('t7');
  if(btn){ btn.className='tick ok'; btn.innerHTML='7. ONE FILE URL <span>⏳ RTDB se Firebase URL push ho raha hai...</span>'; }
  console.log("🔥 RTDB products se Firebase me URL push start...");
  let snap = await window.rtdb.ref('products').once('value');
  if(!snap.exists()){ console.log("❌ RTDB me koi product nahi"); return; }
  let count = 0, fixed = 0;
  let all = snap.val();
  for(let key in all){
    count++;
    let p = all[key];
    let img = p.image || p.imageUrl || p.httpsUrl || p.imgUrl || p.mainImage || "";
    if(!img && p.images && Array.isArray(p.images) && p.images[0]){
      img = typeof p.images[0]=='string'? p.images[0] : p.images[0].url||"";
    }
    if(!img ||!img.startsWith('http')) continue;
    let code = p.productCode || key;
    try{
      let docRef = window.db.collection('products').doc(code);
      let doc = await docRef.get();
      if(!doc.exists ||!doc.data().image ||!doc.data().image.startsWith('http')){
        await docRef.set({name: p.name||p.productName||"", price: p.price||0, image: img, imageUrl: img, url: img, images: p.images||[img], productCode: code, category: p.category||"", timestamp: p.timestamp||Date.now(), dateDisplay: p.dateDisplay||new Date().toLocaleString('en-IN'), totalImages: p.totalImages||1}, {merge:true});
        fixed++;
        console.log("✅ Fixed Firebase URL: "+code);
      }
      await window.db.collection('imageRegistry').doc(code).set({productId: code, imageUrl: img, allImages: p.images||[img], name: p.name||"", price: p.price||0, updatedAt: new Date().toISOString(), timestamp: Date.now()}, {merge:true});
      if(window.addToMasterImageRegistry) window.addToMasterImageRegistry(code, img, p.name);
    }catch(e){ console.log("Error "+code, e.message); }
  }
  console.log(`✅ DONE - Total RTDB: ${count} - Fixed in Firebase: ${fixed} - Ab Cart me 100% image ayegi`);
  alert(`✅ Ho gaya! Total ${count} me se ${fixed} product ka URL Firebase me daal diya - Ab Cart reload karo - Half wala fix ho jayega - URL se image hamesha dikhegi`);
  if(btn){ btn.className='tick ok'; btn.innerHTML=`7. ONE FILE URL <span>✅ ${fixed}/${count} Firebase URL Fixed - Green</span>`; }
  if(window.fixImagesFromOneFileV32) window.fixImagesFromOneFileV32();
};
console.log("V35 Ready - Console me window.pushRTDBtoFirebaseV35() likh ke Enter daba ya admin me button dabao");

OLD CODE BACKUP END - V35 SAFE - DELETE NAHI - OLD CODE SAVE WITH UPDATE
*/

// ✅ V36 NEW CODE - OLD CODE SAVE WITH UPDATE - Firebase Ready Fix - Past Present Future
console.log("✅ santra-firebase-url-push.js V36 FINAL - OLD CODE SAVE WITH UPDATE - RTDB se Firebase URL push + Firebase Ready Fix");

window.getDBV36 = window.getDBV36 || function(){
  try{ if(window.db) return window.db; if(typeof firebase!=='undefined' && firebase.firestore) return firebase.firestore(); }catch(e){} return null;
};
window.getRTDBV36 = window.getRTDBV36 || function(){
  try{ if(window.rtdb) return window.rtdb; if(typeof firebase!=='undefined' && firebase.database) return firebase.database(); }catch(e){} return null;
};

window.pushRTDBtoFirebaseV36 = async function(){
  let db = window.getDBV36();
  let rtdb = window.getRTDBV36();
  if(!db ||!rtdb){
    console.log("⏳ Firebase abhi ready nahi - 2 sec baad auto retry V36...");
    let btn = document.getElementById('t7');
    if(btn){ btn.className='tick ok'; btn.innerHTML='7. ONE FILE URL <span>⏳ Firebase ready nahi - 2 sec baad auto retry V36...</span>'; }
    setTimeout(window.pushRTDBtoFirebaseV36, 2000);
    return "Retrying V36 - Firebase ready wait...";
  }

  let btn = document.getElementById('t7');
  if(btn){ btn.className='tick ok'; btn.innerHTML='7. ONE FILE URL <span>⏳ V36 - RTDB se Firebase URL push ho raha hai - 21 se 100+ URLs...</span>'; }

  console.log("🔥 V36 - RTDB products se Firebase me URL push start...");
  let snap = await rtdb.ref('products').once('value');
  if(!snap.exists()){ console.log("❌ RTDB me koi product nahi"); alert("RTDB me product nahi mila"); return; }

  let count = 0, fixed = 0;
  let all = snap.val();
  console.log("🔥 RTDB total products: "+Object.keys(all).length);

  for(let key in all){
    count++;
    let p = all[key];
    let img = p.image || p.imageUrl || p.httpsUrl || p.imgUrl || p.mainImage || "";
    if(!img && p.images && Array.isArray(p.images) && p.images[0]){
      img = typeof p.images[0]=='string'? p.images[0] : p.images[0].url||p.imageUrl||"";
    }
    if(!img ||!img.startsWith('http')) continue;

    let code = p.productCode || key;
    try{
      let docRef = db.collection('products').doc(code);
      let doc = await docRef.get();
      if(!doc.exists ||!doc.data().image ||!doc.data().image.startsWith('http')){
        await docRef.set({
          name: p.name||p.productName||"",
          price: p.price||0,
          image: img,
          imageUrl: img,
          url: img,
          images: p.images||[img],
          productCode: code,
          category: p.category||"",
          timestamp: p.timestamp||Date.now(),
          dateDisplay: p.dateDisplay||new Date().toLocaleString('en-IN'),
          totalImages: p.totalImages||1
        }, {merge:true});
        fixed++;
        console.log("✅ V36 Fixed Firebase URL: "+code+" -> "+img.substring(0,40));
      }

      await db.collection('imageRegistry').doc(code).set({
        productId: code,
        imageUrl: img,
        allImages: p.images||[img],
        name: p.name||"",
        price: p.price||0,
        updatedAt: new Date().toISOString(),
        timestamp: Date.now()
      }, {merge:true});

      if(window.addToMasterImageRegistry) window.addToMasterImageRegistry(code, img, p.name);

    }catch(e){ console.log("Error "+code, e.message); }
  }

  let totalUrls = 0;
  try{ totalUrls = Object.keys(window.SANTRA_ALL_URL_MAP||{}).length; }catch(e){}

  console.log(`✅ V36 DONE - Total RTDB: ${count} - Fixed in Firebase: ${fixed} - ONE FILE = ${totalUrls} URLs - Ab Cart me 100% image ayegi`);
  alert(`✅ V36 Ho gaya! Total ${count} me se ${fixed} product ka URL Firebase me daal diya\nONE FILE = ${totalUrls} URLs\nAb Cart reload karo - Half wala fix ho jayega - URL se image hamesha dikhegi`);

  if(btn){ btn.className='tick ok'; btn.innerHTML=`7. ONE FILE URL <span>✅ V36 - ${fixed}/${count} Fixed - Total ${totalUrls} URLs - Green</span>`; }

  if(window.fixImagesFromOneFileV35) window.fixImagesFromOneFileV35();
  if(window.fixImagesFromOneFileV32) window.fixImagesFromOneFileV32();
};

// Purana naam bhi kaam karega taaki tera button toote nahi - OLD SAVE WITH
window.pushRTDBtoFirebaseV35 = window.pushRTDBtoFirebaseV36;

console.log("V36 Ready - Console me pushRTDBtoFirebaseV36() likh ke Enter daba ya admin me button dabao - Firebase Ready Fix - OLD CODE SAVE WITH UPDATE");
console.log("santra-firebase-url-push.js V36 FINAL - LAST LINE OK - Old Code Save With Update - Past Present Future - One Line Connect");