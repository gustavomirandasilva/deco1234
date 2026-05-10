import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { SiShopee } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold uppercase tracking-widest">
              Deco Imports
            </span>
          </div>
          <p className="text-sm text-gray-400">
            A sua loja de perfumes importados exclusivos. Luxo Oriental e Grandes Grifes selecionadas para você.
          </p>
        </div>

        {/* Links Rápidos */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wider">Links Rápidos</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
            <li><Link href="/categoria/luxo-oriental" className="hover:text-white transition-colors">Luxo Oriental</Link></li>
            <li><Link href="/categoria/grandes-grifes" className="hover:text-white transition-colors">Grandes Grifes</Link></li>
            <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
          </ul>
        </div>

        {/* Atendimento */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wider">Atendimento</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">Dúvidas Frequentes</Link></li>
            <li><Link href="/trocas" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
            <li><Link href="/rastreio" className="hover:text-white transition-colors">Rastreie seu Pedido</Link></li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase tracking-wider">Siga-nos</h3>
          {/* AQUI VOCÊ COLOCA OS LINKS PARA SUAS REDES SOCIAIS (substitua o href="#") */}
          <div className="flex space-x-4">
            <a href="#" target="_blank" rel="noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Instagram">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Facebook">
              <FaFacebook className="h-5 w-5" />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="TikTok">
              <FaTiktok className="h-5 w-5" />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Shopee">
              <SiShopee className="h-5 w-5" />
            </a>
          </div>
          <div className="pt-4">
            <h4 className="mb-2 text-sm font-semibold uppercase">Como comprar</h4>
            <p className="text-xs text-gray-400">
              Monte sua sacola e finalize pelo WhatsApp. Pagamento e envio combinados diretamente com a loja.
            </p>
          </div>
        </div>

      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Deco Imports. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
