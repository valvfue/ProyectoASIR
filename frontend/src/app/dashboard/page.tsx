'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStatus, getZabbixVersion } from '../services/api';
import { Server, ServerCog, Monitor } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [backendStatus, setBackendStatus] = useState('');
  const [zabbixVersion, setZabbixVersion] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // 🔐 Si no hay token, no entra
      return;
    }

    // Cargar estados
    getStatus().then((s) => setBackendStatus(s));
    getZabbixVersion().then((v) => setZabbixVersion(v));
  }, [router]);

  return (
    <main>
      <h2 className="text-3xl font-bold mb-6">Panel principal</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <div className="flex items-center space-x-4">
            <Server className="w-10 h-10 text-blue-600" />
            <h3 className="text-xl font-semibold">Backend</h3>
          </div>
          <p className="mt-4 text-lg">Estado: <strong>{backendStatus || '...'}</strong></p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <div className="flex items-center space-x-4">
            <ServerCog className="w-10 h-10 text-green-600" />
            <h3 className="text-xl font-semibold">VPS</h3>
          </div>
          <p className="mt-4 text-lg">Conexión correcta (simulado)</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          <div className="flex items-center space-x-4">
            <Monitor className="w-10 h-10 text-purple-600" />
            <h3 className="text-xl font-semibold">Zabbix</h3>
          </div>
          <p className="mt-4 text-lg">Estado: <strong>{zabbixVersion || '...'}</strong></p>
        </div>
      </div>
    </main>
  );
}
