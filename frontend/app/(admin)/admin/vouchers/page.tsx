'use client';

import { Voucher } from '@/src/domain/entity/voucher.entity';
import VoucherModal from '@/src/presentation/components/admin/vouchers/VoucherModal';
import VoucherTable from '@/src/presentation/components/admin/vouchers/VoucherTable';
import { AppProviders } from '@/src/provider/provider';
import { Plus, TicketPercent } from 'lucide-react';
import { useEffect, useState } from 'react';

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const fetchVouchers = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetVouchersByPageUseCase.execute(page - 1, 10);
      setVouchers(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers(currentPage);
  }, [currentPage]);

  const handleCreate = () => {
    setSelectedVoucher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Voucher) => {
    try {
      console.log("selectedVoucher", selectedVoucher);
      console.log("data: Voucher", data);
      if (selectedVoucher) {
        const id = selectedVoucher.id || 0;
        await AppProviders.UpdateVoucherUseCase.execute(id, data);
      } else {
        await AppProviders.CreateVoucherUseCase.execute(data);
      }
      fetchVouchers(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save voucher:", error);
      alert("Error saving voucher. Check if the code already exists.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this voucher? This cannot be undone.")) {
      try {
        await AppProviders.DeleteVoucherUseCase.execute(id);
        fetchVouchers(currentPage);
      } catch (error) {
        console.error("Failed to delete voucher:", error);
        alert("Error deleting voucher");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Voucher Modal */}
      <VoucherModal
        key={selectedVoucher?.id}
        isOpen={isModalOpen}
        initialData={selectedVoucher}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TicketPercent className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-900">Voucher Management</h1>
          </div>
          <p className="text-sm text-slate-500">Create and monitor discount codes for your customers.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} />
          Create Voucher
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <span className="text-xs font-medium text-slate-400 bg-slate-200/50 px-2 py-1 rounded">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <VoucherTable
            vouchers={vouchers}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
            <div className="flex items-center px-4 bg-slate-200/30 rounded-lg text-slate-700 font-medium">
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

export default VoucherPage;