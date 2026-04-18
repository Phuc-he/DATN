'use client';

import React, { useEffect, useState } from 'react';
import { WebSetting } from '@/src/domain/entity/web-setting.entity';
import WebSettingModal from '@/src/presentation/components/admin/settings/WebSettingModal';
import WebSettingTable from '@/src/presentation/components/admin/settings/WebSettingTable';
import { AppProviders } from '@/src/provider/provider';
import { useActivityLogger } from '@/src/presentation/hooks/useActivityLogger'; // Import Logger
import { Plus, Settings, LayoutGrid } from 'lucide-react';

const WebSettingPage = () => {
  const [settings, setSettings] = useState<WebSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<WebSetting | null>(null);

  // Initialize the activity logger
  const { logAction } = useActivityLogger();

  const fetchSettings = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetWebSettingsByPageUseCase.execute(page - 1, 10);
      setSettings(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch web settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings(currentPage);
  }, [currentPage]);

  const handleCreate = () => {
    setSelectedSetting(null);
    setIsModalOpen(true);
  };

  const handleEdit = (setting: WebSetting) => {
    setSelectedSetting(setting);
    setIsModalOpen(true);
  };

  const handleSave = async (data: WebSetting) => {
    let action = "UPDATE";
    try {
      if (selectedSetting && selectedSetting.id !== 0) {
        await AppProviders.UpdateWebSettingUseCase.execute(selectedSetting.id, data);
        await logAction(action, "WebSetting", `Cập nhật cấu hình trang web: ${data.webName} (ID: ${selectedSetting.id})`);
      } else {
        action = "CREATE";
        await AppProviders.CreateWebSettingUseCase.execute(data);
        await logAction(action, "WebSetting", `Tạo cấu hình trang web mới: ${data.webName}`);
      }
      fetchSettings(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save web settings:", error);
      logAction(`${action}_FAILURE`, "WebSetting", `Không thể lưu cấu hình: ${data.webName}`);
      alert("Lỗi khi lưu cài đặt. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: number) => {
    const settingToDelete = settings.find(s => s.id === id);
    if (window.confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
      try {
        await AppProviders.DeleteWebSettingUseCase.execute(id);
        await logAction("DELETE", "WebSetting", `Đã xóa cấu hình: ${settingToDelete?.webName || id}`);
        fetchSettings(currentPage);
      } catch (error) {
        console.error("Failed to delete setting:", error);
        logAction("DELETE_FAILURE", "WebSetting", `Không thể xóa cấu hình ID: ${id}`);
        alert("Lỗi khi xóa cấu hình.");
      }
    }
  };

  return (
    <div className="p-8 bg-emerald-50 min-h-screen">
      <WebSettingModal
        key={selectedSetting?.id || 'new'}
        isOpen={isModalOpen}
        initialData={selectedSetting}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-950">Cấu hình trang web</h1>
          </div>
          <p className="text-sm text-emerald-900">Quản lý các cài đặt chung, thương hiệu và thông tin liên hệ cho cửa hàng.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Cấu hình mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-400">
              <LayoutGrid size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Các phiên bản trang web</span>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              Trang {currentPage} trên {totalPages}
            </span>
          </div>

          <WebSettingTable
            settings={settings}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
            >
              Trước
            </button>
            <div className="flex items-center px-4 bg-emerald-600 rounded-lg text-white font-bold shadow-inner">
              {currentPage}
            </div>
            <button
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WebSettingPage;
