"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import CartDrawer from "@/components/CartDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
