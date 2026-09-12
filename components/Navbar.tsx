"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import LogoutConfirmModal from "./LogoutConfirmModal";
import {
  CpuIcon,
  CartIcon,
  UserIcon,
  LogOutIcon,
  ShieldCheckIcon,
  PackageIcon,
  SunIcon,
  MoonIcon,
} from "./Icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { theme, isDark, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const handleCartClick = () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเข้าสู่ตะกร้าสินค้า");
      router.push("/login");
      return;
    }
    setIsCartOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/90 dark:border-slate-800/90 shadow-xs backdrop-blur-md transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-200 dark:shadow-red-950/40 group-hover:scale-105 transition-transform duration-200">
            <CpuIcon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                PC<span className="text-red-600">PARTS</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 tracking-wide uppercase">
                Thai Store
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
              ศูนย์รวมอุปกรณ์คอมพิวเตอร์และเกมมิ่งเกียร์
            </span>
          </div>
        </Link>

        {/* Right Side: Theme Toggle, Auth & Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? "เปลี่ยนเป็นธีมสว่าง (Switch to Light Mode)" : "เปลี่ยนเป็นธีมมืด (Switch to Dark Mode)"}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shrink-0"
          >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {/* User Profile / Roles */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Role-Specific Portal Button */}
              {user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <ShieldCheckIcon size={14} />
                  <span>แผงควบคุมแอดมิน (Admin)</span>
                </Link>
              ) : (
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors border border-slate-200/60 dark:border-slate-700"
                >
                  <PackageIcon size={14} className="text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">คำสั่งซื้อของฉัน</span>
                  <span className="sm:hidden">คำสั่งซื้อ</span>
                </Link>
              )}

              {/* User Pill */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    user.role === "admin"
                      ? "bg-red-600 text-white"
                      : "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                  }`}
                >
                  {user.role === "admin" ? (
                    <ShieldCheckIcon size={16} />
                  ) : (
                    <UserIcon size={16} />
                  )}
                </div>
                <div className="text-left leading-none hidden md:block">
                  <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                    {user.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider block mt-0.5 ${
                      user.role === "admin" ? "text-red-600 dark:text-red-400" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {user.role === "admin" ? "Admin Staff" : "Customer"}
                  </span>
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  title="ออกจากระบบ (Sign Out)"
                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all active:scale-90 cursor-pointer"
                >
                  <LogOutIcon size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 duration-150"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 dark:bg-red-600 hover:bg-slate-800 dark:hover:bg-red-700 text-white transition-all active:scale-95 duration-150 shadow-xs"
              >
                สมัครสมาชิก
              </Link>
            </div>
          )}

          {/* Cart Trigger Button */}
          <button
            onClick={handleCartClick}
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-xs shadow-md shadow-red-200 dark:shadow-red-950/40 transition-all duration-150 cursor-pointer shrink-0"
          >
            <div className="relative">
              <CartIcon size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden lg:inline">ตะกร้า</span>
            {totalItems > 0 && (
              <span className="hidden sm:inline border-l border-red-500/80 pl-2 text-amber-200 font-bold">
                ฿{subtotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal before Logout */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        userName={user?.name}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </header>
  );
}
