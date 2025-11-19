import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { ProductsController } from './controllers/products.controller';
import { OrdersController } from './controllers/orders.controller';
import { join } from 'path';
import { existsSync } from 'fs';

// Helper function to get proto path
function getProtoPath(filename: string): string {
  const dockerPath = join(process.cwd(), `proto/${filename}`);
  const localPath = join(__dirname, `../../../proto/${filename}`);
  return existsSync(dockerPath) ? dockerPath : localPath;
}

@Module({
  imports: [
    // Auth Service Client
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: getProtoPath('auth.proto'),
          url: `${process.env.AUTH_SERVICE_HOST || 'localhost'}:${parseInt(process.env.AUTH_SERVICE_PORT) || 3001}`,
        },
      },
    ]),
    // Users Service Client
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: getProtoPath('users.proto'),
          url: `${process.env.USERS_SERVICE_HOST || 'localhost'}:${parseInt(process.env.USERS_SERVICE_PORT) || 3002}`,
        },
      },
    ]),
    // Products Service Client
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'products',
          protoPath: getProtoPath('products.proto'),
          url: `${process.env.PRODUCTS_SERVICE_HOST || 'localhost'}:${parseInt(process.env.PRODUCTS_SERVICE_PORT) || 3003}`,
        },
      },
    ]),
    // Orders Service Client
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'orders',
          protoPath: getProtoPath('orders.proto'),
          url: `${process.env.ORDERS_SERVICE_HOST || 'localhost'}:${parseInt(process.env.ORDERS_SERVICE_PORT) || 3004}`,
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    ProductsController,
    OrdersController,
  ],
})
export class AppModule {}
