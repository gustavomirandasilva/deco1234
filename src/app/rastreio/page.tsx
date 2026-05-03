"use client";

export default function Rastreio() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh] flex flex-col items-center">
      <h1 className="text-3xl font-bold font-playfair uppercase tracking-widest mb-4 text-center">Rastreie seu Pedido</h1>
      <p className="text-gray-600 mb-8 text-center">Digite o código de rastreio recebido por e-mail para acompanhar a entrega.</p>
      
      <div className="w-full max-w-md flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input 
          type="text" 
          placeholder="Ex: AA123456789BR" 
          className="flex-1 border p-3 rounded focus:ring-black focus:border-black"
        />
        <button 
          onClick={() => alert("Funcionalidade de rastreio em desenvolvimento.")}
          className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Rastrear
        </button>
      </div>
    </div>
  );
}
