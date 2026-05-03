"use client";

import { useState } from "react";
import Link from "next/link";
import { FiLock, FiCheckCircle } from "react-icons/fi";

export default function CheckoutClient() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Aqui seria a chamada para /api/checkout
    // Por enquanto, simula
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3); // Tela de Sucesso
    }, 2000);
  };

  if (step === 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50">
        <FiCheckCircle className="h-20 w-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold font-playfair uppercase tracking-widest mb-2 text-center">
          Pedido Confirmado!
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Sua compra foi processada com sucesso via PagSeguro. Você receberá um e-mail com os detalhes do envio.
        </p>
        <Link href="/" className="bg-black text-white px-8 py-3 uppercase tracking-widest font-bold text-sm hover:bg-gray-800 transition-colors">
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-playfair uppercase tracking-widest mb-8 text-center">
        Finalizar Compra
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Lado Esquerdo - Formulários */}
        <div className="md:col-span-2 space-y-6">

          {/* Endereço de Entrega */}
          <div className={`border p-6 rounded-xl ${step === 1 ? 'border-black bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}`}>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">1. Entrega</h2>
            {step === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">CEP</label>
                    <input required type="text" className="w-full border p-2 rounded focus:ring-black focus:border-black" placeholder="00000-000" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Número</label>
                    <input required type="text" className="w-full border p-2 rounded focus:ring-black focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Rua / Avenida</label>
                  <input required type="text" className="w-full border p-2 rounded focus:ring-black focus:border-black" />
                </div>
                <button type="submit" className="bg-black text-white px-6 py-2 uppercase text-sm font-bold mt-4 hover:bg-gray-800">
                  Continuar para Pagamento
                </button>
              </form>
            ) : (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Rua Exemplo, 123 - São Paulo, SP</span>
                <button onClick={() => setStep(1)} className="text-black font-bold underline">Editar</button>
              </div>
            )}
          </div>

          {/* Pagamento (PagSeguro Simulado) */}
          <div className={`border p-6 rounded-xl ${step === 2 ? 'border-black bg-white shadow-sm' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wide">2. Pagamento</h2>
              <FiLock className="text-green-600" />
            </div>

            {step === 2 && (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6 text-sm text-blue-800">
                  Transação 100% segura criptografada pelo <strong>PagSeguro</strong>.
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Número do Cartão</label>
                  <input required type="text" className="w-full border p-2 rounded focus:ring-black focus:border-black" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Validade</label>
                    <input required type="text" className="w-full border p-2 rounded focus:ring-black focus:border-black" placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cód. Segurança (CVV)</label>
                    <input required type="text" className="w-full border p-2 rounded focus:ring-black focus:border-black" placeholder="123" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nome no Cartão</label>
                  <input required type="text" className="w-full border p-2 rounded focus:ring-black focus:border-black" placeholder="NOME IMPRESSO" />
                </div>

                <button type="submit" disabled={isProcessing} className="w-full bg-green-600 text-white px-6 py-4 uppercase text-sm font-bold mt-4 hover:bg-green-700 disabled:opacity-50">
                  {isProcessing ? "Processando Pagamento..." : "Finalizar Compra"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Lado Direito - Resumo do Pedido */}
        <div className="bg-gray-50 border p-6 rounded-xl h-fit">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wide border-b pb-4">Resumo do Pedido</h2>

          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">R$ 599,00</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-600">Frete (SEDEX)</span>
            <span className="font-medium">R$ 35,90</span>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-bold uppercase tracking-widest text-lg">Total</span>
            <span className="font-bold text-xl">R$ 634,90</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">em até 6x de R$ 105,81 s/ juros</p>
        </div>

      </div>
    </div>
  );
}