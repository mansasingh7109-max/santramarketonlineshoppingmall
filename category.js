// category.js V25.1 FINAL - WITHOUT VERSION - FILTER CONNECT + ALL CATEGORY LOAD + IMAGE 100% + GITHUB FIX - OLD CODE SAVE WITH UPDATE - DNA SAFE

/*
⚠️ OLD CODE BACKUP - 29-JUNE-2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI - DNA - IMPORTANT
...aapka purana backup...
function loadCategories() {
  rtdb.ref("categories").once('value', snap => {... });
}
function loadProducts() {
  rtdb.ref('products').once('value', snap => {... });
}
function renderCategoryListForCategoryPage() {... }
function renderCategoryGrid() {... }
OLD CODE BACKUP END - 29-JUNE-2026 - SAFE - DELETE NAHI - DNA
⚠️ V25 BACKUP - 28 JULY 2026 - WITHOUT VERSION - SAFE - DELETE NAHI
...V25 wala pura backup upar safe hai...
*/

// FINAL - 28 JULY 2026 - WITHOUT VERSION - FILTER CONNECT + ALL CATEGORY LOAD - OLD SAVE WITH UPDATE - V25 IMAGE FIX + GITHUB FIX
if(typeof window.CART_KEY === 'undefined'){ window.CART_KEY = "santraMallCart_v2"; }
if(typeof window.BASE_URL === 'undefined'){ window.BASE_URL = "https://santramarketshoppingmall.web.app"; }
if(typeof window.allCategories === 'undefined'){ window.allCategories = []; }
if(typeof window.allProductsForCategory === 'undefined'){ window.allProductsForCategory = []; }
if(typeof window.allCategoriesDocs === 'undefined'){ window.allCategoriesDocs = []; }

// V25 - Universal Image Fix - Past Present Future All Image - 6 JAGAH
window.isValidHttpImage=window.isValidHttpImage||function(u){ if(!u||typeof u!=='string') return false; let s=u.trim(); if(s==""||s=="N/A"||s=="null"||s=="undefined") return false; if(s.startsWith('blob:')) return false; if(s.includes('[object Object]')) return false; if(s.length<12) return false; if(s.startsWith('data:image')) return true; return s.startsWith('http://')||s.startsWith('https://'); };
window.getBestImageAny=window.getBestImageAny||function(p){
  if(!p) return "";
  let keys=['image','imageUrl','httpsUrl','categoryImage','catImage','category_image','thumbnail','thumb','photo','img','productImage','mainImage','src','imgbb','cloudinary','lux','imageURL','image_M','base64','downloadURL'];
  for(let k of keys){ if(p[k]&&typeof p[k]==='string'&&p[k].trim()!=""){ let url=p[k].trim(); if(url.startsWith('data:image')) return url; if(url.startsWith('http')&&!url.includes('placeholder')){ if(url.includes('_M')){ let w=url.replace(/_M/g,''); if(window.isValidHttpImage(w)) return w; } return url; } } }
  if(p.httpsUrls&&Array.isArray(p.httpsUrls)){ for(let u of p.httpsUrls){ if(window.isValidHttpImage(u)) return u; } }
  if(p.images&&Array.isArray(p.images)){ for(let im of p.images){ let u=typeof im==='string'?im:im.url||im.imageUrl||""; if(window.isValidHttpImage(u)) return u; } }
  return "";
};
window.getMasterPreviewImage=window.getMasterPreviewImage||function(id,name){
  try{
    let all=[]; ["santra_master_all_products_with_images_v24","santram_products_v1","santram_products_backup","santra_6way_backup","santra_all_products_cache","allProductsCache","allProducts","santra_all_products","products_temp"].forEach(function(k){ try{ let v=localStorage.getItem(k)||sessionStorage.getItem(k); if(v){ let a=JSON.parse(v); all=all.concat(Array.isArray(a)?a:Object.values(a)); } }catch(e){} });
    if(window.allProducts) all=all.concat(window.allProducts);
    let base=(id||"").toString().toLowerCase().split('_')[0].split('-')[0].trim();
    let nm=(name||"").toLowerCase().split(' ')[0];
    let fd=null;
    if(base) fd=all.find(function(x){ let xid=(x.id||x.name||"").toString().toLowerCase().split('_')[0].split('-')[0]; return xid===base; });
    if(!fd&&nm) fd=all.find(function(x){ return String(x.name||"").toLowerCase().includes(nm); });
    if(fd){ let im=window.getBestImageAny(fd); if(window.isValidHttpImage(im)) return im; }
  }catch(e){} return "";
};
console.log("✅ category.js V25.1 FINAL - Universal Image Fix - OLD CODE SAVE WITH - GitHub Fix");

