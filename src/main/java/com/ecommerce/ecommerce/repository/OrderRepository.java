package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Order> findByIdAndUserId(Long orderId, Long userId);
}
