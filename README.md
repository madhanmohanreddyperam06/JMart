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
**Phase 8: Payment Integration** ✅ COMPLETED

This phase includes:
- Razorpay payment gateway integration in TEST/SANDBOX mode
- Payment entity with comprehensive payment tracking
- PaymentStatus enum (CREATED, PENDING, SUCCESS, FAILED, CANCELLED)
- PaymentGateway abstraction layer for clean architecture
- RazorpayPaymentGateway implementation with signature verification
- Payment order creation API with server-side amount validation
- Payment verification API with Razorpay signature validation
- Payment status retrieval API for order payment tracking
- Admin payment management endpoints
- PAYMENT_PENDING order status for pre-payment state
- Modified checkout flow to defer inventory deduction until payment success
- Payment idempotency to prevent duplicate payments
- Payment ownership security checks
- BigDecimal precision for monetary calculations
- Environment variable configuration for Razorpay credentials
- Transaction-safe payment processing
- Comprehensive payment exception handling

**Phase 7: Admin Module & Administration APIs** ✅ COMPLETED

This phase includes:
- Admin dashboard with comprehensive statistics and revenue calculations
- Admin product management with full CRUD operations
- Admin category management with deletion protection
- Admin user management with role updates and last-admin protection
- Admin order management with status transitions
- Admin inventory management with low-stock alerts
- Configurable low-stock threshold for inventory monitoring
- Stock status classification (IN_STOCK, LOW_STOCK, OUT_OF_STOCK)
- Admin-specific DTOs and exception handling
- Role-based authorization for all admin endpoints
- Revenue calculation excluding cancelled orders
- Comprehensive admin API structure under /api/admin base path

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

## Razorpay Configuration (Phase 8)

### Prerequisites
- Razorpay account with TEST/SANDBOX mode enabled
- Razorpay API Key ID and Key Secret from test mode

### Environment Variable Setup
Set the Razorpay credentials as environment variables:

**Windows (Command Prompt):**
```cmd
set RAZORPAY_KEY_ID=your_test_key_id
set RAZORPAY_KEY_SECRET=your_test_key_secret
```

**Windows (PowerShell):**
```powershell
$env:RAZORPAY_KEY_ID="your_test_key_id"
$env:RAZORPAY_KEY_SECRET="your_test_key_secret"
```

**Windows (System Environment Variable - Permanent):**
1. Right-click "This PC" → Properties → Advanced system settings
2. Click "Environment Variables"
3. Under "User variables" or "System variables", click "New"
4. Variable name: `RAZORPAY_KEY_ID`, Variable value: your test key ID
5. Variable name: `RAZORPAY_KEY_SECRET`, Variable value: your test key secret
6. Click OK to save

### Important Security Notes
- Only use TEST/SANDBOX credentials from Razorpay
- Never use production credentials in development
- Never commit actual credentials to source control
- Credentials are stored in environment variables only
- The application uses environment variable placeholders in application.properties

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
- `POST /api/orders/checkout` - Process checkout from current user's cart (creates PAYMENT_PENDING order)
- `GET /api/orders` - Get current user's order history
- `GET /api/orders/{orderId}` - Get specific order details
- `PUT /api/orders/{orderId}/cancel` - Cancel an order (PLACED or PAYMENT_PENDING status only)

### Admin Product Endpoints
- `POST /api/admin/products` - Create a new product (ADMIN only)
- `GET /api/admin/products` - Get all products (ADMIN only)
- `GET /api/admin/products/{id}` - Get product by ID (ADMIN only)
- `PUT /api/admin/products/{id}` - Update product (ADMIN only)
- `DELETE /api/admin/products/{id}` - Delete product (ADMIN only)
- `GET /api/admin/products/search?name={name}` - Search products by name (ADMIN only)

### Admin Category Endpoints
- `POST /api/admin/categories` - Create a new category (ADMIN only)
- `GET /api/admin/categories` - Get all categories (ADMIN only)
- `GET /api/admin/categories/{id}` - Get category by ID (ADMIN only)
- `PUT /api/admin/categories/{id}` - Update category (ADMIN only)
- `DELETE /api/admin/categories/{id}` - Delete category (ADMIN only)

### Admin Order Endpoints
- `GET /api/admin/orders` - Get all orders (ADMIN only)
- `GET /api/admin/orders/{orderId}` - Get specific order details (ADMIN only)
- `PUT /api/admin/orders/{orderId}/status` - Update order status (ADMIN only)

