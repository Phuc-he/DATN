import { RevenueChart } from "@/src/presentation/components/admin/orders/RevenueChart";
import { InventoryChart } from "@/src/presentation/components/admin/products/InventoryChart";
import { AppProviders } from "@/src/provider/provider";

export default async function Home() {
  // Tính doanh thu theo ngày
  const allOrders = await AppProviders.GetAllOrdersUseCase.execute();
  const allProducts = await AppProviders.GetAllBooksUseCase.execute();
  return (
    <div>
      <RevenueChart orders={allOrders}/>
      <InventoryChart products={allProducts} />
    </div>
  );
}
