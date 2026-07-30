/*
⚠️ OLD CODE BACKUP - 29-JUNE-2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI
...aapka purana backup...
OLD CODE BACKUP END
*/

// FINAL - 28 JULY 2026 - WITHOUT VERSION - FILTER CONNECT + ALL CATEGORY LOAD
if(typeof window.CART_KEY === 'undefined'){ window.CART_KEY = "santraMallCart_v2"; }
if(typeof window.BASE_URL === 'undefined'){ window.BASE_URL = "https://santramarketshoppingmall.web.app"; }
if(typeof window.allCategories === 'undefined'){ window.allCategories = []; }
if(typeof window.allProductsForCategory === 'undefined'){ window.allProductsForCategory = []; }
if(typeof window.allCategoriesDocs === 'undefined'){ window.allCategoriesDocs = []; }

window.loadCategories = async function() {
  const db = window.db || firebase.firestore();
  const rtdb = firebase.database();
  window.allProductsForCategory = [];
  window.allCategoriesDocs = [];
  const catMap = new Map();
  function addCat(name, image){
    if(!name) return;
    let clean = name.toString().trim();
    if(!clean) return;
    let lower = clean.toLowerCase();
    if(!catMap.has(lower)){
      catMap.set(lower, { id: clean, name: clean, image: image || 'https://via.placeholder.com/80?text='+encodeURIComponent(clean) });
    }
  }
  try{
    const prodSnap = await rtdb.ref('products').once('value');
    prodSnap.forEach(child => {
      let p = child.val();
      window.allProductsForCategory.push({id:child.key,...p, category:(p.category||'').trim()});
      if(p.category) addCat(p.category, p.image || p.imageUrl);
    });
  }catch(e){}
  try{
    const prodSnap2 = await db.collection('products').get();
    prodSnap2.forEach(doc => {
      let p = doc.data();
      if(!window.allProductsForCategory.find(x=>x.id===doc.id)){
        window.allProductsForCategory.push({id:doc.id,...p, category:(p.category||'').trim()});
      }
      if(p.category) addCat(p.category, p.image || p.imageUrl);
    });
  }catch(e){}
  try{
    const catSnap = await rtdb.ref('categories').once('value');
    catSnap.forEach(child => {
      let c = child.val();
      window.allCategoriesDocs.push({id:child.key,...c});
      addCat(c.name, c.image || c.categoryImage || c.img);
    });
  }catch(e){}
  try{
    const catSnap2 = await db.collection('categories').get();
    catSnap2.forEach(doc => {
      let c = doc.data();
      if(!window.allCategoriesDocs.find(x=>x.id===doc.id)){
        window.allCategoriesDocs.push({id:doc.id,...c});
      }
      addCat(c.name, c.image || c.categoryImage || c.img);
    });
  }catch(e){}

  window.allCategories = Array.from(catMap.values()).sort((a,b)=>a.name.localeCompare(b.name));
  if(document.getElementById('catList')) renderCategoryListForCategoryPage();
  if(document.getElementById('categoryContainer')) renderCategoryGrid();
  renderHomeCategories();
  let catFilter = document.getElementById('categoryFilter');
  if(catFilter){
    catFilter.innerHTML = '<option value="">All Categories</option>' + window.allCategories.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
  }
}

function getProductCountForCategoryFinal(cat, products){
  let cc = cat.toLowerCase().trim();
  return products.filter(p => {
    let pc = (p.category||'').toLowerCase().trim();
    return pc === cc || pc.includes(cc) || cc.includes(pc);
  }).length;
}

function renderCategoryListForCategoryPage(){
  const catList = document.getElementById('catList');
  if(!catList) return;
  catList.innerHTML = window.allCategories.map(cat => {
    let count = getProductCountForCategoryFinal(cat.name, window.allProductsForCategory);
    return `<div class="cat-card" onclick="showCategoryProducts('${cat.name}')"><img src="${cat.image}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'" alt="${cat.name}"><h4>${cat.name}</h4><p style="font-size:12px;color:#999;">${count} Products</p></div>`;
  }).join('');
}

function renderCategoryGrid(){
  const container = document.getElementById('categoryContainer');
  if(!container) return;
  container.innerHTML = window.allCategories.map(cat => {
    let count = getProductCountForCategoryFinal(cat.name, window.allProductsForCategory);
    return `<div class="category-card" onclick="openCategoryProducts('${cat.name}')"><img src="${cat.image}" class="cat-img"><div class="cat-name">${cat.name}</div><div class="cat-count">${count} Products</div></div>`;
  }).join('');
}

function renderHomeCategories(){
  let selects = document.querySelectorAll('select');
  if(selects.length>0){
    let catSelect = selects[0];
    if(catSelect && catSelect.options.length < 15){
      catSelect.innerHTML = '<option value="">All Categories</option>' + window.allCategories.map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
    }
  }
}

window.openCategoryProducts = (cat) => location.href = `index.html?category=${encodeURIComponent(cat)}`;
window.showCategoryProducts = (cat) => location.href = `category.html?name=${encodeURIComponent(cat)}`;
document.addEventListener('DOMContentLoaded', ()=> setTimeout(()=>{ if(window.loadCategories) window.loadCategories(); },600));