### Admin Dashboard Endpoints
- `GET /api/admin/dashboard` - Get dashboard statistics (ADMIN only)

### Admin Inventory Endpoints
- `GET /api/admin/inventory` - Get all inventory with stock status (ADMIN only)
- `GET /api/admin/inventory/low-stock` - Get low-stock products (ADMIN only)
- `GET /api/admin/inventory/out-of-stock` - Get out-of-stock products (ADMIN only)
- `PUT /api/admin/inventory/{productId}` - Update product inventory (ADMIN only)

### Admin User Management Endpoints
- `GET /api/admin/users` - Get all users (ADMIN only)
- `GET /api/admin/users/{id}` - Get specific user details (ADMIN only)
- `PUT /api/admin/users/{userId}/role` - Update user role (ADMIN only)

### Payment Endpoints
- `POST /api/payments/create-order` - Create payment order for existing order (CUSTOMER only)
- `POST /api/payments/verify` - Verify payment signature and complete payment (CUSTOMER only)
- `GET /api/payments/order/{orderId}` - Get payment status for order (CUSTOMER only)

### Admin Payment Endpoints
- `GET /api/admin/payments` - Get all payments (ADMIN only)
- `GET /api/admin/payments/{paymentId}` - Get specific payment details (ADMIN only)

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

### Get Admin Dashboard (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Get All Inventory (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/inventory \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Get Low Stock Products (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/inventory/low-stock \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Get Out of Stock Products (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/inventory/out-of-stock \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Update Inventory (ADMIN only)
```bash
curl -X PUT http://localhost:8080/api/admin/inventory/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "quantity": 50
  }'
```

### Get All Users (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Get Specific User (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/users/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Update User Role (ADMIN only)
```bash
curl -X PUT http://localhost:8080/api/admin/users/2/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "role": "ADMIN"
  }'
```

### Create Payment Order (CUSTOMER only)
```bash
curl -X POST http://localhost:8080/api/payments/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CUSTOMER_JWT_TOKEN" \
  -d '{
    "orderId": 1
  }'
```

### Verify Payment (CUSTOMER only)
```bash
curl -X POST http://localhost:8080/api/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CUSTOMER_JWT_TOKEN" \
  -d '{
    "orderId": 1,
    "gatewayOrderId": "order_xxxxx",
    "gatewayPaymentId": "pay_xxxxx",
    "signature": "xxxxx"
  }'
```

### Get Payment Status (CUSTOMER only)
```bash
curl -X GET http://localhost:8080/api/payments/order/1 \
  -H "Authorization: Bearer YOUR_CUSTOMER_JWT_TOKEN"
```

### Get All Payments (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/payments \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Get Payment Details (ADMIN only)
```bash
curl -X GET http://localhost:8080/api/admin/payments/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Create Product (ADMIN only)
```bash
curl -X POST http://localhost:8080/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "HP Laptop",
    "description": "15 inch laptop",
    "price": 55000,
    "quantity": 10,
    "brand": "HP",
    "categoryId": 1
  }'
```

### Delete Category (ADMIN only)
```bash
curl -X DELETE http://localhost:8080/api/admin/categories/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
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
│   ├── OrderController.java
│   ├── AdminDashboardController.java
│   ├── AdminProductController.java
│   ├── AdminCategoryController.java
│   ├── AdminUserController.java
│   ├── AdminOrderController.java
│   └── AdminInventoryController.java
├── service/        # Business logic layer
│   ├── CategoryService.java
│   ├── ProductService.java
│   ├── UserService.java
│   ├── CartService.java
│   ├── OrderService.java
│   ├── AdminDashboardService.java
│   ├── AdminInventoryService.java
│   ├── AdminUserService.java
│   └── AdminOrderService.java
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
│   ├── UpdateOrderStatusRequest.java
│   ├── AdminDashboardResponse.java
│   ├── AdminUserResponse.java
│   ├── AdminOrderResponse.java
│   ├── InventoryResponse.java
│   ├── InventoryUpdateRequest.java
│   └── UpdateUserRoleRequest.java
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
│   ├── LastAdminException.java
│   ├── CategoryInUseException.java
│   ├── InvalidInventoryQuantityException.java
│   ├── ErrorResponse.java
│   ├── ValidationErrorResponse.java
│   └── GlobalExceptionHandler.java
├── config/         # Configuration classes
│   ├── SecurityConfig.java
│   └── DataInitializer.java
├── security/       # Security components
│   ├── JwtService.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── enums/          # Enumerations
    ├── Role.java
    ├── OrderStatus.java
    └── StockStatus.java
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

