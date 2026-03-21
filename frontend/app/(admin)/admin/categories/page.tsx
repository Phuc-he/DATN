'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/src/domain/entity/category.entity';
import CategoryModal from '@/src/presentation/components/admin/categories/CategoryModal';
import CategoryTable from '@/src/presentation/components/admin/categories/CategoryTable';
import { AppProviders } from '@/src/provider/provider';
import { Constants } from '@/src/shared/constans';
import { Plus, Layers } from 'lucide-react';

const Page = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Constants.PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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
    try {
      if (selectedCategory) {
        // Use .id or ._id depending on your entity structure
        const id = selectedCategory?.id || 0;
        await AppProviders.UpdateCategoryUseCase.execute(id, data);
      } else {
        await AppProviders.CreateCategoryUseCase.execute(data);
      }
      fetchCategories(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Operation failed. Check console for details.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await AppProviders.DeleteCategoryUseCase.execute(id);
        fetchCategories(currentPage);
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Error deleting category");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Modal - Key ensures state resets every time selectedCategory changes */}
      <CategoryModal 
        key={selectedCategory?.id}
        isOpen={isModalOpen} 
        initialData={selectedCategory} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
          </div>
          <p className="text-sm text-slate-500">Organize and manage your product categories.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} />
          Add Category
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

          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
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

export default Page;