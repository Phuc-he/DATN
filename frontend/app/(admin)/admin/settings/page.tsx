'use client';

import React, { useEffect, useState } from 'react';
import { WebSetting } from '@/src/domain/entity/web-setting.entity';
import WebSettingModal from '@/src/presentation/components/admin/settings/WebSettingModal';
import WebSettingTable from '@/src/presentation/components/admin/settings/WebSettingTable';
import { AppProviders } from '@/src/provider/provider';
import { Plus, Settings, LayoutGrid } from 'lucide-react';

const WebSettingPage = () => {
  const [settings, setSettings] = useState<WebSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<WebSetting | null>(null);

  const fetchSettings = async (page: number) => {
    setLoading(true);
    try {
      // Assuming your graduation project uses the same pagination pattern as Vouchers
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
    try {
      if (selectedSetting && selectedSetting.id !== 0) {
        await AppProviders.UpdateWebSettingUseCase.execute(selectedSetting.id, data);
      } else {
        await AppProviders.CreateWebSettingUseCase.execute(data);
      }
      fetchSettings(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save web settings:", error);
      alert("Error saving settings. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this configuration?")) {
      try {
        await AppProviders.DeleteWebSettingUseCase.execute(id);
        fetchSettings(currentPage);
      } catch (error) {
        console.error("Failed to delete setting:", error);
        alert("Error deleting configuration.");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Configuration Modal */}
      <WebSettingModal
        key={selectedSetting?.id || 'new'}
        isOpen={isModalOpen}
        initialData={selectedSetting}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-900">Website Configuration</h1>
          </div>
          <p className="text-sm text-slate-500">Manage global settings, branding, and contact info for the storefront.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} />
          New Configuration
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-400">
               <LayoutGrid size={16} />
               <span className="text-xs font-semibold uppercase tracking-wider">Site Versions</span>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-200/50 px-2 py-1 rounded">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <WebSettingTable
            settings={settings}
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
              disabled={currentPage >= totalPages || totalPages === 0}
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

export default WebSettingPage;