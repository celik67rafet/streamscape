import { Body, Controller, Post } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { RegisterUserDto } from '@app/contracts';
import { LoginUserDto } from '@app/contracts';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto){
    return this.authServiceService.register(dto);
  }

  @Post('login') // <-- yeni login endpoint'i
  async login(@Body() dto: LoginUserDto){
    return this.authServiceService.login(dto);
  }

}
