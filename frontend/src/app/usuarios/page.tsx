'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';

// Decodifica el token guardado en localStorage para extraer datos como el rol
function getTokenData() {
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

const API_BASE =
  typeof window !== 'undefined' ? window.location.origin : '';

// Tipado de usuarios
type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export default function UsuariosPage() {
  const router = useRouter();
  const tokenData = getTokenData();
  const isAdmin = tokenData?.role === 'admin'; // Solo el rol admin puede acceder

  // Estados: usuarios, formulario de nuevo usuario, mensajes, etc.
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Si no es admin, redirige
  useEffect(() => {
    if (!isAdmin) router.replace('/unauthorized');
  }, [isAdmin, router]);

  // Obtiene todos los usuarios desde el backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data: User[] = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Llama a fetchUsers solo si es admin
  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  // Envía el formulario de creación de usuario
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg('✅ Usuario creado');
        setForm({ username: '', email: '', password: '' });
        fetchUsers();
      } else {
        const data = await res.json();
        setMsg(data.message || 'Error al crear usuario');
      }
    } catch {
      setMsg('Error de red al crear usuario');
    }
  };

  // Elimina un usuario (si no es admin)
  const deleteUser = async (id: number) => {
    if (!confirm('¿Eliminar usuario?')) return;

    try {
      const res = await fetch(`${API_BASE}/user/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) fetchUsers();
      else console.error('Error al eliminar');
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  // Si no es admin, no se renderiza nada
  if (!isAdmin) return null;

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto mt-8 space-y-8">
        <h2 className="text-3xl font-bold">Gestión de usuarios</h2>

        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2 text-center">{u.id}</td>
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 text-center">{u.role}</td>
                  <td className="p-2 text-center">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 className="inline w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="bg-white shadow p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Crear nuevo usuario
          </h3>

          <form
            onSubmit={createUser}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {(['username', 'email', 'password'] as const).map((f) => (
              <input
                key={f}
                type={f === 'password' ? 'password' : 'text'}
                placeholder={f}
                value={form[f]}
                onChange={(e) =>
                  setForm({ ...form, [f]: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
            ))}
            <button className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-3">
              Crear
            </button>
          </form>

          {msg && <p className="mt-4">{msg}</p>}
        </div>
      </main>
    </ProtectedRoute>
  );
}




