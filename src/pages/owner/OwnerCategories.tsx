import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import { FolderTree, Plus, Trash2, Edit } from 'lucide-react';

export const OwnerCategories: React.FC = () => {
  const { categories, saveCategory, deleteCategory } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveCategory({
      id: editingId || undefined,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
    });

    setName('');
    setDescription('');
    setEditingId(null);
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div className="border-b border-[#111111]/15 pb-4">
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
            Catalog Structure
          </span>
          <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            Category Manager ({categories.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Create / Edit Form */}
          <div className="md:col-span-4 bg-white border border-[#111111]/15 p-6 space-y-4">
            <h3 className="font-space font-bold text-xs uppercase tracking-wider border-b border-[#111111]/10 pb-3 flex items-center gap-2">
              <FolderTree size={16} /> {editingId ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-space font-bold uppercase text-[#111111]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hoodies &amp; Sweatshirts"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-space font-bold uppercase text-[#111111]">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Heavyweight fleece and streetwear outerwear..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setName('');
                      setDescription('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-xs font-space font-bold uppercase"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#111111] text-[#C7F464] font-space text-xs font-bold uppercase hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  {editingId ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>

          {/* Categories Grid List */}
          <div className="md:col-span-8 bg-white border border-[#111111]/15 p-6 space-y-4">
            <h3 className="font-space font-bold text-xs uppercase tracking-wider border-b border-[#111111]/10 pb-3">
              Configured Categories
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-[#F7F6F2] border border-[#111111]/10 flex justify-between items-start">
                  <div>
                    <h4 className="font-space font-bold text-sm text-[#111111]">{cat.name}</h4>
                    <p className="text-[10px] font-mono text-[#111111]/50">Slug: {cat.slug}</p>
                    {cat.description && <p className="text-xs text-[#111111]/70 font-sans mt-1 line-clamp-2">{cat.description}</p>}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1 border border-[#111111] hover:bg-[#111111] hover:text-[#C7F464] transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};
