package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateOrderStatusRequest {
    @NotNull(message = "Status cannot be null")
    private OrderStatus status;

    public UpdateOrderStatusRequest() {
    }

    public UpdateOrderStatusRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
