import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./user-profile.entitiy";


@Entity('channel')
export class Channel{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column()
    name!: string;
    
    @Column({ nullable: true })
    description!: string;

    @Column({ default: 0 })
    subscriberCount!: number;

    // Bir kanalın mutlaka bir sahibi (UserProfile) vardır.
    @OneToOne(() => UserProfile)
    @JoinColumn()
    owner!: UserProfile;

    @Column()
    ownerId: string;
}