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
