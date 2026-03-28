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
    let action: string= "UPDATE";
    try {
      if (selectedAuthor?.id) {
        // Log Update Action
        await AppProviders.UpdateAuthorUseCase.execute(selectedAuthor.id, data);
        await logAction(action, "Author", `Updated author: ${data.name} (ID: ${selectedAuthor.id})`);
      } else {       
        action = "CREATE";
        const newAuthor = await AppProviders.CreateAuthorUseCase.execute(data);
        await logAction(action, "Author", `Created new author: ${data.name}`);
        console.log(`newAuthorRes ${newAuthor}`)
      }
      fetchAuthors(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save author:", error);
      // Log Failure (Optional but recommended)
      logAction(`${action}_FAILURE`, "Author", `Failed to save author: ${data.name}`);
      alert("Operation failed. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    const authorToDelete = authors.find(a => a.id === id);
    if (window.confirm(`Are you sure you want to delete ${authorToDelete?.name || 'this author'}?`)) {
      try {
        await AppProviders.DeleteAuthorUseCase.execute(id);
        // Log Delete Action
        await logAction("DELETE", "Author", `Deleted author: ${authorToDelete?.name || id}`);
        fetchAuthors(currentPage);
      } catch (error) {
        console.error("Failed to delete author:", error);
        logAction("DELETE_FAILURE", "Author", `Failed to delete author ID: ${id}`);
        alert("Error deleting author.");
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
    <div className="p-8 bg-slate-50 min-h-screen">
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
            <PenTool className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-900">Author Management</h1>
          </div>
          <p className="text-sm text-slate-500">Manage writer profiles and their biographies.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Add New Author
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-slate-500 font-medium">
              Showing {authors.length} authors
            </span>
            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              Page {currentPage} of {totalPages || 1}
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
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm font-medium"
              >
                Previous
              </button>

              <div className="flex items-center px-4 bg-blue-600 rounded-lg text-white font-bold shadow-inner">
                {currentPage}
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm font-medium"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuthorPage;