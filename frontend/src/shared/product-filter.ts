// src/shared/utils/product-filter.ts
import { Book } from "@/src/domain/entity/book.entity";
import { Order } from "@/src/domain/entity/order.entity";
import { OrderStatus } from "@/src/domain/entity/order-status.enum";

export const filterProducts = (
  products: Book[],
  filters: {
    category?: number;
    min: number;
    max: number;
    q?: string;
  }
) => {
  let filtered = [...products];

  // 1. Lọc theo từ khóa (Tìm trong Tiêu đề hoặc Tên tác giả)
  if (filters.q) {
    const s = filters.q.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(s) || 
      (p.author?.name && p.author.name.toLowerCase().includes(s))
    );
  }

  // 2. Lọc theo Danh mục (So sánh ID của Category)
  if (filters.category) {
    filtered = filtered.filter(p => 
      p.category?.id === filters.category
    );
  }

  // 4. Lọc theo Khoảng giá (Tính toán sau khi đã áp dụng discount)
  filtered = filtered.filter(p => {
    const finalPrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return finalPrice >= filters.min && finalPrice <= filters.max;
  });

  return filtered;
};

/**
 * Logic gợi ý: "Sản phẩm thường được mua cùng nhau"
 * Dựa trên lịch sử các đơn hàng đã hoàn tất/thanh toán.
 */
export const getFrequentlyBoughtTogether = (
  currentProductId: number, // Chuyển sang number để khớp với id của Book entity
  allOrders: Order[]
) => {
  const coOccurrenceMap = new Map<number, number>();

  allOrders
    .filter(order => order.status === OrderStatus.DELIVERED) // Chỉ tính các đơn đã hoàn tất
    .forEach(order => {
      // Truy cập vào order.items (OrderItem[]) -> book.id
      const itemIds = order.items
        .map(item => item.book.id)
        .filter((id): id is number => id !== undefined);

      // Nếu đơn hàng có chứa sản phẩm hiện tại
      if (itemIds.includes(currentProductId)) {
        itemIds.forEach(id => {
          if (id !== currentProductId) {
            coOccurrenceMap.set(id, (coOccurrenceMap.get(id) || 0) + 1);
          }
        });
      }
    });

  // Sắp xếp các Book ID theo tần suất xuất hiện giảm dần
  return Array.from(coOccurrenceMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4) // Lấy top 4 gợi ý
    .map(entry => entry[0]);
};