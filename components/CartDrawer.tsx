"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Order } from "@/types";
import {
  CartIcon,
  XIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowRightIcon,
  CheckIcon,
  PackageIcon,
} from "./Icons";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalOriginal,
    totalDiscount,
    totalItems,
  } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart");
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (user?.role === "admin") {
      alert("ผู้ดูแลระบบ (Admin) ไม่สามารถสั่งซื้อสินค้าได้");
      return;
    }

    // Generate order in OrderContext
    const customerName = user ? user.name : "ลูกค้าทั่วไป (Guest)";
    const customerEmail = user ? user.email : "guest@pcshop.co.th";
    const customerPhone = user?.phone || "081-000-0000";
    const shippingAddress = user?.address || "จัดส่งตามที่อยู่ที่ระบุในคำสั่งซื้อ กรุงเทพมหานคร";

    const created = createOrder({
      userId: user ? user.id : `guest-${Date.now()}`,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: [...items],
      subtotal,
      shippingFee: 0,
      total: subtotal,
      notes: "สั่งซื้อผ่านหน้าเว็บไซต์ PC PARTS",
    });

    setLastCreatedOrder(created);
    setCheckoutStep("success");
    clearCart();
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setCheckoutStep("cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 transition-colors">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                <CartIcon size={18} />
              </div>
              <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">
                ตะกร้าสินค้า ({totalItems})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <XIcon size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {checkoutStep === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-inner">
                  <CheckIcon size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  สั่งซื้อสินค้าสำเร็จ!
                </h3>
                {lastCreatedOrder && (
                  <span className="inline-block mt-1 font-mono text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/60">
                    รหัสคำสั่งซื้อ: {lastCreatedOrder.id}
                  </span>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 max-w-xs leading-relaxed">
                  ขอบคุณที่สั่งซื้อสินค้ากับ PC PARTS คำสั่งซื้อของคุณถูกบันทึกเข้าระบบเรียบร้อยแล้ว
                </p>

                {user && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-600 dark:text-slate-300 text-left w-full space-y-1">
                    <p>ผู้สั่งซื้อ: <strong>{user.name}</strong></p>
                    <p>อีเมล: {user.email}</p>
                    <p className="truncate">ที่อยู่: {lastCreatedOrder?.shippingAddress}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-col w-full gap-2">
                  <Link
                    href="/orders"
                    onClick={handleClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-200 dark:shadow-red-950/40 flex items-center justify-center gap-1.5"
                  >
                    <PackageIcon size={16} />
                    <span>ไปดูประวัติคำสั่งซื้อของฉัน</span>
                  </Link>
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    ช้อปปิ้งต่อ
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 flex items-center justify-center mb-3">
                  <CartIcon size={32} />
                </div>
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  ไม่มีสินค้าในตะกร้า
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
                  เลือกเพิ่มชิ้นส่วนและอุปกรณ์ที่คุณสนใจลงในตะกร้าได้เลย
                </p>
                <button
                  onClick={handleClose}
                  className="mt-5 py-2 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-200 dark:shadow-red-950/40 transition-all cursor-pointer"
                >
                  เลือกดูสินค้า
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 relative">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 dark:text-slate-600">
                          PC
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4
                            className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight"
                            title={product.name}
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-0.5 cursor-pointer shrink-0"
                            title="ลบรายการนี้"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
                          {product.sku}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-extrabold text-red-600 dark:text-red-400">
                            ฿{(product.price * quantity).toLocaleString()}
                          </span>
                          {quantity > 1 && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              (฿{product.price.toLocaleString()}/ชิ้น)
                            </span>
                          )}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[20px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Calculations */}
          {items.length > 0 && checkoutStep === "cart" && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-slate-400 dark:text-slate-500">
                    <span>ราคาปกติ</span>
                    <span className="line-through">฿{totalOriginal.toLocaleString()}</span>
                  </div>
                )}
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-red-600 dark:text-red-400 font-semibold">
                    <span>ส่วนลดที่ประหยัดได้</span>
                    <span>-฿{totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>ค่าจัดส่ง</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">ฟรีค่าจัดส่งทั่วประเทศ</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>ยอดชำระสุทธิ</span>
                  <span className="text-xl text-red-600 dark:text-red-500">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {user?.role === "admin" ? (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 font-semibold text-center">
                  ⚠️ บัญชีผู้ดูแลระบบ (Admin): สำหรับจัดการสินค้าและคำสั่งซื้อ ไม่สามารถสั่งซื้อสินค้าได้
                </div>
              ) : !user ? (
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
                  💡 แนะนำ:{" "}
                  <Link href="/login" onClick={handleClose} className="font-bold underline">
                    เข้าสู่ระบบ
                  </Link>{" "}
                  หรือ{" "}
                  <Link href="/register" onClick={handleClose} className="font-bold underline">
                    สมัครสมาชิก
                  </Link>{" "}
                  ก่อนสั่งซื้อเพื่อบันทึกประวัติสินค้า
                </div>
              ) : null}

              {user?.role === "admin" ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>แอดมินไม่สามารถทำการสั่งซื้อได้</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-red-200 dark:shadow-red-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                >
                  <span>ดำเนินการสั่งซื้อสินค้า</span>
                  <ArrowRightIcon size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
