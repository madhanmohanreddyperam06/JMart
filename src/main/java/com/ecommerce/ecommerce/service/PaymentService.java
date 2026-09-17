package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.PaymentOrderRequest;
import com.ecommerce.ecommerce.dto.PaymentOrderResponse;
import com.ecommerce.ecommerce.dto.PaymentResponse;
import com.ecommerce.ecommerce.dto.PaymentVerificationRequest;
import com.ecommerce.ecommerce.entity.Order;
import com.ecommerce.ecommerce.entity.Payment;
import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.enums.OrderStatus;
import com.ecommerce.ecommerce.enums.PaymentStatus;
import com.ecommerce.ecommerce.exception.*;
import com.ecommerce.ecommerce.gateway.PaymentGateway;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.repository.PaymentRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private static final String CURRENCY = "INR";
    private static final String GATEWAY = "RAZORPAY";

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PaymentGateway paymentGateway;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository,
                         ProductRepository productRepository, UserRepository userRepository,
                         PaymentGateway paymentGateway) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.paymentGateway = paymentGateway;
    }

    @Transactional
    public PaymentOrderResponse createPaymentOrder(PaymentOrderRequest request) {
        User currentUser = getCurrentUser();

        Order order = orderRepository.findByIdAndUserId(request.getOrderId(), currentUser.getId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found or access denied"));

        if (order.getStatus() != OrderStatus.PAYMENT_PENDING) {
            throw new InvalidPaymentStateException(
                "Order is not in PAYMENT_PENDING state. Current status: " + order.getStatus()
            );
        }

        if (paymentRepository.existsByOrderId(order.getId())) {
            Payment existingPayment = paymentRepository.findByOrderId(order.getId())
                    .orElseThrow(() -> new PaymentNotFoundException("Payment record not found"));

            if (existingPayment.getStatus() == PaymentStatus.SUCCESS) {
                throw new PaymentAlreadyCompletedException("Payment already completed for this order");
            }

            if (existingPayment.getStatus() == PaymentStatus.PENDING || existingPayment.getStatus() == PaymentStatus.CREATED) {
                logger.info("Reusing existing payment order {} for order {}", existingPayment.getGatewayOrderId(), order.getId());
                return mapToPaymentOrderResponse(existingPayment);
            }

            if (existingPayment.getStatus() == PaymentStatus.FAILED) {
                logger.info("Creating new payment order for failed payment on order {}", order.getId());
                paymentRepository.delete(existingPayment);
            }
        }

        try {
            String receipt = "order_" + order.getId() + "_" + System.currentTimeMillis();
            PaymentGateway.PaymentGatewayOrder gatewayOrder = paymentGateway.createOrder(
                order.getTotalAmount(),
                CURRENCY,
                receipt
            );

            Payment payment = new Payment(
                order,
                GATEWAY,
                gatewayOrder.getGatewayOrderId(),
                order.getTotalAmount(),
                CURRENCY,
                PaymentStatus.CREATED
            );

            paymentRepository.save(payment);

            logger.info("Payment order created successfully: gatewayOrderId={}, orderId={}", 
                       gatewayOrder.getGatewayOrderId(), order.getId());

            PaymentOrderResponse response = mapToPaymentOrderResponse(payment);
            response.setKeyId(gatewayOrder.getKeyId());

            return response;

        } catch (Exception e) {
            logger.error("Failed to create payment order for order {}: {}", order.getId(), e.getMessage());
            throw new PaymentCreationException("Failed to create payment order: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        User currentUser = getCurrentUser();

        Order order = orderRepository.findByIdAndUserId(request.getOrderId(), currentUser.getId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found or access denied"));

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found for this order"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new PaymentAlreadyCompletedException("Payment already verified and completed");
        }

        if (!payment.getGatewayOrderId().equals(request.getGatewayOrderId())) {
            throw new PaymentVerificationException("Gateway order ID mismatch");
        }

        boolean signatureValid = paymentGateway.verifyPaymentSignature(
            request.getGatewayOrderId(),
            request.getGatewayPaymentId(),
            request.getSignature()
        );

        if (!signatureValid) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            logger.warn("Payment signature verification failed for order {}", order.getId());
            throw new PaymentVerificationException("Invalid payment signature");
        }

        payment.setGatewayPaymentId(request.getGatewayPaymentId());
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        order.setStatus(OrderStatus.PLACED);
        orderRepository.save(order);

        deductInventoryForOrder(order);

        logger.info("Payment verified successfully for order {}", order.getId());

        return mapToPaymentResponse(payment);
    }

    @Transactional
    public PaymentResponse getPaymentByOrder(Long orderId) {
        User currentUser = getCurrentUser();

        Order order = orderRepository.findByIdAndUserId(orderId, currentUser.getId())
                .orElseThrow(() -> new OrderNotFoundException("Order not found or access denied"));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found for this order"));

        return mapToPaymentResponse(payment);
    }

    private void deductInventoryForOrder(Order order) {
        for (var orderItem : order.getItems()) {
            Product product = productRepository.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found: " + orderItem.getProduct().getId()));

            int affectedRows = productRepository.deductStock(product.getId(), orderItem.getQuantity());
            if (affectedRows == 0) {
                throw new InsufficientStockException(
                    "Insufficient stock for product: " + product.getName()
                );
            }
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    private PaymentOrderResponse mapToPaymentOrderResponse(Payment payment) {
        return new PaymentOrderResponse(
            payment.getId(),
            payment.getOrder().getId(),
            payment.getGateway(),
            payment.getGatewayOrderId(),
            payment.getAmount(),
            payment.getCurrency(),
            null,
            payment.getStatus(),
            payment.getCreatedAt(),
            payment.getUpdatedAt()
        );
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
