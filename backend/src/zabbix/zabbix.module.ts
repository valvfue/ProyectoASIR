// src/zabbix/zabbix.module.ts
import { Module } from '@nestjs/common';
import { ZabbixApiService } from './zabbix-api.service';
import { ZabbixController } from './zabbix.controller';

@Module({
  controllers: [ZabbixController],
  providers: [ZabbixApiService],
})
export class ZabbixModule {}

