import { Module } from '@nestjs/common';
import { EncodingServiceController } from './encoding-service.controller';
import { EncodingServiceService } from './encoding-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [

    // .env dosyasını bu modül için de aktif ediyoruz:
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env' 
    }),

    ClientsModule.registerAsync([
      {
        name: 'ENCODING_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RABBITMQ_URL')],
            queue: 'video_result_queue', // Sonuçların gideceği ayrı bir kuyruk
            queueOptions: { durable: false },
          }
        })
      }
    ])

  ],
  controllers: [EncodingServiceController],
  providers: [EncodingServiceService],
})
export class EncodingServiceModule {}
