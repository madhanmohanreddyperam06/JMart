// Admin Inventory Management JavaScript

let currentInventoryType = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    // Require admin authentication
    requireAdmin();

    const inventoryContainer = document.getElementById('inventoryContainer');
    const errorElement = document.getElementById('inventoryError');

    // Load all inventory on page load
    await loadInventory('all');

    async function loadInventory(type) {
        currentInventoryType = type;
        updateActiveTab(type);

        showLoading(inventoryContainer, 'Loading inventory...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            let inventoryData;
            switch (type) {
                case 'low-stock':
                    inventoryData = await API.admin.inventory.getLowStock();
                    break;
                case 'out-of-stock':
                    inventoryData = await API.admin.inventory.getOutOfStock();
                    break;
                default:
                    inventoryData = await API.admin.inventory.getAll();
            }

            renderInventory(inventoryData);
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(inventoryContainer, 'Unable to load inventory', () => loadInventory(type));
            }
        }
    }

    function renderInventory(inventory) {
        if (!inventory || inventory.length === 0) {
            renderEmptyInventory();
            return;
        }

        const inventoryHTML = `
            <div class="admin-inventory-table">
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inventory.map(item => `
                            <tr>
                                <td>${escapeHtml(item.productId)}</td>
                                <td>
                                    <div class="admin-product-name">${escapeHtml(item.productName)}</div>
                                    <div class="admin-product-brand">${escapeHtml(item.brand || 'N/A')}</div>
                                </td>
                                <td>${escapeHtml(item.categoryName || 'N/A')}</td>
                                <td>${formatCurrency(item.price)}</td>
                                <td>
                                    <span class="stock-badge ${getStockClass(item.quantity)}">
                                        ${escapeHtml(item.quantity)}
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge ${getStatusClass(item.stockStatus)}">
                                        ${escapeHtml(item.stockStatus)}
                                    </span>
                                </td>
                                <td>
                                    <div class="admin-actions">
                                        <button class="btn btn-sm btn-secondary" onclick="openUpdateStockModal(${encodeURIComponent(item.productId)}, ${encodeURIComponent(item.quantity)}, '${escapeHtml(item.productName).replace(/'/g, "\\'")}')">
                                            Update Stock
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        inventoryContainer.innerHTML = inventoryHTML;
    }

    function renderEmptyInventory() {
        const messages = {
            'all': 'No products in inventory',
            'low-stock': 'No products with low stock',
            'out-of-stock': 'No products out of stock'
        };

        inventoryContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">${messages[currentInventoryType]}</div>
                <div class="empty-state-subtext">Inventory is in good condition</div>
            </div>
        `;
    }

    function getStockClass(quantity) {
        if (quantity === 0) return 'stock-out';
        if (quantity < 5) return 'stock-low';
        return 'stock-ok';
    }

    function getStatusClass(status) {
        switch (status) {
            case 'IN_STOCK':
                return 'status-in-stock';
            case 'LOW_STOCK':
                return 'status-low-stock';
            case 'OUT_OF_STOCK':
                return 'status-out-of-stock';
            default:
                return '';
        }
    }

    function updateActiveTab(type) {
        const tabs = document.querySelectorAll('.inventory-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.textContent.toLowerCase().includes(type.replace('-', ' '))) {
                tab.classList.add('active');
            }
        });
    }
});

// Global function to open update stock modal
function openUpdateStockModal(productId, currentQuantity, productName) {
    const modalHTML = `
        <div class="modal-overlay" id="stockModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Update Stock</h2>
                    <button class="modal-close" onclick="closeStockModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="mb-3">Update stock for <strong>${escapeHtml(productName)}</strong></p>
                    <p class="mb-3">Current stock: <strong>${escapeHtml(currentQuantity)}</strong></p>
                    <form id="stockForm">
                        <div class="form-group">
                            <label for="newQuantity">New Quantity</label>
                            <input type="number" id="newQuantity" name="quantity" min="0" value="${currentQuantity}" required>
                        </div>
                        <div id="stockError" class="message message-error hidden"></div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Update Stock</button>
                            <button type="button" class="btn btn-secondary" onclick="closeStockModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const form = document.getElementById('stockForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleStockUpdate(productId, form);
    });
}

// Global function to close stock modal
function closeStockModal() {
    const modal = document.getElementById('stockModal');
    if (modal) {
        modal.remove();
    }
}

// Handle stock update
async function handleStockUpdate(productId, form) {
    const errorElement = document.getElementById('stockError');
    const submitButton = form.querySelector('button[type="submit"]');

    const newQuantity = parseInt(form.quantity.value, 10);

    // Validation
    if (isNaN(newQuantity) || newQuantity < 0) {
        errorElement.textContent = 'Quantity must be a valid non-negative number';
        errorElement.classList.remove('hidden');
        return;
    }

    errorElement.innerHTML = '';
    errorElement.classList.add('hidden');

    // Disable submit button and show loading
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="auth-loading"><div class="spinner"></div> Updating...</span>';

    try {
        await API.admin.inventory.update(productId, newQuantity);
        showMessage('Stock updated successfully', 'success');
        closeStockModal();
        window.location.reload();
    } catch (error) {
        handleApiError(error, errorElement);
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');

        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}