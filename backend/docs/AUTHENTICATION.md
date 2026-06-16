# Authentication System Documentation

## Overview
The JRPG API uses JWT (JSON Web Token) authentication for secure user authentication and authorization.

## Features
- User registration with password hashing (BCrypt)
- User login with JWT token generation
- Token-based authentication for protected endpoints
- Automatic token expiration (24 hours)
- Error handling with detailed messages

## Endpoints

### 1. Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "aragorn",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "aragorn",
  "expiresIn": 86400000
}
```

**Errors:**
- `400 Bad Request`: Invalid input (username/password too short, passwords don't match)
- `409 Conflict`: Username already exists

**CURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "aragorn",
    "password": "securepassword123",
    "confirmPassword": "securepassword123"
  }'
```

### 2. Login User
**POST** `/api/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "aragorn",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "aragorn",
  "expiresIn": 86400000
}
```

**Errors:**
- `400 Bad Request`: Missing username or password
- `401 Unauthorized`: Invalid credentials

**CURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "aragorn",
    "password": "securepassword123"
  }'
```

### 3. Logout User
**POST** `/api/auth/logout`

Logout and cleanup on client side. Since JWT is stateless, the token remains valid until expiration.

**Response (200 OK):**
```json
{
  "message": "Déconnexion réussie"
}
```

**CURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer <your-jwt-token>"
```

### 4. OPTIONS /api/auth
**OPTIONS** `/api/auth`

Get metadata about authentication endpoints.

**Response (200 OK):**
```json
{
  "resource": "Authentication",
  "allowedMethods": ["POST", "OPTIONS"],
  "postParameters": {
    "register": {
      "username": "string (min 3 chars, unique)",
      "password": "string (min 4 chars)",
      "confirmPassword": "string (must match password)"
    },
    "login": {
      "username": "string",
      "password": "string"
    }
  }
}
```

## Using the JWT Token

After successful login/registration, include the token in the Authorization header for protected endpoints:

```bash
curl -X GET http://localhost:8080/api/characters \
  -H "Authorization: Bearer <your-jwt-token>"
```

The token should be included as:
```
Authorization: Bearer <token>
```

## Token Details

- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 24 hours (86400000 milliseconds)
- **Subject**: Username
- **Payload**: Standard JWT claims (iss, sub, iat, exp)

## Error Response Format

```json
{
  "status": 400,
  "message": "Le nom d'utilisateur doit contenir au moins 3 caractères",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "errors": []
}
```

## Security Considerations

1. **Password Storage**: Passwords are hashed using BCrypt with cost factor 10
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Tokens are stored in localStorage (frontend) and as secure httpOnly cookies (recommended)
4. **CORS**: Configured to allow requests from http://localhost:3000 and http://localhost:8080
5. **Secret Key**: Change `jwt.secret` in application.properties for production

## Configuration

In `application.properties`:
```properties
jwt.secret=your-super-secret-jwt-key-change-this-in-production-12345
jwt.expiration=86400000
```

## Validation Rules

### Username
- Minimum length: 3 characters
- Maximum length: Unlimited (recommended max 50)
- Must be unique
- Allowed characters: Any (no restrictions implemented)

### Password
- Minimum length: 4 characters
- Must match confirmPassword on registration
- No maximum length restriction
- Special characters allowed

## Integration with Frontend

The frontend uses Zustand for state management with the `useAuthStore` hook:

```typescript
const { login, register, logout, isAuthenticated } = useAuthStore();

// Login
await login(username, password);

// Register
await register(username, password, confirmPassword);

// Logout
await logout();
```

The token is automatically included in all API requests via the SecurityConfig CORS setup.
