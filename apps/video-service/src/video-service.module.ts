import { Module } from '@nestjs/common';
import { VideoServiceController } from './video-service.controller';
import { VideoServiceService } from './video-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import * as Minio from 'minio';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Video], 
        synchronize: true,
      })
    }),
    TypeOrmModule.forFeature([Video]),

    // RabbitMQ istemcisi:
  ClientsModule.registerAsync([
    {
      name: 'VIDEO_SERVICE', // Bu ismi servise enjekte ederken kullanacağız...
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({

        transport: Transport.RMQ,
        options: {
          urls: [config.get<string>('RABBITMQ_URL')],
          queue: 'video_queue', // Videoların işlenmek üzere bekleyeceği kuyruk
          queueOptions: {durable: false},
        }

      })
    }
  ]),
  ],

  controllers: [VideoServiceController],
  providers: [
    VideoServiceService,
    // MinIO Client'ı projemize dahil ediyoruz:
    {
      provide: 'MINIO_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Minio.Client({
          endPoint: config.get('MINIO_ENDPOINT'),
          port: Number(config.get('MINIO_PORT')),
          useSSL: false,
          accessKey: config.get('MINIO_ACCESS_KEY'),
          secretKey: config.get('MINIO_SECRET_KEY'),
        })
      }
    }

  ],
})
export class VideoServiceModule {}

