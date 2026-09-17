# Frontend API Mapping Document

This document maps the frontend to the actual backend API endpoints discovered during Phase 9A development.

## Backend API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
  - Request: `RegisterRequest` (name, email, password, phone, address)
  - Response: `UserResponse` (id, name, email, phone, address, role, createdAt)

- **POST** `/api/auth/login` - Login user
  - Request: `LoginRequest` (email, password)
  - Response: `LoginResponse` (token, userId, name, email, role, message)

### Products
- **GET** `/api/products` - Get all products
  - Response: `List<ProductResponse>`

- **GET** `/api/products/{id}` - Get product by ID
  - Response: `ProductResponse`

- **GET** `/api/products/search?name={name}` - Search products by name
  - Response: `List<ProductResponse>`

- **GET** `/api/products/brand/{brand}` - Get products by brand
  - Response: `List<ProductResponse>`

- **GET** `/api/products/filter?minPrice={min}&maxPrice={max}` - Filter products by price range
  - Response: `List<ProductResponse>`

- **GET** `/api/products/category/{categoryId}` - Get products by category
  - Response: `List<ProductResponse>`

### Categories
- **GET** `/api/categories` - Get all categories
  - Response: `List<CategoryResponse>`

- **GET** `/api/categories/{id}` - Get category by ID
  - Response: `CategoryResponse`

### Users
- **GET** `/api/users/{id}` - Get user by ID (protected)
  - Response: `UserResponse`

- **PUT** `/api/users/{id}` - Update user (protected)
  - Request: `UpdateUserRequest`
  - Response: `UserResponse`

### Cart (Future Implementation)
- **GET** `/api/cart` - Get cart items (protected)
- **POST** `/api/cart` - Add item to cart (protected)
- **PUT** `/api/cart/{id}` - Update cart item (protected)
- **DELETE** `/api/cart/{id}` - Remove cart item (protected)
- **DELETE** `/api/cart/clear` - Clear cart (protected)

### Orders (Future Implementation)
- **GET** `/api/orders` - Get orders (protected)
- **GET** `/api/orders/{id}` - Get order by ID (protected)
- **POST** `/api/orders` - Create order (protected)

### Payments (Future Implementation)
- **POST** `/api/payments` - Create payment (protected)
- **GET** `/api/payments/{id}` - Get payment by ID (protected)

### Cart (Completed)
- **GET** `/api/cart` - Get cart items (protected)
- **POST** `/api/cart/items` - Add item to cart (protected)
- **PUT** `/api/cart/items/{itemId}` - Update cart item (protected)
- **DELETE** `/api/cart/items/{itemId}` - Remove cart item (protected)
- **DELETE** `/api/cart` - Clear cart (protected)

### Orders (Completed)
- **POST** `/api/orders/checkout` - Process checkout from cart (protected)
- **GET** `/api/orders` - Get user orders (protected)
- **GET** `/api/orders/{orderId}` - Get order by ID (protected)
- **PUT** `/api/orders/{orderId}/cancel` - Cancel order (protected)

### Payment Processing (Completed)
- **POST** `/api/payments/create-order` - Create payment order (protected)
- **POST** `/api/payments/verify` - Verify payment signature (protected)
- **GET** `/api/payments/order/{orderId}` - Get payment status for order (protected)

### Admin Dashboard (Completed)
- **GET** `/api/admin/dashboard` - Get dashboard statistics (ADMIN only)

### Admin Products (Completed)
- **GET** `/api/admin/products` - Get all products (ADMIN only)
- **GET** `/api/admin/products/{id}` - Get product by ID (ADMIN only)
- **POST** `/api/admin/products` - Create product (ADMIN only)
- **PUT** `/api/admin/products/{id}` - Update product (ADMIN only)
- **DELETE** `/api/admin/products/{id}` - Delete product (ADMIN only)
- **GET** `/api/admin/products/search?name={name}` - Search products (ADMIN only)

### Admin Categories (Completed)
- **GET** `/api/admin/categories` - Get all categories (ADMIN only)
- **GET** `/api/admin/categories/{id}` - Get category by ID (ADMIN only)
- **POST** `/api/admin/categories` - Create category (ADMIN only)
- **PUT** `/api/admin/categories/{id}` - Update category (ADMIN only)
- **DELETE** `/api/admin/categories/{id}` - Delete category (ADMIN only)

### Admin Orders (Completed)
- **GET** `/api/admin/orders` - Get all orders (ADMIN only)
- **GET** `/api/admin/orders/{orderId}` - Get order by ID (ADMIN only)
- **PUT** `/api/admin/orders/{orderId}/status` - Update order status (ADMIN only)

### Admin Users (Completed)
- **GET** `/api/admin/users` - Get all users (ADMIN only)
- **GET** `/api/admin/users/{id}` - Get user by ID (ADMIN only)
- **PUT** `/api/admin/users/{userId}/role` - Update user role (ADMIN only)

### Admin Inventory (Completed)
- **GET** `/api/admin/inventory` - Get all inventory with stock status (ADMIN only)
- **GET** `/api/admin/inventory/low-stock` - Get low-stock products (ADMIN only)
- **GET** `/api/admin/inventory/out-of-stock` - Get out-of-stock products (ADMIN only)
- **PUT** `/api/admin/inventory/{productId}` - Update product inventory (ADMIN only)

### Admin Payments (Completed)
- **GET** `/api/admin/payments` - Get all payments (ADMIN only)
- **GET** `/api/admin/payments/{paymentId}` - Get specific payment details (ADMIN only)

## DTO Response Structures

### LoginResponse
```json
{
  "token": "JWT_TOKEN",
  "userId": 1,
  "name": "User Name",
  "email": "user@example.com",
  "role": "CUSTOMER" | "ADMIN",
  "message": "Login successful"
}
```

### ProductResponse
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "price": 1000.00,
  "quantity": 10,
  "brand": "Brand Name",
  "categoryId": 1,
  "categoryName": "Category Name"
}
```

### CategoryResponse
```json
{
  "id": 1,
  "name": "Category Name"
}
```

### UserResponse
```json
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com",
  "phone": "1234567890",
  "address": "User Address",
  "role": "CUSTOMER" | "ADMIN",
  "createdAt": "2024-01-01T00:00:00"
}
```

## Frontend Configuration

### API Base URL
```
http://localhost:8080/api
```

### Authentication
- JWT stored in localStorage as `token`
- User data stored in localStorage as `user`
- Role stored in localStorage as `role`
- User ID stored in localStorage as `userId`

### Authorization Header
```
Authorization: Bearer <JWT_TOKEN>
```

## Error Handling

### Backend Error Response Format
```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 404,
  "message": "Error message",
  "path": "/api/endpoint"
}
```

### Common HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict (e.g., duplicate email)
- 500: Internal Server Error
