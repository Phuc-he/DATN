'use client';

import { isAuthor } from '@/src/domain/entity/role.enum';
import AuthorSidebar from '@/src/presentation/components/author/layout/AuthorSidebar';
import { useAuth } from '@/src/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthorLayout({ children }: { children: React.ReactNode }) {
  const { currUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is finished before making a decision
    if (!loading) {
      if (!currUser || !isAuthor(currUser.role)) {
        console.warn('Unauthorized access attempt. Redirecting to home...');
        router.push('/');
      }
    }
  }, [currUser, loading, router]);

  // Prevent "flicker" of admin content while checking permissions
  if (loading || !currUser || !isAuthor(currUser.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500 animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AuthorSidebar />
      <main className="flex-1 bg-slate-100 p-8">
        {children}
      </main>
    </div>
  );
}