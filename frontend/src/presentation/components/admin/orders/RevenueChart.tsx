'use client';
import { OrderEntity } from '@/src/domain/entity/order.entity';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';

type FilterRange = '7d' | '30d' | 'all';

export const RevenueChart = ({ orders }: { orders: OrderEntity[] }) => {
  const [range, setRange] = useState<FilterRange>('7d');

  // Xử lý dữ liệu dùng useMemo để tránh tính toán lại khi không cần thiết
  const chartData = useMemo(() => {
    const now = new Date();

    // 1. Lọc đơn hàng theo thời gian và trạng thái
    const filteredOrders = orders.filter(o => {
      if (!o.isPaid || !o.createdAt) return false;
      const orderDate = new Date(o.createdAt);

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
      return true; // range === 'all'
    });

    // 2. Nhóm dữ liệu theo ngày
    const dataMap = filteredOrders.reduce((acc: Record<string, number>, order) => {
      const date = new Date(order.createdAt!).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      });
      acc[date] = (acc[date] || 0) + order.totalPrice;
      return acc;
    }, {});

    // 3. Chuyển sang format mảng cho Recharts và sắp xếp theo thời gian
    return Object.entries(dataMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        // Tách chuỗi DD/MM để so sánh
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        return monthA !== monthB ? monthA - monthB : dayA - dayB;
      });
  }, [orders, range]);

  return (
    <div className="h-[450px] w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
      {/* Header & Tool */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">Revenue Insights</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">Total revenue over time</p>
        </div>

        {/* Filter Tool */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['7d', '30d', 'all'] as FilterRange[]).map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${range === item
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <LineChart data={chartData} margin={{ left: -10, right: 10 }}>
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontWeight: 'bold'
              }}
              // Sửa ở đây: Chấp nhận kiểu ValueType (any/string/number) và kiểm tra trước khi toFixed
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => {
                const amount = typeof value === 'number' ? value : 0;
                return [`$${amount.toFixed(2)}`, 'Revenue'];
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