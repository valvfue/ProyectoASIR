'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

interface SessionLog {
  id: number;
  username: string;
  ipAddress: string;
  loginAt: string;
  userAgent: string;
}

// 👉 Función para simplificar el userAgent
function parseUserAgent(agent: string): string {
  let os = 'Desconocido';
  let browser = 'Desconocido';

  if (/Windows NT 10.0/.test(agent)) os = 'Windows 10';
  else if (/Windows NT 11.0/.test(agent)) os = 'Windows 11';
  else if (/Mac OS X/.test(agent)) os = 'macOS';
  else if (/Android/.test(agent)) os = 'Android';
  else if (/iPhone|iPad/.test(agent)) os = 'iOS';
  else if (/Linux/.test(agent)) os = 'Linux';

  if (/Chrome\/\d+/.test(agent) && !/Edge|Edg\//.test(agent)) browser = 'Chrome';
  else if (/Firefox\/\d+/.test(agent)) browser = 'Firefox';
  else if (/Safari\/\d+/.test(agent) && !/Chrome/.test(agent)) browser = 'Safari';
  else if (/Edg\/\d+/.test(agent)) browser = 'Edge';

  return `${os} + ${browser}`;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://192.168.1.70:3001/auth/audit', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Error al obtener auditoría:', err);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleClearLogs = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas borrar todos los registros?');
    if (!confirmed) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://192.168.1.70:3001/auth/audit', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        console.log('Registros eliminados.');
        await fetchAuditLogs(); // refrescar la tabla
      } else {
        console.error('No se pudo borrar la auditoría.');
      }
    } catch (err) {
      console.error('Error al borrar auditoría:', err);
    }

    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <main>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Auditoría de Sesiones</h2>
          <button
            onClick={handleClearLogs}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
            disabled={loading}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            {loading ? 'Eliminando...' : 'Borrar registros'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold">Historial de inicios de sesión</h3>
          </div>

          <table className="w-full table-auto text-left mt-4 border-t">
            <thead>
              <tr className="text-gray-700 border-b">
                <th className="py-2 px-3">Usuario</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">Fecha y hora</th>
                <th className="py-2 px-3">Sistema Operativo / Navegador</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-3">{log.username}</td>
                  <td className="py-2 px-3">{log.ipAddress}</td>
                  <td className="py-2 px-3">
                    {new Date(log.loginAt).toLocaleString('es-ES')}
                  </td>
                  <td className="py-2 px-3">{parseUserAgent(log.userAgent)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {logs.length === 0 && (
            <p className="mt-4 text-gray-500">No hay registros disponibles.</p>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}



