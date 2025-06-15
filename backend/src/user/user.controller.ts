import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Request,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('email')
  updateEmail(@Body() dto: UpdateEmailDto, @Request() req: any) {
    return this.userService.updateEmail(req.user.sub, dto.newEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(@Body() dto: UpdatePasswordDto, @Request() req: any) {
    return this.userService.updatePassword(
      req.user.sub,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}




