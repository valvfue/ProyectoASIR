// Este servicio se encarga de todo lo relacionado con el 2FA (doble autenticación)
// Usa la librería otplib para generar/verificar códigos y qrcode para crear el QR.

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly userService: UserService) {}

  // ───────────── 1. Generar secret + QR ─────────────
  async generateTwoFactorAuthSecret(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Genero un secret aleatorio para este usuario
    const secret = authenticator.generateSecret();

    // Genero una URL compatible con apps como Google Authenticator
    const otpAuthUrl = authenticator.keyuri(user.email, 'Proyecto ASIR', secret);

    // Genero un QR que se pueda escanear desde el móvil
    const qrCodeDataUrl = await qrcode.toDataURL(otpAuthUrl);

    // Guardo el secret en la base de datos, pero sin activar todavía el 2FA
    await this.userService.update2FA(userId, {
      twoFactorSecret: secret,
      isTwoFactorEnabled: false,
    });

    return { qrCodeDataUrl, otpAuthUrl }; // Devuelvo QR y URL por si hace falta
  }

  // ───────────── 2. Activar 2FA (verificando el código escaneado) ─────────────
  async enableTwoFactor(userId: number, code: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA no está configurado para este usuario');
    }

    // Verifico que el código introducido sea válido
    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      throw new BadRequestException('Código 2FA inválido');
    }

    // Activo el 2FA en la base de datos
    await this.userService.update2FA(userId, { isTwoFactorEnabled: true });

    return { message: '2FA activado correctamente' };
  }

  // ───────────── 3. Desactivar 2FA (también requiere código) ─────────────
  async disableTwoFactor(userId: number, code: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA no está configurado para este usuario');
    }

    // Valido el código TOTP antes de desactivar
    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      throw new BadRequestException('Código 2FA inválido');
    }

    // Desactivo el 2FA y borro el secret
    await this.userService.update2FA(userId, {
      isTwoFactorEnabled: false,
      twoFactorSecret: null as any, 
    });

    return { message: '2FA desactivado correctamente' };
  }
}




