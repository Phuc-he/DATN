import { CategoryDistributionChart } from "@/src/presentation/components/admin/categories/CategoryDistributionChart";
import { CategoryRevenueChart } from "@/src/presentation/components/admin/orders/CategoryRevenueChart";
import { RevenueChart } from "@/src/presentation/components/admin/orders/RevenueChart";
import { InventoryChart } from "@/src/presentation/components/admin/products/InventoryChart";
import { AppProviders } from "@/src/provider/provider";

export default async function Home() {
  const allOrders = await AppProviders.GetAllOrdersUseCase.execute();
  const allProducts = await AppProviders.GetAllBooksUseCase.execute();

  return (
    // Add padding and a background color to match the sidebar
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Row: Distribution and Revenue Breakdown */}
        <CategoryDistributionChart />
        <CategoryRevenueChart orders={allOrders} />

        {/* Bottom Row: Trends and Inventory */}
        <div className="lg:col-span-2">
           <RevenueChart orders={allOrders} />
        </div>
        
        <div className="lg:col-span-2">
           <InventoryChart products={allProducts} />
        </div>

      </div>
    </div>
  );
}