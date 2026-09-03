const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 4999,
    discount: 20,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    rating: 4.5,
    description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
    stock: 25
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    category: "Electronics",
    price: 8999,
    discount: 15,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    rating: 4.7,
    description: "Track your fitness, heart rate, and notifications with this sleek smart watch. Water resistant up to 50m.",
    stock: 18
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 2999,
    discount: 10,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    rating: 4.3,
    description: "Compact speaker with powerful bass, 12-hour playtime, and splash-proof design for outdoor use.",
    stock: 40
  },
  {
    id: 4,
    name: "Men's Casual Denim Jacket",
    category: "Fashion",
    price: 3499,
    discount: 25,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
    rating: 4.2,
    description: "Classic denim jacket made from premium cotton, perfect for all seasons. Available in multiple sizes.",
    stock: 30
  },
  {
    id: 5,
    name: "Women's Summer Floral Dress",
    category: "Fashion",
    price: 2799,
    discount: 30,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
    rating: 4.6,
    description: "Lightweight floral dress ideal for summer outings. Breathable fabric with a flattering fit.",
    stock: 22
  },
  {
    id: 6,
    name: "Unisex Hoodie",
    category: "Fashion",
    price: 1999,
    discount: 10,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    rating: 4.4,
    description: "Soft fleece hoodie with front pocket, perfect for casual wear or light workouts.",
    stock: 50
  },
  {
    id: 7,
    name: "Men's Running Shoes",
    category: "Shoes",
    price: 4499,
    discount: 20,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    rating: 4.6,
    description: "Lightweight running shoes with cushioned soles for maximum comfort during workouts.",
    stock: 35
  },
  {
    id: 8,
    name: "Women's Sneakers",
    category: "Shoes",
    price: 3999,
    discount: 15,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80",
    rating: 4.5,
    description: "Stylish and comfortable sneakers suitable for daily wear, gym, or casual outings.",
    stock: 28
  },
  {
    id: 9,
    name: "Leather Formal Shoes",
    category: "Shoes",
    price: 5999,
    discount: 10,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80",
    rating: 4.3,
    description: "Genuine leather formal shoes, perfect for office wear and formal occasions.",
    stock: 15
  },
  {
    id: 10,
    name: "Classic Leather Wallet",
    category: "Accessories",
    price: 1499,
    discount: 20,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
    rating: 4.4,
    description: "Slim genuine leather wallet with multiple card slots and coin pocket.",
    stock: 45
  },
  {
    id: 11,
    name: "Aviator Sunglasses",
    category: "Accessories",
    price: 1899,
    discount: 25,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    rating: 4.5,
    description: "UV-protected aviator sunglasses with a timeless design, suitable for all face shapes.",
    stock: 38
  },
  {
    id: 12,
    name: "Stainless Steel Watch",
    category: "Accessories",
    price: 6499,
    discount: 15,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80",
    rating: 4.6,
    description: "Elegant stainless steel wristwatch with water resistance and a scratch-proof glass face.",
    stock: 20
  },
  {
    id: 13,
    name: "Ceramic Dinner Set (16 pcs)",
    category: "Home & Living",
    price: 5499,
    discount: 20,
    image: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c66?w=500&q=80",
    rating: 4.7,
    description: "Elegant 16-piece ceramic dinner set, microwave and dishwasher safe.",
    stock: 12
  },
  {
    id: 14,
    name: "Scented Candle Set",
    category: "Home & Living",
    price: 1299,
    discount: 10,
    image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=500&q=80",
    rating: 4.3,
    description: "Set of 3 scented candles with relaxing aromas, perfect for home decor and relaxation.",
    stock: 60
  },
  {
    id: 15,
    name: "Cotton Bedsheet Set",
    category: "Home & Living",
    price: 2499,
    discount: 15,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80",
    rating: 4.5,
    description: "Premium cotton bedsheet set with 2 pillow covers, soft and breathable for a comfortable sleep.",
    stock: 33
  }
];
