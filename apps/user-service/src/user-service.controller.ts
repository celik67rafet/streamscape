import { Controller, Get, Headers } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserCreatedEvent } from '@app/contracts';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userService: UserServiceService) {}

  // "user_created" isimli bir event gelirse bu metodu çalıştır:
  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: UserCreatedEvent){
    await this.userService.handleUserCreated(data);
  }

  @Get('me')
  async getMe(@Headers('x-user-id') userId: string){

    return this.userService.getProfile(userId);
  }

}

