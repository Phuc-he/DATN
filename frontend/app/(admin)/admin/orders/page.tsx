'use client';

import { Order } from '@/src/domain/entity/order.entity';
import { OrderStatus } from '@/src/domain/entity/order-status.enum';
import OrderDetailsModal from '@/src/presentation/components/admin/orders/OrderDetailsModal';
import OrderTable from '@/src/presentation/components/admin/orders/OrderTable';
import { AppProviders } from '@/src/provider/provider';
import { useActivityLogger } from '@/src/presentation/hooks/useActivityLogger'; // Import Logger
import { Constants } from '@/src/shared/constans';
import { Search, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Constants.PAGE);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Initialize the activity logger
  const { logAction } = useActivityLogger();

  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetOrdersByPageUseCase.execute(page - 1, 10);
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
    const action = "UPDATE";
    try {
      await AppProviders.UpdateOrderStatusUseCase.execute(id, status);

      // Log successful status change
      await logAction(
        action,
        "Order",
        `Changed Order #${id} status to ${status}`
      );

      await fetchOrders(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);

      // Log failed attempt
      logAction(
        `${action}_FAILURE`,
        "Order",
        `Failed to change Order #${id} status to ${status}`
      );

      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-8 bg-emerald-50 min-h-screen">
      <OrderDetailsModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-950">Order Management</h1>
          </div>
          <p className="text-sm text-emerald-900">Monitor transactions, payments, and shipping status.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search Order ID..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">All Orders</span>
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
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center px-4 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold">
              {currentPage}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
