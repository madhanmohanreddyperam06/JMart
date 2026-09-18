// Payment JavaScript Utilities

/**
 * Load Razorpay Checkout script dynamically
 * @returns {Promise<void>}
 */
function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
        if (typeof Razorpay !== 'undefined') {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Check if Razorpay is loaded
 * @returns {boolean}
 */
function isRazorpayLoaded() {
    return typeof Razorpay !== 'undefined';
}

/**
 * Format payment amount for Razorpay (in paise)
 * @param {number} amount - Amount in rupees
 * @returns {number} - Amount in paise
 */
function formatAmountForRazorpay(amount) {
    return Math.round(amount * 100);
}

/**
 * Validate payment response from Razorpay
 * @param {object} response - Razorpay response object
 * @returns {boolean} - Whether the response is valid
 */
function validateRazorpayResponse(response) {
    return response &&
           response.razorpay_payment_id &&
           response.razorpay_order_id &&
           response.razorpay_signature;
}

/**
 * Handle payment error scenarios
 * @param {Error} error - Payment error
 * @param {HTMLElement} errorElement - Error display element
 */
function handlePaymentError(error, errorElement) {
    let errorMessage = 'Payment processing failed. Please try again.';

    if (error.message) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('Razorpay')) {
            errorMessage = 'Payment service error. Please try again later.';
        } else {
            errorMessage = error.message;
        }
    }

    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.remove('hidden');
    }

    return errorMessage;
}

/**
 * Check if payment can be retried based on error
 * @param {Error} error - Payment error
 * @returns {boolean} - Whether payment can be retried
 */
function canRetryPayment(error) {
    // Don't retry for authentication errors or permanent failures
    if (isAuthError(error)) {
        return false;
    }

    // Retry for network errors and temporary failures
    if (error.message && (
        error.message.includes('network') ||
        error.message.includes('timeout') ||
        error.message.includes('fetch')
    )) {
        return true;
    }

    // Default to allowing retry for other errors
    return true;
}

// Load Razorpay script on page load for checkout pages
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        loadRazorpayScript().catch(error => {
            console.error('Failed to load Razorpay script:', error);
        });
    }
});
