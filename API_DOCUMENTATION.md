# 📚 API Documentation

Complete API documentation for the Admin Panel backend application.

## 🔗 Base URL
```
http://localhost:8080/api
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

1. **Login** to get a token:
```bash
POST /api/auth/login
```

2. **Use the token** in subsequent requests:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:8080/api/users
```

## 📋 Endpoints Overview

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/auth/login` | User login | ❌ | - |
| POST | `/auth/register` | User registration | ❌ | - |
| GET | `/users` | Get all users | ✅ | ADMIN |
| POST | `/users` | Create user | ✅ | ADMIN |
| PUT | `/users/{id}` | Update user | ✅ | ADMIN |
| DELETE | `/users/{id}` | Delete user | ✅ | ADMIN |
| POST | `/ai/chat` | AI chat | ✅ | USER |
| GET | `/prompts` | Get prompts | ✅ | USER |
| POST | `/prompts` | Create prompt | ✅ | USER |
| GET | `/prompts/shared` | Get shared prompts | ✅ | USER |
| POST | `/prompts/shared` | Create shared prompt | ✅ | USER |

## 🔑 Authentication Endpoints

### POST /api/auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTYzNTY4OTYwMCwiZXhwIjoxNjM1Nzc2MDAwfQ.example",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "firstname": "Admin",
    "lastname": "User",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

### POST /api/auth/register

Register a new user.

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "email": "john@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "message": "Email already exists"
}
```

## 👥 User Management Endpoints

### GET /api/users

Get all users (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "firstname": "Admin",
    "lastname": "User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00"
  },
  {
    "id": 2,
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Access denied",
  "message": "Insufficient privileges"
}
```

### POST /api/users

Create a new user (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "firstname": "Jane",
  "lastname": "Smith",
  "email": "jane@example.com",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00"
}
```

### PUT /api/users/{id}

Update user information (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "role": "ADMIN"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "firstname": "Jane",
  "lastname": "Smith",
  "email": "jane@example.com",
  "role": "ADMIN",
  "createdAt": "2024-01-01T00:00:00"
}
```

### DELETE /api/users/{id}

Delete user (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (204 No Content):**
```
(Empty response body)
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found",
  "message": "User with id 999 does not exist"
}
```

## 🤖 AI Assistant Endpoints

### POST /api/ai/chat

Send message to AI assistant.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Hello, how can you help me?",
  "context": "user_context_optional"
}
```

**Response (200 OK):**
```json
{
  "response": "Hello! I'm here to help you with various tasks. I can assist with prompt engineering, answer questions, and provide guidance on using the admin panel effectively.",
  "timestamp": "2024-01-01T00:00:00",
  "tokens_used": 45
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid request",
  "message": "Message cannot be empty"
}
```

## 📝 Prompt Management Endpoints

### GET /api/prompts

Get all prompts for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "My First Prompt",
    "content": "This is a prompt template for...",
    "category": "general",
    "isPublic": false,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
]
```

### POST /api/prompts

Create a new prompt.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My New Prompt",
  "content": "This is a new prompt template",
  "category": "general",
  "isPublic": true
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "My New Prompt",
  "content": "This is a new prompt template",
  "category": "general",
  "isPublic": true,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

## 🌐 Community Endpoints

### GET /api/prompts/shared

Get all shared prompts from the community.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title and content
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Helpful Prompt",
      "content": "This is a shared prompt...",
      "category": "general",
      "author": {
        "id": 1,
        "firstname": "Admin",
        "lastname": "User"
      },
      "likes": 5,
      "createdAt": "2024-01-01T00:00:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0,
  "size": 20
}
```

### POST /api/prompts/shared

Create a shared prompt.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Shared Prompt",
  "content": "This is a prompt I want to share with the community",
  "category": "general"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "title": "My Shared Prompt",
  "content": "This is a prompt I want to share with the community",
  "category": "general",
  "author": {
    "id": 2,
    "firstname": "John",
    "lastname": "Doe"
  },
  "likes": 0,
  "createdAt": "2024-01-01T00:00:00"
}
```

### POST /api/prompts/shared/{id}/like

Like a shared prompt.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Prompt liked successfully",
  "likes": 6
}
```

## 📊 Example Usage Endpoints

### GET /api/examples

Get example usage statistics.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "exampleIndex": 1,
    "usageCount": 150,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  },
  {
    "id": 2,
    "exampleIndex": 2,
    "usageCount": 89,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
]
```

## 🔧 Error Handling

### Standard Error Response Format

All error responses follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2024-01-01T00:00:00",
  "path": "/api/endpoint"
}
```

### Common HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient privileges |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

### Validation Errors

When validation fails, the response includes field-specific errors:

```json
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "errors": {
    "email": "Email must be a valid email address",
    "password": "Password must be at least 8 characters long"
  },
  "timestamp": "2024-01-01T00:00:00"
}
```

## 🔒 Security

### JWT Token Format

JWT tokens contain the following claims:

```json
{
  "sub": "user@example.com",
  "iat": 1635689600,
  "exp": 1635776000,
  "role": "ADMIN"
}
```

### Token Expiration

- **Access Token**: 24 hours
- **Refresh Token**: 7 days (if implemented)

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## 📝 Request/Response Examples

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

**Get Users (with token):**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Create User:**
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Jane",
    "lastname": "Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

### JavaScript Examples

**Login:**
```javascript
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password'
  })
});

const data = await response.json();
const token = data.token;
```

**Get Users:**
```javascript
const response = await fetch('http://localhost:8080/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const users = await response.json();
```

**Create User:**
```javascript
const response = await fetch('http://localhost:8080/api/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'USER'
  })
});

const newUser = await response.json();
```

## 🔍 Swagger UI

Interactive API documentation is available at:

```
http://localhost:8080/swagger-ui.html
```

This provides:
- Interactive API explorer
- Request/response examples
- Authentication testing
- Schema documentation

## 📞 Support

For API support and questions:

1. Check the Swagger UI documentation
2. Review error messages in responses
3. Check server logs for detailed errors
4. Contact support at support@adminpanel.com

---

**API Version**: 1.0.0  
**Last Updated**: January 2024 