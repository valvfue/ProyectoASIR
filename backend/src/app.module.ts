// Módulo raíz del backend: aquí importo todos los módulos necesarios,
// configuro la conexión a la base de datos MariaDB y registro controladores y servicios globales.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ZendeskModule } from './zendesk/zendesk.module';

import { User } from './user/user.entity';
import { SessionLog } from './auth/entities/session-log.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Conexión a MariaDB del contenedor mariadb_auth
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mariadb_auth',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'usuarios_db',
      entities: [User, SessionLog], // Entidades que usa TypeORM
      synchronize: true,
    }),

    // Registro de entidades
    TypeOrmModule.forFeature([User, SessionLog]),

    // Registro de módulos personalizados del proyecto
    UserModule,
    AuthModule,
    ZendeskModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
























