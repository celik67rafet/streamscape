import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('user_profile')
export class UserProfile{
    @PrimaryColumn() // ID'yi Auth servisinden alacağımız için otomatik üretmiyoruz
    id!: string;

    @Column()
    email!: string;

    @Column()
    displayName!: string;

    @Column({ nullable: true })
    bio!: string;

    @Column({ default: 0 })
    followerCount!: number;

    @CreateDateColumn()
    createdAt!: Date;
}