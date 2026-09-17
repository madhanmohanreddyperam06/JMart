package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.PaymentResponse;
import com.ecommerce.ecommerce.entity.Payment;
import com.ecommerce.ecommerce.exception.PaymentNotFoundException;
import com.ecommerce.ecommerce.repository.PaymentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/payments")
@Tag(name = "Admin Payments", description = "Admin payment management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentRepository paymentRepository;

    public AdminPaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    @Operation(summary = "Get all payments (Admin)", description = "Retrieve all payments in the system (ADMIN only)")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        List<PaymentResponse> responses = payments.stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{paymentId}")
    @Operation(summary = "Get payment by ID (Admin)", description = "Retrieve specific payment details (ADMIN only)")
    public ResponseEntity<PaymentResponse> getPaymentById(@Parameter(description = "Payment ID") @PathVariable Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with id: " + paymentId));
        return ResponseEntity.ok(mapToPaymentResponse(payment));
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return new PaymentResponse(
            payment.getId(),
            payment.getOrder().getId(),
            payment.getGateway(),
            payment.getGatewayOrderId(),
            payment.getGatewayPaymentId(),
            payment.getAmount(),
            payment.getCurrency(),
            payment.getStatus(),
            payment.getCreatedAt(),
            payment.getUpdatedAt()
        );
    }
}
