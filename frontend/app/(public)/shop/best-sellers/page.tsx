'use client';

import { Book } from '@/src/domain/entity/book.entity';
import { Order } from '@/src/domain/entity/order.entity';
import ProductCard from '@/src/presentation/components/public/products/ProductCard';
import { AppProviders } from '@/src/provider/provider';
import { Flame, Loader2, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BestSellersPage() {
  const [products, setProducts] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        // 1. Lấy tất cả đơn hàng từ UseCase
        const allOrders: Order[] = await AppProviders.GetAllOrdersUseCase.execute();
        
        // 2. Logic tính toán số lượng bán ra của từng Book
        const salesMap: Record<number, { book: Book; totalSelled: number }> = {};

        allOrders.forEach(order => {
          // Chỉ tính các đơn hàng đã thanh toán hoặc đã giao để đảm bảo tính chính xác
          // Bạn có thể lọc theo status nếu muốn (ví dụ: status >= 2)
          order.items.forEach(item => {
            const bookId = item.book.id;
            if (bookId) {
              if (!salesMap[bookId]) {
                salesMap[bookId] = { book: item.book, totalSelled: 0 };
              }
              salesMap[bookId].totalSelled += item.quantity;
            }
          });
        });

        // 3. Chuyển Map thành Array và sắp xếp giảm dần theo totalSelled
        const sortedBooks = Object.values(salesMap)
          .sort((a, b) => b.totalSelled - a.totalSelled)
          .slice(0, 10) // Lấy Top 10
          .map(item => item.book);
        
        setProducts(sortedBooks);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Đang phân tích dữ liệu bán chạy...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-orange-500" fill="currentColor" size={24} />
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">
              Hot Trend
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Sách Bán Chạy Nhất
          </h1>
          <p className="text-slate-500 mt-2">
            Những tựa sách được cộng đồng chọn mua nhiều nhất thời gian qua.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl">
          <Trophy className="text-amber-500" size={20} />
          <span className="font-black text-slate-900 text-sm">
            Top {products.length} Thịnh hành
          </span>
        </div>
      </div>

      {/* Grid Section */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <div key={product.id || index} className="relative group">
              {/* Ranking Badge */}
              <div className={`absolute -top-2 -left-2 z-20 shadow-md w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 
                ${index === 0 ? 'bg-amber-400 border-amber-500 text-white' : 
                  index === 1 ? 'bg-slate-300 border-slate-400 text-white' : 
                  index === 2 ? 'bg-orange-300 border-orange-400 text-white' : 
                  'bg-white border-slate-200 text-slate-900'}`}>
                <span className="text-xs font-black">#{index + 1}</span>
              </div>
              
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Hiện chưa có dữ liệu giao dịch để xếp hạng.</p>
        </div>
      )}
    </main>
  );
}