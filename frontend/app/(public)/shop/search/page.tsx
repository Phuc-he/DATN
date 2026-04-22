import { Book } from "@/src/domain/entity/book.entity";
import ProductCard from "@/src/presentation/components/public/products/ProductCard";
import { ShopSidebar } from "@/src/presentation/components/public/shop/ShopSidebar";
import { AppProviders } from "@/src/provider/provider";
import { filterProducts } from "@/src/shared/product-filter";
import { Filter, X } from "lucide-react";
import Link from "next/link";

interface ShopPageProps {
  searchParams: Promise<{
    category?: number;
    sort?: string;
    format?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string; // Truy vấn tìm kiếm
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, minPrice, maxPrice, q } = await searchParams;

  // 1. Phân tách định dạng từ URL: ['Paperback', 'Hardcover']
  const min = minPrice ? parseFloat(minPrice) : 0;
  const max = maxPrice ? parseFloat(maxPrice) : Infinity;

  // 2. Tải dữ liệu song song
  const [categories, productsResult] = await Promise.all([
    AppProviders.GetAllCategoriesUseCase.execute(),
    AppProviders.GetBooksByPageUseCase.execute(0, 100), // Lấy tập dữ liệu đủ lớn để lọc
  ]);

  const products = filterProducts(productsResult.content, {
    min: min,
    max: max,
    category: Number(category),
    q: q
  })

  return (
    <div className="bg-emerald-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-8 py-10">

        {/* Tiêu đề & Trạng thái */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-950 tracking-tight">
              {q ? `Kết quả cho "${q}"` : "Cửa hàng Sách"}
            </h1>
            <p className="text-emerald-900 mt-2">
              Tìm thấy {products.length} cuốn sách phù hợp với lựa chọn của bạn.
            </p>
          </div>

          {/* Nút xóa bộ lọc đang hoạt động */}
          {(category || minPrice || q) && (
            <Link
              href="/shop/search"
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 px-4 py-2 rounded-full transition-colors w-fit"
            >
              <X size={14} /> Xóa tất cả bộ lọc
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bộ lọc bên lề */}
          <ShopSidebar categories={categories} baseUrl={""} maxPrice={max.toString()} minPrice={min.toString()} query={q} currentCategory={category ? Number(category) : undefined} />

          {/* Lưới sản phẩm */}
          <main className="lg:col-span-9">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Book) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] py-32 px-10 text-center border border-dashed border-slate-300 flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <Filter size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">Không tìm thấy sách</h3>
                <p className="text-slate-400 mt-2 max-w-xs mx-auto">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn để tìm thấy thứ bạn đang tìm kiếm.</p>
                <Link href="/shop" className="mt-8 px-8 py-3 bg-slate-950 text-white rounded-full font-bold hover:bg-emerald-600 transition-all">
                  Duyệt tất cả sách
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
