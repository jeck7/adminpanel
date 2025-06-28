# 🔧 Admin Panel Backend

Spring Boot backend application providing RESTful APIs for the Admin Panel frontend, featuring user management, authentication, AI integration, and more.

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+ (or Docker)

### Installation
```bash
cd backend
./mvnw spring-boot:run
```

Access the application at: http://localhost:8080

## 🛠️ Tech Stack

- **Spring Boot 3** - Main framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **PostgreSQL** - Primary database
- **JWT** - Token-based authentication
- **Swagger/OpenAPI** - API documentation
- **Maven** - Build tool
- **Docker** - Containerization

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/adminpanel/
│   │   │   ├── config/           # Configuration classes
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   └── SwaggerConfig.java
│   │   │   ├── controller/       # REST controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── AIController.java
│   │   │   │   └── ...
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── AuthRequest.java
│   │   │   │   ├── CreateUserRequest.java
│   │   │   │   └── ...
│   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── User.java
│   │   │   │   ├── Role.java
│   │   │   │   └── ...
│   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── ...
│   │   │   ├── service/         # Business logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── JwtService.java
│   │   │   │   └── ...
│   │   │   └── AdminpanelApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-prod.properties
│   │       └── static/
│   └── test/                    # Test classes
├── pom.xml
├── Dockerfile
└── docker-compose.yml
```

## 🎯 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (ADMIN/USER)
- Password encryption with BCrypt
- CORS configuration
- Security headers

### 👥 User Management
- Complete CRUD operations
- Role management
- User profile management
- Password validation
- Email uniqueness validation

### 🤖 AI Integration
- OpenAI API integration
- Chat functionality
- Context management
- Response caching

### 📊 Data Management
- PostgreSQL database
- JPA/Hibernate ORM
- Database migrations
- Connection pooling

### 📚 API Documentation
- Swagger/OpenAPI 3
- Interactive API docs
- Request/Response examples
- Authentication documentation

## ⚙️ Configuration

### Application Properties

#### Development (`application.properties`)
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/adminpanel
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-secret-key-here-make-it-long-and-secure
jwt.expiration=86400000

# OpenAI Configuration (optional)
openai.api.key=your-openai-api-key
openai.api.url=https://api.openai.com/v1

# Logging Configuration
logging.level.com.example.adminpanel=DEBUG
logging.level.org.springframework.security=DEBUG
```

#### Production (`application-prod.properties`)
```properties
# Production Database
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JWT Secret from environment
jwt.secret=${JWT_SECRET}

# OpenAI API Key from environment
openai.api.key=${OPENAI_API_KEY}

# Disable SQL logging in production
spring.jpa.show-sql=false
logging.level.com.example.adminpanel=INFO
```

### Environment Variables

Create a `.env` file or set environment variables:

```env
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/adminpanel
DB_USERNAME=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Server
SERVER_PORT=8080
```

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

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

**Headers:**
```
Authorization: Bearer <jwt-token>
```

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

## 🔐 Security Configuration

### JWT Authentication
JWT tokens are used for stateless authentication:

```java
@Component
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;
    
    public String generateToken(UserDetails userDetails) {
        // Token generation logic
    }
    
    public boolean validateToken(String token) {
        // Token validation logic
    }
}
```

### Role-Based Access Control
Different endpoints require different roles:

```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/users")
public List<User> getAllUsers() {
    return userService.getAllUsers();
}
```

### CORS Configuration
CORS is configured to allow frontend requests:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🗄️ Database

### Entity Relationships

```java
@Entity
@Table(name = "_user")
public class User implements UserDetails {
    @Id
    @GeneratedValue
    private Integer id;
    
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    // UserDetails implementation
}
```

### Database Schema
```sql
-- Users table
CREATE TABLE _user (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Example usage table
CREATE TABLE example_usage (
    id SERIAL PRIMARY KEY,
    example_index INTEGER NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest

# Run with coverage
./mvnw test jacoco:report
```

### Integration Tests
```bash
# Run integration tests
./mvnw verify

# Run with test database
./mvnw test -Dspring.profiles.active=test
```

### Example Test
```java
@SpringBootTest
class UserServiceTest {
    @Autowired
    private UserService userService;
    
    @Test
    void shouldCreateUser() {
        CreateUserRequest request = new CreateUserRequest();
        request.setFirstname("John");
        request.setLastname("Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");
        
        User user = userService.createUser(request);
        
        assertThat(user.getEmail()).isEqualTo("john@example.com");
        assertThat(user.getRole()).isEqualTo(Role.USER);
    }
}
```

## 🚀 Deployment

### Docker Deployment

#### Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=jdbc:postgresql://db:5432/adminpanel
      - DB_USERNAME=postgres
      - DB_PASSWORD=password
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=adminpanel
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

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

## 📊 Monitoring & Logging

### Application Metrics
```java
@RestController
public class MetricsController {
    @GetMapping("/actuator/health")
    public Health health() {
        return Health.up().build();
    }
}
```

### Logging Configuration
```properties
# Logging levels
logging.level.root=INFO
logging.level.com.example.adminpanel=DEBUG
logging.level.org.springframework.security=DEBUG

# Log file configuration
logging.file.name=logs/application.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

## 🔧 Development

### Adding New Endpoints
1. Create controller in `controller/` package
2. Add service in `service/` package
3. Add repository if needed
4. Update security configuration
5. Add tests

### Adding New Entities
1. Create entity in `entity/` package
2. Create repository interface
3. Create DTOs for request/response
4. Add service methods
5. Create controller endpoints

### Database Migrations
```bash
# Generate migration
./mvnw flyway:migrate

# Clean database
./mvnw flyway:clean
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

**Database connection issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

**JWT token issues:**
```bash
# Check JWT secret in application.properties
# Ensure secret is long enough (at least 256 bits)
```

## 📚 Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Spring Data JPA Documentation](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 