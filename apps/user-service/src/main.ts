import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {

  const app = await NestFactory.create(UserServiceModule);
  const configService = app.get(ConfigService);

  // RabbitMQ Mikroservis bağlantısını ekliyoruz:
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'user_queue', // Auth servisinin mesaj gönderdiği kuyrukla AYNI olmalı
      queueOptions: {
        durable: false,
      },
    },
  });
 
  // Hem HTTP hem Mikroservis olarak başlat:
  await app.startAllMicroservices();
  await app.listen(3001); // User service 3001'de

  console.log('User Service 3001 portunda çalışıyor...');

}
bootstrap();
