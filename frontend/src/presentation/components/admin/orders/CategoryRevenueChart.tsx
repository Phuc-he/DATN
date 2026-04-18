'use client';

import { Order } from '@/src/domain/entity/order.entity';
import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Bảng màu sắc cho các phần của biểu đồ
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const CategoryRevenueChart = ({ orders }: { orders: Order[] }) => {

  const chartData = useMemo(() => {
    // 1. Lọc các đơn hàng hợp lệ để tính doanh thu
    const validOrders = orders.filter(() =>
      true
    );

    // 2. Gom nhóm doanh thu theo Category Name
    const categoryMap: Record<string, number> = {};

    validOrders.forEach(order => {
      order.items.forEach(item => {
        // Lấy tên danh mục, nếu không có thì để là "Khác"
        const categoryName = item.book.category?.name || 'Khác';

        // Tính doanh thu của item này (Sử dụng hàm Number() để tránh lỗi cộng chuỗi)
        const itemRevenue = (Number(item.unitPrice) - Number(item.discount)) * item.quantity;

        categoryMap[categoryName] = (categoryMap[categoryName] || 0) + itemRevenue;
      });
    });

    // 3. Chuyển đổi sang định dạng mảng cho Recharts
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100 // Làm tròn 2 chữ số thập phân
    })).sort((a, b) => b.value - a.value); // Sắp xếp từ cao xuống thấp
  }, [orders]);

  return (
    <div className="h-[450px] w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
      <div className="mb-6">
        <h3 className="font-black text-slate-950 uppercase tracking-wider text-sm">Doanh thu theo danh mục</h3>
        <p className="text-xs text-emerald-800 font-bold mt-1">Phân bổ nguồn thu dựa trên loại sách</p>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%" // Center it vertically
              innerRadius="60%" // Use percentages for better responsiveness
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontWeight: 'bold'
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
            />

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
