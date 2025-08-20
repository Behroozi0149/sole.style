const money = n => `$${Number(n).toFixed(2)}`;
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  const search = document.getElementById("search");
  const openCartBtn = document.getElementById("openCart");
  const drawer = document.getElementById("cartDrawer");
  const closeCartBtn = document.getElementById("closeCart");
  const backdrop = document.getElementById("backdrop");
  const cartCount = document.getElementById("cartCount");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const clearBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");
  let cart = JSON.parse(localStorage.getItem("solestyle-cart") || "[]");
  const save = () => localStorage.setItem("solestyle-cart", JSON.stringify(cart));
  const openCart = () => {
    drawer.classList.add("open");
    backdrop.classList.add("show");
    drawer.setAttribute("aria-hidden","false");
  };
  const closeCart = () => {
    drawer.classList.remove("open");
    backdrop.classList.remove("show");
    drawer.setAttribute("aria-hidden","true");
  };
  openCartBtn.addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  backdrop.addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if(e.key === "Escape") closeCart(); });
  grid.addEventListener("click", e => {
    const btn = e.target.closest(".add-to-cart");
    if(!btn) return;
    const card = btn.closest(".product-card");
    const title = card.dataset.title;
    const price = parseFloat(card.dataset.price);
    const img = card.querySelector("img").getAttribute("src");
    const existing = cart.find(i => i.title === title && i.price === price);
    if(existing) existing.qty += 1;
    else cart.push({ title, price, img, qty: 1 });
    drawCart();
    save();
  });
  search.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll(".product-card").forEach(card => {
      card.style.display = card.dataset.title.toLowerCase().includes(q) ? "" : "none";
    });
  });
  function drawCart(){
    cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
    cartItemsEl.innerHTML = cart.length
      ? cart.map((i,idx)=>`
        <div class="cart-item" data-idx="${idx}">
          <img src="${i.img}" alt="">
          <div>
            <div class="item-title">${i.title}</div>
            <div class="item-price">${money(i.price)}</div>
            <div class="qty">
              <button class="dec" aria-label="Decrease">−</button>
              <span>${i.qty}</span>
              <button class="inc" aria-label="Increase">+</button>
            </div>
          </div>
          <button class="remove" aria-label="Remove">Remove</button>
        </div>
      `).join("")
      : `<p style="color:#6b7280">Your cart is empty.</p>`;
    const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);
    cartTotalEl.textContent = money(total);
  }

  cartItemsEl.addEventListener("click", e => {
    const row = e.target.closest(".cart-item");
    if(!row) return;
    const idx = Number(row.dataset.idx);
    if(e.target.classList.contains("inc")) cart[idx].qty += 1;
    if(e.target.classList.contains("dec")) cart[idx].qty = Math.max(1, cart[idx].qty - 1);
    if(e.target.classList.contains("remove")) cart.splice(idx,1);
    drawCart(); save();
  });
  clearBtn.addEventListener("click", () => {
    if(!cart.length) return;
    if(confirm("Empty the cart?")){ cart = []; drawCart(); save(); }
  });
  checkoutBtn.addEventListener("click", () => {
    if(!cart.length) { alert("Your cart is empty."); return; }
    const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);
    alert(`✅ Order placed.\nTotal amount: ${money(total)}\n(Demo)`);
    cart = []; drawCart(); save(); closeCart();
  });
  drawCart();
});
