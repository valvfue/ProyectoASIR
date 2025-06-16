'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  User,
  LogIn,
  LogOut,
  LifeBuoy,
  ShieldAlert,
  ServerCog,
  Server,
  Users,
  Menu,
} from 'lucide-react';

/* ---------- Helpers: leer payload del token ---------- */
function getTokenPayload() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  /* ---- Cargar datos del token al montar ---- */
  useEffect(() => {
    const load = () => {
      const payload = getTokenPayload();
      setUsername(payload?.username || null);
      setRole(payload?.role || null);
    };

    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  /* ---- Logout ---- */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setUsername(null);
    setRole(null);
    router.push('/login');
  };

  /* ---- Helper para enlaces ---- */
  const LinkBtn = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: any;
    label: string;
  }) => (
    <Link
      href={href}
      className="flex items-center space-x-1 hover:text-gray-200"
      onClick={() => setIsOpen(false)}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="bg-blue-700 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo / título ------------------------------------------------ */}
        <div className="text-lg font-bold">
          <Link href="/">
             <br />
          </Link>
        </div>

        {/* Botón hamburguesa móvil ------------------------------------ */}
        <button
          className="sm:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* ----------- Menú escritorio ----------- */}
        <div className="hidden sm:flex items-center space-x-6">
          {/* Inicio siempre visible */}
          <LinkBtn href="/" icon={Home} label="Inicio" />

          {username && (
            <>
              {/* Botones visibles a todos los logueados */}
              <LinkBtn href="/soporte" icon={LifeBuoy} label="Soporte" />
              <LinkBtn href="/profile" icon={User} label="Perfil" />

              {/* Botones solo admin */}
              {role === 'admin' && (
                <>
                  <LinkBtn
                    href="http://85.208.51.169:8080/index.php"
                    icon={ServerCog}
                    label="Zabbix"
                  />
                  <LinkBtn
                    href="http://85.208.51.169:8200"
                    icon={Server}
                    label="Duplicati"
                  />
                  <LinkBtn href="/audit" icon={ShieldAlert} label="Auditoría" />
                  <LinkBtn href="/usuarios" icon={Users} label="Usuarios" />
                </>
              )}
            </>
          )}

          {/* Login / Logout */}
          {username ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-gray-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Salir</span>
            </button>
          ) : (
            <LinkBtn href="/login" icon={LogIn} label="Iniciar sesión" />
          )}
        </div>
      </div>

      {/* ----------- Menú móvil ----------- */}
      {isOpen && (
        <div className="sm:hidden mt-4 space-y-3 bg-blue-600 px-4 py-3 rounded-md">
          <LinkBtn href="/" icon={Home} label="Inicio" />

          {username && (
            <>
              <LinkBtn href="/soporte" icon={LifeBuoy} label="Soporte" />
              <LinkBtn href="/profile" icon={User} label="Perfil" />

              {role === 'admin' && (
                <>
                  <LinkBtn
                    href="http://85.208.51.169:8080/index.php"
                    icon={ServerCog}
                    label="Zabbix"
                  />
                  <LinkBtn
                    href="http://85.208.51.169:8200"
                    icon={Server}
                    label="Duplicati"
                  />
                  <LinkBtn href="/audit" icon={ShieldAlert} label="Auditoría" />
                  <LinkBtn href="/usuarios" icon={Users} label="Usuarios" />
                </>
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
            <LinkBtn href="/login" icon={LogIn} label="Iniciar sesión" />
          )}
        </div>
      )}
    </nav>
  );
}



















