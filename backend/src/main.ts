// Archivo principal que arranca la aplicación NestJS.
// Aquí se inicia el servidor, se carga el módulo raíz y se habilita CORS.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Creo la aplicación Nest con el módulo raíz (AppModule)
  const app = await NestFactory.create(AppModule, { cors: true }); // Activo CORS para que el frontend pueda comunicarse

  // Arranco el servidor escuchando en el puerto 3000 y en todas las interfaces (0.0.0.0)
  await app.listen(3000, '0.0.0.0');
}

bootstrap(); // Llamo a la función para arrancar el backend


