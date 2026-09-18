// Common JavaScript Utilities

/**
 * Escape HTML to prevent Cross-Site Scripting (XSS)
 * @param {string|number|null|undefined} unsafe
 * @returns {string}
 */
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

/**
 * Get the JWT token
 * @returns {string|null}
 */
function getToken() {
    return localStorage.getItem('token');
}

/**
 * Get current user data
 * @returns {object|null}
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get current user role
 * @returns {string|null}
 */
function getCurrentRole() {
    return localStorage.getItem('role');
}

/**
 * Get current user ID
 * @returns {string|null}
 */
function getCurrentUserId() {
    return localStorage.getItem('userId');
}

/**
 * Check if current user is admin
 * @returns {boolean}
 */
function isAdmin() {
    return getCurrentRole() === 'ADMIN';
}

/**
 * Check if current user is customer
 * @returns {boolean}
 */
function isCustomer() {
    return getCurrentRole() === 'CUSTOMER';
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
}

/**
 * Require authentication - redirect to login if not authenticated
 * @param {string} redirectUrl - URL to redirect to after login (optional)
 */
function requireAuth(redirectUrl = null) {
    if (!isLoggedIn()) {
        if (redirectUrl) {
            sessionStorage.setItem('redirectAfterLogin', redirectUrl);
        }
        window.location.href = 'login.html';
    }
}

/**
 * Require admin role - redirect if not admin
 */
function requireAdmin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    if (!isAdmin()) {
        window.location.href = 'index.html';
    }
}

/**
 * Format currency as INR
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    if (amount === null || amount === undefined) {
        return '₹0.00';
    }

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Show a message to the user
 * @param {string} message - The message to display
 * @param {string} type - Message type: 'success', 'error', 'info', 'warning'
 * @param {HTMLElement} container - Container element to append message to (optional)
 */
function showMessage(message, type = 'info', container = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    if (container) {
        container.appendChild(messageDiv);
    } else {
        // Add to body if no container specified
        const existingContainer = document.getElementById('message-container');
        if (existingContainer) {
            existingContainer.appendChild(messageDiv);
        } else {
            const newContainer = document.createElement('div');
            newContainer.id = 'message-container';
            newContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
            newContainer.appendChild(messageDiv);
            document.body.appendChild(newContainer);
        }
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * Show loading state
 * @param {HTMLElement} element - Element to show loading in
 * @param {string} message - Loading message (optional)
 */
function showLoading(element, message = 'Loading...') {
    element.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Show error state
 * @param {HTMLElement} element - Element to show error in
 * @param {string} message - Error message
 * @param {Function} retryCallback - Optional retry callback
 */
function showError(element, message, retryCallback = null) {
    let html = `
        <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div class="empty-state-text">${message}</div>
    `;

    if (retryCallback) {
        html += `<button class="btn btn-primary mt-3" onclick="(${retryCallback.toString()})()">Retry</button>`;
    }

    html += '</div>';
    element.innerHTML = html;
}

/**
 * Show empty state
 * @param {HTMLElement} element - Element to show empty state in
 * @param {string} message - Empty state message
 * @param {string} subtext - Optional subtext
 */
function showEmpty(element, message, subtext = '') {
    element.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div class="empty-state-text">${message}</div>
            ${subtext ? `<div class="empty-state-subtext">${subtext}</div>` : ''}
        </div>
    `;
}

/**
 * Render header/navigation based on authentication state
 */
function renderHeader() {
    // Update profile button display and link if present
    const profileBtn = document.getElementById('headerProfileBtn');
    const profileText = document.querySelector('#headerProfileBtn .profile-text');
    if (profileBtn && profileText) {
        if (isLoggedIn()) {
            const user = getCurrentUser();
            const displayName = (user && user.name) ? escapeHtml(user.name.split(' ')[0]) : 'Profile';
            profileText.textContent = displayName;
            profileBtn.href = 'profile.html';
        } else {
            profileText.textContent = 'Profile';
            profileBtn.href = 'login.html';
        }
    }

    const header = document.querySelector('header nav ul');
    if (!header) return;

    if (isLoggedIn()) {
        const role = getCurrentRole();
        let navItems = '';

        if (role === 'ADMIN') {
            navItems = `
                <li><a href="index.html">Home</a></li>
                <li><a href="admin-dashboard.html">Dashboard</a></li>
                <li><a href="admin-products.html">Products</a></li>
                <li><a href="admin-orders.html">Orders</a></li>
                <li><a href="admin-users.html">Users</a></li>
                <li><a href="admin-inventory.html">Inventory</a></li>
                <li><a href="#" onclick="logout(); return false;">Logout</a></li>
            `;
        } else {
            navItems = `
                <li><a href="index.html">Home</a></li>
                <li><a href="index.html">Products</a></li>
                <li><a href="orders.html">Orders</a></li>
                <li><a href="#" onclick="logout(); return false;">Logout</a></li>
            `;
        }

        header.innerHTML = navItems;
    } else {
        header.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html">Products</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Register</a></li>
        `;
    }
}

/**
 * Get URL parameter by name
 * @param {string} name - Parameter name
 * @param {string} url - URL to search (optional, defaults to current URL)
 * @returns {string|null}
 */
function getUrlParameter(name, url = window.location.href) {
    const param = new URLSearchParams(new URL(url).search);
    return param.get(name);
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and strength
 */
function validatePassword(password) {
    const result = {
        isValid: false,
        strength: 'weak',
        errors: [],
    };

    if (password.length < 8) {
        result.errors.push('Password must be at least 8 characters');
    }

    if (!/[a-z]/.test(password)) {
        result.errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
        result.errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
        result.errors.push('Password must contain at least one number');
    }

    if (result.errors.length === 0) {
        result.isValid = true;

        // Determine strength
        if (password.length >= 12 && /[!@#$%^&*]/.test(password)) {
            result.strength = 'strong';
        } else if (password.length >= 10) {
            result.strength = 'medium';
        }
    }

    return result;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string}
 */
function truncateText(text, maxLength, suffix = '...') {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Initialize common functionality on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    renderHeader();

    // Update cart count if user is logged in
    if (isLoggedIn() && isCustomer()) {
        updateCartCount();
    }

    // Check for redirect after login
    const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
    if (redirectAfterLogin && isLoggedIn()) {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectAfterLogin;
    }
});

/**
 * Update cart count in header
 * This function is called from cart.js and product-details.js
 */
async function updateCartCount() {
    try {
        const cart = await API.cart.getAll();
        const totalCount = cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
        updateCartCountDisplay(totalCount);
    } catch (error) {
        // Silently fail for cart count updates
        console.error('Failed to update cart count:', error);
    }
}

/**
 * Update cart count display in header
 * @param {number} count - Total cart item count
 */
function updateCartCountDisplay(count) {
    // Update for old header structure
    const cartLink = document.querySelector('nav a[href="cart.html"]');
    if (cartLink) {
        if (count > 0) {
            cartLink.innerHTML = `Cart <span class="cart-count-badge">${count}</span>`;
        } else {
            cartLink.textContent = 'Cart';
        }
    }
    
    // Update for new home page structure
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = count;
        if (count > 0) {
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}
