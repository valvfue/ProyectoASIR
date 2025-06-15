'use client';

export default function UnauthorizedPage() {
  return (
    <main className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">No autorizado</h1>
      <p className="text-lg">
        No tienes permisos para acceder a esta página.
      </p>
    </main>
  );
}
