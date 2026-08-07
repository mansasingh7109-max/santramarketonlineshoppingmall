/*
⚠️ OLD CODE BACKUP - SAFE - KUCH HATAYA NAHI
V33: only image
V36: only cart
V45: image2,3 only cart
OLD CODE BACKUP END - SAFE
*/
console.log("✅ SANTRA - OLD CODE SAVE - 3 FILE SAFE - Past Present Future - FAST");
window.CART_KEY = window.CART_KEY || "santraMallCart_v2";
window.BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";
window.SANTRA_ALL_URL_MAP = window.SANTRA_ALL_URL_MAP || {};
window.SANTRA_ALL_URLS = window.SANTRA_ALL_URLS || window.SANTRA_ALL_URL_MAP;
window.getOneFileImage = function(p){
  if(!p) return "";
  let fb=['image','imageUrl','img','thumbnail','firebaseImage'];
  for(let k of fb){ let v=p[k]; if(v&&v.startsWith('http')&&v.includes('firebasestorage.googleapis.com')) return v.trim(); }
  let f=['image','imageUrl','img','thumbnail','photo','image2','image3','img2','img3'];
  for(let k of f){ let v=p[k]; if(v&&v.startsWith('http')&&!v.includes('placeholder')&&!v.includes('ibb.co')) return v.trim(); }
  if(p.images&&Array.isArray(p.images)){ for(let im of p.images){ let url=typeof im==='string'?im:im.url||""; if(url&&url.startsWith('http')) return url; } }
  return "";
};
window.getOneFileBaseId = function(id){ return String(id||"").trim(); };
window.buildOneFile = function(){
  return new Promise(async(res)=>{
    let all=[]; try{ let db=window.db||firebase.firestore(); if(db){ let snap=await db.collection('products').limit(500).get(); snap.forEach(d=>all.push({id:d.id,...d.data()})); } }catch(e){}
    let map={}; all.forEach(p=>{ let img=window.getOneFileImage(p); if(!img) return; [p.id,p.code,p.name].filter(Boolean).forEach(k=>{ map[String(k).trim().toLowerCase()]=img; map[String(k).trim()]=img; }); });
    window.SANTRA_ALL_URL_MAP=map; window.SANTRA_ALL_URLS=map;
    try{ localStorage.setItem('santra_one_file_map', JSON.stringify(map)); }catch(e){}
    console.log(`✅ ONE FILE = ${Object.keys(map).length} URLs - Old Code Save - Other File Safe`);
    res(map);
  });
};
window.fixAllImagesPastPresentFuture = function(){
  let map=window.SANTRA_ALL_URL_MAP; try{ if(!map||Object.keys(map).length<10) map=JSON.parse(localStorage.getItem('santra_one_file_map')||"{}"); }catch(e){} window.SANTRA_ALL_URLS=map;
  let key=window.CART_KEY||'santraMallCart_v2';
  try{ let arr=JSON.parse(localStorage.getItem(key)||"[]"); if(Array.isArray(arr)&&arr.length){ arr.forEach(it=>{ let url=map[String(it.id||"").toLowerCase()]||map[String(it.code||"").toLowerCase()]; if(url){ it.image=url; } }); localStorage.setItem(key, JSON.stringify(arr)); } }catch(e){}
};
setTimeout(()=>{ if(typeof firebase!=='undefined') window.buildOneFile().then(()=>window.fixAllImagesPastPresentFuture()); },900);
setTimeout(()=>{ window.fixAllImagesPastPresentFuture(); },2200);
console.log("LAST LINE OK - Old Code Save - 3 File Safe - Past Present Future - Other File Safe - Bina Version");