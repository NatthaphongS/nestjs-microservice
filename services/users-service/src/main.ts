import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  // Try Docker path first, then local development path
  const protoPath = existsSync(join(process.cwd(), 'proto/users.proto'))
    ? join(process.cwd(), 'proto/users.proto')
    : join(__dirname, '../../../proto/users.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'users',
        protoPath,
        url: '0.0.0.0:3002',
      },
    },
  );

  await app.listen();
  console.log('Users Service is listening on port 3002 (gRPC)');
}
bootstrap();
