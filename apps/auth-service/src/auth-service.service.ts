import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto } from '@app/contracts';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthServiceService {
  /**
   *
   */
  constructor(

    @InjectRepository(User) // <- özel bir enjeksiyon...
    private readonly userRepository: Repository<User>, // <- constructor injection
    private readonly jwtService: JwtService, // jwtService enjekte ettik

    @Inject('AUTH_SERVICE') // Module'de verdiğimiz isimle enjekte ediyoruz
    private readonly client: ClientProxy,

  ) {}

  async register(dto: RegisterUserDto){

    // 1. Email adresi daha önce kullanılmış mı?
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if( existingUser ){
      
      throw new ConflictException('Bu email adresi zaten kullanımda.');
      
    }

    // 2. Şifreyi şifrele (Hash)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.passwordHash, salt);

    // 3. Kullanıcıyı oluştur ve kaydet
    const newUser = this.userRepository.create({
      email: dto.email,
      displayName: dto.displayName,
      passwordHash: hashedPassword,
    });

    // return this.userRepository.save(newUser);

    const savedUser = await this.userRepository.save(newUser);

    // RabbitMQ'ya mesaj gönder:
    // "user_created" ismiyle mesajı fırlatıyoruz:
    this.client.emit('user_created', {
      userId: savedUser.id,
      email: savedUser.email,
      displayName: savedUser.displayName,
    })

    return savedUser;

  }

  async login( dto: LoginUserDto ){

    // 1. Kullanıcıyı bul:
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if( !user ){

      throw new UnauthorizedException('E-posta veya şifre hatalı.');

    }

    // 3. Kullanıcı bilgilerini içeren bir paket (payload) hazırla:
    const payload = { sub: user.id, email: user.email };

    // 4. Token'ı imzala ve dön:
    return {
      access_token: this.jwtService.sign(payload),
    }

  }

}
