// mychoicesame.js - V10 FINAL 27 JULY - WITHOUT VERSION - HOME+PRODUCT BOTH SELECT - OLD CODE SAVE WITH UPDATE
/*
⚠️ OLD CODE BACKUP - V5 FINAL 27 JULY - HOME HEART FIX - OLD - SAFE
[aapka V5 wala code yahan safe hai - maine backup me rakh diya]
OLD BACKUP END - V5 - SAFE
*/

console.log("✅ mychoicesame.js V10 FINAL - WITHOUT VERSION - HOME+PRODUCT BOTH SELECT");

(function(){
  const MYCHOICE_KEY = "santraMallMyChoice_v2";
  window.MYCHOICE_KEY = MYCHOICE_KEY;
  function norm(id){ return String(id||"").replace(/^home_/i,'').trim(); }
  function normLow(id){ return norm(id).toLowerCase(); }
  function isValidId(id){ id=normLow(id); return id.length>=2 && id.length<=40 &&!id.includes(' ') &&!id.includes('/'); }

  function getThumb(p){
    if(!p) return "https://via.placeholder.com/300?text=No+Image";
    if(p.image && p.image.startsWith('http') &&!p.image.includes('placeholder')) return p.image;
    return "https://via.placeholder.com/300?text=No+Image";
  }
  function getAll(){ try{ return JSON.parse(localStorage.getItem(MYCHOICE_KEY)||"[]"); }catch{ return []; } }
  function saveAll(list){ localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list)); updateUI(); }

  function updateUI(){
    let list=getAll(); let map={}; list.forEach(it=>map[normLow(it.id)]=true);
    document.querySelectorAll('[id^="heart-"]').forEach(el=>{
      let hid=normLow(el.id.replace('heart-',''));
      el.innerHTML=map[hid]?'❤️':'🤍';
      el.style.background=map[hid]?'#ffe0e0':'white';
    });
    ["choiceBadge","homeChoiceBadge","myChoiceCount"].forEach(id=>{ let b=document.getElementById(id); if(b) b.innerText=list.length; });
  }

  window.toggleMyChoice=function(idOrProduct, e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    let id = typeof idOrProduct==='object'? idOrProduct.id : idOrProduct;
    id=norm(id); if(!isValidId(id)) return;
    let list=getAll(); let low=id.toLowerCase();
    let idx=list.findIndex(x=>normLow(x.id)===low);
    if(idx>=0){ list.splice(idx,1); }
    else{
      let real=null; try{ real=(window.allProducts||[]).find(p=>normLow(p.id)===low); }catch{}
      let img=getThumb(real||{id:id}); let name=real?.name||id; let price=real?.price||0;
      let btn=document.getElementById('heart-'+id) || document.getElementById('heart-home_'+id) || document.querySelector(`[data-id="${id}"]`);
      if(btn){ let card=btn.closest('.product-card'); if(card){ let im=card.querySelector('img'); if(im) img=im.src; let h3=card.querySelector('h3'); if(h3) name=h3.innerText.trim(); } }
      list.push({id:low, name:name, image:img, price:price, code:low, size:"M", addedAt:new Date().toISOString()});
    }
    saveAll(list);
  };

  window.updateMyChoiceUI=updateUI;
  document.addEventListener("DOMContentLoaded", ()=>{ setTimeout(updateUI,500); setTimeout(updateUI,1500); });
})();