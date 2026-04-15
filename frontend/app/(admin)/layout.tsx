'use client';

import { isAdmin } from '@/src/domain/entity/role.enum';
import AdminSidebar from '@/src/presentation/components/admin/layout/AdminSidebar';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Chờ cho đến khi quá trình tải hoàn tất trước khi đưa ra quyết định
    if (!loading) {
      console.log("AdminLayout", currUser);
      if (!currUser || !isAdmin(currUser.role)) {
        console.warn('Cố gắng truy cập trái phép. Đang chuyển hướng về trang chủ...');
        router.push('/');
      }
    }
  }, [currUser, loading, router]);

  // Ngăn chặn việc hiển thị nội dung admin khi đang kiểm tra quyền truy cập
  if (loading || !currUser || !isAdmin(currUser.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-emerald-900 animate-pulse">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-slate-100 p-8">
        {children}
      </main>
    </div>
  );
}
