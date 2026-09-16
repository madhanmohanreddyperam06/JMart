package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
}