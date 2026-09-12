"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import { PlusIcon, CheckIcon, EditIcon, CompareIcon } from "./Icons";

interface ProductCardProps {
  product: Product;
  brandName?: string;
  onSelect?: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

export default function ProductCard({ product, brandName, onSelect, onEdit }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isInCompare, toggleCompare } = useCompare();
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  const inCompare = isInCompare(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is logged in
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเลือกสินค้าลงในตะกร้าสินค้า");
      router.push("/login");
      return;
    }

    // Check if user is Admin
    if (user.role === "admin") {
      alert("ผู้ดูแลระบบ (Admin) ไม่สามารถเลือกสินค้าลงในตะกร้าได้ สามารถแก้ไขชื่อและราคาสินค้าได้เท่านั้น");
      return;
    }

    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1000);
  };

  const hasDiscount =
    product.originalPrice > product.price &&
    product.discountPercent &&
    product.discountPercent > 0;

  return (
    <div
      onClick={() => onSelect?.(product)}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:border-red-300 dark:hover:border-red-800/80 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/60 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Product Image Area */}
        <div className="relative w-full pt-[75%] bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs">
              No Image
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs">
              -{product.discountPercent}%
            </div>
          )}

          {/* Brand Tag */}
          {brandName && (
            <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs text-slate-700 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs border border-slate-200/60 dark:border-slate-700">
              {brandName}
            </div>
          )}

          {/* Compare Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product);
            }}
            title={inCompare ? "นำออกจากการเปรียบเทียบ" : "เพิ่มเพื่อเปรียบเทียบสเปก"}
            className={`absolute bottom-2 right-2 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md ${
              inCompare
                ? "bg-amber-500 text-slate-950 border border-amber-400 font-extrabold ring-2 ring-amber-400/40 scale-105"
                : "bg-slate-900/75 hover:bg-slate-900/95 text-slate-200 hover:text-white border border-slate-700/80 active:scale-95"
            }`}
          >
            {inCompare ? <CheckIcon size={11} /> : <CompareIcon size={12} />}
            <span>{inCompare ? "เทียบอยู่" : "เทียบสเปก"}</span>
          </button>
        </div>

        {/* Info Content */}
        <div className="p-3.5 sm:p-4">
          {/* SKU & Stock */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-1">
            <span className="font-mono">{product.sku}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">มีสินค้า</span>
          </div>

          {/* Title: 2 lines truncate */}
          <h3
            className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 h-10 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description: 2 lines truncate */}
          <p
            className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 h-8 leading-relaxed"
            title={product.description}
          >
            {product.description}
          </p>
        </div>
      </div>

      {/* Bottom Price and Add-To-Cart Row */}
      <div className="p-3.5 sm:p-4 pt-0 flex items-end justify-between gap-2 border-t border-slate-100/80 dark:border-slate-800/80 mt-1">
        <div className="flex flex-col">
          {hasDiscount && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through leading-none mb-1">
              ฿{product.originalPrice.toLocaleString()}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-extrabold text-red-600 dark:text-red-500 tracking-tight leading-none">
              ฿{product.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button: Edit for Admin, Add to Cart for Customers */}
        {user?.role === "admin" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(product);
            }}
            title="แก้ไขชื่อและราคา (Admin Edit)"
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-200 dark:shadow-amber-950/40 cursor-pointer shrink-0 transition-all duration-150"
          >
            <EditIcon size={14} />
            <span>แก้ไข</span>
          </button>
        ) : (
          <button
            onClick={handleAdd}
            title="เพิ่มลงตะกร้า"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer shrink-0 ${
              justAdded
                ? "bg-emerald-600 text-white scale-105"
                : "bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-red-200 dark:shadow-red-950/40"
            }`}
          >
            {justAdded ? <CheckIcon size={16} /> : <PlusIcon size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
