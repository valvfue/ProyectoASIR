// Sirve para proteger rutas según el rol del usuario (por ejemplo, solo admin).
// Funciona junto al decorador @Roles() que se aplica en los controladores.

import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Esta función se ejecuta cada vez que se accede a una ruta protegida
  canActivate(context: ExecutionContext): boolean {
    // Obtengo los roles necesarios desde el decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // Si la ruta no tiene roles definidos, dejo pasar
    if (!requiredRoles) return true;

    // Saco el usuario desde el request (ya ha pasado el JwtAuthGuard antes)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Compruebo si el rol del usuario está en la lista de roles permitidos
    return requiredRoles.includes(user.role);
  }
}

