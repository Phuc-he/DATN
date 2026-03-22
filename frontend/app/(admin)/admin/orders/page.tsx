'use client';

import { Order } from '@/src/domain/entity/order.entity';
import { OrderStatus } from '@/src/domain/entity/order-status.enum';
import OrderDetailsModal from '@/src/presentation/components/admin/orders/OrderDetailsModal';
import OrderTable from '@/src/presentation/components/admin/orders/OrderTable';
import { AppProviders } from '@/src/provider/provider';
import { Constants } from '@/src/shared/constans';
import { Search, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Initialized as empty array
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Constants.PAGE);
  const [totalPages, setTotalPages] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetOrdersByPageUseCase.execute(page - 1, 10);
      // Defensive check for result structure
      setOrders(result?.content || []);
      setTotalPages(result?.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: number, status: OrderStatus) => {
    try {
      // Unified update logic for status
      await AppProviders.UpdateOrderStatusUseCase.execute(id, status);
      await fetchOrders(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <OrderDetailsModal 
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
          </div>
          <p className="text-sm text-slate-500">Monitor transactions, payments, and shipping status.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">All Orders</span>
             </div>
            <span className="text-xs font-medium text-slate-400">
              Showing page {currentPage} of {totalPages}
            </span>
          </div>

          <OrderTable 
            orders={orders}
            onViewDetails={handleViewDetails}
          />

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center px-4 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold">
              {currentPage}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;