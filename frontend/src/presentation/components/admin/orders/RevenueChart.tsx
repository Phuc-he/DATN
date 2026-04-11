'use client';

import { Order } from '@/src/domain/entity/order.entity';
import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type FilterRange = '7d' | '30d' | 'all';

export const RevenueChart = ({ orders }: { orders: Order[] }) => {
  const [range, setRange] = useState<FilterRange>('7d');

  const chartData = useMemo(() => {
    const now = new Date();

    // 1. Lọc đơn hàng dựa trên Range thời gian
    const filteredOrders = orders.filter(o => {
      // Chỉ tính doanh thu cho các đơn hàng hợp lệ (PAID, SHIPPED, DELIVERED)
      // const isRevenueStatus = [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(o.status);
      // if (!isRevenueStatus) return false;

      // Nếu không có createdAt, coi như là đơn hàng mới nhất (now) để tính vào range
      const orderDate = o.createdAt ? new Date(o.createdAt) : now;

      if (range === '7d') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      }
      if (range === '30d') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      }
      return true;
    });

    console.log("orders", orders);
    console.log("filteredOrders", filteredOrders);

    // 2. Nhóm dữ liệu
    const dataMap = filteredOrders.reduce((acc: Record<string, number>, order) => {
      // Sử dụng createdAt hoặc ngày hiện tại làm fallback
      const dateStr = order.createdAt || now.toISOString();

      const date = new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      });

      // Ép kiểu order.totalAmount sang Number để thực hiện phép cộng toán học
      const amount = Number(order.totalAmount) || 0;

      // Thực hiện cộng dồn số
      acc[date] = (acc[date] || 0) + amount;
      return acc;
    }, {});

    console.log("dataMap", dataMap);

    // 3. Chuyển đổi sang định dạng Recharts và Sắp xếp
    return Object.entries(dataMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        return monthA !== monthB ? monthA - monthB : dayA - dayB;
      });
  }, [orders, range]); // Nhớ thêm range vào dependency để cập nhật khi user click filter

  return (
    <div className="h-[450px] w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
      {/* Header & Tool */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="font-black text-slate-950 uppercase tracking-wider text-sm">Thống kê doanh thu</h3>
          <p className="text-xs text-emerald-800 font-bold mt-1">Tổng doanh thu theo thời gian (VNĐ)</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['7d', '30d', 'all'] as FilterRange[]).map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${range === item
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-emerald-800 hover:text-slate-700'
                }`}
            >
              {item === 'all' ? 'TẤT CẢ' : item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 20, right: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontWeight: 'bold'
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => {
                const amount = typeof value === 'number' ? value : 0;
                return [`${amount.toLocaleString('vi-VN')}đ`, 'Doanh thu'];
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#4f46e5"
              strokeWidth={4}
              dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, strokeWidth: 0 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
