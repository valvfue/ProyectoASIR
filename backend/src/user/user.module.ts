// Módulo de usuario: aquí importo la entidad, el servicio y el controlador.
// También exporto el UserService para que otros módulos (como Auth) lo puedan usar.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  // Importo la entidad User para que el repositorio funcione con TypeORM
  imports: [TypeOrmModule.forFeature([User])],

  // Registro el servicio que se encargará de la lógica de usuarios
  providers: [UserService],

  // Expongo el controlador que responde a las rutas HTTP de /user
  controllers: [UserController],

  // Exporto el servicio para que lo pueda usar AuthService o TwoFactorAuthService
  exports: [UserService],
})
export class UserModule {}


