import { Book } from "@/src/domain/entity/book.entity";
import { Category } from "@/src/domain/entity/category.entity";
import { Order } from "@/src/domain/entity/order.entity";
import CategoryCircles from "@/src/presentation/components/public/home/CategoryCircles";
import HomeBanner from "@/src/presentation/components/public/home/HomeBanner";
import ProductSection from "@/src/presentation/components/public/products/ProductSection";
import { AppProviders } from "@/src/provider/provider";

export default async function Home() {
  // 1. Fetch Categories & All Books
  const [categories, allProducts]: [Category[], Book[]] = await Promise.all([
    AppProviders.GetAllCategoriesUseCase.execute(),
    AppProviders.GetAllBooksUseCase.execute()
  ]);

  // 2. Process New Arrivals: Sắp xếp theo createdAt (Mới nhất lên đầu)
  const newArrivals = [...allProducts]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  // 3. Process Bestsellers: Tính toán từ lịch sử đơn hàng
  // Lấy tất cả đơn hàng để đếm số lượng bán ra của từng sách
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
    .filter(book => (book.id ? (salesMap[book.id] || 0) : 0) > 0) // Chỉ hiện sách đã có lượt bán
    .slice(0, 5);

  // Trường hợp chưa có đơn hàng nào, lấy 5 cuốn ngẫu nhiên hoặc mặc định để không để trống UI
  const displayBestSellers = bestSellers.length > 0 ? bestSellers : allProducts.slice(5, 10);

  return (
    <div className="bg-white min-h-screen">
      <HomeBanner />

      <CategoryCircles categories={categories} />

      <ProductSection
        title="Sách Mới Về"
        subtitle="Khám phá những tựa sách mới nhất vừa cập bến cửa hàng."
        products={newArrivals}
        viewAllHref="/shop/new-arrivals"
      />

      <ProductSection
        title="Bán Chạy Trong Tuần"
        subtitle="Những cuốn sách được yêu thích nhất. Xem mọi người đang đọc gì nhé."
        products={displayBestSellers}
        viewAllHref="/shop/best-sellers"
      />
    </div>
  );
}