'use client';

import { Author } from '@/src/domain/entity/author.entity';
import { Book } from '@/src/domain/entity/book.entity';
import { Category } from '@/src/domain/entity/category.entity';
import ProductModal from '@/src/presentation/components/admin/products/ProductModal';
import ProductTable from '@/src/presentation/components/admin/products/ProductTable';
import { AppProviders } from '@/src/provider/provider';
import { useActivityLogger } from '@/src/presentation/hooks/useActivityLogger'; // Import Logger
import { BookCopy, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const ProductPage = () => {
  const [products, setProducts] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Set default to 1 for consistency
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Book | null>(null);

  // Initialize the activity logger
  const { logAction } = useActivityLogger();

  const fetchCategories = async () => {
    try {
      const result = await AppProviders.GetAllCategoriesUseCase.execute();
      setCategories(result);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const result = await AppProviders.GetAllAuthorsUseCase.execute();
      setAuthors(result);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
    }
  };

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const result = await AppProviders.GetBooksByPageUseCase.execute(page - 1, 10);
      setProducts(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAuthors();
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Book) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Book) => {
    let action = "UPDATE";
    try {
      if (selectedProduct?.id) {
        await AppProviders.UpdateBookUseCase.execute(selectedProduct.id, data);
        await logAction(action, "Book", `Updated book: ${data.title} (ID: ${selectedProduct.id})`);
      } else {
        action = "CREATE";
        await AppProviders.CreateBookUseCase.execute(data);
        await logAction(action, "Book", `Added new book to catalog: ${data.title}`);
      }
      fetchProducts(currentPage);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
      logAction(`${action}_FAILURE`, "Book", `Failed to save book: ${data.title}`);
      alert("Error saving product. Please check the required fields.");
    }
  };

  const handleDelete = async (id: number) => {
    const bookToDelete = products.find(p => p.id === id);
    if (window.confirm(`Are you sure you want to delete "${bookToDelete?.title || 'this book'}"?`)) {
      try {
        await AppProviders.DeleteBookUseCase.execute(id);
        await logAction("DELETE", "Book", `Deleted book: ${bookToDelete?.title || id}`);
        fetchProducts(currentPage);
      } catch (error) {
        console.error("Failed to delete product:", error);
        logAction("DELETE_FAILURE", "Book", `Failed to delete book ID: ${id}`);
        alert("Error deleting product");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <ProductModal
        authors={authors}
        key={selectedProduct?.id || 'new-book'}
        isOpen={isModalOpen}
        initialData={selectedProduct}
        categories={categories}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookCopy className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
          </div>
          <p className="text-sm text-slate-500">Inventory control and book catalog management.</p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Add New Book
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
              Total Books: {products.length}
            </span>
            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

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
        </>
      )}
    </div>
  );
};

export default ProductPage;