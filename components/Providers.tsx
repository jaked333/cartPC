"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { CompareProvider } from "@/context/CompareContext";
import CartDrawer from "@/components/CartDrawer";
import CompareFloatingBar from "@/components/CompareFloatingBar";
import CompareModal from "@/components/CompareModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <CompareProvider>
                {children}
                <CartDrawer />
                <CompareFloatingBar />
                <CompareModal />
              </CompareProvider>
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