### Admin Module (Phase 7)
- **Admin Dashboard**: Comprehensive statistics with revenue calculations (excluding cancelled orders)
- **Admin Product Management**: Full CRUD operations for products under admin control
- **Admin Category Management**: Category management with deletion protection for categories with products
- **Admin User Management**: User role management with last-admin protection to prevent accidental admin removal
- **Admin Order Management**: Complete order access and status management with transition validation
- **Admin Inventory Management**: Stock monitoring with configurable low-stock threshold and direct inventory updates
- **Stock Status Classification**: Products classified as IN_STOCK, LOW_STOCK, or OUT_OF_STOCK based on configurable threshold
- **Role-Based Authorization**: All admin endpoints require ROLE_ADMIN, preventing customer access
- **Security Model**: Preserves existing JWT authentication and authorization, extends with admin-specific permissions
- **Configuration**: Low-stock threshold configurable via application.properties
- **Revenue Calculation**: Only DELIVERED orders contribute to revenue; CANCELLED orders are excluded
- **Admin Controllers**: Separate controllers for dashboard, products, categories, users, orders, and inventory
- **Admin Services**: Dedicated services for dashboard statistics and inventory management
- **Category Deletion Safety**: Prevents deletion of categories that have products assigned
- **Last Admin Protection**: Prevents removal of the last administrator to ensure system administration access
- **Inventory Validation**: Prevents negative inventory quantities through validation
- **Admin-Specific DTOs**: AdminUserResponse, AdminOrderResponse, InventoryResponse, and InventoryUpdateRequest
- **Exception Handling**: LastAdminException, CategoryInUseException, InvalidInventoryQuantityException

### Payment Integration (Phase 8)
- **Razorpay Integration**: Real payment gateway integration in TEST/SANDBOX mode only
- **Payment Gateway Abstraction**: Clean architecture with PaymentGateway interface separating business logic from Razorpay-specific code
- **Payment Entity**: Comprehensive payment tracking with order relationship, gateway identifiers, amount, currency, and status
- **PaymentStatus Enum**: CREATED, PENDING, SUCCESS, FAILED, CANCELLED for clear payment state management
- **Payment Order Creation**: Server-side order creation with Razorpay, amount derived from order total (never trusted from client)
- **Payment Verification**: Razorpay signature verification using HMAC-SHA256 to ensure payment authenticity
- **Amount Integrity**: Payment amount always derived from server-side order total, preventing client-side manipulation
- **Currency**: Fixed to INR for this project, determined by backend configuration
- **Payment Lifecycle**: Order created with PAYMENT_PENDING → Payment order created → Customer pays → Signature verified → Payment SUCCESS → Order PLACED → Inventory deducted
- **Inventory Deduction**: Moved from checkout to post-payment verification to prevent stock deduction for failed payments
- **Payment Idempotency**: Prevents duplicate payment creation for the same order; reuses existing CREATED/PENDING payments
- **Payment Retry**: Allows retry for FAILED payments; rejects retry for SUCCESS payments
- **Ownership Security**: Customers can only create/verify payments for their own orders
- **Transaction Safety**: Database operations wrapped in transactions for consistency
- **Security Configuration**: Razorpay credentials configured via environment variables, never stored in source code
- **Admin Payment Access**: Admin endpoints for viewing all payments and payment details
- **Exception Handling**: PaymentNotFoundException, PaymentVerificationException, PaymentAlreadyCompletedException, PaymentCreationException, InvalidPaymentStateException
- **Amount Conversion**: Proper conversion from INR to smallest currency unit (paise) using BigDecimal for precision
- **Signature Verification**: Uses Razorpay SDK's Utils.verifyPaymentSignature for secure signature validation
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Next Phases
- ~~Phase 1: Initial Project Setup and Configuration~~ ✅ COMPLETED
- ~~Phase 2: Product and Category Management~~ ✅ COMPLETED
- ~~Phase 3: User Registration and Login~~ ✅ COMPLETED
- ~~Phase 4: JWT Authentication and Authorization~~ ✅ COMPLETED
- ~~Phase 5: Shopping Cart Management~~ ✅ COMPLETED
- ~~Phase 6: Order Management + Checkout + Inventory Transactions~~ ✅ COMPLETED
- ~~Phase 7: Admin Module & Administration APIs~~ ✅ COMPLETED
- ~~Phase 8: Payment Integration~~ ✅ COMPLETED
- Phase 9: Frontend Development
