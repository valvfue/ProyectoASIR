'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  /* ------------------ Login ------------------ */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    /* Siempre enviamos “email”; el backend acepta email o username */
    const payload: Record<string, string> = {
      email: email.trim(),          // ← campo correcto
      password,
    };
    if (show2FA) payload.code = code;

    const res = await fetch('http://85.208.51.169:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);

      window.dispatchEvent(new Event('storage'));
      router.push('/dashboard');
      return;
    }

    /* ---- Manejo de errores ---- */
    const { message } = await res.json();

    if (message?.includes('2FA') && !show2FA) {
      setShow2FA(true);
      setError('Este usuario tiene 2FA habilitado. Introduce el código.');
    } else if (message?.includes('Usuario no encontrado')) {
      setError('El correo / usuario no existe');
    } else if (message?.includes('Contraseña incorrecta')) {
      setError('Contraseña incorrecta');
    } else {
      setError(message || 'Error al iniciar sesión');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Correo o usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        {show2FA && (
          <input
            type="text"
            placeholder="Código 2FA"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Acceder
        </button>
      </form>
    </main>
  );
}








