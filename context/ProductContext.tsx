"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { SEED_PRODUCTS } from "@/data/seed";

export interface NewProductInput {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: number;
  originalPrice?: number;
  stockQty?: number;
  images?: string[];
  sku?: string;
  attributes?: Record<string, string>;
  specs?: Record<string, string | number>;
  useCases?: ("gaming-1080p" | "creator-4k" | "mini-itx" | "esports")[];
  isActive?: boolean;
}

interface ProductContextType {
  products: Product[];
  addProduct: (input: NewProductInput | Product) => Product;
  deleteProduct: (id: string) => void;
  updateProduct: (
    id: string,
    updates: { name?: string; price?: number; originalPrice?: number }
  ) => void;
  resetProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = "pcshop_products_v3";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted products from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
          setIsLoaded(true);
          return;
        }
      }
      // If no stored v3 products, initialize with SEED_PRODUCTS
      setProducts(SEED_PRODUCTS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
      } catch (err) {
        console.error("Failed to seed initial products to localStorage", err);
      }
    } catch (e) {
      console.error("Failed to load products from localStorage", e);
      setProducts(SEED_PRODUCTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Add a new product to catalog
  const addProduct = (input: NewProductInput | Product): Product => {
    const rawPrice = Number(input.price) || 0;
    const rawOriginalPrice =
      input.originalPrice !== undefined && Number(input.originalPrice) > 0
        ? Number(input.originalPrice)
        : rawPrice;

    const discountPercent =
      rawOriginalPrice > rawPrice && rawOriginalPrice > 0
        ? Math.round(((rawOriginalPrice - rawPrice) / rawOriginalPrice) * 100)
        : 0;

    const fallbackImage =
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80";

    const newProd: Product = {
      id:
        "id" in input && input.id
          ? input.id
          : `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: input.name.trim(),
      description: input.description?.trim() || "สินค้าไอทีคุณภาพแท้ 100% รับประกันศูนย์ไทย",
      categoryId: input.categoryId || "cat-cpu",
      brandId: input.brandId || "b-asus",
      price: rawPrice,
      originalPrice: rawOriginalPrice >= rawPrice ? rawOriginalPrice : rawPrice,
      discountPercent: discountPercent,
      stockQty: input.stockQty !== undefined ? Number(input.stockQty) : 10,
      images:
        input.images && input.images.length > 0 && input.images[0].trim()
          ? input.images
          : [fallbackImage],
      sku:
        input.sku?.trim() ||
        `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(
          100 + Math.random() * 900
        )}`,
      attributes: input.attributes || {},
      specs: input.specs || {},
      useCases: input.useCases || [],
      isActive: input.isActive !== undefined ? input.isActive : true,
      salesCount: "salesCount" in input && typeof input.salesCount === "number" ? input.salesCount : 0,
      createdAt:
        "createdAt" in input && input.createdAt
          ? input.createdAt
          : new Date().toISOString(),
    };

    setProducts((prev) => {
      const next = [newProd, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save products after add", e);
      }
      return next;
    });

    return newProd;
  };

  // Delete product from catalog
  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save products after delete", e);
      }
      return next;
    });
  };

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
    } catch (e) {
      console.error("Failed to reset products", e);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        updateProduct,
        resetProducts,
      }}
    >
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
