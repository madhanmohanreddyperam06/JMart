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
                    <div class="stat-card">
                        <div class="stat-icon">📦</div>
                        <div class="stat-info">
                            <div class="stat-label">Total Products</div>
                            <div class="stat-value">${data.totalProducts || 0}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <div class="stat-label">Total Users</div>
                            <div class="stat-value">${data.totalUsers || 0}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🛒</div>
                        <div class="stat-info">
                            <div class="stat-label">Total Orders</div>
                            <div class="stat-value">${data.totalOrders || 0}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-info">
                            <div class="stat-label">Total Revenue</div>
                            <div class="stat-value">${formatCurrency(data.totalRevenue || 0)}</div>
                        </div>
                    </div>
                </div>

                <div class="dashboard-content">
                    <div class="dashboard-section">
                        <h2>Quick Actions</h2>
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

                    <div class="dashboard-section">
                        <h2>Recent Activity</h2>
                        <div class="recent-activity">
                            <div class="activity-item">
                                <div class="activity-icon">📊</div>
                                <div class="activity-info">
                                    <div class="activity-text">Dashboard loaded successfully</div>
                                    <div class="activity-time">Just now</div>
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