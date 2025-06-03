import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly userService: UserService) {}

  // Generar secreto y QR
  async generateTwoFactorAuthSecret(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, 'Proyecto ASIR', secret);
    const qrCodeDataUrl = await qrcode.toDataURL(otpAuthUrl);

    await this.userService.update2FA(userId, {
      twoFactorSecret: secret,
      isTwoFactorEnabled: false,
    });

    return { qrCodeDataUrl, otpAuthUrl };
  }

  // Activar 2FA (requiere código correcto)
  async enableTwoFactor(userId: number, code: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA no está configurado para este usuario');
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      throw new BadRequestException('Código 2FA inválido');
    }

    await this.userService.update2FA(userId, { isTwoFactorEnabled: true });

    return { message: '2FA activado correctamente' };
  }

  // Desactivar 2FA (requiere código correcto)
  async disableTwoFactor(userId: number, code: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA no está configurado para este usuario');
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      throw new BadRequestException('Código 2FA inválido');
    }

    await this.userService.update2FA(userId, {
      isTwoFactorEnabled: false,
      twoFactorSecret: null as any, // ⬅️ cast temporal si TS da problema con null
    });

    return { message: '2FA desactivado correctamente' };
  }
}



