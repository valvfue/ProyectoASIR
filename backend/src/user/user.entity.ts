import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'text' })
  twoFactorSecret: string | null; // ✅ ahora acepta null

  @Column({ default: false })
  isTwoFactorEnabled: boolean;
}




