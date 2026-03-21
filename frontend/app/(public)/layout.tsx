// src/app/(public)/layout.tsx
import Footer from '@/src/presentation/components/public/layout/Footer';
import { Navbar } from '@/src/presentation/components/public/layout/Navbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='bg-white'>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}