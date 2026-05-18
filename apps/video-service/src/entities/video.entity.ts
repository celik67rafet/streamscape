import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum VideoStatus{
    UPLOADED = 'UPLOADED',
    PROCESSING = 'PROCESSING',
    READY = 'READY',
    FAILED = 'FAILED'
}

@Entity('videos')
export class Video{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    ownerId!: string; // Kim yükledi? ( Identity Forwarding ile gelecek... )

    @Column()
    title!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({
        type: 'enum',
        enum: VideoStatus,
        default: VideoStatus.UPLOADED,
    })
    status!: VideoStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    storageKey!: string;


}