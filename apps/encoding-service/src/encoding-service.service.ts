import { VideoUploadedEvent } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { stat } from 'fs';

@Injectable()
export class EncodingServiceService {
 
  constructor(
    @Inject('ENCODING_SERVICE') private readonly client: ClientProxy,
  ) {}

  async processVideo(data: VideoUploadedEvent){

    console.log('--- VİDEO İŞLEME BAŞLADI ---');
    console.log('İşlenen Video ID:', data.videoId);
    console.log('Dosya Yolu:', data.storageKey);

    // Sembolik işleme: 10 saniye bekle
    await new Promise((resolve) => setTimeout(resolve, 10000));

    this.client.emit('encoding_completed', {
      videoId: data.videoId,
      status: 'READY',
    });

    console.log('--- VİDEO BAŞARIYLA İŞLENDİ VE SONUÇ VİDEO SERVİSİNE GÖNDERİLDİ ---');
    // İleride burada 'video bitti' mesajı fırlatacağız.

  }

}
