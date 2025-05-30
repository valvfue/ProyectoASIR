import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionLog } from './entities/session-log.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(SessionLog)
    private readonly sessionLogRepository: Repository<SessionLog>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async login(
    username: string,
    password: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    await this.sessionLogRepository.save({
      userId: user.id,
      username: user.username,
      ipAddress,
      userAgent,
      loginAt: new Date(),
    });

    return { access_token: token };
  }

  async getAllSessionLogs(): Promise<SessionLog[]> {
    return this.sessionLogRepository.find({
      order: { loginAt: 'DESC' },
    });
  }

  async clearSessionLogs(): Promise<{ message: string }> {
    await this.sessionLogRepository.clear();
    return { message: 'Todos los registros de sesión han sido eliminados' };
  }
}











