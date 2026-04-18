'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/src/domain/entity/category.entity';
import CategoryModal from '@/src/presentation/components/admin/categories/CategoryModal';
import CategoryTable from '@/src/presentation/components/admin/categories/CategoryTable';
import { AppProviders } from '@/src/provider/provider';
import { useActivityLogger } from '@/src/presentation/hooks/useActivityLogger'; // Import Logger
import { Constants } from '@/src/shared/constans';
import { Plus, Layers } from 'lucide-react';

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Constants.PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Initialize the activity logger
  const { logAction } = useActivityLogger();

  const fetchCategories = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetCategoriesByPageUseCase.execute(page - 1, 10);
      setCategories(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Category) => {
    let action = "UPDATE";
    try {
      if (selectedCategory) {
        const id = selectedCategory?.id || 0;
        await AppProviders.UpdateCategoryUseCase.execute(id, data);
        await logAction(action, "Category", `Cập nhật danh mục: ${data.name} (ID: ${id})`);
      } else {
        action = "CREATE";
        await AppProviders.CreateCategoryUseCase.execute(data);
        await logAction(action, "Category", `Tạo danh mục mới: ${data.name}`);
      }
      fetchCategories(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      logAction(`${action}_FAILURE`, "Category", `Không thể lưu danh mục: ${data.name}`);
      alert("Thao tác thất bại. Kiểm tra console để biết chi tiết.");
    }
  };

  const handleDelete = async (id: number) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await AppProviders.DeleteCategoryUseCase.execute(id);
        await logAction("DELETE", "Category", `Đã xóa danh mục: ${categoryToDelete?.name || id}`);
        fetchCategories(currentPage);
      } catch (error) {
        console.error("Failed to delete category:", error);
        logAction("DELETE_FAILURE", "Category", `Không thể xóa danh mục ID: ${id}`);
        alert("Lỗi khi xóa danh mục");
      }
    }
  };

  return (
    <div className="p-8 bg-emerald-50 min-h-screen">
      <CategoryModal
        key={selectedCategory?.id}
        isOpen={isModalOpen}
        initialData={selectedCategory}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-950">Quản lý danh mục</h1>
          </div>
          <p className="text-sm text-emerald-900">Tổ chức và quản lý các danh mục sản phẩm của bạn.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} />
          Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <span className="text-xs font-medium text-slate-400 bg-slate-200/50 px-2 py-1 rounded">
              Trang {currentPage} trên {totalPages}
            </span>
          </div>

          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Trước
            </button>

            <div className="flex items-center px-4 bg-slate-200 rounded-lg text-slate-700 font-medium">
              {currentPage}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
