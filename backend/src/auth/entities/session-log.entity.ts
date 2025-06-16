// Entidad SessionLog: aquí guardo cada inicio de sesión para la auditoría.

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SessionLog {
  // Clave primaria autoincremental
  @PrimaryGeneratedColumn()
  id: number;

  // ID del usuario que inició sesión
  @Column()
  userId: number;

  // Nombre de usuario (o email)
  @Column()
  username: string;

  // IP pública desde donde se hizo el login
  @Column()
  ipAddress: string;

  // Navegador + sistema operativo del cliente
  @Column()
  userAgent: string;

  // Fecha y hora exacta del acceso (se rellena en AuthService)
  @Column()
  loginAt: Date;
}



