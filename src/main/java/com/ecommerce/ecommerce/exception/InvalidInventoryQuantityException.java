package com.ecommerce.ecommerce.exception;

public class InvalidInventoryQuantityException extends RuntimeException {
    public InvalidInventoryQuantityException(String message) {
        super(message);
    }
}
