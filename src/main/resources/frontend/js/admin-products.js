// Admin Products Management JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Require admin authentication
    requireAdmin();

    const productsContainer = document.getElementById('productsContainer');
    const errorElement = document.getElementById('productsError');

    // Load products on page load
    await loadProducts();

    async function loadProducts() {
        showLoading(productsContainer, 'Loading products...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const products = await API.admin.products.getAll();
            renderAdminProducts(products);
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(productsContainer, 'Unable to load products', () => loadProducts());
            }
        }
    }

    function renderAdminProducts(products) {
        if (!products || products.length === 0) {
            renderEmptyProducts();
            return;
        }

        const productsHTML = `
            <div class="admin-products-table">
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr>
                                <td>${escapeHtml(product.id)}</td>
                                <td>
                                    <div class="admin-product-name">${escapeHtml(product.name)}</div>
                                    <div class="admin-product-brand">${escapeHtml(product.brand || 'N/A')}</div>
                                </td>
                                <td>${escapeHtml(product.categoryName || 'N/A')}</td>
                                <td>${formatCurrency(product.price)}</td>
                                <td>
                                    <span class="stock-badge ${getStockClass(product.quantity)}">
                                        ${escapeHtml(product.quantity)}
                                    </span>
                                </td>
                                <td>
                                    <div class="admin-actions">
                                        <button class="btn btn-sm btn-secondary" onclick="openEditProductModal(${encodeURIComponent(product.id)})">
                                            Edit
                                        </button>
                                        <button class="btn btn-sm btn-error" onclick="deleteProduct(${encodeURIComponent(product.id)})">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        productsContainer.innerHTML = productsHTML;
    }

    function renderEmptyProducts() {
        productsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">No products found</div>
                <div class="empty-state-subtext">Start by adding your first product</div>
                <button class="btn btn-primary" onclick="openAddProductModal()">
                    Add New Product
                </button>
            </div>
        `;
    }

    function getStockClass(quantity) {
        if (quantity === 0) return 'stock-out';
        if (quantity < 5) return 'stock-low';
        return 'stock-ok';
    }
});

// Global function to open add product modal
async function openAddProductModal() {
    try {
        const categories = await API.categories.getAll();
        const categoryOptions = categories.map(cat =>
            `<option value="${escapeHtml(cat.id)}">${escapeHtml(cat.name)}</option>`
        ).join('');

        const modalHTML = `
            <div class="modal-overlay" id="productModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Add New Product</h2>
                        <button class="modal-close" onclick="closeProductModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="form-group">
                                <label for="productName">Product Name *</label>
                                <input type="text" id="productName" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="productDescription">Description</label>
                                <textarea id="productDescription" name="description" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="productPrice">Price *</label>
                                <input type="number" id="productPrice" name="price" step="0.01" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="productQuantity">Quantity *</label>
                                <input type="number" id="productQuantity" name="quantity" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="productBrand">Brand</label>
                                <input type="text" id="productBrand" name="brand">
                            </div>
                            <div class="form-group">
                                <label for="productCategory">Category *</label>
                                <select id="productCategory" name="categoryId" required>
                                    <option value="">Select a category</option>
                                    ${categoryOptions}
                                </select>
                            </div>
                            <div id="productError" class="message message-error hidden"></div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Add Product</button>
                                <button type="button" class="btn btn-secondary" onclick="closeProductModal()">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const form = document.getElementById('productForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleProductSubmit(form, null);
        });
    } catch (error) {
        handleApiError(error);
        showMessage('Failed to load categories', 'error');
    }
}

// Global function to open edit product modal
async function openEditProductModal(productId) {
    try {
        const [product, categories] = await Promise.all([
            API.admin.products.getById(productId),
            API.categories.getAll()
        ]);

        const categoryOptions = categories.map(cat =>
            `<option value="${escapeHtml(cat.id)}" ${cat.id === product.categoryId ? 'selected' : ''}>${escapeHtml(cat.name)}</option>`
        ).join('');

        const modalHTML = `
            <div class="modal-overlay" id="productModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Product</h2>
                        <button class="modal-close" onclick="closeProductModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="form-group">
                                <label for="productName">Product Name *</label>
                                <input type="text" id="productName" name="name" value="${escapeHtml(product.name)}" required>
                            </div>
                            <div class="form-group">
                                <label for="productDescription">Description</label>
                                <textarea id="productDescription" name="description" rows="3">${escapeHtml(product.description || '')}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="productPrice">Price *</label>
                                <input type="number" id="productPrice" name="price" step="0.01" min="0" value="${escapeHtml(product.price)}" required>
                            </div>
                            <div class="form-group">
                                <label for="productQuantity">Quantity *</label>
                                <input type="number" id="productQuantity" name="quantity" min="0" value="${escapeHtml(product.quantity)}" required>
                            </div>
                            <div class="form-group">
                                <label for="productBrand">Brand</label>
                                <input type="text" id="productBrand" name="brand" value="${escapeHtml(product.brand || '')}">
                            </div>
                            <div class="form-group">
                                <label for="productCategory">Category *</label>
                                <select id="productCategory" name="categoryId" required>
                                    <option value="">Select a category</option>
                                    ${categoryOptions}
                                </select>
                            </div>
                            <div id="productError" class="message message-error hidden"></div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Update Product</button>
                                <button type="button" class="btn btn-secondary" onclick="closeProductModal()">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const form = document.getElementById('productForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleProductSubmit(form, productId);
        });
    } catch (error) {
        handleApiError(error);
        showMessage('Failed to load product data', 'error');
    }
}

// Global function to close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
}

// Handle product form submission
async function handleProductSubmit(form, productId) {
    const errorElement = document.getElementById('productError');
    const submitButton = form.querySelector('button[type="submit"]');

    const formData = {
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        price: parseFloat(form.price.value),
        quantity: parseInt(form.quantity.value, 10),
        brand: form.brand.value.trim(),
        categoryId: parseInt(form.categoryId.value, 10),
    };

    // Validation
    if (!formData.name) {
        errorElement.textContent = 'Product name is required';
        errorElement.classList.remove('hidden');
        return;
    }

    if (formData.name.length > 255) {
        errorElement.textContent = 'Product name must not exceed 255 characters';
        errorElement.classList.remove('hidden');
        return;
    }

    if (isNaN(formData.price) || formData.price < 0) {
        errorElement.textContent = 'Price must be a valid positive number';
        errorElement.classList.remove('hidden');
        return;
    }

    if (isNaN(formData.quantity) || formData.quantity < 0) {
        errorElement.textContent = 'Quantity must be a valid non-negative number';
        errorElement.classList.remove('hidden');
        return;
    }

    if (!formData.categoryId) {
        errorElement.textContent = 'Category is required';
        errorElement.classList.remove('hidden');
        return;
    }

    errorElement.innerHTML = '';
    errorElement.classList.add('hidden');

    // Disable submit button and show loading
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="auth-loading"><div class="spinner"></div> Saving...</span>';

    try {
        if (productId) {
            await API.admin.products.update(productId, formData);
            showMessage('Product updated successfully', 'success');
        } else {
            await API.admin.products.create(formData);
            showMessage('Product created successfully', 'success');
        }

        closeProductModal();
        window.location.reload();
    } catch (error) {
        handleApiError(error, errorElement);
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');

        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// Global function to delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        await API.admin.products.delete(productId);
        showMessage('Product deleted successfully', 'success');
        window.location.reload();
    } catch (error) {
        handleApiError(error);
        showMessage('Failed to delete product', 'error');
    }
}