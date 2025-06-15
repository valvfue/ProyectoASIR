'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Server,
  ServerCog,
  Menu,
  User,
  LogOut,
  LogIn,
  ShieldAlert,
  LifeBuoy,
  LayoutDashboard,
  Users,
} from 'lucide-react';

/* ---------- Helpers ---------- */
function decodeJWT(token?: string | null) {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen]   = useState(false);
  const [username, setUser]   = useState<string | null>(null);
  const [role, setRole]       = useState<string | null>(null);
  const router = useRouter();

  /* -------- Cargar usuario desde localStorage -------- */
  useEffect(() => {
    const load = () => {
      const token = localStorage.getItem('token');
      const payload = decodeJWT(token);
      setUser(payload?.username ?? null);
      setRole(payload?.role ?? null);
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  /* -------- Logout -------- */
  const handleLogout = () => {
    localStorage.clear();                // 💥  Vacía todo
    setUser(null);
    setRole(null);
    router.replace('/login');            // navega
    router.refresh();                    // fuerza recarga de la página
  };

  /* -------- UI -------- */
  return (
    <nav className="bg-blue-700 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">
          <Link href="/">
            <span>
              Proyecto <br /> ASIR
            </span>
          </Link>
        </div>

        {/* Botón hamburguesa */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-white focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* -------- Menú escritorio -------- */}
        <div className="hidden sm:flex items-center space-x-6">
          {!username && (
            <Link href="/" className="flex items-center space-x-1 hover:text-gray-200">
              <Home className="h-5 w-5" />
              <span>Inicio</span>
            </Link>
          )}

          {username && (
            <>
              <Link href="/dashboard" className="flex items-center space-x-1 hover:text-gray-200">
                <LayoutDashboard className="h-5 w-5" />
                <span>Panel</span>
              </Link>
              <Link href="/backend" className="flex items-center space-x-1 hover:text-gray-200">
                <Server className="h-5 w-5" />
                <span>Backend</span>
              </Link>
              <Link href="/zabbix" className="flex items-center space-x-1 hover:text-gray-200">
                <ServerCog className="h-5 w-5" />
                <span>Zabbix</span>
              </Link>
              <Link href="/soporte" className="flex items-center space-x-1 hover:text-gray-200">
                <LifeBuoy className="h-5 w-5" />
                <span>Soporte</span>
              </Link>
              <Link href="/audit" className="flex items-center space-x-1 hover:text-gray-200">
                <ShieldAlert className="h-5 w-5" />
                <span>Auditoría</span>
              </Link>
              <Link href="/profile" className="flex items-center space-x-1 hover:text-gray-200">
                <User className="h-5 w-5" />
                <span>Perfil</span>
              </Link>

              {role === 'admin' && (
                <Link href="/usuarios" className="flex items-center space-x-1 hover:text-gray-200">
                  <Users className="h-5 w-5" />
                  <span>Usuarios</span>
                </Link>
              )}
            </>
          )}

          {username ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-gray-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </button>
          ) : (
            <Link href="/login" className="flex items-center space-x-1 hover:text-gray-200">
              <LogIn className="h-5 w-5" />
              <span>Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>

      {/* -------- Menú móvil -------- */}
      {isOpen && (
        <div className="sm:hidden mt-4 space-y-3 bg-blue-600 px-4 py-3 rounded-md">
          {/* …(el bloque móvil es idéntico al de escritorio, omito por brevedad)… */}
          {username ? (
            <button onClick={handleLogout} className="flex items-center space-x-2 hover:text-gray-200">
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </button>
          ) : (
            <Link href="/login" className="flex items-center space-x-2 hover:text-gray-200">
              <LogIn className="h-5 w-5" />
              <span>Iniciar sesión</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
















