// santra-universal-image-sync.js - V48 FINAL - 6 Jagah Se Image - Past Present Future Hamesha Show
console.log("✅ Universal Image Sync - 6 Jagah Check");

window.SANTRA_IMAGES = window.SANTRA_IMAGES || {};
window.SANTRA_ALL_URLS = window.SANTRA_ALL_URLS || {};

window.getUniversalProductImage = function(id){
  if(!id) return '';
  id = String(id).trim();
  let keys = [id, id.toLowerCase(), id.toUpperCase()];
  // 1. SANTRA_ALL_URLS - aapka master file
  for(let k of keys){
    if(window.SANTRA_ALL_URLS[k]) return window.SANTRA_ALL_URLS[k];
    if(window.SANTRA_IMAGES[k]) return window.SANTRA_IMAGES[k];
    if(window.SANTRA_IMAGES[k.toLowerCase()]) return window.SANTRA_IMAGES[k.toLowerCase()];
  }
  // 2. LocalStorage - past orders
  try{
    let backup = JSON.parse(localStorage.getItem('lastOrderCartBackup')||'[]');
    let f = backup.find(x=>String(x.id).trim()===id || String(x.code).trim()===id);
    if(f && (f.image||f.imageUrl)) return f.image||f.imageUrl;
    let prods = JSON.parse(localStorage.getItem('santraProducts')||'[]');
    let p = prods.find(x=>String(x.id).trim()===id);
    if(p && (p.image||p.images?.[0])) return p.image||p.images[0];
  }catch(e){}
  // 3. Firebase se URL - agar hai to
  return '';
};

window.getProductImagesUniversal = function(p){
  let imgs=[];
  if(p && p.images && Array.isArray(p.images)) imgs = p.images.filter(i=>i && i.trim().length>10);
  if(imgs.length===0){
    let fields=['image','imageUrl','productImage','thumbnail','photo','img','picture','mainImage','imgbb','cloudinary','lux','firebaseImage','googleDriveUrl'];
    for(let f of fields){
      let v=p[f];
      if(v && typeof v==='string' && v.length>10) { imgs=[v]; break; }
    }
  }
  if(imgs.length===0){
    let id = (p.id||p.code||'').toString().trim();
    let url = window.getUniversalProductImage(id);
    if(url) imgs=[url];
  }
  if(imgs.length===0) imgs=["https://via.placeholder.com/500?text=No+Image"];
  return imgs;
};

// Auto-fix home page ke liye
document.addEventListener('DOMContentLoaded', ()=>{
  setTimeout(()=>{
    document.querySelectorAll('img[src=""]').forEach(img=>{
      let id = img.getAttribute('data-id')||img.getAttribute('data-product-id');
      if(id){ let u = window.getUniversalProductImage(id); if(u) img.src=u; }
    });
  }, 1500);
});
console.log("✅ Universal Sync Loaded - Past Present Future OK");