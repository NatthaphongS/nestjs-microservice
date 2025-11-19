FROM node:20-alpine

# Install dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy proto files
COPY proto ./proto/

# Copy service files
COPY services/auth-service/package*.json ./
COPY services/auth-service/prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY services/auth-service/. .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]
