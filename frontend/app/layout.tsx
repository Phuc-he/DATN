import { CartProvider } from "@/src/presentation/context/CartContext";
import { FirebaseProvider } from "@/src/presentation/context/FirebaseContext";
import { WebSettingProvider } from "@/src/presentation/context/WebSettingContext";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import React from "react";
import "./globals.css";
import { OrderProvider } from "@/src/presentation/context/OrderContext";

const inter = Inter({
  subsets: ["latin", "vietnamese"], // Critical: Add vietnamese here
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Cửa hàng sách trực tuyến",
  description: "Ứng dụng mua sắm sách trực tuyến được tạo bởi Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <React.StrictMode>
          <FirebaseProvider>
            <WebSettingProvider> {/* Wrapped settings here */}
              <CartProvider>
                <OrderProvider>
                  {children}
                </OrderProvider>
              </CartProvider>
            </WebSettingProvider>
          </FirebaseProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
