import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { UserRole } from '../user.entity';     

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: UserRole;
}



