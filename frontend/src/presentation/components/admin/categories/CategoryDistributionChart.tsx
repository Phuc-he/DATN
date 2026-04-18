'use client';

import { Category } from '@/src/domain/entity/category.entity';
import { AppProviders } from '@/src/provider/provider';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface CategoryData {
  name: string;
  count: number;
}

export const CategoryDistributionChart = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch all categories
      const allCategories: Category[] = await AppProviders.GetAllCategoriesUseCase.execute();

      // 2. Fetch counts for each category in parallel
      const chartData = await Promise.all(
        allCategories.map(async (cat) => {
          const count = await AppProviders.GetCategoryStatsUseCase.execute(cat.id!);
          return {
            name: cat.name,
            count: count,
          };
        })
      );

      // 3. Sort by count descending
      setData(chartData.sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error("Failed to fetch category stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Modern color palette for categories
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  if (!isMounted || loading) {
    return <div className="h-[500px] w-full bg-emerald-50 animate-pulse rounded-3xl" />;
  }

  return (
    <div className="h-[500px] w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex flex-col mb-8">
        <h3 className="font-black text-slate-950 uppercase tracking-tight text-sm">
          Phân bổ danh mục
        </h3>
        <p className="text-xs text-emerald-800 font-bold mt-1">Tổng số sách được sắp xếp theo danh mục</p>
      </div>

      <div className="flex-1 h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 30, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [value, 'Cuốn sách']}
            />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              barSize={24}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 pointer-events-none">
          <p className="text-slate-400 font-bold text-sm italic">Không có dữ liệu</p>
        </div>
      )}
    </div>
  );
};
