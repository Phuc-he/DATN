'use client';

import { Category } from '@/src/domain/entity/category.entity';
import { AppProviders } from '@/src/provider/provider';
import { useWebSettings } from '@/src/presentation/context/WebSettingContext';
import * as Icons from 'lucide-react';
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  Twitter
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { settings } = useWebSettings();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await AppProviders.GetCategoriesByPageUseCase.execute(0, 5);
        setCategories(data.content.slice(0, 5));
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FooterIcon = (settings?.headerIcon && (Icons as any)[settings.headerIcon])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (Icons as any)[settings.headerIcon]
    : Icons.BookOpen;

  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-950">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Thương hiệu & Sứ mệnh */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-white">
              {settings?.logoUrl ? (
                <div className="relative h-8 w-8">
                  <Image src={settings.logoUrl} alt="Logo" fill className="object-contain" />
                </div>
              ) : (
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <FooterIcon className="text-emerald-900" size={24} />
                </div>
              )}
              <span className="text-2xl font-black tracking-tighter">
                {settings?.webName || "BookHaven"}<span className="text-emerald-900">.</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed font-medium">
              {settings?.footerText || "Tuyển chọn những câu chuyện truyền cảm hứng, giáo dục và đưa bạn đi xa. Từ những tác phẩm kinh điển vượt thời gian đến những kiệt tác hiện đại, hãy tìm cuộc phiêu lưu tiếp theo của bạn tại đây."}
            </p>
            <div className="flex gap-5">
              <Link href="#" className="p-2 bg-slate-950 rounded-full hover:text-emerald-900 hover:bg-slate-800 transition-all"><Facebook size={18} /></Link>
              <Link href="#" className="p-2 bg-slate-950 rounded-full hover:text-emerald-900 hover:bg-slate-800 transition-all"><Instagram size={18} /></Link>
              <Link href="#" className="p-2 bg-slate-950 rounded-full hover:text-emerald-900 hover:bg-slate-800 transition-all"><Twitter size={18} /></Link>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-[0.2em]">Thể loại</h4>
            <ul className="space-y-4 text-sm font-medium">
              {categories.map((category, index) => (
                <li key={`${category.id}_${index}`}>
                  <Link href={`/shop/search?category=${category.id}`} className="hover:text-emerald-900 transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-[0.2em]">Liên hệ</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-start gap-4">
                <MapPin className="text-emerald-900 shrink-0" size={20} />
                <span className="leading-relaxed">298 đường Cầu Diễn, phường Tây Tựu,<br />quận Bắc Từ Liêm, Hà Nội</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-emerald-900 shrink-0" size={20} />
                <span>(024) 123-4567</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-emerald-900 shrink-0" size={20} />
                <span className="text-slate-200">{settings?.contactEmail || "support@bookhaven.com"}</span>
              </li>
            </ul>
          </div>

          {/* Bản tin */}
          <div>
            <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-[0.2em]">Bản tin</h4>
            <p className="text-xs text-emerald-900 mb-4 font-black uppercase tracking-widest">Giảm 10% cho đơn hàng đầu tiên</p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Địa chỉ Email"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 p-2.5 rounded-lg hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
                <ArrowRight size={18} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Thanh tính năng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10 border-y border-slate-950 mb-10">
          <div className="flex items-center gap-5 group">
            <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
              <Truck className="text-emerald-900" size={28} />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">Miễn phí giao hàng</p>
              <p className="text-xs text-emerald-800 font-medium">Đơn hàng trên 500k VNĐ</p>
            </div>
          </div>
          <div className="flex items-center gap-5 px-0 md:px-10 md:border-x border-slate-950 group">
            <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
              <ShieldCheck className="text-emerald-900" size={28} />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">Thanh toán bảo mật</p>
              <p className="text-xs text-emerald-800 font-medium">Được bảo vệ 100%</p>
            </div>
          </div>
          <div className="flex items-center gap-5 group">
            <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
              <Package className="text-emerald-900" size={28} />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">Đổi trả dễ dàng</p>
              <p className="text-xs text-emerald-800 font-medium">Bảo đảm trong 30 ngày</p>
            </div>
          </div>
        </div>

        {/* Thanh dưới cùng */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
            &copy; {currentYear} {settings?.webName || "BookHaven"}. Được xây dựng bởi tình yêu với sách.
          </p>
          <div className="flex gap-8 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
            <Link href="#" className="hover:text-emerald-900 transition-colors">Bảo mật</Link>
            <Link href="#" className="hover:text-emerald-900 transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-emerald-900 transition-colors">Giao hàng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
