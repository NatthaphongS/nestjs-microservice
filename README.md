# NestJS Microservices Demo Project

A comprehensive demo project showcasing NestJS microservices architecture with TCP transport layer.

## Architecture Overview

This project demonstrates a microservices architecture with the following components:

```
┌─────────────────┐
│   API Gateway   │ (Port 3000)
│  HTTP REST API  │
└────────┬────────┘
         │
         ├──────────────┬──────────────┬──────────────┐
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│Auth Service │ │Users Service│ │Products Svc │
│  (TCP 3001) │ │  (TCP 3002) │ │  (TCP 3003) │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Services

1. **API Gateway** (Port 3000)
   - Entry point for all client requests
   - Routes requests to appropriate microservices
   - HTTP REST API endpoints

2. **Auth Service** (Port 3001)
   - User authentication and registration
   - JWT token generation and validation
   - Password hashing with bcrypt

3. **Users Service** (Port 3002)
   - User management (CRUD operations)
   - User profile data

4. **Products Service** (Port 3003)
   - Product catalog management
   - Product CRUD operations

## Features Demonstrated

- **Microservices Communication**: TCP transport layer for inter-service communication
- **Message Patterns**: Request-response pattern using `@MessagePattern` decorator
- **API Gateway Pattern**: Single entry point routing to multiple services
- **Authentication**: JWT-based authentication service
- **Service Isolation**: Each service has its own data store (in-memory for demo)
- **Scalability**: Services can be scaled independently
- **Docker Support**: Docker Compose configuration for easy deployment

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nestjs-microservice
```

2. Install dependencies for all services:
```bash
npm install
cd services/api-gateway && npm install
cd ../auth-service && npm install
cd ../users-service && npm install
cd ../products-service && npm install
cd ../..
```

Or use the workspace command:
```bash
npm run install:all
```

### Running Locally

You need to run all services simultaneously. Open 4 terminal windows:

**Terminal 1 - Auth Service:**
```bash
cd services/auth-service
npm run start:dev
```

**Terminal 2 - Users Service:**
```bash
cd services/users-service
npm run start:dev
```

**Terminal 3 - Products Service:**
```bash
cd services/products-service
npm run start:dev
```

**Terminal 4 - API Gateway:**
```bash
cd services/api-gateway
npm run start:dev
```

Or use the npm scripts from the root:
```bash
npm run dev:auth      # Terminal 1
npm run dev:users     # Terminal 2
npm run dev:products  # Terminal 3
npm run dev:gateway   # Terminal 4
```

### Running with Docker

Build and start all services:
```bash
docker-compose up --build
```

Stop all services:
```bash
docker-compose down
```

## API Endpoints

Base URL: `http://localhost:3000/api`

### Health Check
```
GET /api/health
```

### Authentication

**Register:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "password123"
}
```

**Validate Token:**
```bash
POST /api/auth/validate
Content-Type: application/json

{
  "token": "your-jwt-token"
}
```

### Users

**Get All Users:**
```bash
GET /api/users
```

**Get User by ID:**
```bash
GET /api/users/:id
```

**Create User:**
```bash
POST /api/users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "New User"
}
```

**Update User:**
```bash
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

**Delete User:**
```bash
DELETE /api/users/:id
```

### Products

**Get All Products:**
```bash
GET /api/products
```

**Get Product by ID:**
```bash
GET /api/products/:id
```

**Create Product:**
```bash
POST /api/products
Content-Type: application/json

{
  "name": "New Product",
  "price": 99.99,
  "description": "Product description"
}
```

**Update Product:**
```bash
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 149.99
}
```

**Delete Product:**
```bash
DELETE /api/products/:id
```

## Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

**Get All Products:**
```bash
curl http://localhost:3000/api/products
```

**Create Product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":1299.99,"description":"Gaming laptop"}'
```

## Project Structure

```
nestjs-microservice/
├── services/
│   ├── api-gateway/          # API Gateway service
│   │   ├── src/
│   │   │   ├── controllers/  # Route controllers
│   │   │   ├── main.ts       # Entry point
│   │   │   └── app.module.ts # Module configuration
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── auth-service/         # Authentication service
│   │   ├── src/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   └── package.json
│   │
│   ├── users-service/        # Users management service
│   │   ├── src/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   └── package.json
│   │
│   └── products-service/     # Products catalog service
│       ├── src/
│       │   ├── products.controller.ts
│       │   ├── products.service.ts
│       │   ├── main.ts
│       │   └── app.module.ts
│       └── package.json
│
├── shared/                   # Shared types and utilities
│   └── types/
│       └── index.ts          # Shared TypeScript interfaces
│
├── docker-compose.yml        # Docker Compose configuration
├── package.json              # Root package.json
└── README.md
```

## Key Concepts

### 1. Microservices Communication

Services communicate using TCP transport:

```typescript
// In API Gateway - Client setup
ClientsModule.register([
  {
    name: 'AUTH_SERVICE',
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  },
])

// Sending messages
this.authClient.send({ cmd: 'login' }, loginDto)
```

```typescript
// In Microservice - Message handler
@MessagePattern({ cmd: 'login' })
async login(data: { email: string; password: string }) {
  return this.authService.login(data);
}
```

### 2. Message Patterns

Messages are identified by command patterns:
- `{ cmd: 'login' }` - Login command
- `{ cmd: 'get_all_users' }` - Get all users
- `{ cmd: 'create_product' }` - Create product

### 3. Service Independence

Each service:
- Has its own data store
- Can be deployed independently
- Scales independently
- Has isolated business logic

## Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [Microservices Patterns](https://microservices.io/patterns/)

## Next Steps for Learning

1. **Add Database Integration**
   - Replace in-memory storage with PostgreSQL/MongoDB
   - Use TypeORM or Prisma

2. **Implement Redis for Caching**
   - Add Redis transport layer
   - Implement caching strategies

3. **Add Message Queue (RabbitMQ/Kafka)**
   - Replace TCP with message broker
   - Implement event-driven architecture

4. **Add API Documentation**
   - Integrate Swagger/OpenAPI
   - Document all endpoints

5. **Implement Authentication Guard**
   - Add JWT validation middleware
   - Protect routes in API Gateway

6. **Add Logging and Monitoring**
   - Implement centralized logging
   - Add health checks
   - Integrate monitoring tools

7. **Write Tests**
   - Unit tests for services
   - Integration tests
   - E2E tests

8. **Deploy to Cloud**
   - Kubernetes deployment
   - Cloud provider setup (AWS/GCP/Azure)

## Demo Credentials

- **Email:** demo@example.com
- **Password:** password123

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
