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
            //2. Token'ı bizim secret ile doğrula:
            const payload = await this.jwtService.verifyAsync(token);

            // 3. Kullanıcı bilgilerini isteğe ekle ( İleride lazım olacak )
            req['user'] = payload;

            next(); // Her şey yolunda, geçebilirsin!
        }catch{
            throw new UnauthorizedException('Geçersiz veya süresi dolmuş token!');
        }

    }

}