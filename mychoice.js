// ✅ MYCHOICE.JS - SANTRA MALL - 24 JUNE 2026 - UPDATED VERSION // Is file ko
index.html aur product.html me add kar dena /* ⚠️ ===== OLD CODE BACKUP - 24
JUNE 2026 SE PEHLE WALA ===== ⚠️ Agar kuch toot jaye to ye uncomment kar dena
window.addToMyChoice = function (product, selectedVariant = null, selectedQty =
1) { if (!product) { showToast("❌ Product load nahi hua"); return false; } let
myChoiceData = localStorage.getItem(MYCHOICE_KEY); let myChoice = []; try {
myChoice = JSON.parse(myChoiceData || "[]"); if (!Array.isArray(myChoice))
myChoice = []; } catch (e) { myChoice = []; } let finalPrice = product.price ||
product.sellingPrice || 0; if (selectedVariant && selectedVariant.price) {
finalPrice = selectedVariant.price; } let productImage = ""; if (product.media
&& product.media.length > 0) { productImage = product.media[0].url ||
product.media[0]; } else if (product.images && product.images.length > 0) {
productImage = product.images[0]; } else if (product.imageUrl) { productImage =
product.imageUrl; } else if (product.image) { productImage = product.image; }
else if (product.img) { productImage = product.img; } let variantName =
"Default"; if (selectedVariant) { variantName = selectedVariant.name ||
selectedVariant.size || selectedVariant.volume || selectedVariant.weight ||
"Default"; } let myChoiceItem = { id: product.id || product.code, name:
product.name || product.productName, price: finalPrice, image: productImage,
code: product.code || product.productCode || product.id, category:
product.category || "General", variant: variantName, productLink:
window.location.origin + "/product.html?id=" + encodeURIComponent(product.id ||
product.code), qty: selectedQty || 1, addedAt: new Date().toISOString() }; let
existingIndex = myChoice.findIndex(item => item.id === myChoiceItem.id &&
item.variant === myChoiceItem.variant); if (existingIndex === -1) {
myChoice.push(myChoiceItem); localStorage.setItem(MYCHOICE_KEY,
JSON.stringify(myChoice)); showToast("😍 Added to My Choice!"); if (typeof
auth!== "undefined" && auth.currentUser && typeof db!== "undefined") {
db.collection("users").doc(auth.currentUser.uid).collection("mychoice").doc(myChoiceItem.id).set(myChoiceItem,
{ merge: true }); } updateChoiceCount(); return true; } else {
showToast("Already in My Choice!"); return false; } }; ===== OLD CODE BACKUP END
===== */ // ✅ STEP 1: MYCHOICE_KEY check - Agar secrets.js me nahi hai to banao
if (typeof MYCHOICE_KEY === "undefined") { var MYCHOICE_KEY =
"santra_mall_mychoice"; window.MYCHOICE_KEY = MYCHOICE_KEY; } // ✅ STEP 2: Add
to My Choice Function - UPDATED WITH NULL CHECK window.addToMyChoice = function
( product, selectedVariant = null, selectedQty = 1 ) { // ✅ FIX 1: Null/ID
check - Yahi error tha "Cannot read properties of null" if (!product) {
console.error("❌ addToMyChoice: Product is null", product); showToast("❌
Product load nahi hua. Page refresh karo"); return false; } if (!product.id &&
!product.code) { console.error("❌ addToMyChoice: Product ID missing", product);
showToast("❌ Product ID nahi mila"); return false; } // My Choice data nikalo
let myChoiceData = localStorage.getItem(MYCHOICE_KEY); let myChoice = []; try {
myChoice = JSON.parse(myChoiceData || "[]"); if (!Array.isArray(myChoice))
myChoice = []; } catch (e) { console.log("MyChoice parse error, resetting:", e);
myChoice = []; } // Price nikalo let finalPrice = product.price ||
product.sellingPrice || 0; if (selectedVariant && selectedVariant.price) {
finalPrice = selectedVariant.price; } // ✅ FIX 2: Image 5 jagah se check karo
let productImage = ""; if (product.media && product.media.length > 0) {
productImage = product.media[0].url || product.media[0]; } else if
(product.images && product.images.length > 0) { productImage =
product.images[0]; } else if (product.imageUrl) { productImage =
product.imageUrl; } else if (product.image) { productImage = product.image; }
else if (product.img) { productImage = product.img; } // Variant name nikalo let
variantName = "Default"; if (selectedVariant) { variantName =
selectedVariant.name || selectedVariant.size || selectedVariant.volume ||
selectedVariant.weight || "Default"; } // My Choice Item banao let myChoiceItem
= { id: product.id || product.code, name: product.name || product.productName ||
"Product", price: finalPrice, image: productImage, code: product.code ||
product.productCode || product.id, category: product.category || "General",
variant: variantName, productLink: window.location.origin + "/product.html?id="
+ encodeURIComponent(product.id || product.code), qty: selectedQty || 1,
addedAt: new Date().toISOString() }; // Check karo already hai ya nahi let
existingIndex = myChoice.findIndex( item => item.id === myChoiceItem.id &&
item.variant === myChoiceItem.variant ); if (existingIndex === -1) {
myChoice.push(myChoiceItem); localStorage.setItem(MYCHOICE_KEY,
JSON.stringify(myChoice)); showToast("😍 Added to My Choice!"); console.log("✅
Saved to My Choice:", myChoiceItem); // ✅ Firebase me bhi save karo agar user
login hai if ( typeof auth !== "undefined" && auth.currentUser && typeof db !==
"undefined" ) { db.collection("users") .doc(auth.currentUser.uid)
.collection("mychoice") .doc(myChoiceItem.id) .set(myChoiceItem, { merge: true
}) .catch(err => console.log("Firebase save failed:", err)); }
updateChoiceCount(); return true; } else { showToast("Already in My Choice!");
return false; } }; // STEP 3: Toast Function - Agar nahi hai to banao if (typeof
showToast === "undefined") { window.showToast = function (message) { const toast
= document.createElement("div"); toast.innerText = message; toast.style.cssText
=
"position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#e40046;color:white;padding:14px
24px;border-radius:8px;z-index:9999;font-size:15px;font-weight:bold;box-shadow:0
4px 12px rgba(0,0,0,0.3)"; document.body.appendChild(toast); setTimeout(() => {
if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
}; } // STEP 4: Update Choice Count - Header me count dikhane ke liye
window.updateChoiceCount = function () { try { let myChoice =
JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]"); let count =
Array.isArray(myChoice) ? myChoice.length : 0; let countElements =
document.querySelectorAll( ".mychoice-count, #mychoiceCount,.wish-count" );
countElements.forEach(el => { if (el) el.innerText = count; }); console.log("✅
My Choice count updated:", count); } catch (e) { console.log("Choice count
update failed:", e); } }; // Page load pe count update karo if
(document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", updateChoiceCount); } else {
updateChoiceCount(); } console.log("✅ mychoice.js loaded - UPDATED 24 JUNE
2026");
