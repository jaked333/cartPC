export type Role = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  nameTh: string;
  nameEn: string;
  slug: string;
  iconName: string;
  sortOrder: number;
  attributeFilterKey?: string;
  attributeFilterLabel?: string;
  attributeOptions?: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  stockQty: number;
  images: string[];
  specs: Record<string, string>;
  attributes: Record<string, string>;
  sku: string;
  isActive: boolean;
  salesCount?: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | "pending"      // รอชำระเงิน
  | "paid"         // ชำระเงินแล้ว
  | "processing"   // กำลังจัดเตรียมสินค้า
  | "shipped"      // จัดส่งแล้ว
  | "completed"    // สำเร็จ
  | "cancelled";   // ยกเลิก

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "discount-desc"
  | "newest"
  | "sales-desc";
