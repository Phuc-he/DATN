'use client';

import { Voucher } from '@/src/domain/entity/voucher.entity';
import VoucherModal from '@/src/presentation/components/admin/vouchers/VoucherModal';
import VoucherTable from '@/src/presentation/components/admin/vouchers/VoucherTable';
import { AppProviders } from '@/src/provider/provider';
import { useActivityLogger } from '@/src/presentation/hooks/useActivityLogger'; // Import Logger
import { Plus, TicketPercent } from 'lucide-react';
import { useEffect, useState } from 'react';

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Initialize the activity logger
  const { logAction } = useActivityLogger();

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
    let action = "UPDATE";
    try {
      if (selectedVoucher?.id) {
        await AppProviders.UpdateVoucherUseCase.execute(selectedVoucher.id, data);
        await logAction(action, "Voucher", `Updated voucher: ${data.code} (ID: ${selectedVoucher.id})`);
      } else {
        action = "CREATE";
        await AppProviders.CreateVoucherUseCase.execute(data);
        await logAction(action, "Voucher", `Created new voucher: ${data.code} with ${data.discountValue}% discount`);
      }
      fetchVouchers(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save voucher:", error);
      logAction(`${action}_FAILURE`, "Voucher", `Failed to save voucher code: ${data.code}`);
      alert("Error saving voucher. Check if the code already exists.");
    }
  };

  const handleDelete = async (id: number) => {
    const voucherToDelete = vouchers.find(v => v.id === id);
    if (window.confirm(`Are you sure you want to delete voucher "${voucherToDelete?.code}"? This cannot be undone.`)) {
      try {
        await AppProviders.DeleteVoucherUseCase.execute(id);
        await logAction("DELETE", "Voucher", `Deleted voucher: ${voucherToDelete?.code || id}`);
        fetchVouchers(currentPage);
      } catch (error) {
        console.error("Failed to delete voucher:", error);
        logAction("DELETE_FAILURE", "Voucher", `Failed to delete voucher ID: ${id}`);
        alert("Error deleting voucher");
      }
    }
  };

  return (
    <div className="p-8 bg-emerald-50 min-h-screen">
      <VoucherModal
        key={selectedVoucher?.id || 'new-voucher'}
        isOpen={isModalOpen}
        initialData={selectedVoucher}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TicketPercent className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-950">Voucher Management</h1>
          </div>
          <p className="text-sm text-emerald-900">Create and monitor discount codes for your customers.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Create Voucher
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-emerald-900 font-medium">
              Active Vouchers: {vouchers.length}
            </span>
            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          <VoucherTable
            vouchers={vouchers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
            >
              Previous
            </button>
            <div className="flex items-center px-4 bg-emerald-600 rounded-lg text-white font-bold shadow-inner">
              {currentPage}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
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
