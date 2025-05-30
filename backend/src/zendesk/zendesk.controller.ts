import { Body, Controller, Post } from '@nestjs/common';
import { ZendeskService } from './zendesk.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('zendesk')
export class ZendeskController {
  constructor(private readonly zendeskService: ZendeskService) {}

  @Post('tickets')
  createTicket(@Body() dto: CreateTicketDto) {
    return this.zendeskService.createTicket(dto);
  }
}

