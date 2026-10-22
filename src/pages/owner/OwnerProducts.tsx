import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, Search, Package } from 'lucide-react';

export const OwnerProducts: React.FC = () => {
  const { products, toggleProductStatus, deleteProduct, categories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category_id !== selectedCategory) return false;
    if (selectedStatus && p.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = (p.sku || '').toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#111111]/15 pb-4">
          <div>
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
              Product Management
            </span>
            <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
              Apparel Catalog ({products.length})
            </h1>
          </div>

          <Link
            to="/owner/products/new"
            className="px-5 py-2.5 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold flex items-center gap-2 hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
          >
            <PlusCircle size={16} /> Create New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#111111]/15 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by product name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#111111] px-3 py-2 pl-8 text-xs focus:outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#111111]/40" />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-[#111111] px-3 py-2 font-space uppercase text-xs focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-[#111111] px-3 py-2 font-space uppercase text-xs focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white border border-[#111111]/15">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3 p-6">
              <Package size={40} className="mx-auto text-[#111111]/30" />
              <h3 className="font-space font-bold uppercase text-base">No Products Found</h3>
              <p className="text-xs text-[#111111]/60 font-sans max-w-sm mx-auto">
                {products.length === 0
                  ? 'Your store catalog is currently empty. Click Create New Product to upload your first fashion piece.'
                  : 'No products match your current search or filter query.'}
              </p>
              <Link
                to="/owner/products/new"
                className="inline-block px-6 py-2.5 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
              >
                Upload First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#111111] text-[#F7F6F2] font-space uppercase">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Regular Price</th>
                    <th className="p-3">Sale Price</th>
                    <th className="p-3">Variants / Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10">
                  {filteredProducts.map((p) => {
                    const totalStock = p.variants?.reduce((s, v) => s + v.stock_quantity, 0) || 0;
                    const mainImg = p.images?.find((i) => i.is_main)?.url || p.images?.[0]?.url;

                    return (
                      <tr key={p.id} className="hover:bg-[#F7F6F2]">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-[#E8E8E8] border shrink-0 overflow-hidden">
                              {mainImg ? (
                                <img src={mainImg} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] uppercase text-[#111111]/40">
                                  No Img
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-space font-bold text-sm text-[#111111]">{p.name}</p>
                              <p className="text-[10px] font-mono text-[#111111]/50">{p.sku || 'No SKU'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-space uppercase">{p.category?.name || p.gender_collection}</td>
                        <td className="p-3 font-space font-bold">₹{p.regular_price.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-space text-[#111111]/70">
                          {p.sale_price ? `₹${p.sale_price.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="p-3 font-mono">
                          <span className={totalStock === 0 ? 'text-red-600 font-bold' : 'text-[#111111]'}>
                            {p.variants?.length || 0} variant(s) ({totalStock} pcs)
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleProductStatus(p.id)}
                            className={`px-2.5 py-1 font-space text-[10px] font-bold uppercase border cursor-pointer ${
                              p.status === 'published'
                                ? 'bg-[#111111] text-[#C7F464] border-[#111111]'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            {p.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/owner/products/${p.id}`}
                              className="p-1.5 border border-[#111111] hover:bg-[#111111] hover:text-[#C7F464] transition-colors"
                              title="Edit Product"
                            >
                              <Edit3 size={14} />
                            </Link>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${p.name}" from catalog?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
};
