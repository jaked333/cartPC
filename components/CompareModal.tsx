"use client";

import React, { useEffect, useMemo } from "react";
import { useCompare } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  XIcon,
  CompareIcon,
  TrashIcon,
  CartIcon,
  CheckIcon,
  ShieldCheckIcon,
} from "./Icons";

export default function CompareModal() {
  const { compareList, isOpen, setIsOpen, removeFromCompare, clearCompare } =
    useCompare();
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Close modal on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Extract all unique spec keys across all compared products
  const uniqueSpecKeys = useMemo(() => {
    const keySet = new Set<string>();
    compareList.forEach((product) => {
      if (product.specs) {
        Object.keys(product.specs).forEach((k) => keySet.add(k));
      }
    });
    return Array.from(keySet);
  }, [compareList]);

  if (!isOpen || compareList.length === 0) return null;

  const handleAddToCart = (product: (typeof compareList)[0]) => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเลือกสินค้าลงในตะกร้าสินค้า");
      setIsOpen(false);
      router.push("/login");
      return;
    }

    if (user.role === "admin") {
      alert("ผู้ดูแลระบบ (Admin) ไม่สามารถเลือกสินค้าลงในตะกร้าได้ สามารถแก้ไขข้อมูลสินค้าได้เท่านั้น");
      return;
    }

    addItem(product, 1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center">
              <CompareIcon size={18} />
            </div>
            <div>
              <h2
                id="compare-modal-title"
                className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white"
              >
                เปรียบเทียบสเปกสินค้า (Side-by-Side Comparison)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                เปรียบเทียบข้อมูลทางเทคนิค ราคา และฟังก์ชันของสินค้า {compareList.length} รายการ
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              title="ล้างทั้งหมด"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <TrashIcon size={14} />
              <span className="hidden sm:inline">ล้างทั้งหมด</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              title="ปิดหน้าต่าง"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800/80">
          <div className="min-w-[680px]">
            {/* Top Row: Product Previews and Actions */}
            <div
              className="grid gap-3 sm:gap-4 pb-6"
              style={{
                gridTemplateColumns: `180px repeat(${compareList.length}, minmax(200px, 1fr))`,
              }}
            >
              {/* Top Left: Column Label */}
              <div className="flex flex-col justify-end p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                รายการสินค้า
              </div>

              {/* Product Cards in Header */}
              {compareList.map((product) => {
                const hasDiscount =
                  product.originalPrice > product.price &&
                  product.discountPercent &&
                  product.discountPercent > 0;

                return (
                  <div
                    key={`header-${product.id}`}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between relative group"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      title={`นำ ${product.name} ออกจากการเปรียบเทียบ`}
                      className="absolute top-2.5 right-2.5 text-xs text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-0.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XIcon size={12} />
                      <span>นำออก</span>
                    </button>

                    {/* Image */}
                    <div className="w-full h-32 flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-100 dark:border-slate-800/60 mb-3 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">ไม่มีรูปภาพ</span>
                      )}
                    </div>

                    {/* SKU & Name */}
                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {product.sku}
                      </span>
                      <h3
                        className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Price Block */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mb-3">
                      {hasDiscount && (
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[11px] text-slate-400 line-through">
                            ฿{product.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                            -{product.discountPercent}%
                          </span>
                        </div>
                      )}
                      <div className="text-base sm:text-lg font-black text-red-600 dark:text-red-500">
                        ฿{product.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Add to Cart CTA */}
                    {user?.role === "admin" ? (
                      <div className="py-2 px-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-bold text-center">
                        สิทธิ์ Admin (แก้ไขได้เท่านั้น)
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-200 dark:shadow-red-950/40 cursor-pointer"
                      >
                        <CartIcon size={14} />
                        <span>เพิ่มลงตะกร้า</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Section: Basic Information */}
            <div className="py-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                ข้อมูลทั่วไป (Overview)
              </h4>

              {/* Price Row */}
              <div
                className="grid gap-3 sm:gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs items-center"
                style={{
                  gridTemplateColumns: `180px repeat(${compareList.length}, minmax(200px, 1fr))`,
                }}
              >
                <div className="font-semibold text-slate-500 dark:text-slate-400">
                  ราคาจำหน่าย
                </div>
                {compareList.map((product) => (
                  <div
                    key={`price-${product.id}`}
                    className="font-bold text-red-600 dark:text-red-400"
                  >
                    ฿{product.price.toLocaleString()}
                  </div>
                ))}
              </div>

              {/* Stock Status Row */}
              <div
                className="grid gap-3 sm:gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs items-center"
                style={{
                  gridTemplateColumns: `180px repeat(${compareList.length}, minmax(200px, 1fr))`,
                }}
              >
                <div className="font-semibold text-slate-500 dark:text-slate-400">
                  สถานะสินค้า
                </div>
                {compareList.map((product) => (
                  <div
                    key={`stock-${product.id}`}
                    className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold"
                  >
                    <CheckIcon size={14} />
                    <span>มีสินค้าพร้อมส่ง ({product.stockQty} ชิ้น)</span>
                  </div>
                ))}
              </div>

              {/* Warranty Guarantee Row */}
              <div
                className="grid gap-3 sm:gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 text-xs items-center"
                style={{
                  gridTemplateColumns: `180px repeat(${compareList.length}, minmax(200px, 1fr))`,
                }}
              >
                <div className="font-semibold text-slate-500 dark:text-slate-400">
                  การรับประกัน
                </div>
                {compareList.map((product) => (
                  <div
                    key={`warranty-${product.id}`}
                    className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300"
                  >
                    <ShieldCheckIcon size={14} className="text-red-500" />
                    <span>ของแท้ประกันศูนย์ไทย</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Technical Specifications */}
            <div className="py-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                ข้อมูลจำเพาะทางเทคนิค (Technical Specifications)
              </h4>

              {uniqueSpecKeys.length > 0 ? (
                uniqueSpecKeys.map((key, index) => (
                  <div
                    key={key}
                    className={`grid gap-3 sm:gap-4 py-3 border-b border-slate-100 dark:border-slate-800/60 text-xs items-center ${
                      index % 2 === 0
                        ? "bg-slate-50/50 dark:bg-slate-950/20"
                        : "bg-transparent"
                    } px-2 rounded-lg`}
                    style={{
                      gridTemplateColumns: `180px repeat(${compareList.length}, minmax(200px, 1fr))`,
                    }}
                  >
                    {/* Spec Label */}
                    <div className="font-bold text-slate-600 dark:text-slate-300">
                      {key}
                    </div>

                    {/* Spec Value for Each Product */}
                    {compareList.map((product) => {
                      const val = product.specs?.[key];
                      const hasValue = val !== undefined && val !== null && String(val).trim() !== "";

                      return (
                        <div
                          key={`spec-${product.id}-${key}`}
                          className={`text-slate-800 dark:text-slate-200 ${
                            hasValue ? "font-semibold" : "text-slate-400 dark:text-slate-600 italic"
                          }`}
                        >
                          {hasValue ? String(val) : "-"}
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  ไม่มีข้อมูลจำเพาะทางเทคนิคที่สามารถนำมาเปรียบเทียบได้
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/80 shrink-0">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            💡 กดปุ่ม <b>Esc</b> หรือคลิกพื้นที่ภายนอกเพื่อปิดหน้าต่าง
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}

