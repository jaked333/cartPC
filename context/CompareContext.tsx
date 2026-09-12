"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

const MAX_COMPARE_ITEMS = 4;

interface CompareContextType {
  compareList: Product[];
  isOpen: boolean;
  maxItems: number;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  setIsOpen: (open: boolean) => void;
  isInCompare: (productId: string) => boolean;
  toggleCompare: (product: Product) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pcshop_compare");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareList(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load compare items", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("pcshop_compare", JSON.stringify(compareList));
      } catch (e) {
        console.error("Failed to save compare items", e);
      }
    }
  }, [compareList, isInitialized]);

  // Check if a product is already in compare list
  const isInCompare = (productId: string): boolean => {
    return compareList.some((item) => item.id === productId);
  };

  // Add product to compare list with strict validation
  const addToCompare = (product: Product): boolean => {
    // Rule 1: Prevent duplicate items
    if (isInCompare(product.id)) {
      return false;
    }

    // Rule 2: Enforce category validation
    if (compareList.length > 0) {
      const firstCategory = compareList[0].categoryId;
      if (product.categoryId !== firstCategory) {
        alert("สามารถเปรียบเทียบได้เฉพาะสินค้าในหมวดเดียวกันเท่านั้น");
        return false;
      }
    }

    // Rule 3: Enforce max item limit
    if (compareList.length >= MAX_COMPARE_ITEMS) {
      alert(`สามารถเปรียบเทียบสินค้าได้สูงสุด ${MAX_COMPARE_ITEMS} ชิ้นเท่านั้น`);
      return false;
    }

    setCompareList((prev) => [...prev, product]);
    return true;
  };

  // Remove single product by ID
  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      // Auto-close modal if no items or fewer than 1 item left
      if (updated.length === 0) {
        setIsOpen(false);
      }
      return updated;
    });
  };

  // Clear all products in compare list
  const clearCompare = () => {
    setCompareList([]);
    setIsOpen(false);
  };

  // Toggle item in compare list
  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isOpen,
        maxItems: MAX_COMPARE_ITEMS,
        addToCompare,
        removeFromCompare,
        clearCompare,
        setIsOpen,
        isInCompare,
        toggleCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

