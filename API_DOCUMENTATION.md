# E-Commerce Platform - Complete API Documentation

## Overview
This document provides comprehensive API documentation for the E-Commerce Management System backend. All endpoints are RESTful and follow standard HTTP methods.

**Base URL:** `http://localhost:8080/api`

**Authentication:** Bearer JWT Token (except for public endpoints)

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210",
  "address": "123 Main St, City"
}
```

**Success Response:** `201 Created`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `409 Conflict` - Email already exists
- `400 Bad Request` - Validation failed

---

### POST /api/auth/login
Authenticate user and receive JWT token.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Success Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CUSTOMER",
  "message": "Login successful"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Validation failed

---

## Product Endpoints

### GET /api/products
Get all products.

**Authentication:** None (Public)

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000.00,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics"
  }
]
```

---

### GET /api/products/{id}
Get product by ID.

**Authentication:** None (Public)

**Path Parameters:**
- `id` (Long) - Product ID

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1,
  "categoryName": "Electronics"
}
```

**Error Responses:**
- `404 Not Found` - Product not found

---

### POST /api/products
Create a new product (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Request Body:**
```json
{
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1
}
```

**Success Response:** `201 Created`
```json
{
  "id": 1,
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1,
  "categoryName": "Electronics"
}
```

**Error Responses:**
- `403 Forbidden` - Not authorized
- `404 Not Found` - Category not found
- `400 Bad Request` - Validation failed

---

### PUT /api/products/{id}
Update product (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Product ID

**Request Body:**
```json
{
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1
}
```

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1,
  "categoryName": "Electronics"
}
```

**Error Responses:**
- `403 Forbidden` - Not authorized
- `404 Not Found` - Product not found
- `400 Bad Request` - Validation failed

---

### DELETE /api/products/{id}
Delete product (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Product ID

**Success Response:** `204 No Content`

**Error Responses:**
- `403 Forbidden` - Not authorized
- `404 Not Found` - Product not found

---

### GET /api/products/search
Search products by name.

**Authentication:** None (Public)

**Query Parameters:**
- `name` (String) - Product name to search

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000.00,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics"
  }
]
```

---

### GET /api/products/brand/{brand}
Find products by brand.

**Authentication:** None (Public)

**Path Parameters:**
- `brand` (String) - Brand name

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000.00,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics"
  }
]
```

---

### GET /api/products/filter
Filter products by price range.

**Authentication:** None (Public)

**Query Parameters:**
- `minPrice` (BigDecimal) - Minimum price
- `maxPrice` (BigDecimal) - Maximum price

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000.00,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics"
  }
]
```

---

### GET /api/products/category/{categoryId}
Find products by category.

**Authentication:** None (Public)

**Path Parameters:**
- `categoryId` (Long) - Category ID

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000.00,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics"
  }
]
```

---

## Category Endpoints

### GET /api/categories
Get all categories.

**Authentication:** None (Public)

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Electronics"
  }
]
```

---

### GET /api/categories/{id}
Get category by ID.

**Authentication:** None (Public)

**Path Parameters:**
- `id` (Long) - Category ID

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Electronics"
}
```

**Error Responses:**
- `404 Not Found` - Category not found

---

### POST /api/categories
Create a new category (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Request Body:**
```json
{
  "name": "Electronics"
}
```

**Success Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Electronics"
}
```

**Error Responses:**
- `403 Forbidden` - Not authorized
- `409 Conflict` - Category name already exists
- `400 Bad Request` - Validation failed

---

### PUT /api/categories/{id}
Update category (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Category ID

**Request Body:**
```json
{
  "name": "Electronics"
}
```

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Electronics"
}
```

**Error Responses:**
- `403 Forbidden` - Not authorized
- `404 Not Found` - Category not found
- `409 Conflict` - Category name already exists
- `400 Bad Request` - Validation failed

---

