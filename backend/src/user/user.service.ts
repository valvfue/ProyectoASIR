import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async updateEmail(userId: number, newEmail: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.email = newEmail;
    return this.userRepository.save(user);
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('La contraseña actual no es correcta');

    user.password = await bcrypt.hash(newPassword, 10);
    return this.userRepository.save(user);
  }

  async update2FA(
  userId: number,
  data: Partial<Pick<User, 'twoFactorSecret' | 'isTwoFactorEnabled'>>
): Promise<User> {
  const user = await this.findById(userId);
  if (!user) throw new NotFoundException('Usuario no encontrado');

  Object.assign(user, data);
  return this.userRepository.save(user);
}

}





