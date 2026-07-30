// backup-all-image.js V22 FINAL - SINGLE FILE - OLD CODE SAVE WITH - 100% WORKING
/*
⚠️ OLD CODE BACKUP - backup.js 4-jagah - SAFE - DNA
function backupAllProducts(products){
  const data = JSON.stringify(products);
  localStorage.setItem('santram_products_v1', data);
  localStorage.setItem('santram_products_backup', data);
  sessionStorage.setItem('products_temp', data);
  try {
    const blob = new Blob([data], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'santram_products_' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
  } catch(e){}
}
function loadAllProducts(){
  const saved = localStorage.getItem('santram_products_v1') || localStorage.getItem('santram_products_backup') || '[]';
  try { return JSON.parse(saved); } catch(e){ return []; }
}
OLD BACKUP END - SAFE
*/
console.log("✅ backup-all-image.js V22 SINGLE FILE");
window.SANTRA_BACKUP_KEYS=['santram_products_v1','santram_products_backup','santra_6way_backup','santra_all_products_cache','allProductsCache','sm','santra_all_products','allProducts','santra_products','products_temp'];
function backupAllProducts(products){
  if(!products||!Array.isArray(products)||products.length===0) return false;
  const data=JSON.stringify(products);
  window.SANTRA_BACKUP_KEYS.forEach(function(k){
    try{
      if(k==='products_temp') sessionStorage.setItem(k,data);
      localStorage.setItem(k,data);
    }catch(e){}
  });
  // admin download - OLD FEATURE - sirf admin me
  try{
    if(location.href.includes('admin')){
      const blob=new Blob([data],{type:'application/json'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download='santram_products_'+new Date().toISOString().slice(0,10)+'.json';
      a.click();
    }
  }catch(e){}
  return true;
}
function loadAllProducts(){
  for(let k of window.SANTRA_BACKUP_KEYS){
    try{
      let v=localStorage.getItem(k)||sessionStorage.getItem(k);
      if(v&&v.length>20){
        let arr=JSON.parse(v);
        if(Array.isArray(arr)&&arr.length>0) return arr;
      }
    }catch(e){}
  }
  return [];
}
console.log("V22 LAST LINE OK");