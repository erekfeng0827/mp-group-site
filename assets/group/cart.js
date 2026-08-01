/**
 * Global Shopping Cart System (cart.js)
 * Shared across Minusplus, Soft Structure, Corey, Aether Vibes
 */
(function() {
  const CART_STORAGE_KEY = 'mp_group_global_cart';
  let cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

  // Create UI Elements
  function injectCartUI() {
    // Inject Cart Offcanvas
    const overlay = document.createElement('div');
    overlay.id = 'gbCartOverlay';
    overlay.className = 'gb-cart-overlay';
    
    const panel = document.createElement('div');
    panel.id = 'gbCartPanel';
    panel.className = 'gb-cart-panel';
    panel.innerHTML = `
      <div class="gb-cart-header">
        <h3>Shopping Cart</h3>
        <button id="gbCartClose">✕</button>
      </div>
      <div class="gb-cart-body" id="gbCartBody"></div>
      <div class="gb-cart-footer">
        <div class="gb-cart-total">Total: $<span id="gbCartTotal">0</span></div>
        <button class="gb-cart-checkout" onclick="alert('Proceeding to checkout. (Demo only)')">Checkout →</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    // CSS for Cart
    const style = document.createElement('style');
    style.innerHTML = `
      /* Offcanvas Cart */
      .gb-cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 10000; opacity: 0; visibility: hidden; transition: 0.3s; }
      .gb-cart-overlay.open { opacity: 1; visibility: visible; }
      .gb-cart-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 380px; max-width: 100%; background: #EAE3D8; color: #14110F; z-index: 10001; transform: translateX(100%); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; font-family: 'Noto Sans TC', sans-serif;}
      .gb-cart-panel.open { transform: translateX(0); }
      
      .gb-cart-header { padding: 24px; border-bottom: 1px solid rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
      .gb-cart-header h3 { margin: 0; font-size: 16px; font-weight: 600; font-family: 'Syne', sans-serif; text-transform: uppercase; }
      #gbCartClose { background: none; border: none; font-size: 20px; cursor: pointer; color: #14110F; }
      
      .gb-cart-body { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
      .gb-cart-empty { text-align: center; color: #777; margin-top: 40px; font-size: 14px; }
      
      .gb-cart-item { display: flex; gap: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 16px; }
      .gb-cart-item img { width: 60px; height: 60px; object-fit: cover; background: #ddd; border-radius: 4px; }
      .gb-cart-item-info { flex: 1; }
      .gb-cart-item-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #14110F; }
      .gb-cart-item-price { font-size: 12px; color: #7A1F2B; }
      .gb-cart-item-remove { font-size: 11px; text-decoration: underline; color: #777; cursor: pointer; margin-top: 4px; display: inline-block; }
      
      .gb-cart-footer { padding: 24px; border-top: 1px solid rgba(0,0,0,0.1); background: #fdfbf7; }
      .gb-cart-total { font-size: 18px; font-weight: 600; margin-bottom: 16px; font-family: 'Syne', sans-serif; color: #14110F; }
      .gb-cart-checkout { width: 100%; padding: 16px; background: #14110F; color: #fff; border: none; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.1em; cursor: pointer; text-transform: uppercase; transition: 0.2s; }
      .gb-cart-checkout:hover { background: #7A1F2B; }

      /* Store Section Styles (Global) */
      .ed-store-section { background: var(--charcoal, #14110F); color: var(--bone, #EAE3D8); padding-bottom: 80px; }
      .ed-store-hero { width: 100%; aspect-ratio: 16/9; background-size: cover; background-position: center; margin-bottom: 40px; }
      .ed-store-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      .ed-store-product { display: flex; flex-direction: column; gap: 12px; }
      .ed-store-img-wrap { width: 100%; aspect-ratio: 1/1; overflow: hidden; border-radius: 4px; position: relative; cursor: pointer; background: #222; }
      .ed-store-img-wrap img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.6); transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
      .ed-store-product:hover .ed-store-img-wrap img { transform: scale(1.05); }
      .ed-store-info h4 { font-size: 12px; margin: 0 0 4px; font-weight: 400; opacity: 0.9; }
      .ed-store-info .price { font-size: 11px; font-family: 'IBM Plex Mono', monospace; opacity: 0.6; }
      
      .btn-add-cart { margin-top: 8px; width: 100%; padding: 8px; background: transparent; border: 1px solid rgba(234,227,216,0.2); color: #EAE3D8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: 0.2s; }
      .btn-add-cart:hover { background: #EAE3D8; color: #14110F; }
    `;
    document.head.appendChild(style);

    // Events
    document.getElementById('gbCartClose').addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
  }

  function renderCart() {
    const body = document.getElementById('gbCartBody');
    const totalEl = document.getElementById('gbCartTotal');
    
    // Update all badge counts across the DOM (in case multiple)
    document.querySelectorAll('.gbCartCountBadge').forEach(badge => {
      badge.textContent = cartItems.length;
      badge.style.display = cartItems.length > 0 ? 'inline-block' : 'none';
    });

    if (cartItems.length === 0) {
      body.innerHTML = '<div class="gb-cart-empty">Your cart is empty.</div>';
      totalEl.textContent = '0';
      return;
    }

    let html = '';
    let total = 0;
    cartItems.forEach((item, index) => {
      total += item.price;
      html += `
        <div class="gb-cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="gb-cart-item-info">
            <div class="gb-cart-item-title">${item.name}</div>
            <div class="gb-cart-item-price">$${item.price}</div>
            <div class="gb-cart-item-remove" data-index="${index}">Remove</div>
          </div>
        </div>
      `;
    });

    body.innerHTML = html;
    totalEl.textContent = total.toLocaleString();

    // Bind remove buttons
    body.querySelectorAll('.gb-cart-item-remove').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-index'));
        cartItems.splice(idx, 1);
        saveCart();
        renderCart();
      });
    });
  }

  function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }

  function openCart(e) {
    if(e) e.preventDefault();
    document.getElementById('gbCartOverlay').classList.add('open');
    document.getElementById('gbCartPanel').classList.add('open');
    renderCart();
  }

  function closeCart() {
    document.getElementById('gbCartOverlay').classList.remove('open');
    document.getElementById('gbCartPanel').classList.remove('open');
  }

  function initGlobalCart() {
    injectCartUI();
    renderCart();

    // Bind to the group bar cart button
    document.addEventListener('click', function(e) {
      if (e.target.closest('.gb-cart-btn')) {
        e.preventDefault();
        openCart();
      }
      
      // Bind Add to Cart buttons
      if (e.target.closest('.btn-add-cart')) {
        const btn = e.target.closest('.btn-add-cart');
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price')) || 0;
        const img = btn.getAttribute('data-img');
        
        cartItems.push({ id, name, price, img });
        saveCart();
        renderCart();
        openCart();
        
        // Button feedback
        const oldText = btn.textContent;
        btn.textContent = 'ADDED ✔';
        btn.style.background = '#EAE3D8';
        btn.style.color = '#14110F';
        setTimeout(() => {
          btn.textContent = oldText;
          btn.style.background = '';
          btn.style.color = '';
        }, 1500);
      }
    });
  }

  // Load when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalCart);
  } else {
    initGlobalCart();
  }
})();
