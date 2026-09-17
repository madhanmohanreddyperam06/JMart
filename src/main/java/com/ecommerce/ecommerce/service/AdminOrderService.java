package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.AdminOrderResponse;
import com.ecommerce.ecommerce.dto.OrderItemResponse;
import com.ecommerce.ecommerce.dto.UpdateOrderStatusRequest;
import com.ecommerce.ecommerce.entity.Order;
import com.ecommerce.ecommerce.entity.OrderItem;
import com.ecommerce.ecommerce.enums.OrderStatus;
import com.ecommerce.ecommerce.exception.InvalidOrderStatusException;
import com.ecommerce.ecommerce.exception.OrderNotFoundException;
import com.ecommerce.ecommerce.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToAdminOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminOrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        return mapToAdminOrderResponse(order);
    }

    public AdminOrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        OrderStatus newStatus = request.getStatus();
        OrderStatus currentStatus = order.getStatus();

        // Preserve existing Phase 6 status transition logic
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new InvalidOrderStatusException(
                "Invalid status transition from " + currentStatus + " to " + newStatus
            );
        }

        // Admin status updates do NOT modify inventory - stock is only modified during checkout (deduction)
        // and customer cancellation (restoration). Admin updates only change status for tracking purposes.
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        return mapToAdminOrderResponse(updatedOrder);
    }

    // Reuse existing Phase 6 status transition logic
    private boolean isValidStatusTransition(OrderStatus current, OrderStatus newStatus) {
        return switch (current) {
            case PAYMENT_PENDING -> newStatus == OrderStatus.PLACED || newStatus == OrderStatus.CANCELLED;
            case PLACED -> newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;
            case CONFIRMED -> newStatus == OrderStatus.SHIPPED;
            case SHIPPED -> newStatus == OrderStatus.DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };
    }

    private AdminOrderResponse mapToAdminOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::mapToOrderItemResponse)
                .collect(Collectors.toList());
        
        return new AdminOrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getUser().getEmail(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                itemResponses
        );
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem orderItem) {
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getProduct().getId(),
                orderItem.getProductName(),
                orderItem.getPrice(),
                orderItem.getQuantity(),
                orderItem.getSubtotal(),
                orderItem.getCreatedAt()
        );
    }
}
