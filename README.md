# E-Commerce Management System

## Project Description
A production-style E-Commerce Management System built with Java and Spring Boot. This project provides a scalable backend for managing e-commerce operations including products, users, orders, payments, and more.

## Technology Stack
- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Web**
- **Spring Data JPA**
- **Spring Security** (for password encoding and JWT authentication)
- **Hibernate**
- **MySQL**
- **Maven**
- **Jakarta Validation**
- **Lombok**
- **JWT (JJWT)** - for token-based authentication

## Current Development Phase
**Phase 6: Order Management + Checkout + Inventory Transactions** ✅ COMPLETED

This phase includes:
- Order and OrderItem entities with proper JPA relationships
- OrderStatus enum (PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- OrderRepository and OrderItemRepository with user-specific queries
- Order DTOs (OrderResponse, OrderItemResponse, UpdateOrderStatusRequest)
- OrderService with complete order management logic
- OrderController with REST endpoints for order operations
- Transactional checkout process with stock deduction
- Price snapshot preservation in OrderItem for historical accuracy
- Stock restoration on order cancellation
- Order ownership verification to prevent IDOR vulnerabilities
- Admin order management endpoints
- Order status transition validation
- Database-level stock update queries for concurrency safety
- Custom exception handling for order-specific errors
- Database constraints for data integrity

**Phase 4: JWT Authentication and Authorization** ✅ COMPLETED

This phase includes:
- JWT Service for token generation and validation
- JWT Authentication Filter for request processing
- Custom UserDetailsService for Spring Security integration
- Updated LoginResponse DTO to include JWT tokens
- Security configuration with JWT filter and role-based authorization
- Role-based access control (ADMIN vs CUSTOMER permissions)
- Token-based authentication for protected endpoints
- Bearer token support in Authorization headers
- Public endpoints for registration, login, and product browsing
- Protected endpoints for user management and admin operations
- JWT secret and expiration configuration
- Token validation and expiration handling

**Phase 3: User Registration and Login** ✅ COMPLETED

This phase includes:
- User entity with BCrypt password hashing
- Role enum (CUSTOMER, ADMIN)
- User repository with email lookup methods
- Registration and login DTOs with validation
- User response DTOs (password excluded)
- Custom exceptions for user-related errors
- SecurityConfig with PasswordEncoder bean and permitAll configuration
- User service with registration and login logic
- Auth controller with register and login endpoints
- User controller with get and update endpoints
- Email normalization to lowercase
- Automatic role assignment (CUSTOMER) for registration
- Password security with BCrypt hashing
- Global exception handler updates
- Security configuration to allow Phase 3 testing (authorization to be added in Phase 4)

**Phase 2: Product and Category Management** ✅ COMPLETED

This phase includes:
- Category entity with JPA annotations and validation
- Product entity with JPA annotations and validation
- Category and Product repositories with custom query methods
- Data Transfer Objects (DTOs) for clean API design
- Category and Product services with business logic
- Custom exception classes for error handling
- Global exception handler for consistent error responses
- REST API controllers for categories and products
- Search and filter functionality for products
- CRUD operations with proper validation

## Database Configuration

### Prerequisites
- MySQL installed and running
- Database named `ecommerce_db` created

### Create Database
```sql
CREATE DATABASE ecommerce_db;
```

### Environment Variable Setup
Set the `DB_PASSWORD` environment variable with your MySQL root password:

**Windows (Command Prompt):**
```cmd
set DB_PASSWORD=your_password
```

**Windows (PowerShell):**
```powershell
$env:DB_PASSWORD="your_password"
```

**Windows (System Environment Variable - Permanent):**
1. Right-click "This PC" → Properties → Advanced system settings
2. Click "Environment Variables"
3. Under "User variables" or "System variables", click "New"
4. Variable name: `DB_PASSWORD`
5. Variable value: your MySQL password
6. Click OK to save

## How to Run the Application

### Using Maven
```bash
mvn spring-boot:run
```

### Using Maven to package and run
```bash
mvn clean package
java -jar target/ecommerce-1.0.0.jar
```

### Verification
Once the application starts:
- Access the health check endpoint: `http://localhost:8080/api/health`
- Expected response: "E-Commerce API is running"
- Check the console for successful database connection logs

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password

### User Endpoints
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user information

### Cart Endpoints
- `GET /api/cart` - Get current user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{itemId}` - Update cart item quantity
- `DELETE /api/cart/items/{itemId}` - Remove item from cart
- `DELETE /api/cart` - Clear all items from cart

### Order Endpoints
- `POST /api/orders/checkout` - Process checkout from current user's cart
- `GET /api/orders` - Get current user's order history
- `GET /api/orders/{orderId}` - Get specific order details
- `PUT /api/orders/{orderId}/cancel` - Cancel an order (PLACED status only)

### Admin Order Endpoints
- `GET /api/admin/orders` - Get all orders (ADMIN only)
- `PUT /api/admin/orders/{orderId}/status` - Update order status (ADMIN only)

### Category Endpoints
- `POST /api/categories` - Create a new category
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Product Endpoints
- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search?name={name}` - Search products by name
- `GET /api/products/brand/{brand}` - Find products by brand
- `GET /api/products/filter?minPrice={min}&maxPrice={max}` - Filter products by price range
- `GET /api/products/category/{categoryId}` - Find products by category

## Example API Usage

### Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Madhan",
    "email": "madhan@gmail.com",
    "password": "Password123",
    "phone": "9876543210",
    "address": "India"
  }'
