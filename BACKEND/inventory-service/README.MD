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

# 🚀 **Inventory Movements & Role-Based Authorization - Testing Guide**

## **🔍 Overview**
This update ensures **automated inventory movements** and **strict role-based access control**:
- ✅ **`EMPLOYEE` can update stock (ENTRY/EXIT).**
- ✅ **`ADMIN` can view all movements and metrics.**
- ❌ **`EMPLOYEE` cannot view movements or metrics.**
- ✅ **Every stock update automatically logs a movement.**

---

## **🛠 How It Works**
### **🔹 1. Automated Inventory Movements**
- Every time stock is **added (`ENTRY`)** or **removed (`EXIT`)**, a movement is logged.
- Employees no longer need to **manually register movements**.
- The system **prevents negative stock exits**.

### **🔹 2. Role-Based Access Control**
| **Action** | **Admin** | **Employee** |
|------------|----------|-------------|
| Update Stock | ✅ Allowed | ✅ Allowed |
| View All Movements | ✅ Allowed | ❌ Forbidden |
| View Store Movements | ✅ Allowed | ❌ Forbidden |
| View Movement Metrics | ✅ Allowed | ❌ Forbidden |

---

## **🛠 Testing API Endpoints**
### 📌 **1. `EMPLOYEE` Registers an Inventory Entry (`ENTRY`)**
#### **📌 Request**
```http
PUT http://localhost:8083/inventory/1/1?quantity=20&userId=100&movementType=ENTRY
Authorization: Bearer EMPLOYEE_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
        "id": 1,
        "storeId": 1,
        "productId": 1,
        "quantity": 70
}
```

**Check Movement Log:**
```sql
SELECT * FROM inventory_movements WHERE store_id = 1 AND product_id = 1;
```

✅ An ENTRY movement should be logged.

### 📌 **2. EMPLOYEE Registers an Inventory Exit (EXIT)**

**Request:**
```http
PUT http://localhost:8083/inventory/1/1?quantity=10&userId=100&movementType=EXIT
Authorization: Bearer EMPLOYEE_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
        "id": 1,
        "storeId": 1,
        "productId": 1,
        "quantity": 60
}
```

**Check Movement Log:**
```sql
SELECT * FROM inventory_movements WHERE store_id = 1 AND product_id = 1;
```

✅ An EXIT movement should be logged.

### 📌 **3. EMPLOYEE Tries to View Movements (❌ Forbidden)**

**Request:**
```http
GET http://localhost:8083/inventory/movements
Authorization: Bearer EMPLOYEE_JWT_TOKEN
```

**Expected Response (403 Forbidden):**
```json
{
        "error": "Forbidden"
}
```

**Check Logs:**
```sh
tail -f logs/spring-boot.log
```

✅ Logs should confirm that access was denied.

### 📌 **4. ADMIN Retrieves All Movements (✅ Allowed)**

**Request:**
```http
GET http://localhost:8083/inventory/movements
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
[
        {
                "id": 1,
                "storeId": 1,
                "productId": 1,
                "userId": 100,
                "quantity": 20,
                "movementType": "ENTRY",
                "movementDate": "2025-02-27T14:30:00"
        },
        {
                "id": 2,
                "storeId": 1,
                "productId": 1,
                "userId": 100,
                "quantity": 10,
                "movementType": "EXIT",
                "movementDate": "2025-02-27T14:35:00"
        }
]
```

**Check Logs:**
```sh
tail -f logs/spring-boot.log
```

✅ Logs should confirm an ADMIN accessed movements.

### 📌 **5. ADMIN Retrieves Movement Metrics (✅ Allowed)**

**Request:**
```http
GET http://localhost:8083/inventory/movements/metrics
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
        "ENTRY": 5,
        "EXIT": 3
}
```

**Check Logs:**
```sh
tail -f logs/spring-boot.log
```

✅ Logs should confirm an ADMIN accessed metrics.

### 📌 **6. EMPLOYEE Tries to View Metrics (❌ Forbidden)**

**Request:**
```http
GET http://localhost:8083/inventory/movements/metrics
Authorization: Bearer EMPLOYEE_JWT_TOKEN
```

**Expected Response (403 Forbidden):**
```json
{
        "error": "Forbidden"
}
```

**Check Logs:**
```sh
tail -f logs/spring-boot.log
```

✅ Logs should confirm that access was denied.

