'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import axios from 'axios';

/* --------- Extrae el payload del JWT --------- */
function getTokenPayload() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload)); // { sub, username, email, role, ... }
  } catch {
    return null;
  }
}

export default function PerfilPage() {
  const router = useRouter();

  /* ----------------- State ----------------- */
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');

  /* Cambiar correo */
  const [newEmail, setNewEmail] = useState('');
  const [emailMsg, setEmailMsg] = useState('');

  /* Cambiar contraseña */
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [passwordMsg,     setPasswordMsg]     = useState('');

  /* 2FA */
  const [qrCodeUrl,     setQrCodeUrl]     = useState('');
  const [code,          setCode]          = useState('');
  const [is2FAEnabled,  setIs2FAEnabled]  = useState(false);
  const [message2FA,    setMessage2FA]    = useState('');

  /* ------------- Cargar datos al montar ------------- */
  useEffect(() => {
    const load = () => {
      const payload = getTokenPayload();
      if (!payload) {
        router.replace('/login');
        return;
      }
      setUsername(payload.username);
      // Fallback: primero localStorage, si no existe uso payload.email
      setEmail(localStorage.getItem('email') || payload.email || '');
      check2FAStatus();
    };

    load();
    window.addEventListener('storage', load);    // Sincroniza con otras pestañas
    return () => window.removeEventListener('storage', load);
  }, [router]);

  /* ------------- Comprobar estado 2FA ------------- */
  const check2FAStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get<{ enabled: boolean }>(
        'https://victoralvarez.ddns.net/auth/2fa/status',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIs2FAEnabled(data.enabled);
    } catch {
      setMessage2FA('Error al comprobar el estado del 2FA');
    }
  };

  /* ------------- Cambiar correo ------------- */
  const handleEmailUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailMsg('');
    try {
      const res = await fetch('https://victoralvarez.ddns.net/user/email', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ newEmail }),
      });

      if (res.ok) {
        localStorage.setItem('email', newEmail);
        setEmail(newEmail);
        setNewEmail('');
        setEmailMsg('Correo actualizado correctamente.');
      } else {
        const data = await res.json();
        setEmailMsg(data.message || 'Error al actualizar el correo.');
      }
    } catch {
      setEmailMsg('Error de red al actualizar el correo.');
    }
  };

  /* ------------- Cambiar contraseña ------------- */
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMsg('');
    try {
      const res = await fetch('https://victoralvarez.ddns.net/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setPasswordMsg('Contraseña actualizada correctamente.');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await res.json();
        setPasswordMsg(data.message || 'Error al actualizar la contraseña.');
      }
    } catch {
      setPasswordMsg('Error de red al actualizar la contraseña.');
    }
  };

  /* ------------- 2FA: Generar QR ------------- */
  const generateQRCode = async () => {
    setMessage2FA('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get<{ qrCodeDataUrl: string }>(
        'https://victoralvarez.ddns.net/auth/2fa/generate',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setQrCodeUrl(data.qrCodeDataUrl);
    } catch {
      setMessage2FA('Error al generar el código QR');
    }
  };

  /* ------------- 2FA: Activar ------------- */
  const enable2FA = async () => {
    setMessage2FA('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://victoralvarez.ddns.net/auth/2fa/enable',
        { code },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIs2FAEnabled(true);
      setQrCodeUrl('');
      setCode('');
      setMessage2FA('2FA activado correctamente');
    } catch (err: any) {
      setMessage2FA(err.response?.data?.message || 'Error al activar el 2FA');
    }
  };

  /* ------------- 2FA: Desactivar ------------- */
  const disable2FA = async () => {
    setMessage2FA('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://victoralvarez.ddns.net/auth/2fa/disable',
        { code },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIs2FAEnabled(false);
      setQrCodeUrl('');
      setCode('');
      setMessage2FA('2FA desactivado correctamente');
    } catch (err: any) {
      setMessage2FA(err.response?.data?.message || 'Error al desactivar el 2FA');
    }
  };

  /* ------------- Render ------------- */
  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>

        {/* Datos básicos */}
        <div>
          <p><strong>Nombre de usuario:</strong> {username}</p>
          <p><strong>Correo electrónico:</strong> {email}</p>
        </div>

        {/* Formulario: cambiar correo */}
        <form onSubmit={handleEmailUpdate} className="space-y-3">
          <h3 className="text-lg font-semibold">Actualizar correo</h3>
          <input
            type="email"
            placeholder="Nuevo correo"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border p-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Cambiar correo
          </button>
          {emailMsg && <p className="text-sm text-gray-600">{emailMsg}</p>}
        </form>

        {/* Formulario: cambiar contraseña */}
        <form onSubmit={handlePasswordUpdate} className="space-y-3">
          <h3 className="text-lg font-semibold">Actualizar contraseña</h3>
          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-2"
            required
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Cambiar contraseña
          </button>
          {passwordMsg && <p className="text-sm text-gray-600">{passwordMsg}</p>}
        </form>

        {/* Gestión 2FA */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Autenticación en dos factores (2FA)</h3>

          {is2FAEnabled ? (
            /* ---- 2FA activado ---- */
            <div>
              <p className="text-green-700 font-semibold">✅ 2FA está activado</p>
              <input
                type="text"
                placeholder="Introduce el código actual para desactivar"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border p-2 mt-2"
              />
              <button
                onClick={disable2FA}
                className="bg-red-600 text-white px-4 py-2 rounded mt-2"
              >
                Desactivar 2FA
              </button>
            </div>
          ) : (
            /* ---- 2FA desactivado ---- */
            <div>
              {!qrCodeUrl ? (
                <button
                  onClick={generateQRCode}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Generar código QR
                </button>
              ) : (
                <div>
                  <p>Escanea este código con Google Authenticator:</p>
                  <img src={qrCodeUrl} alt="Código QR 2FA" className="my-4" />
                  <input
                    type="text"
                    placeholder="Introduce el código"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full border p-2"
                  />
                  <button
                    onClick={enable2FA}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                  >
                    Activar 2FA
                  </button>
                </div>
              )}
            </div>
          )}

          {message2FA && <p className="text-sm text-gray-600">{message2FA}</p>}
        </div>
      </div>
    </ProtectedRoute>
  );
}













