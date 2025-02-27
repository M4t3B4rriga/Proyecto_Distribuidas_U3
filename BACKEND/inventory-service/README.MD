# 🏪 Inventory Management Service (`inventory-service`)

## 🚀 Overview
The `inventory-service` is responsible for **tracking and managing stock** of products in different stores. It ensures that:
- ✅ **Only `ADMIN` users can register and update stock.**
- ✅ **`EMPLOYEE` users can only view stock.**
- ✅ **No duplicate product entries exist for the same store.**
- ✅ **Stock updates when products are added or removed.**
- ✅ **JWT authentication is enforced to control access.**
- ✅ **Secure communication with `product-service` and `store-service` is established.**

---

## 🔑 **Role-Based Access Control (RBAC)**
The system has **two roles**:
1. **`ADMIN`** – Has **full access** to manage inventory.
2. **`EMPLOYEE`** – Can **only view** inventory.

### 🛂 **Access Permissions**
| **Role**  | **GET /inventory** | **POST /inventory** | **PUT /inventory** |
|-----------|------------------|------------------|------------------|
| **ADMIN** | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **EMPLOYEE** | ✅ Allowed | ❌ Forbidden | ❌ Forbidden |

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

### 🔐 **2. Authorization in inventory-service**
- Spring Security reads the JWT and extracts the role claim.
- Role-based permissions are enforced in `SecurityConfig.java`:
        ```java
        .requestMatchers(HttpMethod.GET, "/inventory/**").hasAnyRole("ADMIN", "EMPLOYEE")
        .requestMatchers(HttpMethod.POST, "/inventory").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/inventory/**").hasRole("ADMIN")
        ```

---

## 📝 **API Usage Guide**

### 📌 **1. ADMIN Can Add Inventory**

**Request:**
```
POST /inventory
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
                "storeId": 1,
                "productId": 1,
                "quantity": 50
}
```

**Expected Response (201 Created):**
```json
{
                "id": 1,
                "storeId": 1,
                "productId": 1,
                "quantity": 50
}
```

### 📌 **2. EMPLOYEE Tries to Add Inventory (Forbidden ❌)**

**Headers:**
```
Authorization: Bearer EMPLOYEE_JWT_TOKEN
```

**Expected Response (403 Forbidden):**
```json
{
                "error": "Forbidden"
}
```

### 📌 **3. Prevent Duplicate Product Entry in Same Store**

**Request:**
```
POST /inventory
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Request Body:**
```json
{
                "storeId": 1,
                "productId": 1,
                "quantity": 30
}
```

**Expected Response (409 Conflict):**
```json
{
                "error": "Conflict",
                "message": "Product already exists in the inventory of this store"
}
```

### 📌 **4. ADMIN Updates Stock**

**Request:**
```
PUT /inventory/1/1?quantity=75
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
                "id": 1,
                "storeId": 1,
                "productId": 1,
                "quantity": 75
}
```

### 📌 **5. EMPLOYEE Retrieves Inventory**

**Request:**
```
GET /inventory/1
Authorization: Bearer EMPLOYEE_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
[
                {
                                "id": 1,
                                "storeId": 1,
                                "productId": 1,
                                "quantity": 75
                }
]
```

### 📌 **6. EMPLOYEE Tries to Update Stock (Forbidden ❌)**

**Request:**
```
PUT /inventory/1/1?quantity=100
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
- ✅ Only `ADMIN` can add and update inventory.
- ✅ `EMPLOYEE` can only view inventory.
- ✅ No duplicate product entries per store.
- ✅ Stock updates correctly when products are added or removed.
