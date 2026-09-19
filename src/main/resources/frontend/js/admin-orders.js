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
            <div class="admin-order-card card border-0 shadow-sm mb-3">
                <div class="admin-order-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div class="admin-order-info">
                        <h3 class="fs-6 fw-bold mb-1">Order #${escapeHtml(order.orderId)}</h3>
                        <div class="admin-order-date text-secondary small">${formatDate(order.createdAt)}</div>
                        <div class="admin-order-user text-secondary small">User ID: ${escapeHtml(order.userId)}</div>
                    </div>
                    <div class="admin-order-status badge rounded-pill px-3 py-2 ${statusClass}">
                        ${escapeHtml(statusText)}
                    </div>
                </div>

                <div class="admin-order-items my-2">
                    ${order.items ? order.items.map(item => `
                        <div class="admin-order-item d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div class="admin-item-info">
                                <div class="admin-item-name fw-medium">${escapeHtml(item.productName)}</div>
                                <div class="admin-item-quantity text-secondary small">Quantity: ${escapeHtml(item.quantity)}</div>
                            </div>
                            <div class="admin-item-price fw-semibold">${formatCurrency(item.subtotal)}</div>
                        </div>
                    `).join('') : '<p class="text-secondary small mb-0">No items in this order</p>'}
                </div>

                <div class="admin-order-footer d-flex justify-content-between align-items-center pt-2">
                    <div class="admin-order-total">
                        <span class="admin-order-total-label text-secondary small">Total: </span>
                        <span class="admin-order-total-value fw-bold text-primary fs-6">${formatCurrency(order.totalAmount)}</span>
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
            <div class="modal-content shadow-lg border-0" style="max-width: 440px;">
                <div class="modal-header d-flex justify-content-between align-items-center">
                    <h5 class="modal-title mb-0 fw-bold">Update Order Status</h5>
                    <button type="button" class="btn-close modal-close" onclick="closeStatusModal()" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="statusForm">
                        <div class="form-group mb-3">
                            <label for="orderStatus" class="form-label">Order Status</label>
                            <select id="orderStatus" name="status" class="form-select" required>
                                ${statusSelect}
                            </select>
                        </div>
                        <div id="statusError" class="message message-error hidden"></div>
                        <div class="form-actions d-flex gap-2 justify-content-end mt-4">
                            <button type="button" class="btn btn-secondary" onclick="closeStatusModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Update Status</button>
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