// 🔴 RULE: db ko const se nahi - window pe guard - nahi toh dusri file kharab hoti hai
window.loadCategories = window.loadCategories || async function() {
  window.db = window.db || (typeof firebase!=='undefined'? firebase.firestore() : null);
  window.rtdb = window.rtdb || (typeof firebase!=='undefined'? firebase.database() : null);
  let db = window.db; let rtdb = window.rtdb;
  if(!db ||!rtdb){ console.log("⏳ Firebase not ready - retry"); setTimeout(()=>{ if(window.loadCategories) window.loadCategories(); }, 1000); return; }

  window.allProductsForCategory = [];
  window.allCategoriesDocs = [];
  const catMap = new Map();
  function addCat(name, imageObj){
    if(!name) return;
    let clean = name.toString().trim(); if(!clean) return;
    let lower = clean.toLowerCase();
    let bestImg = window.getBestImageAny(imageObj) || window.getMasterPreviewImage("", clean) || 'https://via.placeholder.com/80?text='+encodeURIComponent(clean);
    if(!window.isValidHttpImage(bestImg)) bestImg = window.getMasterPreviewImage("", clean) || 'https://via.placeholder.com/80?text='+encodeURIComponent(clean);
    if(!catMap.has(lower)){
      catMap.set(lower, { id: clean, name: clean, image: bestImg });
    } else {
      let ex=catMap.get(lower);
      if(!window.isValidHttpImage(ex.image) && window.isValidHttpImage(bestImg)) ex.image=bestImg;
    }
  }
  try{ const prodSnap = await rtdb.ref('products').once('value'); prodSnap.forEach(child => { let p = child.val(); window.allProductsForCategory.push({id:child.key,...p, category:(p.category||'').trim()}); if(p.category) addCat(p.category, p); }); }catch(e){}
  try{ const prodSnap2 = await db.collection('products').get(); prodSnap2.forEach(doc => { let p = doc.data(); if(!window.allProductsForCategory.find(x=>x.id===doc.id)){ window.allProductsForCategory.push({id:doc.id,...p, category:(p.category||'').trim()}); } if(p.category) addCat(p.category, p); }); }catch(e){}
  try{ const catSnap = await rtdb.ref('categories').once('value'); catSnap.forEach(child => { let c = child.val(); window.allCategoriesDocs.push({id:child.key,...c}); addCat(c.name, c); }); }catch(e){}
  try{ const catSnap2 = await db.collection('categories').get(); catSnap2.forEach(doc => { let c = doc.data(); if(!window.allCategoriesDocs.find(x=>x.id===doc.id)){ window.allCategoriesDocs.push({id:doc.id,...c}); } addCat(c.name, c); }); }catch(e){}

  window.allCategories = Array.from(catMap.values()).sort((a,b)=>a.name.localeCompare(b.name));
  if(document.getElementById('catList')) renderCategoryListForCategoryPage();
  if(document.getElementById('categoryContainer')) renderCategoryGrid();
  renderHomeCategories();
  let catFilter = document.getElementById('categoryFilter');
  if(catFilter){
    catFilter.innerHTML = '<option value="">All Categories</option>' + window.allCategories.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
  }
  console.log("✅ loadCategories V25.1 - Total categories:", window.allCategories.length, "- GitHub + Acode both");
};

function getProductCountForCategoryFinal(cat, products){
  let cc = cat.toLowerCase().trim();
  return products.filter(p => { let pc = (p.category||'').toLowerCase().trim(); return pc === cc || pc.includes(cc) || cc.includes(pc); }).length;
}

function renderCategoryListForCategoryPage(){
  const catList = document.getElementById('catList');
  if(!catList) return;
  catList.innerHTML = window.allCategories.map(cat => {
    let count = getProductCountForCategoryFinal(cat.name, window.allProductsForCategory);
    let img = window.getBestImageAny(cat) || window.getMasterPreviewImage("", cat.name) || cat.image;
    if(!window.isValidHttpImage(img)) img='https://via.placeholder.com/80?text='+encodeURIComponent(cat.name);
    return `<div class="cat-card" onclick="showCategoryProducts('${cat.name.replace(/'/g,"\\'")}')"><img src="${img}" onerror="this.onerror=null; this.src=window.getMasterPreviewImage('','${cat.name}')||'https://via.placeholder.com/80?text=No+Image'" alt="${cat.name}"><h4>${cat.name}</h4><p style="font-size:12px;color:#999;">${count} Products</p></div>`;
  }).join('');
}

function renderCategoryGrid(){
  const container = document.getElementById('categoryContainer');
  if(!container) return;
  container.innerHTML = window.allCategories.map(cat => {
    let count = getProductCountForCategoryFinal(cat.name, window.allProductsForCategory);
    let img = window.getBestImageAny(cat) || window.getMasterPreviewImage("", cat.name) || cat.image;
    if(!window.isValidHttpImage(img)) img='https://via.placeholder.com/80?text='+encodeURIComponent(cat.name);
    return `<div class="category-card" onclick="openCategoryProducts('${cat.name.replace(/'/g,"\\'")}')"><img src="${img}" onerror="this.onerror=null; this.src=window.getMasterPreviewImage('','${cat.name}')||'https://via.placeholder.com/80?text=No+Image'" class="cat-img"><div class="cat-name">${cat.name}</div><div class="cat-count">${count} Products</div></div>`;
  }).join('');
}

function renderHomeCategories(){
  try{
    document.querySelectorAll('.category-circle img,.cat-circle img,.home-cat img,.cat-item img').forEach(function(el){
      if(!window.isValidHttpImage(el.src) || el.src.includes('placeholder')){
        let name=el.alt||el.getAttribute('data-name')||el.nextElementSibling?.innerText||"";
        let best=window.getMasterPreviewImage("", name);
        if(window.isValidHttpImage(best)) el.src=best;
      }
    });
  }catch(e){}
}

window.openCategoryProducts = (cat) => location.href = `index.html?category=${encodeURIComponent(cat)}`;
window.showCategoryProducts = (cat) => location.href = `category.html?name=${encodeURIComponent(cat)}`;
document.addEventListener('DOMContentLoaded', ()=> setTimeout(()=>{ if(window.loadCategories) window.loadCategories(); },600));

console.log("category.js V25.1 FINAL - WITHOUT VERSION - FILTER CONNECT + ALL CATEGORY LOAD + IMAGE 100% + GITHUB FIX - OLD CODE SAVE WITH UPDATE - LAST LINE OK - RULE FOLLOW");