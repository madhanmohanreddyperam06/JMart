package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.OrderItemResponse;
import com.ecommerce.ecommerce.dto.OrderResponse;
import com.ecommerce.ecommerce.dto.UpdateOrderStatusRequest;
import com.ecommerce.ecommerce.entity.Cart;
import com.ecommerce.ecommerce.entity.CartItem;
import com.ecommerce.ecommerce.entity.Order;
import com.ecommerce.ecommerce.entity.OrderItem;
import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.enums.OrderStatus;
import com.ecommerce.ecommerce.enums.Role;
import com.ecommerce.ecommerce.exception.EmptyCartException;
import com.ecommerce.ecommerce.exception.InsufficientStockException;
import com.ecommerce.ecommerce.exception.InvalidOrderStatusException;
import com.ecommerce.ecommerce.exception.OrderNotFoundException;
import com.ecommerce.ecommerce.exception.ProductNotFoundException;
import com.ecommerce.ecommerce.exception.UnauthorizedAccessException;
import com.ecommerce.ecommerce.repository.CartItemRepository;
import com.ecommerce.ecommerce.repository.CartRepository;
import com.ecommerce.ecommerce.repository.OrderItemRepository;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                        CartRepository cartRepository, CartItemRepository cartItemRepository,
                        ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public OrderResponse checkout() {
        User currentUser = getCurrentUser();
        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new EmptyCartException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new EmptyCartException("Cannot checkout with an empty cart");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found: " + cartItem.getProduct().getId()));

            int requestedQuantity = cartItem.getQuantity();
            if (product.getQuantity() < requestedQuantity) {
                throw new InsufficientStockException(
                    "Insufficient stock for product: " + product.getName() + 
                    ". Only " + product.getQuantity() + " units available."
                );
            }

            int affectedRows = productRepository.deductStock(product.getId(), requestedQuantity);
            if (affectedRows == 0) {
                throw new InsufficientStockException(
                    "Insufficient stock for product: " + product.getName()
                );
            }
        }

        Order order = new Order(currentUser, BigDecimal.ZERO, OrderStatus.PLACED);
        orderRepository.save(order);

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found: " + cartItem.getProduct().getId()));

            OrderItem orderItem = new OrderItem(
                order,
                product,
                product.getName(),
                product.getPrice(),
                cartItem.getQuantity()
            );
            order.addItem(orderItem);
            orderItemRepository.save(orderItem);
            totalAmount = totalAmount.add(orderItem.getSubtotal());
        }

        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        cartItemRepository.deleteAllByCartId(cart.getId());
        cart.getItems().clear();

        return mapToOrderResponse(order);
    }

    public OrderResponse getOrderById(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findByIdAndUserId(orderId, currentUser.getId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));
        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getMyOrders() {
        User currentUser = getCurrentUser();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse cancelOrder(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findByIdAndUserId(orderId, currentUser.getId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new InvalidOrderStatusException(
                "Order cannot be cancelled. Current status: " + order.getStatus()
            );
        }

        for (OrderItem orderItem : order.getItems()) {
            Product product = productRepository.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found: " + orderItem.getProduct().getId()));

            productRepository.addStock(product.getId(), orderItem.getQuantity());
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getAllOrders() {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedAccessException("Only admins can view all orders");
        }
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedAccessException("Only admins can update order status");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + orderId));

        OrderStatus newStatus = request.getStatus();
        OrderStatus currentStatus = order.getStatus();

        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new InvalidOrderStatusException(
                "Invalid status transition from " + currentStatus + " to " + newStatus
            );
        }

        order.setStatus(newStatus);
        orderRepository.save(order);

        return mapToOrderResponse(order);
    }

    private boolean isValidStatusTransition(OrderStatus current, OrderStatus newStatus) {
        return switch (current) {
            case PLACED -> newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;
            case CONFIRMED -> newStatus == OrderStatus.SHIPPED;
            case SHIPPED -> newStatus == OrderStatus.DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new OrderNotFoundException("User not found with email: " + email));
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::mapToOrderItemResponse)
                .collect(Collectors.toList());
        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
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
