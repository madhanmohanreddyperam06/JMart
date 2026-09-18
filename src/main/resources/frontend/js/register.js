// Registration Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkAuthAndRedirect(window.location.pathname);

    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const mobileInput = document.getElementById('mobile');
    const countryCodeSelect = document.getElementById('countryCode');
    const addressInput = document.getElementById('address');
    const errorElement = document.getElementById('registerError');
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const passwordStrengthValue = document.getElementById('passwordStrengthValue');
    const passwordMatchValue = document.getElementById('passwordMatchValue');
    const mobileValidationText = document.getElementById('mobileValidationText');

    // Handle form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields before submission
        const isFormValid = validateForm();
        if (!isFormValid) {
            return;
        }

        const fullPhone = countryCodeSelect.value + mobileInput.value.trim();
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value,
            phone: fullPhone,
            mobile: fullPhone,
            address: addressInput.value.trim(),
        };

        await handleRegistration(formData, errorElement, submitButton);
    });

    // Form validation function
    function validateForm() {
        let isValid = true;

        // Validate name
        if (!nameInput.value.trim()) {
            setInputValidation(nameInput, false);
            isValid = false;
        }

        // Validate email
        if (!isValidEmail(emailInput.value.trim())) {
            setInputValidation(emailInput, false);
            isValid = false;
        }

        // Validate password
        const passwordValidation = validatePassword(passwordInput.value);
        if (!passwordValidation.isValid) {
            setInputValidation(passwordInput, false);
            isValid = false;
        }

        // Validate confirm password
        if (passwordInput.value !== confirmPasswordInput.value) {
            setInputValidation(confirmPasswordInput, false);
            isValid = false;
        }

        // Validate mobile
        if (!isValidMobile(mobileInput.value.trim())) {
            setInputValidation(mobileInput, false);
            isValid = false;
        }

        // Validate address
        if (!addressInput.value.trim()) {
            setInputValidation(addressInput, false);
            isValid = false;
        }

        return isValid;
    }

    // Real-time validation for name
    nameInput.addEventListener('blur', () => {
        const name = nameInput.value.trim();
        if (name && name.length > 100) {
            setInputValidation(nameInput, false);
        } else if (name) {
            setInputValidation(nameInput, true);
        } else {
            nameInput.classList.remove('valid', 'invalid');
        }
    });

    nameInput.addEventListener('input', () => {
        if (nameInput.classList.contains('invalid')) {
            const name = nameInput.value.trim();
            if (name.length <= 100) {
                setInputValidation(nameInput, true);
            }
        }
    });

    // Real-time validation for email
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            setInputValidation(emailInput, false);
        } else if (email) {
            setInputValidation(emailInput, true);
        } else {
            emailInput.classList.remove('valid', 'invalid');
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('invalid')) {
            const email = emailInput.value.trim();
            if (isValidEmail(email)) {
                setInputValidation(emailInput, true);
            }
        }
    });

    // Real-time validation and strength indicator for password
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        updatePasswordStrength(password, passwordStrengthValue);

        // Update confirm password match if it has value
        if (confirmPasswordInput.value) {
            updatePasswordMatch(password, confirmPasswordInput.value, passwordMatchValue);
        }

        if (passwordInput.classList.contains('invalid')) {
            const validation = validatePassword(password);
            if (validation.isValid) {
                setInputValidation(passwordInput, true);
            }
        }
    });

    passwordInput.addEventListener('blur', () => {
        const password = passwordInput.value;
        const validation = validatePassword(password);
        setInputValidation(passwordInput, validation.isValid);
    });

    // Real-time validation for confirm password
    confirmPasswordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        updatePasswordMatch(password, confirmPassword, passwordMatchValue);

        if (confirmPassword && password === confirmPassword) {
            setInputValidation(confirmPasswordInput, true);
        } else if (confirmPassword) {
            setInputValidation(confirmPasswordInput, false);
        } else {
            confirmPasswordInput.classList.remove('valid', 'invalid');
        }
    });

    confirmPasswordInput.addEventListener('blur', () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (confirmPassword && password === confirmPassword) {
            setInputValidation(confirmPasswordInput, true);
        } else if (confirmPassword) {
            setInputValidation(confirmPasswordInput, false);
        } else {
            confirmPasswordInput.classList.remove('valid', 'invalid');
        }
    });

    // Real-time validation for mobile
    mobileInput.addEventListener('input', () => {
        const mobile = mobileInput.value.trim();
        // Only allow numbers
        mobileInput.value = mobile.replace(/[^0-9]/g, '');
        
        if (mobileInput.classList.contains('invalid')) {
            if (isValidMobile(mobileInput.value.trim())) {
                setInputValidation(mobileInput, true);
                mobileValidationText.textContent = 'Valid mobile number';
                mobileValidationText.className = 'mobile-validation-text valid';
            }
        }
        
        // Live validation text
        if (mobileInput.value.length === 10) {
            if (isValidMobile(mobileInput.value.trim())) {
                mobileValidationText.textContent = 'Valid mobile number';
                mobileValidationText.className = 'mobile-validation-text valid';
            } else {
                mobileValidationText.textContent = 'Invalid mobile number';
                mobileValidationText.className = 'mobile-validation-text invalid';
            }
        } else if (mobileInput.value.length > 0) {
            mobileValidationText.textContent = `Enter ${10 - mobileInput.value.length} more digits`;
            mobileValidationText.className = 'mobile-validation-text';
        } else {
            mobileValidationText.textContent = '';
        }
    });

    mobileInput.addEventListener('blur', () => {
        const mobile = mobileInput.value.trim();
        if (mobile && !isValidMobile(mobile)) {
            setInputValidation(mobileInput, false);
            mobileValidationText.textContent = 'Invalid mobile number';
            mobileValidationText.className = 'mobile-validation-text invalid';
        } else if (mobile) {
            setInputValidation(mobileInput, true);
            mobileValidationText.textContent = 'Valid mobile number';
            mobileValidationText.className = 'mobile-validation-text valid';
        } else {
            mobileInput.classList.remove('valid', 'invalid');
            mobileValidationText.textContent = '';
        }
    });

    // Real-time validation for address
    addressInput.addEventListener('blur', () => {
        const address = addressInput.value.trim();
        if (address && address.length > 255) {
            setInputValidation(addressInput, false);
        } else if (address) {
            setInputValidation(addressInput, true);
        } else {
            addressInput.classList.remove('valid', 'invalid');
        }
    });

    addressInput.addEventListener('input', () => {
        if (addressInput.classList.contains('invalid')) {
            const address = addressInput.value.trim();
            if (address.length <= 255) {
                setInputValidation(addressInput, true);
            }
        }
    });

    // Password strength update function
    function updatePasswordStrength(password, strengthElement) {
        if (!password) {
            strengthElement.textContent = '-';
            strengthElement.className = 'strength-value';
            return;
        }

        const strength = calculatePasswordStrength(password);
        strengthElement.textContent = strength.label;
        strengthElement.className = `strength-value ${strength.class}`;
    }

    // Password match update function
    function updatePasswordMatch(password, confirmPassword, matchElement) {
        if (!confirmPassword) {
            matchElement.textContent = '-';
            matchElement.className = 'match-value';
            return;
        }

        if (password === confirmPassword) {
            matchElement.textContent = 'Yes';
            matchElement.className = 'match-value match';
        } else {
            matchElement.textContent = 'No';
            matchElement.className = 'match-value no-match';
        }
    }

    // Calculate password strength
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) {
            return { label: 'Weak', class: 'weak' };
        } else if (strength <= 4) {
            return { label: 'Medium', class: 'medium' };
        } else {
            return { label: 'Strong', class: 'strong' };
        }
    }

    // Validate mobile number (10 digits)
    function isValidMobile(mobile) {
        return /^[0-9]{10}$/.test(mobile);
    }

    // Allow form submission with Enter key
    registerForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !submitButton.disabled) {
            e.preventDefault();
            registerForm.dispatchEvent(new Event('submit'));
        }
    });
});
