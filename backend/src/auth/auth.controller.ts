import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFAService: TwoFactorAuthService,
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string; code?: string },
    @Req() req: Request,
  ) {
    const { email, password, code } = body;

    const ipAddress =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      'IP desconocida';

    const userAgent = req.headers['user-agent'] || 'Desconocido';

    return this.authService.login(email, password, ipAddress, userAgent, code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('audit')
  async getAuditLogs() {
    return this.authService.getAllSessionLogs();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('audit')
  async clearAuditLogs() {
    return this.authService.clearSessionLogs();
  }

  // 🔒 2FA: Generar código y devolver el QR
  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async generateQRCode(@Req() req: any) {
    const userId = req.user.sub;
    return this.twoFAService.generateTwoFactorAuthSecret(userId);
  }

  // 🔒 2FA: Activar 2FA si el código TOTP es válido
  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  async enable2FA(@Req() req: any, @Body() body: { code: string }) {
    const userId = req.user.sub;
    return this.twoFAService.enableTwoFactor(userId, body.code);
  }

  // 🔒 2FA: Desactivar 2FA
  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  async disable2FA(@Req() req: any, @Body() body: { code: string }) {
    const userId = req.user.sub;
    return this.twoFAService.disableTwoFactor(userId, body.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/status')
  get2FAStatus(@Req() req: any) {
  return this.authService.get2FAStatus(req.user.sub);
  
  }

}















