// Este archivo define el decorador @Roles() que se usa en los controladores
// para decir qué roles pueden acceder a una ruta concreta.

import { SetMetadata } from '@nestjs/common';

// Defino la clave que se usará para guardar los roles
export const ROLES_KEY = 'roles';

// Esta función permite aplicar varios roles a una ruta usando @Roles('admin', 'user', ...)
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
