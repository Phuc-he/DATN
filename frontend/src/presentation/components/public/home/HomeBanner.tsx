'use client';

import { ArrowRight, BookOpen, ShoppingCart, Sparkles } from 'lucide-react';
import { useRouter } from 'next/dist/client/components/navigation';
import Image from 'next/image';

const HomeBanner = () => {
  const router = useRouter();
  return (
    <section className="relative w-full bg-slate-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              New Season, New Stories
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight">
              Unlock Your Next <br />
              <span className="text-blue-600 italic">Great Adventure.</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Explore thousands of titles from world-renowned authors. From gripping thrillers to heart-warming romances, your perfect story is waiting to be discovered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-200 active:scale-95"
              onClick={() => router.push('/shop')}>
                <ShoppingCart size={20} />
                Shop Now
              </button>
              
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
               onClick={() => router.push("/shop/best-sellers")}>
                View Best Sellers
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Trust Stats */}
            <div className="pt-8 flex items-center gap-8 border-t border-slate-200">
              <div>
                <p className="text-2xl font-bold text-slate-900">50k+</p>
                <p className="text-xs text-slate-500 uppercase font-semibold">Books Sold</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">12k+</p>
                <p className="text-xs text-slate-500 uppercase font-semibold">Happy Readers</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">4.9/5</p>
                <p className="text-xs text-slate-500 uppercase font-semibold">Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Right Visual Element */}
          <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-200">
            {/* Main Featured Book Mockup */}
            <div className="relative z-20 w-[400px] h-[550px] mx-auto group">
               <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 scale-95 opacity-20 blur-xl group-hover:rotate-6 transition-transform duration-500" />
               <div className="relative h-full w-full bg-slate-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                 <Image 
                   src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" 
                   alt="Featured Book"
                   fill
                   className="object-cover"
                 />
               </div>

               {/* Floating Tag */}
               <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
                  <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Book of the Week</p>
                    <p className="text-sm font-bold text-slate-900">The Midnight Library</p>
                  </div>
               </div>
            </div>

            {/* Smaller Secondary Elements */}
            <div className="absolute top-10 -right-4 w-32 h-44 bg-slate-300 rounded-lg shadow-lg rotate-12 -z-10 opacity-60 overflow-hidden">
               <Image 
                 src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400" 
                 alt="Background book"
                 fill
                 className="object-cover"
               />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeBanner;