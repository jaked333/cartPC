"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { SEED_PRODUCTS } from "@/data/seed";

interface ProductContextType {
  products: Product[];
  updateProduct: (
    id: string,
    updates: { name?: string; price?: number; originalPrice?: number }
  ) => void;
  resetProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = "pcshop_products_v2";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted product changes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with SEED_PRODUCTS to ensure image URLs and specs remain consistent
          const merged = SEED_PRODUCTS.map((seedP) => {
            const match = parsed.find((p) => p.id === seedP.id);
            if (match) {
              return {
                ...seedP,
                name: match.name || seedP.name,
                price: match.price !== undefined ? match.price : seedP.price,
                originalPrice:
                  match.originalPrice !== undefined
                    ? match.originalPrice
                    : seedP.originalPrice,
                discountPercent:
                  match.discountPercent !== undefined
                    ? match.discountPercent
                    : seedP.discountPercent,
              };
            }
            return seedP;
          });
          setProducts(merged);
        }
      }
    } catch (e) {
      console.error("Failed to load products from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update product name, price, and recalculate discount
  const updateProduct = (
    id: string,
    updates: { name?: string; price?: number; originalPrice?: number }
  ) => {
    setProducts((prev) => {
      const next = prev.map((prod) => {
        if (prod.id !== id) return prod;

        const newName =
          updates.name !== undefined ? updates.name.trim() : prod.name;
        const newPrice =
          updates.price !== undefined ? Number(updates.price) : prod.price;
        const newOriginalPrice =
          updates.originalPrice !== undefined
            ? Number(updates.originalPrice)
            : prod.originalPrice;

        // Recalculate discount percent
        let newDiscountPercent = 0;
        if (newOriginalPrice > newPrice && newOriginalPrice > 0) {
          newDiscountPercent = Math.round(
            ((newOriginalPrice - newPrice) / newOriginalPrice) * 100
          );
        }

        return {
          ...prod,
          name: newName || prod.name,
          price: newPrice >= 0 ? newPrice : prod.price,
          originalPrice:
            newOriginalPrice >= newPrice ? newOriginalPrice : newPrice,
          discountPercent: newDiscountPercent,
        };
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save products to localStorage", e);
      }

      return next;
    });
  };

  const resetProducts = () => {
    setProducts(SEED_PRODUCTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to reset products", e);
    }
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct, resetProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}

