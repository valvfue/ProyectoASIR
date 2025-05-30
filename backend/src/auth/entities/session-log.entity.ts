import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SessionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string; 

  @Column()
  loginAt: Date;
}


