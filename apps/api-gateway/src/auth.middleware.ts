import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware{

    constructor( private readonly jwtService: JwtService ) {}

    async use( req: Request, res: Response, next: NextFunction ){

        // 1. Authorization header'ı var mı? ( Bearer <token> )
        const authHeader = req.headers.authorization;

        if( !authHeader ){
            throw new UnauthorizedException('Token bulunamadı!');
        }

        const token = authHeader.split(' ')[1]; // "Bearer" kısmını at, sadece token'ı al
        try{

            console.log('Middleware\'e gelen token:', token);

            //2. Token'ı bizim secret ile doğrula:
            const payload = await this.jwtService.verifyAsync(token);

            // İsteğin header kısmına 'x-user-id' diye bir alan ekliyoruz.
            // Arkadaki servisler (User, Video vb.) kullanıcıyı buradan tanıyacak.
            req.headers['x-user-id'] = payload.sub;

            // 3. Kullanıcı bilgilerini isteğe ekle ( İleride lazım olacak )
            req['user'] = payload;

            next(); // Her şey yolunda, geçebilirsin!
        }catch(error:any){

            console.log('JWT Doğrulama Hatası: ', error.message);

            throw new UnauthorizedException('Geçersiz veya süresi dolmuş token!');
        }

    }

}