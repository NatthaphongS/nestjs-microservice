import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  // Try Docker path first, then local development path
  const protoPath = existsSync(join(process.cwd(), 'proto/auth.proto'))
    ? join(process.cwd(), 'proto/auth.proto')
    : join(__dirname, '../../../proto/auth.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath,
        url: '0.0.0.0:3001',
      },
    },
  );

  await app.listen();
  console.log('Auth Service is listening on port 3001 (gRPC)');
}
bootstrap();
