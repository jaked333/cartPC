"use client";

import React, { useEffect } from "react";
import { LogOutIcon, XIcon } from "./Icons";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  userName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmModal({
  isOpen,
  userName,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-slate-800 dark:text-slate-100 transition-all transform scale-100 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          aria-label="ปิดหน้าต่าง"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <XIcon size={18} />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/50">
            <LogOutIcon size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              ยืนยันการออกจากระบบ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sign out confirmation
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบบัญชี{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {userName || "ของคุณ"}
          </span>
          ? สินค้าในตะกร้าและประวัติของคุณจะยังคงถูกบันทึกไว้ในระบบ
        </p>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer"
          >
            ยกเลิก (Cancel)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-red-200 dark:shadow-red-950/50 transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOutIcon size={14} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

