import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import { Boxes, Plus, Minus, AlertTriangle, Search, History } from 'lucide-react';

export const OwnerInventory: React.FC = () => {
  const { products, adjustVariantStock, inventoryLogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all variants
  const variantRows = products.flatMap((p) =>
    (p.variants || []).map((v) => ({
      productId: p.id,
      productName: p.name,
      variantId: v.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      stock: v.stock_quantity,
    }))
  );

  const filteredVariants = variantRows.filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.productName.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q);
  });

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div className="border-b border-[#111111]/15 pb-4">
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
            Stock Control
          </span>
          <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            Inventory Matrix &amp; Movement Logs
          </h1>
        </div>

        {/* Search */}
        <div className="bg-white border border-[#111111]/15 p-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search inventory by product name or variant SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#111111] px-3 py-2 pl-8 text-xs focus:outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#111111]/40" />
          </div>
        </div>

        {/* Variants Inventory Table */}
        <div className="bg-white border border-[#111111]/15">
          <div className="p-4 border-b border-[#111111]/10 flex justify-between items-center">
            <h3 className="font-space font-bold text-xs uppercase flex items-center gap-2">
              <Boxes size={16} /> All Active Product Variants ({filteredVariants.length})
            </h3>
          </div>

          {filteredVariants.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#111111]/60 font-sans">
              No product variants found. Create products with size and color variants to manage inventory.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#111111] text-[#F7F6F2] font-space uppercase">
                    <th className="p-3">Product Title</th>
                    <th className="p-3">Variant SKU</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Color</th>
                    <th className="p-3">Stock Level</th>
                    <th className="p-3 text-right">Inline Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10">
                  {filteredVariants.map((v) => {
                    const isOut = v.stock === 0;
                    const isLow = v.stock > 0 && v.stock <= 5;

                    return (
                      <tr key={v.variantId} className="hover:bg-[#F7F6F2]">
                        <td className="p-3 font-space font-bold">{v.productName}</td>
                        <td className="p-3 font-mono">{v.sku}</td>
                        <td className="p-3 font-mono uppercase">{v.size || '-'}</td>
                        <td className="p-3 font-space">{v.color || '-'}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 font-mono text-[11px] font-bold ${
                              isOut
                                ? 'bg-red-100 text-red-800'
                                : isLow
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {v.stock} pcs {isOut ? '(OUT OF STOCK)' : isLow ? '(LOW STOCK)' : ''}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => adjustVariantStock(v.variantId, -1, 'Manual owner reduction')}
                              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 font-bold cursor-pointer"
                              title="Decrease 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => adjustVariantStock(v.variantId, 1, 'Manual owner restock')}
                              className="px-2 py-1 bg-[#111111] text-[#C7F464] font-bold cursor-pointer"
                              title="Add 1"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => adjustVariantStock(v.variantId, 10, 'Batch restock (+10)')}
                              className="px-2 py-1 bg-[#C7F464] text-[#111111] font-bold cursor-pointer"
                              title="Batch Restock 10"
                            >
                              +10
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

        {/* Inventory Audit Movement Log */}
        <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
          <h3 className="font-space font-bold text-xs uppercase flex items-center gap-2 border-b border-[#111111]/10 pb-3">
            <History size={16} /> Inventory Audit Logs
          </h3>

          {inventoryLogs.length === 0 ? (
            <p className="text-xs text-[#111111]/60 font-sans">No stock movements recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {inventoryLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="p-2 bg-[#F7F6F2] border border-[#111111]/10 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-space font-bold">{log.productName}</span>{' '}
                    <span className="font-mono text-[11px] text-[#111111]/60">({log.variantSku})</span>
                    <p className="text-[10px] text-[#111111]/60">{log.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold ${log.quantityChange > 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                    </span>
                    <p className="text-[10px] text-[#111111]/40">{new Date(log.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
};
