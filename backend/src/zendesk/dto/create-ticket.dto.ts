export class CreateTicketDto {
  name: string;
  email: string;
  subject: string;
  message: string;
  department: string; // 👈 nuevo campo
}

