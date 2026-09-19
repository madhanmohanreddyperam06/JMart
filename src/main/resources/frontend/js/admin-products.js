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
            <div class="admin-products-table table-responsive">
                <table class="cart-table table table-hover align-middle">
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
                                    <div class="admin-product-name fw-semibold">${escapeHtml(product.name)}</div>
                                    <div class="admin-product-brand text-secondary small">${escapeHtml(product.brand || 'N/A')}</div>
                                </td>
                                <td><span class="badge bg-light text-dark border">${escapeHtml(product.categoryName || 'N/A')}</span></td>
                                <td class="fw-semibold">${formatCurrency(product.price)}</td>
                                <td>
                                    <span class="stock-badge badge rounded-pill ${getStockClass(product.quantity)}">
                                        ${escapeHtml(product.quantity)}
                                    </span>
                                </td>
                                <td>
                                    <div class="admin-actions d-flex gap-1">
                                        <button class="btn btn-sm btn-secondary" onclick="openEditProductModal(${encodeURIComponent(product.id)})">
                                            Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${encodeURIComponent(product.id)})">
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
                <div class="modal-content shadow-lg border-0" style="max-width: 520px;">
                    <div class="modal-header d-flex justify-content-between align-items-center">
                        <h5 class="modal-title mb-0 fw-bold">Add New Product</h5>
                        <button type="button" class="btn-close modal-close" onclick="closeProductModal()" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="form-group mb-3">
                                <label for="productName" class="form-label">Product Name *</label>
                                <input type="text" id="productName" name="name" class="form-control" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="productDescription" class="form-label">Description</label>
                                <textarea id="productDescription" name="description" class="form-control" rows="3"></textarea>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-md-6">
                                    <label for="productPrice" class="form-label">Price *</label>
                                    <input type="number" id="productPrice" name="price" class="form-control" step="0.01" min="0" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="productQuantity" class="form-label">Quantity *</label>
                                    <input type="number" id="productQuantity" name="quantity" class="form-control" min="0" required>
                                </div>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-md-6">
                                    <label for="productBrand" class="form-label">Brand</label>
                                    <input type="text" id="productBrand" name="brand" class="form-control">
                                </div>
                                <div class="col-md-6">
                                    <label for="productCategory" class="form-label">Category *</label>
                                    <select id="productCategory" name="categoryId" class="form-select" required>
                                        <option value="">Select a category</option>
                                        ${categoryOptions}
                                    </select>
                                </div>
                            </div>
                            <div id="productError" class="message message-error hidden"></div>
                            <div class="form-actions d-flex gap-2 justify-content-end mt-4">
                                <button type="button" class="btn btn-secondary" onclick="closeProductModal()">Cancel</button>
                                <button type="submit" class="btn btn-primary">Add Product</button>
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
                <div class="modal-content shadow-lg border-0" style="max-width: 520px;">
                    <div class="modal-header d-flex justify-content-between align-items-center">
                        <h5 class="modal-title mb-0 fw-bold">Edit Product</h5>
                        <button type="button" class="btn-close modal-close" onclick="closeProductModal()" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="form-group mb-3">
                                <label for="productName" class="form-label">Product Name *</label>
                                <input type="text" id="productName" name="name" class="form-control" value="${escapeHtml(product.name)}" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="productDescription" class="form-label">Description</label>
                                <textarea id="productDescription" name="description" class="form-control" rows="3">${escapeHtml(product.description || '')}</textarea>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-md-6">
                                    <label for="productPrice" class="form-label">Price *</label>
                                    <input type="number" id="productPrice" name="price" class="form-control" step="0.01" min="0" value="${escapeHtml(product.price)}" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="productQuantity" class="form-label">Quantity *</label>
                                    <input type="number" id="productQuantity" name="quantity" class="form-control" min="0" value="${escapeHtml(product.quantity)}" required>
                                </div>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-md-6">
                                    <label for="productBrand" class="form-label">Brand</label>
                                    <input type="text" id="productBrand" name="brand" class="form-control" value="${escapeHtml(product.brand || '')}">
                                </div>
                                <div class="col-md-6">
                                    <label for="productCategory" class="form-label">Category *</label>
                                    <select id="productCategory" name="categoryId" class="form-select" required>
                                        <option value="">Select a category</option>
                                        ${categoryOptions}
                                    </select>
                                </div>
                            </div>
                            <div id="productError" class="message message-error hidden"></div>
                            <div class="form-actions d-flex gap-2 justify-content-end mt-4">
                                <button type="button" class="btn btn-secondary" onclick="closeProductModal()">Cancel</button>
                                <button type="submit" class="btn btn-primary">Update Product</button>
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