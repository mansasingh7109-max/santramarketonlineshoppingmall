/*

⚠️ OLD CODE BACKUP - 29 JUNE 2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI - SAVE WITH UPDATE
delete window.CART_KEY;
window.CART_KEY = "santraMallCart_v2";
window.WISH_KEY = "santraMyChoice_v2";
window.CART_KEY = window.CART_KEY || "santra_cart";
function getProductThumbnail(p){ return p.image || "placeholder"; }
function addToCart(productData){
  let cartArray = JSON.parse(localStorage.getItem("santra_cart")||"[]");
  cartArray.push(productData);
  localStorage.setItem("santra_cart", JSON.stringify(cartArray));
  // OLD - image _M ke saath khali aati thi, badge update nahi hota tha
}
function updateCartBadge(){
  let cart = JSON.parse(localStorage.getItem("santra_cart")||"[]");
  document.getElementById('cartBadge').innerText = cart.length;
}

OLD CODE BACKUP END - 29 JUNE 2026 SAFE - V1 OLD CODE SAVE WITH UPDATE

*/

// ==================== CART.JS FINAL 24 JULY 2026 - IMAGE + SIZE _M FIX - OLD CODE SAVE WITH UPDATE ====================
// FINAL - PURA AYA - HOME IMAGE IN CART 100% + _M HATAAKE IMAGE + BADGE FIX

window.getBaseId=window.getBaseId||function(id){if(!id)return"";return String(id).split('_')[0].split('-')[0].trim();};

function getProductThumbnail(p){
  if(!p) return "https://via.placeholder.com/90x90?text=No+Image";
  // V3 universal image use karo agar available hai
  if(typeof window.getUniversalImage==='function'){
    let uni = window.getUniversalImage(p);
    if(uni && uni.startsWith('http') &&!uni.includes('placeholder')) return uni;
  }
  let fields=['image','imageUrl','thumbnail','thumb','photo','img','productImage','src'];
  for(let f of fields){
    if(p[f] && typeof p[f]==='string' && p[f].startsWith('http') &&!p[f].includes('placeholder')) return p[f].trim();
  }
  if(p.media && Array.isArray(p.media)){
    for(let m of p.media){
      if(typeof m==='string' && m.startsWith('http')) return m;
      if(m && m.url && m.url.startsWith('http')) return m.url;
    }
  }
  if(p.images && Array.isArray(p.images)){
    for(let m of p.images){
      if(typeof m==='string' && m.startsWith('http')) return m;
      if(m && m.url && m.url.startsWith('http')) return m.url;
    }
  }
  try{
    let cache=JSON.parse(localStorage.getItem('santra_all_products_cache')||"[]");
    let sid=String(p.id||"").toLowerCase().split('_')[0].split('-')[0];
    let f=cache.find(x=>String(x.id||"").toLowerCase().split('_')[0]===sid);
    if(f){
      if(f.image && f.image.startsWith('http')) return f.image;
      if(f.images && f.images[0]) return typeof f.images[0]==='string'?f.images[0]:f.images[0].url;
    }
  }catch{}
  return "https://via.placeholder.com/90x90?text=No+Image";
}

window.getSafeCart = function() {
    let cart = [];
    try{
        const raw = localStorage.getItem(window.CART_KEY || "santraMallCart_v2");
        cart = raw? JSON.parse(raw) : [];
        if(!Array.isArray(cart)) cart = Object.values(cart);
    }catch(e){ cart = []; }
    return cart;
}

window.getSafeWishlist = function() {
    let wish = [];
    try{
        const raw = localStorage.getItem(window.MYCHOICE_KEY || "santraMallMyChoice_v2");
        wish = raw? JSON.parse(raw) : [];
        if(!Array.isArray(wish)) wish = Object.values(wish);
    }catch(e){ wish = []; }
    return wish;
}

window.updateCartBadge = function() {
    let cart = window.getSafeCart();
    let wish = window.getSafeWishlist();
    let totalQty = cart.reduce((sum, item) => sum + (parseInt(item.qty) || 1), 0);
    let badges = [document.getElementById('cartBadge'), document.getElementById('bottomCartBadge'), document.getElementById('homeCartBadge')];
    badges.forEach(b=>{ if(b){ b.innerText=totalQty; b.style.display=totalQty>0?'flex':'none'; } });
    let choiceBadge = document.getElementById('choiceBadge');
    if(choiceBadge){ choiceBadge.innerText=wish.length; choiceBadge.style.display=wish.length>0?'flex':'none'; }
}

