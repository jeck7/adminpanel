# 🚀 Deployment Guide

Complete guide for deploying the Admin Panel application to various platforms and environments.

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Local Development](#-local-development)
- [Docker Deployment](#-docker-deployment)
- [Railway Deployment](#-railway-deployment)
- [Heroku Deployment](#-heroku-deployment)
- [Vercel Deployment](#-vercel-deployment)
- [AWS Deployment](#-aws-deployment)
- [Production Checklist](#-production-checklist)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Java 17+** - Backend runtime
- **Node.js 18+** - Frontend build tool
- **Docker & Docker Compose** - Containerization
- **Git** - Version control
- **PostgreSQL** - Database (or use cloud service)

### Optional Tools
- **Maven** - Java build tool (included with project)
- **npm/yarn** - Node.js package manager
- **Postman** - API testing
- **pgAdmin** - Database management

## 🏠 Local Development

### Quick Start with Docker

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/adminpanel.git
cd adminpanel
```

2. **Start all services:**
```bash
docker-compose up -d
```

3. **Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Database: localhost:5432
- Swagger UI: http://localhost:8080/swagger-ui.html

### Manual Setup

#### Backend Setup
```bash
cd backend

# Install dependencies
./mvnw clean install

# Configure database
# Edit src/main/resources/application.properties

# Run the application
./mvnw spring-boot:run
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure API URL
# Edit src/services/config.js

# Start development server
npm run dev
```

## 🐳 Docker Deployment

### Single Container Deployment

#### Backend Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Create runtime image
FROM openjdk:17-jre-slim

WORKDIR /app

# Copy built jar
COPY --from=0 /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production runtime
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Multi-Container Deployment

#### docker-compose.yml
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15
    container_name: adminpanel_db
    environment:
      POSTGRES_DB: adminpanel
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - adminpanel_network

  # Backend API
  backend:
    build: ./backend
    container_name: adminpanel_backend
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/adminpanel
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD:-password}
      - JWT_SECRET=${JWT_SECRET:-your-secret-key}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "8080:8080"
    depends_on:
      - db
    networks:
      - adminpanel_network
    restart: unless-stopped

  # Frontend Application
  frontend:
    build: ./frontend
    container_name: adminpanel_frontend
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - adminpanel_network
    restart: unless-stopped

  # Nginx Reverse Proxy (Optional)
  nginx:
    image: nginx:alpine
    container_name: adminpanel_nginx
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - adminpanel_network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  adminpanel_network:
    driver: bridge
```

#### Nginx Configuration
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8080;
    }

    upstream frontend {
        server frontend:80;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Swagger UI
        location /swagger-ui/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Deployment Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Update and restart
docker-compose pull
docker-compose up -d
```

## 🚂 Railway Deployment

### Prerequisites
- Railway account
- Railway CLI installed

### Deployment Steps

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login to Railway:**
```bash
railway login
```

3. **Initialize project:**
```bash
railway init
```

4. **Add environment variables:**
```bash
railway variables set JWT_SECRET=your-secret-key
railway variables set DB_PASSWORD=your-db-password
railway variables set OPENAI_API_KEY=your-openai-key
```

5. **Deploy:**
```bash
railway up
```

### Railway Configuration

#### railway.toml (Backend)
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "java -jar target/*.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
```

#### railway.toml (Frontend)
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run preview"
healthcheckPath = "/"
healthcheckTimeout = 300
```

## 🦸 Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed

### Backend Deployment

1. **Create Heroku app:**
```bash
heroku create your-adminpanel-backend
```

2. **Add PostgreSQL addon:**
```bash
heroku addons:create heroku-postgresql:mini
```

3. **Set environment variables:**
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set OPENAI_API_KEY=your-openai-key
heroku config:set SPRING_PROFILES_ACTIVE=prod
```

4. **Deploy:**
```bash
git push heroku main
```

### Frontend Deployment

1. **Create Heroku app:**
```bash
heroku create your-adminpanel-frontend
```

2. **Set buildpacks:**
```bash
heroku buildpacks:set heroku/nodejs
```

3. **Set environment variables:**
```bash
heroku config:set VITE_API_BASE_URL=https://your-backend-app.herokuapp.com/api
```

4. **Deploy:**
```bash
git push heroku main
```

## ⚡ Vercel Deployment

### Frontend Deployment

1. **Connect GitHub repository:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` directory

2. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set environment variables:**
   - `VITE_API_BASE_URL`: Your backend API URL

4. **Deploy:**
   - Click "Deploy"

### Backend Deployment

Vercel is primarily for frontend applications. For the backend, use:
- Railway
- Heroku
- AWS
- DigitalOcean

## ☁️ AWS Deployment

### EC2 Deployment

1. **Launch EC2 instance:**
   - Choose Ubuntu 22.04 LTS
   - t3.medium or larger
   - Configure security groups

2. **Install dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java
sudo apt install openjdk-17-jdk -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
```

3. **Clone and deploy:**
```bash
git clone https://github.com/yourusername/adminpanel.git
cd adminpanel

# Set environment variables
export JWT_SECRET=your-secret-key
export DB_PASSWORD=your-db-password

# Deploy with Docker
docker-compose up -d
```

### RDS Database Setup

1. **Create RDS instance:**
   - Engine: PostgreSQL
   - Version: 15.x
   - Instance: db.t3.micro
   - Storage: 20 GB

2. **Configure security groups:**
   - Allow inbound PostgreSQL (5432) from EC2

3. **Update application.properties:**
```properties
spring.datasource.url=jdbc:postgresql://your-rds-endpoint:5432/adminpanel
spring.datasource.username=your-username
spring.datasource.password=your-password
```

### Load Balancer Setup

1. **Create Application Load Balancer:**
   - Target Group: Backend (8080)
   - Health Check: `/actuator/health`

2. **Configure SSL Certificate:**
   - Request certificate from AWS Certificate Manager
   - Attach to load balancer

## 🔒 Production Checklist

### Security
- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets

### Performance
- [ ] Enable database connection pooling
- [ ] Configure JVM memory settings
- [ ] Enable compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize database queries

### Monitoring
- [ ] Set up application logging
- [ ] Configure health checks
- [ ] Set up error tracking
- [ ] Monitor database performance
- [ ] Set up alerts for downtime
- [ ] Configure backup strategies

### Backup
- [ ] Set up database backups
- [ ] Configure file system backups
- [ ] Test restore procedures
- [ ] Document recovery process

## 🌍 Environment Variables

### Backend Variables
```env
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/adminpanel
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=86400000

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# Logging
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_EXAMPLE_ADMINPANEL=INFO
```

### Frontend Variables
```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Admin Panel
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_AI=true
VITE_ENABLE_COMMUNITY=true
```

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check Java version
java -version

# Check port availability
lsof -i :8080

# Check logs
docker-compose logs backend

# Check database connection
psql -h localhost -U postgres -d adminpanel
```

#### Frontend Build Fails
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version

# Check build logs
npm run build --verbose
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d adminpanel

# Check logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### Docker Issues
```bash
# Clean up containers
docker system prune -a

# Rebuild images
docker-compose build --no-cache

# Check resource usage
docker stats
```

### Performance Issues

#### High Memory Usage
```bash
# Check JVM memory settings
java -XX:+PrintFlagsFinal -version | grep -i heapsize

# Monitor memory usage
docker stats

# Optimize JVM settings
export JAVA_OPTS="-Xmx512m -Xms256m"
```

#### Slow Database Queries
```bash
# Enable query logging
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Check slow query log
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### SSL/HTTPS Issues

#### Certificate Problems
```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Test SSL connection
openssl s_client -connect your-domain.com:443
```

#### CORS Issues
```bash
# Check CORS configuration
# Update application.properties with correct origins

# Test with curl
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://your-backend-domain.com/api/auth/login
```

## 📞 Support

For deployment issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Test database connectivity
4. Check firewall settings
5. Review security group configurations

### Useful Commands

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Execute commands in container
docker-compose exec backend bash

# Check service status
docker-compose ps

# Restart services
docker-compose restart

# Update and redeploy
git pull
docker-compose up -d --build
```

---

**Last Updated**: January 2024  
**Version**: 1.0.0 