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
   NAVBAR — Mobile Menu + Search
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

  // Render featured products on home page
  const featuredContainer = document.getElementById("featuredProducts");
  if (featuredContainer) {
    const featured = products.slice(0, 8);
    featuredContainer.innerHTML = featured.map(createProductCard).join("");
  }

  // Newsletter form (home page)
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Subscribed successfully!");
      newsletterForm.reset();
    });
  }
});/* ============================
   PRODUCTS PAGE LOGIC
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return; // only run on products.html

  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("productSearch");
  const resultsCount = document.getElementById("resultsCount");

  // Populate category dropdown dynamically
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Check URL for search query (coming from navbar search)
  const urlParams = new URLSearchParams(window.location.search);
  const urlSearch = urlParams.get("search");
  if (urlSearch) searchInput.value = urlSearch;

  function renderProducts() {
    let filtered = [...products];

    // Search filter
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    // Category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Price filter
    const selectedPrice = priceFilter.value;
    if (selectedPrice !== "all") {
      const [min, max] = selectedPrice.split("-").map(Number);
      filtered = filtered.filter(p => {
        const finalPrice = getDiscountedPrice(p.price, p.discount);
        return finalPrice >= min && (max ? finalPrice <= max : true);
      });
    }

    // Sorting
    const sortValue = sortSelect.value;
    if (sortValue === "low-high") {
      filtered.sort((a, b) => getDiscountedPrice(a.price, a.discount) - getDiscountedPrice(b.price, b.discount));
    } else if (sortValue === "high-low") {
      filtered.sort((a, b) => getDiscountedPrice(b.price, b.discount) - getDiscountedPrice(a.price, a.discount));
    }

    // Render
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