```

### Login (returns JWT token)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "madhan@gmail.com",
    "password": "Password123"
  }'
```

### Access Protected Endpoint (with JWT token)
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Cart (requires JWT)
```bash
curl -X GET http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Item to Cart (requires JWT)
```bash
curl -X POST http://localhost:8080/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Update Cart Item (requires JWT)
```bash
curl -X PUT http://localhost:8080/api/cart/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "quantity": 3
  }'
```

### Remove Cart Item (requires JWT)
```bash
curl -X DELETE http://localhost:8080/api/cart/items/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Clear Cart (requires JWT)
```bash
curl -X DELETE http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Checkout (requires JWT)
```bash
curl -X POST http://localhost:8080/api/orders/checkout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Order History (requires JWT)
```bash
curl -X GET http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Specific Order (requires JWT)
```bash
curl -X GET http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Cancel Order (requires JWT)
```bash
curl -X PUT http://localhost:8080/api/orders/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Orders (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/orders \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Update Order Status (ADMIN only)
```bash
curl -X PUT http://localhost:8080/api/admin/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "status": "CONFIRMED"
  }'
```

### Create a Category
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Electronics"}'
```

### Create a Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1
  }'
```

### Get All Products
```bash
curl http://localhost:8080/api/products
```

### Search Products
```bash
curl http://localhost:8080/api/products/search?name=laptop
```

## Project Structure
```
src/main/java/com/ecommerce/ecommerce/
├── controller/     # REST API controllers
│   ├── HealthController.java
│   ├── CategoryController.java
│   ├── ProductController.java
│   ├── AuthController.java
│   ├── UserController.java
│   ├── CartController.java
│   └── OrderController.java
├── service/        # Business logic layer
│   ├── CategoryService.java
│   ├── ProductService.java
│   ├── UserService.java
│   ├── CartService.java
│   └── OrderService.java
├── repository/     # Data access layer
│   ├── CategoryRepository.java
│   ├── ProductRepository.java
│   ├── UserRepository.java
│   ├── CartRepository.java
│   ├── CartItemRepository.java
│   ├── OrderRepository.java
│   └── OrderItemRepository.java
├── entity/         # JPA entities
│   ├── Category.java
│   ├── Product.java
│   ├── User.java
│   ├── Cart.java
│   ├── CartItem.java
│   ├── Order.java
│   └── OrderItem.java
├── dto/            # Data Transfer Objects
│   ├── CategoryRequest.java
│   ├── CategoryResponse.java
│   ├── ProductRequest.java
│   ├── ProductResponse.java
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   ├── UserResponse.java
│   ├── LoginResponse.java
│   ├── UpdateUserRequest.java
│   ├── AddToCartRequest.java
│   ├── UpdateCartItemRequest.java
│   ├── CartItemResponse.java
│   ├── CartResponse.java
│   ├── OrderResponse.java
│   ├── OrderItemResponse.java
│   └── UpdateOrderStatusRequest.java
├── exception/      # Custom exceptions
│   ├── CategoryNotFoundException.java
│   ├── ProductNotFoundException.java
│   ├── DuplicateCategoryException.java
│   ├── UserNotFoundException.java
│   ├── DuplicateEmailException.java
│   ├── InvalidCredentialsException.java
│   ├── CartNotFoundException.java
│   ├── CartItemNotFoundException.java
│   ├── InsufficientStockException.java
│   ├── UnauthorizedAccessException.java
│   ├── OrderNotFoundException.java
│   ├── EmptyCartException.java
│   ├── InvalidOrderStatusException.java
│   ├── ErrorResponse.java
│   ├── ValidationErrorResponse.java
│   └── GlobalExceptionHandler.java
├── config/         # Configuration classes
│   └── SecurityConfig.java
├── security/       # Security components
│   ├── JwtService.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── enums/          # Enumerations
    ├── Role.java
    └── OrderStatus.java
```

