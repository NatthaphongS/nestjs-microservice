FROM node:20-alpine

WORKDIR /app

# Copy proto files
COPY proto ./proto/

# Copy service files
COPY services/api-gateway/package*.json ./

RUN npm install

COPY services/api-gateway/. .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
