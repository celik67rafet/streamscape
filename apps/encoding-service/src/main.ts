import { NestFactory } from '@nestjs/core';
import { EncodingServiceModule } from './encoding-service.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {

  const app = await NestFactory.create(EncodingServiceModule);
  const configService = app.get(ConfigService);

  // RabbitMQ Dinleyicisi (consumer):
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'video_queue', // Video Service'in mesaj attığı kuyrukla aynı isim olmalı,
      queueOptions: { durable: false },
    }
  });

  await app.startAllMicroservices();
  await app.listen(3003);
  console.log('Encoding Service 3003 portunda RabbitMQ dinliyor...');

}
bootstrap();
