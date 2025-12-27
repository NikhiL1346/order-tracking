# API Quick Reference Guide

## Authentication Endpoints

### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response 201:
{
  "success": true,
  "message": "User registered successfully",
  "responseCode": "CREATED",
  "statusCode": 201,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGc...",
    "expiresIn": "24h"
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Login User
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "success": true,
  "message": "User logged in successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGc...",
    "expiresIn": "24h"
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Get Current User
```
GET /api/v1/auth/me
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "User fetched successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

## Order Endpoints

### Create Order
```
POST /api/v1/orders
Authorization: Bearer <token>

Response 201:
{
  "success": true,
  "message": "Order created successfully",
  "responseCode": "CREATED",
  "statusCode": 201,
  "data": {
    "id": 1,
    "userId": 1,
    "status": "PLACED",
    "createdAt": "2024-12-27T10:00:00.000Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    }
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Get My Orders
```
GET /api/v1/orders/my-orders
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Orders fetched successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "status": "PLACED",
      "createdAt": "2024-12-27T10:00:00.000Z",
      "user": {...}
    }
  ],
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Get All Orders (Admin Only)
```
GET /api/v1/orders?page=1&limit=10
Authorization: Bearer <admin-token>

Response 200:
{
  "success": true,
  "message": "Orders fetched successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": {
    "orders": [...],
    "total": 50
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Get Order by ID
```
GET /api/v1/orders/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Order fetched successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": {...},
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Update Order Status (Admin/Delivery Partner Only)
```
PATCH /api/v1/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ON_THE_WAY"
}

Valid Statuses: PLACED, ACCEPTED, PICKED_UP, ON_THE_WAY, DELIVERED, CANCELLED

Response 200:
{
  "success": true,
  "message": "Order status updated successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": {...},
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Delete Order (Admin Only)
```
DELETE /api/v1/orders/:id
Authorization: Bearer <admin-token>

Response 200:
{
  "success": true,
  "message": "Order deleted successfully",
  "responseCode": "DELETED",
  "statusCode": 200,
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

## User Endpoints

### Get All Users (Admin Only)
```
GET /api/v1/users?page=1&limit=10
Authorization: Bearer <admin-token>

Response 200:
{
  "success": true,
  "message": "Users fetched successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": {
    "users": [...],
    "total": 100
  },
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Get User by ID
```
GET /api/v1/users/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "User fetched successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": {...},
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Update User
```
PATCH /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "DELIVERY_PARTNER"
}

Response 200:
{
  "success": true,
  "message": "User updated successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": {...},
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Delete User
```
DELETE /api/v1/users/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "User deleted successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Get Users by Role (Admin Only)
```
GET /api/v1/users/role?role=DELIVERY_PARTNER
Authorization: Bearer <admin-token>

Valid Roles: CUSTOMER, DELIVERY_PARTNER, ADMIN

Response 200:
{
  "success": true,
  "message": "Users fetched successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": [...],
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Search Users (Admin Only)
```
GET /api/v1/users/search?q=john
Authorization: Bearer <admin-token>

Response 200:
{
  "success": true,
  "message": "Users found successfully",
  "responseCode": "SUCCESS",
  "statusCode": 200,
  "data": [...],
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed!",
  "errorCode": "VALIDATION_ERROR",
  "statusCode": 400,
  "errors": ["Email is required", "Password is required"],
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Unauthorized Error (401)
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "errorCode": "UNAUTHORIZED",
  "statusCode": 401,
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Forbidden Error (403)
```json
{
  "success": false,
  "message": "You don't have permission to access this resource",
  "errorCode": "FORBIDDEN",
  "statusCode": 403,
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Order not found",
  "errorCode": "NOT_FOUND",
  "statusCode": 404,
  "timestamp": "2024-12-27T10:00:00.000Z"
}
```

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character (@$!%*?&)

Example valid passwords:
- `SecurePass123!`
- `MyPassword@2024`
- `Tr0pic@lFruit`

## Authorization Rules

- **CUSTOMER**: Can create orders, view own orders, view own profile
- **DELIVERY_PARTNER**: Can update order status
- **ADMIN**: Can view all orders, manage all users, update order status, delete orders

## Notes

1. All timestamps are in ISO 8601 format
2. All requests must include `Content-Type: application/json` header
3. Authentication token should be sent in `Authorization: Bearer <token>` format
4. Passwords are hashed and never returned in responses
5. User role defaults to CUSTOMER on registration
