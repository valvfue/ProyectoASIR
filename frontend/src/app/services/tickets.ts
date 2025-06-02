const BACKEND_URL = "http://192.168.1.70:3001"; // o usa env si lo prefieres

// Obtener todos los tickets del usuario autenticado
export async function obtenerMisTickets(email: string, token: string) {
  const res = await fetch(`${BACKEND_URL}/zendesk/tickets?email=${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener tickets");
  return res.json();
}

// Obtener detalles de un ticket por ID
export async function obtenerDetalleTicket(id: number, token: string) {
  const res = await fetch(`${BACKEND_URL}/zendesk/tickets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener detalle del ticket");
  return res.json();
}

// Añadir un comentario a un ticket
export async function responderTicket(id: number, comentario: string, token: string) {
  const res = await fetch(`${BACKEND_URL}/zendesk/tickets/${id}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment: comentario }),
  });
  if (!res.ok) throw new Error("Error al responder el ticket");
  return res.json();
}
