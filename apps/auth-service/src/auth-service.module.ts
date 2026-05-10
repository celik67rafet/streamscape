import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 

@Module({
  imports: [

    // .env'yi tüm projede geçerli kıl:
    ConfigModule.forRoot({

      isGlobal: true,
      envFilePath: '.env'

    }),

    TypeOrmModule.forRootAsync({

      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ( configService: ConfigService ) => ({

        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true

      }),
    }),
    TypeOrmModule.forFeature([User]), // User tablosunu bu modülde kullanacağımızı söylüyoruz

    // Jwt yapılandırması:
    JwtModule.register({
      secret: 'super-secret-key-123', // Gerçek projede bu env'de olur...
      signOptions: { expiresIn: '1d' } // Token 1 gün geçerli olsun.
    })
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService], // burada aslında DI kaydı yapıldı
})
export class AuthServiceModule {}
