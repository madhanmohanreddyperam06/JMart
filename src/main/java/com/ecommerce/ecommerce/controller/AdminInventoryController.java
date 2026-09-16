package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.InventoryResponse;
import com.ecommerce.ecommerce.dto.InventoryUpdateRequest;
import com.ecommerce.ecommerce.service.AdminInventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inventory")
public class AdminInventoryController {

    private final AdminInventoryService adminInventoryService;

    public AdminInventoryController(AdminInventoryService adminInventoryService) {
        this.adminInventoryService = adminInventoryService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        List<InventoryResponse> inventory = adminInventoryService.getAllInventory();
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InventoryResponse>> getLowStockProducts() {
        List<InventoryResponse> lowStockProducts = adminInventoryService.getLowStockProducts();
        return ResponseEntity.ok(lowStockProducts);
    }

    @GetMapping("/out-of-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InventoryResponse>> getOutOfStockProducts() {
        List<InventoryResponse> outOfStockProducts = adminInventoryService.getOutOfStockProducts();
        return ResponseEntity.ok(outOfStockProducts);
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable Long productId,
            @Valid @RequestBody InventoryUpdateRequest request) {
        InventoryResponse inventoryResponse = adminInventoryService.updateInventory(productId, request);
        return ResponseEntity.ok(inventoryResponse);
    }
}
