/* ==================== OLD CODE BACKUP - 28 JUNE 2026 - HIDE NOT DELETE ====================
const MYCHOICE_KEY = "santrajet_mychoice";
window.updateMyChoiceBadge = function() {
    if (typeof auth === 'undefined') return;
    auth.onAuthStateChanged(user => {
        if (user && typeof rtdb!== 'undefined') {
            rtdb.ref('users/' + user.uid + '/myChoice').on('value', (snapshot) => {
                const count = snapshot.numChildren();
                const choiceBadge = document.getElementById('choiceBadge');
                if (choiceBadge) {
                    choiceBadge.innerText = count;
                    choiceBadge.style.display = count > 0? 'flex' : 'none';
                }
            });
        } else {
            let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
            const choiceBadge = document.getElementById('choiceBadge');
            if (choiceBadge) {
                choiceBadge.innerText = myChoice.length;
                choiceBadge.style.display = myChoice.length > 0? 'flex' : 'none';
            }
        }
    });
}
window.addToMyChoice = function(productData) {
    let product = productData || (typeof currentProduct!== 'undefined'? currentProduct : null);
    if (!product) { showToast("Product load nahi hua"); return; }
    let finalPrice = product.price;
    let productImage = product.image || product.thumbnail;
    if (typeof selectedVariantData!== 'undefined' && selectedVariantData?.price) finalPrice = selectedVariantData.price;
    if (typeof getProductThumbnail!== 'undefined') productImage = getProductThumbnail(product);
    let choiceItem = { id: product.id, name: product.name, price: finalPrice, image: productImage, code: product.code || product.id, variant: typeof selectedVariant!== 'undefined'? selectedVariant || "Default" : "Default", from: product.dbType || 'rtdb', addedAt: new Date().toISOString() };
    let myChoiceArray = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
    let existingIndex = myChoiceArray.findIndex(item => item && item.id === product.id && item.variant === choiceItem.variant);
    if (existingIndex === -1) {
        myChoiceArray.push(choiceItem);
        localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoiceArray));
    } else { showToast("⚠️ Already in My Choice!"); return; }
    if (user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/myChoice/' + product.id).set(choiceItem).then(() => { showToast("😍 Added to My Choice!"); window.updateMyChoiceBadge(); });
    } else { showToast("😍 Added to My Choice!"); window.updateMyChoiceBadge(); }
}
window.updateWishlistIcon = function(isAdded) { const wishBtn = document.getElementById('wishBtn'); if (wishBtn) wishBtn.innerHTML = isAdded? '😍' : '🤍'; }
window.checkWishlistStatus = function() { const user = auth.currentUser; const productId = new URLSearchParams(window.location.search).get("id"); if (!productId) return; if (user) { rtdb.ref('users/' + user.uid + '/myChoice/' + productId).once('value', (snapshot) => { window.updateWishlistIcon(snapshot.exists()); }); } else { let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]"); let exists = myChoice.some(item => item && item.id === productId); window.updateWishlistIcon(exists); } }
window.removeFromMyChoice = function(productId) { const user = typeof auth!== 'undefined'? auth.currentUser : null; let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]"); myChoice = myChoice.filter(item => item && item.id!== productId); localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice)); if (user) rtdb.ref('users/' + user.uid + '/myChoice/' + productId).remove(); window.updateMyChoiceBadge(); window.updateWishlistIcon(false); showToast("Removed from My Choice"); }
OLD BACKUP END - Agar chahiye toh uncomment karna
*/

// ==================== MYCHOICE HANDLER - UNIVERSAL - FIXED 18 JULY 2026 - PERMISSION_DENIED FIX ====================
// constants.js ko follow karega - dobara const declare nahi hoga - Firebase sync HIDE

if(typeof window.MYCHOICE_KEY === 'undefined'){
  window.MYCHOICE_KEY = "santraMallMyChoice_v2";
}
if(typeof window.CART_KEY === 'undefined'){
  window.CART_KEY = "santraMallCart_v2";
}
var MYCHOICE_KEY = window.MYCHOICE_KEY;
var CART_KEY = window.CART_KEY;

function cleanList(list){
  let seen={}; let clean=[];
  (list||[]).forEach(o=>{
    if(!o||!o.id) return;
    let id=String(o.id).replace(/^home_/,'').toLowerCase().trim();
    if(!id || id.length>35 || /^\d{10,}$/.test(id)) return;
    let v=String(o.variant||o.size||"M").toUpperCase();
    let k=id+"_"+v;
    if(!id||seen[k]) return;
    seen[k]=1; o.id=id; o.code=id; clean.push(o);
  });
  return clean;
}

function syncAllKeys(list){
  // FIX 18 JULY - HIDE AUTO SYNC - Yahi extra badha raha tha
  try{ localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list)); }catch{}
}

