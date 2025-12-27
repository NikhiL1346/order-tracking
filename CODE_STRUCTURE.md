# Complete Code Structure - All Files Summary

## Services (Business Logic Layer)

### `src/services/auth.service.ts`
**Purpose**: Authentication business logic
**Key Methods**:
- `register(payload)` - Validates inputs, hashes password, creates user, generates token
- `login(payload)` - Validates credentials, generates token
- `getUserById(userId)` - Fetches user without password

**Uses Helpers**:
- `validateRequired()`, `validateEmail()`, `validatePassword()` for validation
- `generateToken()` for JWT token creation
- `bcrypt.hash()` for password hashing
- `bcrypt.compare()` for password verification

---

### `src/services/orders.service.ts`
**Purpose**: Order management business logic
**Key Methods**:
- `createOrder(payload)` - Creates new order for user
- `getUserOrders(userId)` - Fetches user's orders sorted by date
- `getOrderById(orderId)` - Fetches specific order
- `updateOrderStatus(orderId, payload)` - Updates order status with validation
- `getAllOrders(limit, offset)` - Paginated list of all orders
- `deleteOrder(orderId)` - Deletes order

**Uses Helpers**:
- `validateRequired()` for input validation
- All methods return validated Order objects from Prisma

---

### `src/services/users.service.ts`
**Purpose**: User management business logic
**Key Methods**:
- `getUserById(userId)` - Fetches user without password
- `getAllUsers(limit, offset)` - Paginated user list
- `updateUser(userId, payload)` - Updates user information
- `deleteUser(userId)` - Deletes user (cascades to orders)
- `getUsersByRole(role)` - Filters users by role
- `searchUsers(searchQuery)` - Searches users by name or email

**Uses Helpers**:
- `validateRequired()`, `validateEmail()` for input validation
- Cascade deletion for related orders

---

## Controllers (Request Handlers)

### `src/controllers/auth.controller.ts`
**Purpose**: Authentication endpoint handlers
**Key Functions**:
- `registerUser(req, res)` - Handles POST /register
- `loginUser(req, res)` - Handles POST /login
- `getCurrentUser(req, res)` - Handles GET /me (protected)

**Uses Helpers**:
- `validationErrorResponse()` - Returns 400 for validation errors
- `unauthorizedError()` - Returns 401 for auth failures
- `successResponse()`, `createdResponse()` - Returns success responses
- Catches errors and formats appropriate responses

---

### `src/controllers/orders.controller.ts`
**Purpose**: Order endpoint handlers
**Key Functions**:
- `createOrder(req, res)` - POST /
- `getUserOrders(req, res)` - GET /my-orders
- `getOrderById(req, res)` - GET /:id
- `updateOrderStatus(req, res)` - PATCH /:id/status
- `getAllOrders(req, res)` - GET / (admin only)
- `deleteOrder(req, res)` - DELETE /:id (admin only)

**Uses Helpers**:
- `successResponse()`, `createdResponse()`, `deletedResponse()`
- `validationErrorResponse()`, `notFoundError()`, `unauthorizedError()`
- Role-based authorization checks
- Input validation for all parameters

---

### `src/controllers/users.controller.ts`
**Purpose**: User endpoint handlers
**Key Functions**:
- `getUserById(req, res)` - GET /:id
- `getAllUsers(req, res)` - GET / (admin only)
- `updateUser(req, res)` - PATCH /:id
- `deleteUser(req, res)` - DELETE /:id
- `getUsersByRole(req, res)` - GET /role (admin only)
- `searchUsers(req, res)` - GET /search (admin only)

**Uses Helpers**:
- `successResponse()`, `deletedResponse()`
- `validationErrorResponse()`, `notFoundError()`, `unauthorizedError()`
- Role-based access control
- Comprehensive input validation

---

## Routes (Endpoint Definitions)

### `src/routes/auth.routes.ts`
**Endpoints**:
- `POST /register` → `registerUser` (public)
- `POST /login` → `loginUser` (public)
- `GET /me` → `getCurrentUser` (protected)

**Imports**: auth controller, auth middleware

---

### `src/routes/order.routes.ts`
**Endpoints**:
- `POST /` → `createOrder` (protected)
- `GET /my-orders` → `getUserOrders` (protected)
- `GET /` → `getAllOrders` (protected, admin only)
- `GET /:id` → `getOrderById` (protected)
- `PATCH /:id/status` → `updateOrderStatus` (protected)
- `DELETE /:id` → `deleteOrder` (protected, admin only)

**Imports**: orders controller, auth middleware

---

### `src/routes/user.routes.ts`
**Endpoints**:
- `GET /` → `getAllUsers` (protected, admin only)
- `GET /role` → `getUsersByRole` (protected, admin only)
- `GET /search` → `searchUsers` (protected, admin only)
- `GET /:id` → `getUserById` (protected)
- `PATCH /:id` → `updateUser` (protected)
- `DELETE /:id` → `deleteUser` (protected)

**Imports**: users controller, auth middleware

---

## Middleware

### `src/middleware/auth.middleware.ts`
**Purpose**: JWT authentication middleware
**Functionality**:
- Extracts Bearer token from Authorization header
- Validates token using `verifyToken()` helper
- Extends Express Request with user data
- Returns 401 error if token is missing or invalid
- Uses `verifyToken()` from JWT helper
- Extends `Express.Request` interface with user property

---

