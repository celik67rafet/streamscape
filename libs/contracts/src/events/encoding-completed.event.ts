export class EncodingCompletedEvent{
    videoId!: string;
    status!: string; // 'READY' veya 'FAILED'
}