import { Book } from "@/src/domain/entity/book.entity";
import ProductCard from "@/src/presentation/components/public/products/ProductCard";
import { ShopSidebar } from "@/src/presentation/components/public/shop/ShopSidebar";
import { AppProviders } from "@/src/provider/provider";
import { filterProducts } from "@/src/shared/product-filter";
import Link from "next/link";

interface ShopPageProps {
  searchParams: Promise<{
    category?: number;
    sort?: string;
    format?: string;
    minPrice?: string; // New
    maxPrice?: string; // New
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, minPrice, maxPrice } = await searchParams;

  // Convert comma-separated string from URL into an array: ['Paperback', 'Hardcover']
  const min = minPrice ? parseFloat(minPrice) : 0;
  const max = maxPrice ? parseFloat(maxPrice) : Infinity;

  const [categories, productsResult] = await Promise.all([
    AppProviders.GetAllCategoriesUseCase.execute(),
    AppProviders.GetBooksByPageUseCase.execute(0, 50), // Fetch more for filtering
  ]);

  const products = filterProducts(productsResult.content, {
    min: min,
    max: max,
    category: Number(category),
  })

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">The Bookshop</h1>
          <p className="text-slate-500 mt-2">Discover your next favorite story among our curated collection.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar Filters */}
          <ShopSidebar categories={categories} baseUrl={""} maxPrice={max.toString()} minPrice={min.toString()} />

          {/* Product Grid */}
          <section className="lg:col-span-9">
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
              <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No books found matching your criteria.</p>
                <Link href="/shop" className="text-blue-600 font-bold mt-2 inline-block hover:underline">
                  Reset all filters
                </Link>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}