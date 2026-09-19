// Products Page JavaScript - Flipkart, Myntra & Amazon Benchmark

let allProducts = [];
let allCategories = [];
let currentFilteredProducts = [];
let currentSort = 'popularity';
let activeFilters = {
    search: '',
    categoryId: '',
    minPrice: null,
    maxPrice: null
};

// Check authentication state for cart count update
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function isCustomer() {
    return localStorage.getItem('role') === 'CUSTOMER';
}

// Update cart count function
async function updateCartCount() {
    try {
        const cart = await API.cart.getAll();
        const totalCount = cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
        updateCartCountDisplay(totalCount);
    } catch (error) {
        console.error('Failed to update cart count:', error);
    }
}

// Update cart count display function
function updateCartCountDisplay(count) {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const num = Number(count) || 0;
        cartBadge.textContent = num > 99 ? '99+' : num;
        if (num > 0) {
            cartBadge.style.display = 'inline-flex';
            cartBadge.classList.remove('visible');
            void cartBadge.offsetWidth; // Force DOM reflow for CSS bounce animation
            cartBadge.classList.add('visible');
        } else {
            cartBadge.style.display = 'none';
            cartBadge.classList.remove('visible');
        }
    }
}

// Wishlist helpers
function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem('jmart_wishlist')) || [];
    } catch (e) {
        return [];
    }
}

