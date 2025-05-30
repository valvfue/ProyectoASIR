import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  ip: string;

  @CreateDateColumn()
  loginAt: Date;
}
