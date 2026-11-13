// Products Page JavaScript - Flipkart, Myntra & Amazon Benchmark

let allProducts = [];
let allCategories = [];
let currentFilteredProducts = [];
let currentSort = 'popularity';
let showingWishlistOnly = false;

let activeFilters = {
    search: '',
    categoryId: '',
    minPrice: null,
    maxPrice: null,
    minRating: null,
    minDiscount: null,
    inStockOnly: false
};

// Check authentication state
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function isCustomer() {
    return localStorage.getItem('role') === 'CUSTOMER';
}

function isAdmin() {
    return localStorage.getItem('role') === 'ADMIN';
}

// Update cart count function
async function updateCartCount() {
    try {
        if (!isLoggedIn() || !isCustomer()) {
            updateCartCountDisplay(0);
            return;
        }
        const cart = await API.cart.getAll();
        const totalCount = cart && cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
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

function updateWishlistCountDisplay() {
    const badge = document.getElementById('wishlistBadge');
    if (!badge) return;
    const wishlist = getWishlist();
    const count = wishlist.length;
    badge.textContent = count > 99 ? '99+' : count;
    if (count > 0) {
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
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
    updateWishlistCountDisplay();

    if (showingWishlistOnly) {
        applyLocalFilters();
    }

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
        return { icon: '<i class="fa-solid fa-chair"></i>', bg: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', label: 'Home & Living' };
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
    const discountPercent = 15 + ((id * 7) % 35); // 15% to 49% discount
    const mrp = Math.round(Number(product.price) / (1 - (discountPercent / 100)));
    const ratingNum = (3.8 + (((id * 13) % 12) / 10)).toFixed(1);
    const cappedRating = Math.min(5.0, Math.max(3.8, Number(ratingNum))).toFixed(1);
    const reviewCount = (120 + ((id * 317) % 4800)).toLocaleString();
    return { discountPercent, mrp, rating: cappedRating, reviewCount };
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
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Added';
        btnElement.style.backgroundColor = '#16a34a';
        if (typeof showMessage === 'function') {
            showMessage('Product added to cart!', 'success');
        }
        updateCartCount();
        setTimeout(() => {
            btnElement.disabled = false;
            btnElement.innerHTML = originalHtml;
            btnElement.style.backgroundColor = '';
        }, 1500);
    } catch (error) {
        btnElement.disabled = false;
        btnElement.innerHTML = originalHtml;
        if (typeof handleApiError === 'function') {
            handleApiError(error);
        } else if (typeof showMessage === 'function') {
            showMessage(error.message || 'Failed to add product to cart', 'error');
        }
    }
}

// Global function for viewing product details
function viewProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Expose functions globally for inline HTML event handlers
window.toggleWishlist = toggleWishlist;
window.handleQuickAddToCart = handleQuickAddToCart;
window.viewProductDetails = viewProductDetails;

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('productsContainer');
    const errorElement = document.getElementById('productsError');
    const productsCount = document.getElementById('productsCount');
    const catalogSectionTitle = document.getElementById('catalogSectionTitle');
    const activeFilterChips = document.getElementById('activeFilterChips');
    const activeChipsList = document.getElementById('activeChipsList');

    // Sidebar Filter Elements
    const sidebarCategoryList = document.getElementById('sidebarCategoryList');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');
    const applyPriceBtn = document.getElementById('applyPriceBtn');
    const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');
    const inStockToggle = document.getElementById('inStockToggle');
    const pricePills = document.querySelectorAll('.price-pill');
    const ratingRadios = document.querySelectorAll('input[name="ratingFilter"]');
    const discountRadios = document.querySelectorAll('input[name="discountFilter"]');

    // Sort Pills
    const sortPills = document.querySelectorAll('.sort-pill');

    // Header Elements
    const headerSearchInput = document.querySelector('.search-input');
    const headerSearchBtn = document.querySelector('.search-btn');
    const headerCategoryItems = document.querySelectorAll('.category-item');
    const headerWishlistBtn = document.getElementById('headerWishlistBtn');

    // View All Deals button
    const viewAllDealsBtn = document.getElementById('viewAllDealsBtn');

    // Initialize Hero Banner Carousel
    initHeroCarousel();

    // Initialize Deal Countdown Timer
    initCountdownTimer();

    // Initialize User Profile Header
    initHeaderProfile();

    // Initialize Wishlist Count Badge
    updateWishlistCountDisplay();

    // Update Cart Count if logged in
    if (isLoggedIn() && isCustomer()) {
        updateCartCount();
    }

    // Load initial categories and products
    await loadCategories();
    await loadProducts();

    // ==========================================
    // 1. Hero Carousel Controller
    // ==========================================
    function initHeroCarousel() {
        const track = document.getElementById('heroCarouselTrack');
        const prevBtn = document.getElementById('carouselPrevBtn');
        const nextBtn = document.getElementById('carouselNextBtn');
        const dots = document.querySelectorAll('#carouselDots .dot');
        const wrapper = document.getElementById('heroCarouselWrapper');

        if (!track || dots.length === 0) return;

        let currentSlide = 0;
        const totalSlides = dots.length;
        let slideInterval = null;

        function goToSlide(index) {
            currentSlide = (index + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startAutoSlide() {
            stopAutoSlide();
            slideInterval = setInterval(nextSlide, 4500);
        }

        function stopAutoSlide() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoSlide();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetSlide = parseInt(e.target.dataset.slide, 10);
                if (!isNaN(targetSlide)) {
                    goToSlide(targetSlide);
                    startAutoSlide();
                }
            });
        });

        if (wrapper) {
            wrapper.addEventListener('mouseenter', stopAutoSlide);
            wrapper.addEventListener('mouseleave', startAutoSlide);
        }

        startAutoSlide();
    }

    // ==========================================
    // 2. Deals Countdown Timer
    // ==========================================
    function initCountdownTimer() {
        const timerEl = document.getElementById('dealCountdownTimer');
        if (!timerEl) return;

        function updateTimer() {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            let diff = Math.floor((midnight - now) / 1000);
            if (diff <= 0) diff = 86400;

            const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
            const seconds = String(diff % 60).padStart(2, '0');

            timerEl.textContent = `${hours} : ${minutes} : ${seconds}`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ==========================================
    // 3. Deals of the Day Spotlight Rail
    // ==========================================
    function populateDealsSpotlight(products) {
        const spotlightRail = document.getElementById('spotlightDealsRail');
        if (!spotlightRail) return;

        if (!products || products.length === 0) {
            spotlightRail.innerHTML = '<div style="padding: 1rem; color: #64748b; font-size: 0.85rem;">Deals refreshed daily. Check back soon!</div>';
            return;
        }

        // Pick top 6 products with best discounts
        const deals = [...products]
            .map(p => ({ product: p, metrics: getProductMetrics(p) }))
            .sort((a, b) => b.metrics.discountPercent - a.metrics.discountPercent)
            .slice(0, 6);

        spotlightRail.innerHTML = '';

        deals.forEach(({ product, metrics }) => {
            const visual = getCategoryVisual(product.categoryName, product.name);
            const item = document.createElement('div');
            item.className = 'spotlight-deal-item';
            item.innerHTML = `
                <span class="spotlight-deal-badge">${metrics.discountPercent}% OFF</span>
                <div class="spotlight-deal-icon" style="color: #2874f0;">
                    ${visual.icon}
                </div>
                <div class="spotlight-deal-name" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</div>
                <div class="spotlight-deal-price">${formatCurrency(product.price)}</div>
                <button class="spotlight-deal-btn">Grab Deal</button>
            `;

            item.addEventListener('click', () => {
                viewProductDetails(product.id);
            });

            spotlightRail.appendChild(item);
        });
    }

    if (viewAllDealsBtn) {
        viewAllDealsBtn.addEventListener('click', () => {
            activeFilters.minDiscount = 20;
            const targetRadio = document.querySelector('input[name="discountFilter"][value="20"]');
            if (targetRadio) targetRadio.checked = true;
            applyLocalFilters();
            scrollToCatalog();
        });
    }

    // ==========================================
    // 4. Data Fetching
    // ==========================================
    async function loadCategories() {
        try {
            const categories = await API.categories.getAll();
            allCategories = categories || [];
            populateSidebarCategories(allCategories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
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
            populateSidebarCategories(allCategories);
            populateDealsSpotlight(allProducts);
            renderSortedProducts();
        } catch (error) {
            if (errorElement) handleApiError(error, errorElement);
            showError(productsContainer, 'Unable to load products', () => loadProducts());
        }
    }

    // ==========================================
    // 5. Sidebar Categories List
    // ==========================================
    function populateSidebarCategories(categories) {
        if (!sidebarCategoryList) return;

        sidebarCategoryList.innerHTML = '';

        // "All Categories" option
        const allItem = document.createElement('div');
        allItem.className = `category-filter-item ${!activeFilters.categoryId ? 'active' : ''}`;
        allItem.innerHTML = `
            <span>All Categories</span>
            <span class="cat-item-count">${allProducts.length}</span>
        `;
        allItem.addEventListener('click', () => {
            activeFilters.categoryId = '';
            syncHeaderCategoryActive('');
            applyLocalFilters();
        });
        sidebarCategoryList.appendChild(allItem);

        // Individual Categories
        categories.forEach(cat => {
            const catCount = allProducts.filter(p => String(p.categoryId) === String(cat.id)).length;
            const item = document.createElement('div');
            const isActive = String(activeFilters.categoryId) === String(cat.id);
            item.className = `category-filter-item ${isActive ? 'active' : ''}`;
            item.innerHTML = `
                <span>${escapeHtml(cat.name)}</span>
                <span class="cat-item-count">${catCount}</span>
            `;

            item.addEventListener('click', () => {
                if (String(activeFilters.categoryId) === String(cat.id)) {
                    activeFilters.categoryId = '';
                    syncHeaderCategoryActive('');
                } else {
                    activeFilters.categoryId = String(cat.id);
                    syncHeaderCategoryActive(cat.name);
                }
                applyLocalFilters();
            });

            sidebarCategoryList.appendChild(item);
        });
    }

    // ==========================================
    // 6. Filter Event Listeners
    // ==========================================

    // Price presets pills
    pricePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const min = pill.dataset.min ? parseFloat(pill.dataset.min) : null;
            const max = pill.dataset.max ? parseFloat(pill.dataset.max) : null;

            if (pill.classList.contains('active')) {
                pill.classList.remove('active');
                activeFilters.minPrice = null;
                activeFilters.maxPrice = null;
                if (minPriceInput) minPriceInput.value = '';
                if (maxPriceInput) maxPriceInput.value = '';
            } else {
                pricePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeFilters.minPrice = min;
                activeFilters.maxPrice = max;
                if (minPriceInput) minPriceInput.value = min !== null ? min : '';
                if (maxPriceInput) maxPriceInput.value = max !== null ? max : '';
            }

            applyLocalFilters();
        });
    });

    // Custom price apply button
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', handleCustomPriceApply);
    }

    if (minPriceInput) {
        minPriceInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCustomPriceApply();
        });
    }

    if (maxPriceInput) {
        maxPriceInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCustomPriceApply();
        });
    }

    function handleCustomPriceApply() {
        const minVal = minPriceInput && minPriceInput.value.trim() !== '' ? parseFloat(minPriceInput.value.trim()) : null;
        const maxVal = maxPriceInput && maxPriceInput.value.trim() !== '' ? parseFloat(maxPriceInput.value.trim()) : null;

        activeFilters.minPrice = minVal !== null && !isNaN(minVal) ? minVal : null;
        activeFilters.maxPrice = maxVal !== null && !isNaN(maxVal) ? maxVal : null;

        // Clear preset pills
        pricePills.forEach(p => p.classList.remove('active'));

        applyLocalFilters();
    }

    // Customer Ratings Filter
    ratingRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.minRating = parseFloat(e.target.value);
                applyLocalFilters();
            }
        });
    });

    // Discount Filter
    discountRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.minDiscount = parseFloat(e.target.value);
                applyLocalFilters();
            }
        });
    });

    // In Stock Only Toggle
    if (inStockToggle) {
        inStockToggle.addEventListener('change', (e) => {
            activeFilters.inStockOnly = e.target.checked;
            applyLocalFilters();
        });
    }

    // Clear All Filters
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', resetAllFilters);
    }

    // Sort Pills
    sortPills.forEach(pill => {
        pill.addEventListener('click', () => {
            sortPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentSort = pill.dataset.sort || 'popularity';
            renderSortedProducts();
        });
    });

    // Wishlist Button in Header
    if (headerWishlistBtn) {
        headerWishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showingWishlistOnly = !showingWishlistOnly;
            headerWishlistBtn.classList.toggle('active', showingWishlistOnly);

            if (showingWishlistOnly) {
                if (typeof showMessage === 'function') {
                    showMessage('Filtering Wishlisted Products', 'info');
                }
            }
            applyLocalFilters();
            scrollToCatalog();
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

    function handleSearchQuery(searchTerm) {
        activeFilters.search = searchTerm;
        applyLocalFilters();
        scrollToCatalog();
    }

    function handleHeaderCategoryClick(catName) {
        if (!catName || catName === 'For You') {
            activeFilters.categoryId = '';
            syncHeaderCategoryActive('');
            applyLocalFilters();
            scrollToCatalog();
            return;
        }

        const normalized = catName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matched = allCategories.find(c => {
            const cNorm = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cNorm.includes(normalized) || normalized.includes(cNorm);
        });

        if (matched) {
            activeFilters.categoryId = String(matched.id);
            syncHeaderCategoryActive(matched.name);
        } else {
            // Find products with matching category name or clear
            const altMatch = allCategories.find(c => c.name.toLowerCase().includes(normalized.slice(0, 4)));
            if (altMatch) {
                activeFilters.categoryId = String(altMatch.id);
                syncHeaderCategoryActive(altMatch.name);
            } else {
                activeFilters.categoryId = '';
                syncHeaderCategoryActive('');
            }
        }

        applyLocalFilters();
        scrollToCatalog();
    }

    // Make handleHeaderCategoryClick accessible globally for banner buttons
    window.handleHeaderCategoryClick = handleHeaderCategoryClick;

    function syncHeaderCategoryActive(catName) {
        headerCategoryItems.forEach(item => {
            const name = item.querySelector('.category-name')?.textContent.trim();
            if (!catName && (name === 'For You' || !name)) {
                item.classList.add('active');
            } else if (catName && name && (name.toLowerCase().includes(catName.toLowerCase().slice(0, 4)) || catName.toLowerCase().includes(name.toLowerCase().slice(0, 4)))) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function scrollToCatalog() {
        const toolbar = document.querySelector('.catalog-toolbar-card');
        if (toolbar) {
            toolbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ==========================================
    // 7. Filter Execution
    // ==========================================
    function applyLocalFilters() {
        let results = [...allProducts];

        // 1. Wishlist Only filter
        if (showingWishlistOnly) {
            const wishlist = getWishlist();
            results = results.filter(p => wishlist.includes(String(p.id)));
        }

        // 2. Search query filter
        if (activeFilters.search) {
            const q = activeFilters.search.toLowerCase();
            results = results.filter(p =>
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.brand && p.brand.toLowerCase().includes(q)) ||
                (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        // 3. Category filter
        if (activeFilters.categoryId) {
            results = results.filter(p => String(p.categoryId) === String(activeFilters.categoryId));
        }

        // 4. Price filter
        if (activeFilters.minPrice !== null && !isNaN(activeFilters.minPrice)) {
            results = results.filter(p => Number(p.price) >= activeFilters.minPrice);
        }
        if (activeFilters.maxPrice !== null && !isNaN(activeFilters.maxPrice)) {
            results = results.filter(p => Number(p.price) <= activeFilters.maxPrice);
        }

        // 5. Customer Rating filter
        if (activeFilters.minRating !== null && !isNaN(activeFilters.minRating)) {
            results = results.filter(p => {
                const m = getProductMetrics(p);
                return Number(m.rating) >= activeFilters.minRating;
            });
        }

        // 6. Discount filter
        if (activeFilters.minDiscount !== null && !isNaN(activeFilters.minDiscount)) {
            results = results.filter(p => {
                const m = getProductMetrics(p);
                return Number(m.discountPercent) >= activeFilters.minDiscount;
            });
        }

        // 7. In-Stock Only filter
        if (activeFilters.inStockOnly) {
            results = results.filter(p => p.quantity > 0);
        }

        currentFilteredProducts = results;

        // Update UI states
        populateSidebarCategories(allCategories);
        updateCatalogHeader();
        updateActiveFilterChips();
        renderSortedProducts();
    }

    function updateCatalogHeader() {
        if (catalogSectionTitle) {
            if (showingWishlistOnly) {
                catalogSectionTitle.textContent = 'My Wishlist';
            } else if (activeFilters.search) {
                catalogSectionTitle.textContent = `Results for "${activeFilters.search}"`;
            } else if (activeFilters.categoryId) {
                const cat = allCategories.find(c => String(c.id) === String(activeFilters.categoryId));
                catalogSectionTitle.textContent = cat ? cat.name : 'Category Products';
            } else {
                catalogSectionTitle.textContent = 'All Products';
            }
        }

        if (productsCount) {
            productsCount.textContent = `Showing ${currentFilteredProducts.length} of ${allProducts.length} items`;
        }
    }

    // ==========================================
    // 8. Active Filter Chips
    // ==========================================
    function updateActiveFilterChips() {
        if (!activeFilterChips || !activeChipsList) return;

        const chips = [];

        if (showingWishlistOnly) {
            chips.push({
                label: 'Wishlisted Only',
                remove: () => {
                    showingWishlistOnly = false;
                    if (headerWishlistBtn) headerWishlistBtn.classList.remove('active');
                    applyLocalFilters();
                }
            });
        }

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
                    syncHeaderCategoryActive('');
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
                    pricePills.forEach(p => p.classList.remove('active'));
                    applyLocalFilters();
                }
            });
        }

        if (activeFilters.minRating !== null) {
            chips.push({
                label: `Rating: ${activeFilters.minRating}★ & above`,
                remove: () => {
                    activeFilters.minRating = null;
                    ratingRadios.forEach(r => r.checked = false);
                    applyLocalFilters();
                }
            });
        }

        if (activeFilters.minDiscount !== null) {
            chips.push({
                label: `Min ${activeFilters.minDiscount}% Off`,
                remove: () => {
                    activeFilters.minDiscount = null;
                    discountRadios.forEach(r => r.checked = false);
                    applyLocalFilters();
                }
            });
        }

        if (activeFilters.inStockOnly) {
            chips.push({
                label: 'In Stock Only',
                remove: () => {
                    activeFilters.inStockOnly = false;
                    if (inStockToggle) inStockToggle.checked = false;
                    applyLocalFilters();
                }
            });
        }

        if (chips.length === 0) {
            activeChipsList.innerHTML = '';
            activeFilterChips.style.display = 'none';
        } else {
            activeFilterChips.style.display = 'flex';
            activeChipsList.innerHTML = '';
            chips.forEach(chip => {
                const chipEl = document.createElement('span');
                chipEl.className = 'active-chip';
                chipEl.innerHTML = `
                    <span>${escapeHtml(chip.label)}</span>
                    <span class="active-chip-remove" title="Remove filter">✕</span>
                `;
                chipEl.querySelector('.active-chip-remove').addEventListener('click', chip.remove);
                activeChipsList.appendChild(chipEl);
            });
        }
    }

    // ==========================================
    // 9. Sorting & Rendering
    // ==========================================
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
            productsContainer.innerHTML = `
                <div class="catalog-empty-state">
                    <div class="catalog-empty-icon"><i class="fa-solid fa-box-open"></i></div>
                    <h3 class="catalog-empty-title">No products found</h3>
                    <p class="catalog-empty-desc">We couldn't find any products matching your selected criteria. Try adjusting filters or search terms.</p>
                    <button class="btn btn-primary" onclick="resetAllFilters()" style="background-color: #2874f0; border: none; font-weight: 700; padding: 0.5rem 1.25rem;">Clear All Filters</button>
                </div>
            `;
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
        card.className = 'modern-product-card';

        const isWishlisted = wishlist.includes(String(product.id));
        const metrics = getProductMetrics(product);
        const visual = getCategoryVisual(product.categoryName, product.name);
        const isOutOfStock = product.quantity === 0;
        const isLowStock = product.quantity > 0 && product.quantity < 5;

        // Stock and Delivery indicator
        let stockHtml = '';
        if (isOutOfStock) {
            stockHtml = `<div class="card-stock-status out-of-stock"><i class="fa-solid fa-circle-xmark"></i> Out of Stock</div>`;
        } else if (isLowStock) {
            stockHtml = `<div class="card-stock-status low-stock"><i class="fa-solid fa-bolt"></i> Only ${product.quantity} left!</div>`;
        } else {
            stockHtml = `<div class="card-stock-status in-stock"><i class="fa-solid fa-truck-fast"></i> Free Delivery</div>`;
        }

        card.innerHTML = `
            <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                    onclick="event.stopPropagation(); toggleWishlist(${product.id}, this)">
                ${isWishlisted ? '<i class="fa-solid fa-heart" style="color: #ef4444;"></i>' : '<i class="fa-regular fa-heart"></i>'}
            </button>

            <span class="card-discount-tag ${metrics.discountPercent >= 30 ? 'badge-hot' : ''}">
                ${metrics.discountPercent}% OFF
            </span>

            <div class="card-image-wrapper" onclick="viewProductDetails(${encodeURIComponent(product.id)})">
                <div class="card-visual-backdrop" style="background: ${visual.bg};">
                    <span class="card-visual-icon">${visual.icon}</span>
                    <span class="card-visual-badge">${escapeHtml(product.categoryName || visual.label)}</span>
                </div>
            </div>

            <div class="card-body-details">
                <span class="card-brand-name">${escapeHtml(product.brand || product.categoryName || 'JMART ASSURED')}</span>
                <h3 class="card-product-title" onclick="viewProductDetails(${encodeURIComponent(product.id)})" title="${escapeHtml(product.name)}">
                    ${escapeHtml(product.name)}
                </h3>

                <div class="card-rating-strip">
                    <span class="card-rating-badge">
                        ${metrics.rating} <i class="fa-solid fa-star"></i>
                    </span>
                    <span class="card-reviews-count">(${metrics.reviewCount})</span>
                    <span class="card-assured-logo"><i class="fa-solid fa-shield-halved"></i> Assured</span>
                </div>

                <div class="card-price-strip">
                    <span class="card-selling-price">${formatCurrency(product.price)}</span>
                    <span class="card-mrp-price">${formatCurrency(metrics.mrp)}</span>
                    <span class="card-savings-percent">${metrics.discountPercent}% off</span>
                </div>

                ${stockHtml}

                <div class="card-action-buttons">
                    <button class="btn-card-quick-details" onclick="viewProductDetails(${encodeURIComponent(product.id)})">
                        Details
                    </button>
                    <button class="btn-card-quick-cart ${isOutOfStock ? 'disabled' : ''}" 
                            ${isOutOfStock ? 'disabled' : ''}
                            onclick="event.stopPropagation(); handleQuickAddToCart(${product.id}, this)">
                        ${isOutOfStock ? 'Out of Stock' : '<i class="fa-solid fa-cart-shopping"></i> Add'}
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // ==========================================
    // 10. Reset Filters
    // ==========================================
    function resetAllFilters() {
        showingWishlistOnly = false;
        if (headerWishlistBtn) headerWishlistBtn.classList.remove('active');

        activeFilters = {
            search: '',
            categoryId: '',
            minPrice: null,
            maxPrice: null,
            minRating: null,
            minDiscount: null,
            inStockOnly: false
        };

        if (headerSearchInput) headerSearchInput.value = '';
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        if (inStockToggle) inStockToggle.checked = false;

        pricePills.forEach(p => p.classList.remove('active'));
        ratingRadios.forEach(r => r.checked = false);
        discountRadios.forEach(r => r.checked = false);

        sortPills.forEach(p => {
            p.classList.toggle('active', p.dataset.sort === 'popularity');
        });
        currentSort = 'popularity';

        syncHeaderCategoryActive('');

        if (errorElement) {
            errorElement.innerHTML = '';
            errorElement.classList.add('hidden');
        }

        applyLocalFilters();
    }

    // Expose resetAllFilters globally
    window.resetAllFilters = resetAllFilters;

    // ==========================================
    // 11. Profile & Dropdown
    // ==========================================
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
