package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.AddToCartRequest;
import com.ecommerce.ecommerce.dto.CartResponse;
import com.ecommerce.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Shopping Cart", description = "Shopping cart management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current user's cart", description = "Retrieve the current user's shopping cart")
    public ResponseEntity<CartResponse> getCart() {
        CartResponse cartResponse = cartService.getCartForCurrentUser();
        return ResponseEntity.ok(cartResponse);
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", description = "Add a product to the current user's cart")
    public ResponseEntity<CartResponse> addItemToCart(@Valid @RequestBody AddToCartRequest request) {
        CartResponse cartResponse = cartService.addItemToCart(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartResponse);
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update cart item quantity", description = "Update the quantity of a cart item")
    public ResponseEntity<CartResponse> updateCartItem(
            @Parameter(description = "Cart item ID") @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponse cartResponse = cartService.updateCartItem(itemId, request);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart", description = "Remove an item from the current user's cart")
    public ResponseEntity<CartResponse> removeCartItem(@Parameter(description = "Cart item ID") @PathVariable Long itemId) {
        CartResponse cartResponse = cartService.removeCartItem(itemId);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping
    @Operation(summary = "Clear cart", description = "Remove all items from the current user's cart")
    public ResponseEntity<CartResponse> clearCart() {
        CartResponse cartResponse = cartService.clearCart();
        return ResponseEntity.ok(cartResponse);
    }
}