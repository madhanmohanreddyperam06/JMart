package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.AdminUserResponse;
import com.ecommerce.ecommerce.dto.UpdateUserRoleRequest;
import com.ecommerce.ecommerce.service.AdminUserService;
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
@RequestMapping("/api/admin/users")
@Tag(name = "Admin Users", description = "Admin user management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (Admin)", description = "Retrieve all users in the system (ADMIN only)")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID (Admin)", description = "Retrieve specific user details (ADMIN only)")
    public ResponseEntity<AdminUserResponse> getUserById(@Parameter(description = "User ID") @PathVariable Long id) {
        AdminUserResponse userResponse = adminUserService.getUserById(id);
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user role (Admin)", description = "Update user role between CUSTOMER and ADMIN (ADMIN only)")
    public ResponseEntity<AdminUserResponse> updateUserRole(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRoleRequest request) {
        AdminUserResponse userResponse = adminUserService.updateUserRole(userId, request);
        return ResponseEntity.ok(userResponse);
    }
}