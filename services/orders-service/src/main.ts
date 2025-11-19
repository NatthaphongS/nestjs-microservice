import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  // Try Docker path first, then local development path
  const protoPath = existsSync(join(process.cwd(), 'proto/orders.proto'))
    ? join(process.cwd(), 'proto/orders.proto')
    : join(__dirname, '../../../proto/orders.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'orders',
        protoPath,
        url: '0.0.0.0:3004',
      },
    },
  );

  await app.listen();
  console.log('Orders Service is listening on port 3004 (gRPC)');
}
bootstrap();
