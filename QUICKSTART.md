# Quick Start Guide

## Option 1: Manual Setup (Recommended for Learning)

### Step 1: Install Dependencies

```bash
# Install dependencies for each service
cd services/api-gateway && npm install && cd ../..
cd services/auth-service && npm install && cd ../..
cd services/users-service && npm install && cd ../..
cd services/products-service && npm install && cd ../..
```

### Step 2: Start Services

Open 4 terminal windows and run one command in each:

**Terminal 1:**
```bash
cd services/auth-service && npm run start:dev
```

**Terminal 2:**
```bash
cd services/users-service && npm run start:dev
```

**Terminal 3:**
```bash
cd services/products-service && npm run start:dev
```

**Terminal 4:**
```bash
cd services/api-gateway && npm run start:dev
```

Wait for all services to start (you'll see "listening" messages).

### Step 3: Test the API

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Get all products
curl http://localhost:3000/api/products

# Get all users
curl http://localhost:3000/api/users
```

## Option 2: Using Helper Scripts

### Start all services:
```bash
./start-dev.sh
```

### Stop all services:
```bash
./stop-dev.sh
```

## Option 3: Using Docker

```bash
# Build and start
docker-compose up --build

# Stop
docker-compose down
```

## What to Do Next?

1. **Explore the Code**
   - Look at [services/api-gateway/src/app.module.ts](services/api-gateway/src/app.module.ts) to see how clients are configured
   - Check [services/auth-service/src/auth.controller.ts](services/auth-service/src/auth.controller.ts) to see message patterns
   - Examine [services/users-service/src/users.service.ts](services/users-service/src/users.service.ts) for business logic

2. **Try the APIs**
   - Use the test requests in `api-tests.http`
   - Or use cURL commands from README.md
   - Or use Postman/Insomnia

3. **Modify and Experiment**
   - Add a new endpoint to a service
   - Create a new microservice
   - Add validation to DTOs
   - Implement error handling

4. **Learn More**
   - Read about NestJS microservices patterns
   - Explore different transport layers (Redis, RabbitMQ)
   - Add database integration

## Common Issues

**Port already in use:**
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
lsof -ti:3003 | xargs kill -9
```

**Services not connecting:**
- Make sure all microservices are running before the API Gateway
- Check that ports match in the configuration

**Dependencies issues:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```
