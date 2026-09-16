package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.UpdateUserRequest;
import com.ecommerce.ecommerce.dto.UserResponse;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.exception.UserNotFoundException;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (!canAccessUser(user, authentication)) {
            return ResponseEntity.status(403).build();
        }

        UserResponse userResponse = userService.getUserById(id);
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest updateUserRequest,
            Authentication authentication) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (!canAccessUser(user, authentication)) {
            return ResponseEntity.status(403).build();
        }

        UserResponse userResponse = userService.updateUser(id, updateUserRequest);
        return ResponseEntity.ok(userResponse);
    }

    private boolean canAccessUser(User user, Authentication authentication) {
        String authenticatedEmail = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        return isAdmin || user.getEmail().equals(authenticatedEmail);
    }
}