// Este controlador se encarga de exponer la ruta /zendesk/tickets,
// que se usa desde el frontend para enviar tickets al soporte.

import { Body, Controller, Post } from '@nestjs/common';
import { ZendeskService } from './zendesk.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('zendesk')
export class ZendeskController {
  constructor(private readonly zendeskService: ZendeskService) {}

  // ───────────── POST /zendesk/tickets ─────────────
  @Post('tickets')
  createTicket(@Body() dto: CreateTicketDto) {
    // Llamo al servicio que se conecta con la API de Zendesk
    return this.zendeskService.createTicket(dto);
  }
}


