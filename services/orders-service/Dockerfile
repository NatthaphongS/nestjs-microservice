FROM node:20-alpine

# Install dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy proto files
COPY proto ./proto/

# Copy service files
COPY services/orders-service/package*.json ./
COPY services/orders-service/prisma ./prisma/

RUN npm install

# Generate Prisma Client with correct binary target
RUN npx prisma generate

COPY services/orders-service/. .

RUN npm run build

EXPOSE 3004

CMD ["node", "dist/main"]
