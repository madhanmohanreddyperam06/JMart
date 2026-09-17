package com.ecommerce.ecommerce.gateway;

import java.math.BigDecimal;

public interface PaymentGateway {

    PaymentGatewayOrder createOrder(BigDecimal amount, String currency, String receipt);

    boolean verifyPaymentSignature(String gatewayOrderId, String gatewayPaymentId, String signature);

    class PaymentGatewayOrder {
        private final String gatewayOrderId;
        private final String keyId;

        public PaymentGatewayOrder(String gatewayOrderId, String keyId) {
            this.gatewayOrderId = gatewayOrderId;
            this.keyId = keyId;
        }

        public String getGatewayOrderId() {
            return gatewayOrderId;
        }

        public String getKeyId() {
            return keyId;
        }
    }
}
