FROM node:20-alpine

# Install dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy proto files
COPY proto ./proto/

# Copy service files
COPY services/products-service/package*.json ./
COPY services/products-service/prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY services/products-service/. .

RUN npm run build

EXPOSE 3003

CMD ["node", "dist/main"]
