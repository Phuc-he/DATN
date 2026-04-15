import { Book } from "@/src/domain/entity/book.entity";
import ProductDetails from "@/src/presentation/components/public/products/ProductDetails";
import { SuggestedProducts } from "@/src/presentation/components/public/products/SuggestedProducts";
import { AppProviders } from "@/src/provider/provider";
import { getFrequentlyBoughtTogether } from "@/src/shared/product-filter";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;

  let product;
  const allOrders = await AppProviders.GetAllOrdersUseCase.execute();
  const suggestedProducts: Book[] = [];

  try {
    product = await AppProviders.GetBookUseCase.execute(id);

    if (!product) return notFound();

    const ids = getFrequentlyBoughtTogether(product.id || 0, allOrders);
    console.log("ids", ids);
    for (const i of ids) {
      try {
        console.log("id", i);
        suggestedProducts.push(await AppProviders.GetBookUseCase.execute(i));
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    }
    if (suggestedProducts.length < 10) {
      const top = await AppProviders.GetBooksByPageUseCase.execute(1, 10);
      
      for (const p of top.content.slice(0, 10 - suggestedProducts.length)) {
        suggestedProducts.push(p);
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    return notFound();
  }

  return (
    <main className="animate-in fade-in duration-500">
      {/* ✅ Đã loại bỏ onAddToCart.
          Component ProductDetails (là một client component)
          nên tự xử lý các sự kiện click hoặc sử dụng Context/Zustand store.
      */}
      <ProductDetails product={product} />

      <div className="w-full max-w-6xl mx-auto border-t border-slate-100 mt-12 pt-8">
        <SuggestedProducts suggestions={suggestedProducts} />
      </div>
    </main>
  );
}
