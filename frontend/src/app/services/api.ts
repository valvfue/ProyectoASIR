const BACKEND_URL = 'https://victoralvarez.ddns.net/';

export async function enviarTicketSoporte(datos: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const res = await fetch(`${BACKEND_URL}zendesk/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!res.ok) {
    throw new Error('Error al enviar el ticket');
  }

  return res.json();
}






