package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.AdminDashboardResponse;
import com.ecommerce.ecommerce.enums.OrderStatus;
import com.ecommerce.ecommerce.enums.Role;
import com.ecommerce.ecommerce.repository.CategoryRepository;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;

    @Value("${app.inventory.low-stock-threshold}")
    private Integer lowStockThreshold;

    public AdminDashboardService(UserRepository userRepository, ProductRepository productRepository,
                                  CategoryRepository categoryRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
    }

    public AdminDashboardResponse getDashboardStatistics() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);
        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalOrders = orderRepository.count();

        long placedOrders = orderRepository.countByStatus(OrderStatus.PLACED);
        long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long shippedOrders = orderRepository.countByStatus(OrderStatus.SHIPPED);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        // Revenue: Only include orders that represent completed sales (DELIVERED)
        // CANCELLED orders are excluded from revenue calculation
        BigDecimal totalRevenue = orderRepository.sumTotalAmountByStatusIn(List.of(OrderStatus.DELIVERED));
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        long lowStockProducts = productRepository.findLowStockProducts(lowStockThreshold).size();
        long outOfStockProducts = productRepository.findOutOfStockProducts().size();

        return new AdminDashboardResponse(
                totalUsers,
                totalCustomers,
                totalAdmins,
                totalProducts,
                totalCategories,
                totalOrders,
                placedOrders,
                confirmedOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue,
                lowStockProducts,
                outOfStockProducts
        );
    }
}
