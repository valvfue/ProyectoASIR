// Controlador de usuarios: aquí expongo las rutas para consultar,
// crear y actualizar usuarios. Todas las rutas están protegidas por JWT
// y algunas además por rol 'admin'.

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

// Todas las rutas cuelgan de /user
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* ───────────── LISTAR USUARIOS (solo admin) ───────────── */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')          // Restringido a admins
  @Get()
  findAll() {
    // Devuelvo la lista completa de usuarios (sin contraseñas)
    return this.userService.findAll();
  }

  /* ───────────── CREAR USUARIO (solo admin) ───────────── */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')          // Solo un admin puede crear nuevos usuarios
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  /* ───────────── ELIMINAR USUARIO (solo admin) ───────────── */
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  /* ───────────── ACTUALIZAR EMAIL PROPIO ───────────── */
  @UseGuards(JwtAuthGuard)
  @Patch('email')
  updateEmail(@Body() dto: UpdateEmailDto, @Request() req: any) {
    // El propio usuario (req.user.sub) cambia su correo
    return this.userService.updateEmail(req.user.sub, dto.newEmail);
  }

  /* ───────────── CAMBIAR CONTRASEÑA PROPIA ───────────── */
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(@Body() dto: UpdatePasswordDto, @Request() req: any) {
    // Para cambiar la contraseña pido la actual y la nueva
    return this.userService.updatePassword(
      req.user.sub,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}





