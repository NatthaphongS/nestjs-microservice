# Orders Service - Complete Guide

## Overview

The Orders Service manages customer orders with full CRUD operations and order lifecycle management. It demonstrates:
- **Prisma ORM** with PostgreSQL
- **Relational data** (Orders with OrderItems)
- **Enum types** for order status
- **Service-to-service communication** (references Users and Products)

## Architecture

```
┌─────────────────┐
│   API Gateway   │
│  (Port 3000)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ Orders Service  │◄────►│  PostgreSQL DB   │
│   (TCP 3004)    │      │   (Port 5436)    │
└─────────────────┘      └──────────────────┘
```

## Database Schema

### Order Model
```prisma
model Order {
  id         String      @id @default(uuid())
  userId     String      // References User from Users Service
  status     OrderStatus @default(PENDING)
  totalPrice Float
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  items      OrderItem[] // One-to-many relation
}
```

### OrderItem Model
```prisma
model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String   // References Product from Products Service
  quantity  Int
  price     Float
  createdAt DateTime @default(now())
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

### Order Status Enum
```prisma
enum OrderStatus {
  PENDING      // Order created, awaiting confirmation
  CONFIRMED    // Order confirmed
  PROCESSING   // Order being prepared
  SHIPPED      // Order shipped
  DELIVERED    // Order delivered
  CANCELLED    // Order cancelled
}
```

## API Endpoints

### 1. Get All Orders
```bash
GET /api/orders
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "status": "PENDING",
      "totalPrice": 129.98,
      "createdAt": "2025-11-19T00:00:00.000Z",
      "updatedAt": "2025-11-19T00:00:00.000Z",
      "items": [
        {
          "id": "item-uuid",
          "productId": "product-uuid",
          "quantity": 2,
          "price": 64.99
        }
      ]
    }
  ]
}
```

### 2. Get Order by ID
```bash
GET /api/orders/:id
```

### 3. Get User's Orders
```bash
GET /api/orders/user/:userId
```

### 4. Create Order
```bash
POST /api/orders
Content-Type: application/json

{
  "userId": "user-uuid",
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "price": 64.99
    },
    {
      "productId": "another-product-uuid",
      "quantity": 1,
      "price": 29.99
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "status": "PENDING",
    "totalPrice": 159.97,
    "items": [...]
  }
}
```

### 5. Update Order Status
```bash
PUT /api/orders/:id/status
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

Valid statuses: `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### 6. Cancel Order
```bash
DELETE /api/orders/:id
```

**Note:** Cannot cancel orders with status `DELIVERED` or `CANCELLED`

## Setup Instructions

### 1. Start Orders Database
```bash
docker-compose -f docker-compose.dev.yml up -d orders-db
```

### 2. Install Dependencies
```bash
cd services/orders-service
npm install
```

### 3. Run Prisma Migrations
```bash
cd services/orders-service
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Start the Service
```bash
npm run start:dev
```

## Testing the Service

### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1",
    "items": [
      {
        "productId": "1",
        "quantity": 2,
        "price": 999.99
      },
      {
        "productId": "2",
        "quantity": 1,
        "price": 29.99
      }
    ]
  }'
```

### Get All Orders
```bash
curl http://localhost:3000/api/orders
```

### Update Order Status
```bash
curl -X PUT http://localhost:3000/api/orders/{order-id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'
```

### Cancel Order
```bash
curl -X DELETE http://localhost:3000/api/orders/{order-id}
```

## Database Connection

**Connection String:**
```
postgresql://ordersuser:orderspass@localhost:5436/ordersdb
```

**Prisma Studio:**
```bash
cd services/orders-service
npm run prisma:studio
```

## Key Features

### 1. Automatic Price Calculation
The service automatically calculates `totalPrice` based on order items:
```typescript
const totalPrice = data.items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
);
```

### 2. Cascade Delete
When an order is deleted, all associated OrderItems are automatically deleted:
```prisma
order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
```

### 3. Status Validation
The service validates order status transitions and prevents invalid updates.

### 4. Business Logic
- Cannot cancel DELIVERED or CANCELLED orders
- Status changes are tracked with `updatedAt`
- Orders default to PENDING status

## Microservices Integration

The Orders Service integrates with:

**Users Service** - References userId for order ownership
**Products Service** - References productId for order items

In a production system, you could:
1. Validate userId exists in Users Service before creating order
2. Validate productId and check stock in Products Service
3. Update product inventory when order is confirmed
4. Send notifications via a separate Notifications Service

## Next Steps

1. **Add Validation**
   - Verify user exists before creating order
   - Verify products exist and are in stock
   - Validate sufficient inventory

2. **Add Inter-Service Communication**
   - Call Users Service to validate userId
   - Call Products Service to check stock
   - Update inventory when order is confirmed

3. **Add Payment Integration**
   - Create Payment Service
   - Handle payment processing
   - Update order status based on payment

4. **Add Order History**
   - Track status changes
   - Add audit log

## File Structure

```
services/orders-service/
├── prisma/
│   └── schema.prisma          # Database schema with Order & OrderItem models
├── src/
│   ├── main.ts               # Service entry point
│   ├── app.module.ts         # Module configuration
│   ├── orders.controller.ts  # Message pattern handlers
│   ├── orders.service.ts     # Business logic with Prisma
│   └── prisma.service.ts     # Prisma client service
├── .env                      # Database connection
├── package.json
├── tsconfig.json
└── Dockerfile
```

## Environment Variables

```bash
DATABASE_URL="postgresql://ordersuser:orderspass@localhost:5436/ordersdb"
PORT=3004
```

## Complete!

The Orders Service is now fully integrated into your microservices architecture!
