"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    } else {
      router.push("/admin"); // Ou / dependendo do role (vamos mandar pro admin por enquanto)
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center uppercase tracking-widest font-playfair mb-6">
          Acesse sua conta
        </h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4"
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
      </div>
    </div>
  );
}
