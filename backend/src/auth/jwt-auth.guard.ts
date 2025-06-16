// Se encarga de proteger las rutas usando JWT.
// Básicamente, dice que usaremos la estrategia 'jwt' para validar el token.

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Hago que Nest use la estrategia 'jwt' cuando se use este guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
