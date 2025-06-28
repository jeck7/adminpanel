# 🚀 Admin Panel - Modern React + Spring Boot Application

A comprehensive admin panel built with React frontend and Spring Boot backend, featuring user management, AI assistant integration, prompt engineering tools, and community features.

![Admin Panel](https://img.shields.io/badge/React-18.0.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-purple)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🏠 Dashboard
- **Real-time statistics** with interactive charts
- **User activity monitoring**
- **System health indicators**
- **Quick action buttons**

### 👥 User Management
- **Complete CRUD operations** for users
- **Role-based access control** (Admin/User)
- **Advanced search and filtering**
- **Bulk operations support**
- **User activity tracking**

### 🤖 AI Assistant
- **OpenAI integration** for intelligent responses
- **Conversation history**
- **Context-aware suggestions**
- **Real-time chat interface**

### 🛠️ Prompt Builder
- **Visual prompt creation**
- **Template library**
- **Version control**
- **Export/Import functionality**

### 🌐 Community
- **Shared prompts marketplace**
- **Like and comment system**
- **User ratings**
- **Categories and tags**

### 👤 Profile Management
- **Personal information editing**
- **Password change**
- **Activity history**
- **Preferences settings**

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Spring Boot 3** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **PostgreSQL** - Primary database
- **JWT** - Token-based authentication
- **Swagger/OpenAPI** - API documentation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Maven** - Java build tool
- **npm** - Node.js package manager

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Docker and Docker Compose
- PostgreSQL (optional, Docker will provide)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/adminpanel.git
cd adminpanel
```

### 2. Start with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# Database: localhost:5432
```

### 3. Manual Setup
```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 📦 Installation

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Configure database in `application.properties`:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/adminpanel
spring.datasource.username=postgres
spring.datasource.password=password
```

3. **Run the application:**
```bash
./mvnw spring-boot:run
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API base URL in `src/services/config.js`:**
```javascript
export const API_BASE_URL = 'http://localhost:8080/api';
```

4. **Start development server:**
```bash
npm run dev
```

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/adminpanel
DB_USERNAME=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Admin Panel
```

### Database Configuration

The application uses PostgreSQL by default. You can configure the database connection in `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/adminpanel
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "firstname": "Admin",
    "lastname": "User",
    "role": "ADMIN"
  }
}
```

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### User Management Endpoints

#### GET /api/users
Get all users (requires ADMIN role).

**Response:**
```json
[
  {
    "id": 1,
    "firstname": "Admin",
    "lastname": "User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

#### POST /api/users
Create a new user (requires ADMIN role).

**Request:**
```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "USER"
}
```

#### PUT /api/users/{id}
Update user information (requires ADMIN role).

**Request:**
```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "role": "ADMIN"
}
```

#### DELETE /api/users/{id}
Delete user (requires ADMIN role).

### AI Assistant Endpoints

#### POST /api/ai/chat
Send message to AI assistant.

**Request:**
```json
{
  "message": "Hello, how can you help me?",
  "context": "user_context"
}
```

**Response:**
```json
{
  "response": "Hello! I'm here to help you with various tasks...",
  "timestamp": "2024-01-01T00:00:00"
}
```

### Prompt Management Endpoints

#### GET /api/prompts
Get all prompts.

#### POST /api/prompts
Create a new prompt.

**Request:**
```json
{
  "title": "My Prompt",
  "content": "This is a prompt template",
  "category": "general",
  "isPublic": true
}
```

## 🚀 Deployment

### Docker Deployment

1. **Build and run with Docker Compose:**
```bash
docker-compose up -d --build
```

2. **Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### Railway Deployment

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Deploy to Railway:**
```bash
railway login
railway init
railway up
```

### Heroku Deployment

1. **Create Heroku app:**
```bash
heroku create your-app-name
```

2. **Set environment variables:**
```bash
heroku config:set DATABASE_URL=your-postgres-url
heroku config:set JWT_SECRET=your-secret-key
```

3. **Deploy:**
```bash
git push heroku main
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/adminpanel/issues) page
2. Create a new issue with detailed information
3. Contact support at support@adminpanel.com

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) for the backend framework
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [Heroicons](https://heroicons.com/) for the icons
- [OpenAI](https://openai.com/) for AI integration

---

**Made with ❤️ by [Your Name]**
