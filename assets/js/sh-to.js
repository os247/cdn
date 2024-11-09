document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const categoryDropdown = document.getElementById("category-dropdown");
    const searchResultsContainer = document.getElementById("search-results");
    const orderModal = document.getElementById("order-modal");
    const accessCodeInput = document.getElementById("access-code-input");

    let ordersData = [];
    let productData = [];

    // Fetch and preload orders JSON
    fetch("assets/json/orders.json")
        .then(response => response.json())
        .then(data => {
            ordersData = data;
        });

    // Fetch and preload CSV files
    const csvFiles = [
        "assets/csv/shop.csv", "assets/csv/mens.csv", "assets/csv/womens.csv",
        "assets/csv/kids.csv", "assets/csv/bags.csv", "assets/csv/shoes.csv",
        "assets/csv/groceries.csv", "assets/csv/accessories.csv"
    ];

    csvFiles.forEach(file => {
        fetch(file)
            .then(response => response.text())
            .then(csvText => {
                // Parse and load each CSV file into productData
                const rows = csvText.split("\n").map(row => row.split(","));
                rows.forEach(([code, name, price, image]) => {
                    productData.push({ code, name, price, image });
                });
            });
    });

    // Search functionality
    searchInput.addEventListener("input", handleSearch);

    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        const category = categoryDropdown.value;
        const results = [];

        // Filter products based on search query and category
        if (category !== "orders") {
            productData.forEach(product => {
                if (product.name.toLowerCase().includes(query) &&
                    (category === "all" || product.category === category)) {
                    results.push(createProductPreview(product));
                }
            });
        }

        // Filter orders based on search query
        if (category === "all" || category === "orders") {
            ordersData.forEach(order => {
                if (order.orderID.includes(query)) {
                    results.push(createOrderPreview(order));
                }
            });
        }

        renderSearchResults(results);
    }

    function createProductPreview(product) {
        const item = document.createElement("div");
        item.classList.add("overlay-item");
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="info">
                <p>${product.name} - BDT ${product.price}</p>
                <button onclick="viewProduct('${product.code}')">View</button>
            </div>
        `;
        return item;
    }

    function createOrderPreview(order) {
        const item = document.createElement("div");
        item.classList.add("overlay-item");
        item.innerHTML = `
            <div class="info">
                <p>Order ID: ${order.orderID}</p>
                <button onclick="viewOrder('${order.orderID}')">View</button>
            </div>
        `;
        return item;
    }

    function renderSearchResults(results) {
        searchResultsContainer.innerHTML = "";
        results.forEach(result => {
            searchResultsContainer.appendChild(result);
        });
    }

    window.viewProduct = function (code) {
        window.location.href = `product.php?code=${code}`;
    };

    window.viewOrder = function (orderID) {
        accessCodeInput.value = "";
        document.getElementById("order-info").style.display = "none";
        orderModal.style.display = "flex";
        orderModal.setAttribute("data-order-id", orderID);
    };

    window.verifyAccessCode = function () {
        const orderID = orderModal.getAttribute("data-order-id");
        const accessCode = accessCodeInput.value;
        const order = ordersData.find(o => o.orderID === orderID && o.accessCode === accessCode);

        if (order) {
            displayOrderInfo(order);
        } else {
            alert("Invalid access code.");
        }
    };

    function displayOrderInfo(order) {
        document.getElementById("order-info").style.display = "block";
        document.getElementById("user-name").textContent = order.user.name;
        document.getElementById("user-phone").textContent = order.user.phone;
        document.getElementById("user-email").textContent = order.user.email;
        document.getElementById("user-address").textContent = order.user.address;

        const productList = document.getElementById("product-list");
        productList.innerHTML = "";
        order.products.forEach(product => {
            const productItem = document.createElement("p");
            productItem.textContent = `${product.name} - BDT ${product.price} x ${product.quantity}`;
            productList.appendChild(productItem);
        });
    }

    window.closeModal = function () {
        orderModal.style.display = "none";
    };

    window.editOrder = function () {
        alert("Editing functionality will be implemented here.");
    };
});
