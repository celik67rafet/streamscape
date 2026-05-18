import { Controller, Get } from '@nestjs/common';
import { EncodingServiceService } from './encoding-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VideoUploadedEvent } from '@app/contracts';

@Controller()
export class EncodingServiceController {
  constructor(private readonly encodingServiceService: EncodingServiceService) {}

  @EventPattern('video_uploaded')
  async handleVideoUploaded(@Payload() data: VideoUploadedEvent){
    await this.encodingServiceService.processVideo(data);
  }
}
