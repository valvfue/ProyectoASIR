import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class ZendeskService {
  async createTicket(dto: CreateTicketDto): Promise<any> {
    const { name, email, subject, message } = dto;

    try {
      const response = await axios.post(
        'https://victoralvarez.zendesk.com/api/v2/requests.json',
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
            
          },
        },
        {
          auth: {
            username: 'support@victoralvarez.zendesk.com/token',
            password: 'qM1oKCJ7iwz9n15sNmuTbjQI58b25w5nsx1I2V5j',
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



