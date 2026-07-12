// santra-home.js - v2.1 FIXED (uses v2 cart key)
(function(){
  console.log('🏠 Santra Home v2 Running');

  const CART_KEY = 'santraMallCart_v2'; // <-- FIXED

  const Cart = {
    get:()=>JSON.parse(localStorage.getItem(CART_KEY)||'[]'),
    save:(c)=>{
      localStorage.setItem(CART_KEY,JSON.stringify(c));
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

  // sirf agar pehle se nahi hai to set karo
  if(typeof window.addToCart!== 'function'){
    window.addToCart = (p)=>Cart.add(p);
  }

  function getProductFromCard(card){
    return {
      id: card.dataset.id || card.querySelector('[data-id]')?.dataset.id || Math.random().toString(36).slice(2),
      name: card.querySelector('.product-title, h3, h4')?.innerText.trim() || 'Product',
      price: +(card.innerText.match(/₹\s?(\d+)/)?.[1] || 0),
      image: card.querySelector('img')?.src || ''
    };
  }

  function healHome(){
    // sirf ek baar fix karo, har 3 sec nahi
    document.querySelectorAll('.add-to-cart').forEach(btn=>{
      if(!btn._fixed){
        btn._fixed=true;
        btn.onclick=(e)=>{
          e.preventDefault();
          const card=btn.closest('.product-card');
          if(card) Cart.add(getProductFromCard(card))
        };
      }
    });
    Cart.save(Cart.get());
  }

  document.addEventListener('DOMContentLoaded',healHome);
  setInterval(()=>localStorage.setItem('homeAlive',Date.now()),10000);
})();