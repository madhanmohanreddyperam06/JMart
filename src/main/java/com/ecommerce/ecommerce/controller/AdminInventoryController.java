package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.InventoryResponse;
import com.ecommerce.ecommerce.dto.InventoryUpdateRequest;
import com.ecommerce.ecommerce.service.AdminInventoryService;
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
@RequestMapping("/api/admin/inventory")
@Tag(name = "Admin Inventory", description = "Admin inventory management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminInventoryController {

    private final AdminInventoryService adminInventoryService;

    public AdminInventoryController(AdminInventoryService adminInventoryService) {
        this.adminInventoryService = adminInventoryService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all inventory (Admin)", description = "Retrieve all products with stock status (ADMIN only)")
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        List<InventoryResponse> inventory = adminInventoryService.getAllInventory();
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get low-stock products (Admin)", description = "Retrieve products with low stock (ADMIN only)")
    public ResponseEntity<List<InventoryResponse>> getLowStockProducts() {
        List<InventoryResponse> lowStockProducts = adminInventoryService.getLowStockProducts();
        return ResponseEntity.ok(lowStockProducts);
    }

    @GetMapping("/out-of-stock")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get out-of-stock products (Admin)", description = "Retrieve products that are out of stock (ADMIN only)")
    public ResponseEntity<List<InventoryResponse>> getOutOfStockProducts() {
        List<InventoryResponse> outOfStockProducts = adminInventoryService.getOutOfStockProducts();
        return ResponseEntity.ok(outOfStockProducts);
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update inventory (Admin)", description = "Update product inventory quantity (ADMIN only)")
    public ResponseEntity<InventoryResponse> updateInventory(
            @Parameter(description = "Product ID") @PathVariable Long productId,
            @Valid @RequestBody InventoryUpdateRequest request) {
        InventoryResponse inventoryResponse = adminInventoryService.updateInventory(productId, request);
        return ResponseEntity.ok(inventoryResponse);
    }
}
