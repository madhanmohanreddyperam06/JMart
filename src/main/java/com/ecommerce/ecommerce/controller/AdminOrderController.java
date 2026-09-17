package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.AdminOrderResponse;
import com.ecommerce.ecommerce.dto.UpdateOrderStatusRequest;
import com.ecommerce.ecommerce.service.AdminOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@Tag(name = "Admin Orders", description = "Admin order management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all orders (Admin)", description = "Retrieve all orders in the system (ADMIN only)")
    public ResponseEntity<List<AdminOrderResponse>> getAllOrders() {
        List<AdminOrderResponse> orders = adminOrderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get order by ID (Admin)", description = "Retrieve specific order details (ADMIN only)")
    public ResponseEntity<AdminOrderResponse> getOrderById(@Parameter(description = "Order ID") @PathVariable Long orderId) {
        AdminOrderResponse orderResponse = adminOrderService.getOrderById(orderId);
        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (Admin)", description = "Update order status (ADMIN only)")
    public ResponseEntity<AdminOrderResponse> updateOrderStatus(
            @Parameter(description = "Order ID") @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        AdminOrderResponse orderResponse = adminOrderService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(orderResponse);
    }
}
