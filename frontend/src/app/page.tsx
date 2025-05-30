"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="text-center py-20">
      {isLoggedIn ? (
        <>
          <h1 className="text-4xl font-bold mb-4">Bienvenido al Panel</h1>
          <p className="text-lg text-gray-700">
            Ya has iniciado sesión. Puedes navegar por el panel desde el menú superior.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4">Bienvenido al Panel</h1>
          <p className="text-lg text-gray-700 mb-6">
            Accede al sistema para consultar datos del servidor y monitorización.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </>
      )}
    </main>
  );
}






