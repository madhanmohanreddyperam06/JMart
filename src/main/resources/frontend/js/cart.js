// Shopping Cart JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    requireAuth('cart.html');

    const cartContainer = document.getElementById('cartContainer');
    const errorElement = document.getElementById('cartError');

    // Load cart on page load
    await loadCart();

    async function loadCart() {
        showLoading(cartContainer, 'Loading cart...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const cart = await API.cart.getAll();
            renderCart(cart);
            updateCartCount();
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(cartContainer, 'Unable to load cart', () => loadCart());
            }
        }
    }

    function renderCart(cart) {
        if (!cart || !cart.items || cart.items.length === 0) {
            renderEmptyCart();
            return;
        }

        const cartHTML = `
            <div class="cart-container">
                <table class="cart-table cart-desktop-only">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.items.map(item => renderCartItemRow(item)).join('')}
                    </tbody>
                </table>

                <div class="cart-mobile-only">
                    ${cart.items.map(item => renderCartItemMobile(item)).join('')}
                </div>

                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span class="cart-summary-label">Total Items:</span>
                        <span class="cart-summary-value">${getTotalItemCount(cart.items)}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span class="cart-summary-label">Total Amount:</span>
                        <span class="cart-summary-value cart-summary-total">${formatCurrency(cart.totalAmount)}</span>
                    </div>
                </div>

                <div class="cart-actions">
                    <button class="btn btn-secondary" onclick="window.location.href='index.html'">
                        Continue Shopping
                    </button>
                    <button class="btn btn-primary" onclick="window.location.href='checkout.html'">
                        Proceed to Checkout
                    </button>
                    <button class="btn btn-error" onclick="confirmClearCart()">
                        Clear Cart
                    </button>
                </div>
            </div>
        `;

        cartContainer.innerHTML = cartHTML;

        // Add event listeners for quantity controls
        cart.items.forEach(item => {
            attachQuantityListeners(item);
        });
    }

    function renderCartItemRow(item) {
        return `
            <tr data-item-id="${item.itemId}">
                <td>
                    <div class="cart-product-info">
                        <div class="cart-product-image">📦</div>
                        <div class="cart-product-details">
                            <div class="cart-product-name">${item.productName}</div>
                            <div class="cart-product-id">ID: ${item.productId}</div>
                        </div>
                    </div>
                </td>
                <td class="cart-price">${formatCurrency(item.price)}</td>
                <td>
                    <div class="cart-quantity">
                        <button class="cart-quantity-btn decrease-btn" data-item-id="${item.itemId}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" class="cart-quantity-input" data-item-id="${item.itemId}" value="${item.quantity}" min="1" readonly>
                        <button class="cart-quantity-btn increase-btn" data-item-id="${item.itemId}">+</button>
                    </div>
                </td>
                <td class="cart-subtotal">${formatCurrency(item.subtotal)}</td>
                <td>
                    <button class="cart-remove-btn" data-item-id="${item.itemId}">Remove</button>
                </td>
            </tr>
        `;
    }

    function renderCartItemMobile(item) {
        return `
            <div class="cart-item-mobile" data-item-id="${item.itemId}">
                <div class="cart-item-mobile-header">
                    <div class="cart-item-mobile-image">📦</div>
                    <div class="cart-item-mobile-details">
                        <div class="cart-item-mobile-name">${item.productName}</div>
                        <div class="cart-item-mobile-price">${formatCurrency(item.price)}</div>
                    </div>
                </div>
                <div class="cart-item-mobile-info">
                    <div class="cart-item-mobile-quantity">
                        <button class="cart-quantity-btn decrease-btn" data-item-id="${item.itemId}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" class="cart-quantity-input" data-item-id="${item.itemId}" value="${item.quantity}" min="1" readonly>
                        <button class="cart-quantity-btn increase-btn" data-item-id="${item.itemId}">+</button>
                    </div>
                    <div class="cart-item-mobile-subtotal">${formatCurrency(item.subtotal)}</div>
                </div>
                <div class="cart-item-mobile-actions">
                    <button class="cart-remove-btn" data-item-id="${item.itemId}">Remove</button>
                </div>
            </div>
        `;
    }

    function renderEmptyCart() {
        cartContainer.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <div class="cart-empty-text">Your cart is empty</div>
                <div class="cart-empty-subtext">Start shopping and add products to your cart</div>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">
                    Continue Shopping
                </button>
            </div>
        `;
    }

    function attachQuantityListeners(item) {
        const decreaseBtn = document.querySelector(`.decrease-btn[data-item-id="${item.itemId}"]`);
        const increaseBtn = document.querySelector(`.increase-btn[data-item-id="${item.itemId}"]`);
        const removeBtn = document.querySelector(`.cart-remove-btn[data-item-id="${item.itemId}"]`);

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => updateQuantity(item.itemId, item.quantity - 1));
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => updateQuantity(item.itemId, item.quantity + 1));
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeItem(item.itemId));
        }
    }

    async function updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1) return;

        // Disable buttons during update
        const decreaseBtn = document.querySelector(`.decrease-btn[data-item-id="${itemId}"]`);
        const increaseBtn = document.querySelector(`.increase-btn[data-item-id="${itemId}"]`);
        if (decreaseBtn) decreaseBtn.disabled = true;
        if (increaseBtn) increaseBtn.disabled = true;

        try {
            await API.cart.updateItem(itemId, newQuantity);
            await loadCart();
        } catch (error) {
            handleApiError(error, errorElement);
            showMessage('Failed to update quantity', 'error');

            // Re-enable buttons
            if (decreaseBtn) decreaseBtn.disabled = false;
            if (increaseBtn) increaseBtn.disabled = false;
        }
    }

    async function removeItem(itemId) {
        if (!confirm('Are you sure you want to remove this item from your cart?')) {
            return;
        }

        try {
            await API.cart.deleteItem(itemId);
            await loadCart();
            showMessage('Item removed from cart', 'success');
        } catch (error) {
            handleApiError(error, errorElement);
            showMessage('Failed to remove item', 'error');
        }
    }

    async function confirmClearCart() {
        if (!confirm('Are you sure you want to remove all items from your cart?')) {
            return;
        }

        try {
            await API.cart.clear();
            await loadCart();
            showMessage('Cart cleared successfully', 'success');
        } catch (error) {
            handleApiError(error, errorElement);
            showMessage('Failed to clear cart', 'error');
        }
    }

    function getTotalItemCount(items) {
        return items.reduce((total, item) => total + item.quantity, 0);
    }
});
