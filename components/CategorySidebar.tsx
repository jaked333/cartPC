"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getCategoryIcon, CartIcon, SparklesIcon } from "./Icons";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  categoryCounts: Record<string, number>;
  totalProductsCount: number;
}

export default function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts,
  totalProductsCount,
}: CategorySidebarProps) {
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleOpenCart = () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเข้าสู่ตะกร้าสินค้า");
      router.push("/login");
      return;
    }
    setIsCartOpen(true);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
      {/* Pinned Cart Summary Card at Top of Sidebar */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-black/60 border border-slate-700/60 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
            <CartIcon size={16} className="text-red-400" />
            <span>ยอดรวมตะกร้าสินค้า</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/80 dark:bg-slate-800 text-amber-300 font-semibold">
            {totalItems} ชิ้น
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs text-slate-400">สุทธิ (THB)</span>
          <span className="text-xl font-extrabold text-white tracking-tight">
            ฿{subtotal.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handleOpenCart}
          className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>เปิดดูตะกร้า ({totalItems})</span>
        </button>
      </div>

      {/* Category Navigation List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-xs transition-colors">
        <div className="px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          หมวดหมู่อุปกรณ์ (Categories)
        </div>

        <nav className="flex flex-col gap-1 mt-1">
          {/* All Categories Option */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
              selectedCategoryId === null
                ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold border border-red-200/80 dark:border-red-900/60 shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white font-medium"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span
                className={`p-1.5 rounded-lg ${
                  selectedCategoryId === null
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <SparklesIcon size={16} />
              </span>
              <span className="text-xs sm:text-sm truncate">สินค้าทั้งหมด (All Products)</span>
            </div>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                selectedCategoryId === null
                  ? "bg-red-200 dark:bg-red-900/70 text-red-800 dark:text-red-200"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {totalProductsCount}
            </span>
          </button>

          {/* Individual Category Buttons */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold border border-red-200/80 dark:border-red-900/60 shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {getCategoryIcon(cat.iconName, 16)}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm truncate block leading-tight">
                      {cat.nameTh}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                      {cat.nameEn}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ml-2 shrink-0 ${
                    isSelected
                      ? "bg-red-200 dark:bg-red-900/70 text-red-800 dark:text-red-200"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
