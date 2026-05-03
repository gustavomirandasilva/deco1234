"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

type Category = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", description: "", isActive: true });
  const [isLoading, setIsLoading] = useState(false);

  // Categorias padrão que sempre devem existir
  const defaultCategories = ["Luxo Oriental", "Grandes Grifes"];
  const allowedAdditionalCategories = ["Maquiagem", "Acessórios"];

  useEffect(() => {
    fetchCategories();
  }, []);

  const createDefaultCategories = async (existingCategories: Category[]) => {
    const missingDefaults = defaultCategories.filter(
      (defaultName) => !existingCategories.some((cat) => cat.name === defaultName)
    );

    if (missingDefaults.length === 0) return;

    await Promise.all(
      missingDefaults.map((name) =>
        fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description: `Categoria padrão ${name}`,
            isActive: true,
          }),
        })
      )
    );
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data: Category[] = await res.json();
      await createDefaultCategories(data);
      const refreshed = await fetch("/api/categories");
      if (refreshed.ok) {
        const latest = await refreshed.json();
        setCategories(latest);
      } else {
        setCategories(data);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isEditing = !!formData.id;

    // Validações para novas categorias
    if (!isEditing) {
      if (defaultCategories.includes(formData.name)) {
        alert(`A categoria "${formData.name}" já existe como categoria padrão e não pode ser recriada.`);
        setIsLoading(false);
        return;
      }

      if (!allowedAdditionalCategories.includes(formData.name)) {
        alert(`Categoria não permitida. As únicas categorias adicionais permitidas são: ${allowedAdditionalCategories.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // Verificar se já existe
      const existingCategory = categories.find(cat => cat.name.toLowerCase() === formData.name.toLowerCase());
      if (existingCategory) {
        alert(`A categoria "${formData.name}" já existe.`);
        setIsLoading(false);
        return;
      }
    }

    const url = isEditing ? `/api/categories/${formData.id}` : "/api/categories";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ id: "", name: "", description: "", isActive: true });
      fetchCategories();
    } else {
      const errorData = await res.json().catch(() => null);
      alert(`Erro ao salvar categoria: ${errorData?.error || 'Erro desconhecido no servidor'}`);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (!category) return;

    if (defaultCategories.includes(category.name)) {
      alert("Esta categoria é padrão e não pode ser excluída.");
      return;
    }

    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchCategories();
    } else {
      alert("Erro ao deletar. Talvez existam produtos vinculados a esta categoria.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500 mt-1">Gerencie as categorias de produtos. As categorias "Luxo Oriental" e "Grandes Grifes" são padrão e serão criadas automaticamente. Você pode adicionar apenas "Maquiagem" e "Acessórios".</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: "", name: "", description: "", isActive: true }); setIsModalOpen(true); }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <FiPlus />
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500">{cat.description || "-"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {cat.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setFormData({ id: cat.id, name: cat.name, description: cat.description || "", isActive: cat.isActive }); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-900 mx-2" aria-label="Editar">
                    <FiEdit2 />
                  </button>
                  {defaultCategories.includes(cat.name) ? (
                    <span className="text-gray-400 text-xs uppercase">Protegida</span>
                  ) : (
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900" aria-label="Excluir">
                      <FiTrash2 />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nenhuma categoria encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{formData.id ? "Editar Categoria" : "Nova Categoria"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black"
                  placeholder="Maquiagem ou Acessórios"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded text-black focus:ring-black"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Visível no Menu do Site</label>
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
