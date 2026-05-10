"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDb = error.message?.includes("DATABASE_URL");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-2 text-xl font-semibold text-gray-900">Não foi possível carregar</h1>
      <p className="mb-6 text-sm text-gray-600">
        {isDb
          ? "O site não consegue conectar ao banco. Na Vercel, adicione DATABASE_URL (URI do pooler Supabase, porta 6543). Depois rode prisma db push se o schema mudou. Teste em /api/health."
          : error.message || "Ocorreu um erro no servidor."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Tentar novamente
      </button>
    </div>
  );
}
