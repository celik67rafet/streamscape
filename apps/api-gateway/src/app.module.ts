import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as proxy from 'express-http-proxy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [

    // 1. env dosyasını okuyalım:
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // 2. JWT kütüphanesini ayarla:
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ( config: ConfigService ) => ({
        secret: config.get<string>('JWT_SECRET'),
      })
    })

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  
  
  configure(consumer: MiddlewareConsumer) {

    // NOT: Her zaman spesifik olan yani kurallı olan consumer başa gelmeli...
  
    // ÖZEL KORUMA ( örnek: gelecekteki /videos veya /profile gibi yollar için )
    // Şimdilik test etmek için 'auth/profile' gibi hayali bir yolu koruyalım
    consumer
      .apply(AuthMiddleware)
      .forRoutes('auth/me'); // Sadece /auth/me isteği atılırsa Token soracak


    // /auth ile başlayan tüm istekleri localhost:3000'e ( Auth servisine ) gönder
    consumer
      .apply(proxy('http://localhost:3000'))
      .forRoutes('auth');
  
    // İleride buraya şöyle şeyler ekleyeceğiz:
    // .forRoutes('videos') -> localhost:3001


      // Login ve Register ı public bırakıyoruz çünkü bir kullanıcı kayıt olurken veya giriş yaparken henüz token'ı yoktur.
  }
  
  
}
