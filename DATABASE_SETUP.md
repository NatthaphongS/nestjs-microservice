# Database Setup Guide with Prisma

## Current Status

- Docker databases are running on:
  - Auth DB: `localhost:5435`
  - Users DB: `localhost:5433`
  - Products DB: `localhost:5434`

- Prisma schemas created for all services
- Package.json files updated with Prisma dependencies

## Steps to Complete Setup

### 1. Install Prisma Dependencies

Run these commands to install Prisma in each service:

```bash
# Auth Service
cd services/auth-service
npm install

# Users Service
cd ../users-service
npm install

# Products Service
cd ../products-service
npm install
```

### 2. Generate Prisma Clients

```bash
# Auth Service
cd services/auth-service
npx prisma generate

# Users Service
cd ../users-service
npx prisma generate

# Products Service
cd ../products-service
npx prisma generate
```

### 3. Run Database Migrations

```bash
# Auth Service
cd services/auth-service
npx prisma migrate dev --name init

# Users Service
cd ../users-service
npx prisma migrate dev --name init

# Products Service
cd ../products-service
npx prisma migrate dev --name init
```

### 4. Verify Databases

Check that tables were created:

```bash
# Connect to auth database
docker exec -it auth-db psql -U authuser -d authdb -c "\dt"

# Connect to users database
docker exec -it users-db psql -U usersuser -d usersdb -c "\dt"

# Connect to products database
docker exec -it products-db psql -U productsuser -d productsdb -c "\dt"
```

## Database Connection Strings

The services use these connection strings (already configured in .env files):

- **Auth Service**: `postgresql://authuser:authpass@localhost:5435/authdb`
- **Users Service**: `postgresql://usersuser:userspass@localhost:5433/usersdb`
- **Products Service**: `postgresql://productsuser:productspass@localhost:5434/productsdb`

## Prisma Studio (Database GUI)

To view and manage data:

```bash
# Auth Service database
cd services/auth-service
npm run prisma:studio

# Users Service database
cd services/users-service
npm run prisma:studio

# Products Service database
cd services/products-service
npm run prisma:studio
```

## Next Steps

After completing the above steps, I'll help you:
1. Create Prisma service providers for each microservice
2. Update controllers to use Prisma instead of in-memory storage
3. Add seed data to databases
4. Test the full integration

## Troubleshooting

**Port conflicts:**
- Auth DB: 5435
- Users DB: 5433
- Products DB: 5434

**Reset databases:**
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

**Check database logs:**
```bash
docker logs auth-db
docker logs users-db
docker logs products-db
```
