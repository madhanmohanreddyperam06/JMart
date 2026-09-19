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

// Category visual backdrops and icons
function getCategoryVisual(categoryName, productName) {
    const cat = (categoryName || '').toLowerCase();
    const name = (productName || '').toLowerCase();

    if (cat.includes('mobile') || cat.includes('phone') || name.includes('phone') || name.includes('iphone') || name.includes('galaxy') || name.includes('pixel')) {
        return { icon: '<i class="fa-solid fa-mobile-screen-button"></i>', bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', label: 'Mobile' };
    }
    if (cat.includes('elect') || cat.includes('laptop') || name.includes('laptop') || name.includes('macbook') || name.includes('dell') || name.includes('hp') || name.includes('tv')) {
        return { icon: '<i class="fa-solid fa-laptop"></i>', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', label: 'Electronics' };
    }
    if (cat.includes('fash') || cat.includes('cloth') || cat.includes('wear') || name.includes('shirt') || name.includes('shoe') || name.includes('pant') || name.includes('dress')) {
        return { icon: '<i class="fa-solid fa-shirt"></i>', bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', label: 'Fashion' };
    }
    if (cat.includes('beauty') || cat.includes('cosmet') || name.includes('perfume') || name.includes('lotion') || name.includes('cream')) {
        return { icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>', bg: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)', label: 'Beauty' };
    }
    if (cat.includes('home') || cat.includes('furnit') || cat.includes('living') || name.includes('chair') || name.includes('table') || name.includes('bed')) {
        return { icon: '<i class="fa-solid fa-house"></i>', bg: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', label: 'Home & Living' };
    }
    if (cat.includes('book') || name.includes('guide') || name.includes('book') || name.includes('novel')) {
        return { icon: '<i class="fa-solid fa-book"></i>', bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', label: 'Books' };
    }
    if (cat.includes('sport') || cat.includes('fitness') || name.includes('ball') || name.includes('gym') || name.includes('cycle')) {
        return { icon: '<i class="fa-solid fa-futbol"></i>', bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', label: 'Sports & Fitness' };
    }
    if (cat.includes('toy') || cat.includes('baby') || cat.includes('kid')) {
        return { icon: '<i class="fa-solid fa-puzzle-piece"></i>', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', label: 'Toys & Kids' };
    }
    if (cat.includes('food') || cat.includes('grocery') || cat.includes('snack')) {
        return { icon: '<i class="fa-solid fa-burger"></i>', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', label: 'Food & Grocery' };
    }
    if (cat.includes('auto') || cat.includes('2 wheel') || cat.includes('motor') || cat.includes('car')) {
        return { icon: '<i class="fa-solid fa-motorcycle"></i>', bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', label: 'Automotive' };
    }
    return { icon: '<i class="fa-solid fa-tag"></i>', bg: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)', label: categoryName || 'Quality Assured' };
}

// Deterministic realistic metrics (ratings, MRP, review counts)
function getProductMetrics(product) {
    const id = Number(product.id) || 1;
    const discountPercent = 15 + ((id * 7) % 25);
    const mrp = Math.round(Number(product.price) / (1 - (discountPercent / 100)));
    const ratingNum = (4.0 + (((id * 13) % 9) / 10)).toFixed(1);
    const reviewCount = (120 + ((id * 317) % 4800)).toLocaleString();
    return { discountPercent, mrp, rating: ratingNum, reviewCount };
}

    function renderProductDetails(product) {
        if (!product) {
            showEmpty(productContainer, 'Product not found', 'The product you are looking for does not exist');
            return;
        }

        const metrics = getProductMetrics(product);
        const visual = getCategoryVisual(product.categoryName, product.name);
        const isOutOfStock = product.quantity === 0;
        const isLowStock = product.quantity > 0 && product.quantity < 5;
        const savings = Math.max(0, metrics.mrp - Number(product.price));

        let stockBadgeHtml = '';
        if (isOutOfStock) {
            stockBadgeHtml = `<span style="color: #dc2626; font-weight: 700; font-size: 0.85rem;">Currently Out of Stock</span>`;
        } else if (isLowStock) {
            stockBadgeHtml = `<span style="color: #ea580c; font-weight: 700; font-size: 0.85rem;"><i class="fa-solid fa-bolt"></i> Only ${escapeHtml(product.quantity)} left in stock - Order Soon</span>`;
        } else {
            stockBadgeHtml = `<span style="color: #16a34a; font-weight: 700; font-size: 0.85rem;"><i class="fa-solid fa-check"></i> In Stock (${escapeHtml(product.quantity)} units available)</span>`;
        }

        const detailsHTML = `
            <div class="breadcrumb-nav">
                <a href="index.html">Home</a>
                <span class="breadcrumb-separator">/</span>
                <a href="index.html">${escapeHtml(product.categoryName || 'Products')}</a>
                <span class="breadcrumb-separator">/</span>
                <span>${escapeHtml(product.name)}</span>
            </div>

            <div class="product-details-container">
                <!-- Left Column: Visual Showcase & Trust Badges -->
                <div class="product-details-image-card">
                    <div class="product-deal-badge ${metrics.discountPercent > 30 ? 'badge-special' : ''}">
                        ${metrics.discountPercent}% OFF
                    </div>

                    <div class="product-visual-backdrop" style="background: ${visual.bg}; border-radius: 8px; width: 100%; min-height: 280px;">
                        <span class="product-visual-icon" style="font-size: 4.5rem;">${visual.icon}</span>
                        <span class="product-visual-category" style="font-size: 0.82rem; padding: 4px 12px;">${escapeHtml(product.categoryName || visual.label)}</span>
                    </div>

                    <div class="trust-badges-grid" style="width: 100%; margin-top: 1.25rem;">
                        <div class="trust-badge-item">
                            <span class="trust-badge-icon"><i class="fa-solid fa-truck-fast"></i></span>
                            <span class="trust-badge-label">Free Delivery</span>
                        </div>
                        <div class="trust-badge-item">
                            <span class="trust-badge-icon"><i class="fa-solid fa-rotate-left"></i></span>
                            <span class="trust-badge-label">7-Day Return</span>
                        </div>
                        <div class="trust-badge-item">
                            <span class="trust-badge-icon"><i class="fa-solid fa-shield-halved"></i></span>
                            <span class="trust-badge-label">1-Yr Warranty</span>
                        </div>
                        <div class="trust-badge-item">
                            <span class="trust-badge-icon"><i class="fa-solid fa-credit-card"></i></span>
                            <span class="trust-badge-label">COD Available</span>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Product Info, Price, Actions -->
                <div class="product-details-info-card">
                    <div class="product-details-brand-tag">${escapeHtml(product.brand || product.categoryName || 'JMART')}</div>
                    <h1 class="product-details-title">${escapeHtml(product.name)}</h1>

                    <div class="product-details-rating-bar">
                        <span class="rating-pill" style="font-size: 0.85rem; padding: 3px 8px;">
                            ${metrics.rating} <span class="rating-star"><i class="fa-solid fa-star"></i></span>
                        </span>
                        <span class="review-count" style="font-size: 0.85rem;">${metrics.reviewCount} Ratings & Reviews</span>
                        <span class="assured-badge" style="font-size: 0.75rem; padding: 3px 8px;"><i class="fa-solid fa-shield-halved"></i> Assured</span>
                    </div>

                    <div class="product-details-price-section">
                        <div class="product-details-pricing">
                            <span class="details-selling-price">${formatCurrency(product.price)}</span>
                            <span class="details-mrp-price">${formatCurrency(metrics.mrp)}</span>
                            <span class="details-discount-badge">${metrics.discountPercent}% off</span>
                        </div>
                        <div class="details-savings-text">
                            You save ${formatCurrency(savings)} (${metrics.discountPercent}%)
                        </div>
                        <div class="details-tax-tag">Inclusive of all taxes</div>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <strong>Availability:</strong> ${stockBadgeHtml}
                    </div>

                    <div class="product-details-description">
                        <h4 style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: 0.4rem;">Product Overview</h4>
                        ${escapeHtml(product.description || 'Experience premium quality with this officially certified product, backed by genuine brand warranty and dedicated customer service.')}
                    </div>

                    <div class="product-details-actions">
                        <div class="quantity-selector">
                            <label for="quantity">Quantity:</label>
                            <div class="quantity-controls">
                                <button class="quantity-btn" id="decreaseQty" ${product.quantity <= 1 ? 'disabled' : ''}>-</button>
                                <input type="number" id="quantity" name="quantity" value="1" min="1" max="${escapeHtml(product.quantity)}" readonly>
                                <button class="quantity-btn" id="increaseQty" ${product.quantity <= 1 ? 'disabled' : ''}>+</button>
                            </div>
                        </div>

                        <div class="details-cta-buttons">
                            <button class="btn-details-cart" id="addToCartBtn" ${isOutOfStock ? 'disabled' : ''}>
                                ${isOutOfStock ? 'Out of Stock' : '<i class="fa-solid fa-cart-shopping"></i> Add to Cart'}
                            </button>
                            <button class="btn-details-buy" id="buyNowBtn" ${isOutOfStock ? 'disabled' : ''}>
                                <i class="fa-solid fa-bolt"></i> Buy Now
                            </button>
                        </div>

                        <button class="btn btn-secondary" onclick="window.location.href='index.html'" style="margin-top: 0.5rem; background: #f8fafc; color: #475569; border: 1px solid #cbd5e1;">
                            ← Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        `;

        productContainer.innerHTML = detailsHTML;

        // Event listeners for quantity controls
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantityInput = document.getElementById('quantity');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const buyNowBtn = document.getElementById('buyNowBtn');

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

        // Add to Cart
        if (addToCartBtn && !isOutOfStock) {
            addToCartBtn.addEventListener('click', () => handleAddToCart(product.id, parseInt(quantityInput.value, 10), false));
        }

        // Buy Now (Adds to cart and redirects to cart)
        if (buyNowBtn && !isOutOfStock) {
            buyNowBtn.addEventListener('click', () => handleAddToCart(product.id, parseInt(quantityInput.value, 10), true));
        }
    }

    async function handleAddToCart(productId, quantity, isBuyNow) {
        if (!isLoggedIn()) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return;
        }

        if (!isCustomer()) {
            showMessage('Shopping cart is available for customers only', 'warning');
            return;
        }

        const btn = isBuyNow ? document.getElementById('buyNowBtn') : document.getElementById('addToCartBtn');
        const originalText = btn ? btn.innerHTML : '';

        if (btn) {
            btn.disabled = true;
            btn.textContent = isBuyNow ? 'Processing...' : 'Adding...';
        }

        try {
            await API.cart.addItem({ productId, quantity });
            showMessage(isBuyNow ? 'Proceeding to checkout...' : 'Product added to cart successfully', 'success');
            updateCartCount();

            if (isBuyNow) {
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 600);
            } else if (btn) {
                btn.textContent = 'Added ✓';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }, 1400);
            }
        } catch (error) {
            handleApiError(error);
            showMessage('Failed to add product to cart', 'error');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        }
    }

    function getStockStatus(quantity) {
        if (quantity === 0) return 'Out of Stock';
        if (quantity < 5) return 'Low Stock';
        return 'In Stock';
    }
});
