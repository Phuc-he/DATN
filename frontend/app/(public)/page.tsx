import { Book } from "@/src/domain/entity/book.entity";
import { Category } from "@/src/domain/entity/category.entity";
import { Order } from "@/src/domain/entity/order.entity";
import { Author } from "@/src/domain/entity/author.entity";
import CategoryCircles from "@/src/presentation/components/public/home/CategoryCircles";
import HomeBanner from "@/src/presentation/components/public/home/HomeBanner";
import ProductSection from "@/src/presentation/components/public/products/ProductSection";
import AuthorSection from "@/src/presentation/components/public/authors/AuthorSection";
import { AppProviders } from "@/src/provider/provider";

export default async function Home() {
  // 1. Fetch Categories, Books, and Authors
  const [categories, allProducts, authors]: [Category[], Book[], Author[]] = await Promise.all([
    AppProviders.GetAllCategoriesUseCase.execute(),
    AppProviders.GetAllBooksUseCase.execute(),
    AppProviders.GetAllAuthorsUseCase.execute() // Assuming this UseCase exists
  ]);

  // 2. Process New Arrivals: Sort by createdAt (Newest first)
  const newArrivals = [...allProducts]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  // 3. Process Bestsellers: Calculate from Order History
  const allOrders: Order[] = await AppProviders.GetAllOrdersUseCase.execute();
  
  const salesMap: Record<number, number> = {};
  allOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.book.id) {
        salesMap[item.book.id] = (salesMap[item.book.id] || 0) + item.quantity;
      }
    });
  });

  const bestSellers = [...allProducts]
    .sort((a, b) => {
      const salesA = a.id ? (salesMap[a.id] || 0) : 0;
      const salesB = b.id ? (salesMap[b.id] || 0) : 0;
      return salesB - salesA;
    })
    .filter(book => (book.id ? (salesMap[book.id] || 0) : 0) > 0)
    .slice(0, 5);

  const displayBestSellers = bestSellers.length > 0 ? bestSellers : allProducts.slice(5, 10);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HomeBanner />

      {/* Categories Navigation */}
      <CategoryCircles categories={categories} />

      {/* New Books Section */}
      <ProductSection
        title="Sách Mới Về"
        subtitle="Khám phá những tựa sách mới nhất vừa cập bến cửa hàng."
        products={newArrivals}
        viewAllHref="/shop/new-arrivals"
      />

      {/* Featured Authors Section - Added Here */}
      <AuthorSection authors={authors} />

      {/* Bestsellers Section */}
      <ProductSection
        title="Bán Chạy Trong Tuần"
        subtitle="Những cuốn sách được yêu thích nhất. Xem mọi người đang đọc gì nhé."
        products={displayBestSellers}
        viewAllHref="/shop/best-sellers"
      />
    </div>
  );
}
