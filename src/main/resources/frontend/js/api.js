// API Configuration and Helper Functions

// Centralized API Base URL
const API_BASE_URL = "http://localhost:8080/api";

/**
 * Makes an API request with proper headers and error handling
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<object>} - The parsed JSON response
 * @throws {Error} - Error with user-friendly message
 */
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add JWT token if available
    const token = localStorage.getItem('token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge with provided options
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            // Handle structured error responses from backend
            if (data.message) {
                throw new Error(data.message);
            }
            if (data.error) {
                throw new Error(data.error);
            }
            if (data.status && data.message) {
                throw new Error(data.message);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
    }
}

/**
 * API Endpoints
 */
const API = {
    // Authentication
    auth: {
        register: (userData) => apiRequest(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(userData),
        }),
        login: (credentials) => apiRequest(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
    },

    // Products
    products: {
        getAll: () => apiRequest(`${API_BASE_URL}/products`),
        getById: (id) => apiRequest(`${API_BASE_URL}/products/${id}`),
        search: (name) => apiRequest(`${API_BASE_URL}/products/search?name=${encodeURIComponent(name)}`),
        getByBrand: (brand) => apiRequest(`${API_BASE_URL}/products/brand/${encodeURIComponent(brand)}`),
        getByPriceRange: (minPrice, maxPrice) => apiRequest(
            `${API_BASE_URL}/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`
        ),
        getByCategory: (categoryId) => apiRequest(`${API_BASE_URL}/products/category/${categoryId}`),
    },

    // Categories
    categories: {
        getAll: () => apiRequest(`${API_BASE_URL}/categories`),
        getById: (id) => apiRequest(`${API_BASE_URL}/categories/${id}`),
    },

    // Users
    users: {
        getById: (id) => apiRequest(`${API_BASE_URL}/users/${id}`),
        update: (id, userData) => apiRequest(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        }),
    },

    // Cart
    cart: {
        getAll: () => apiRequest(`${API_BASE_URL}/cart`),
        addItem: (item) => apiRequest(`${API_BASE_URL}/cart/items`, {
            method: 'POST',
            body: JSON.stringify(item),
        }),
        updateItem: (id, quantity) => apiRequest(`${API_BASE_URL}/cart/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        }),
        deleteItem: (id) => apiRequest(`${API_BASE_URL}/cart/items/${id}`, {
            method: 'DELETE',
        }),
        clear: () => apiRequest(`${API_BASE_URL}/cart`, {
            method: 'DELETE',
        }),
    },

    // Orders
    orders: {
        checkout: () => apiRequest(`${API_BASE_URL}/orders/checkout`, {
            method: 'POST',
        }),
        getAll: () => apiRequest(`${API_BASE_URL}/orders`),
        getById: (id) => apiRequest(`${API_BASE_URL}/orders/${id}`),
        cancel: (id) => apiRequest(`${API_BASE_URL}/orders/${id}/cancel`, {
            method: 'PUT',
        }),
    },

    // Payments
    payments: {
        createOrder: (orderId) => apiRequest(`${API_BASE_URL}/payments/create-order`, {
            method: 'POST',
            body: JSON.stringify({ orderId }),
        }),
        verify: (verificationData) => apiRequest(`${API_BASE_URL}/payments/verify`, {
            method: 'POST',
            body: JSON.stringify(verificationData),
        }),
        getByOrder: (orderId) => apiRequest(`${API_BASE_URL}/payments/order/${orderId}`),
    },

    // Admin
    admin: {
        // Dashboard
        getDashboard: () => apiRequest(`${API_BASE_URL}/admin/dashboard`),

        // Products
        products: {
            getAll: () => apiRequest(`${API_BASE_URL}/admin/products`),
            getById: (id) => apiRequest(`${API_BASE_URL}/admin/products/${id}`),
            create: (productData) => apiRequest(`${API_BASE_URL}/admin/products`, {
                method: 'POST',
                body: JSON.stringify(productData),
            }),
            update: (id, productData) => apiRequest(`${API_BASE_URL}/admin/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(productData),
            }),
            delete: (id) => apiRequest(`${API_BASE_URL}/admin/products/${id}`, {
                method: 'DELETE',
            }),
            search: (name) => apiRequest(`${API_BASE_URL}/admin/products/search?name=${encodeURIComponent(name)}`),
        },

        // Categories
        categories: {
            getAll: () => apiRequest(`${API_BASE_URL}/admin/categories`),
            getById: (id) => apiRequest(`${API_BASE_URL}/admin/categories/${id}`),
            create: (categoryData) => apiRequest(`${API_BASE_URL}/admin/categories`, {
                method: 'POST',
                body: JSON.stringify(categoryData),
            }),
            update: (id, categoryData) => apiRequest(`${API_BASE_URL}/admin/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(categoryData),
            }),
            delete: (id) => apiRequest(`${API_BASE_URL}/admin/categories/${id}`, {
                method: 'DELETE',
            }),
        },

        // Orders
        orders: {
            getAll: () => apiRequest(`${API_BASE_URL}/admin/orders`),
            getById: (id) => apiRequest(`${API_BASE_URL}/admin/orders/${id}`),
            updateStatus: (id, status) => apiRequest(`${API_BASE_URL}/admin/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status }),
            }),
        },

        // Users
        users: {
            getAll: () => apiRequest(`${API_BASE_URL}/admin/users`),
            getById: (id) => apiRequest(`${API_BASE_URL}/admin/users/${id}`),
            updateRole: (userId, role) => apiRequest(`${API_BASE_URL}/admin/users/${userId}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role }),
            }),
        },

        // Inventory
        inventory: {
            getAll: () => apiRequest(`${API_BASE_URL}/admin/inventory`),
            getLowStock: () => apiRequest(`${API_BASE_URL}/admin/inventory/low-stock`),
            getOutOfStock: () => apiRequest(`${API_BASE_URL}/admin/inventory/out-of-stock`),
            update: (productId, quantity) => apiRequest(`${API_BASE_URL}/admin/inventory/${productId}`, {
                method: 'PUT',
                body: JSON.stringify({ quantity }),
            }),
        },

        // Payments
        payments: {
            getAll: () => apiRequest(`${API_BASE_URL}/admin/payments`),
            getById: (id) => apiRequest(`${API_BASE_URL}/admin/payments/${id}`),
        },
    },
};

/**
 * Utility function to handle API errors consistently
 * @param {Error} error - The error object
 * @param {HTMLElement} errorElement - Optional element to display error in
 * @returns {string} - User-friendly error message
 */
function handleApiError(error, errorElement = null) {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.message) {
        errorMessage = error.message;
    }

    // Display error in element if provided
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.remove('hidden');
    }

    return errorMessage;
}

/**
 * Check if API response indicates authentication failure
 * @param {Error} error - The error object
 * @returns {boolean} - True if authentication failed
 */
function isAuthError(error) {
    if (error.message && error.message.includes('401')) {
        return true;
    }
    if (error.message && error.message.toLowerCase().includes('unauthorized')) {
        return true;
    }
    if (error.message && error.message.toLowerCase().includes('token')) {
        return true;
    }
    return false;
}

/**
 * Handle authentication errors by redirecting to login
 * @param {Error} error - The error object
 */
function handleAuthError(error) {
    if (isAuthError(error)) {
        // Clear stored auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');

        // Redirect to login
        window.location.href = 'login.html';
    }
}
