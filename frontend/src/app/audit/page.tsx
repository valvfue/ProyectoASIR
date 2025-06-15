'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

/* ---------- Helpers ---------- */
const API_BASE =
  typeof window !== 'undefined' ? `${window.location.origin}` : ''; // https://victoralvarez.ddns.net

interface SessionLog {
  id: number;
  username: string;
  ipAddress: string;
  loginAt: string;
  userAgent: string;
}

function parseUserAgent(agent: string): string {
  let os = /Windows NT 10/.test(agent)
    ? 'Windows 10'
    : /Windows NT 11/.test(agent)
    ? 'Windows 11'
    : /Mac OS X/.test(agent)
    ? 'macOS'
    : /Android/.test(agent)
    ? 'Android'
    : /iPhone|iPad/.test(agent)
    ? 'iOS'
    : /Linux/.test(agent)
    ? 'Linux'
    : 'Desconocido';

  let browser = /Edg\//.test(agent)
    ? 'Edge'
    : /Chrome\/\d+/.test(agent) && !/Edg\//.test(agent)
    ? 'Chrome'
    : /Firefox\/\d+/.test(agent)
    ? 'Firefox'
    : /Safari\/\d+/.test(agent) && !/Chrome/.test(agent)
    ? 'Safari'
    : 'Desconocido';

  return `${os} + ${browser}`;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/auth/audit`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: SessionLog[] = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Error al obtener auditoría:', err);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm('¿Estás seguro de que deseas borrar todos los registros?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/auth/audit`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) await fetchAuditLogs();
      else console.error('No se pudo borrar la auditoría.');
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
            {loading ? 'Eliminando…' : 'Borrar registros'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold">Historial de inicios de sesión</h3>
          </div>

          <table className="w-full table-auto text-left border-t">
            <thead>
              <tr className="text-gray-700 border-b">
                <th className="py-2 px-3">Usuario</th>
                <th className="py-2 px-3">IP</th>
                <th className="py-2 px-3">Fecha y hora</th>
                <th className="py-2 px-3">SO / Navegador</th>
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





