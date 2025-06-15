import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role'],
      order: { id: 'ASC' },
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto): Promise<User> {
    if (await this.findByUsername(dto.username))
      throw new ConflictException('Nombre de usuario ya existe');
    if (await this.findByEmail(dto.email))
      throw new ConflictException('Email ya registrado');

    const user: Partial<User> = {
      username: dto.username,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      role: dto.role ?? ('user' as UserRole),
    };

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const res = await this.userRepository.delete(id);
    if (!res.affected) throw new NotFoundException('Usuario no encontrado');
    return { message: 'Usuario eliminado' };
  }

  async updateEmail(id: number, newEmail: string): Promise<User> {
    const existingUser = await this.findByEmail(newEmail);
    if (existingUser && existingUser.id !== id) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.email = newEmail;
    return this.userRepository.save(user);
  }

  async updatePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      throw new BadRequestException('La contraseña actual no es correcta');

    user.password = await bcrypt.hash(newPassword, 10);
    return this.userRepository.save(user);
  }

  async update2FA(
    id: number,
    data: Partial<Pick<User, 'twoFactorSecret' | 'isTwoFactorEnabled'>>,
  ): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    Object.assign(user, data);
    return this.userRepository.save(user);
  }
}









