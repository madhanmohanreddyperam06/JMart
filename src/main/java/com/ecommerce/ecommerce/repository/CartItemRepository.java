package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
    List<CartItem> findByCartId(Long cartId);
    
    @Transactional
    void deleteAllByCartId(Long cartId);
}