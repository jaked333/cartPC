"use client";

import React from "react";
import { Category, Brand, SortOption } from "@/types";
import { SearchIcon, FilterIcon, XIcon } from "./Icons";

interface ProductFiltersProps {
  activeCategory: Category | null;
  brands: Brand[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortOption: SortOption;
  setSortOption: (val: SortOption) => void;
  selectedBrandIds: string[];
  toggleBrand: (brandId: string) => void;
  selectedAttributeValue: string | null;
  setAttributeValue: (val: string | null) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function ProductFilters({
  activeCategory,
  brands,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  selectedBrandIds,
  toggleBrand,
  selectedAttributeValue,
  setAttributeValue,
  hasActiveFilters,
  onClearFilters,
}: ProductFiltersProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs mb-6 flex flex-col gap-4 transition-colors">
      {/* Top Row: Search Bar + Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Debounced Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า, รุ่น, หรือสเปก เช่น Ryzen, RTX 4070, DDR5..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:inline">
            เรียงตาม:
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-full sm:w-auto py-2.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            <option value="recommended">แนะนำ (Recommended)</option>
            <option value="price-asc">ราคา: ต่ำ → สูง (Price: Low to High)</option>
            <option value="price-desc">ราคา: สูง → ต่ำ (Price: High to Low)</option>
            <option value="discount-desc">ส่วนลดสูงสุด (-% Discount)</option>
            <option value="sales-desc">ขายดีที่สุด (Best Selling)</option>
            <option value="newest">สินค้ามาใหม่ (Newest)</option>
          </select>
        </div>
      </div>

      {/* Filter Chips Row: Brands & Category-Specific Attributes */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
        {/* Brand Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1.5 flex items-center gap-1">
            <FilterIcon size={12} />
            แบรนด์:
          </span>
          {brands.map((brand) => {
            const isChecked = selectedBrandIds.includes(brand.id);
            return (
              <button
                key={brand.id}
                onClick={() => toggleBrand(brand.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                  isChecked
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/70"
                }`}
              >
                {brand.name}
              </button>
            );
          })}
        </div>

        {/* Category Attribute Chips */}
        {activeCategory &&
          activeCategory.attributeFilterKey &&
          activeCategory.attributeOptions && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1.5">
                {activeCategory.attributeFilterLabel || "คุณสมบัติ"}:
              </span>
              <button
                onClick={() => setAttributeValue(null)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                  selectedAttributeValue === null
                    ? "bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/70"
                }`}
              >
                ทั้งหมด
              </button>
              {activeCategory.attributeOptions.map((opt) => {
                const isSelected = selectedAttributeValue === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setAttributeValue(isSelected ? null : opt)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/70"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

        {/* Clear Filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              พบตัวกรองที่เลือกไว้
            </span>
            <button
              onClick={onClearFilters}
              className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <XIcon size={12} />
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
