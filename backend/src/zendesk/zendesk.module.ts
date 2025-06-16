// Módulo Zendesk: agrupo el controlador y el servicio que
// se encargan de integrar la API oficial de Zendesk con mi backend.

import { Module } from '@nestjs/common';
import { ZendeskController } from './zendesk.controller';
import { ZendeskService } from './zendesk.service';

@Module({
  controllers: [ZendeskController], // Expone la ruta /zendesk/tickets
  providers: [ZendeskService],      // Lógica que llama a la API de Zendesk
})
export class ZendeskModule {}

