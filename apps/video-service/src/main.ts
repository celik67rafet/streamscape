import { NestFactory } from '@nestjs/core';
import { VideoServiceModule } from './video-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(VideoServiceModule);

  const configService = app.get(ConfigService);

  
  
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: 'video_result_queue',
      queueOptions: { durable: false },
    }
  })
  
  await app.startAllMicroservices();
  await app.listen(3002);
  console.log('Video Service 3002 portunda çalışıyor ve RabbitMQ yu dinliyor...');

}
bootstrap();
