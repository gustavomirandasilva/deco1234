export default function Contato() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh]">
      <h1 className="text-3xl font-bold font-playfair uppercase tracking-widest mb-8 text-center">Fale Conosco</h1>
      <div className="prose max-w-none text-gray-700">
        {/* AQUI VOCÊ COLOCA SEUS DADOS DE CONTATO */}
        <p>
          Entre em contato conosco através dos canais abaixo:
        </p>
        <ul>
          <li><strong>WhatsApp:</strong> (11) 99999-9999</li>
          <li><strong>E-mail:</strong> contato@decoimports.com.br</li>
          <li><strong>Endereço:</strong> Rua Exemplo, 123 - São Paulo, SP</li>
        </ul>
        <p>
          [ESPAÇO RESERVADO PARA MAIS INFORMAÇÕES DE CONTATO]
        </p>
      </div>
    </div>
  );
}
