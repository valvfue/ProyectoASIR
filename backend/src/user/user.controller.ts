import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('email')
  async updateEmail(@Body() dto: UpdateEmailDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.userService.updateEmail(userId, dto.newEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(@Body() dto: UpdatePasswordDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.userService.updatePassword(userId, dto.currentPassword, dto.newPassword);
  }
}


