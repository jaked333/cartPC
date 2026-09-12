"use client";

import React from "react";
import { useCompare } from "@/context/CompareContext";
import { CompareIcon, TrashIcon, XIcon } from "./Icons";

export default function CompareFloatingBar() {
  const {
    compareList,
    maxItems,
    removeFromCompare,
    clearCompare,
    setIsOpen,
  } = useCompare();

  if (compareList.length === 0) return null;

  const canCompare = compareList.length >= 2;

  return (
    <aside
      aria-label="Product comparison toolbar"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/50 p-2.5 sm:p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Badge Counter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <CompareIcon size={16} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-bold text-slate-300 leading-tight">
                เปรียบเทียบสเปก
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                เลือกแล้ว <span className="text-amber-400 font-bold">{compareList.length}</span>/{maxItems} ชิ้น
              </p>
            </div>
            <div className="sm:hidden text-xs font-bold text-slate-300">
              {compareList.length}/{maxItems}
            </div>
          </div>

          {/* Product Thumbnails with Remove Button */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative group shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center overflow-visible"
                title={product.name}
              >
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span className="text-[9px] text-slate-400 text-center line-clamp-1">
                    {product.name}
                  </span>
                )}

                {/* Quick Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(product.id);
                  }}
                  title={`นำ ${product.name} ออก`}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white border border-slate-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                >
                  <XIcon size={10} />
                </button>
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: Math.max(0, maxItems - compareList.length) }).map((_, idx) => (
              <div
                key={`empty-slot-${idx}`}
                className="hidden md:flex w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-dashed border-slate-700/80 items-center justify-center text-[10px] text-slate-600 font-bold"
              >
                +{idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          {/* Clear All Button */}
          <button
            type="button"
            onClick={clearCompare}
            title="ล้างสินค้าทั้งหมดที่เลือกไว้"
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60 transition-all cursor-pointer"
          >
            <TrashIcon size={14} />
            <span className="hidden sm:inline">ล้างทั้งหมด</span>
          </button>

          {/* Trigger Compare Modal */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            disabled={!canCompare}
            className={`px-3.5 sm:px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-md ${
              canCompare
                ? "bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-red-950/40"
                : "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60"
            }`}
            title={
              canCompare
                ? "เปิดตารางเปรียบเทียบสเปกสินค้า"
                : "กรุณาเลือกสินค้าอย่างน้อย 2 ชิ้นเพื่อเปรียบเทียบ"
            }
          >
            <CompareIcon size={14} />
            <span>เปรียบเทียบสเปก</span>
            {!canCompare && (
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                (ต้องการอีก {2 - compareList.length} ชิ้น)
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

