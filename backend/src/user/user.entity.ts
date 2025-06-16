// Define la entidad User, que representa a los usuarios del sistema.
// Con esto TypeORM crea la tabla automáticamente y sabe cómo mapearla.

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Solo hay dos tipos de rol posibles: 'admin' o 'user'
export type UserRole = 'admin' | 'user';

@Entity() // Nest genera automáticamente una tabla llamada 'user'
export class User {
  @PrimaryGeneratedColumn()
  id: number; // ID autoincremental

  @Column({ unique: true })
  username: string; // Nombre de usuario (único)

  @Column({ unique: true })
  email: string; // Correo del usuario (también único)

  @Column()
  password: string; // Contraseña encriptada (hash bcrypt)

  @Column({ nullable: true, type: 'text' })
  twoFactorSecret: string | null; // Secret para Google Authenticator (si tiene 2FA activado)

  @Column({ default: false })
  isTwoFactorEnabled: boolean; // Indica si tiene 2FA activo

  @Column({ type: 'varchar', default: 'user' })
  role: UserRole; // Rol del usuario: 'user' por defecto, o 'admin'
}






