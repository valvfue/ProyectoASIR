"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <main>
      {/* Cabecera */}
      <section className="text-center py-12 bg-white shadow">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Proyecto ASIR</h1>
        <p className="text-lg text-gray-700">
          El panel de administración que necesitas para monitorización, backups y soporte
        </p>
        {!isLoggedIn && (
          <button
            onClick={handleLoginRedirect}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        )}
      </section>

      {/* Imagen representativa */}
      <section className="mt-8 flex justify-center">
        <Image
          src="/fabrica.jpg"
          alt="Centro de operaciones"
          width={800}
          height={400}
          className="rounded shadow-md"
        />
      </section>

      {/* Aplicaciones principales */}
      <section className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">Herramientas destacadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <Image src="/zabbix.png" alt="Zabbix" width={80} height={80} className="mx-auto mb-2" />
            <h3 className="font-bold text-lg">Monitorización avanzada</h3>
          </div>
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <Image src="/zendesk.png" alt="Zendesk" width={80} height={80} className="mx-auto mb-2" />
            <h3 className="font-bold text-lg">Soporte de tickets</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <Image src="/login.png" alt="Usuarios" width={80} height={80} className="mx-auto mb-2" />
            <h3 className="font-bold text-lg">Acceso seguro con el doble factor de autenticación</h3>
          </div>
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <Image
              src="/duplicati.png"
              alt="Duplicati"
              width={80}
              height={80}
              className="mx-auto mb-2 object-contain w-20 h-20"
            />
            <h3 className="font-bold text-lg">Duplicati</h3>
            <p className="text-sm text-gray-600">Copias de seguridad automáticas</p>
          </div>
        </div>
      </section>
    </main>
  );
}