## Helpers (Utility Functions)

### `src/helpers/response.helper.ts`
**Functions**:
- `successResponse<T>(data, message)` - Standard 200 response
- `createdResponse<T>(data, message)` - Resource creation 201 response
- `deletedResponse(message)` - Resource deletion 200 response
- `paginatedResponse<T>(data, total, page, limit, message)` - Paginated 200 response
- `errorResponse(message, errors)` - Standard 400 error response

**Used by**: All controllers for consistent response formatting

---

### `src/helpers/error.helper.ts`
**Functions**:
- `validationErrorResponse(errors)` - 400 validation error
- `notFoundError(resource)` - 404 not found error
- `unauthorizedError(message)` - 401 auth error
- `forbiddenError(message)` - 403 forbidden error
- `internalServerError(message)` - 500 server error

**Used by**: All controllers for error responses

---

### `src/helpers/validation.helper.ts`
**Functions**:
- `validateEmail(email)` - Regex validation for email format
- `validatePassword(password)` - Enforces strong password requirements
- `validatePhoneNumber(phone)` - 10-digit phone validation
- `validateRequired(value)` - Checks if value exists and not empty
- `validateMinLength(value, minLength)` - Minimum length check
- `validateMaxLength(value, maxLength)` - Maximum length check
- `validateField(value, rules)` - Validates field against schema rules
- `validateObject(data, schema)` - Validates entire object against schema

**Used by**: All services for input validation

---

### `src/helpers/jwt.helper.ts`
**Functions**:
- `generateToken(userId, role)` - Creates JWT token (24h expiration)
- `verifyToken(token)` - Verifies and decodes JWT
- `decodeToken(token)` - Decodes without verification
- `refreshToken(userId, role)` - Generates new token

**Uses**: `jsonwebtoken` library with `JWT_SECRET` environment variable

---

## Utilities

### `src/utils/prisma.ts`
**Purpose**: Singleton Prisma Client instance
**Exports**: Single instance of PrismaClient
**Used by**: All services for database operations

---

## Core Files

### `src/app.ts`
**Purpose**: Express application configuration
**Functionality**:
- Initializes Express app
- Sets up JSON middleware
- Configures CORS
- Mounts all route modules under `/api/v1` prefix
- Health check endpoint at `/health`
- 404 handler for unknown routes
- Global error handler middleware

**Routes Mounted**:
- `/api/v1/auth` → authRoutes
- `/api/v1/orders` → orderRoutes
- `/api/v1/users` → userRoutes

---

### `src/server.ts`
**Purpose**: Server entry point
**Functionality**:
- Imports Express app from app.ts
- Starts server on PORT (default 5000)
- Logs server startup message

---

## Type Definitions

### Auth Service Types
```typescript
interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface AuthResponse {
    user: Omit<User, "password">;
    token: string;
    expiresIn: string;
}
```

### Orders Service Types
```typescript
interface CreateOrderPayload {
    userId: number;
}

interface UpdateOrderStatusPayload {
    status: Status;
}
```

### Users Service Types
```typescript
interface UpdateUserPayload {
    name?: string;
    email?: string;
    role?: Role;
}
```

### JWT Helper Types
```typescript
interface JwtPayload {
    userId: number;
    role: string;
}

interface TokenResponse {
    token: string;
    expiresIn: string;
}
```

---

## Data Flow Examples

### User Registration Flow
1. User sends POST /api/v1/auth/register with credentials
2. `registerUser` controller validates input
3. Calls `authService.register()`
4. Service validates email, password format using helpers
5. Checks for existing user in database
6. Hashes password with bcrypt
7. Creates user in Prisma
8. Generates JWT token
9. Returns `createdResponse()` with user and token

### Order Creation Flow
1. User sends POST /api/v1/orders with auth token
2. `authMiddleware` validates token using `verifyToken()`
3. `createOrder` controller validates input
4. Calls `ordersService.createOrder()`
5. Service validates userId exists
6. Creates order in Prisma
7. Returns `createdResponse()` with order details

### Order Status Update Flow
1. Admin sends PATCH /api/v1/orders/:id/status with new status
2. `authMiddleware` validates token
3. `updateOrderStatus` controller validates authorization (admin/delivery partner)
4. Calls `ordersService.updateOrderStatus()`
5. Service validates status is valid enum value
6. Updates order in Prisma
7. Returns `successResponse()` with updated order

---

## Error Handling Flow

1. Input validation fails → `validationErrorResponse()` with 400
2. User not found → `notFoundError()` with 404
3. Invalid token → `unauthorizedError()` with 401
4. Insufficient permissions → Controller returns forbidden error with 403
5. Database error → Caught and logged, returns `internalServerError()` with 500
6. Unknown error → Global middleware handles and returns 500

---

## Summary Statistics

- **6 Controllers** with ~30 total endpoint functions
- **3 Services** with ~20 total methods
- **3 Route files** with ~20 total endpoints
- **4 Helper modules** with ~25 helper functions
- **Full TypeScript** type coverage
- **Role-based access control** with 3 roles (CUSTOMER, DELIVERY_PARTNER, ADMIN)
- **6 Order statuses** (PLACED, ACCEPTED, PICKED_UP, ON_THE_WAY, DELIVERED, CANCELLED)
- **Consistent error handling** across all endpoints
- **Pagination support** on list endpoints
- **JWT authentication** with 24-hour expiration
