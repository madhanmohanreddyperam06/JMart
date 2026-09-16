package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.InventoryResponse;
import com.ecommerce.ecommerce.dto.InventoryUpdateRequest;
import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.enums.StockStatus;
import com.ecommerce.ecommerce.exception.InvalidInventoryQuantityException;
import com.ecommerce.ecommerce.exception.ProductNotFoundException;
import com.ecommerce.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminInventoryService {

    private final ProductRepository productRepository;

    @Value("${app.inventory.low-stock-threshold}")
    private Integer lowStockThreshold;

    public AdminInventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        return productRepository.findAll().stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockProducts() {
        return productRepository.findLowStockProducts(lowStockThreshold).stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts().stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse updateInventory(Long productId, InventoryUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        Integer newQuantity = request.getQuantity();
        if (newQuantity < 0) {
            throw new InvalidInventoryQuantityException("Quantity cannot be negative");
        }

        int affectedRows = productRepository.updateStock(productId, newQuantity);
        if (affectedRows == 0) {
            throw new ProductNotFoundException("Failed to update product with id: " + productId);
        }

        // Refresh the product to get updated values
        product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        return mapToInventoryResponse(product);
    }

    private InventoryResponse mapToInventoryResponse(Product product) {
        StockStatus stockStatus = determineStockStatus(product.getQuantity());
        return new InventoryResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getQuantity(),
                product.getPrice(),
                stockStatus
        );
    }

    private StockStatus determineStockStatus(Integer quantity) {
        if (quantity == null || quantity == 0) {
            return StockStatus.OUT_OF_STOCK;
        } else if (quantity <= lowStockThreshold) {
            return StockStatus.LOW_STOCK;
        } else {
            return StockStatus.IN_STOCK;
        }
    }
}