window.updateMyChoiceBadge = window.updateHeaderBadges = function() {
    try{
      let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
      myChoice = cleanList(myChoice);
      localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));
      const choiceBadge = document.getElementById('choiceBadge');
      const homeChoiceBadge = document.getElementById('homeChoiceBadge');
      if (choiceBadge) {
          choiceBadge.innerText = myChoice.length;
          choiceBadge.style.display = myChoice.length > 0? 'flex' : 'none';
      }
      if(homeChoiceBadge){
          homeChoiceBadge.innerText = myChoice.length;
          homeChoiceBadge.style.display = myChoice.length > 0? 'flex' : 'none';
      }
      myChoice.forEach(it=>{
        let b=document.getElementById('heart-'+it.id);
        if(b) b.innerHTML='❤️';
      });
    }catch(e){console.log(e);}
}

window.addToMyChoice = function(productData) {
    let product = productData || (typeof currentProduct!== 'undefined'? currentProduct : null);
    if (!product ||!product.id) return;
    product.id = String(product.id).replace(/^home_/,'').toLowerCase().trim();
    if(product.id.length>35) return;

    let finalPrice = product.price;
    let productImage = product.image || product.thumbnail || (product.images && product.images[0]) || '';
    if (typeof selectedVariantData!== 'undefined' && selectedVariantData?.price) finalPrice = selectedVariantData.price;
    if (typeof getProductThumbnail!== 'undefined' && product.name) {
        let thumb = getProductThumbnail(product);
        if(thumb) productImage = thumb;
    }
    let choiceItem = {
        id: product.id,
        name: product.name || "Product",
        price: finalPrice,
        image: productImage,
        code: product.code || product.id,
        variant: typeof selectedVariant!== 'undefined'? selectedVariant || "M" : "M",
        size: typeof selectedVariant!== 'undefined'? selectedVariant || "M" : "M",
        addedAt: new Date().toISOString()
    };

    let myChoiceArray = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
    myChoiceArray = cleanList(myChoiceArray);
    let existingIndex = myChoiceArray.findIndex(item => item && String(item.id).toLowerCase() === String(product.id).toLowerCase());

    if (existingIndex === -1) {
        myChoiceArray.push(choiceItem);
        localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoiceArray));
        if(typeof showToast!== 'undefined') showToast("😍 Added to My Choice!");
        let btn=document.getElementById('heart-'+product.id);
        if(btn) btn.innerHTML='❤️';
    } else {
        myChoiceArray.splice(existingIndex,1);
        localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoiceArray));
        if(typeof showToast!== 'undefined') showToast("❌ Removed");
        let btn=document.getElementById('heart-'+product.id);
        if(btn) btn.innerHTML='🤍';
    }
    window.updateMyChoiceBadge();

    // FIX 18 JULY - FIREBASE SYNC HIDE - Yahi permission_denied de raha tha - Console me 3 error aa rahe the
    /*
    if(user && typeof rtdb!== 'undefined'){
      rtdb.ref('users/' + user.uid + '/myChoice/' + product.id).set(choiceItem)...
    }
    */
    if(window.SM_LOCK?.backup) window.SM_LOCK.backup();
}

// FIX 18 JULY - IMAGE SAVE FIX - allProducts se dhundh ke image save karega
window.toggleMyChoice = function(id,e){
  if(e){e.preventDefault(); e.stopPropagation();}
  let cleanId = String(id).replace(/^home_/,'').toLowerCase().trim();
  if(!cleanId || cleanId.length>35) return;
  let prod = null;
  if(typeof allProducts!== 'undefined' && Array.isArray(allProducts)){
    prod = allProducts.find(p=> String(p.id).replace(/^home_/,'').toLowerCase().trim()===cleanId);
  }
  if(!prod && typeof currentModalProduct!== 'undefined' && currentModalProduct){
    if(String(currentModalProduct.id).replace(/^home_/,'').toLowerCase().trim()===cleanId) prod=currentModalProduct;
  }
  if(!prod && typeof currentProduct!== 'undefined' && currentProduct){
    prod=currentProduct;
  }
  if(prod){
    window.addToMyChoice({
      id: cleanId,
      name: prod.name,
      price: prod.price || prod.sellingPrice || 0,
      image: prod.image || prod.thumbnail || (prod.images && prod.images[0]) || '',
      code: prod.code || cleanId
    });
  }else{
    window.addToMyChoice({id:cleanId, name:"Product", price:0, image:""});
  }
};

window.updateWishlistIcon = function(isAdded) {
    const wishBtn = document.getElementById('wishBtn');
    if (wishBtn) wishBtn.innerHTML = isAdded? '❤️' : '🤍';
}

window.removeFromMyChoice = function(productId) {
    let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
    myChoice = cleanList(myChoice);
    myChoice = myChoice.filter(item => item && String(item.id).toLowerCase()!==String(productId).toLowerCase().trim());
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));
    window.updateMyChoiceBadge();
    if(typeof loadMyChoice==='function') loadMyChoice();
    // FIX 18 JULY - FIREBASE REMOVE HIDE - permission_denied fix
    // if(user) rtdb.ref('users/' + user.uid + '/myChoice/' + productId).remove();
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => { window.updateMyChoiceBadge(); }, 800);
});
window.addEventListener("load", window.updateMyChoiceBadge);

console.log("✅ MyChoice Handler FINAL 18 JULY - Old save + Firebase HIDE + Image fix + Extra add stop");