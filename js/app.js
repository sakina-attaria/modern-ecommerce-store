




/* ============================
   CART — LocalStorage Helpers
============================ */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart(cart);
  showToast("Added to cart!");
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateQty(productId, newQty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = newQty;
    if (item.qty <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = totalItems;
}

/* ============================
   TOAST NOTIFICATION
============================ */
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: #222; color: #fff; padding: 12px 24px; border-radius: 8px;
      font-size: 0.9rem; z-index: 999; opacity: 0; transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 2000);
}

/* ============================
   PRICE HELPER
============================ */
function getDiscountedPrice(price, discount) {
  return Math.round(price - (price * discount / 100));
}

/* ============================
   PRODUCT CARD HTML
============================ */
function createProductCard(product) {
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price-row">
          <span class="price">Rs. ${finalPrice}</span>
          ${product.discount > 0 ? `<span class="old-price">Rs. ${product.price}</span>` : ""}
        </div>
        <div class="rating">${"⭐".repeat(Math.round(product.rating))} (${product.rating})</div>
        <div class="product-actions">
          <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
          <a href="product.html?id=${product.id}" class="view-btn">View Details</a>
        </div>
      </div>
    </div>
  `;
}

/* ============================
   NAVBAR — Mobile Menu + Search + Home Page
============================ */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  const navSearchBtn = document.getElementById("navSearchBtn");
  const navSearch = document.getElementById("navSearch");
  if (navSearchBtn) {
    navSearchBtn.addEventListener("click", () => {
      const query = navSearch.value.trim();
      if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
      }
    });
  }

  const featuredContainer = document.getElementById("featuredProducts");
  if (featuredContainer) {
    const featured = products.slice(0, 8);
    featuredContainer.innerHTML = featured.map(createProductCard).join("");
  }

  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Subscribed successfully!");
      newsletterForm.reset();
    });
  }
});

/* ============================
   PRODUCTS PAGE LOGIC
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return;

  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("productSearch");
  const resultsCount = document.getElementById("resultsCount");

  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const urlSearch = urlParams.get("search");
  if (urlSearch) searchInput.value = urlSearch;

  function renderProducts() {
    let filtered = [...products];

    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    const selectedPrice = priceFilter.value;
    if (selectedPrice !== "all") {
      const [min, max] = selectedPrice.split("-").map(Number);
      filtered = filtered.filter(p => {
        const finalPrice = getDiscountedPrice(p.price, p.discount);
        return finalPrice >= min && (max ? finalPrice <= max : true);
      });
    }

    const sortValue = sortSelect.value;
    if (sortValue === "low-high") {
      filtered.sort((a, b) => getDiscountedPrice(a.price, a.discount) - getDiscountedPrice(b.price, b.discount));
    } else if (sortValue === "high-low") {
      filtered.sort((a, b) => getDiscountedPrice(b.price, b.discount) - getDiscountedPrice(a.price, a.discount));
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `<p class="no-results">No products found.</p>`;
    } else {
      productsGrid.innerHTML = filtered.map(createProductCard).join("");
    }
    resultsCount.textContent = `${filtered.length} products found`;
  }

  categoryFilter.addEventListener("change", renderProducts);
  priceFilter.addEventListener("change", renderProducts);
  sortSelect.addEventListener("change", renderProducts);
  searchInput.addEventListener("input", renderProducts);

  renderProducts();
});

/* ============================
   PRODUCT DETAILS PAGE LOGIC
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const detailsContainer = document.getElementById("productDetails");
  if (!detailsContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  const product = products.find(p => p.id === productId);

  if (!product) {
    detailsContainer.innerHTML = `<p class="no-results">Product not found.</p>`;
    return;
  }

  const finalPrice = getDiscountedPrice(product.price, product.discount);

  detailsContainer.innerHTML = `
    <div class="details-container">
      <div class="details-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="details-info">
        <h1>${product.name}</h1>
        <div class="rating">${"⭐".repeat(Math.round(product.rating))} (${product.rating})</div>
        <div class="price-row">
          <span class="price">Rs. ${finalPrice}</span>
          ${product.discount > 0 ? `<span class="old-price">Rs. ${product.price}</span> <span class="discount-badge">${product.discount}% OFF</span>` : ""}
        </div>
        <p class="details-desc">${product.description}</p>
        <p class="stock-info">${product.stock > 0 ? `✅ In Stock (${product.stock} available)` : "❌ Out of Stock"}</p>

        <div class="qty-selector">
          <label>Quantity:</label>
          <button id="decreaseQty">-</button>
          <span id="qtyValue">1</span>
          <button id="increaseQty">+</button>
        </div>

        <button class="btn-primary add-cart-btn-large" id="detailsAddCart">Add to Cart</button>
      </div>
    </div>
  `;

  let qty = 1;
  const qtyValue = document.getElementById("qtyValue");
  document.getElementById("increaseQty").addEventListener("click", () => {
    if (qty < product.stock) {
      qty++;
      qtyValue.textContent = qty;
    }
  });
  document.getElementById("decreaseQty").addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      qtyValue.textContent = qty;
    }
  });
  document.getElementById("detailsAddCart").addEventListener("click", () => {
    addToCart(product.id, qty);
  });

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  document.getElementById("relatedProducts").innerHTML = related.map(createProductCard).join("");
});

/* ============================
   CART PAGE LOGIC
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  if (!cartItemsContainer) return;

  renderCartPage();

  function renderCartPage() {
    const cart = getCart();

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="no-results">Your cart is empty. <a href="products.html">Shop now</a></p>`;
      document.getElementById("cartSummary").innerHTML = "";
      return;
    }

    let itemsHTML = "";
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;
      const finalPrice = getDiscountedPrice(product.price, product.discount);
      const lineTotal = finalPrice * item.qty;
      subtotal += lineTotal;
      totalItems += item.qty;

      itemsHTML += `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div class="cart-item-info">
            <h3>${product.name}</h3>
            <p class="price">Rs. ${finalPrice}</p>
          </div>
          <div class="cart-item-qty">
            <button onclick="changeCartQty(${product.id}, ${item.qty - 1})">-</button>
            <span>${item.qty}</span>
            <button onclick="changeCartQty(${product.id}, ${item.qty + 1})">+</button>
          </div>
          <div class="cart-item-total">Rs. ${lineTotal}</div>
          <button class="remove-btn" onclick="removeCartItem(${product.id})">✕</button>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = itemsHTML;

    document.getElementById("cartSummary").innerHTML = `
      <div class="summary-row"><span>Total Items:</span><span>${totalItems}</span></div>
      <div class="summary-row"><span>Subtotal:</span><span>Rs. ${subtotal}</span></div>
      <div class="summary-row total-row"><span>Total:</span><span>Rs. ${subtotal}</span></div>
      <a href="checkout.html" class="btn-primary checkout-btn">Proceed to Checkout</a>
    `;
  }

  window.changeCartQty = function(productId, newQty) {
    updateQty(productId, newQty);
    renderCartPage();
  };

  window.removeCartItem = function(productId) {
    removeFromCart(productId);
    renderCartPage();
  };
});

/* ============================
   CHECKOUT PAGE LOGIC
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm");
  if (!checkoutForm) return;

  const cart = getCart();
  if (cart.length === 0) {
    const container = document.querySelector(".checkout-container");
    if (container) {
      container.innerHTML = `<p class="no-results">Your cart is empty. <a href="products.html">Shop now</a></p>`;
    }
  } else {
    renderOrderSummary();
  }

  function renderOrderSummary() {
    let subtotal = 0;
    let itemsHTML = "";

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;
      const finalPrice = getDiscountedPrice(product.price, product.discount);
      const lineTotal = finalPrice * item.qty;
      subtotal += lineTotal;

      itemsHTML += `
        <div class="summary-item">
          <span>${product.name} x${item.qty}</span>
          <span>Rs. ${lineTotal}</span>
        </div>
      `;
    });

    document.getElementById("orderSummary").innerHTML = `
      <h3>Order Summary</h3>
      ${itemsHTML}
      <div class="summary-row total-row">
        <span>Total Amount:</span><span>Rs. ${subtotal}</span>
      </div>
    `;
  }

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const orderData = {
      orderNumber: "ORD" + Math.floor(100000 + Math.random() * 900000),
      name: document.getElementById("custName").value,
      email: document.getElementById("custEmail").value,
      phone: document.getElementById("custPhone").value,
      address: document.getElementById("custAddress").value,
      city: document.getElementById("custCity").value,
      postal: document.getElementById("custPostal").value,
      payment: document.getElementById("paymentMethod").value,
      items: cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const finalPrice = getDiscountedPrice(product.price, product.discount);
        return { name: product.name, qty: item.qty, total: finalPrice * item.qty };
      }),
      total: cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + getDiscountedPrice(product.price, product.discount) * item.qty;
      }, 0)
    };

    localStorage.setItem("lastOrder", JSON.stringify(orderData));
    localStorage.removeItem("cart");
    window.location.href = "order-confirmation.html";
  });
});
