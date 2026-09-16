package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.OrderResponse;
import com.ecommerce.ecommerce.dto.UpdateOrderStatusRequest;
import com.ecommerce.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> checkout() {
        OrderResponse orderResponse = orderService.checkout();
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        List<OrderResponse> orders = orderService.getMyOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        OrderResponse orderResponse = orderService.getOrderById(orderId);
        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long orderId) {
        OrderResponse orderResponse = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(orderResponse);
    }
}

@RestController
@RequestMapping("/api/admin/orders")
class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse orderResponse = orderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(orderResponse);
    }
}
