"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useTheme } from "@/context/ThemeContext";
import { useProducts } from "@/context/ProductContext";
import { OrderStatus, Order, Product } from "@/types";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import EditProductModal from "@/components/EditProductModal";
import AddProductModal from "@/components/AddProductModal";
import DeleteProductConfirmModal from "@/components/DeleteProductConfirmModal";
import {
  ShieldCheckIcon,
  PackageIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  SearchIcon,
  CpuIcon,
  SparklesIcon,
  ArrowRightIcon,
  SunIcon,
  MoonIcon,
  LogOutIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/Icons";

export default function AdminPage() {
  const { user, getAllUsers, logout } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { products, deleteProduct } = useProducts();
  const { theme, isDark, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [activeTab, setActiveTab] = useState<"by-user" | "all-orders" | "products">("by-user");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  // All Users
  const allUsers = useMemo(() => (getAllUsers ? getAllUsers() : []), [getAllUsers]);

  // Aggregate stats
  const totalRevenue = useMemo(() => orders.reduce((sum, ord) => sum + ord.total, 0), [orders]);
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pending" || o.status === "processing"),
    [orders]
  );
  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "completed" || o.status === "shipped"),
    [orders]
  );

  // Group Orders by User (called unconditionally)
  const ordersByUser = useMemo(() => {
    const map: Record<
      string,
      {
        user: {
          id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
        };
        orders: Order[];
        totalSpent: number;
      }
    > = {};

    orders.forEach((order) => {
      const uid = order.userId || order.customerEmail;
      if (!map[uid]) {
        map[uid] = {
          user: {
            id: uid,
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            address: order.shippingAddress,
          },
          orders: [],
          totalSpent: 0,
        };
      }
      map[uid].orders.push(order);
      map[uid].totalSpent += order.total;
    });

    // Also include any registered customers who haven't ordered yet
    allUsers.forEach((u) => {
      if (u.role === "customer" && !map[u.id] && !map[u.email]) {
        map[u.id] = {
          user: {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || "ไม่ได้ระบุ",
            address: u.address || "ไม่ได้ระบุ",
          },
          orders: [],
          totalSpent: 0,
        };
      }
    });

    let result = Object.values(map);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (group) =>
          group.user.name.toLowerCase().includes(q) ||
          group.user.email.toLowerCase().includes(q) ||
          group.user.phone.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, allUsers, searchQuery]);

  // Filter products in Admin Tab
  const filteredAdminProducts = useMemo(() => {
    if (!searchQuery.trim() || activeTab !== "products") return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [products, searchQuery, activeTab]);

  // Security Guard: Check admin role (AFTER all hooks)
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#0b1120] flex flex-col justify-center items-center p-4 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon size={32} />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            เฉพาะผู้ดูแลระบบเท่านั้น (Restricted Access)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            หน้านี้สงวนสิทธิ์สำหรับเจ้าหน้าที่ผู้ดูแลระบบ (Admin) เท่านั้น กรุณาเข้าสู่ระบบด้วยบัญชีแอดมินเพื่อเข้าใช้งาน
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/login"
              className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-200 dark:shadow-red-950/40"
            >
              เข้าสู่ระบบด้วยบัญชีแอดมิน (Sign in as Admin)
            </Link>
            <Link
              href="/"
              className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              ← กลับไปยังหน้าร้านค้า (Storefront)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Status Badge Helper
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[11px] inline-flex items-center gap-1">
            <ClockIcon size={12} /> รอชำระเงิน
          </span>
        );
      case "paid":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold text-[11px] inline-flex items-center gap-1">
            <CheckCircleIcon size={12} /> ชำระแล้ว
          </span>
        );
      case "processing":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold text-[11px] inline-flex items-center gap-1">
            <PackageIcon size={12} /> กำลังจัดเตรียมของ
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold text-[11px] inline-flex items-center gap-1">
            <TruckIcon size={12} /> จัดส่งแล้ว
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] inline-flex items-center gap-1">
            <CheckCircleIcon size={12} /> สำเร็จเรียบร้อย
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-bold text-[11px] inline-flex items-center gap-1">
            ยกเลิก
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Admin Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-bold shadow-md shadow-red-900/40">
              <ShieldCheckIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">PC PARTS ADMIN</span>
                <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase border border-red-500/30">
                  Staff Only
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                ระบบจัดการคำสั่งซื้อและตรวจเช็คประวัติการสั่งซื้อของลูกค้า
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? "เปลี่ยนเป็นธีมสว่าง (Switch to Light Mode)" : "เปลี่ยนเป็นธีมมืด (Switch to Dark Mode)"}
              className="p-2 rounded-xl border border-slate-700/80 bg-slate-800 text-amber-400 hover:bg-slate-700 transition-all active:scale-90 cursor-pointer"
            >
              {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </button>

            <span className="text-xs text-slate-300 hidden sm:inline">
              ผู้ดูแลระบบ: <strong className="text-white">{user.name}</strong>
            </span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold text-slate-200 transition-all border border-slate-700 flex items-center gap-1"
            >
              <span>หน้าร้านค้า (Storefront)</span>
              <ArrowRightIcon size={14} />
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              title="ออกจากระบบ (Sign Out)"
              className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 active:scale-95 text-xs font-semibold text-red-400 border border-red-800/50 flex items-center gap-1 transition-all cursor-pointer"
            >
              <LogOutIcon size={14} />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                ยอดขายรวมทั้งหมด
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block tracking-tight">
                ฿{totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <SparklesIcon size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                จำนวนคำสั่งซื้อทั้งหมด
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block tracking-tight">
                {orders.length} รายการ
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PackageIcon size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                รอดำเนินการ / จัดส่ง
              </span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block tracking-tight">
                {pendingOrders.length} รายการ
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TruckIcon size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                ลูกค้าในระบบ
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block tracking-tight">
                {ordersByUser.length} ท่าน
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserIcon size={24} />
            </div>
          </div>
        </div>

        {/* View Tabs & Search Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          {/* Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => setActiveTab("by-user")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "by-user"
                  ? "bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-red-950/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              👤 รายการคำสั่งซื้อแยกตามผู้ใช้งาน (By Customer)
            </button>
            <button
              onClick={() => setActiveTab("all-orders")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all-orders"
                  ? "bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-red-950/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              📋 ตารางคำสั่งซื้อทั้งหมด (All Orders)
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-red-950/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              🏷️ จัดการชื่อและราคา ({products.length} รายการ)
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <SearchIcon size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "products"
                  ? "ค้นหาชื่อสินค้า หรือ SKU..."
                  : "ค้นหาชื่อลูกค้า, อีเมล, หรือเบอร์โทร..."
              }
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* TAB 1: ORDERS BY USER BREAKDOWN */}
        {activeTab === "by-user" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ประวัติคำสั่งซื้อของลูกค้าแต่ละคน</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                  {ordersByUser.length} ราย
                </span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                คลิกที่ข้อมูลลูกค้าเพื่อดูและจัดการรายการสินค้าที่สั่งซื้อ
              </span>
            </div>

            {ordersByUser.map(({ user: customer, orders: userOrders, totalSpent }) => {
              const isExpanded = expandedUserId === customer.id || ordersByUser.length === 1;

              return (
                <div
                  key={customer.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Customer Card Header */}
                  <div
                    onClick={() =>
                      setExpandedUserId(isExpanded ? null : customer.id)
                    }
                    className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-lg shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {customer.name}
                          </h3>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            {userOrders.length} คำสั่งซื้อ
                          </span>
                        </div>

                        {/* Customer Contact & Address */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-mono">
                            ✉️ {customer.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <PhoneIcon size={12} /> {customer.phone}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPinIcon size={12} className="shrink-0 text-slate-400 dark:text-slate-500" />
                          <span className="truncate max-w-lg">{customer.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Spent Pill & Toggle */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800">
                      <div className="text-right">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          ยอดรวมการสั่งซื้อสะสม
                        </span>
                        <span className="text-lg font-black text-red-600 dark:text-red-400 block">
                          ฿{totalSpent.toLocaleString()}
                        </span>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors">
                        {isExpanded ? "ย่อรายละเอียด ▲" : "ดูรายการสินค้า ▼"}
                      </button>
                    </div>
                  </div>

                  {/* Customer Orders Body (Expanded View) */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 space-y-6 transition-colors">
                      {userOrders.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
                          ยังไม่มีคำสั่งซื้อจากลูกค้ารายนี้
                        </p>
                      ) : (
                        userOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-slate-50/40 dark:bg-slate-800/30 space-y-4"
                          >
                            {/* Order Header Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-black text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                  {ord.id}
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  สั่งเมื่อ: {new Date(ord.createdAt).toLocaleString("th-TH")}
                                </span>
                              </div>

                              {/* Status Badge & Status Changer Dropdown */}
                              <div className="flex items-center gap-2">
                                {renderStatusBadge(ord.status)}
                                <div className="flex items-center gap-1.5">
                                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    เปลี่ยนสถานะ:
                                  </label>
                                  <select
                                    value={ord.status}
                                    onChange={(e) =>
                                      updateOrderStatus(ord.id, e.target.value as OrderStatus)
                                    }
                                    className="py-1 px-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs focus:outline-none focus:ring-1 focus:ring-red-500"
                                  >
                                    <option value="pending">รอชำระเงิน</option>
                                    <option value="paid">ชำระเงินแล้ว</option>
                                    <option value="processing">กำลังจัดเตรียมสินค้า</option>
                                    <option value="shipped">จัดส่งสินค้าแล้ว</option>
                                    <option value="completed">สำเร็จเรียบร้อย</option>
                                    <option value="cancelled">ยกเลิก</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Ordered Items List */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                รายการสินค้าที่สั่งซื้อ ({ord.items.length} ชนิด):
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {ord.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 bg-white dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
                                  >
                                    <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
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
                                    <div className="min-w-0 flex-1">
                                      <span className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1 block">
                                        {item.product.name}
                                      </span>
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                                        SKU: {item.product.sku}
                                      </span>
                                      <div className="flex items-center justify-between mt-1 text-xs">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                                          จำนวน: <strong className="text-slate-700 dark:text-slate-200">{item.quantity}</strong> ชิ้น
                                        </span>
                                        <span className="font-bold text-red-600 dark:text-red-400">
                                          ฿{(item.product.price * item.quantity).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Total & Delivery Details */}
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                              <div className="text-slate-500 dark:text-slate-400">
                                จัดส่งไปที่: <strong className="text-slate-700 dark:text-slate-300">{ord.shippingAddress}</strong>
                                {ord.notes && (
                                  <span className="block text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                                    หมายเหตุ: {ord.notes}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-slate-500 dark:text-slate-400 mr-2">ยอดชำระคำสั่งซื้อนี้:</span>
                                <span className="text-base font-black text-red-600 dark:text-red-400">
                                  ฿{ord.total.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: ALL ORDERS TABLE */}
        {activeTab === "all-orders" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">รหัสคำสั่งซื้อ</th>
                    <th className="py-3.5 px-4">ลูกค้า (Customer)</th>
                    <th className="py-3.5 px-4">สินค้าที่สั่ง</th>
                    <th className="py-3.5 px-4">ยอดรวม (THB)</th>
                    <th className="py-3.5 px-4">สถานะ</th>
                    <th className="py-3.5 px-4">จัดการสถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {ord.id}
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-sans font-normal mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString("th-TH")}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <strong className="block text-slate-900 dark:text-white">{ord.customerName}</strong>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-semibold block truncate text-slate-800 dark:text-slate-200">
                          {ord.items.map((it) => `${it.product.name} (x${it.quantity})`).join(", ")}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {ord.items.length} รายการ
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-red-600 dark:text-red-400 text-sm">
                        ฿{ord.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{renderStatusBadge(ord.status)}</td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className="py-1 px-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs focus:outline-none focus:ring-1 focus:ring-red-500"
                        >
                          <option value="pending">รอชำระ</option>
                          <option value="paid">ชำระแล้ว</option>
                          <option value="processing">เตรียมของ</option>
                          <option value="shipped">จัดส่งแล้ว</option>
                          <option value="completed">สำเร็จ</option>
                          <option value="cancelled">ยกเลิก</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT (RENAME & CHANGE PRICE) */}
        {activeTab === "products" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/30">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  จัดการชื่อและราคาสินค้า (Admin Product Management)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  แก้ไขชื่อสินค้า ปรับเปลี่ยนราคา และเพิ่ม/ลบสินค้าได้ทันที โดยจะแสดงผลไปยังหน้าร้านค้าโดยอัตโนมัติ
                </p>
              </div>
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  ทั้งหมด {filteredAdminProducts.length} รายการ
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 cursor-pointer transition-all duration-150"
                >
                  <PlusIcon size={14} />
                  <span>+ เพิ่มสินค้าใหม่</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">รูปภาพ</th>
                    <th className="py-3 px-4">ชื่อสินค้า</th>
                    <th className="py-3 px-4">รหัส SKU</th>
                    <th className="py-3 px-4">ราคาพิเศษ</th>
                    <th className="py-3 px-4">ราคาเดิม</th>
                    <th className="py-3 px-4">ส่วนลด</th>
                    <th className="py-3 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredAdminProducts.map((prod) => (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                          {prod.images && prod.images[0] ? (
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100 max-w-xs">
                        <div className="line-clamp-2" title={prod.name}>
                          {prod.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                        {prod.sku}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-red-600 dark:text-red-400 text-sm">
                        ฿{prod.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 dark:text-slate-500">
                        {prod.originalPrice > prod.price ? (
                          <span className="line-through">
                            ฿{prod.originalPrice.toLocaleString()}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {prod.discountPercent && prod.discountPercent > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-black text-[11px]">
                            -{prod.discountPercent}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(prod)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all duration-150"
                            title="แก้ไขชื่อและราคา"
                          >
                            <EditIcon size={13} />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(prod)}
                            className="px-2.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/80 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1 border border-red-200 dark:border-red-900/60 active:scale-95 cursor-pointer transition-all duration-150"
                            title="ลบสินค้าออกจากระบบ"
                          >
                            <TrashIcon size={13} />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

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

      {/* Admin Edit Product Modal */}
      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
      />

      {/* Admin Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Admin Delete Confirm Modal */}
      <DeleteProductConfirmModal
        isOpen={!!deletingProduct}
        product={deletingProduct}
        onCancel={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) {
            deleteProduct(deletingProduct.id);
            setDeletingProduct(null);
          }
        }}
      />
    </div>
  );
}

