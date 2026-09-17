// Orders Page JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    requireAuth('orders.html');

    const ordersContainer = document.getElementById('ordersContainer');
    const errorElement = document.getElementById('ordersError');

    // Load orders on page load
    await loadOrders();

    async function loadOrders() {
        showLoading(ordersContainer, 'Loading orders...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const orders = await API.orders.getAll();
            renderOrders(orders);
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(ordersContainer, 'Unable to load orders', () => loadOrders());
            }
        }
    }

    function renderOrders(orders) {
        if (!orders || orders.length === 0) {
            renderEmptyOrders();
            return;
        }

        const ordersHTML = `
            <div class="orders-container">
                ${orders.map(order => renderOrderCard(order)).join('')}
            </div>
        `;

        ordersContainer.innerHTML = ordersHTML;
    }

    function renderOrderCard(order) {
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);

        return `
            <div class="order-card">
                <div class="order-card-header">
                    <div class="order-card-info">
                        <h3>Order #${order.orderId}</h3>
                        <div class="order-card-date">${formatDate(order.createdAt)}</div>
                    </div>
                    <div class="order-card-status ${statusClass}">
                        ${statusText}
                    </div>
                </div>

                <div class="order-card-items">
                    ${order.items ? order.items.map(item => `
                        <div class="order-card-item">
                            <div class="order-item-info">
                                <div class="order-item-name">${item.productName}</div>
                                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                            </div>
                            <div class="order-item-price">${formatCurrency(item.subtotal)}</div>
                        </div>
                    `).join('') : '<p>No items in this order</p>'}
                </div>

                <div class="order-card-footer">
                    <div class="order-card-total">
                        <span class="order-card-total-label">Total:</span>
                        <span class="order-card-total-value">${formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div class="order-card-actions">
                        <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails(${order.orderId})">
                            View Details
                        </button>
                        ${order.status === 'PLACED' || order.status === 'PAYMENT_PENDING' ? `
                            <button class="btn btn-error btn-sm" onclick="cancelOrder(${order.orderId})">
                                Cancel Order
                            </button>
                        ` : ''}
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
                <div class="empty-state-subtext">You haven't placed any orders yet</div>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">
                    Start Shopping
                </button>
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

// Global function to view order details
function viewOrderDetails(orderId) {
    window.location.href = `order-success.html?orderId=${orderId}`;
}

// Global function to cancel order
async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }

    try {
        await API.orders.cancel(orderId);
        showMessage('Order cancelled successfully', 'success');
        // Reload the page to show updated order status
        window.location.reload();
    } catch (error) {
        handleApiError(error);
        showMessage('Failed to cancel order', 'error');
    }
}