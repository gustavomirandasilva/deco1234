import Link from "next/link";
import { FiHome, FiBox, FiList, FiLogOut, FiSettings } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold uppercase tracking-widest block mb-1">
            Deco Admin
          </Link>
          <span className="text-xs text-gray-400">Painel de Gerenciamento</span>
        </div>
        
        <nav className="flex-1 px-4 mt-6 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800 text-white transition-colors">
            <FiHome className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/produtos" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <FiBox className="h-5 w-5" />
            <span>Produtos</span>
          </Link>
          <Link href="/admin/categorias" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <FiList className="h-5 w-5" />
            <span>Categorias</span>
          </Link>
          <Link href="/admin/historias" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <FiSettings className="h-5 w-5" />
            <span>Histórias</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900 text-red-400 hover:text-red-100 transition-colors">
            <FiLogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-medium text-gray-800">Bem-vindo, Administrador</h2>
          <button className="text-gray-500 hover:text-black">
            <FiSettings className="h-6 w-6" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