## Architecture Overview

### Layered Architecture
The application follows a clean layered architecture:

1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic and validation
3. **Repository Layer**: Manages database operations using Spring Data JPA
4. **Entity Layer**: Represents database tables with JPA annotations
5. **DTO Layer**: Data transfer objects for clean API design

### Entity Relationships
- **Category to Product**: One-to-Many relationship
- **Product to Category**: Many-to-One relationship
- **User to Cart**: One-to-One relationship (unique cart per user)
- **Cart to CartItem**: One-to-Many relationship
- **CartItem to Product**: Many-to-One relationship
- **User to Order**: One-to-Many relationship
- **Order to OrderItem**: One-to-Many relationship
- **OrderItem to Product**: Many-to-One relationship
- Cascade operations configured for data integrity
- JSON serialization handled to prevent infinite recursion

### User Management (Phase 3 & 4)
- **User Entity**: Contains user information with BCrypt password hashing
- **Roles**: CUSTOMER and ADMIN roles
- **Registration**: Automatically assigns CUSTOMER role
- **Password Security**: BCrypt encoding for secure password storage
- **Email Normalization**: Emails are converted to lowercase for consistency
- **Password Protection**: Passwords never exposed in API responses
- **Authentication**: JWT-based authentication with Bearer tokens
- **Security Configuration**: JWT filter with role-based authorization
- **Test Results**: All Phase 3 and Phase 4 test cases passed successfully

### JWT Authentication (Phase 4)
- **Token Generation**: JWT tokens generated on successful login with user email and role
- **Token Validation**: JWT filter validates tokens on each request to protected endpoints
- **Token Expiration**: Configurable token expiration time (default 24 hours)
- **Security Filter**: JwtAuthenticationFilter processes Authorization headers
- **User Details Service**: CustomUserDetailsService loads user authorities
- **Role-based Access**: ADMIN role for product/category management, CUSTOMER for shopping
- **Public Endpoints**: Registration, login, and product browsing without authentication
- **Protected Endpoints**: User management and admin operations require valid JWT tokens

### Shopping Cart Management (Phase 5)
- **Cart Entity**: One-to-One relationship with User, unique per user
- **CartItem Entity**: Many-to-One relationships with Cart and Product
- **Database Constraints**: Unique constraint on (cart_id, product_id) to prevent duplicates
- **Stock Validation**: Ensures requested quantity doesn't exceed available stock
- **Cart Total Calculation**: Uses BigDecimal for accurate monetary calculations
- **Authentication Required**: All cart endpoints require valid JWT tokens
- **Ownership Verification**: Prevents IDOR vulnerabilities by verifying cart item ownership
- **Duplicate Handling**: Adding same product updates existing quantity instead of creating new entry
- **Concurrent Access**: Basic stock validation implemented (advanced concurrency for Phase 6)
- **Cart Response**: Returns cart ID, items with subtotals, and total amount
- **Automatic Cart Creation**: Cart is automatically created when user first accesses cart endpoint
- **Price Handling**: Cart uses current product prices (purchase-time prices will be stored in Order during Phase 6)
- **Security Note**: Users can only access and modify their own cart items
- **Limitation Note**: Final inventory transaction handling will be implemented in Phase 6

### Error Handling
- Custom exceptions for specific business errors
- Global exception handler for consistent error responses
- Validation errors handled with detailed field-level messages
- HTTP status codes follow REST best practices

## Next Phases
- ~~Phase 1: Initial Project Setup and Configuration~~ ✅ COMPLETED
- ~~Phase 2: Product and Category Management~~ ✅ COMPLETED
- ~~Phase 3: User Registration and Login~~ ✅ COMPLETED
- ~~Phase 4: JWT Authentication and Authorization~~ ✅ COMPLETED
- ~~Phase 5: Shopping Cart Management~~ ✅ COMPLETED
- Phase 6: Order Management
- Phase 7: Payment Integration
- Phase 8: Admin Functionality
- Phase 9: Frontend Development
