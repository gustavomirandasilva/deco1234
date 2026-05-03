"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

type PerfumeStory = {
  id: string;
  title: string;
  content: string;
  category: 'ORIENTAL_LUXURY' | 'GREAT_BRANDS' | 'GENERAL_CURIOSITIES';
  isActive: boolean;
};

export default function AdminStories() {
  const [stories, setStories] = useState<PerfumeStory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    content: string;
    category: 'ORIENTAL_LUXURY' | 'GREAT_BRANDS' | 'GENERAL_CURIOSITIES';
    isActive: boolean;
  }>({
    id: "",
    title: "",
    content: "",
    category: 'GENERAL_CURIOSITIES',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const res = await fetch("/api/stories");
    if (res.ok) {
      const data = await res.json();
      setStories(data);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isEditing = !!formData.id;
    const url = isEditing ? `/api/stories/${formData.id}` : "/api/stories";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ id: "", title: "", content: "", category: 'GENERAL_CURIOSITIES', isActive: true });
      fetchStories();
    } else {
      const errorData = await res.json().catch(() => null);
      alert(`Erro ao salvar história: ${errorData?.error || 'Erro desconhecido no servidor'}`);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta história?")) return;
    const res = await fetch(`/api/stories/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchStories();
    } else {
      alert("Erro ao deletar história.");
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ORIENTAL_LUXURY': return 'Luxo Oriental';
      case 'GREAT_BRANDS': return 'Grandes Grifes';
      case 'GENERAL_CURIOSITIES': return 'Curiosidades Gerais';
      default: return category;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Histórias e Curiosidades</h1>
          <p className="text-gray-500 mt-1">Gerencie conteúdos explicando os perfumes e suas nuances, com curiosidades do Luxo Oriental e das Grandes Grifes.</p>
        </div>
        <button
          onClick={() => { setFormData({ id: "", title: "", content: "", category: 'GENERAL_CURIOSITIES', isActive: true }); setIsModalOpen(true); }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <FiPlus />
          <span>Nova História</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{story.title}</td>
                <td className="px-6 py-4 text-gray-500">{getCategoryLabel(story.category)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${story.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {story.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setFormData({ id: story.id, title: story.title, content: story.content, category: story.category, isActive: story.isActive }); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-900 mx-2" aria-label="Editar">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(story.id)} className="text-red-600 hover:text-red-900" aria-label="Excluir">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {stories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nenhuma história cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">{formData.id ? "Editar História" : "Nova História"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black"
                  placeholder="Ex: A História dos Perfumes Orientais"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black"
                >
                  <option value="ORIENTAL_LUXURY">Luxo Oriental</option>
                  <option value="GREAT_BRANDS">Grandes Grifes</option>
                  <option value="GENERAL_CURIOSITIES">Curiosidades Gerais</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black"
                  rows={8}
                  placeholder="Escreva aqui a história ou curiosidade sobre perfumes..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="storyIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded text-black focus:ring-black"
                />
                <label htmlFor="storyIsActive" className="text-sm font-medium text-gray-700">História Ativa (visível no site)</label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {isLoading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}