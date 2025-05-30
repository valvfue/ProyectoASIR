'use client';

import { useEffect, useState } from "react";
import { Server, RefreshCw } from "lucide-react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function BackendPage() {
    const [backendStatus, setBackendStatus] = useState<{
        message: string;
        status: string;
        port: number;
        updatedAt: string;
    } | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('http://192.168.1.70:3001/');
                const data = await res.json();
                setBackendStatus(data);
            } catch (error) {
                console.error('Error al obtener el estado del backend:', error);
            }
        };

        fetchStatus();
    }, []);

    return (
        <ProtectedRoute>
            <main>
                <h2 className="text-3xl font-bold mb-6">API Backend</h2>

                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex items-center space-x-4">
                        <Server className="w-8 h-8 text-green-600" />
                        <h3 className="text-xl font-semibold">Estado del servicio</h3>
                    </div>
                    <p className="mt-4 text-gray-700">
                        {backendStatus?.message || 'Cargando estado del backend...'}
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-700">
                        <li>
                            <RefreshCw className="inline w-5 h-5 mr-1 text-blue-600" />
                            Estado: {backendStatus?.status ?? 'Desconocido'}
                        </li>
                        <li>
                            <RefreshCw className="inline w-5 h-5 mr-1 text-blue-600" />
                            Puerto expuesto: {backendStatus?.port ?? '...'}
                        </li>
                        <li>
                            <RefreshCw className="inline w-5 h-5 mr-1 text-blue-600" />
                            Última actualización: {backendStatus?.updatedAt ? new Date(backendStatus.updatedAt).toLocaleString() : '...'}
                        </li>
                    </ul>
                </div>
            </main>
        </ProtectedRoute>
    );
}




