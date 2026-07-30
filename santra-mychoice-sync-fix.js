// SANTRA MYCHOICE SYNC FIX - V4 FINAL 27 JULY - WITHOUT VERSION - HOME+PRODUCT+CART IFRAME SAME HEART - OLD SAVE
/*
⚠️ OLD CODE BACKUP - V3 FINAL 26 JULY - SAFE - KUCH HATAYA NAHI
[aapka V3 wala code upar safe hai]
OLD BACKUP END V3 SAFE
*/
(function(){
window.MYCHOICE_KEY=window.MYCHOICE_KEY||"santraMallMyChoice_v2";
window.getBaseId=function(id){ if(!id) return ""; return String(id).replace(/^home_/i,'').split('-')[0].split(' ')[0].trim().toLowerCase(); };

window.getMyChoiceArray=function(){
  let r=localStorage.getItem(window.MYCHOICE_KEY)||"[]"; let a=[];
  try{ a=JSON.parse(r); if(!Array.isArray(a)) a=Object.values(a||{});}catch(e){}
  let s={},c=[];
  a.forEach(function(it){
    if(!it||!it.id) return;
    if(it.name==="Product"&&(!it.price||it.price===0)) return;
    let b=window.getBaseId(it.id||it.code||"");
    if(!b||s[b]) return; s[b]=1; it.id=b; it.code=b; c.push(it);
  });
  return c;
};
window.saveMyChoiceMap=function(arr){
  let s={},c=[];
  (arr||[]).forEach(function(it){ let b=window.getBaseId(it.id||it.code||"").toLowerCase(); if(!b||s[b]) return; s[b]=1; it.id=b; it.code=b; c.push(it); });
  localStorage.setItem(window.MYCHOICE_KEY,JSON.stringify(c));
  try{ window.dispatchEvent(new CustomEvent('mychoice:updated',{detail:c})); }catch(e){}
  try{ if(window.parent&&window.parent!==window) window.parent.postMessage({type:'mychoice:updated',data:c},'*'); }catch(e){}
  setTimeout(function(){ if(window.updateAllMyChoiceHearts) window.updateAllMyChoiceHearts(); },50);
};
window.toggleMyChoice=function(p){
  let raw=""; let obj=null;
  if(typeof p==='string'){ raw=p; } else if(p&&typeof p==='object'){ raw=(p.id||p.code||"").toString(); obj=p; }
  if(!raw){ try{ raw=new URLSearchParams(location.search).get('id')||""; }catch(e){} }
  if(!raw) return false;
  let base=window.getBaseId(raw);
  if(!base||base.length<2||base.length>40) return false;
  let arr=window.getMyChoiceArray();
  let idx=arr.findIndex(function(x){ return window.getBaseId(x.id||"")===base; });
  if(idx!==-1){ arr.splice(idx,1); window.saveMyChoiceMap(arr); return false; }
  else{
    if(!obj){
      try{ if(window.allProducts){ let f=window.allProducts.find(z=>window.getBaseId(z.id||"")===base); if(f) obj={id:base,code:base,name:f.name,price:f.price,image:f.image||f.thumbnail}; } }catch(e){}
    }
    if(!obj||!obj.name) return false;
    arr.push(obj); window.saveMyChoiceMap(arr); return true;
  }
};
window.updateAllMyChoiceHearts=function(){
  let arr=window.getMyChoiceArray(); let map={}; arr.forEach(function(it){ map[window.getBaseId(it.id||"")]=1; });
  document.querySelectorAll('[id^="heart-"],[data-id],[data-product-id]').forEach(function(el){
    let id=el.getAttribute('data-id')||el.getAttribute('data-product-id')||el.id||""; if(id.indexOf('heart-')===0) id=id.replace('heart-','');
    if(!id) return; let base=window.getBaseId(id); let sel=!!map[base];
    if(el.id&&el.id.indexOf('heart-')===0){ el.innerText=sel?"❤️":"🤍"; el.style.background=sel?"#ffe0e0":"white"; }
  });
  let cnt=arr.length;
  let b1=document.getElementById('choiceBadge'); if(b1){ b1.innerText=cnt; b1.style.display=cnt>0?'flex':'none'; }
};
window.addEventListener('mychoice:updated',function(){ setTimeout(window.updateAllMyChoiceHearts,80); });
window.addEventListener('storage',function(e){ if(e.key&&e.key.toLowerCase().includes('mychoice')) setTimeout(window.updateAllMyChoiceHearts,80); });
window.addEventListener('message',function(e){ try{ if(e.data&&e.data.type==='mychoice:updated'){ localStorage.setItem(window.MYCHOICE_KEY,JSON.stringify(e.data.data)); setTimeout(window.updateAllMyChoiceHearts,100); } }catch(err){} });
document.addEventListener('DOMContentLoaded',function(){ setTimeout(window.updateAllMyChoiceHearts,600); setTimeout(window.updateAllMyChoiceHearts,1600); });
console.log("✅ santra-mychoice-sync-fix.js V4 FINAL WITHOUT VERSION - LAST LINE OK");
})();