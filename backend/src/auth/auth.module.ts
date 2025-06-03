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
import { TwoFactorAuthService } from './two-factor-auth.service'; // ✅ Añadir esto

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'jwtSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([SessionLog]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    TwoFactorAuthService, // ✅ Registrar el servicio aquí
  ],
})
export class AuthModule {}





