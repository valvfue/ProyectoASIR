// DTO para registrar un nuevo usuario desde el backend o el panel de admin.
// Uso decoradores de class-validator para validar los datos que se envían.

import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  username: string; // El nombre no puede ir vacío

  @IsEmail()
  email: string; // Valido que sea un correo real

  @IsNotEmpty()
  password: string; // Requiero contraseña

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: UserRole; // Si se pasa, tiene que ser uno de estos dos
}




