"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, cpf, phone, cep, address, newsletter }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocorreu um erro ao criar a conta.");
        setIsLoading(false);
        return;
      }

      // Autologin após cadastro
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Falha na conexão.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center uppercase tracking-widest font-playfair mb-6">
          Criar Conta
        </h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors" placeholder="Maria Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input required type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors" placeholder="000.000.000-00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
              <input required type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors" placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input required type="text" value={cep} onChange={(e) => setCep(e.target.value)} className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors" placeholder="00000-000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors" placeholder="Rua, Número, Bairro" />
            </div>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-3 focus:ring-black focus:border-black transition-colors" placeholder="Crie uma senha forte" />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="newsletter" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="rounded text-black focus:ring-black" />
            <label htmlFor="newsletter" className="text-sm text-gray-600">Aceito receber informações sobre novidades e promoções.</label>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-black text-white font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 mt-6">
            {isLoading ? "Criando..." : "Criar Conta"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-bold text-black hover:underline">
            Faça Login
          </Link>
        </div>
      </div>
    </div>
  );
}