function toggleWishlist(productId, btnElement) {
    const wishlist = getWishlist();
    const idStr = String(productId);
    const index = wishlist.indexOf(idStr);
    let isAdded = false;

    if (index > -1) {
        wishlist.splice(index, 1);
        btnElement.classList.remove('active');
        btnElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
        btnElement.setAttribute('title', 'Add to Wishlist');
    } else {
        wishlist.push(idStr);
        btnElement.classList.add('active');
        btnElement.innerHTML = '<i class="fa-solid fa-heart" style="color: #ef4444;"></i>';
        btnElement.setAttribute('title', 'Remove from Wishlist');
        isAdded = true;
    }

    localStorage.setItem('jmart_wishlist', JSON.stringify(wishlist));
    if (typeof showMessage === 'function') {
        showMessage(isAdded ? 'Added to Wishlist' : 'Removed from Wishlist', 'info');
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
    const discountPercent = 15 + ((id * 7) % 25); // 15% to 39% discount
    const mrp = Math.round(Number(product.price) / (1 - (discountPercent / 100)));
    const ratingNum = (4.0 + (((id * 13) % 9) / 10)).toFixed(1);
    const reviewCount = (120 + ((id * 317) % 4800)).toLocaleString();
    return { discountPercent, mrp, rating: ratingNum, reviewCount };
}

// Quick Add to Cart from Card
async function handleQuickAddToCart(productId, btnElement) {
    if (!isLoggedIn()) {
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    if (!isCustomer()) {
        if (typeof showMessage === 'function') {
            showMessage('Shopping cart is available for customers only', 'warning');
        }
        return;
    }

    const originalHtml = btnElement.innerHTML;
    btnElement.disabled = true;
    btnElement.innerHTML = '<span>Adding...</span>';

    try {
        await API.cart.addItem({ productId, quantity: 1 });
        btnElement.innerHTML = '<span>Added ✓</span>';
        if (typeof showMessage === 'function') {
            showMessage('Product added to cart!', 'success');
        }
        updateCartCount();
        setTimeout(() => {
            btnElement.disabled = false;
            btnElement.innerHTML = originalHtml;
        }, 1400);
    } catch (error) {
        btnElement.disabled = false;
        btnElement.innerHTML = originalHtml;
        if (typeof handleApiError === 'function') {
            handleApiError(error);
        }
        if (typeof showMessage === 'function') {
            showMessage('Failed to add product to cart', 'error');
        }
    }
}

// Global function for viewing product details
function viewProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('productsContainer');
    const errorElement = document.getElementById('productsError');
    const productsCount = document.getElementById('productsCount');
    const activeFiltersContainer = document.getElementById('activeFiltersContainer');
    const categoryFilter = document.getElementById('categoryFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const applyFiltersButton = document.getElementById('applyFilters');
    const clearFiltersButton = document.getElementById('clearFilters');
    const sortBySelect = document.getElementById('sortBySelect');

    // Header elements
    const headerSearchInput = document.querySelector('.search-input');
    const headerSearchBtn = document.querySelector('.search-btn');
    const headerCategoryItems = document.querySelectorAll('.category-item');

    // Load initial categories and products
    await loadCategories();
    await loadProducts();

    // Update cart count if logged in
    if (isLoggedIn() && isCustomer()) {
        updateCartCount();
    }

    // Initialize user profile header
    initHeaderProfile();

    // Connect Filter Events
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyCatalogFilters);
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', resetAllFilters);
    }

    // Connect Sorting Event
    if (sortBySelect) {
        sortBySelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderSortedProducts();
        });
    }

    // Connect Header Search
    if (headerSearchInput) {
        headerSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchQuery(headerSearchInput.value.trim());
            }
        });
    }

    if (headerSearchBtn) {
        headerSearchBtn.addEventListener('click', () => {
            if (headerSearchInput) {
                handleSearchQuery(headerSearchInput.value.trim());
            }
        });
    }

    // Connect Header Category Items
    if (headerCategoryItems.length > 0) {
        headerCategoryItems.forEach(item => {
            item.addEventListener('click', () => {
                headerCategoryItems.forEach(btn => btn.classList.remove('active'));
                item.classList.add('active');

                const catName = item.querySelector('.category-name')?.textContent.trim();
                handleHeaderCategoryClick(catName);
            });
        });
    }

    async function loadCategories() {
        try {
            const categories = await API.categories.getAll();
            allCategories = categories || [];
            populateCategoryFilter(allCategories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    function populateCategoryFilter(categories) {
        if (!categoryFilter) return;
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }

    async function loadProducts() {
        showLoading(productsContainer, 'Loading products...');
        if (errorElement) {
            errorElement.innerHTML = '';
            errorElement.classList.add('hidden');
        }

        try {
            allProducts = await API.products.getAll();
            currentFilteredProducts = [...allProducts];
            renderSortedProducts();
        } catch (error) {
            if (errorElement) handleApiError(error, errorElement);
            showError(productsContainer, 'Unable to load products', () => loadProducts());
        }
    }

    function handleSearchQuery(searchTerm) {
        activeFilters.search = searchTerm;
        applyLocalFilters();

        // Smooth scroll to catalog toolbar
        const toolbar = document.querySelector('.catalog-toolbar');
        if (toolbar) {
            toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function handleHeaderCategoryClick(catName) {
        if (!catName || catName === 'For You') {
            activeFilters.categoryId = '';
            if (categoryFilter) categoryFilter.value = '';
            applyLocalFilters();
            return;
        }

        // Match category name against allCategories
        const normalized = catName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matched = allCategories.find(c => {
            const cNorm = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cNorm.includes(normalized) || normalized.includes(cNorm);
        });

        if (matched) {
            activeFilters.categoryId = String(matched.id);
            if (categoryFilter) categoryFilter.value = String(matched.id);
        } else {
            // Filter by name or clear
            activeFilters.categoryId = '';
            if (categoryFilter) categoryFilter.value = '';
        }

        applyLocalFilters();

        // Smooth scroll to catalog
        const toolbar = document.querySelector('.catalog-toolbar');
        if (toolbar) {
            toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function applyCatalogFilters() {
        const catId = categoryFilter ? categoryFilter.value : '';
        const minP = minPriceInput && minPriceInput.value.trim() !== '' ? parseFloat(minPriceInput.value.trim()) : null;
        const maxP = maxPriceInput && maxPriceInput.value.trim() !== '' ? parseFloat(maxPriceInput.value.trim()) : null;

        activeFilters.categoryId = catId;
        activeFilters.minPrice = minP;
        activeFilters.maxPrice = maxP;

        applyLocalFilters();
    }

    function applyLocalFilters() {
        let results = [...allProducts];

        // 1. Search filter
        if (activeFilters.search) {
            const q = activeFilters.search.toLowerCase();
            results = results.filter(p =>
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.brand && p.brand.toLowerCase().includes(q)) ||
                (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        // 2. Category filter
        if (activeFilters.categoryId) {
            results = results.filter(p => String(p.categoryId) === String(activeFilters.categoryId));
        }

        // 3. Price filter
        if (activeFilters.minPrice !== null && !isNaN(activeFilters.minPrice)) {
            results = results.filter(p => Number(p.price) >= activeFilters.minPrice);
        }
        if (activeFilters.maxPrice !== null && !isNaN(activeFilters.maxPrice)) {
            results = results.filter(p => Number(p.price) <= activeFilters.maxPrice);
        }

        currentFilteredProducts = results;
        renderSortedProducts();
        updateActiveFilterChips();
    }

    function updateActiveFilterChips() {
        if (!activeFiltersContainer) return;

        const chips = [];

        if (activeFilters.search) {
            chips.push({
                label: `Search: "${activeFilters.search}"`,
                remove: () => {
                    activeFilters.search = '';
                    if (headerSearchInput) headerSearchInput.value = '';
                    applyLocalFilters();
                }
            });
        }

        if (activeFilters.categoryId) {
            const cat = allCategories.find(c => String(c.id) === String(activeFilters.categoryId));
            chips.push({
                label: `Category: ${cat ? cat.name : activeFilters.categoryId}`,
                remove: () => {
                    activeFilters.categoryId = '';
                    if (categoryFilter) categoryFilter.value = '';
                    // Reset header category active state
                    headerCategoryItems.forEach(btn => btn.classList.remove('active'));
                    if (headerCategoryItems[0]) headerCategoryItems[0].classList.add('active');
                    applyLocalFilters();
                }
            });
        }

        if (activeFilters.minPrice !== null || activeFilters.maxPrice !== null) {
            const minStr = activeFilters.minPrice !== null ? `₹${activeFilters.minPrice}` : '₹0';
            const maxStr = activeFilters.maxPrice !== null ? `₹${activeFilters.maxPrice}` : 'Any';
            chips.push({
                label: `Price: ${minStr} - ${maxStr}`,
                remove: () => {
                    activeFilters.minPrice = null;
                    activeFilters.maxPrice = null;
                    if (minPriceInput) minPriceInput.value = '';
                    if (maxPriceInput) maxPriceInput.value = '';
                    applyLocalFilters();
                }
            });
        }

        if (chips.length === 0) {
            activeFiltersContainer.innerHTML = '';
            activeFiltersContainer.classList.add('hidden');
        } else {
            activeFiltersContainer.classList.remove('hidden');
            activeFiltersContainer.innerHTML = '';
            chips.forEach(chip => {
                const chipEl = document.createElement('span');
                chipEl.className = 'filter-chip';
                chipEl.innerHTML = `<span>${escapeHtml(chip.label)}</span><span class="filter-chip-remove" title="Remove filter">✕</span>`;
                chipEl.querySelector('.filter-chip-remove').addEventListener('click', chip.remove);
                activeFiltersContainer.appendChild(chipEl);
            });
        }
    }

    function renderSortedProducts() {
        let sorted = [...currentFilteredProducts];

        if (currentSort === 'price-asc') {
            sorted.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (currentSort === 'price-desc') {
            sorted.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (currentSort === 'rating') {
            sorted.sort((a, b) => {
                const rA = Number(getProductMetrics(a).rating);
                const rB = Number(getProductMetrics(b).rating);
                return rB - rA;
            });
        } else if (currentSort === 'name-asc') {
            sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else {
            // Popularity: default order
            sorted.sort((a, b) => Number(b.id) - Number(a.id));
        }

        renderProducts(sorted);
    }

    function renderProducts(products) {
        if (!products || products.length === 0) {
            showEmpty(productsContainer, 'No products found', 'Try adjusting your filters or search terms');
            return;
        }

        const productsGrid = document.createElement('div');
        productsGrid.className = 'products-grid';

        const wishlist = getWishlist();

        products.forEach(product => {
            const productCard = createProductCard(product, wishlist);
            productsGrid.appendChild(productCard);
        });

        productsContainer.innerHTML = '';
        productsContainer.appendChild(productsGrid);
    }

    function createProductCard(product, wishlist) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const isWishlisted = wishlist.includes(String(product.id));
        const metrics = getProductMetrics(product);
        const visual = getCategoryVisual(product.categoryName, product.name);
        const isOutOfStock = product.quantity === 0;
        const isLowStock = product.quantity > 0 && product.quantity < 5;

        // Visual Media Block
        const mediaHtml = `
            <div class="product-image-box" onclick="viewProductDetails(${encodeURIComponent(product.id)})">
                <div class="product-visual-backdrop" style="background: ${visual.bg};">
                    <span class="product-visual-icon">${visual.icon}</span>
                    <span class="product-visual-category">${escapeHtml(product.categoryName || visual.label)}</span>
                </div>
            </div>
        `;

        // Stock and Delivery indicator
        let stockHtml = '';
        if (isOutOfStock) {
            stockHtml = `<div class="product-stock-alert out-of-stock">Currently Out of Stock</div>`;
        } else if (isLowStock) {
            stockHtml = `<div class="product-stock-alert"><i class="fa-solid fa-bolt"></i> Only ${product.quantity} left in stock!</div>`;
        } else {
            stockHtml = `<div class="product-delivery-tag"><span><i class="fa-solid fa-bolt"></i> Free Delivery</span></div>`;
        }

        card.innerHTML = `
            <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                    onclick="event.stopPropagation(); toggleWishlist(${product.id}, this)">
                ${isWishlisted ? '<i class="fa-solid fa-heart" style="color: #ef4444;"></i>' : '<i class="fa-regular fa-heart"></i>'}
            </button>

            <div class="product-deal-badge ${metrics.discountPercent > 30 ? 'badge-special' : ''}">
                ${metrics.discountPercent}% OFF
            </div>

            ${mediaHtml}

            <div class="product-details">
                <div class="product-brand">${escapeHtml(product.brand || product.categoryName || 'JMART')}</div>
                <h3 class="product-name" onclick="viewProductDetails(${encodeURIComponent(product.id)})" title="${escapeHtml(product.name)}">
                    ${escapeHtml(product.name)}
                </h3>

                <div class="product-rating-row">
                    <span class="rating-pill">
                        ${metrics.rating} <span class="rating-star"><i class="fa-solid fa-star"></i></span>
                    </span>
                    <span class="review-count">(${metrics.reviewCount})</span>
                    <span class="assured-badge"><i class="fa-solid fa-shield-halved"></i> Assured</span>
                </div>

                <div class="product-price-row">
                    <span class="product-selling-price">${formatCurrency(product.price)}</span>
                    <span class="product-mrp-price">${formatCurrency(metrics.mrp)}</span>
                    <span class="product-discount-percent">${metrics.discountPercent}% off</span>
                </div>

                ${stockHtml}

                <div class="product-card-actions">
                    <button class="btn-card-details" onclick="viewProductDetails(${encodeURIComponent(product.id)})">
                        Details
                    </button>
                    <button class="btn-card-cart ${isOutOfStock ? 'disabled' : ''}" 
                            ${isOutOfStock ? 'disabled' : ''}
                            onclick="event.stopPropagation(); handleQuickAddToCart(${product.id}, this)">
                        ${isOutOfStock ? 'Out of Stock' : '<i class="fa-solid fa-cart-shopping"></i> Add'}
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    function resetAllFilters() {
        activeFilters = {
            search: '',
            categoryId: '',
            minPrice: null,
            maxPrice: null
        };

        if (headerSearchInput) headerSearchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        if (sortBySelect) sortBySelect.value = 'popularity';
        currentSort = 'popularity';

        headerCategoryItems.forEach(btn => btn.classList.remove('active'));
        if (headerCategoryItems[0]) headerCategoryItems[0].classList.add('active');

        if (errorElement) {
            errorElement.innerHTML = '';
            errorElement.classList.add('hidden');
        }

        currentFilteredProducts = [...allProducts];
        renderSortedProducts();
        updateActiveFilterChips();
    }

    function initHeaderProfile() {
        const headerProfileBtn = document.getElementById('headerProfileBtn');
        const headerUserName = document.getElementById('headerUserName');
        const userDropdownMenu = document.getElementById('userDropdownMenu');

        if (!headerProfileBtn) return;

        if (isLoggedIn()) {
            const user = getCurrentUser();
            if (headerUserName && user && user.name) {
                headerUserName.textContent = user.name;
            }
            headerProfileBtn.href = 'profile.html';
            headerProfileBtn.title = 'My Profile';

            if (isAdmin() && userDropdownMenu) {
                const existingAdmin = userDropdownMenu.querySelector('.admin-link');
                if (!existingAdmin) {
                    const adminLink = document.createElement('a');
                    adminLink.href = 'admin-dashboard.html';
                    adminLink.className = 'user-dropdown-item admin-link';
                    adminLink.innerHTML = '<i class="fa-solid fa-gauge"></i> Admin Dashboard';
                    userDropdownMenu.insertBefore(adminLink, userDropdownMenu.firstChild);
                }
            }
        } else {
            if (headerUserName) {
                headerUserName.textContent = 'Sign In';
            }
            headerProfileBtn.href = 'login.html';
            headerProfileBtn.title = 'Sign In';
            if (userDropdownMenu) {
                userDropdownMenu.innerHTML = `
                    <a href="login.html" class="user-dropdown-item">
                        <i class="fa-solid fa-right-to-bracket"></i> Sign In
                    </a>
                    <a href="register.html" class="user-dropdown-item">
                        <i class="fa-solid fa-user-plus"></i> New Customer? Register
                    </a>
                `;
            }
        }

        const dropdownArrow = headerProfileBtn.querySelector('.dropdown-arrow');
        if (dropdownArrow && userDropdownMenu) {
            dropdownArrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                userDropdownMenu.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-dropdown-container')) {
                    userDropdownMenu.classList.remove('show');
                }
            });
        }
    }
});
