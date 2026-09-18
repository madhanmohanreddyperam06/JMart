# 🛒 JMart - E-Commerce Platform Application

[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Maven](https://img.shields.io/badge/Maven-3.9-red?style=for-the-badge&logo=apache-maven&logoColor=white)](https://maven.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

A production-ready e-commerce platform with comprehensive backend API and modern frontend. Built with Java Spring Boot and featuring Razorpay payment integration, JWT authentication, and a beautiful animated landing page.

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 💳 **Payment Integration** - Razorpay payment gateway integration
- 🛍️ **Product Management** - Full CRUD operations for products and categories
- 🛒 **Shopping Cart** - Dynamic cart with real-time updates
- 📦 **Order Management** - Complete order lifecycle management
- 👤 **User Management** - Role-based access control (Admin/Customer)
- 📊 **Admin Dashboard** - Comprehensive analytics and inventory management
- 🎨 **Modern Frontend** - Beautiful animated landing page with JMart branding
- 🔒 **Security** - BCrypt password hashing and role-based authorization
- 📱 **Responsive Design** - Mobile-friendly interface

## 🚀 Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Application framework
- **Spring Web** - REST API framework
- **Spring Data JPA** - Database abstraction
- **Spring Security** - Security framework
- **Hibernate** - ORM framework
- **MySQL 8.0** - Database
- **Maven** - Build tool
- **JWT (JJWT 0.11.5)** - Token-based authentication
- **Razorpay Java SDK 1.4.5** - Payment gateway integration
- **Springdoc OpenAPI 2.2.0** - API documentation

### Frontend
- **HTML5/CSS3/JavaScript** - Core technologies
- **Responsive Design** - Mobile-first approach
- **Modern CSS** - Animations and gradients
- **REST API Integration** - Dynamic content loading

## 📋 Prerequisites

- **Java 17+** installed
- **MySQL 8.0+** installed and running
- **Maven** (or use included wrapper)
- **Razorpay Test Account** (for payment integration)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd E-Commerce Platform
```

### 2. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE ecommerce_db;
```

#### Set Environment Variables

**Windows (PowerShell):**
```powershell
$env:DB_PASSWORD="your_mysql_password"
$env:RAZORPAY_KEY_ID="your_razorpay_key_id"
$env:RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

**Windows (Command Prompt):**
```cmd
set DB_PASSWORD=your_mysql_password
set RAZORPAY_KEY_ID=your_razorpay_key_id
set RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Linux/Mac:**
```bash
export DB_PASSWORD="your_mysql_password"
export RAZORPAY_KEY_ID="your_razorpay_key_id"
export RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

### 3. Run the Application

#### Using Maven Wrapper (Recommended)
```bash
.\mvnw.cmd spring-boot:run
```

#### Using Maven
```bash
mvn spring-boot:run
```

#### Package and Run
```bash
.\mvnw.cmd clean package
java -jar target/ecommerce-1.0.0.jar
```

## 🌐 Access Points

Once the application starts successfully:

- **Frontend**: `http://localhost:8080/` (Animated landing page)
- **API Documentation**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/api/health`
- **API Base URL**: `http://localhost:8080/api`

## 📁 Project Structure

```
E-Commerce Platform/
├── src/main/java/com/ecommerce/ecommerce/
│   ├── config/              # Configuration classes
│   │   ├── SecurityConfig.java
│   │   ├── RazorpayConfig.java
│   │   ├── WebMvcConfig.java
│   │   └── OpenApiConfig.java
│   ├── controller/          # REST API controllers
│   │   ├── AuthController.java
│   │   ├── ProductController.java
│   │   ├── CategoryController.java
│   │   ├── CartController.java
│   │   ├── OrderController.java
│   │   ├── PaymentController.java
│   │   └── admin/           # Admin controllers
│   ├── service/             # Business logic
│   ├── repository/          # Data access layer
│   ├── entity/              # JPA entities
│   ├── dto/                 # Data transfer objects
│   ├── exception/           # Custom exceptions
│   ├── security/            # Security components
│   ├── gateway/             # Payment gateway
│   └── enums/               # Enumerations
├── src/main/resources/
│   ├── application.properties
│   └── frontend/           # Static frontend files
│       ├── landing.html     # Animated landing page
│       ├── index.html       # Products page
│       ├── login.html       # Login page
│       ├── register.html    # Registration page
│       ├── cart.html        # Shopping cart
│       ├── orders.html      # Order history
│       ├── checkout.html    # Checkout page
│       ├── css/             # Stylesheets
│       └── js/              # JavaScript files
├── .gitignore
├── API_DOCUMENTATION.md
├── README.md
├── mvnw.cmd
└── pom.xml
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?name={name}` - Search products
- `GET /api/products/category/{id}` - Filter by category

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID

### Cart (Requires JWT)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update item quantity
- `DELETE /api/cart/items/{id}` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders (Requires JWT)
- `POST /api/orders/checkout` - Process checkout
- `GET /api/orders` - Get order history
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/cancel` - Cancel order

### Payments (Requires JWT)
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/order/{id}` - Get payment status

### Admin (Requires ADMIN role)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/products` - Manage products
- `GET /api/admin/categories` - Manage categories
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/users` - Manage users
- `GET /api/admin/inventory` - Inventory management
- `GET /api/admin/payments` - Payment management

## 👥 User Flow

1. **Landing Page** → Beautiful animated JMart welcome page
2. **Registration** → First-time users create account
3. **Login** → Existing users sign in
4. **Browse Products** → View and search products
5. **Add to Cart** → Build shopping cart
6. **Checkout** → Process order with payment
7. **Order Management** → Track order status

## 🔐 Security Features

- **JWT Authentication** - Token-based security
- **BCrypt Password Hashing** - Secure password storage
- **Role-Based Access Control** - Admin/Customer permissions
- **CORS Configuration** - Cross-origin resource sharing
- **Input Validation** - Jakarta validation annotations
- **SQL Injection Prevention** - JPA parameterized queries
- **XSS Protection** - Input sanitization

## 💳 Payment Integration

- **Razorpay Integration** - TEST/SANDBOX mode
- **Secure Payment Flow** - Signature verification
- **Order Status Tracking** - PAYMENT_PENDING → PLACED
- **Inventory Deduction** - Only after successful payment
- **Transaction Safety** - Idempotent payment processing

## 🧪 Testing

### API Testing with Swagger
1. Navigate to `http://localhost:8080/swagger-ui.html`
2. Use the interactive API documentation
3. Test endpoints with real data

### Manual Testing
```bash
# Health check
curl http://localhost:8080/api/health

# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Password123","phone":"1234567890","address":"USA"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MySQL is running on localhost:3306
- Verify database `ecommerce_db` exists
- Check DB_PASSWORD environment variable

### Port 8080 Already in Use
```bash
# Find and kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Build Errors
```bash
# Clean and rebuild
.\mvnw.cmd clean install
```

## 📝 Development Phases

- ✅ **Phase 1**: Project setup and basic structure
- ✅ **Phase 2**: Product and category management
- ✅ **Phase 3**: User registration and login
- ✅ **Phase 4**: JWT authentication and authorization
- ✅ **Phase 6**: Order management and checkout
- ✅ **Phase 7**: Admin module and dashboard
- ✅ **Phase 8**: Payment integration with Razorpay
- ✅ **Phase 9**: Modern frontend with JMart branding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**JMart Development Team**

## 🙏 Acknowledgments

- Spring Boot team for the amazing framework
- Razorpay for payment gateway integration
- Open source community for various libraries

---

**Note**: This is a development project. For production use, ensure proper security measures, SSL certificates, and production-ready configurations are implemented.