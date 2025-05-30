import { Controller, Get, Query } from '@nestjs/common';
import { ZabbixApiService } from './zabbix-api.service';

@Controller('zabbix')
export class ZabbixController {
  constructor(private readonly zabbixApiService: ZabbixApiService) {}

  @Get('version')
  async getZabbixVersion() {
    const version = await this.zabbixApiService.getZabbixVersion();
    return { version };
  }

  @Get('hosts')
  async getHostStatus() {
    const hosts = await this.zabbixApiService.getHostStatus();
    return { hosts };
  }

  @Get('metrics')
  async getHostMetrics(@Query('hostid') hostid: string) {
    if (!hostid) {
      return { error: 'El parámetro hostid es obligatorio' };
    }

    const metrics = await this.zabbixApiService.getHostMetrics(hostid);
    return { metrics };
  }
}













