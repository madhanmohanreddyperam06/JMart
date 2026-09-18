// Products Page JavaScript

let allProducts = [];
let allCategories = [];

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
        // Silently fail for cart count updates
        console.error('Failed to update cart count:', error);
    }
}

// Update cart count display function
function updateCartCountDisplay(count) {
    // Update for new home page structure
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = count;
        if (count > 0) {
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.getElementById('productsContainer');
    const errorElement = document.getElementById('productsError');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const applyFiltersButton = document.getElementById('applyFilters');
    const clearFiltersButton = document.getElementById('clearFilters');

    // Load initial data
    await loadCategories();
    await loadProducts();
    
    // Update cart count if user is logged in
    if (isLoggedIn() && isCustomer()) {
        updateCartCount();
    }

    // Search functionality
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Apply filters
    applyFiltersButton.addEventListener('click', handleFilters);

    // Clear filters
    clearFiltersButton.addEventListener('click', clearFilters);

    async function loadCategories() {
        try {
            const categories = await API.categories.getAll();
            allCategories = categories;
            populateCategoryFilter(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    function populateCategoryFilter(categories) {
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
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            allProducts = await API.products.getAll();
            renderProducts(allProducts);
        } catch (error) {
            handleApiError(error, errorElement);
            showError(productsContainer, 'Unable to load products', () => loadProducts());
        }
    }

    function renderProducts(products) {
        if (!products || products.length === 0) {
            showEmpty(productsContainer, 'No products found', 'Try adjusting your search or filters');
            return;
        }

        const productsGrid = document.createElement('div');
        productsGrid.className = 'products-grid';

        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });

        productsContainer.innerHTML = '';
        productsContainer.appendChild(productsGrid);
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const stockStatus = getStockStatus(product.quantity);
        const stockClass = stockStatus.toLowerCase().replace(' ', '-');

        card.innerHTML = `
            <div class="product-image">
                <div class="product-image-placeholder">📦</div>
            </div>
            <div class="product-details">
                <div class="product-category">${escapeHtml(product.categoryName || 'Uncategorized')}</div>
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <div class="product-brand">${escapeHtml(product.brand || 'Unknown Brand')}</div>
                <p class="product-description">${escapeHtml(product.description || 'No description available')}</p>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-stock ${stockClass}">
                    ${escapeHtml(stockStatus)}: ${escapeHtml(product.quantity)} available
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="viewProductDetails(${encodeURIComponent(product.id)})">
                        View Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    function getStockStatus(quantity) {
        if (quantity === 0) return 'Out of Stock';
        if (quantity < 5) return 'Low Stock';
        return 'In Stock';
    }

    async function handleSearch() {
        const searchTerm = searchInput.value.trim();
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        if (!searchTerm) {
            renderProducts(allProducts);
            return;
        }

        showLoading(productsContainer, 'Searching products...');

        try {
            const searchResults = await API.products.search(searchTerm);
            renderProducts(searchResults);
        } catch (error) {
            handleApiError(error, errorElement);
            showError(productsContainer, 'Search failed', () => handleSearch());
        }
    }

    async function handleFilters() {
        const categoryId = categoryFilter.value;
        const minPrice = minPriceInput.value.trim();
        const maxPrice = maxPriceInput.value.trim();

        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');
        showLoading(productsContainer, 'Applying filters...');

        try {
            let filteredProducts = allProducts;

            // Filter by category
            if (categoryId) {
                try {
                    const categoryProducts = await API.products.getByCategory(categoryId);
                    filteredProducts = categoryProducts;
                } catch (error) {
                    console.error('Error filtering by category:', error);
                }
            }

            // Filter by price range
            if (minPrice || maxPrice) {
                const min = minPrice ? parseFloat(minPrice) : 0;
                const max = maxPrice ? parseFloat(maxPrice) : Infinity;

                if (min >= 0 && max >= min) {
                    try {
                        const priceFiltered = await API.products.getByPriceRange(min, max);
                        // Intersect with category filter if applied
                        if (categoryId) {
                            const categoryIds = filteredProducts.map(p => p.id);
                            filteredProducts = priceFiltered.filter(p => categoryIds.includes(p.id));
                        } else {
                            filteredProducts = priceFiltered;
                        }
                    } catch (error) {
                        console.error('Error filtering by price:', error);
                    }
                }
            }

            renderProducts(filteredProducts);
        } catch (error) {
            handleApiError(error, errorElement);
            showError(productsContainer, 'Filter application failed', () => handleFilters());
        }
    }

    function clearFilters() {
        searchInput.value = '';
        categoryFilter.value = '';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');
        renderProducts(allProducts);
    }
});

// Global function for viewing product details
function viewProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}
