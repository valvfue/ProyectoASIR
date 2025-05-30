'use client';

import { ServerCog, Cpu, MemoryStick, HardDrive } from "lucide-react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function VPSPage() {
    return (
        <ProtectedRoute>
            <main>
                <h2 className="text-3xl font-bold mb-6">Estado de la VPS</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                        <div className="flex items-center space-x-4">
                            <ServerCog className="w-8 h-8 text-blue-700" />
                            <h3 className="text-xl font-semibold">Información general</h3>
                        </div>
                        <ul className="mt-4 space-y-2 text-gray-700">
                            <li><strong>Proveedor:</strong> Contabo</li>
                            <li><strong>Plan:</strong> VPS S SSD</li>
                            <li><strong>CPU:</strong> 2 vCPU</li>
                            <li><strong>RAM:</strong> 4 GB</li>
                            <li><strong>Disco:</strong> 50 GB SSD</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                        <div className="flex items-center space-x-4">
                            <Cpu className="w-8 h-8 text-green-600" />
                            <h3 className="text-xl font-semibold">Rendimiento actual (simulado)</h3>
                        </div>
                        <ul className="mt-4 space-y-2 text-gray-700">
                            <li><MemoryStick className="inline w-5 h-5 mr-1 text-purple-600" /> Uso RAM: 1.5 GB / 4 GB</li>
                            <li><HardDrive className="inline w-5 h-5 mr-1 text-orange-600" /> Uso Disco: 20 GB / 50 GB</li>
                            <li><Cpu className="inline w-5 h-5 mr-1 text-blue-600" /> Uso CPU: 30%</li>
                        </ul>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}


