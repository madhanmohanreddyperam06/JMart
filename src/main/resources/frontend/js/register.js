// Registration Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkAuthAndRedirect(window.location.pathname);

    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const errorElement = document.getElementById('registerError');
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const passwordStrengthFill = document.getElementById('passwordStrengthFill');
    const passwordStrengthText = document.getElementById('passwordStrengthText');

    // Handle form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
        };

        await handleRegistration(formData, errorElement, submitButton);
    });

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
        updatePasswordStrength(password, passwordStrengthFill, passwordStrengthText);

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

    // Real-time validation for phone
    phoneInput.addEventListener('blur', () => {
        const phone = phoneInput.value.trim();
        if (phone && phone.length > 20) {
            setInputValidation(phoneInput, false);
        } else if (phone) {
            setInputValidation(phoneInput, true);
        } else {
            phoneInput.classList.remove('valid', 'invalid');
        }
    });

    phoneInput.addEventListener('input', () => {
        if (phoneInput.classList.contains('invalid')) {
            const phone = phoneInput.value.trim();
            if (phone.length <= 20) {
                setInputValidation(phoneInput, true);
            }
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

    // Allow form submission with Enter key
    registerForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !submitButton.disabled) {
            e.preventDefault();
            registerForm.dispatchEvent(new Event('submit'));
        }
    });
});
