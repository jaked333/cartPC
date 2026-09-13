"use client";

import React, { useEffect } from "react";
import { Product } from "@/types";
import { TrashIcon, XIcon, ShieldCheckIcon } from "./Icons";

interface DeleteProductConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteProductConfirmModal({
  isOpen,
  product,
  onConfirm,
  onCancel,
}: DeleteProductConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 text-slate-800 dark:text-slate-100 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          aria-label="ปิดหน้าต่าง"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <XIcon size={18} />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
            <TrashIcon size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ยืนยันการลบสินค้า
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
          </div>
        </div>

        {/* Product Details Box */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 my-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>{product.sku}</span>
              <span>•</span>
              <span className="font-extrabold text-red-600 dark:text-red-400">
                ฿{product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบสินค้ารายการนี้ออกจากระบบ? สินค้าจะถูกลบออกจากคลังและไม่แสดงบนหน้าร้านค้าอีกต่อไป
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 active:scale-95 text-white transition-all shadow-md shadow-red-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <TrashIcon size={14} />
            <span>ยืนยันลบสินค้า</span>
          </button>
        </div>
      </div>
    </div>
  );
}
