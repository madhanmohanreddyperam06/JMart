// Order Success Page JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    requireAuth('index.html');

    const orderContainer = document.getElementById('orderContainer');
    const errorElement = document.getElementById('orderError');

    // Get order ID from URL
    const orderId = getUrlParameter('orderId');

    if (!orderId) {
        showError(orderContainer, 'Order ID is required');
        errorElement.textContent = 'Invalid order ID';
        errorElement.classList.remove('hidden');
        return;
    }

    // Validate order ID
    const numericId = parseInt(orderId, 10);
    if (isNaN(numericId) || numericId <= 0) {
        showError(orderContainer, 'Invalid order ID');
        errorElement.textContent = 'Invalid order ID';
        errorElement.classList.remove('hidden');
        return;
    }

    await loadOrderDetails(numericId);

    async function loadOrderDetails(id) {
        showLoading(orderContainer, 'Loading order details...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const order = await API.orders.getById(id);
            const payment = await API.payments.getByOrder(id);
            renderOrderSuccess(order, payment);
            updateCartCount();
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(orderContainer, 'Unable to load order details', () => loadOrderDetails(id));
            }
        }
    }

    function renderOrderSuccess(order, payment) {
        if (!order) {
            showError(orderContainer, 'Order not found');
            return;
        }

        const paymentStatus = payment ? payment.status : 'PENDING';
        const isSuccess = paymentStatus === 'SUCCESS';

        const orderHTML = `
            <div class="checkout-container order-success">
                <div class="order-summary">
                    <h2>Order Details</h2>
                    <div class="order-summary-items">
                        ${order.items ? order.items.map(item => `
                            <div class="order-summary-item">
                                <div class="order-item-info">
                                    <div class="order-item-name">${item.productName}</div>
                                    <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                                </div>
                                <div class="order-item-price">${formatCurrency(item.subtotal)}</div>
                            </div>
                        `).join('') : '<p>No items in this order</p>'}
                    </div>

                    <div class="order-summary-totals">
                        <div class="order-summary-row">
                            <span class="order-summary-label">Order ID:</span>
                            <span class="order-summary-value">#${order.orderId}</span>
                        </div>
                        <div class="order-summary-row">
                            <span class="order-summary-label">Order Date:</span>
                            <span class="order-summary-value">${formatDate(order.createdAt)}</span>
                        </div>
                        <div class="order-summary-row">
                            <span class="order-summary-label">Order Status:</span>
                            <span class="order-summary-value">${order.status}</span>
                        </div>
                        <div class="order-summary-row order-summary-total">
                            <span class="order-summary-label">Total Amount:</span>
                            <span class="order-summary-value">${formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <div class="payment-section">
                    <h2>Payment Status</h2>
                    <div class="payment-info">
                        <p><strong>Payment ID:</strong> ${payment ? payment.paymentId : 'N/A'}</p>
                        <p><strong>Gateway:</strong> ${payment ? payment.gateway : 'N/A'}</p>
                        <p><strong>Amount:</strong> ${payment ? formatCurrency(payment.amount) : 'N/A'}</p>
                        <p><strong>Status:</strong> <span class="${isSuccess ? 'text-success' : 'text-error'}">${paymentStatus}</span></p>
                    </div>

                    ${isSuccess ? `
                        <div class="payment-security">
                            <span class="payment-security-icon">✅</span>
                            <span>Your payment has been successfully verified and processed.</span>
                        </div>
                    ` : `
                        <div class="checkout-stock-warning">
                            <div class="checkout-stock-warning-text">Payment Pending</div>
                            <div class="checkout-stock-warning-subtext">Your payment is being processed. You will receive a confirmation email shortly.</div>
                        </div>
                    `}

                    <div class="cart-actions">
                        <button class="btn btn-primary" onclick="window.location.href='index.html'">
                            Continue Shopping
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.href='orders.html'">
                            View Order History
                        </button>
                    </div>
                </div>
            </div>
        `;

        orderContainer.innerHTML = orderHTML;
    }
});
