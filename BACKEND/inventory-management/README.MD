# Retail Inventory Management - Authentication & Authorization

## 📌 Overview

This section of the project implements Authentication & Authorization for a Retail Inventory Management System using Spring Boot, OAuth2, and JWT (JSON Web Tokens).

The system ensures:
- User Registration & Login
- JWT-based Authentication
- Role-based Access Control (RBAC)
- Token Validation & Security Measures

## 🛠 Technologies Used
- Spring Boot 3.x
- Spring Security
- OAuth2 & JWT
- RSA Public/Private Key Pair for Secure Token Signing
- Spring Data JPA (Hibernate)
- H2 (Development) / PostgreSQL (Production)
- Maven (Project Management & Dependencies)

## 📂 Project Structure

```
src/main/java/com/retailinventory/
├── controller/
│   ├── AuthController.java      # Handles user authentication
│   ├── UserController.java      # Handles user profile retrieval
│
├── security/
│   ├── JwtUtil.java             # JWT Token Generation & Validation
│   ├── SecurityConfig.java      # Spring Security Configuration
│
├── model/
│   ├── User.java                # User Entity Model
│
├── repository/
│   ├── UserRepository.java      # User Database Interactions
│
├── service/
│   ├── AuthService.java         # Business Logic for Authentication
│
└── resources/
    ├── application.properties   # Spring Boot Configurations
    ├── private.pem              # RSA Private Key
    ├── public.pem               # RSA Public Key
```

## 🚀 Features Implemented

### ✅ 1. User Registration (POST /auth/register)
- Registers a new user with encrypted password (BCrypt).
- Role-based control (Admin, Employee).
- Stores user details in the database.

**Request Body**

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "password": "password123",
    "role": "ADMIN",
    "phoneNumber": "+1234567890"
}
```

**Expected Response**

```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "role": "ADMIN",
    "phoneNumber": "+1234567890",
    "active": true,
    "createdAt": "2024-02-21T12:00:00",
    "updatedAt": "2024-02-21T12:00:00"
}
```

### ✅ 2. User Login (POST /auth/login)
- Authenticates user credentials.
- Generates a JWT token valid for 1 hour.

**Request Body**

```json
{
    "email": "johndoe@example.com",
    "password": "password123"
}
```

**Expected Response**

```json
{
    "message": "Login Successful",
    "token": "eyJhbGciOiJSUzI1NiIsInR..."
}
```

🚀 Copy the token! You will need it for authentication in secured endpoints.

### ✅ 3. Validate Token (POST /auth/token/validate)
- Validates whether a given JWT token is valid or expired.

**Request Body**

```json
{
    "token": "YOUR_JWT_TOKEN_HERE"
}
```

**Expected Response**

```json
{
    "message": "Token is valid"
}
```

❌ If the token is expired or invalid:

```json
{
    "message": "Invalid or expired token"
}
```

### ✅ 4. Get User Profile (GET /user/profile)
- Retrieves user profile information based on the JWT token.

**Headers (Authorization Required)**

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response**

```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "role": "ADMIN",
    "phoneNumber": "+1234567890"
}
```

❌ If no token is provided, you will get:

```json
{
    "error": "Unauthorized"
}
```

## 🔐 Security Implementation

### 1️⃣ JWT Token Generation
- Tokens are signed using RSA encryption (RS256).
- Public/Private key pair is used for security.

### 2️⃣ RSA Key Pair Generation

To generate private & public keys, run:

```sh
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

Move them to `src/main/resources/`:

```sh
mv private.pem src/main/resources/
mv public.pem src/main/resources/
```

### 3️⃣ Token Structure

Decoded JWT structure:

```json
{
  "sub": "johndoe@example.com",
  "role": "ADMIN",
  "exp": 1740373834,
  "iat": 1740370234
}
```

Fields:
- `"sub"` → User email
- `"role"` → User role (Admin, Employee)
- `"exp"` → Expiration timestamp
- `"iat"` → Issued at timestamp

### 4️⃣ Token Validation
- Uses Spring Security + Nimbus JWT Decoder.
- Checks token expiration before allowing access.

## 📌 Testing with Postman

| Test Case                          | Endpoint                | Expected Outcome          |
|------------------------------------|-------------------------|---------------------------|
| ✅ Register User (Valid)           | POST /auth/register     | 201 Created               |
| ❌ Register User (Invalid Email)   | POST /auth/register     | 400 Bad Request           |
| ✅ Login (Valid Credentials)       | POST /auth/login        | 200 OK + Token            |
| ❌ Login (Wrong Password)          | POST /auth/login        | 401 Unauthorized          |
| ✅ Validate Token (Valid)          | POST /auth/token/validate | 200 OK                  |
| ❌ Validate Token (Invalid)        | POST /auth/token/validate | 401 Unauthorized        |
| ✅ Access Profile (With Token)     | GET /user/profile       | 200 OK                    |
| ❌ Access Profile (Without Token)  | GET /user/profile       | 403 Forbidden             |

# 🚀 User Management for Administrators in Retail Inventory System

## 📌 Overview
This update allows **administrators (ADMIN role)** to manage users while ensuring:
- ✅ Only **ADMIN users** can **create, update, delete, and list users**.
- ✅ Users can **only log in using valid email and password**.
- ✅ **Role-Based Access Control (RBAC)** ensures security.

