import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'El backend está desplegado usando Docker con NestJS.',
      status: 'Activo',
      port: 3001,
      updatedAt: new Date().toISOString(),
    };
  }
}



