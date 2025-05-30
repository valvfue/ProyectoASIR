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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Req() req: Request,
  ) {
    const { username, password } = body;

    const ipAddress =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      'IP desconocida';

    const userAgent = req.headers['user-agent'] || 'Desconocido';

    return this.authService.login(username, password, ipAddress, userAgent);
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
}












