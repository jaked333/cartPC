"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import Navbar from "@/components/Navbar";
import { OrderStatus } from "@/types";
import {
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  MapPinIcon,
} from "@/components/Icons";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col text-slate-800 dark:text-slate-100 transition-colors">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <PackageIcon size={28} />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อ
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              เข้าสู่ระบบเพื่อตรวจสอบสถานะพัสดุและดูรายการสินค้าที่คุณเคยสั่งซื้อ
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/login"
                className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-200 dark:shadow-red-950/40"
              >
                เข้าสู่ระบบ (Sign In)
              </Link>
              <Link
                href="/register"
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                ยังไม่มีบัญชี? สมัครสมาชิก
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Filter orders matching the logged-in user
  const userOrders = orders.filter(
    (o) =>
      o.userId === user.id ||
      o.customerEmail.toLowerCase() === user.email.toLowerCase()
  );

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs inline-flex items-center gap-1">
            <ClockIcon size={12} /> รอชำระเงิน
          </span>
        );
      case "paid":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold text-xs inline-flex items-center gap-1">
            <CheckCircleIcon size={12} /> ชำระแล้ว
          </span>
        );
      case "processing":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold text-xs inline-flex items-center gap-1">
            <PackageIcon size={12} /> กำลังเตรียมจัดส่ง
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold text-xs inline-flex items-center gap-1">
            <TruckIcon size={12} /> จัดส่งแล้ว
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs inline-flex items-center gap-1">
            <CheckCircleIcon size={12} /> ได้รับสินค้าเรียบร้อย
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-bold text-xs inline-flex items-center gap-1">
            ยกเลิก
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
              <span>บัญชีผู้ใช้</span>
              <span>•</span>
              <span>ประวัติการสั่งซื้อ</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              คำสั่งซื้อของฉัน (My Orders)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ผู้สั่งซื้อ: <strong className="text-slate-700 dark:text-slate-200">{user.name}</strong> ({user.email})
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 border border-slate-700/60"
          >
            <span>เลือกซื้อสินค้าเพิ่ม</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        {/* Orders List */}
        {userOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
              <PackageIcon size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              คุณยังไม่มีประวัติการสั่งซื้อ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              เลือกชิ้นส่วนพีซีที่คุณต้องการ แล้วกดสั่งซื้อเพื่อเริ่มสร้างประวัติคำสั่งซื้อ
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-200 dark:shadow-red-950/40 transition-all"
            >
              <span>ไปที่หน้าร้านค้า</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
                      {ord.id}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      สั่งซื้อเมื่อ: {new Date(ord.createdAt).toLocaleString("th-TH")}
                    </span>
                  </div>
                  <div>{renderStatusBadge(ord.status)}</div>
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-lg bg-white dark:bg-slate-900 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        {item.product.images && item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 dark:text-slate-600">
                            PC
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                          SKU: {item.product.sku}
                        </span>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">
                            {item.quantity} x ฿{item.product.price.toLocaleString()}
                          </span>
                          <span className="font-bold text-red-600 dark:text-red-400">
                            ฿{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total & Shipping info */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                  <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <MapPinIcon size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
                    <span>ที่อยู่จัดส่ง: <strong className="text-slate-700 dark:text-slate-300">{ord.shippingAddress}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400 mr-2">ยอดรวมทั้งสิ้น:</span>
                    <span className="text-base font-black text-red-600 dark:text-red-400">
                      ฿{ord.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

