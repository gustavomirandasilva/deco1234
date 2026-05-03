export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh]">
      <h1 className="text-3xl font-bold font-playfair uppercase tracking-widest mb-8 text-center">Dúvidas Frequentes</h1>
      <div className="prose max-w-none text-gray-700">
        {/* AQUI VOCÊ COLOCA AS PERGUNTAS FREQUENTES */}
        <h3>1. Os perfumes são originais?</h3>
        <p>Sim, todos os nossos produtos são 100% originais e lacrados.</p>
        
        <h3>2. Qual o prazo de entrega?</h3>
        <p>O prazo varia de acordo com o seu CEP. Você pode simular na página do produto.</p>

        <p>
          [ESPAÇO RESERVADO PARA ADICIONAR MAIS PERGUNTAS]
        </p>
      </div>
    </div>
  );
}
