'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Server,
  Monitor,
  ServerCog,
  Menu,
  User,
  LogOut,
  LogIn,
  ShieldAlert,
  LifeBuoy,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("username");
      setUsername(token && user ? user : null);
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setUsername(null);
    router.push('/login');
  };

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

        <div className="sm:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Menú de escritorio */}
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
              <Link href="/vps" className="flex items-center space-x-1 hover:text-gray-200">
                <Monitor className="h-5 w-5" />
                <span>VPS</span>
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
            </>
          )}

          {username ? (
            <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-gray-200">
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

      {/* Menú móvil */}
      {isOpen && (
        <div className="sm:hidden mt-4 space-y-3 bg-blue-600 px-4 py-3 rounded-md">
          {!username && (
            <Link href="/" className="flex items-center space-x-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>
              <Home className="h-5 w-5" />
              <span>Inicio</span>
            </Link>
          )}

          {username && (
            <>
              <Link href="/dashboard" className="flex items-center space-x-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>
                <LayoutDashboard className="h-5 w-5" />
                <span>Panel</span>
              </Link>
              <Link href="/backend" className="flex items-center space-x-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>
                <Server className="h-5 w-5" />
                <span>Backend</span>
              </Link>
              <Link href="/vps" className="flex items-center space-x-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>
                <Monitor className="h-5 w-5" />
                <span>VPS</span>
              </Link>
              <Link href="/zabbix" className="flex items-center space-x-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>
                <ServerCog className="h-5 w-5" />
                <span>Zabbix</span>
              </Link>
              <Link href="/soporte" className="flex items-center space-x-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>
                <LifeBuoy className="h-5 w-5" />
                <span>Soporte</span>
              </Link>
              <Link href="/audit" className="flex items-center space-x-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>
                <ShieldAlert className="h-5 w-5" />
                <span>Auditoría</span>
              </Link>
              <Link href="/perfil" className="flex items-center space-x-2 hover:text-gray-200" onClick={() => setIsOpen(false)}>
                <User className="h-5 w-5" />
                <span>Perfil</span>
              </Link>
            </>
          )}

          {username ? (
            <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-gray-200">
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