window.addToCart = function(productData) {
    if (!productData ||!productData.id) {
        if(typeof currentProduct!== 'undefined' && currentProduct && currentProduct.id){
            productData = currentProduct;
            if(typeof selectedVariant!== 'undefined' && selectedVariant){
                productData.variant = selectedVariant;
                productData.id = currentProduct.id + '_' + selectedVariant;
            }
            if(typeof selectedVariantData!== 'undefined' && selectedVariantData.price){
                productData.price = selectedVariantData.price;
            }
        } else {
            if(typeof showToast!== 'undefined') showToast("Product not found");
            return;
        }
    }

    // 🔥 SIZE _M HATAAKE IMAGE LO - FINAL V3 FIX - Home ki image My Cart me 100% ayegi
    let img = getProductThumbnail(productData);
    if(img.includes('placeholder') || img.includes('No+Image')){
      try{
        let baseId = String(productData.id).split('_')[0].split('-')[0];
        // Try universal image with baseId
        if(typeof window.getUniversalImage==='function'){
          let uni = window.getUniversalImage({id:baseId, name:productData.name});
          if(uni && uni.startsWith('http') &&!uni.includes('placeholder')) img = uni;
        }
        if(img.includes('placeholder')){
          let cache = JSON.parse(localStorage.getItem('santra_all_products_cache')||"[]");
          let found = cache.find(x=>String(x.id).toLowerCase()===baseId.toLowerCase() || String(x.id).toLowerCase().split('_')[0]===baseId.toLowerCase());
          if(found){
            let img2 = getProductThumbnail(found);
            if(img2 &&!img2.includes('placeholder')) img = img2;
          }
        }
      }catch{}
    }

    let cartItem = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: img,
        imageUrl: img,
        thumbnail: img,
        code: productData.code || window.getBaseId(productData.id),
        productCode: productData.code || window.getBaseId(productData.id),
        variant: productData.variant || "M",
        size: productData.variant || productData.size || "M",
        qty: productData.qty || 1,
        dbType: productData.dbType || 'rtdb'
    };

    let cartArray = window.getSafeCart();
    let idx = cartArray.findIndex(item => String(item.id).toLowerCase() === String(productData.id).toLowerCase());
    if (idx > -1) {
        cartArray[idx].qty += (productData.qty || 1);
        if(cartArray[idx].image.includes('placeholder') || cartArray[idx].image.includes('No+Image')){
            cartArray[idx].image = img; cartArray[idx].imageUrl = img; cartArray[idx].thumbnail = img;
        }
        // Update code to baseId
        cartArray[idx].code = window.getBaseId(cartArray[idx].code||cartArray[idx].id);
        cartArray[idx].productCode = window.getBaseId(cartArray[idx].code||cartArray[idx].id);
    } else {
        cartArray.push(cartItem);
    }
    localStorage.setItem(window.CART_KEY || "santraMallCart_v2", JSON.stringify(cartArray));
    localStorage.setItem("santraMallCart_v2", JSON.stringify(cartArray));
    // Clean old keys
    try{ localStorage.removeItem("santra_cart"); localStorage.removeItem("cart"); }catch(e){}

    if(typeof showToast!== 'undefined') showToast("✅ Added to Cart! 🛒");
    window.updateCartBadge();
}

window.removeFromCart = function(productId) {
    let cartArray = window.getSafeCart();
    cartArray = cartArray.filter(item => String(item.id).toLowerCase()!==String(productId).toLowerCase());
    localStorage.setItem(window.CART_KEY || "santraMallCart_v2", JSON.stringify(cartArray));
    localStorage.setItem("santraMallCart_v2", JSON.stringify(cartArray));
    if(typeof showToast!== 'undefined') showToast("Removed from cart");
    window.updateCartBadge();
    if (typeof renderCartPage === 'function') renderCartPage();
    if (typeof renderCart === 'function') renderCart();
}

window.updateCartQty = function(productId, newQty) {
    if (newQty < 1) return window.removeFromCart(productId);
    let cartArray = window.getSafeCart();
    let index = cartArray.findIndex(item => String(item.id).toLowerCase()===String(productId).toLowerCase());
    if (index > -1) {
        cartArray[index].qty = newQty;
        localStorage.setItem(window.CART_KEY || "santraMallCart_v2", JSON.stringify(cartArray));
        localStorage.setItem("santraMallCart_v2", JSON.stringify(cartArray));
    }
    window.updateCartBadge();
}

window.addToWishlist = function(productData) {
    if(!productData ||!productData.id) return;
    let wish = window.getSafeWishlist();
    if(!wish.find(p => String(p.id).toLowerCase() === String(productData.id).toLowerCase())) {
        wish.push({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: getProductThumbnail(productData),
            code: window.getBaseId(productData.code||productData.id)
        });
        localStorage.setItem(window.MYCHOICE_KEY || "santraMallMyChoice_v2", JSON.stringify(wish));
        if(typeof showToast!== 'undefined') showToast("❤️ My Choice me add ho gaya");
        window.updateCartBadge();
    }
}

document.addEventListener('DOMContentLoaded', function() { setTimeout(window.updateCartBadge, 500); });
console.log('Cart.js FINAL 24 JULY 2026 loaded, image fix done - OLD CODE SAVE WITH UPDATE - PURA AYA - LAST LINE OK');
/* 24 JULY 2026 - CART.JS FINAL - IMAGE + SIZE _M FIX - Home page ki image My Cart me 100% ayegi - MNJoFdR0G7fMHwdkV0P6_M ka base MNJoFdR0G7fMHwdkV0P6 - OLD CODE SAVE WITH UPDATE - LAST LINE OK */