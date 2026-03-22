'use client';

import { Category } from '@/src/domain/entity/category.entity';
import { AppProviders } from '@/src/provider/provider';
import { useWebSettings } from '@/src/presentation/context/WebSettingContext'; // Import context
import * as Icons from 'lucide-react'; // Import for dynamic icons
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
  const { settings } = useWebSettings(); // 1. Access global settings
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

  // 2. Resolve dynamic icon for the footer logo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FooterIcon = (settings?.headerIcon && (Icons as any)[settings.headerIcon]) 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (Icons as any)[settings.headerIcon] 
    : Icons.BookOpen;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              {settings?.logoUrl ? (
                <div className="relative h-7 w-7">
                   <Image src={settings.logoUrl} alt="Logo" fill className="object-contain" />
                </div>
              ) : (
                <FooterIcon className="text-blue-500" size={28} />
              )}
              <span className="text-2xl font-bold tracking-tight">
                {settings?.webName || "BookHaven"}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {/* 3. Use custom footer text if available */}
              {settings?.footerText || "Curating stories that inspire, educate, and transport you. From timeless classics to modern masterpieces, find your next adventure here."}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-blue-500 transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Shop Categories</h4>
            <ul className="space-y-4 text-sm">
              {categories.map((category, index) => (
                <li key={`${category.id}_${index}`}>
                  <Link href={`/shop/search?category=${category.id}`} className="hover:text-white transition-colors">{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Customer Support</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-500 shrink-0" size={18} />
                <span>298 đường Cầu Diễn, phường Tây Tựu,<br />quận Bắc Từ Liêm, TP. Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-blue-500 shrink-0" size={18} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-500 shrink-0" size={18} />
                {/* 4. Use custom contact email */}
                <span>{settings?.contactEmail || "support@bookhaven.com"}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Join Our Reader List</h4>
            <p className="text-xs text-slate-500 mb-4 uppercase font-bold tracking-widest">Get 10% off your first order</p>
            <form className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-md hover:bg-blue-700 transition-colors">
                <ArrowRight size={18} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Features Bar (Kept static as these are core business features) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-slate-800 mb-8">
          <div className="flex items-center gap-4">
            <Truck className="text-blue-500" size={32} />
            <div>
              <p className="text-white font-semibold text-sm">Free Shipping</p>
              <p className="text-xs text-slate-500">On all orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-slate-800 md:border-x px-0 md:px-8">
            <ShieldCheck className="text-blue-500" size={32} />
            <div>
              <p className="text-white font-semibold text-sm">Secure Payment</p>
              <p className="text-xs text-slate-500">100% protected transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Package className="text-blue-500" size={32} />
            <div>
              <p className="text-white font-semibold text-sm">Easy Returns</p>
              <p className="text-xs text-slate-500">30-day money-back guarantee</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} {settings?.webName || "BookHaven"}. All rights reserved. Built for bibliophiles.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;