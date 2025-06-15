'use client';

import { useEffect, useState } from 'react';
import { FaServer } from 'react-icons/fa';
import { MdOutlineDevices } from 'react-icons/md';
import ProtectedRoute from '../components/ProtectedRoute';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Host {
  hostid: string;
  host: string;
  name: string;
  status: string;
  interfaces: { ip: string }[];
}

interface Metric {
  itemid: string;
  name: string;
  key_: string;
  lastvalue: string;
}

export default function ZabbixPage() {
  const [zabbixVersion, setZabbixVersion] = useState('');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [activeHostId, setActiveHostId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const versionRes = await fetch('http://85.208.51.169:3001/zabbix/version');
      const versionData = await versionRes.json();
      setZabbixVersion(versionData.version);

      const hostsRes = await fetch('http://85.208.51.169:3001/zabbix/hosts');
      const hostsData = await hostsRes.json();
      setHosts(hostsData.hosts);

      const active = hostsData.hosts.find((h: Host) => h.status === '0');
      if (active) {
        setActiveHostId(active.hostid);

        const metricsRes = await fetch(`http://85.208.51.169:3001/zabbix/metrics?hostid=${active.hostid}`);
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.metrics);
      }
    } catch (err) {
      console.error('Error al cargar datos de Zabbix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatMetric = (metric: Metric) => {
    const value = parseFloat(metric.lastvalue);
    if (metric.key_.includes('memory.size[available]')) {
      return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
    } else if (metric.key_.includes('memory.size[pavailable]')) {
      return `${value.toFixed(1)} %`;
    } else if (metric.key_.includes('cpu.util[,user]') || metric.key_.includes('cpu.util[,idle]')) {
      return `${value.toFixed(2)} %`;
    } else if (metric.key_.includes('net.if.in')) {
      return `${(value / 1024).toFixed(2)} KB/s`;
    }
    return metric.lastvalue;
  };

  const getMetricValue = (key_: string): number =>
    parseFloat(metrics.find((m) => m.key_ === key_)?.lastvalue || '0');

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Monitorización - Zabbix</h1>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        <div className="bg-white shadow-md rounded p-6 mb-8 border">
          <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2 mb-2">
            <MdOutlineDevices /> Estado general
          </h2>
          <p>
            El sistema se encuentra actualmente monitorizado mediante Zabbix{' '}
            <span className="font-semibold">{zabbixVersion || 'Cargando...'}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hosts.map((host) => (
            <div
              key={host.hostid}
              className={`p-4 border rounded shadow ${
                host.status === '0' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <FaServer /> {host.name}
              </h3>
              <p className="text-sm">IP: {host.interfaces[0]?.ip}</p>
              <p className={`text-sm ${host.status === '0' ? 'text-green-600' : 'text-red-600'}`}>
                Estado: {host.status === '0' ? 'Activo' : 'Inactivo'}
              </p>

              {activeHostId === host.hostid && metrics.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Métricas:</h4>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {metrics.map((metric) => (
                      <li key={metric.itemid}>
                        {metric.name}: <strong>{formatMetric(metric)}</strong>
                      </li>
                    ))}
                  </ul>

                  {/* Gráficas */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2">Gráfico de CPU</h4>
                    <Line
                      data={{
                        labels: ['CPU idle', 'CPU user'],
                        datasets: [
                          {
                            label: 'Uso CPU (%)',
                            data: [
                              getMetricValue('system.cpu.util[,idle]'),
                              getMetricValue('system.cpu.util[,user]'),
                            ],
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.2)',
                          },
                        ],
                      }}
                    />
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2">Gráfico de Memoria</h4>
                    <Line
                      data={{
                        labels: ['Disponible (%)', 'Usada (%)'],
                        datasets: [
                          {
                            label: 'Memoria (%)',
                            data: [
                              getMetricValue('vm.memory.size[pavailable]'),
                              100 - getMetricValue('vm.memory.size[pavailable]'),
                            ],
                            borderColor: 'rgba(153,102,255,1)',
                            backgroundColor: 'rgba(153,102,255,0.2)',
                          },
                        ],
                      }}
                    />
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2">Gráfico de Red</h4>
                    <Line
                      data={{
                        labels: ['Entrada'],
                        datasets: [
                          {
                            label: 'Tráfico de red (KB/s)',
                            data: [getMetricValue('net.if.in["enp0s3"]') / 1024],
                            borderColor: 'rgba(255,159,64,1)',
                            backgroundColor: 'rgba(255,159,64,0.2)',
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}




















