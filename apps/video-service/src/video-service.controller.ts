import { Controller, Get, Post, UseInterceptors, UploadedFile, Body, Headers } from '@nestjs/common';
import { VideoServiceService } from './video-service.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('videos')
export class VideoServiceController {
  constructor(private readonly videoServiceService: VideoServiceService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' isimli alanı yakala...
  async uploadVideo(
    @UploadedFile() file: any,
    @Body() body: { title: string; description: string },
    @Headers('x-user-id') userId: string,
  ){
    console.log('Dosya alındı: ', file?.originalname);
    console.log('Yüklenen User ID: ', userId);

    // return { message: 'Dosya başarıyla sunucuya ulaştı, şimdi MiniIO\'ya göndereceğiz.' }

    return this.videoServiceService.uploadVideo(
      file,
      body.title,
      body.description,
      userId

    )
  }

  @EventPattern('encoding_completed')
  async handleEncodingCompleted(@Payload() data:any){
    await this.videoServiceService.updateVideoStatus(data.videoId, data.status);
  }

}
