package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByBrand(String brand);
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByCategory_Name(String categoryName);

    @Modifying
    @Query("UPDATE Product p SET p.quantity = p.quantity - :quantity WHERE p.id = :productId AND p.quantity >= :quantity")
    int deductStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);

    @Modifying
    @Query("UPDATE Product p SET p.quantity = p.quantity + :quantity WHERE p.id = :productId")
    int addStock(@Param("productId") Long productId, @Param("quantity") Integer quantity);
}
