// Admin Users Management JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Require admin authentication
    requireAdmin();

    const usersContainer = document.getElementById('usersContainer');
    const errorElement = document.getElementById('usersError');

    // Load users on page load
    await loadUsers();

    async function loadUsers() {
        showLoading(usersContainer, 'Loading users...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const users = await API.admin.users.getAll();
            renderAdminUsers(users);
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(usersContainer, 'Unable to load users', () => loadUsers());
            }
        }
    }

    function renderAdminUsers(users) {
        if (!users || users.length === 0) {
            renderEmptyUsers();
            return;
        }

        const usersHTML = `
            <div class="admin-users-table table-responsive">
                <table class="cart-table table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${escapeHtml(user.id)}</td>
                                <td>
                                    <div class="admin-user-name fw-semibold">${escapeHtml(user.name)}</div>
                                    <div class="admin-user-phone text-secondary small">${escapeHtml(user.phone || 'N/A')}</div>
                                </td>
                                <td>${escapeHtml(user.email)}</td>
                                <td>
                                    <span class="role-badge badge rounded-pill ${user.role === 'ADMIN' ? 'bg-primary' : 'bg-secondary'}">
                                        ${escapeHtml(user.role)}
                                    </span>
                                </td>
                                <td class="text-secondary small">${formatDate(user.createdAt)}</td>
                                <td>
                                    <div class="admin-actions">
                                        <button class="btn btn-sm btn-secondary" onclick="openRoleModal(${encodeURIComponent(user.id)}, '${encodeURIComponent(user.role)}', '${escapeHtml(user.name).replace(/'/g, "\\'")}')">
                                            Change Role
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        usersContainer.innerHTML = usersHTML;
    }

    function renderEmptyUsers() {
        usersContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <div class="empty-state-text">No users found</div>
                <div class="empty-state-subtext">There are no users in the system yet</div>
            </div>
        `;
    }
});

// Global function to open role change modal
function openRoleModal(userId, currentRole, userName) {
    const modalHTML = `
        <div class="modal-overlay" id="roleModal">
            <div class="modal-content shadow-lg border-0" style="max-width: 440px;">
                <div class="modal-header d-flex justify-content-between align-items-center">
                    <h5 class="modal-title mb-0 fw-bold">Change User Role</h5>
                    <button type="button" class="btn-close modal-close" onclick="closeRoleModal()" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-3 text-secondary">User: <strong class="text-dark">${escapeHtml(userName)}</strong></p>
                    <form id="roleForm">
                        <div class="form-group mb-3">
                            <label for="userRole" class="form-label">Select Role</label>
                            <select id="userRole" name="role" class="form-select" required>
                                <option value="CUSTOMER" ${currentRole === 'CUSTOMER' ? 'selected' : ''}>Customer</option>
                                <option value="ADMIN" ${currentRole === 'ADMIN' ? 'selected' : ''}>Admin</option>
                            </select>
                        </div>
                        <div id="roleError" class="message message-error hidden"></div>
                        <div class="form-actions d-flex gap-2 justify-content-end mt-4">
                            <button type="button" class="btn btn-secondary" onclick="closeRoleModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Update Role</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const form = document.getElementById('roleForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRoleUpdate(userId, form);
    });
}

// Global function to close role modal
function closeRoleModal() {
    const modal = document.getElementById('roleModal');
    if (modal) {
        modal.remove();
    }
}

// Handle role update
async function handleRoleUpdate(userId, form) {
    const errorElement = document.getElementById('roleError');
    const submitButton = form.querySelector('button[type="submit"]');

    const newRole = form.role.value;

    errorElement.innerHTML = '';
    errorElement.classList.add('hidden');

    // Disable submit button and show loading
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="auth-loading"><div class="spinner"></div> Updating...</span>';

    try {
        await API.admin.users.updateRole(userId, newRole);
        showMessage('User role updated successfully', 'success');
        closeRoleModal();
        window.location.reload();
    } catch (error) {
        handleApiError(error, errorElement);
        errorElement.textContent = error.message;
        errorElement.classList.remove('hidden');

        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}