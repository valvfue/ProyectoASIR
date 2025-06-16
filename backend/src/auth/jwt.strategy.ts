// Define cómo se valida el token JWT cuando llega una petición.
// Es la "estrategia" que usa Passport para comprobar si el token es válido.

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
// Indico que esta clase usa la estrategia JWT de Passport
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      // Indico de dónde sacar el token: del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // El token debe tener una fecha de expiración
      ignoreExpiration: false,

      // Clave secreta para validar la firma del token
      secretOrKey: 'jwtSecretKey',
    });
  }

  // Esta función se llama si el token es válido. Aquí cargo al usuario.
  async validate(payload: any): Promise<User | null> {
    // Compruebo que el payload tenga el ID del usuario
    if (!payload.sub || typeof payload.sub !== 'number') {
      return null;
    }

    // Busco al usuario en base de datos
    const user = await this.userService.findById(payload.sub);

    // Si no existe, devuelvo null (fallo de autenticación)
    if (!user) {
      return null;
    }

    // Devuelvo el usuario para que se pueda usar en los controladores
    return user;
  }
}


