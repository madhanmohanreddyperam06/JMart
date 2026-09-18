// Admin Orders Management JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Require admin authentication
    requireAdmin();

    const ordersContainer = document.getElementById('ordersContainer');
    const errorElement = document.getElementById('ordersError');

    // Load orders on page load
    await loadOrders();

    async function loadOrders() {
        showLoading(ordersContainer, 'Loading orders...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const orders = await API.admin.orders.getAll();
            renderAdminOrders(orders);
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(ordersContainer, 'Unable to load orders', () => loadOrders());
            }
        }
    }

    function renderAdminOrders(orders) {
        if (!orders || orders.length === 0) {
            renderEmptyOrders();
            return;
        }

        const ordersHTML = `
            <div class="admin-orders-container">
                ${orders.map(order => renderAdminOrderCard(order)).join('')}
            </div>
        `;

        ordersContainer.innerHTML = ordersHTML;
    }

    function renderAdminOrderCard(order) {
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);

        return `
            <div class="admin-order-card">
                <div class="admin-order-header">
                    <div class="admin-order-info">
                        <h3>Order #${escapeHtml(order.orderId)}</h3>
                        <div class="admin-order-date">${formatDate(order.createdAt)}</div>
                        <div class="admin-order-user">User ID: ${escapeHtml(order.userId)}</div>
                    </div>
                    <div class="admin-order-status ${statusClass}">
                        ${escapeHtml(statusText)}
                    </div>
                </div>

                <div class="admin-order-items">
                    ${order.items ? order.items.map(item => `
                        <div class="admin-order-item">
                            <div class="admin-item-info">
                                <div class="admin-item-name">${escapeHtml(item.productName)}</div>
                                <div class="admin-item-quantity">Quantity: ${escapeHtml(item.quantity)}</div>
                            </div>
                            <div class="admin-item-price">${formatCurrency(item.subtotal)}</div>
                        </div>
                    `).join('') : '<p>No items in this order</p>'}
                </div>

                <div class="admin-order-footer">
                    <div class="admin-order-total">
                        <span class="admin-order-total-label">Total:</span>
                        <span class="admin-order-total-value">${formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div class="admin-order-actions">
                        <button class="btn btn-secondary btn-sm" onclick="openStatusModal(${encodeURIComponent(order.orderId)}, '${encodeURIComponent(order.status)}')">
                            Update Status
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderEmptyOrders() {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">No orders found</div>
                <div class="empty-state-subtext">There are no orders in the system yet</div>
            </div>
        `;
    }

    function getStatusClass(status) {
        switch (status) {
            case 'CONFIRMED':
                return 'status-confirmed';
            case 'SHIPPED':
                return 'status-shipped';
            case 'DELIVERED':
                return 'status-delivered';
            case 'CANCELLED':
                return 'status-cancelled';
            case 'PAYMENT_PENDING':
                return 'status-pending';
            default:
                return 'status-placed';
        }
    }

    function getStatusText(status) {
        switch (status) {
            case 'CONFIRMED':
                return 'Confirmed';
            case 'SHIPPED':
                return 'Shipped';
            case 'DELIVERED':
                return 'Delivered';
            case 'CANCELLED':
                return 'Cancelled';
            case 'PAYMENT_PENDING':
                return 'Payment Pending';
            default:
                return 'Placed';
        }
    }
});

// Global function to open status update modal
function openStatusModal(orderId, currentStatus) {
    const statusOptions = [
        { value: 'PLACED', label: 'Placed' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'SHIPPED', label: 'Shipped' },
        { value: 'DELIVERED', label: 'Delivered' },
        { value: 'CANCELLED', label: 'Cancelled' },
    ];

    const statusSelect = statusOptions.map(status =>
        `<option value="${status.value}" ${status.value === currentStatus ? 'selected' : ''}>${status.label}</option>`
    ).join('');

    const modalHTML = `
        <div class="modal-overlay" id="statusModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Update Order Status</h2>
                    <button class="modal-close" onclick="closeStatusModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="statusForm">
                        <div class="form-group">
                            <label for="orderStatus">Order Status</label>
                            <select id="orderStatus" name="status" required>
                                ${statusSelect}
                            </select>
                        </div>
                        <div id="statusError" class="message message-error hidden"></div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Update Status</button>
                            <button type="button" class="btn btn-secondary" onclick="closeStatusModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const form = document.getElementById('statusForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleStatusUpdate(orderId, form);
    });
}

// Global function to close status modal
function closeStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) {
        modal.remove();
    }
}

// Handle status update
async function handleStatusUpdate(orderId, form) {
    const errorElement = document.getElementById('statusError');
    const submitButton = form.querySelector('button[type="submit"]');

    const newStatus = form.status.value;

    errorElement.innerHTML = '';
    errorElement.classList.add('hidden');

    // Disable submit button and show loading
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="auth-loading"><div class="spinner"></div> Updating...</span>';

    try {
        await API.admin.orders.updateStatus(orderId, newStatus);
        showMessage('Order status updated successfully', 'success');
        closeStatusModal();
        window.location.reload();
    } catch (error) {
        handleApiError(error, errorElement);
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');

        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}