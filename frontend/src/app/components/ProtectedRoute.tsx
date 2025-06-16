'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

/* -------------------------------------------------------------------
   ProtectedRoute: comprueba si existe un token JWT en localStorage.
   Si no lo encuentra, redirige al login. De lo contrario, renderiza
   los children. Esto evita que páginas privadas sean visibles sin
   autenticación.
-------------------------------------------------------------------- */
export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // Controla el renderizado

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // No hay token → envío al login
      router.push('/login');
    } else {
      // Hay token → marco que puedo renderizar
      setIsClient(true);
    }
  }, [router]);

  // Mientras se comprueba el token, no muestro nada
  if (!isClient) return null;

  // Token válido → renderizo el contenido protegido
  return <>{children}</>;
}



