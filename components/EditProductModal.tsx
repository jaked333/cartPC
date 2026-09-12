"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { useProducts } from "@/context/ProductContext";
import { XIcon, EditIcon, CheckIcon } from "./Icons";

interface EditProductModalProps {
  product: Product | null;
  brandName?: string;
  categoryName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  brandName,
  categoryName,
  isOpen,
  onClose,
}: EditProductModalProps) {
  const { updateProduct } = useProducts();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || product.price);
      setIsSaved(false);
      setError(null);
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Real-time calculated discount
  const parsedPrice = Number(price) || 0;
  const parsedOriginalPrice = Number(originalPrice) || 0;
  const discountAmount = parsedOriginalPrice > parsedPrice ? parsedOriginalPrice - parsedPrice : 0;
  const discountPercent =
    parsedOriginalPrice > parsedPrice && parsedOriginalPrice > 0
      ? Math.round((discountAmount / parsedOriginalPrice) * 100)
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("กรุณากรอกชื่อสินค้า");
      return;
    }

    if (parsedPrice < 0) {
      setError("ราคาสินค้าต้องไม่ติดลบ");
      return;
    }

    updateProduct(product.id, {
      name: name.trim(),
      price: parsedPrice,
      originalPrice: parsedOriginalPrice >= parsedPrice ? parsedOriginalPrice : parsedPrice,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-7 text-slate-800 dark:text-slate-100 my-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="ปิดหน้าต่าง"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <XIcon size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/50">
            <EditIcon size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                แก้ไขข้อมูลสินค้า
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                Admin Edit
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              SKU: {product.sku} {brandName ? `• ${brandName}` : ""}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs">
            ⚠️ {error}
          </div>
        )}

        {/* Product Snapshot */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 mb-5">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700/60">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">
              กำลังแก้ไขรายการ:
            </span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
              {product.name}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-0.5">
              ราคาปัจจุบัน: ฿{product.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Rename Product */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              ชื่อสินค้า (Product Name) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อสินค้าใหม่..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-850 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              required
            />
          </div>

          {/* Field 2 & 3: Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                ราคาขายสุทธิ (Sale Price ฿) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-bold pointer-events-none">
                  ฿
                </span>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-850 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                ราคาเต็มปกติ (Original Price ฿)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-bold pointer-events-none">
                  ฿
                </span>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-850 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Real-time Discount Summary */}
          {discountPercent > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-xs flex items-center justify-between">
              <span className="font-semibold">คำนวณส่วนลดแสดงผล:</span>
              <span className="font-bold">
                ลด {discountPercent}% (ประหยัด ฿{discountAmount.toLocaleString()})
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              ยกเลิก (Cancel)
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-md ${
                isSaved
                  ? "bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-950/40"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-red-200 dark:shadow-red-950/40"
              }`}
            >
              {isSaved ? (
                <>
                  <CheckIcon size={16} />
                  <span>บันทึกสำเร็จ!</span>
                </>
              ) : (
                <>
                  <CheckIcon size={16} />
                  <span>บันทึกการแก้ไข (Save)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

