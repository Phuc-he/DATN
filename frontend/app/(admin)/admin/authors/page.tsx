'use client';

import { Author } from '@/src/domain/entity/author.entity';
import AuthorModal from '@/src/presentation/components/admin/authors/AuthorModal';
import AuthorTable from '@/src/presentation/components/admin/authors/AuthorTable';
import { AppProviders } from '@/src/provider/provider';
import { useActivityLogger } from '@/src/presentation/hooks/useActivityLogger'; // Import Logger
import { Plus, PenTool } from 'lucide-react';
import { useEffect, useState } from 'react';

const AuthorPage = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  // Initialize the activity logger
  const { logAction } = useActivityLogger();

  const fetchAuthors = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetAuthorsByPageUseCase.execute(page - 1, 10);
      setAuthors(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors(currentPage);
  }, [currentPage]);

  const handleSave = async (data: Author) => {
    let action: string = "UPDATE";
    try {
      if (selectedAuthor?.id) {
        // Log Update Action
        await AppProviders.UpdateAuthorUseCase.execute(selectedAuthor.id, data);
        await logAction(action, "Author", `Cập nhật tác giả: ${data.name} (ID: ${selectedAuthor.id})`);
      } else {
        action = "CREATE";
        const newAuthor = await AppProviders.CreateAuthorUseCase.execute(data);
        await logAction(action, "Author", `Tạo tác giả mới: ${data.name}`);
        console.log(`newAuthorRes ${newAuthor}`)
      }
      fetchAuthors(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save author:", error);
      // Log Failure (Optional but recommended)
      logAction(`${action}_FAILURE`, "Author", `Không thể lưu tác giả: ${data.name}`);
      alert("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: number) => {
    const authorToDelete = authors.find(a => a.id === id);
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${authorToDelete?.name || 'tác giả này'}?`)) {
      try {
        await AppProviders.DeleteAuthorUseCase.execute(id);
        // Log Delete Action
        await logAction("DELETE", "Author", `Đã xóa tác giả: ${authorToDelete?.name || id}`);
        fetchAuthors(currentPage);
      } catch (error) {
        console.error("Failed to delete author:", error);
        logAction("DELETE_FAILURE", "Author", `Không thể xóa tác giả ID: ${id}`);
        alert("Lỗi khi xóa tác giả.");
      }
    }
  };

  const handleEdit = (author: Author) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-emerald-50 min-h-screen">
      <AuthorModal
        key={selectedAuthor?.id || 'new-author'}
        isOpen={isModalOpen}
        initialData={selectedAuthor}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PenTool className="text-emerald-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-950">Quản lý tác giả</h1>
          </div>
          <p className="text-sm text-emerald-900">Quản lý hồ sơ nhà văn và tiểu sử của họ.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Thêm tác giả mới
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
              Đang hiển thị {authors.length} tác giả
            </span>
            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              Trang {currentPage} trên {totalPages || 1}
            </span>
          </div>

          <AuthorTable
            authors={authors}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
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
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-emerald-50 transition-colors shadow-sm font-medium"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthorPage;
