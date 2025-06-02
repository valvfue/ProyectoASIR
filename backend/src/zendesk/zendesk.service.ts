import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class ZendeskService {
  async createTicket(dto: CreateTicketDto): Promise<any> {
    const { name, email, subject, message, department } = dto;

    try {
      const response = await axios.post(
        'https://iescuravalera.zendesk.com/api/v2/requests.json',
        {
          request: {
            requester: {
              name,
              email,
            },
            subject,
            comment: {
              body: message,
            },
            custom_fields: [
              {
                id: 20330974771356,      // ID del campo personalizado Departamento
                value: department,       // Valor enviado desde el frontend (tag como 'logística', 'it', etc.)
              },
            ],
          },
        },
        {
          auth: {
            username: 'support@iescuravalera.zendesk.com/token',
            password: 'NoWZJAzPGnTiAA3PqNNObuRL8rX6gfzn6Bmy77tO',
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error creando ticket en Zendesk:', error.response?.data || error.message);
      throw error;
    }
  }
}


