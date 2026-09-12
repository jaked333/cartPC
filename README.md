# 🖥️ ShopControl — PC Parts E-Commerce & Inventory Management System

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-149eca?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

> **ShopControl** is a modern, full-stack, responsive PC components retail storefront and administrative management portal built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.
>
> ระบบซื้อขายและจัดการคลังอุปกรณ์คอมพิวเตอร์ออนไลน์ ดีไซน์ทันสมัย รองรับ Dark / Light Mode เต็มรูปแบบ พร้อมระบบแยกสิทธิ์ Admin และ Customer

---

## 📑 Table of Contents (สารบัญ)
- [✨ Key Features](#-key-features)
  - [🛒 Storefront & Shopping Experience](#-storefront--shopping-experience)
  - [🌓 Dark / Light Mode System](#-dark--light-mode-system)
  - [🔐 Authentication & Role Separation](#-authentication--role-separation)
  - [⚙️ Admin Management Portal](#️-admin-management-portal)
  - [📦 Customer Order Tracking](#-customer-order-tracking)
- [👥 Demo Accounts (บัญชีทดสอบ)](#-demo-accounts-บัญชีทดสอบ)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start (เริ่มต้นใช้งาน)](#-quick-start-เริ่มต้นใช้งาน)
- [📂 Project Structure (โครงสร้างโฟลเดอร์)](#-project-structure-โครงสร้างโฟลเดอร์)
- [📤 How to Push to Your GitHub](#-how-to-push-to-your-github)
- [📄 License](#-license)

---

## ✨ Key Features

### 🛒 Storefront & Shopping Experience
- **Interactive Product Catalog**: Browse curated PC parts spanning 10+ categories (CPU, GPU, Mainboard, RAM, SSD/M.2, PSU, Case, Cooling, Gaming Gear, Mouse, Keyboard).
- **Search & Advanced Filtering**:
  - Live, instant search by product name, model, or brand.
  - Multi-select brand filters (ASUS, MSI, Gigabyte, Intel, AMD, Corsair, Razer, Logitech, Kingston, etc.).
  - Category-specific attribute filtering (e.g. Mouse Type: Wired / Wireless).
- **Multi-Option Sorting**: Sort products by price (Low to High, High to Low), newest arrivals, or best-sellers.
- **Detailed Product Modal**: Click any product card to view a dedicated modal showing high-definition imagery, full technical specifications table, stock availability status, and pricing breakdown.
- **Side-by-Side Product Compare (เปรียบเทียบสเปกสินค้า)**:
  - Select 2 to 4 items in the same category (e.g. CPU vs CPU, GPU vs GPU) to compare side-by-side.
  - Floating bottom toolbar with thumbnail previews and quick remove buttons.
  - Interactive comparison table modal dynamically extracting all unique specification keys.
  - One-click toggling directly on product cards with instant category constraint protection.
- **Smart Use-Case Filtering (แท็บฟิลเตอร์แนะนำตามการใช้งานจริง)**:
  - Curated quick-filter chips for non-tech-savvy users inspired by modern Thai PC retailers (iHAVECPU style).
  - Presets: 🎮 เล่นเกม 1080p ลื่นๆ (งบประหยัด), 🎬 ตัดต่อวิดีโอ 4K / ทำงาน 3D, 📦 ไซส์กะทัดรัด (Mini-ITX), ⚡ Competitive E-Sports 240Hz+.
  - Real-time toast alert pill feedback when selecting presets.
- **Live Cart Drawer**:
  - Slide-out cart panel showing running totals, item counts, and quick quantity increments/decrements.
  - Smooth slide animations and empty-state guidance.
- **Streamlined Checkout**:
  - Enter shipping and contact details.
  - Simulated payment flow with instant order confirmation and redirection to order tracking.

### 🌓 Dark / Light Mode System
- Complete dark/light mode toggle with theme persistence in `localStorage`.
- Handcrafted custom SVG icons designed to automatically invert and harmonize between modes.
- Eye-friendly zinc/slate dark palette with bright amber and cyan accent highlights.

### 🔐 Authentication & Role Separation
- Role-based authentication: `customer` vs. `admin`.
- Custom authentication context with persistent session simulation.
- **Accidental Sign-Out Protection**: A styled modal asks for user confirmation before logging out.
- **Smooth Loading States**: Tactile button feedback with animated spinners on both Login and Registration forms.

### ⚙️ Admin Management Portal (`/admin`)
- **Restricted Access**: Customers cannot access the admin portal; non-admin users are automatically redirected.
- **Admin Shopping Safeguard**: Admins cannot add items to the cart or place consumer orders (action buttons are disabled with clear admin tooltips).
- **Live Product Editing**:
  - Admins can rename products and adjust prices on the fly directly from the storefront cards or admin dashboard.
  - Changes instantly reflect across the entire catalog and cart state.
- **Customer-Grouped Orders Management**:
  - View incoming orders organized and grouped cleanly by customer name and contact info.
  - Summary metrics: total spend per customer and itemized breakdown.
  - Status pipeline controller: update order statuses across `Pending`, `Processing`, `Shipped`, `Completed`, and `Cancelled`.

### 📦 Customer Order Tracking (`/orders`)
- Logged-in customers can review their complete order history.
- Real-time status indicators (badge colors reflect current dispatch state).
- Detailed shipping address records and item summaries.

---

## 👥 Demo Accounts (บัญชีทดสอบ)

You can use these pre-seeded accounts to explore both roles:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@pcshop.co.th` | `admin1234` | Edit product names & prices, manage all orders, update status |
| 🛍️ **Customer** | `customer@pcshop.co.th` | `user1234` | Browse catalog, add to cart, checkout, view order history |

> *Note: You can also register a new customer account anytime via the `/register` page.*

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.3.5](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19.2.8](https://react.dev/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom dark mode variants
- **Icons**: Custom responsive SVG icons (`components/Icons.tsx`)
- **State Management**: React Context API (`ThemeContext`, `AuthContext`, `ProductContext`, `OrderContext`, `CartContext`)
- **Image Optimization**: `next/image` with remote domains (Unsplash CDN) and local public assets

---

## 🚀 Quick Start (เริ่มต้นใช้งาน)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/shopcon11.git
cd shopcon11
git clone https://github.com/jaked333/cartPC.git
cd cartPC
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📂 Project Structure (โครงสร้างโฟลเดอร์)

```text
shopcon11/
├── app/
│   ├── admin/              # Admin dashboard (Order management & Product editor)
│   ├── login/              # Login page with smooth spinner feedback
│   ├── orders/             # Customer order history & tracking
│   ├── register/           # Customer registration page
│   ├── globals.css         # Tailwind v4 configuration & theme styles
│   ├── layout.tsx          # Root layout wrapping Context Providers
│   └── page.tsx            # Main storefront (Catalog, Category filters, Search)
├── components/
│   ├── CartDrawer.tsx      # Slide-out shopping cart & checkout modal
│   ├── CategorySidebar.tsx # Category navigation with active state
│   ├── CompareFloatingBar.tsx # Floating bottom bar with thumbnail selection
│   ├── CompareModal.tsx    # Side-by-side technical spec comparison table modal
│   ├── EditProductModal.tsx# Admin live product rename & price adjust modal
│   ├── Icons.tsx           # Handcrafted SVG icons with dark mode support
│   ├── LogoutConfirmModal.tsx # Sign-out confirmation dialog
│   ├── Navbar.tsx          # Top bar (Search, Theme switch, Cart badge, Auth)
│   ├── ProductCard.tsx     # Product card with compare toggle, badges, and actions
│   ├── ProductDetailModal.tsx # Detailed product specs & preview modal
│   ├── ProductFilters.tsx  # Filter chips (Brand & attribute filters)
│   ├── Providers.tsx       # Unified context provider wrapper
│   └── UseCaseChips.tsx    # Smart use-case preset filter chip bar
├── context/
│   ├── AuthContext.tsx     # Role-based user state & demo auth
│   ├── CartContext.tsx     # Cart storage & item manipulation
│   ├── CompareContext.tsx  # Product comparison state & category validator
│   ├── OrderContext.tsx    # Order pipeline & status management
│   ├── ProductContext.tsx  # Live product catalog & pricing updater
│   └── ThemeContext.tsx    # Dark/Light mode provider with persistence
├── data/
│   └── seed.ts             # 22+ PC parts seed data with specs & distinct images
├── public/
│   └── products/           # Local lightweight product assets
├── types/
│   └── index.ts            # TypeScript interfaces (Product, Category, Order, User)
├── package.json
└── tsconfig.json
```

---

## 📤 How to Push to Your GitHub

Follow these steps in your terminal to publish this repository to your GitHub:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: complete PC Parts E-Commerce & Management System"

# 4. Rename branch to main
git branch -M main

# 5. Add your GitHub remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
# 5. Add your GitHub remote repository
git remote add origin https://github.com/jaked333/cartPC.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
