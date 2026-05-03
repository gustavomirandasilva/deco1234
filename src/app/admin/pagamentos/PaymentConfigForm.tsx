"use client";

import { useState } from "react";
import { z } from "zod";

const paymentConfigSchema = z.object({
  gatewayAtivo: z.enum(["PAGSEGURO", "STRIPE", "MERCADOPAGO"]),
  pagseguroEmail: z.string().email("Email inválido").nullable().optional(),
  pagseguroToken: z.string().min(1, "Token obrigatório").nullable().optional(),
  stripeSecretKey: z.string().nullable().optional(),
  stripePublicKey: z.string().nullable().optional(),
  mercadopagoKey: z.string().nullable().optional(),
}).refine((data) => {
  if (data.gatewayAtivo === "PAGSEGURO") {
    return data.pagseguroEmail && data.pagseguroToken;
  }
  if (data.gatewayAtivo === "STRIPE") {
    return data.stripeSecretKey && data.stripePublicKey;
  }
  if (data.gatewayAtivo === "MERCADOPAGO") {
    return data.mercadopagoKey;
  }
  return true;
}, {
  message: "Campos obrigatórios não preenchidos para o gateway selecionado",
  path: ["gatewayAtivo"],
});

interface PaymentConfig {
  id?: string;
  gatewayAtivo: string;
  pagseguroEmail?: string | null;
  pagseguroToken?: string | null;
  stripeSecretKey?: string | null;
  stripePublicKey?: string | null;
  mercadopagoKey?: string | null;
}

interface PaymentConfigFormProps {
  initialConfig: PaymentConfig | null;
}

export default function PaymentConfigForm({ initialConfig }: PaymentConfigFormProps) {
  const [config, setConfig] = useState<PaymentConfig>(initialConfig || {
    gatewayAtivo: "PAGSEGURO",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const validatedData = paymentConfigSchema.parse(config);

      const response = await fetch("/api/payment-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        setMessage("Configuração salva com sucesso!");
      } else {
        const error = await response.json();
        setMessage(error.error || "Erro ao salvar");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        setMessage("Corrija os erros no formulário");
      } else {
        setMessage("Erro de validação");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Gateway Ativo</label>
        <select
          value={config.gatewayAtivo}
          onChange={(e) => setConfig({ ...config, gatewayAtivo: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="PAGSEGURO">PagSeguro</option>
          <option value="STRIPE">Stripe</option>
          <option value="MERCADOPAGO">Mercado Pago</option>
        </select>
        {errors.gatewayAtivo && <p className="text-red-600 text-sm mt-1">{errors.gatewayAtivo}</p>}
      </div>

      {config.gatewayAtivo === "PAGSEGURO" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Email PagSeguro</label>
            <input
              type="email"
              value={config.pagseguroEmail || ""}
              onChange={(e) => setConfig({ ...config, pagseguroEmail: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {errors.pagseguroEmail && <p className="text-red-600 text-sm mt-1">{errors.pagseguroEmail}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Token PagSeguro</label>
            <input
              type="password"
              value={config.pagseguroToken || ""}
              onChange={(e) => setConfig({ ...config, pagseguroToken: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {errors.pagseguroToken && <p className="text-red-600 text-sm mt-1">{errors.pagseguroToken}</p>}
          </div>
        </>
      )}

      {config.gatewayAtivo === "STRIPE" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Stripe Secret Key</label>
            <input
              type="password"
              value={config.stripeSecretKey || ""}
              onChange={(e) => setConfig({ ...config, stripeSecretKey: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {errors.stripeSecretKey && <p className="text-red-600 text-sm mt-1">{errors.stripeSecretKey}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stripe Public Key</label>
            <input
              type="text"
              value={config.stripePublicKey || ""}
              onChange={(e) => setConfig({ ...config, stripePublicKey: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {errors.stripePublicKey && <p className="text-red-600 text-sm mt-1">{errors.stripePublicKey}</p>}
          </div>
        </>
      )}

      {config.gatewayAtivo === "MERCADOPAGO" && (
        <div>
          <label className="block text-sm font-medium mb-2">Mercado Pago Key</label>
          <input
            type="password"
            value={config.mercadopagoKey || ""}
            onChange={(e) => setConfig({ ...config, mercadopagoKey: e.target.value })}
            className="w-full p-2 border rounded"
          />
          {errors.mercadopagoKey && <p className="text-red-600 text-sm mt-1">{errors.mercadopagoKey}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Salvar Configuração"}
      </button>

      {message && (
        <p className={`text-sm ${message.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}