### DELETE /api/categories/{id}
Delete category (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Category ID

**Success Response:** `204 No Content`

**Error Responses:**
- `403 Forbidden` - Not authorized
- `404 Not Found` - Category not found
- `409 Conflict` - Category contains products

---

## User Endpoints

### GET /api/users/{id}
Get user by ID.

**Authentication:** Bearer JWT

**Path Parameters:**
- `id` (Long) - User ID

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - User not found

---

### PUT /api/users/{id}
Update user information.

**Authentication:** Bearer JWT

**Path Parameters:**
- `id` (Long) - User ID

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "address": "123 Main St, City"
}
```

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - User not found
- `400 Bad Request` - Validation failed

---

## Cart Endpoints

### GET /api/cart
Get current user's cart.

**Authentication:** Bearer JWT

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "HP Laptop",
      "price": 55000.00,
      "quantity": 2,
      "subtotal": 110000.00
    }
  ],
  "totalAmount": 110000.00
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated

---

### POST /api/cart/items
Add item to cart.

**Authentication:** Bearer JWT

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Success Response:** `201 Created`
```json
{
  "id": 1,
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "HP Laptop",
      "price": 55000.00,
      "quantity": 2,
      "subtotal": 110000.00
    }
  ],
  "totalAmount": 110000.00
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Product not found
- `409 Conflict` - Insufficient stock

---

### PUT /api/cart/items/{itemId}
Update cart item quantity.

**Authentication:** Bearer JWT

**Path Parameters:**
- `itemId` (Long) - Cart item ID

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "HP Laptop",
      "price": 55000.00,
      "quantity": 3,
      "subtotal": 165000.00
    }
  ],
  "totalAmount": 165000.00
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Unauthorized access
- `404 Not Found` - Cart item not found
- `409 Conflict` - Insufficient stock

---

### DELETE /api/cart/items/{itemId}
Remove item from cart.

**Authentication:** Bearer JWT

**Path Parameters:**
- `itemId` (Long) - Cart item ID

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "items": [],
  "totalAmount": 0.00
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Unauthorized access
- `404 Not Found` - Cart item not found

---

### DELETE /api/cart
Clear all items from cart.

**Authentication:** Bearer JWT

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "items": [],
  "totalAmount": 0.00
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated

---

## Order Endpoints

### POST /api/orders/checkout
Process checkout from current user's cart.

**Authentication:** Bearer JWT

