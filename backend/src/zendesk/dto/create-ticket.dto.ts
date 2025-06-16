// DTO que define los campos que necesito para crear un ticket.
// Se envía desde el frontend al backend y luego a Zendesk.

export class CreateTicketDto {
  name: string;    // Nombre del solicitante
  email: string;   // Correo del solicitante
  subject: string; // Asunto del ticket
  message: string; // Descripción del problema
}