---

## 🛠 New Features Implemented
### **🔹 1. Role-Based Access Control (RBAC)**
- `/auth/login` and `/auth/register` → **Open to all**
- `/admin/*` → **Restricted to `ADMIN` users only**
- `/user/profile` → **Accessible to authenticated users**

### **🔹 2. Administrator User Management**
| **Method** | **Endpoint** | **Who Can Access?** | **Description** |
|------------|-------------|---------------------|-----------------|
| `GET` | `/admin/users` | ADMIN | List all users |
| `GET` | `/admin/users/{id}` | ADMIN | Get user by ID |
| `POST` | `/admin/users` | ADMIN | Create a new user |
| `PUT` | `/admin/users/{id}` | ADMIN | Update user information |
| `DELETE` | `/admin/users/{id}` | ADMIN | Delete a user |

---

## 🔐 Security Update (`SecurityConfig.java`)
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/login", "/auth/register").permitAll()  // Public routes
            .requestMatchers("/admin/**").hasRole("ADMIN")  // Only ADMINs can manage users
            .requestMatchers("/user/profile").authenticated()  // All users can access their own profile
            .anyRequest().authenticated()  // Protect all other endpoints
        )
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
        );
    return http.build();
}
```

✅ What this does:
- Only ADMIN users can manage users (/admin/*).
- All authenticated users can access /user/profile.
- Unauthorized users are blocked (403 Forbidden).

---

## 🚀 Steps to Test the New Update

1️⃣ Register an Admin User

**Endpoint:**

`POST /auth/register`

**Request Body:**
```json
{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "AdminPass123",
    "role": "ADMIN",
    "phoneNumber": "+1234567890"
}
```

✅ Expected Response: `201 Created`

2️⃣ Login as Admin

**Endpoint:**

`POST /auth/login`

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "AdminPass123"
}
```

✅ Expected Response (200 OK):
```json
{
    "message": "Login Successful",
    "token": "eyJhbGciOiJSUzI1NiIsInR..."
}
```

🚀 Copy the JWT token! You will need it to access admin routes.

3️⃣ Use the Admin Token to Manage Users

**Example: Get All Users (GET /admin/users)**

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE
```

✅ Expected Response (200 OK):
```json
[
    {
        "id": 1,
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com",
        "role": "ADMIN"
    },
    {
        "id": 2,
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe@example.com",
        "role": "EMPLOYEE"
    }
]
```

---

## 🎯 Summary
- ✅ Administrators can now create, update, and delete users.
- ✅ Only authenticated users can log in and access their profile.
- ✅ RBAC ensures only ADMIN users manage users.
- ✅ Unauthorized users are blocked from admin routes (403 Forbidden).

Here’s a clean and clear Markdown README explaining this new Store Management Feature in your project:

# 🛒 Store Management Feature

This update adds comprehensive **store management** capabilities to the Retail Inventory Management System, allowing administrators to create, update, and delete store entries, and enabling users to view store information.

---

## ✨ Feature Overview:

- **Register new stores** with a name and physical address.
- Allow users to **retrieve a list of all registered stores**.
- Allow **administrators** to **edit or delete existing stores**.
- Automatically track **creation and update timestamps** for each store.

---

## 📌 Endpoints & Access Control

| Method | Endpoint                | Description              | Access Level |
|--------|-------------------------|--------------------------|--------------|
| `POST` | `/stores`               | Create a new store       | 🔒 ADMIN only |
| `GET`  | `/stores`               | Retrieve all stores      | 🔑 Authenticated Users |
| `GET`  | `/stores/{id}`          | Retrieve store by ID     | 🔒 Authenticated Users |
| `PUT`  | `/stores/{id}`          | Update existing store    | 🔒 ADMIN only |
| `DELETE` | `/stores/{id}`        | Delete store by ID       | 🔒 ADMIN only |

---

## ✅ Example Usage (Postman)

### 1️⃣ **Create a New Store**
- **Endpoint:** `POST /stores`
- **Authorization:** Bearer token (ADMIN only)
- **Body:**
```json
{
    "name": "Central Store",
    "address": "123 Main Street, NY"
}
```

- **Expected Response:**
```json
{
        "id": 1,
        "name": "Central Store",
        "address": "123 Main Street, NY",
        "createdAt": "2025-02-25T10:30:00",
        "updatedAt": "2025-02-25T10:30:00"
}
```

### 2️⃣ **List All Stores (Accessible by All Users)**
- **Endpoint:** `GET /stores`
- **Authorization:** Required (Bearer TOKEN)
- **Expected Response:**
```json
[
        {
                "id": 1,
                "name": "Central Store",
                "address": "123 Main Street, NY",
                "createdAt": "2025-02-25T10:30:00",
                "updatedAt": "2025-02-25T10:30:00"
        }
]
```

## 🛠 Technical Implementation Details

### Role-Based Access Control (RBAC):
- Ensures that only users with the ADMIN role can perform sensitive actions (create, update, delete).
- Regular authenticated users can only view store details.

### Automatic Timestamps:
- `createdAt` and `updatedAt` fields automatically managed by JPA annotations (`@PrePersist`, `@PreUpdate`).

### Database:
- Fields (`created_at`, `updated_at`) automatically managed using JPA entity lifecycle callbacks.
