import { Injectable } from '@nestjs/common';
import { UserProfile } from './entities/user-profile.entitiy';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreatedEvent } from '@app/contracts';
import { Channel } from './entities/channel.entity';

@Injectable()
export class UserServiceService {
  
  constructor(

    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>

  ) {}

  async handleUserCreated( data: UserCreatedEvent ){

    // Profil oluştur:
    const profile = this.profileRepository.create({
      id: data.userId,
      email: data.email,
      displayName: data.displayName,
    });

    const savedProfile = await this.profileRepository.save(profile);

    // Bu profil için otomatik kanal oluştur:
    const channel = this.channelRepository.create({
      name: `${data.displayName}'s Channel`,
      description: 'Hoş geldiniz! Bu benim yeni kanalım!',
      owner: savedProfile,
      ownerId: savedProfile.id,
    });

    await this.channelRepository.save(channel);

    console.log(`profil ve kanal başarıyla oluşturuldu: ${data.displayName}`);

  }

  async getProfile( userId: string ){

    return await this.profileRepository.findOne({
      where: { id: userId },
      relations: ['channel'], // Kanal bilgilerini de beraberinde getir... [JOIN]
    })

  }

}
