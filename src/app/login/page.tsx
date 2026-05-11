"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou senha inválidos.");
      setIsLoading(false);
      return;
    }

    router.refresh();
    const session = await getSession();
    const role = (session?.user as { role?: string })?.role;

    if (role === "ADMIN") {
      const dest =
        callbackUrl && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/produtos";
      router.push(dest);
      router.refresh();
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    if (callbackUrl.startsWith("/admin")) {
      setError(
        "Esta conta não é administrador. Cadastros normais ficam como cliente (USER). Para gerenciar produtos, promova seu e-mail a ADMIN no banco (Supabase → SQL Editor) ou rode: npm run admin:promote seu@email.com com DATABASE_URL do projeto.",
      );
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center font-playfair text-2xl font-bold uppercase tracking-widest">
          Acesse sua conta
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-center text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 transition-colors focus:border-black focus:ring-black"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Senha</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 transition-colors focus:border-black focus:ring-black"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-black py-3 font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="font-bold text-black hover:underline">
            Cadastre-se
          </Link>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left text-xs leading-relaxed text-gray-600">
          <p className="mb-1 font-semibold text-gray-800">Painel admin (produtos)</p>
          <p className="mb-2">
            Só usuários com papel <strong>ADMIN</strong> no banco acessam{" "}
            <code className="rounded bg-white px-1">/admin</code>. Quem se cadastra em{" "}
            <strong>Cadastre-se</strong> vira cliente (USER).
          </p>
          <p className="mb-2">
            Depois do login como admin:{" "}
            <Link href="/admin/produtos" className="font-medium text-black underline">
              /admin/produtos
            </Link>
          </p>
          <p className="text-gray-500">
            Na Vercel, configure <strong>NEXTAUTH_URL</strong> ={" "}
            <code className="rounded bg-white px-1">https://deco1234-deys.vercel.app</code> e um{" "}
            <strong>NEXTAUTH_SECRET</strong> fixo (Settings → Environment Variables).
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Carregando…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
