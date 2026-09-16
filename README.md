# E-Commerce Management System

## Project Description
A production-style E-Commerce Management System built with Java and Spring Boot. This project provides a scalable backend for managing e-commerce operations including products, users, orders, payments, and more.

## Technology Stack
- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Web**
- **Spring Data JPA**
- **Spring Security** (for password encoding)
- **Hibernate**
- **MySQL**
- **Maven**
- **Jakarta Validation**
- **Lombok**

## Current Development Phase
**Phase 3: User Registration and Login** ✅ COMPLETED

This phase includes:
- User entity with BCrypt password hashing
- Role enum (CUSTOMER, ADMIN)
- User repository with email lookup methods
- Registration and login DTOs with validation
- User response DTOs (password excluded)
- Custom exceptions for user-related errors
- Minimal SecurityConfig for PasswordEncoder bean
- User service with registration and login logic
- Auth controller with register and login endpoints
- User controller with get and update endpoints
- Email normalization to lowercase
- Automatic role assignment (CUSTOMER) for registration
- Password security with BCrypt hashing
- Global exception handler updates

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

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "madhan@gmail.com",
    "password": "Password123"
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
│   └── UserController.java
├── service/        # Business logic layer
│   ├── CategoryService.java
│   ├── ProductService.java
│   └── UserService.java
├── repository/     # Data access layer
│   ├── CategoryRepository.java
│   ├── ProductRepository.java
│   └── UserRepository.java
├── entity/         # JPA entities
│   ├── Category.java
│   ├── Product.java
│   └── User.java
├── dto/            # Data Transfer Objects
│   ├── CategoryRequest.java
│   ├── CategoryResponse.java
│   ├── ProductRequest.java
│   ├── ProductResponse.java
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   ├── UserResponse.java
│   ├── LoginResponse.java
│   └── UpdateUserRequest.java
├── exception/      # Custom exceptions
│   ├── CategoryNotFoundException.java
│   ├── ProductNotFoundException.java
│   ├── DuplicateCategoryException.java
│   ├── UserNotFoundException.java
│   ├── DuplicateEmailException.java
│   ├── InvalidCredentialsException.java
│   ├── ErrorResponse.java
│   ├── ValidationErrorResponse.java
│   └── GlobalExceptionHandler.java
├── config/         # Configuration classes
│   └── SecurityConfig.java
└── enums/          # Enumerations
    └── Role.java
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
- Cascade operations configured for data integrity
- JSON serialization handled to prevent infinite recursion

### User Management (Phase 3)
- **User Entity**: Contains user information with BCrypt password hashing
- **Roles**: CUSTOMER and ADMIN roles
- **Registration**: Automatically assigns CUSTOMER role
- **Password Security**: BCrypt encoding for secure password storage
- **Email Normalization**: Emails are converted to lowercase for consistency
- **Password Protection**: Passwords never exposed in API responses
- **Authentication**: Basic login functionality (JWT to be added in Phase 4)

### Error Handling
- Custom exceptions for specific business errors
- Global exception handler for consistent error responses
- Validation errors handled with detailed field-level messages
- HTTP status codes follow REST best practices

## Next Phases
- ~~Phase 1: Initial Project Setup and Configuration~~ ✅ COMPLETED
- ~~Phase 2: Product and Category Management~~ ✅ COMPLETED
- Phase 3: User Management and Authentication
- Phase 4: Shopping Cart
- Phase 5: Order Management
- Phase 6: Payment Integration
- Phase 7: Admin Functionality
- Phase 8: Frontend Development
