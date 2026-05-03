"use client";

import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp } from "react-icons/fi";

export default function AdminDashboard() {
  // Dados mockados para o painel de relatórios
  const stats = [
    { name: "Vendas do Mês", value: "R$ 14.500,00", icon: FiDollarSign, color: "text-green-600", bg: "bg-green-100" },
    { name: "Pedidos Concluídos", value: "85", icon: FiShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Novos Clientes", value: "32", icon: FiUsers, color: "text-purple-600", bg: "bg-purple-100" },
    { name: "Taxa de Conversão", value: "3.4%", icon: FiTrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500 mt-1">Acompanhe os resultados e relatórios de vendas da sua loja.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border p-6 flex items-center space-x-4">
            <div className={`p-4 rounded-full ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder para gráficos futuros ou lista de pedidos recentes */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Últimos Pedidos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">ID do Pedido</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-4 font-medium text-gray-900">#ORD-1023</td>
                <td className="px-6 py-4">Maria Silva</td>
                <td className="px-6 py-4">02 Mai 2026</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Pago</span></td>
                <td className="px-6 py-4 text-right">R$ 599,00</td>
              </tr>
              <tr className="border-b">
                <td className="px-6 py-4 font-medium text-gray-900">#ORD-1022</td>
                <td className="px-6 py-4">João Marcos</td>
                <td className="px-6 py-4">01 Mai 2026</td>
                <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Pendente</span></td>
                <td className="px-6 py-4 text-right">R$ 1.250,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
