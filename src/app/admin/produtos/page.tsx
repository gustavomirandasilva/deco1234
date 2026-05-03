"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import Image from "next/image";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  historyOrigin?: string;
  price: number;
  stock: number;
  images: string; // JSON string
  categoryId: string;
  category?: Category;
  isLaunch: boolean;
  isPromotion: boolean;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Imagens serão armazenadas como um array de strings (paths locais)
  const [formData, setFormData] = useState({ 
    id: "", name: "", description: "", historyOrigin: "", price: "", stock: "0", categoryId: "", images: ["", "", "", "", "", ""], isLaunch: false, isPromotion: false
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    if (res.ok) setProducts(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
      setFormData((prev) => ({
        ...prev,
        categoryId: prev.categoryId || data[0]?.id || ""
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.categoryId) {
      alert("Selecione uma categoria antes de salvar o produto.");
      setIsLoading(false);
      return;
    }

    const isEditing = !!formData.id;
    const url = isEditing ? `/api/products/${formData.id}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    // Limpar imagens vazias
    const cleanedImages = formData.images.filter(img => img.trim() !== "");

    const payload = {
      ...formData,
      images: cleanedImages,
      historyOrigin: formData.historyOrigin,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } else {
      alert("Erro ao salvar produto.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
    else alert("Erro ao deletar produto.");
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", description: "", historyOrigin: "", price: "", stock: "0", categoryId: categories[0]?.id || "", images: ["", "", "", "", "", ""], isLaunch: false, isPromotion: false });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const parseImages = (imagesJson: string) => {
    try { return JSON.parse(imagesJson); } catch { return []; }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500 mt-1">Adicione os perfumes com até 6 fotos e descrições detalhadas.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          disabled={categories.length === 0}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus />
          <span>Novo Produto</span>
        </button>
      </div>
      {categories.length === 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Nenhuma categoria cadastrada ainda. Cadastre uma categoria em <strong>Admin &gt; Categorias</strong> antes de adicionar produtos.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4">Estoque</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => {
              const imagesList = parseImages(prod.images);
              const mainImage = imagesList.length > 0 ? imagesList[0] : null;

              return (
                <tr key={prod.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {mainImage ? (
                      <div className="h-10 w-10 relative bg-gray-100 rounded overflow-hidden">
                        <Image src={mainImage} alt={prod.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        <FiImage />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{prod.name}</td>
                  <td className="px-6 py-4 text-gray-500">{prod.category?.name || "-"}</td>
                  <td className="px-6 py-4 font-medium">R$ {prod.price.toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${prod.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {prod.stock} un.
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {prod.isLaunch && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">Lançamento</span>
                      )}
                      {prod.isPromotion && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">Promoção</span>
                      )}
                      {!prod.isLaunch && !prod.isPromotion && (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        const imgs = parseImages(prod.images);
                        const paddedImgs = [...imgs, "", "", "", "", "", ""].slice(0, 6);
                        setFormData({ 
                          id: prod.id, name: prod.name, description: prod.description, historyOrigin: prod.historyOrigin ?? "",
                          price: prod.price.toString(), stock: prod.stock.toString(), 
                          categoryId: prod.categoryId, images: paddedImgs,
                          isLaunch: prod.isLaunch || false, isPromotion: prod.isPromotion || false
                        });
                        setIsModalOpen(true);
                      }} 
                      className="text-blue-600 hover:text-blue-900 mx-2" aria-label="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-900" aria-label="Excluir">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Nenhum produto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">{formData.id ? "Editar Produto" : "Novo Produto"}</h3>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Lado Esquerdo: Informações */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 border-b pb-2">Informações Principais</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black">
                      <option value="">Selecione uma categoria</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                      <input required type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                      <input required type="number" min="0" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Explicativa (Parágrafo)</label>
                    <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black" rows={5} placeholder="Fale sobre as notas olfativas, projeção, fixação..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">História e Origem</label>
                    <textarea value={formData.historyOrigin} onChange={(e) => setFormData({...formData, historyOrigin: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:ring-black focus:border-black" rows={5} placeholder="Conte a origem, inspiração e história do perfume..." />
                  </div>

                  {/* Campos de Status */}
                  <div className="space-y-3 pt-4 border-t">
                    <h5 className="font-medium text-gray-700">Status do Produto</h5>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isLaunch"
                        checked={formData.isLaunch}
                        onChange={(e) => setFormData({...formData, isLaunch: e.target.checked})}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="isLaunch" className="text-sm font-medium text-gray-700">Marcar como Lançamento</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPromotion"
                        checked={formData.isPromotion}
                        onChange={(e) => setFormData({...formData, isPromotion: e.target.checked})}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="isPromotion" className="text-sm font-medium text-gray-700">Marcar como Promoção</label>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Imagens */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 border-b pb-2">Fotos do Produto (Até 6 imagens)</h4>
                  <p className="text-xs text-gray-500 mb-4">Insira o caminho local da foto (ex: `/produtos/perfume1.jpg`) ou um link web (URL).</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Foto {idx + 1} {idx === 0 && "(Capa)"}</label>
                        <input 
                          type="text" 
                          value={img} 
                          onChange={(e) => handleImageChange(idx, e.target.value)} 
                          className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-black focus:border-black" 
                          placeholder="/caminho/foto.jpg"
                        />
                        {img && (
                          <div className="absolute right-2 top-7 h-6 w-6 bg-gray-100 border rounded overflow-hidden">
                            <Image src={img} alt="preview" fill className="object-cover" unoptimized />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border bg-white rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="submit" form="productForm" disabled={isLoading || !formData.categoryId} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                {isLoading ? "Salvando..." : "Salvar Produto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
