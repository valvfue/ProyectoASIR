import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './sesion.entity';
import { SesionService } from './sesion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sesion])],
  providers: [SesionService],
  exports: [SesionService],
})
export class SesionModule {}
