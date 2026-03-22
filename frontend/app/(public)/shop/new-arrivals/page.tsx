'use client';

import { Book } from '@/src/domain/entity/book.entity';
import ProductCard from '@/src/presentation/components/public/products/ProductCard';
import { AppProviders } from '@/src/provider/provider';
import { Calendar, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const data: Book[] = await AppProviders.GetAllBooksUseCase.execute();
        
        // Sort by createdAt date (Newest first)
        const sorted = data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        
        setProducts(sorted);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Đang cập nhật sách mới...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-blue-500" fill="currentColor" size={24} />
            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
              Vừa cập bến
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Sách Mới Phát Hành
          </h1>
          <p className="text-slate-500 mt-2">
            Đừng bỏ lỡ những tựa sách mới nhất vừa được cập nhật trên kệ sách của chúng tôi.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          <Calendar className="text-slate-400" size={18} />
          <span className="text-slate-600 font-black text-sm uppercase">
            {new Date().toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>

      {/* Product Grid Section */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Hiện chưa có sản phẩm mới nào.</p>
        </div>
      )}
    </main>
  );
}