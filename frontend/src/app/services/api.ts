const BACKEND_URL = "http://192.168.1.70:3001/";

export async function getStatus(): Promise<string> {
  try {
    const res = await fetch(BACKEND_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error("Backend no disponible");
    return "Activo";
  } catch {
    return "No disponible";
  }
}

export async function getZabbixVersion(): Promise<string> {
  try {
    const res = await fetch(`${BACKEND_URL}zabbix/version`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Zabbix no disponible");
    const data = await res.json();
    return `Versión ${data.version}`;
  } catch {
    return "No disponible";
  }
}

export async function enviarTicketSoporte(datos: {
  name: string;
  email: string;
  subject: string;
  message: string;
  department: string; // ✅ Añadido aquí
}) {
  const res = await fetch(`${BACKEND_URL}zendesk/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  if (!res.ok) {
    throw new Error("Error al enviar el ticket");
  }

  return res.json();
}




