"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiUploadCloud } from "react-icons/fi";
import Image from "next/image";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  historyOrigin?: string;
  price: number;
  stock: number;
  images: string;
  categoryId: string;
  category?: Category;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    historyOrigin: "",
    price: "",
    stock: "0",
    categoryId: "",
    images: ["", "", "", "", "", ""],
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
        categoryId: prev.categoryId || data[0]?.id || "",
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
    const cleanedImages = formData.images.filter((img) => img.trim() !== "");

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        images: cleanedImages,
        historyOrigin: formData.historyOrigin,
      }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } else {
      const err = await res.json().catch(() => null);
      alert(err?.error || "Erro ao salvar produto.");
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
    setFormData({
      id: "",
      name: "",
      description: "",
      historyOrigin: "",
      price: "",
      stock: "0",
      categoryId: categories[0]?.id || "",
      images: ["", "", "", "", "", ""],
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const parseImages = (imagesJson: string) => {
    try {
      return JSON.parse(imagesJson);
    } catch {
      return [];
    }
  };

  const handleFileUpload = async (index: number, fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setUploadingSlot(index);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Falha no upload");
        return;
      }
      if (data.url) handleImageChange(index, data.url);
    } finally {
      setUploadingSlot(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="mt-1 text-gray-500">
            Catálogo de perfumes. Envie imagens pelo botão de upload (Supabase Storage) ou cole uma URL
            pública.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          disabled={categories.length === 0}
          className="flex items-center space-x-2 rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiPlus />
          <span>Novo Produto</span>
        </button>
      </div>
      {categories.length === 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Nenhuma categoria cadastrada. Cadastre em <strong>Admin &gt; Categorias</strong> antes.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4">Estoque</th>
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
                      <div className="relative h-10 w-10 overflow-hidden rounded bg-gray-100">
                        <Image src={mainImage} alt={prod.name} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-gray-400">
                        <FiImage />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{prod.name}</td>
                  <td className="px-6 py-4 text-gray-500">{prod.category?.name || "-"}</td>
                  <td className="px-6 py-4 font-medium">
                    R$ {prod.price.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${
                        prod.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prod.stock} un.
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        const imgs = parseImages(prod.images);
                        const padded = [...imgs, "", "", "", "", "", ""].slice(0, 6);
                        setFormData({
                          id: prod.id,
                          name: prod.name,
                          description: prod.description,
                          historyOrigin: prod.historyOrigin ?? "",
                          price: prod.price.toString(),
                          stock: prod.stock.toString(),
                          categoryId: prod.categoryId,
                          images: padded,
                        });
                        setIsModalOpen(true);
                      }}
                      className="mx-2 text-blue-600 hover:text-blue-900"
                      aria-label="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prod.id)}
                      className="text-red-600 hover:text-red-900"
                      aria-label="Excluir"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white">
            <div className="border-b p-6">
              <h3 className="text-xl font-bold">{formData.id ? "Editar Produto" : "Novo Produto"}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="productForm" onSubmit={handleSave} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="border-b pb-2 font-bold text-gray-700">Informações</h4>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:border-black focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:border-black focus:ring-black"
                    >
                      <option value="">Selecione</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Preço (R$)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2 focus:border-black focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Estoque</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full rounded-lg border px-3 py-2 focus:border-black focus:ring-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:border-black focus:ring-black"
                      rows={5}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">História e origem</label>
                    <textarea
                      value={formData.historyOrigin}
                      onChange={(e) => setFormData({ ...formData, historyOrigin: e.target.value })}
                      className="w-full rounded-lg border px-3 py-2 focus:border-black focus:ring-black"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="border-b pb-2 font-bold text-gray-700">Fotos (até 6)</h4>
                  <p className="text-xs text-gray-500">
                    Use <strong>Enviar arquivo</strong> (requer bucket <code className="rounded bg-gray-100 px-1">product-images</code>{" "}
                    e <code className="rounded bg-gray-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> na Vercel) ou
                    cole URL.
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="rounded-lg border p-3">
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Foto {idx + 1}
                          {idx === 0 ? " (capa)" : ""}
                        </label>
                        <div className="mb-2">
                          <label className="flex cursor-pointer items-center gap-2 text-xs text-blue-700 hover:underline">
                            <FiUploadCloud className="h-4 w-4" />
                            {uploadingSlot === idx ? "Enviando…" : "Enviar arquivo"}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              disabled={uploadingSlot !== null}
                              onChange={(e) => handleFileUpload(idx, e.target.files)}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                          className="w-full rounded border px-2 py-1.5 text-sm"
                          placeholder="https://…"
                        />
                        {img ? (
                          <div className="relative mt-2 aspect-square w-full max-w-[120px] overflow-hidden rounded bg-gray-100">
                            <Image src={img} alt="" fill className="object-cover" unoptimized />
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 border-t bg-gray-50 p-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border bg-white px-4 py-2 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="productForm"
                disabled={isLoading || !formData.categoryId}
                className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
