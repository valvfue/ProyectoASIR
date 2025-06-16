// Este módulo agrupa todo lo relacionado con la autenticación:
// servicios, controladores, entidades, guards y configuración de JWT.

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { SessionLog } from './entities/session-log.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
  imports: [
    // Passport es necesario para usar estrategias como JWT
    PassportModule,

    // Configuración básica del módulo JWT: clave secreta y duración
    JwtModule.register({
      secret: 'jwtSecretKey', 
      signOptions: { expiresIn: '1h' }, // Tokens válidos durante 1 hora
    }),

    // Registro de la entidad SessionLog para auditoría
    TypeOrmModule.forFeature([SessionLog]),

    // Importo el módulo de usuario para poder usarlo desde AuthService
    UserModule,
  ],
  controllers: [AuthController], // Controlador que expone las rutas de /auth
  providers: [
    AuthService,             // Lógica principal del login/registro
    JwtStrategy,             // Estrategia para validar tokens
    JwtAuthGuard,            // Guard para proteger rutas con JWT
    TwoFactorAuthService,    // Lógica para 2FA (activar, desactivar, QR)
  ],
})
export class AuthModule {}






