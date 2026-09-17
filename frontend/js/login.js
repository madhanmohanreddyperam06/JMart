// Login Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkAuthAndRedirect(window.location.pathname);

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorElement = document.getElementById('loginError');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        await handleLogin(email, password, errorElement, submitButton);
    });

    // Real-time validation
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

    passwordInput.addEventListener('blur', () => {
        const password = passwordInput.value;
        if (password && password.length < 8) {
            setInputValidation(passwordInput, false);
        } else if (password) {
            setInputValidation(passwordInput, true);
        } else {
            passwordInput.classList.remove('valid', 'invalid');
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('invalid')) {
            const password = passwordInput.value;
            if (password.length >= 8) {
                setInputValidation(passwordInput, true);
            }
        }
    });

    // Allow form submission with Enter key
    loginForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !submitButton.disabled) {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
