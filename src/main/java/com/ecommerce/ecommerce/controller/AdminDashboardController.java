package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.AdminDashboardResponse;
import com.ecommerce.ecommerce.service.AdminDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getDashboardStatistics() {
        AdminDashboardResponse dashboardResponse = adminDashboardService.getDashboardStatistics();
        return ResponseEntity.ok(dashboardResponse);
    }
}
