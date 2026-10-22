import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  Boxes,
  Users,
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { products, orders, updateOrderStatus } = useStore();

  // Metrics
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.payment_status === 'paid');
  const grossSales = paidOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingFulfillment = orders.filter((o) => o.status === 'pending').length;

  // Inventory stats
  const allVariants = products.flatMap((p) => p.variants || []);
  const outOfStockCount = allVariants.filter((v) => v.stock_quantity === 0).length;
  const lowStockCount = allVariants.filter((v) => v.stock_quantity > 0 && v.stock_quantity <= 5).length;

  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div className="border-b border-[#111111]/15 pb-4 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
              Business Analytics
            </span>
            <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
              Owner Store Performance
            </h1>
          </div>
          <Link
            to="/owner/products/new"
            className="px-4 py-2 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold flex items-center gap-1.5 hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
          >
            <PlusCircle size={15} /> Add New Product
          </Link>
        </div>

        {/* Business Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#111111]/15 p-5 space-y-2">
            <div className="flex justify-between items-center text-[#111111]/60 text-xs font-space uppercase">
              <span>Gross Sales (Paid)</span>
              <IndianRupee size={16} />
            </div>
            <p className="font-space font-extrabold text-2xl text-[#111111]">
              ₹{grossSales.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-[#111111]/50 font-mono">From {paidOrders.length} verified paid order(s)</p>
          </div>

          <div className="bg-white border border-[#111111]/15 p-5 space-y-2">
            <div className="flex justify-between items-center text-[#111111]/60 text-xs font-space uppercase">
              <span>Total Orders</span>
              <ShoppingBag size={16} />
            </div>
            <p className="font-space font-extrabold text-2xl text-[#111111]">{totalOrders}</p>
            <p className="text-[10px] text-amber-700 font-mono font-bold">{pendingFulfillment} pending fulfillment</p>
          </div>

          <div className="bg-white border border-[#111111]/15 p-5 space-y-2">
            <div className="flex justify-between items-center text-[#111111]/60 text-xs font-space uppercase">
              <span>Published Catalog</span>
              <Package size={16} />
            </div>
            <p className="font-space font-extrabold text-2xl text-[#111111]">
              {products.filter((p) => p.status === 'published').length} / {products.length}
            </p>
            <p className="text-[10px] text-[#111111]/50 font-mono">Products active on storefront</p>
          </div>

          <div className="bg-white border border-[#111111]/15 p-5 space-y-2">
            <div className="flex justify-between items-center text-[#111111]/60 text-xs font-space uppercase">
              <span>Inventory Health</span>
              <AlertTriangle size={16} className={outOfStockCount > 0 ? 'text-red-600' : 'text-[#111111]/60'} />
            </div>
            <p className="font-space font-extrabold text-2xl text-[#111111]">{lowStockCount + outOfStockCount}</p>
            <p className="text-[10px] text-red-600 font-mono font-bold">
              {outOfStockCount} Out of Stock • {lowStockCount} Low Stock
            </p>
          </div>
        </div>

        {/* Recent Customer Orders Table */}
        <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#111111]/10 pb-3">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider text-[#111111]">
              Recent Customer Orders
            </h3>
            <Link
              to="/owner/orders"
              className="text-xs font-space font-bold uppercase underline hover:text-[#C7F464]"
            >
              Manage All Orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#111111]/60 font-sans">
              No orders placed yet. Orders will appear here automatically when customers purchase items.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#111111] text-[#F7F6F2] font-space uppercase">
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Fulfillment</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10">
                  {orders.slice(0, 6).map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#F7F6F2]">
                      <td className="p-3 font-space font-bold">{ord.order_number}</td>
                      <td className="p-3">
                        <p className="font-bold">{ord.shipping_address.full_name}</p>
                        <p className="text-[10px] text-[#111111]/60 truncate max-w-[150px]">{ord.customer_email}</p>
                      </td>
                      <td className="p-3 font-mono">{new Date(ord.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="p-3 font-space font-bold">₹{ord.total_amount.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 font-space text-[10px] font-bold uppercase ${
                          ord.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.payment_status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#111111] text-[#C7F464] font-space text-[10px] font-bold uppercase">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to="/owner/orders"
                          className="px-2.5 py-1 bg-[#111111] text-white font-space text-[10px] uppercase font-bold hover:bg-[#C7F464] hover:text-[#111111]"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
};
