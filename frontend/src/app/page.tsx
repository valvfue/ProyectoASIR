'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <main>
      <section className="text-center py-12 bg-white shadow">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">VictorAlvarez S.L.</h1>
        <p className="text-lg text-gray-700">
          Innovación en la fabricación de componentes electrónicos para la industria global
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

      <section className="mt-8 flex justify-center">
        <Image
          src="/fabrica-electronica.jpg"
          alt="Instalaciones VictorAlvarez"
          width={800}
          height={400}
          className="rounded shadow-md object-cover"
        />
      </section>

      <section className="mt-12 px-6 sm:px-16 md:px-32 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">¿Quiénes somos?</h2>
        <p className="text-gray-700 text-md leading-relaxed">
          En <strong>VictorAlvarez</strong> nos dedicamos a diseñar y fabricar componentes electrónicos de alta precisión
          para sectores como la automoción, la industria médica y la tecnología aeroespacial.
          Nuestro compromiso con la calidad y la innovación nos ha convertido en un referente del sector en Europa.
        </p>
      </section>

      <section className="mt-12 px-6 sm:px-16 md:px-32 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">¿Qué hacemos?</h2>
        <p className="text-gray-700 text-md leading-relaxed mb-8">
          Contamos con líneas de producción automatizadas, laboratorios de control de calidad y un equipo humano altamente cualificado.
          Desarrollamos microcontroladores, placas base personalizadas, sensores inteligentes y otros componentes críticos
          para nuestros clientes en más de 20 países.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Image src="/produccion1.jpg" alt="Producción en cadena" width={400} height={250} className="rounded shadow" />
          <Image src="/laboratorio.jpg" alt="Laboratorio de pruebas" width={400} height={250} className="rounded shadow" />
          <Image src="/ingenieria.jpg" alt="Equipo de ingeniería" width={400} height={250} className="rounded shadow" />
        </div>
      </section>

      <section className="mt-16 px-6 sm:px-16 md:px-32 text-center mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Nuestros valores</h2>
        <ul className="text-gray-700 text-md space-y-2">
          <li>✅ Innovación constante</li>
          <li>✅ Compromiso con la sostenibilidad</li>
          <li>✅ Calidad certificada ISO 9001</li>
          <li>✅ Seguridad y bienestar laboral</li>
        </ul>
      </section>
    </main>
  );
}










