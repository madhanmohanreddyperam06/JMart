package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.AdminDashboardResponse;
import com.ecommerce.ecommerce.service.AdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Admin Dashboard", description = "Admin dashboard statistics endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get dashboard statistics", description = "Retrieve comprehensive dashboard statistics including products, users, orders, and revenue")
    public ResponseEntity<AdminDashboardResponse> getDashboardStatistics() {
        AdminDashboardResponse dashboardResponse = adminDashboardService.getDashboardStatistics();
        return ResponseEntity.ok(dashboardResponse);
    }
}
