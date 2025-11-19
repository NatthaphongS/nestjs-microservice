import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  // Try Docker path first, then local development path
  const protoPath = existsSync(join(process.cwd(), 'proto/products.proto'))
    ? join(process.cwd(), 'proto/products.proto')
    : join(__dirname, '../../../proto/products.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'products',
        protoPath,
        url: '0.0.0.0:3003',
      },
    },
  );

  await app.listen();
  console.log('Products Service is listening on port 3003 (gRPC)');
}
bootstrap();
