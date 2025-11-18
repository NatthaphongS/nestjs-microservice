#!/bin/bash

# Start all microservices in development mode

echo "Starting NestJS Microservices Demo..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port $1 is already in use!"
    return 1
  fi
  return 0
}

# Check if all ports are available
echo "Checking ports..."
check_port 3000 || exit 1
check_port 3001 || exit 1
check_port 3002 || exit 1
check_port 3003 || exit 1

echo -e "${GREEN}✓ All ports are available${NC}\n"

# Start services in background
echo "Starting services..."

cd services/auth-service
echo -e "${BLUE}Starting Auth Service on port 3001...${NC}"
npm run start:dev > ../../logs/auth-service.log 2>&1 &
AUTH_PID=$!
cd ../..

sleep 2

cd services/users-service
echo -e "${BLUE}Starting Users Service on port 3002...${NC}"
npm run start:dev > ../../logs/users-service.log 2>&1 &
USERS_PID=$!
cd ../..

sleep 2

cd services/products-service
echo -e "${BLUE}Starting Products Service on port 3003...${NC}"
npm run start:dev > ../../logs/products-service.log 2>&1 &
PRODUCTS_PID=$!
cd ../..

sleep 3

cd services/api-gateway
echo -e "${BLUE}Starting API Gateway on port 3000...${NC}"
npm run start:dev > ../../logs/api-gateway.log 2>&1 &
GATEWAY_PID=$!
cd ../..

echo ""
echo -e "${GREEN}========================================"
echo "All services started successfully!"
echo "========================================${NC}"
echo ""
echo "Service URLs:"
echo "  - API Gateway:      http://localhost:3000/api"
echo "  - Auth Service:     TCP://localhost:3001"
echo "  - Users Service:    TCP://localhost:3002"
echo "  - Products Service: TCP://localhost:3003"
echo ""
echo "Process IDs:"
echo "  - Auth Service:     $AUTH_PID"
echo "  - Users Service:    $USERS_PID"
echo "  - Products Service: $PRODUCTS_PID"
echo "  - API Gateway:      $GATEWAY_PID"
echo ""
echo "Logs are being written to ./logs/ directory"
echo ""
echo "To stop all services, run: ./stop-dev.sh"
echo "Or manually kill processes: kill $AUTH_PID $USERS_PID $PRODUCTS_PID $GATEWAY_PID"
