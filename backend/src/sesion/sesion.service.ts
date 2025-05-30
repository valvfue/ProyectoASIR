import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sesion } from './sesion.entity';

@Injectable()
export class SesionService {
  constructor(
    @InjectRepository(Sesion)
    private sesionRepository: Repository<Sesion>,
  ) {}

  async registrarSesion(username: string, ip: string): Promise<Sesion> {
    const sesion = this.sesionRepository.create({ username, ip });
    return this.sesionRepository.save(sesion);
  }
}
