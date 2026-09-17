package com.ecommerce.ecommerce.dto;

import jakarta.validation.constraints.NotNull;

public class PaymentOrderRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    public PaymentOrderRequest() {
    }

    public PaymentOrderRequest(Long orderId) {
        this.orderId = orderId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
