import { Injectable } from '@nestjs/common';
import { UserProfile } from './entities/user-profile.entitiy';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreatedEvent } from '@app/contracts';

@Injectable()
export class UserServiceService {
  
  constructor(

    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,

  ) {}

  async handleUserCreated( data: UserCreatedEvent ){

    console.log('RabbitMQ mesajı alındı: ',data);

    // Yeni profil oluştur:
    const newProfile = this.profileRepository.create({
      id: data.userId, // Auth'tan gelen ID
      email: data.email,
      displayName: data.displayName,
      bio: `Hoş geldin ${data.displayName}`,
    });

    return await this.profileRepository.save(newProfile);

  }

}
