document.addEventListener("DOMContentLoaded", function () {
    const cartIcon = document.getElementById("cart-icon");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCartButton = document.getElementById("close-cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-button");
    const cartDataInput = document.getElementById("cart-data"); // Hidden field for cart data on checkout page
    const orderOverviewContainer = document.getElementById("order-overview"); // Container for order overview on checkout

    let cartItems = JSON.parse(sessionStorage.getItem("cart")) || []; // Load existing cart items

    // Function to update cart display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ""; // Clear current items
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>"; // Show empty cart message
        } else {
            cartItems.forEach(item => {
                total += item.price * item.quantity; // Calculate total price
                const itemElement = document.createElement("div");
                itemElement.className = "cart-item";
                
                // Using iframe for image loading to handle potential CORS issues
                const iframeElement = document.createElement("iframe");
                iframeElement.className = "cart-item-image";
                iframeElement.srcdoc = `<style>body{margin:0;padding:0;}</style><img src="${item.image}" alt="${item.name}" width="50">`;
                iframeElement.width = 50;
                iframeElement.height = 50;
                iframeElement.style.border = "none";

                itemElement.innerHTML = `
                    <span>${item.name} (x${item.quantity}) - BDT ${item.price.toFixed(2)}</span>
                    <button class="remove-item" data-code="${item.code}">Remove</button>
                    <button class="increase-item" data-code="${item.code}">+</button>
                    <button class="decrease-item" data-code="${item.code}">-</button>
                `;
                itemElement.prepend(iframeElement); // Prepend iframe before item details
                cartItemsContainer.appendChild(itemElement);
            });
        }

        cartTotal.textContent = `BDT ${total.toFixed(2)}`; // Update total
        cartCount.textContent = cartItems.length; // Update cart count

        // Update the cart data input field on the checkout page if it exists
        if (cartDataInput) {
            cartDataInput.value = JSON.stringify(cartItems); // Set hidden input value for checkout
        }

        // Render order overview on checkout page
        if (orderOverviewContainer) {
            renderOrderOverview(cartItems, total);
        }
    }

    // Function to render the order overview on the checkout page
    function renderOrderOverview(items, total) {
        orderOverviewContainer.innerHTML = ""; // Clear existing items

        if (items.length === 0) {
            orderOverviewContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            items.forEach(item => {
                const itemElement = document.createElement("div");
                itemElement.className = "order-item";

                // Using iframe for order overview image
                const iframeElement = document.createElement("iframe");
                iframeElement.className = "order-item-image";
                iframeElement.srcdoc = `<style>body{margin:0;padding:0;}</style><img src="${item.image}" alt="${item.name}" width="50">`;
                iframeElement.width = 50;
                iframeElement.height = 50;
                iframeElement.style.border = "none";

                itemElement.innerHTML = `
                    <span>${item.name} (x${item.quantity}) - BDT ${item.price.toFixed(2)}</span>
                `;
                itemElement.prepend(iframeElement); // Prepend iframe before item details
                orderOverviewContainer.appendChild(itemElement);
            });

            const totalElement = document.createElement("div");
            totalElement.className = "order-total";
            totalElement.innerHTML = `<strong>Total: BDT ${total.toFixed(2)}</strong>`;
            orderOverviewContainer.appendChild(totalElement);
        }
    }

    // Function to open the cart sidebar
    cartIcon.addEventListener("click", () => {
        cartSidebar.setAttribute("aria-hidden", "false");
        updateCartDisplay(); // Update display when cart is opened
    });

    // Function to close the cart sidebar
    closeCartButton.addEventListener("click", () => {
        cartSidebar.setAttribute("aria-hidden", "true");
    });

    // Function to handle cart item events
    cartItemsContainer.addEventListener("click", (event) => {
        const code = event.target.dataset.code; // Get the product code from the data attribute

        // Remove item from cart
        if (event.target.classList.contains("remove-item")) {
            cartItems = cartItems.filter(item => item.code !== code);
            sessionStorage.setItem("cart", JSON.stringify(cartItems)); // Update session storage
            updateCartDisplay(); // Refresh display
        }

        // Increase item quantity
        if (event.target.classList.contains("increase-item")) {
            const item = cartItems.find(item => item.code === code);
            if (item) {
                item.quantity += 1; // Increase quantity
                sessionStorage.setItem("cart", JSON.stringify(cartItems)); // Update session storage
                updateCartDisplay(); // Refresh display
            }
        }

        // Decrease item quantity
        if (event.target.classList.contains("decrease-item")) {
            const item = cartItems.find(item => item.code === code);
            if (item) {
                item.quantity -= 1; // Decrease quantity
                if (item.quantity <= 0) {
                    cartItems = cartItems.filter(item => item.code !== code); // Remove item if quantity is 0
                }
                sessionStorage.setItem("cart", JSON.stringify(cartItems)); // Update session storage
                updateCartDisplay(); // Refresh display
            }
        }
    });

    // Function to proceed to checkout
    checkoutButton.addEventListener("click", () => {
        if (cartItems.length > 0) {
            window.location.href = "checkout.php"; // Redirect to checkout page
        } else {
            alert("Your cart is empty. Please add items to the cart before proceeding to checkout.");
        }
    });

    // Clear cart data after order is submitted on the checkout page
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function () {
            sessionStorage.removeItem("cart"); // Clear cart after order submission
        });
    }

    // Initialize cart display on page load
    updateCartDisplay(); // Display cart items on load
});
