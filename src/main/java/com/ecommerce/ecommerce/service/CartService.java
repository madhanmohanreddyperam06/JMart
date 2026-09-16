package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.AddToCartRequest;
import com.ecommerce.ecommerce.dto.CartItemResponse;
import com.ecommerce.ecommerce.dto.CartResponse;
import com.ecommerce.ecommerce.dto.UpdateCartItemRequest;
import com.ecommerce.ecommerce.entity.Cart;
import com.ecommerce.ecommerce.entity.CartItem;
import com.ecommerce.ecommerce.entity.Product;
import com.ecommerce.ecommerce.entity.User;
import com.ecommerce.ecommerce.exception.CartItemNotFoundException;
import com.ecommerce.ecommerce.exception.CartNotFoundException;
import com.ecommerce.ecommerce.exception.InsufficientStockException;
import com.ecommerce.ecommerce.exception.ProductNotFoundException;
import com.ecommerce.ecommerce.exception.UnauthorizedAccessException;
import com.ecommerce.ecommerce.repository.CartItemRepository;
import com.ecommerce.ecommerce.repository.CartRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                      ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartResponse getCartForCurrentUser() {
        User currentUser = getCurrentUser();
        Cart cart = getOrCreateCart(currentUser);
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());
        BigDecimal totalAmount = calculateTotalAmount(cart);
        return new CartResponse(cart.getId(), itemResponses, totalAmount);
    }

    public CartResponse addItemToCart(AddToCartRequest request) {
        User currentUser = getCurrentUser();
        Cart cart = getOrCreateCart(currentUser);
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + request.getProductId()));

        int requestedQuantity = request.getQuantity();
        
        // Check if product already exists in cart
        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (existingItem != null) {
            // Update existing item
            int newQuantity = existingItem.getQuantity() + requestedQuantity;
            validateStock(product, newQuantity);
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            // Create new item
            validateStock(product, requestedQuantity);
            CartItem newItem = new CartItem(cart, product, requestedQuantity);
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        return getCartForCurrentUser();
    }

    public CartResponse updateCartItem(Long itemId, UpdateCartItemRequest request) {
        User currentUser = getCurrentUser();
        Cart cart = getOrCreateCart(currentUser);
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with id: " + itemId));

        // Verify ownership
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to modify this cart item");
        }

        Product product = cartItem.getProduct();
        int requestedQuantity = request.getQuantity();
        validateStock(product, requestedQuantity);

        cartItem.setQuantity(requestedQuantity);
        cartItemRepository.save(cartItem);

        return getCartForCurrentUser();
    }

    public CartResponse removeCartItem(Long itemId) {
        User currentUser = getCurrentUser();
        Cart cart = getOrCreateCart(currentUser);
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with id: " + itemId));

        // Verify ownership
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new UnauthorizedAccessException("You do not have permission to remove this cart item");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        return getCartForCurrentUser();
    }

    public CartResponse clearCart() {
        User currentUser = getCurrentUser();
        Cart cart = getOrCreateCart(currentUser);
        
        cartItemRepository.deleteAllByCartId(cart.getId());
        cart.getItems().clear();

        return getCartForCurrentUser();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CartNotFoundException("User not found with email: " + email));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart(user);
                    user.setCart(newCart);
                    return cartRepository.save(newCart);
                });
    }

    private void validateStock(Product product, int requestedQuantity) {
        if (product.getQuantity() < requestedQuantity) {
            throw new InsufficientStockException(
                "Insufficient stock. Only " + product.getQuantity() + " units are available."
            );
        }
    }

    private BigDecimal calculateTotalAmount(Cart cart) {
        return cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        return new CartItemResponse(
                cartItem.getId(),
                cartItem.getProduct().getId(),
                cartItem.getProduct().getName(),
                cartItem.getProduct().getPrice(),
                cartItem.getQuantity(),
                cartItem.getSubtotal()
        );
    }
}