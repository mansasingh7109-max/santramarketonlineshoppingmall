// santra-home.js - Customer Home Page Only (Auto-Heal)
(function(){
  console.log('🏠 Santra Home Running');

  const Cart = {
    get:()=>JSON.parse(localStorage.getItem('santraCart')||'[]'),
    save:(c)=>{
      localStorage.setItem('santraCart',JSON.stringify(c));
      const n=c.reduce((a,i)=>a+(i.qty||1),0);
      document.querySelectorAll('#cartCount,.cart-count').forEach(e=>e.textContent=n)
    },
    add:(p)=>{
      let c=Cart.get();
      let f=c.find(x=>x.id===p.id);
      f?f.qty++:c.push({...p,qty:1});
      Cart.save(c);
      const t=document.createElement('div');
      t.textContent='✓ '+p.name;
      t.style.cssText='position:fixed;top:20px;right:20px;background:#e91e63;color:white;padding:8px 15px;border-radius:20px;z-index:9999';
      document.body.appendChild(t);
      setTimeout(()=>t.remove(),1500)
    }
  };
  window.addToCart = (p)=>Cart.add(p);

  function getProductFromCard(card){
    return {
      id: card.dataset.id || card.querySelector('[data-id]')?.dataset.id || Math.random().toString(36).slice(2),
      name: card.querySelector('.product-title, h3, h4')?.innerText.trim() || card.innerText.split('\n')[0] || 'Product',
      price: +(card.innerText.match(/₹\s?(\d+)/)?.[1] || 0),
      image: card.querySelector('img')?.src || ''
    };
  }

  function healHome(){
    document.querySelectorAll('.add-to-cart, [onclick*="addToCart"], button').forEach(btn=>{
      if(btn.innerText.toLowerCase().includes('cart') &&!btn._fixed){
        btn._fixed=true;
        btn.onclick=(e)=>{
          e.preventDefault();
          const card=btn.closest('.product-card,.card,[class*="product"]');
          if(card) Cart.add(getProductFromCard(card))
        };
      }
    });
    const applyBtn=document.querySelector('button');
    if(applyBtn && applyBtn.innerText.includes('Apply') &&!applyBtn._fixed){
      applyBtn._fixed=true;
      applyBtn.onclick=()=>{document.querySelectorAll('.product-card').forEach(c=>c.style.display='')};
    }
    document.querySelectorAll('[class*="category"],.circle').forEach(cat=>{
      if(!cat._fixed){cat._fixed=true;cat.style.cursor='pointer';cat.onclick=()=>window.scrollTo({top:600,behavior:'smooth'})}
    });
    const search=document.querySelector('input[placeholder*="Search"]');
    if(search &&!search._fixed){
      search._fixed=true;
      search.oninput=()=>{
        const v=search.value.toLowerCase();
        document.querySelectorAll('.product-card').forEach(c=>c.style.display=c.innerText.toLowerCase().includes(v)?'':'none')
      }
    }
    Cart.save(Cart.get());
  }

  setInterval(healHome,3000);
  document.addEventListener('DOMContentLoaded',healHome);
  window.addEventListener('error',()=>setTimeout(healHome,1000));
  setInterval(()=>localStorage.setItem('homeAlive',Date.now()),10000);
})();