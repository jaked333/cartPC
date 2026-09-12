"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  XIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  CartIcon,
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
  EditIcon,
} from "./Icons";

interface ProductDetailModalProps {
  product: Product | null;
  brandName?: string;
  categoryName?: string;
  onClose: () => void;
  onEdit?: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  brandName,
  categoryName,
  onClose,
  onEdit,
}: ProductDetailModalProps) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [product]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const hasDiscount =
    product.originalPrice > product.price &&
    product.discountPercent &&
    product.discountPercent > 0;

  const savingsAmount = product.originalPrice - product.price;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stockQty) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    // Auth Guard: Alert and redirect unauthenticated users
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเลือกสินค้าลงในตะกร้าสินค้า");
      router.push("/login");
      return;
    }

    // Admin Guard: Admins cannot purchase or add items to cart
    if (user.role === "admin") {
      alert("ผู้ดูแลระบบ (Admin) ไม่สามารถเลือกสินค้าลงในตะกร้าได้ สามารถแก้ไขชื่อและราคาสินค้าได้เท่านั้น");
      return;
    }

    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-7 text-slate-800 dark:text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="ปิดหน้าต่าง"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <XIcon size={22} />
        </button>

        {/* Top Product Meta Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4 pr-10">
          {brandName && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              {brandName}
            </span>
          )}
          {categoryName && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40">
              {categoryName}
            </span>
          )}
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            SKU: {product.sku}
          </span>
        </div>

        {/* Main Grid: Image + Purchasing info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          {/* Image Container */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center min-h-[260px] sm:min-h-[320px]">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover max-h-[340px]"
              />
            ) : (
              <div className="text-slate-400 dark:text-slate-600 text-sm font-medium">
                ไม่มีรูปภาพ
              </div>
            )}

            {/* Discount Tag */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                ลด {product.discountPercent}%
              </div>
            )}
          </div>

          {/* Details & Action Column */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {product.name}
              </h2>

              {/* Stock and Sales stats */}
              <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  มีสินค้าพร้อมส่ง ({product.stockQty} ชิ้น)
                </span>
                {product.salesCount !== undefined && (
                  <span>ขายแล้ว {product.salesCount} ชิ้น</span>
                )}
              </div>

              {/* Price Box */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-500 tracking-tight">
                    ฿{product.price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    ประหยัดทันที ฿{savingsAmount.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Purchasing or Admin Edit Controls */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {user?.role === "admin" ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(product)}
                    className="w-full py-3 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 shadow-md shadow-amber-200 dark:shadow-amber-950/40 cursor-pointer transition-all duration-150"
                  >
                    <EditIcon size={18} />
                    <span>แก้ไขชื่อและราคาสินค้า (Admin Edit)</span>
                  </button>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center font-medium">
                    ⚠️ บัญชีผู้ดูแลระบบ (Admin) ไม่สามารถสั่งซื้อสินค้าได้ สามารถแก้ไขข้อมูลสินค้าได้เท่านั้น
                  </p>
                </div>
              ) : (
                <>
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      จำนวน
                    </span>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-xs">
                      <button
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-800 dark:text-slate-100">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrease}
                        disabled={quantity >= product.stockQty}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 py-3 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg ${
                        justAdded
                          ? "bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-950/40"
                          : "bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white shadow-red-200 dark:shadow-red-950/40"
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <CheckIcon size={18} />
                          <span>เพิ่มลงตะกร้าแล้ว!</span>
                        </>
                      ) : (
                        <>
                          <CartIcon size={18} />
                          <span>เพิ่มลงตะกร้า (฿{(product.price * quantity).toLocaleString()})</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Specifications & Tech Details */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <SparklesIcon size={16} className="text-amber-500" />
            ข้อมูลจำเพาะทางเทคนิค (Specifications)
          </h3>

          {product.specs && Object.keys(product.specs).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {key}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">ไม่มีข้อมูลจำเพาะเพิ่มเติม</p>
          )}

          {/* Guarantees Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheckIcon size={18} className="text-red-600 shrink-0" />
              <span>สินค้าแท้ 100% ประกันศูนย์</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-400">
              <TruckIcon size={18} className="text-emerald-600 shrink-0" />
              <span>จัดส่งด่วนปลอดภัยทั่วไทย</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/30 text-xs text-slate-600 dark:text-slate-400">
              <CheckIcon size={18} className="text-amber-500 shrink-0" />
              <span>พร้อมให้คำปรึกษาตลอด 24 ชม.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

