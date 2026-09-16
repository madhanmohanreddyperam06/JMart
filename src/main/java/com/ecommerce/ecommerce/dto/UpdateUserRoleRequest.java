package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.enums.Role;
import jakarta.validation.constraints.NotNull;

public class UpdateUserRoleRequest {
    @NotNull(message = "Role cannot be null")
    private Role role;

    public UpdateUserRoleRequest() {
    }

    public UpdateUserRoleRequest(Role role) {
        this.role = role;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
