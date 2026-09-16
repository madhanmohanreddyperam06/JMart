package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.enums.StockStatus;

import java.math.BigDecimal;

public class InventoryResponse {
    private Long productId;
    private String productName;
    private String brand;
    private Integer quantity;
    private BigDecimal price;
    private StockStatus stockStatus;

    public InventoryResponse() {
    }

    public InventoryResponse(Long productId, String productName, String brand, Integer quantity, BigDecimal price, StockStatus stockStatus) {
        this.productId = productId;
        this.productName = productName;
        this.brand = brand;
        this.quantity = quantity;
        this.price = price;
        this.stockStatus = stockStatus;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public StockStatus getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(StockStatus stockStatus) {
        this.stockStatus = stockStatus;
    }
}
