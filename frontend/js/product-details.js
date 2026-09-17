// Product Details Page JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    const productContainer = document.getElementById('productContainer');
    const errorElement = document.getElementById('productError');

    // Get product ID from URL
    const productId = getUrlParameter('id');

    if (!productId) {
        showError(productContainer, 'Product ID is required');
        errorElement.textContent = 'Invalid product ID';
        errorElement.classList.remove('hidden');
        return;
    }

    // Validate product ID
    const numericId = parseInt(productId, 10);
    if (isNaN(numericId) || numericId <= 0) {
        showError(productContainer, 'Invalid product ID');
        errorElement.textContent = 'Invalid product ID';
        errorElement.classList.remove('hidden');
        return;
    }

    await loadProductDetails(numericId);

    async function loadProductDetails(id) {
        showLoading(productContainer, 'Loading product details...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const product = await API.products.getById(id);
            renderProductDetails(product);
        } catch (error) {
            handleApiError(error, errorElement);
            showError(productContainer, 'Unable to load product details', () => loadProductDetails(id));
        }
    }

    function renderProductDetails(product) {
        if (!product) {
            showEmpty(productContainer, 'Product not found', 'The product you are looking for does not exist');
            return;
        }

        const stockStatus = getStockStatus(product.quantity);
        const stockClass = stockStatus.toLowerCase().replace(' ', '-');

        const detailsHTML = `
            <div class="product-details-container">
                <div class="product-details-image">
                    <div class="product-details-image-placeholder">📦</div>
                </div>
                <div class="product-details-info">
                    <h1>${product.name}</h1>
                    <div class="product-details-brand">${product.brand || 'Unknown Brand'}</div>
                    <div class="product-details-category">${product.categoryName || 'Uncategorized'}</div>
                    <div class="product-details-price">${formatCurrency(product.price)}</div>
                    <div class="product-details-description">
                        ${product.description || 'No description available for this product.'}
                    </div>
                    <div class="product-details-stock ${stockClass}">
                        <strong>Availability:</strong> ${stockStatus} (${product.quantity} units available)
                    </div>
                    <div class="product-details-actions">
                        <div class="quantity-selector">
                            <label for="quantity">Quantity:</label>
                            <div class="quantity-controls">
                                <button class="quantity-btn" id="decreaseQty" ${product.quantity <= 1 ? 'disabled' : ''}>-</button>
                                <input type="number" id="quantity" name="quantity" value="1" min="1" max="${product.quantity}" readonly>
                                <button class="quantity-btn" id="increaseQty" ${product.quantity <= 1 ? 'disabled' : ''}>+</button>
                            </div>
                        </div>
                        <button class="btn btn-primary" id="addToCartBtn" ${product.quantity === 0 ? 'disabled' : ''}>
                            ${product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.href='index.html'">
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        `;

        productContainer.innerHTML = detailsHTML;

        // Add event listeners for quantity controls
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantityInput = document.getElementById('quantity');
        const addToCartBtn = document.getElementById('addToCartBtn');

        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                const currentQty = parseInt(quantityInput.value, 10);
                if (currentQty > 1) {
                    quantityInput.value = currentQty - 1;
                    decreaseBtn.disabled = currentQty - 1 <= 1;
                }
            });

            increaseBtn.addEventListener('click', () => {
                const currentQty = parseInt(quantityInput.value, 10);
                if (currentQty < product.quantity) {
                    quantityInput.value = currentQty + 1;
                    decreaseBtn.disabled = false;
                }
            });
        }

        // Add event listener for Add to Cart button
        if (addToCartBtn && product.quantity > 0) {
            addToCartBtn.addEventListener('click', () => handleAddToCart(product.id, parseInt(quantityInput.value, 10)));
        }
    }

    async function handleAddToCart(productId, quantity) {
        // Check if user is authenticated
        if (!isLoggedIn()) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }

        // Check if user is customer (not admin)
        if (!isCustomer()) {
            showMessage('Shopping cart is available for customers only', 'warning');
            return;
        }

        const addToCartBtn = document.getElementById('addToCartBtn');
        const originalText = addToCartBtn.textContent;

        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Adding...';

        try {
            await API.cart.addItem({ productId, quantity });
            showMessage('Product added to cart successfully', 'success');
            updateCartCount();
        } catch (error) {
            handleApiError(error);
            showMessage('Failed to add product to cart', 'error');
        } finally {
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = originalText;
        }
    }

    function getStockStatus(quantity) {
        if (quantity === 0) return 'Out of Stock';
        if (quantity < 5) return 'Low Stock';
        return 'In Stock';
    }
});