**Success Response:** `201 Created`
```json
{
  "orderId": 1,
  "userId": 1,
  "totalAmount": 110000.00,
  "status": "PAYMENT_PENDING",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00",
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "HP Laptop",
      "price": 55000.00,
      "quantity": 2,
      "subtotal": 110000.00,
      "createdAt": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `400 Bad Request` - Empty cart
- `409 Conflict` - Insufficient stock

---

### GET /api/orders
Get current user's order history.

**Authentication:** Bearer JWT

**Success Response:** `200 OK`
```json
[
  {
    "orderId": 1,
    "userId": 1,
    "totalAmount": 110000.00,
    "status": "PLACED",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00",
    "items": [
      {
        "itemId": 1,
        "productId": 1,
        "productName": "HP Laptop",
        "price": 55000.00,
        "quantity": 2,
        "subtotal": 110000.00,
        "createdAt": "2024-01-01T00:00:00"
      }
    ]
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated

---

### GET /api/orders/{orderId}
Get specific order details.

**Authentication:** Bearer JWT

**Path Parameters:**
- `orderId` (Long) - Order ID

**Success Response:** `200 OK`
```json
{
  "orderId": 1,
  "userId": 1,
  "totalAmount": 110000.00,
  "status": "PLACED",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00",
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "HP Laptop",
      "price": 55000.00,
      "quantity": 2,
      "subtotal": 110000.00,
      "createdAt": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Order not found or access denied

---

### PUT /api/orders/{orderId}/cancel
Cancel an order.

**Authentication:** Bearer JWT

**Path Parameters:**
- `orderId` (Long) - Order ID

**Success Response:** `200 OK`
```json
{
  "orderId": 1,
  "userId": 1,
  "totalAmount": 110000.00,
  "status": "CANCELLED",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00",
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "HP Laptop",
      "price": 55000.00,
      "quantity": 2,
      "subtotal": 110000.00,
      "createdAt": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Order not found or access denied
- `409 Conflict` - Invalid order status

---

## Payment Endpoints

### POST /api/payments/create-order
Create payment order for existing order.

**Authentication:** Bearer JWT

**Request Body:**
```json
{
  "orderId": 1
}
```

**Success Response:** `201 Created`
```json
{
  "paymentId": 1,
  "orderId": 1,
  "gateway": "RAZORPAY",
  "gatewayOrderId": "order_xxxxx",
  "amount": 110000.00,
  "currency": "INR",
  "keyId": "rzp_test_xxxxx",
  "status": "CREATED",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Order not found or access denied
- `409 Conflict` - Invalid payment state, payment already completed

---

### POST /api/payments/verify
Verify payment signature and complete payment.

**Authentication:** Bearer JWT

**Request Body:**
```json
{
  "orderId": 1,
  "gatewayOrderId": "order_xxxxx",
  "gatewayPaymentId": "pay_xxxxx",
  "signature": "xxxxx"
}
```

**Success Response:** `200 OK`
```json
{
  "paymentId": 1,
  "orderId": 1,
  "gateway": "RAZORPAY",
  "gatewayOrderId": "order_xxxxx",
  "gatewayPaymentId": "pay_xxxxx",
  "amount": 110000.00,
  "currency": "INR",
  "status": "SUCCESS",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Order or payment not found
- `400 Bad Request` - Invalid payment signature
- `409 Conflict` - Payment already completed

---

### GET /api/payments/order/{orderId}
Get payment status for order.

**Authentication:** Bearer JWT

**Path Parameters:**
- `orderId` (Long) - Order ID

**Success Response:** `200 OK`
```json
{
  "paymentId": 1,
  "orderId": 1,
  "gateway": "RAZORPAY",
  "gatewayOrderId": "order_xxxxx",
  "gatewayPaymentId": "pay_xxxxx",
  "amount": 110000.00,
  "currency": "INR",
  "status": "SUCCESS",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Order or payment not found

---

## Admin Dashboard Endpoints

### GET /api/admin/dashboard
Get dashboard statistics.

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
{
  "totalProducts": 100,
  "totalUsers": 50,
  "totalOrders": 200,
  "totalRevenue": 5000000.00
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

## Admin Product Endpoints

### GET /api/admin/products
Get all products (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000.00,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

### GET /api/admin/products/{id}
Get product by ID (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Product ID

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1,
  "categoryName": "Electronics"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Product not found

---

### POST /api/admin/products
Create a new product (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Request Body:**
```json
{
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1
}
```

**Success Response:** `201 Created`
```json
{
  "id": 1,
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1,
  "categoryName": "Electronics"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Category not found
- `400 Bad Request` - Validation failed

---

### PUT /api/admin/products/{id}
Update product (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Product ID

**Request Body:**
```json
{
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1
}
```

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "HP Laptop",
  "description": "15 inch laptop",
  "price": 55000.00,
  "quantity": 10,
  "brand": "HP",
  "categoryId": 1,
  "categoryName": "Electronics"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Product not found
- `400 Bad Request` - Validation failed

---

### DELETE /api/admin/products/{id}
Delete product (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Product ID

**Success Response:** `204 No Content`

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Product not found

---

### GET /api/admin/products/search
Search products by name (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Query Parameters:**
- `name` (String) - Product name to search

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000.00,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

## Admin Category Endpoints

### GET /api/admin/categories
Get all categories (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Electronics"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

### GET /api/admin/categories/{id}
Get category by ID (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Category ID

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Electronics"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Category not found

---

### POST /api/admin/categories
Create a new category (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Request Body:**
```json
{
  "name": "Electronics"
}
```

**Success Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Electronics"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `409 Conflict` - Category name already exists
- `400 Bad Request` - Validation failed

---

### PUT /api/admin/categories/{id}
Update category (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Category ID

**Request Body:**
```json
{
  "name": "Electronics"
}
```

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Electronics"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Category not found
- `409 Conflict` - Category name already exists
- `400 Bad Request` - Validation failed

---

### DELETE /api/admin/categories/{id}
Delete category (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - Category ID

**Success Response:** `204 No Content`

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Category not found
- `409 Conflict` - Category contains products

---

## Admin Order Endpoints

### GET /api/admin/orders
Get all orders (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
[
  {
    "orderId": 1,
    "userId": 1,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "totalAmount": 110000.00,
    "status": "PLACED",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00",
    "items": [
      {
        "itemId": 1,
        "productId": 1,
        "productName": "HP Laptop",
        "price": 55000.00,
        "quantity": 2,
        "subtotal": 110000.00,
        "createdAt": "2024-01-01T00:00:00"
      }
    ]
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

### GET /api/admin/orders/{orderId}
Get specific order details (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `orderId` (Long) - Order ID

**Success Response:** `200 OK`
```json
{
  "orderId": 1,
  "userId": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "totalAmount": 110000.00,
  "status": "PLACED",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00",
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "HP Laptop",
      "price": 55000.00,
      "quantity": 2,
      "subtotal": 110000.00,
      "createdAt": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Order not found

---

### PUT /api/admin/orders/{orderId}/status
Update order status (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `orderId` (Long) - Order ID

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Success Response:** `200 OK`
```json
{
  "orderId": 1,
  "userId": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "totalAmount": 110000.00,
  "status": "CONFIRMED",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00",
  "items": [
    {
      "itemId": 1,
      "productId": 1,
      "productName": "HP Laptop",
      "price": 55000.00,
      "quantity": 2,
      "subtotal": 110000.00,
      "createdAt": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Order not found
- `409 Conflict` - Invalid order status

---

## Admin User Management Endpoints

### GET /api/admin/users
Get all users (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St, City",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

### GET /api/admin/users/{id}
Get specific user details (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `id` (Long) - User ID

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - User not found

---

### PUT /api/admin/users/{userId}/role
Update user role (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `userId` (Long) - User ID

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

**Success Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "role": "ADMIN",
  "createdAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - User not found
- `409 Conflict` - Cannot remove last admin

---

## Admin Inventory Endpoints

### GET /api/admin/inventory
Get all inventory with stock status (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
[
  {
    "productId": 1,
    "productName": "HP Laptop",
    "price": 55000.00,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics",
    "stockStatus": "IN_STOCK"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

### GET /api/admin/inventory/low-stock
Get low-stock products (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
[
  {
    "productId": 1,
    "productName": "HP Laptop",
    "price": 55000.00,
    "quantity": 3,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics",
    "stockStatus": "LOW_STOCK"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

### GET /api/admin/inventory/out-of-stock
Get out-of-stock products (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
[
  {
    "productId": 1,
    "productName": "HP Laptop",
    "price": 55000.00,
    "quantity": 0,
    "brand": "HP",
    "categoryId": 1,
    "categoryName": "Electronics",
    "stockStatus": "OUT_OF_STOCK"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

### PUT /api/admin/inventory/{productId}
Update product inventory (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `productId` (Long) - Product ID

**Request Body:**
```json
{
  "quantity": 50
}
```

**Success Response:** `200 OK`
```json
{
  "productId": 1,
  "productName": "HP Laptop",
  "price": 55000.00,
  "quantity": 50,
  "brand": "HP",
  "categoryId": 1,
  "categoryName": "Electronics",
  "stockStatus": "IN_STOCK"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Product not found
- `400 Bad Request` - Invalid quantity

---

## Admin Payment Endpoints

### GET /api/admin/payments
Get all payments (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Success Response:** `200 OK`
```json
[
  {
    "paymentId": 1,
    "orderId": 1,
    "gateway": "RAZORPAY",
    "gatewayOrderId": "order_xxxxx",
    "gatewayPaymentId": "pay_xxxxx",
    "amount": 110000.00,
    "currency": "INR",
    "status": "SUCCESS",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)

---

### GET /api/admin/payments/{paymentId}
Get specific payment details (ADMIN only).

**Authentication:** Bearer JWT, Role: ADMIN

**Path Parameters:**
- `paymentId` (Long) - Payment ID

**Success Response:** `200 OK`
```json
{
  "paymentId": 1,
  "orderId": 1,
  "gateway": "RAZORPAY",
  "gatewayOrderId": "order_xxxxx",
  "gatewayPaymentId": "pay_xxxxx",
  "amount": 110000.00,
  "currency": "INR",
  "status": "SUCCESS",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (ADMIN role required)
- `404 Not Found` - Payment not found

---

## Health Check Endpoint

### GET /api/health
Check if the API is running.

**Authentication:** None (Public)

**Success Response:** `200 OK`
```
E-Commerce API is running
```

---

## Common Error Response Format

All error responses follow this format:

```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 404,
  "message": "Error message",
  "path": "/api/endpoint"
}
```

For validation errors:

```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email should be valid",
    "password": "Password must be at least 8 characters"
  },
  "path": "/api/endpoint"
}
```

---

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Successful request with no content
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (duplicate, invalid state)
- `500 Internal Server Error` - Server error

---

## Authentication

### JWT Token Structure
JWT tokens are included in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Token Claims
- `sub` - User email
- `role` - User role (CUSTOMER/ADMIN)
- `iat` - Issued at timestamp
- `exp` - Expiration timestamp

### Token Expiration
Default token expiration: 24 hours (86400000 ms)

---

## Rate Limiting
Currently not implemented. All endpoints are unlimited.

---

## CORS
CORS is configured to allow requests from any origin during development. For production, configure specific allowed origins.