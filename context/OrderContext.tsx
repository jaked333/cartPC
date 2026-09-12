"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderStatus, CartItem } from "@/types";
import { SEED_PRODUCTS } from "@/data/seed";

interface OrderContextType {
  orders: Order[];
  createOrder: (data: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByUserId: (userId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const SEED_ORDERS: Order[] = [
  {
    id: "ORD-2026-001",
    userId: "user-cust-1",
    customerName: "สมชาย ใจดี",
    customerEmail: "customer@pcshop.co.th",
    customerPhone: "081-234-5678",
    shippingAddress: "45/2 หมู่ 5 ถ.วิภาวดีรังสิต แขวงลาดยาว เขตจตุจักร กทม. 10900",
    items: [
      { product: SEED_PRODUCTS[0], quantity: 1 }, // AMD Ryzen 7 7800X3D
      { product: SEED_PRODUCTS[3], quantity: 1 }, // ASUS ROG STRIX B650-A
    ],
    subtotal: 24180,
    shippingFee: 0,
    total: 24180,
    status: "shipped",
    notes: "จัดส่งช่วงบ่าย ฝากไว้ที่ป้อมยามได้",
    createdAt: "2026-03-08T14:30:00Z",
  },
  {
    id: "ORD-2026-002",
    userId: "user-cust-2",
    customerName: "กิตติศักดิ์ พัฒนา",
    customerEmail: "kittisak@gmail.com",
    customerPhone: "081-998-7766",
    shippingAddress: "128/4 หมู่ 3 ถ.สุขุมวิท ต.เสม็ด อ.เมือง จ.ชลบุรี 20000",
    items: [
      { product: SEED_PRODUCTS[5], quantity: 1 }, // ASUS RTX 4080 SUPER
      { product: SEED_PRODUCTS[12], quantity: 1 }, // Corsair RM850e 850W
    ],
    subtotal: 48090,
    shippingFee: 0,
    total: 48090,
    status: "completed",
    notes: "ขอใบกำกับภาษีในนามบุคคล",
    createdAt: "2026-03-09T09:15:00Z",
  },
  {
    id: "ORD-2026-003",
    userId: "user-cust-1",
    customerName: "สมชาย ใจดี",
    customerEmail: "customer@pcshop.co.th",
    customerPhone: "081-234-5678",
    shippingAddress: "45/2 หมู่ 5 ถ.วิภาวดีรังสิต แขวงลาดยาว เขตจตุจักร กทม. 10900",
    items: [
      { product: SEED_PRODUCTS[15], quantity: 1 }, // Logitech G PRO X SUPERLIGHT 2
    ],
    subtotal: 4990,
    shippingFee: 0,
    total: 4990,
    status: "processing",
    createdAt: "2026-03-11T11:45:00Z",
  },
  {
    id: "ORD-2026-004",
    userId: "user-cust-3",
    customerName: "ธีรภัทร เมฆา",
    customerEmail: "teerapat@hotmail.com",
    customerPhone: "089-123-4567",
    shippingAddress: "55/12 ซ.ลาดพร้าว 71 แขวงสะพานสอง เขตวังทองหลาง กทม. 10310",
    items: [
      { product: SEED_PRODUCTS[19], quantity: 1 }, // Razer Huntsman V3 Pro
      { product: SEED_PRODUCTS[10], quantity: 1 }, // Kingston KC3000 1TB
    ],
    subtotal: 11280,
    shippingFee: 0,
    total: 11280,
    status: "pending",
    notes: "รอชำระผ่านพร้อมเพย์",
    createdAt: "2026-03-12T16:20:00Z",
  },
  {
    id: "ORD-2026-005",
    userId: "user-cust-4",
    customerName: "ศิริพร วงศ์สุวรรณ",
    customerEmail: "siriporn@outlook.com",
    customerPhone: "084-555-1234",
    shippingAddress: "99 อาคารภิรัชทาวเวอร์ ถ.สาทรใต้ แขวงยานนาวา เขตสาทร กทม. 10120",
    items: [
      { product: SEED_PRODUCTS[14], quantity: 1 }, // Lian Li O11 Vision White
      { product: SEED_PRODUCTS[15], quantity: 1 }, // Lian Li Galahad II LCD 360
    ],
    subtotal: 13280,
    shippingFee: 0,
    total: 13280,
    status: "paid",
    createdAt: "2026-03-12T18:05:00Z",
  },
];

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pcshop_orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        localStorage.setItem("pcshop_orders", JSON.stringify(SEED_ORDERS));
      }
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("pcshop_orders", JSON.stringify(orders));
      } catch (e) {
        console.error("Failed to save orders", e);
      }
    }
  }, [orders, isInitialized]);

  const createOrder = (data: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    notes?: string;
  }): Order => {
    const newOrder: Order = {
      id: `ORD-2026-${String(orders.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      status: "paid",
      ...data,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const getOrdersByUserId = (userId: string) => {
    return orders.filter((o) => o.userId === userId);
  };

  return (
    <OrderContext.Provider
      value={{ orders, createOrder, updateOrderStatus, getOrdersByUserId }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}

