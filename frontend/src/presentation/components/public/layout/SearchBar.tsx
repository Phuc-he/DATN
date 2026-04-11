// src/presentation/components/public/layout/SearchBar.tsx
"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, KeyboardEvent } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy giá trị q hiện tại từ URL nếu có
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = () => {
    if (query.trim()) {
      // Điều hướng sang trang search kèm param q
      router.push(`/shop/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/shop/search`);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="hidden md:flex flex-1 max-w-md mx-8">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search by title, author..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
        />
        <Search 
          className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors" 
          onClick={handleSearch}
        />
      </div>
    </div>
  );
}
