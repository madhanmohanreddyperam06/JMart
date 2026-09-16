package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.AddToCartRequest;
import com.ecommerce.ecommerce.dto.CartResponse;
import com.ecommerce.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        CartResponse cartResponse = cartService.getCartForCurrentUser();
        return ResponseEntity.ok(cartResponse);
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(@Valid @RequestBody AddToCartRequest request) {
        CartResponse cartResponse = cartService.addItemToCart(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartResponse);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponse cartResponse = cartService.updateCartItem(itemId, request);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeCartItem(@PathVariable Long itemId) {
        CartResponse cartResponse = cartService.removeCartItem(itemId);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping
    public ResponseEntity<CartResponse> clearCart() {
        CartResponse cartResponse = cartService.clearCart();
        return ResponseEntity.ok(cartResponse);
    }
}