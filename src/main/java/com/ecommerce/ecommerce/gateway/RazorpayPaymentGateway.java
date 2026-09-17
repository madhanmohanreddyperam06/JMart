package com.ecommerce.ecommerce.gateway;

import com.ecommerce.ecommerce.config.RazorpayConfig;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class RazorpayPaymentGateway implements PaymentGateway {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayPaymentGateway.class);
    private static final String CURRENCY = "INR";
    private static final BigDecimal PAISE_CONVERSION = BigDecimal.valueOf(100);

    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;

    public RazorpayPaymentGateway(RazorpayConfig razorpayConfig) throws RazorpayException {
        this.razorpayConfig = razorpayConfig;
        this.razorpayClient = new RazorpayClient(razorpayConfig.getKeyId(), razorpayConfig.getKeySecret());
    }

    @Override
    public PaymentGatewayOrder createOrder(BigDecimal amount, String currency, String receipt) {
        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", convertToPaise(amount));
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", receipt);
            orderRequest.put("payment_capture", 1);

            logger.info("Creating Razorpay order with amount: {} {} (receipt: {})", amount, currency, receipt);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String gatewayOrderId = razorpayOrder.get("id");

            logger.info("Razorpay order created successfully: {}", gatewayOrderId);

            return new PaymentGatewayOrder(gatewayOrderId, razorpayConfig.getKeyId());

        } catch (RazorpayException e) {
            logger.error("Failed to create Razorpay order: {}", e.getMessage());
            throw new RuntimeException("Failed to create payment order", e);
        }
    }

    @Override
    public boolean verifyPaymentSignature(String gatewayOrderId, String gatewayPaymentId, String signature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", gatewayOrderId);
            options.put("razorpay_payment_id", gatewayPaymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayConfig.getKeySecret());
            logger.info("Payment signature verification for order {}: {}", gatewayOrderId, isValid ? "SUCCESS" : "FAILED");

            return isValid;

        } catch (Exception e) {
            logger.error("Failed to verify payment signature: {}", e.getMessage());
            return false;
        }
    }

    private int convertToPaise(BigDecimal amount) {
        return amount.multiply(PAISE_CONVERSION)
                    .setScale(0, RoundingMode.HALF_UP)
                    .intValue();
    }
}
