"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CategorySidebar from "@/components/CategorySidebar";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import EditProductModal from "@/components/EditProductModal";
import { useProducts } from "@/context/ProductContext";
import {
  SEED_CATEGORIES,
  SEED_BRANDS,
} from "@/data/seed";
import { SortOption, Product } from "@/types";
import {
  ShieldCheckIcon,
  SparklesIcon,
  getCategoryIcon,
  SearchIcon,
} from "@/components/Icons";

export default function StorefrontPage() {
  const { products } = useProducts();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [selectedAttributeValue, setSelectedAttributeValue] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Active Category Object
  const activeCategory = useMemo(() => {
    return SEED_CATEGORIES.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  // Count products per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Brands map
  const brandMap = useMemo(() => {
    const map: Record<string, string> = {};
    SEED_BRANDS.forEach((b) => {
      map[b.id] = b.name;
    });
    return map;
  }, []);

  // Categories map
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    SEED_CATEGORIES.forEach((c) => {
      map[c.id] = c.nameTh;
    });
    return map;
  }, []);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Category filter
    if (selectedCategoryId) {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (brandMap[p.brandId] && brandMap[p.brandId].toLowerCase().includes(q))
      );
    }

    // 3. Brand filter
    if (selectedBrandIds.length > 0) {
      list = list.filter((p) => selectedBrandIds.includes(p.brandId));
    }

    // 4. Attribute filter
    if (activeCategory && activeCategory.attributeFilterKey && selectedAttributeValue) {
      const key = activeCategory.attributeFilterKey;
      list = list.filter((p) => p.attributes && p.attributes[key] === selectedAttributeValue);
    }

    // 5. Sorting
    list.sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "discount-desc":
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case "sales-desc":
          return (b.salesCount || 0) - (a.salesCount || 0);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "recommended":
        default:
          return (b.salesCount || 0) - (a.salesCount || 0);
      }
    });

    return list;
  }, [
    selectedCategoryId,
    searchQuery,
    selectedBrandIds,
    selectedAttributeValue,
    sortOption,
    activeCategory,
    brandMap,
    products,
  ]);

  const toggleBrand = (brandId: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCategoryId(catId);
    setSelectedAttributeValue(null);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBrandIds([]);
    setSelectedAttributeValue(null);
    setSortOption("recommended");
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedBrandIds.length > 0 ||
    selectedAttributeValue !== null ||
    sortOption !== "recommended";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column: Fixed Category Sidebar with Cart Total Pinned at Top */}
          <CategorySidebar
            categories={SEED_CATEGORIES}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            categoryCounts={categoryCounts}
            totalProductsCount={products.length}
          />

          {/* Right Column: Page Header, Search/Sort/Filter Bar & Product Grid */}
          <div className="flex-1 min-w-0 w-full">
            {/* Page Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 mb-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                  <span>หมวดหมู่สินค้า</span>
                  <span>•</span>
                  <span>
                    {activeCategory ? activeCategory.nameEn : "All Products"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                    {activeCategory ? (
                      getCategoryIcon(activeCategory.iconName, 22)
                    ) : (
                      <SparklesIcon size={22} />
                    )}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {activeCategory ? activeCategory.nameTh : "สินค้าอุปกรณ์คอมพิวเตอร์ทั้งหมด"}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  สินค้าของแท้ 100% ประกันศูนย์ไทย มีสต็อกพร้อมจัดส่งทันที
                </p>
              </div>

              {/* Product Count Pill */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">พบสินค้าทั้งหมด:</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl">
                  {filteredProducts.length} รายการ
                </span>
              </div>
            </div>

            {/* Filter Bar (Search, Sort, Brand Chips, Attribute Chips) */}
            <ProductFilters
              activeCategory={activeCategory}
              brands={SEED_BRANDS}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              setSortOption={setSortOption}
              selectedBrandIds={selectedBrandIds}
              toggleBrand={toggleBrand}
              selectedAttributeValue={selectedAttributeValue}
              setAttributeValue={setSelectedAttributeValue}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Product Card Grid (4 cols desktop, 2 tablet, 1-2 mobile) */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    brandName={brandMap[product.brandId]}
                    onSelect={setSelectedProduct}
                    onEdit={setEditingProduct}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-xs transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <SearchIcon size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  ลองปรับคำค้นหา หรือล้างตัวกรองแบรนด์และคุณสมบัติเพื่อดูสินค้าทั้งหมด
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-200 dark:shadow-red-950/40 transition-all cursor-pointer"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Assurance Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-8 transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <ShieldCheckIcon size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">ของแท้ 100% ประกันศูนย์ไทย</h4>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">สินค้าทุกชิ้นมีสติ๊กเกอร์รับประกันศูนย์</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <SparklesIcon size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">จัดส่งด่วนพิเศษ</h4>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">กรุงเทพฯ และปริมณฑล รับของในวันถัดไป</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheckIcon size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">ชำระเงินปลอดภัย</h4>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">รองรับโอนเงิน บัตรเครดิต และผ่อน 0%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <SparklesIcon size={22} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">ทีมงานพร้อมดูแล</h4>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">ให้คำปรึกษาจัดสเปกคอมพิวเตอร์ฟรี</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <p>© 2026 PC PARTS Thailand. PC Components & IT Solutions.</p>
            <div className="flex items-center gap-4">
              <a href="/login" className="hover:text-red-600 dark:hover:text-red-400">เข้าสู่ระบบ (Login)</a>
              <a href="/register" className="hover:text-red-600 dark:hover:text-red-400">สมัครสมาชิก (Register)</a>
              <a href="#" className="hover:text-red-600 dark:hover:text-red-400">นโยบายความเป็นส่วนตัว</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        brandName={selectedProduct ? brandMap[selectedProduct.brandId] : undefined}
        categoryName={selectedProduct ? categoryMap[selectedProduct.categoryId] : undefined}
        onClose={() => setSelectedProduct(null)}
        onEdit={(p) => {
          setSelectedProduct(null);
          setEditingProduct(p);
        }}
      />

      {/* Admin Edit Product Modal */}
      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        brandName={editingProduct ? brandMap[editingProduct.brandId] : undefined}
        categoryName={editingProduct ? categoryMap[editingProduct.categoryId] : undefined}
        onClose={() => setEditingProduct(null)}
      />
    </div>
  );
}
