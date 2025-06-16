import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionLog } from './entities/session-log.entity';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,          // CRUD de usuarios
    private readonly jwtService: JwtService,            // Firma de tokens
    @InjectRepository(SessionLog)
    private readonly sessionLogRepository: Repository<SessionLog>, // Auditoría
  ) {}

  // Creo usuarios nuevos cifrando la contraseña con bcrypt.
  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Todos los nuevos registros entran con rol 'user' por defecto.
    return this.userService.create({
      ...createUserDto,
      password: hashedPassword,
      role: 'user',
    });
  }

  // Valido user + pass (+ 2FA) y devuelvo un JWT. También registro la sesión.
  async login(
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string,
    code?: string, // Código TOTP si el 2FA está activado
  ) {
    // 1) Compruebo que el usuario exista
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    // 2) Verifico la contraseña en base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales incorrectas');

    // 3) Si tiene 2FA activo, valido el código TOTP
    if (user.isTwoFactorEnabled) {
      if (!code) throw new BadRequestException('Código 2FA requerido');

      const isCodeValid = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret!,
      });
      if (!isCodeValid) throw new BadRequestException('Código 2FA inválido');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    // 4) Guardo la sesión en la tabla SessionLog para la auditoría
    await this.sessionLogRepository.save({
      userId: user.id,
      username: user.username,
      ipAddress,
      userAgent,
      loginAt: new Date(),
    });

    // 5) Devuelvo el token y datos básicos del usuario
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Devuelvo todos los accesos ordenados del más reciente al más antiguo.
  async getAllSessionLogs(): Promise<SessionLog[]> {
    return this.sessionLogRepository.find({
      order: { loginAt: 'DESC' },
    });
  }

  // Elimino todos los registros (solo para admins).
  async clearSessionLogs(): Promise<{ message: string }> {
    await this.sessionLogRepository.clear();
    return { message: 'Todos los registros de sesión han sido eliminados' };
  }

  // Devuelvo si el usuario tiene 2FA activado (lo usa el frontend para mostrar estado).
  async get2FAStatus(userId: number) {
    const user = await this.userService.findById(userId);
    return { enabled: user?.isTwoFactorEnabled || false };
  }
}
















