'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface ChartCardProps {
  title: string;
  labels: string[];
  data: number[];
  color?: string;
}

export default function ChartCard({ title, labels, data, color = 'rgba(54, 162, 235, 0.6)' }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: color,
              borderColor: color,
              fill: false,
              tension: 0.2,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}

