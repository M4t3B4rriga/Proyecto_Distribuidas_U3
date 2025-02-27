# 🛒 Product Management & Role-Based Authentication in `product-service`

## 🚀 Overview
The **product-service** now supports **secure product management** with **role-based authentication (RBAC)**.  
It ensures that **only authorized users** can manage products, following these rules:

- **`ADMIN` users** can **create, update, and delete** products.
- **`EMPLOYEE` users** can **only view** products.

This is implemented using **Spring Security, JWT authentication, and WebClient** for inter-service communication.

---

## 🔑 **Role-Based Access Control (RBAC)**
The system has **two roles**:
1. **`ADMIN`** – Has **full access** to manage products.
2. **`EMPLOYEE`** – Can **only view** products.

### 🛂 **Access Permissions**
| **Role**  | **GET /products** | **POST /products** | **PUT /products** | **DELETE /products** |
|-----------|------------------|------------------|------------------|------------------|
| **ADMIN** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **EMPLOYEE** | ✅ Allowed | ❌ Forbidden | ❌ Forbidden | ❌ Forbidden |

---

## 🔧 **How It Works**
### 🛠 **1. Secure Authentication with JWT**
- Users authenticate through **`auth-service`**, which generates a **JWT token**.
- The token contains **user role (`ADMIN` or `EMPLOYEE`)**.
- Example JWT payload:
    ```json
    {
            "sub": "admin@example.com",
            "role": "ADMIN",
            "exp": 1740668714,
            "iat": 1740665114
    }
    ```

### 🔐 **2. Authorization in product-service**
- Spring Security reads the JWT and extracts the role claim.
- Role-based permissions are enforced in `SecurityConfig.java`:
    ```java
    .requestMatchers(HttpMethod.GET, "/products").hasAnyRole("ADMIN", "EMPLOYEE")
    .requestMatchers(HttpMethod.POST, "/products").hasRole("ADMIN")
    .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")
    ```

---

## 📝 **API Usage Guide**

### 📌 **1. EMPLOYEE Can View Products**

**Request:**
```
GET /products
Authorization: Bearer EMPLOYEE_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
[
        {
                "id": 1,
                "name": "Gaming Laptop",
                "price": 1299.99,
                "category": "Electronics",
                "storeId": 1
        }
]
```

### 📌 **2. ADMIN Can Create Products**

**Request:**
```
POST /products
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
        "name": "Gaming Laptop",
        "price": 1299.99,
        "category": "Electronics",
        "storeId": 1
}
```

**Expected Response (201 Created):**
```json
{
        "id": 1,
        "name": "Gaming Laptop",
        "price": 1299.99,
        "category": "Electronics",
        "storeId": 1
}
```

### 📌 **3. EMPLOYEE Tries to Create a Product (Fails ❌)**

**Request:**
```
POST /products
Authorization: Bearer EMPLOYEE_JWT_TOKEN
```

**Expected Response (403 Forbidden):**
```json
{
        "error": "Forbidden"
}
```

---

## 🚀 **Conclusion**
- ✅ JWT authentication ensures secure access.
- ✅ Spring Security enforces role-based access control (RBAC).
- ✅ Only ADMIN can create, update, and delete products.
- ✅ Both ADMIN and EMPLOYEE can view products.

