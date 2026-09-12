"use client";

import React from "react";
import { UseCaseId, UseCasePreset } from "@/types";

export const USE_CASE_PRESETS: UseCasePreset[] = [
  {
    id: "gaming-1080p",
    label: "เล่นเกม 1080p ลื่นๆ",
    icon: "🎮",
    badge: "งบประหยัด",
    description: "สเปกเน้นความคุ้มค่า เล่นเกม Full HD 1080p ลื่นทุกเกม สบายกระเป๋า",
    focusText: "Ryzen 5 / RTX 4060 / RAM 16GB / SSD 1TB",
  },
  {
    id: "creator-4k",
    label: "ตัดต่อ 4K & ทำงาน 3D",
    icon: "🎬",
    badge: "สาย Creator",
    description: "CPU หลายคอร์, RAM 32GB+, การ์ดจอ VRAM สูง เรนเดอร์วิดีโอ 4K ไว",
    focusText: "Core i7 / RTX 4080 SUPER / RAM 32GB / SSD 2TB",
  },
  {
    id: "mini-itx",
    label: "ไซส์กะทัดรัด (Mini-ITX)",
    icon: "📦",
    badge: "ประหยัดพื้นที่",
    description: "ชิ้นส่วนขนาดเล็ก พาวเวอร์ซัพพลายสั้น การ์ดจอ 2 พัดลม สำหรับเคสเล็ก",
    focusText: "เคสเล็ก / พาวเวอร์ 140mm / การ์ดจอคอมแพกต์",
  },
  {
    id: "esports",
    label: "E-Sports 240Hz+",
    icon: "⚡",
    badge: "Pro Player",
    description: "รีดเฟรมเรตสูงสุด ค่า Latency ต่ำพิเศษ เมาส์ 4K/8K คีย์บอร์ด Rapid Trigger",
    focusText: "Ryzen 7 7800X3D / เมาส์ 54-60g / Rapid Trigger 0.1mm",
  },
];

interface UseCaseChipsProps {
  selectedUseCase: UseCaseId | null;
  onSelectUseCase: (useCaseId: UseCaseId | null) => void;
  filteredCount?: number;
}

export default function UseCaseChips({
  selectedUseCase,
  onSelectUseCase,
  filteredCount,
}: UseCaseChipsProps) {
  return (
    <div className="mb-4 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs transition-colors">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">🎯</span>
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
            จัดสเปกคอมตามการใช้งานจริง (Smart Use-Case Presets)
          </h2>
        </div>
        {selectedUseCase && (
          <button
            type="button"
            onClick={() => onSelectUseCase(null)}
            className="text-[11px] text-red-600 dark:text-red-400 hover:underline font-bold cursor-pointer"
          >
            ล้างตัวกรองการใช้งาน
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Pill Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* All Products Chip */}
        <button
          type="button"
          onClick={() => onSelectUseCase(null)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all duration-150 cursor-pointer border ${
            selectedUseCase === null
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white shadow-sm"
              : "bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <span>🏷️</span>
          <span>สินค้าทั้งหมด</span>
        </button>

        {/* Use-Case Preset Chips */}
        {USE_CASE_PRESETS.map((preset) => {
          const isSelected = selectedUseCase === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectUseCase(isSelected ? null : preset.id)}
              title={`${preset.description} • เน้น: ${preset.focusText}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all duration-150 cursor-pointer border group relative ${
                isSelected
                  ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-950/30 scale-[1.02]"
                  : "bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95"
              }`}
            >
              <span className="text-sm shrink-0">{preset.icon}</span>
              <span className="whitespace-nowrap">{preset.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 transition-colors ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-red-50 dark:group-hover:bg-red-950/40 group-hover:text-red-500"
                }`}
              >
                {preset.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Hint Sub-banner when a preset is active */}
      {selectedUseCase && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span>
              {USE_CASE_PRESETS.find((p) => p.id === selectedUseCase)?.description}
            </span>
          </div>
          {filteredCount !== undefined && (
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400 shrink-0">
              พบคัดสรร {filteredCount} รายการ
            </span>
          )}
        </div>
      )}
    </div>
  );
}
