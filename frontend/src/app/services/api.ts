// URL base del backend, donde se encuentran los endpoints (pasa por Nginx)
const BACKEND_URL = 'https://victoralvarez.ddns.net/';

/* ================================================================
   Función para enviar un nuevo ticket de soporte al backend.
   Se utiliza en el formulario de contacto en la web.
================================================================ */
export async function enviarTicketSoporte(datos: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  // Llamada al endpoint del backend que gestiona los tickets Zendesk
  const res = await fetch(`${BACKEND_URL}zendesk/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos), // Enviamos los datos como JSON
  });

  // Si hay un error en la respuesta, lanzamos una excepción
  if (!res.ok) {
    throw new Error('Error al enviar el ticket');
  }

  // Si todo va bien, devolvemos el JSON de respuesta
  return res.json();
}







