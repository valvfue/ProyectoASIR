'use client';

import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { enviarTicketSoporte } from '../services/api';

export default function SoportePage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enviarTicketSoporte({
        name: nombre,
        email: correo,
        subject: asunto,
        message: mensaje,
      });
      setEnviado(true);
      setNombre('');
      setCorreo('');
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

        {enviado && <p className="text-green-600 mb-4">¡Ticket enviado correctamente!</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tu usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border p-2"
          />
          <input
            type="email"
            placeholder="Tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full border p-2"
          />
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






