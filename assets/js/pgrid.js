document.addEventListener("DOMContentLoaded", () => {
    // Get the page type from URL (e.g., 'index' for index.php, 'mens' for mens.php, etc.)
    const pageType = window.location.pathname.split('/').pop().split('.')[0];
    
    // Map each page to its corresponding CSV file in the assets/csv folder
    const csvFiles = {
        'index': 'assets/csv/shop.csv',
        'mens': 'assets/csv/mens.csv',
        'womens': 'assets/csv/womens.csv',
        'kids': 'assets/csv/kids.csv',
        'bags': 'assets/csv/bags.csv',
        'shoes': 'assets/csv/shoes.csv',
        'groceries': 'assets/csv/groceries.csv',
        'accessories': 'assets/csv/accessories.csv'
    };

    // Determine which CSV file to load based on the page type, default to shop.csv
    const csvFile = csvFiles[pageType] || 'assets/csv/shop.csv';
    fetchProducts(csvFile);

    // Add event listeners for price range filtering and sorting
    document.getElementById("min-price").addEventListener("input", filterProducts);
    document.getElementById("max-price").addEventListener("input", filterProducts);
    document.getElementById("price-filter").addEventListener("change", sortProducts);
});

let allProducts = []; // Store all products for filtering

// Fetch and display products from the specified CSV file
async function fetchProducts(csvFile) {
    try {
        const response = await fetch(csvFile);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const csvText = await response.text();
        allProducts = parseCSV(csvText); // Store parsed products for filtering
        displayProducts(allProducts); // Display products initially
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Parse CSV content and create an array of product objects
function parseCSV(csvText) {
    const rows = csvText.trim().split("\n").slice(1); // Remove header
    return rows.map(row => {
        const [image, name, code, buyPrice, sellPrice, coupon, discountPrice, brand, size, color, material, stock, description] = row.split(",");
        return {
            image,
            name,
            code,
            buyPrice: parseFloat(buyPrice),
            sellPrice: parseFloat(sellPrice),
            coupon,
            discountPrice,
            brand,
            size,
            color,
            material,
            stock,
            description
        };
    });
}

// Display products in the product grid
function displayProducts(products) {
    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = ""; // Clear grid before adding products

    if (products.length === 0) {
        productGrid.innerHTML = "<p>No products available.</p>";
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Price: BDT ${product.sellPrice.toFixed(2)}</p>
                <div class="product-actions">
                    <button onclick="addToCart('${product.code}', '${product.name}', ${product.sellPrice}, '${product.image}')">Add to Cart</button>
                    <button onclick="viewProduct('${product.code}')">View</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    updateCartDisplay(); // Update cart display after displaying products
}

// Filter products based on price range
function filterProducts() {
    const minPrice = parseFloat(document.getElementById("min-price").value) || 0;
    const maxPrice = parseFloat(document.getElementById("max-price").value) || Infinity;

    const filteredProducts = allProducts.filter(product => {
        return product.sellPrice >= minPrice && product.sellPrice <= maxPrice;
    });

    displayProducts(filteredProducts);
}

// Sort products based on selected criteria
function sortProducts() {
    const filterValue = document.getElementById("price-filter").value;
    const products = Array.from(document.getElementById("product-grid").children);

    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector(".product-info p").textContent.split("BDT ")[1]);
        const priceB = parseFloat(b.querySelector(".product-info p").textContent.split("BDT ")[1]);

        if (filterValue === "low-to-high") return priceA - priceB;
        if (filterValue === "high-to-low") return priceB - priceA;
        return 0; // Default order
    });

    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = ""; // Clear existing products
    products.forEach(product => productGrid.appendChild(product)); // Re-append sorted products
}

// Add a product to the cart and save it in session storage
function addToCart(code, name, price, image) {
    let cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
    const existingItem = cartItems.find(item => item.code === code);

    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item exists
    } else {
        cartItems.push({ code, name, price: parseFloat(price), image, quantity: 1 }); // Add new item
    }

    sessionStorage.setItem("cart", JSON.stringify(cartItems)); // Save to session storage
    updateCartDisplay(); // Update cart display in real time
    alert(`${name} has been added to your cart!`);
}

// Redirect to product details page
function viewProduct(code) {
    window.location.href = `product.php?code=${code}`;
}

// Update cart display in real time
function updateCartDisplay() {
    const cartSidebar = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    let cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
    cartSidebar.innerHTML = ""; // Clear current items
    let total = 0;

    cartItems.forEach(item => {
        total += item.price * item.quantity; // Calculate total price
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50">
            <span>${item.name} (x${item.quantity}) - BDT ${item.price.toFixed(2)}</span>
            <button class="remove-item" data-code="${item.code}">Remove</button>
        `;
        cartSidebar.appendChild(itemElement);
    });

    cartTotal.textContent = total.toFixed(2); // Update total
    cartCount.textContent = cartItems.length; // Update cart count
}

// Remove an item from the cart
function removeFromCart(code) {
    let cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
    cartItems = cartItems.filter(item => item.code !== code);
    sessionStorage.setItem("cart", JSON.stringify(cartItems)); // Update session storage
    updateCartDisplay(); // Refresh display
}

// Redirect to checkout page
function checkout() {
    window.location.href = "checkout.php"; // Redirect to checkout page
}
