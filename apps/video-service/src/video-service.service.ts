import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video, VideoStatus } from './entities/video.entity';
import { Repository } from 'typeorm';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid'; // benzersiz dosya adı için...
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VideoServiceService {
  constructor(

    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @Inject('MINIO_CLIENT')
    private readonly minioClient: Minio.Client,
    @Inject('VIDEO_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async uploadVideo(file: any, title: string, description: string, userId: string){

    const bucketName = 'streamscape-videos';

    // 1.Bucket var mı kontrol et, yoksa oluştur:
    const bucketExists = await this.minioClient.bucketExists(bucketName);

    if( !bucketExists ){
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
    }

    // 2.Dosya için benzersiz bir isim üret (storageKey)
    const filename = `${uuidv4()}-${file.originalname}`;
    const storageKey = `raw/${filename}`;

    // 3.Dosyayı MinIO'ya yükle (Stream olarak)
    await this.minioClient.putObject(
      bucketName,
      storageKey,
      file.buffer, // Dosyanın kendisi
      file.size
    );

    // 4. Bilgileri PostgreSQL'e kaydet:
    const video = this.videoRepository.create({
      ownerId: userId,
      title,
      description,
      storageKey,
      status: VideoStatus.UPLOADED,
    });

    const savedVideo = await this.videoRepository.save(video);

    // RABBITMQ'YA MESAJ FIRLAT:
    this.client.emit('video_uploaded',{
      videoId: savedVideo.id,
      storageKey: savedVideo.storageKey,
      ownerId: savedVideo.ownerId,
    });

    return savedVideo;

  }

  async updateVideoStatus(videoId:string, status: VideoStatus){
    await this.videoRepository.update(videoId, { status })
    console.log(`Video ID: ${videoId} durumu ${status} olarak güncellendi.`);
  }
}
