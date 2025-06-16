'use client';

import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { enviarTicketSoporte } from '../services/api';

export default function SoportePage() {
  // Estados para los campos del formulario
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  // Al enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Obtenemos el nombre y el correo guardados en localStorage
    const name = localStorage.getItem('username') || '';
    const email = localStorage.getItem('email') || '';

    // Si por alguna razón no están disponibles, se muestra un error
    if (!name || !email) {
      setError('No se pudo obtener el usuario autenticado. Vuelve a iniciar sesión.');
      return;
    }

    try {
      // Llamamos al servicio que envía el ticket al backend
      await enviarTicketSoporte({
        name,
        email,
        subject: asunto,
        message: mensaje,
      });

      // Si todo va bien, se limpian los campos y se muestra mensaje de éxito
      setEnviado(true);
      setAsunto('');
      setMensaje('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al enviar el ticket. Intenta nuevamente.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Enviar solicitud de soporte</h1>

        {enviado && (
          <p className="text-green-600 mb-4">¡Ticket enviado correctamente!</p>
        )}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Asunto"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
            className="w-full border p-2"
          />
          <textarea
            placeholder="Describe tu problema"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            className="w-full border p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Enviar
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}












