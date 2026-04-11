'use client';

import { ArrowRight, BookOpen, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { useRouter } from 'next/dist/client/components/navigation';
import Image from 'next/image';

const HomeBanner = () => {
  const router = useRouter();
  return (
    <section className="relative w-full bg-[#f8fafc] overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-40" />

      <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} className="text-emerald-900" />
              Your Curated Literary Journey
            </div>

            <h1 className="text-6xl lg:text-8xl font-black text-slate-950 leading-[0.95] tracking-tighter">
              Turn the Page to <br />
              <span className="text-emerald-600 font-serif italic font-medium">Infinite Worlds.</span>
            </h1>

            <p className="text-xl text-emerald-800 max-w-lg leading-relaxed font-medium">
              Beyond the covers lie stories that reshape reality. Join our community of readers and find the book that speaks to your soul.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button
                className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
                onClick={() => router.push('/shop')}
              >
                <ShoppingCart size={20} />
                Explore Collection
              </button>

              <button
                className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-950 px-10 py-5 rounded-2xl font-bold hover:border-emerald-600 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
                onClick={() => router.push("/shop/best-sellers")}
              >
                Monthly Top Picks
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Social Proof / Trust */}
            <div className="pt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" width={40} height={40} />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-emerald-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm font-bold text-slate-800">2,500+ Reader Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Visual Element - Minimalist Book Aesthetic */}
          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="relative z-20 w-[420px] h-[580px] mx-auto group">
              {/* Modern Soft Shadow */}
              <div className="absolute inset-0 bg-emerald-400 rounded-[2.5rem] rotate-6 scale-90 opacity-10 blur-3xl group-hover:rotate-12 transition-transform duration-700" />

              <div className="relative h-full w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border-[12px] border-white">
                <Image
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000"
                  alt="Elegant Bookshelf"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Glassmorphism Overlay on Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>

              {/* Floating "Live" Badge */}
              <div className="absolute -top-4 -right-4 bg-white p-5 rounded-3xl shadow-2xl border border-emerald-50 flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Editor&apos;s Choice</p>
                  <p className="text-base font-black text-slate-950 leading-none mt-1">Silent Spring</p>
                </div>
              </div>
            </div>

            {/* Background Decorative Frame */}
            <div className="absolute -bottom-10 -left-10 w-48 h-64 bg-slate-100 rounded-[2rem] -rotate-6 -z-10 border border-slate-200/50" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
