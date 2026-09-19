// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    // Require admin authentication
    requireAdmin();

    const dashboardContainer = document.getElementById('dashboardContainer');
    const errorElement = document.getElementById('dashboardError');

    // Load dashboard data
    await loadDashboard();

    async function loadDashboard() {
        showLoading(dashboardContainer, 'Loading dashboard...');
        errorElement.innerHTML = '';
        errorElement.classList.add('hidden');

        try {
            const dashboardData = await API.admin.getDashboard();
            renderDashboard(dashboardData);
        } catch (error) {
            handleApiError(error, errorElement);
            if (isAuthError(error)) {
                handleAuthError(error);
            } else {
                showError(dashboardContainer, 'Unable to load dashboard', () => loadDashboard());
            }
        }
    }

    function renderDashboard(data) {
        if (!data) {
            showError(dashboardContainer, 'Dashboard data not available');
            return;
        }

        const dashboardHTML = `
            <div class="admin-dashboard">
                <div class="dashboard-stats">
                    <div class="stat-card card border-0 shadow-sm">
                        <div class="stat-icon">📦</div>
                        <div class="stat-info">
                            <div class="stat-label">Total Products</div>
                            <div class="stat-value text-primary">${data.totalProducts || 0}</div>
                        </div>
                    </div>
                    <div class="stat-card card border-0 shadow-sm">
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <div class="stat-label">Total Users</div>
                            <div class="stat-value text-primary">${data.totalUsers || 0}</div>
                        </div>
                    </div>
                    <div class="stat-card card border-0 shadow-sm">
                        <div class="stat-icon">🛒</div>
                        <div class="stat-info">
                            <div class="stat-label">Total Orders</div>
                            <div class="stat-value text-primary">${data.totalOrders || 0}</div>
                        </div>
                    </div>
                    <div class="stat-card card border-0 shadow-sm">
                        <div class="stat-icon">💰</div>
                        <div class="stat-info">
                            <div class="stat-label">Total Revenue</div>
                            <div class="stat-value text-primary">${formatCurrency(data.totalRevenue || 0)}</div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-content">
                    <div class="dashboard-section card border-0 shadow-sm p-3">
                        <h2 class="fs-6 fw-bold">Quick Actions</h2>
                        <div class="quick-actions">
                            <button class="btn btn-primary" onclick="window.location.href='admin-products.html'">
                                Manage Products
                            </button>
                            <button class="btn btn-secondary" onclick="window.location.href='admin-orders.html'">
                                Manage Orders
                            </button>
                            <button class="btn btn-secondary" onclick="window.location.href='admin-users.html'">
                                Manage Users
                            </button>
                            <button class="btn btn-secondary" onclick="window.location.href='admin-inventory.html'">
                                Inventory Status
                            </button>
                        </div>
                    </div>

                    <div class="dashboard-section card border-0 shadow-sm p-3">
                        <h2 class="fs-6 fw-bold">Recent Activity</h2>
                        <div class="recent-activity">
                            <div class="activity-item d-flex align-items-center gap-2">
                                <div class="activity-icon">📊</div>
                                <div class="activity-info">
                                    <div class="activity-text small fw-medium">Dashboard loaded successfully</div>
                                    <div class="activity-time text-secondary" style="font-size: 0.75rem;">Just now</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        dashboardContainer.innerHTML = dashboardHTML;
    }
});