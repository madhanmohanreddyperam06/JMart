// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    requireAuth('profile.html');

    const profileContainer = document.getElementById('profileContainer');
    const errorElement = document.getElementById('profileError');

    // Load profile on page load
    await loadProfile();

    async function loadProfile() {
        showLoading(profileContainer, 'Loading profile...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const userId = getCurrentUserId();
            const user = await API.users.getById(userId);
            renderProfile(user);
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(profileContainer, 'Unable to load profile', () => loadProfile());
            }
        }
    }

    function renderProfile(user) {
        if (!user) {
            showError(profileContainer, 'Profile not found');
            return;
        }

        const profileHTML = `
            <div class="profile-container">
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <div class="profile-avatar-placeholder">👤</div>
                        </div>
                        <div class="profile-info">
                            <h2>${escapeHtml(user.name)}</h2>
                            <div class="profile-role">
                                <span class="role-badge">${escapeHtml(user.role)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="profile-section">
                        <h3>Account Information</h3>
                        <div class="profile-info-grid">
                            <div class="profile-info-item">
                                <label>User ID</label>
                                <div class="profile-info-value">${escapeHtml(user.id)}</div>
                            </div>
                            <div class="profile-info-item">
                                <label>Email</label>
                                <div class="profile-info-value">${escapeHtml(user.email)}</div>
                            </div>
                            <div class="profile-info-item">
                                <label>Phone</label>
                                <div class="profile-info-value">${escapeHtml(user.phone || 'Not provided')}</div>
                            </div>
                            <div class="profile-info-item">
                                <label>Address</label>
                                <div class="profile-info-value">${escapeHtml(user.address || 'Not provided')}</div>
                            </div>
                            <div class="profile-info-item">
                                <label>Member Since</label>
                                <div class="profile-info-value">${formatDate(user.createdAt)}</div>
                            </div>
                        </div>
                    </div>

                    <div class="profile-actions">
                        <button class="btn btn-primary" onclick="openEditProfile()">
                            Edit Profile
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.href='orders.html'">
                            View Orders
                        </button>
                    </div>
                </div>
            </div>
        `;

        profileContainer.innerHTML = profileHTML;
    }
});

// Global function to open edit profile modal
function openEditProfile() {
    const userId = getCurrentUserId();
    const currentUser = getCurrentUser();

    if (!currentUser) {
        showMessage('Unable to load user data', 'error');
        return;
    }

    const modalHTML = `
        <div class="modal-overlay" id="editProfileModal">
            <div class="modal-content shadow-lg border-0" style="max-width: 480px;">
                <div class="modal-header d-flex justify-content-between align-items-center">
                    <h5 class="modal-title mb-0 fw-bold">Edit Profile</h5>
                    <button type="button" class="btn-close modal-close" onclick="closeEditProfile()" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editProfileForm">
                        <div class="form-group mb-3">
                            <label for="editName" class="form-label">Name *</label>
                            <input type="text" id="editName" name="name" class="form-control" value="${escapeHtml(currentUser.name)}" required>
                        </div>
                        <div class="form-group mb-3">
                            <label for="editPhone" class="form-label">Phone</label>
                            <input type="tel" id="editPhone" name="phone" class="form-control" value="${escapeHtml(currentUser.phone || '')}">
                        </div>
                        <div class="form-group mb-3">
                            <label for="editAddress" class="form-label">Address</label>
                            <textarea id="editAddress" name="address" class="form-control" rows="3">${escapeHtml(currentUser.address || '')}</textarea>
                        </div>
                        <div id="editProfileError" class="message message-error hidden"></div>
                        <div class="form-actions d-flex gap-2 justify-content-end mt-4">
                            <button type="button" class="btn btn-secondary" onclick="closeEditProfile()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listener for form submission
    const form = document.getElementById('editProfileForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleProfileUpdate(userId, form);
    });
}

// Global function to close edit profile modal
function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.remove();
    }
}

// Handle profile update
async function handleProfileUpdate(userId, form) {
    const errorElement = document.getElementById('editProfileError');
    const submitButton = form.querySelector('button[type="submit"]');

    const formData = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        address: form.address.value.trim(),
    };

    // Validation
    if (!formData.name) {
        errorElement.textContent = 'Name is required';
        errorElement.classList.remove('hidden');
        return;
    }

    if (formData.name.length > 100) {
        errorElement.textContent = 'Name must not exceed 100 characters';
        errorElement.classList.remove('hidden');
        return;
    }

    if (formData.phone && formData.phone.length > 20) {
        errorElement.textContent = 'Phone number must not exceed 20 characters';
        errorElement.classList.remove('hidden');
        return;
    }

    if (formData.address && formData.address.length > 255) {
        errorElement.textContent = 'Address must not exceed 255 characters';
        errorElement.classList.remove('hidden');
        return;
    }

    errorElement.innerHTML = '';
    errorElement.classList.add('hidden');

    // Disable submit button and show loading
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="auth-loading"><div class="spinner"></div> Saving...</span>';

    try {
        const updatedUser = await API.users.update(userId, formData);

        // Update stored user data
        const currentUser = getCurrentUser();
        const updatedUserData = {
            ...currentUser,
            name: updatedUser.name,
            phone: updatedUser.phone,
            address: updatedUser.address,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        showMessage('Profile updated successfully', 'success');
        closeEditProfile();

        // Reload profile page
        window.location.reload();
    } catch (error) {
        handleApiError(error, errorElement);
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');

        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}