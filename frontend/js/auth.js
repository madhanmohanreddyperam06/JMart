// Authentication Helper Functions

/**
 * Store authentication data after successful login
 * @param {object} loginResponse - Login response from API
 */
function storeAuthData(loginResponse) {
    localStorage.setItem('token', loginResponse.token);
    localStorage.setItem('userId', loginResponse.userId);
    localStorage.setItem('role', loginResponse.role);

    // Store user object (safe data only)
    const userData = {
        id: loginResponse.userId,
        name: loginResponse.name,
        email: loginResponse.email,
        role: loginResponse.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));
}

/**
 * Handle successful login
 * @param {object} loginResponse - Login response from API
 */
function handleLoginSuccess(loginResponse) {
    storeAuthData(loginResponse);

    // Redirect based on role
    if (loginResponse.role === 'ADMIN') {
        window.location.href = 'admin-dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

/**
 * Handle successful registration
 * @param {object} userResponse - User response from API
 */
function handleRegistrationSuccess(userResponse) {
    showMessage('Registration successful! Please login.', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

/**
 * Validate login form
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} - Validation result with isValid and errors
 */
function validateLoginForm(email, password) {
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address');
    }

    if (!password) {
        errors.push('Password is required');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate registration form
 * @param {object} formData - Registration form data
 * @returns {object} - Validation result with isValid and errors
 */
function validateRegistrationForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.trim() === '') {
        errors.push('Name is required');
    } else if (formData.name.length > 100) {
        errors.push('Name must not exceed 100 characters');
    }

    if (!formData.email || formData.email.trim() === '') {
        errors.push('Email is required');
    } else if (!isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    } else if (formData.email.length > 150) {
        errors.push('Email must not exceed 150 characters');
    }

    if (!formData.password) {
        errors.push('Password is required');
    } else {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }
    }

    if (formData.phone && formData.phone.length > 20) {
        errors.push('Phone number must not exceed 20 characters');
    }

    if (formData.address && formData.address.length > 255) {
        errors.push('Address must not exceed 255 characters');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Display form validation errors
 * @param {object} errors - Array of error messages
 * @param {HTMLElement} errorElement - Element to display errors in
 */
function displayFormErrors(errors, errorElement) {
    if (errors.length > 0) {
        errorElement.innerHTML = errors.map(error => `<div class="error-message">${error}</div>`).join('');
        errorElement.classList.remove('hidden');
    } else {
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');
    }
}

/**
 * Clear form validation errors
 * @param {HTMLElement} errorElement - Element containing errors
 */
function clearFormErrors(errorElement) {
    errorElement.innerHTML = '';
    errorElement.classList.add('hidden');
}

/**
 * Set input field validation state
 * @param {HTMLElement} inputElement - Input element
 * @param {boolean} isValid - Whether the input is valid
 */
function setInputValidation(inputElement, isValid) {
    if (isValid) {
        inputElement.classList.remove('invalid');
        inputElement.classList.add('valid');
    } else {
        inputElement.classList.remove('valid');
        inputElement.classList.add('invalid');
    }
}

/**
 * Update password strength indicator
 * @param {string} password - Password to check
 * @param {HTMLElement} strengthBar - Strength bar element
 * @param {HTMLElement} strengthText - Strength text element
 */
function updatePasswordStrength(password, strengthBar, strengthText) {
    const validation = validatePassword(password);

    // Remove all strength classes
    strengthBar.classList.remove('password-strength-weak', 'password-strength-medium', 'password-strength-strong');

    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        return;
    }

    if (validation.strength === 'strong') {
        strengthBar.classList.add('password-strength-strong');
        strengthText.textContent = 'Strong';
    } else if (validation.strength === 'medium') {
        strengthBar.classList.add('password-strength-medium');
        strengthText.textContent = 'Medium';
    } else {
        strengthBar.classList.add('password-strength-weak');
        strengthText.textContent = 'Weak';
    }
}

/**
 * Handle login API call
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {HTMLElement} errorElement - Element to display errors
 * @param {HTMLElement} submitButton - Submit button to disable during loading
 */
async function handleLogin(email, password, errorElement, submitButton) {
    // Validate form
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
        displayFormErrors(validation.errors, errorElement);
        return;
    }

    clearFormErrors(errorElement);

    // Disable submit button and show loading
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="auth-loading"><div class="spinner"></div> Logging in...</span>';

    try {
        const response = await API.auth.login({ email, password });
        handleLoginSuccess(response);
    } catch (error) {
        displayFormErrors([error.message], errorElement);
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

/**
 * Handle registration API call
 * @param {object} formData - Registration form data
 * @param {HTMLElement} errorElement - Element to display errors
 * @param {HTMLElement} submitButton - Submit button to disable during loading
 */
async function handleRegistration(formData, errorElement, submitButton) {
    // Validate form
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
        displayFormErrors(validation.errors, errorElement);
        return;
    }

    clearFormErrors(errorElement);

    // Disable submit button and show loading
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="auth-loading"><div class="spinner"></div> Registering...</span>';

    try {
        const response = await API.auth.register(formData);
        handleRegistrationSuccess(response);
    } catch (error) {
        displayFormErrors([error.message], errorElement);
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

/**
 * Check if user is already logged in and redirect if necessary
 * @param {string} currentPath - Current page path
 */
function checkAuthAndRedirect(currentPath) {
    if (isLoggedIn()) {
        const role = getCurrentRole();

        // If already logged in and on login/register page, redirect appropriately
        if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
            if (role === 'ADMIN') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    }
}
