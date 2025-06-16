import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UseGuards,
  Delete,
} from '@nestjs/common';

// Importo el servicio de autenticación y el de doble factor
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TwoFactorAuthService } from './two-factor-auth.service';

// Este controlador se encarga de la ruta /auth
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFAService: TwoFactorAuthService,
  ) {}

  // Registro de nuevos usuarios
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // Login con correo, contraseña
  @Post('login')
  async login(
    @Body() body: { email: string; password: string; code?: string },
    @Req() req: Request,
  ) {
    const { email, password, code } = body;

    // Aquí sacamos la IP real del usuario
    const ipAddress =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      'IP desconocida';

    // También saca el navegador/SO que está usando
    const userAgent = req.headers['user-agent'] || 'Desconocido';

    // Paso todo eso al servicio de login
    return this.authService.login(email, password, ipAddress, userAgent, code);
  }

  // Ruta protegida para ver el historial de sesiones (solo si tienes token JWT)
  @UseGuards(JwtAuthGuard)
  @Get('audit')
  async getAuditLogs() {
    return this.authService.getAllSessionLogs();
  }

  // Borrar los logs de sesiones
  @UseGuards(JwtAuthGuard)
  @Delete('audit')
  async clearAuditLogs() {
    return this.authService.clearSessionLogs();
  }

  // Ruta para generar el QR de Google Authenticator y configurar 2FA
  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async generateQRCode(@Req() req: any) {
    const userId = req.user.sub;
    return this.twoFAService.generateTwoFactorAuthSecret(userId);
  }

  // Activar 2FA si introduces el código correcto
  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  async enable2FA(@Req() req: any, @Body() body: { code: string }) {
    const userId = req.user.sub;
    return this.twoFAService.enableTwoFactor(userId, body.code);
  }

  // Desactivar el 2FA (se pide el código por seguridad)
  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  async disable2FA(@Req() req: any, @Body() body: { code: string }) {
    const userId = req.user.sub;
    return this.twoFAService.disableTwoFactor(userId, body.code);
  }

  // Saber si el 2FA está activado o no para un usuario concreto
  @UseGuards(JwtAuthGuard)
  @Get('2fa/status')
  get2FAStatus(@Req() req: any) {
    return this.authService.get2FAStatus(req.user.sub);
  }
}
















