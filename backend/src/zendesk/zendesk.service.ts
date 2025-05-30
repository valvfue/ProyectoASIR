import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class ZendeskService {
  async createTicket(dto: CreateTicketDto): Promise<any> {
    const { name, email, subject, message } = dto;

    try {
      const response = await axios.post(
        'https://iescuravalera.zendesk.com/api/v2/requests.json',
        {
          request: {
            requester: {
              name,
              email
            },
            subject,
            comment: {
              body: message
            }
          }
        },
        {
          auth: {
            username: 'support@iescuravalera.zendesk.com/NoWZJAzPGnTiAA3PqNNObuRL8rX6gfzn6Bmy77tO',
            password: 'NoWZJAzPGnTiAA3PqNNObuRL8rX6gfzn6Bmy77tO'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creando ticket en Zendesk:', error);
      throw error;
    }
  }
}

