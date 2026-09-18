// Checkout Page JavaScript

let currentOrder = null;
let isProcessingPayment = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    requireAuth('checkout.html');

    const checkoutContainer = document.getElementById('checkoutContainer');
    const errorElement = document.getElementById('checkoutError');

    // Load checkout data
    await loadCheckout();

    async function loadCheckout() {
        showLoading(checkoutContainer, 'Loading checkout...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            // First, get current cart
            const cart = await API.cart.getAll();

            if (!cart || !cart.items || cart.items.length === 0) {
                renderEmptyCheckout();
                return;
            }

            // Create order from cart
            const order = await API.orders.checkout();
            currentOrder = order;

            renderCheckout(order, cart);
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(checkoutContainer, 'Unable to load checkout', () => loadCheckout());
            }
        }
    }

    function renderCheckout(order, cart) {
        if (!order || !cart || !cart.items || cart.items.length === 0) {
            renderEmptyCheckout();
            return;
        }

        const checkoutHTML = `
            <div class="checkout-container">
                <div class="order-summary">
                    <h2>Order Summary</h2>
                    <div class="order-summary-items">
                        ${cart.items.map(item => `
                            <div class="order-summary-item">
                                <div class="order-item-info">
                                    <div class="order-item-name">${escapeHtml(item.productName)}</div>
                                    <div class="order-item-quantity">Quantity: ${escapeHtml(item.quantity)}</div>
                                </div>
                                <div class="order-item-price">${formatCurrency(item.subtotal)}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="order-summary-totals">
                        <div class="order-summary-row">
                            <span class="order-summary-label">Subtotal:</span>
                            <span class="order-summary-value">${formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div class="order-summary-row">
                            <span class="order-summary-label">Shipping:</span>
                            <span class="order-summary-value">Free</span>
                        </div>
                        <div class="order-summary-row order-summary-total">
                            <span class="order-summary-label">Total:</span>
                            <span class="order-summary-value">${formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <div class="payment-section">
                    <h2>Payment</h2>
                    <div class="payment-info">
                        <p><strong>Order ID:</strong> #${escapeHtml(order.orderId)}</p>
                        <p><strong>Total Amount:</strong> ${formatCurrency(order.totalAmount)}</p>
                        <p><strong>Payment Method:</strong> Razorpay (Secure)</p>
                    </div>

                    <div class="payment-security">
                        <span class="payment-security-icon">🔒</span>
                        <span>Your payment is secured with Razorpay's industry-standard encryption.</span>
                    </div>

                    <button class="pay-button" id="payButton" onclick="initiatePayment()">
                        Pay Now
                    </button>
                </div>
            </div>
        `;

        checkoutContainer.innerHTML = checkoutHTML;
    }

    function renderEmptyCheckout() {
        checkoutContainer.innerHTML = `
            <div class="checkout-empty">
                <div class="checkout-empty-icon">🛒</div>
                <div class="checkout-empty-text">Your cart is empty</div>
                <div class="checkout-empty-subtext">Add items to your cart before checkout</div>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">
                    Continue Shopping
                </button>
            </div>
        `;
    }
});

// Global function to initiate payment
async function initiatePayment() {
    if (isProcessingPayment || !currentOrder) {
        return;
    }

    isProcessingPayment = true;
    const payButton = document.getElementById('payButton');
    const errorElement = document.getElementById('checkoutError');

    if (payButton) {
        payButton.disabled = true;
        payButton.classList.add('loading');
        payButton.textContent = 'Preparing payment...';
    }

    try {
        // Create payment order
        const paymentOrder = await API.payments.createOrder(currentOrder.orderId);

        // Initialize Razorpay checkout
        if (typeof Razorpay !== 'undefined') {
            openRazorpayCheckout(paymentOrder);
        } else {
            throw new Error('Payment service is currently unavailable. Please try again later.');
        }
    } catch (error) {
        handleApiError(error, errorElement);
        showMessage('Failed to initialize payment', 'error');

        if (payButton) {
            payButton.disabled = false;
            payButton.classList.remove('loading');
            payButton.textContent = 'Pay Now';
        }

        isProcessingPayment = false;
    }
}

function openRazorpayCheckout(paymentOrder) {
    const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'E-Commerce Platform',
        description: `Order #${paymentOrder.orderId}`,
        order_id: paymentOrder.gatewayOrderId,
        handler: function(response) {
            // Payment successful - verify with backend
            verifyPayment(response, paymentOrder.orderId);
        },
        prefill: {
            name: getCurrentUser()?.name || '',
            email: getCurrentUser()?.email || ''
        },
        theme: {
            color: '#1a365d'
        },
        modal: {
            ondismiss: function() {
                // Payment cancelled by user
                isProcessingPayment = false;
                const payButton = document.getElementById('payButton');
                if (payButton) {
                    payButton.disabled = false;
                    payButton.classList.remove('loading');
                    payButton.textContent = 'Pay Now';
                }
                showMessage('Payment cancelled', 'info');
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

async function verifyPayment(razorpayResponse, orderId) {
    const checkoutContainer = document.getElementById('checkoutContainer');
    const errorElement = document.getElementById('checkoutError');

    // Show processing state
    checkoutContainer.innerHTML = `
        <div class="payment-processing">
            <div class="payment-processing-icon">⏳</div>
            <div class="payment-processing-text">Verifying payment...</div>
        </div>
    `;

    try {
        const verificationData = {
            orderId: orderId,
            gatewayOrderId: razorpayResponse.razorpay_order_id,
            gatewayPaymentId: razorpayResponse.razorpay_payment_id,
            signature: razorpayResponse.razorpay_signature
        };

        const paymentResponse = await API.payments.verify(verificationData);

        if (paymentResponse.status === 'SUCCESS') {
            // Payment successful - redirect to order success page
            window.location.href = `order-success.html?orderId=${orderId}`;
        } else {
            // Payment verification failed
            renderPaymentFailure('Payment verification failed. Please try again.');
        }
    } catch (error) {
        handleApiError(error, errorElement);
        renderPaymentFailure('Payment verification failed. Please try again.');
    }
}

function renderPaymentFailure(message) {
    const checkoutContainer = document.getElementById('checkoutContainer');

    checkoutContainer.innerHTML = `
        <div class="payment-failure">
            <div class="payment-failure-icon">❌</div>
            <div class="payment-failure-text">Payment Failed</div>
            <div class="payment-failure-subtext">${message}</div>
            <div class="payment-failure-actions">
                <button class="btn btn-primary" onclick="initiatePayment()">Try Again</button>
                <button class="btn btn-secondary" onclick="window.location.href='cart.html'">Back to Cart</button>
            </div>
        </div>
    `;

    isProcessingPayment = false;
}
