import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ZabbixApiService {
  private readonly apiUrl = 'http://192.168.1.70:8080/api_jsonrpc.php';
  private readonly token = '7dab888f8010db948f85a193399c287a49c8ed592dca9c506c641cbb3355b32f';
  private readonly logger = new Logger(ZabbixApiService.name);

  async getZabbixVersion(): Promise<string> {
    try {
      const response = await axios.post<{ result: string }>(
        this.apiUrl,
        {
          jsonrpc: '2.0',
          method: 'apiinfo.version',
          params: {},
          id: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.result;
    } catch (error) {
      this.logger.error('Error al obtener versión de Zabbix', error.response?.data || error.message);
      throw new Error('No se pudo obtener la versión de Zabbix');
    }
  }

  async getHostStatus(): Promise<any[]> {
    try {
      const response = await axios.post<{ result: any[] }>(
        this.apiUrl,
        {
          jsonrpc: '2.0',
          method: 'host.get',
          params: {
            output: ['hostid', 'host', 'name', 'status'],
            selectInterfaces: ['interfaceid', 'ip'],
          },
          id: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      return response.data.result;
    } catch (error) {
      this.logger.error('Error al obtener hosts', error.response?.data || error.message);
      return [];
    }
  }

  async getHostMetrics(hostId: string): Promise<any[]> {
    try {
      const response = await axios.post<{ result: any[] }>(
        this.apiUrl,
        {
          jsonrpc: '2.0',
          method: 'item.get',
          params: {
            output: ['itemid', 'name', 'key_', 'lastvalue'],
            hostids: hostId,
            filter: {
              key_: [
                'system.cpu.util[,user]',
                'system.cpu.util[,idle]',
                'vm.memory.size[available]',
                'vm.memory.size[pavailable]',
                'vfs.fs.size[/,used]',
                'vfs.fs.size[/,total]',
                'vfs.fs.size[/,pused]',
                'net.if.in["enp0s3"]'
              ],
            },
            sortfield: 'name',
          },
          id: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      return response.data.result;
    } catch (error) {
      this.logger.error(`Error al obtener métricas del host ${hostId}`, error.response?.data || error.message);
      return [];
    }
  }
}































