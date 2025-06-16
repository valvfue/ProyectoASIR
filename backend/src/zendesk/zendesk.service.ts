// Este servicio se conecta con la API de Zendesk para crear tickets.
// Recibe los datos desde el frontend y los envía a Zendesk usando Axios.

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class ZendeskService {
  // ───────────── Crear un nuevo ticket ─────────────
  async createTicket(dto: CreateTicketDto): Promise<any> {
    const { name, email, subject, message } = dto;

    try {
      // Envío una petición POST a la API de Zendesk para crear el ticket
      const response = await axios.post(
        'https://victoralvarez.zendesk.com/api/v2/requests.json',
        {
          request: {
            requester: {
              name,     // Nombre del usuario que envía el ticket
              email,    // Correo del usuario
            },
            subject,    // Asunto del ticket
            comment: {
              body: message, // Cuerpo del mensaje
            },
          },
        },
        {
          auth: {
            // Autenticación usando un token de Zendesk
            username: 'support@victoralvarez.zendesk.com/token',
            password: 'qM1oKCJ7iwz9n15sNmuTbjQI58b25w5nsx1I2V5j',
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data; // Devuelvo la respuesta de Zendesk
    } catch (error) {
      // Si algo va mal, lo muestro por consola
      console.error('Error creando ticket en Zendesk:', error.response?.data || error.message);
      throw error;
    }
  }
}




