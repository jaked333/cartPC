"use client";

import React, { useState, useEffect } from "react";
import { SEED_CATEGORIES, SEED_BRANDS } from "@/data/seed";
import { useProducts, NewProductInput } from "@/context/ProductContext";
import { UseCaseId } from "@/types";
import { USE_CASE_PRESETS } from "@/components/UseCaseChips";
import {
  XIcon,
  PlusIcon,
  CheckIcon,
  SparklesIcon,
  CpuIcon,
} from "./Icons";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset hardware sample images for quick testing by Admin
const SAMPLE_IMAGES = [
  {
    label: "AMD CPU",
    url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "GPU Card",
    url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Motherboard",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
  },
  {
    label: "Gaming Mouse",
    url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  },
];

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { addProduct } = useProducts();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(SEED_CATEGORIES[0]?.id || "cat-cpu");
  const [brandId, setBrandId] = useState(SEED_BRANDS[0]?.id || "b-asus");
  const [price, setPrice] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [stockQty, setStockQty] = useState<number>(10);
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUseCases, setSelectedUseCases] = useState<UseCaseId[]>([]);
  
  // Custom Specs (key-value)
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [customSpecs, setCustomSpecs] = useState<Record<string, string>>({});

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate random SKU on open or reset
  const generateRandomSku = (catSlug?: string) => {
    const prefix = catSlug ? catSlug.toUpperCase() : "HW";
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const num = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${randomCode}-${num}`;
  };

  useEffect(() => {
    if (isOpen) {
      // Reset form
      setName("");
      setCategoryId(SEED_CATEGORIES[0]?.id || "cat-cpu");
      setBrandId(SEED_BRANDS[0]?.id || "b-asus");
      setPrice("");
      setOriginalPrice("");
      setStockQty(10);
      setSku(generateRandomSku("CPU"));
      setImageUrl("");
      setDescription("");
      setSelectedUseCases([]);
      setCustomSpecs({});
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real-time discount calculation
  const numPrice = Number(price) || 0;
  const numOriginalPrice = Number(originalPrice) || 0;
  const discountAmount = numOriginalPrice > numPrice ? numOriginalPrice - numPrice : 0;
  const discountPercent =
    numOriginalPrice > numPrice && numOriginalPrice > 0
      ? Math.round((discountAmount / numOriginalPrice) * 100)
      : 0;

  const toggleUseCase = (id: UseCaseId) => {
    setSelectedUseCases((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setCustomSpecs((prev) => ({
      ...prev,
      [specKey.trim()]: specVal.trim(),
    }));
    setSpecKey("");
    setSpecVal("");
  };

  const handleRemoveSpec = (key: string) => {
    setCustomSpecs((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("กรุณากรอกชื่อสินค้า");
      return;
    }

    if (numPrice <= 0) {
      setError("ราคาสินค้าต้องมากกว่า 0 บาท");
      return;
    }

    const newProdData: NewProductInput = {
      name: name.trim(),
      categoryId,
      brandId,
      price: numPrice,
      originalPrice: numOriginalPrice >= numPrice ? numOriginalPrice : numPrice,
      stockQty: Number(stockQty) >= 0 ? Number(stockQty) : 10,
      sku: sku.trim() || generateRandomSku(),
      description: description.trim() || "สินค้าไอทีคุณภาพแท้ 100% รับประกันศูนย์ไทย",
      images: imageUrl.trim() ? [imageUrl.trim()] : [SAMPLE_IMAGES[0].url],
      useCases: selectedUseCases,
      specs: Object.keys(customSpecs).length > 0 ? customSpecs : undefined,
    };

    addProduct(newProdData);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-7 text-slate-800 dark:text-slate-100 my-8 max-h-[92vh] overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="ปิดหน้าต่าง"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <XIcon size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
            <PlusIcon size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                เพิ่มสินค้าใหม่เข้าระบบ
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              กรอกรายละเอียดสินค้าเพื่อนำไปแสดงผลบนหน้าร้านค้าแบบเรียลไทม์
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-4 p-3.5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 text-green-700 dark:text-green-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckIcon size={16} />
            <span>เพิ่มสินค้าใหม่สำเร็จแล้ว! กำลังบันทึกข้อมูล...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                หมวดหมู่สินค้า <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  const selCat = SEED_CATEGORIES.find((c) => c.id === e.target.value);
                  if (selCat) setSku(generateRandomSku(selCat.slug));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
              >
                {SEED_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameTh}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                แบรนด์ผู้ผลิต <span className="text-red-500">*</span>
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
              >
                {SEED_BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              ชื่อสินค้า (Product Name) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น Intel Core i5-14600K 3.5GHz 14C/20T หรือ ASUS RTX 4070 SUPER DUAL OC"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>

          {/* Row 3: SKU & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  รหัสสินค้า (SKU)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const selCat = SEED_CATEGORIES.find((c) => c.id === categoryId);
                    setSku(generateRandomSku(selCat?.slug));
                  }}
                  className="text-[11px] text-red-600 dark:text-red-400 hover:underline font-semibold cursor-pointer"
                >
                  ⚡ สุ่ม SKU ใหม่
                </button>
              </div>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="เช่น CPU-AMD-7800X"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                จำนวนสต็อกคงเหลือ (Stock Qty)
              </label>
              <input
                type="number"
                min="0"
                value={stockQty}
                onChange={(e) => setStockQty(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all"
              />
            </div>
          </div>

          {/* Row 4: Pricing & Live Discount */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                💰 กำหนดราคาและส่วนลด
              </span>
              {discountPercent > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 font-black text-xs">
                  ลด {discountPercent}% (ประหยัด ฿{discountAmount.toLocaleString()})
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  ราคาพิเศษ / ราคาขายจริง (บาท) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">฿</span>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="เช่น 12900"
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-red-600 dark:text-red-400 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  ราคาเดิมก่อนลด (บาท) <span className="text-slate-400 font-normal">(ถ้ามี)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">฿</span>
                  <input
                    type="number"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="เช่น 14900"
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Image URL & Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              ลิงก์รูปภาพสินค้า (Image URL)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="วาง Direct URL รูปภาพ (https://...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  ล้าง
                </button>
              )}
            </div>

            {/* Sample Image Quick-Picks */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-400">รูปตัวอย่างด่วน:</span>
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => setImageUrl(sample.url)}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Live Image Preview Thumbnail */}
            {imageUrl && (
              <div className="mt-2.5 flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = SAMPLE_IMAGES[0].url;
                    }}
                  />
                </div>
                <span className="text-[11px] text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  <CheckIcon size={12} /> แสดงพรีวิวรูปภาพเรียบร้อย
                </span>
              </div>
            )}
          </div>

          {/* Row 6: Use-Case Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              แท็กแนะนำตามการใช้งานจริง (Smart Use-Case Presets)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {USE_CASE_PRESETS.map((preset) => {
                const isChecked = selectedUseCases.includes(preset.id);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => toggleUseCase(preset.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isChecked
                        ? "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold leading-tight line-clamp-1">
                        {preset.label}
                      </p>
                      <p className="text-[10px] opacity-75 truncate">
                        {preset.focusText}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isChecked
                          ? "bg-red-500 border-red-500 text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {isChecked && <CheckIcon size={10} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 7: Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              รายละเอียดสินค้า (Description)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="จุดเด่น สเปกสั้นๆ เช่น รับประกันศูนย์ 3 ปี, ประกัน SYNNEX/WTG..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all resize-none"
            />
          </div>

          {/* Row 8: Optional Custom Specs for Side-by-Side Compare */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              สเปกสำหรับระบบเปรียบเทียบ (Specs for Compare - ไม่บังคับ)
            </span>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="หัวข้อ (เช่น ซ็อกเก็ต, พัดลม)"
                className="w-1/2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <input
                type="text"
                value={specVal}
                onChange={(e) => setSpecVal(e.target.value)}
                placeholder="ค่าสเปก (เช่น LGA1700, 3 พัดลม)"
                className="w-1/2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                เพิ่ม
              </button>
            </div>

            {Object.keys(customSpecs).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(customSpecs).map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px]"
                  >
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {k}:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {v}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(k)}
                      className="text-slate-400 hover:text-red-500 font-bold text-xs cursor-pointer ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 active:scale-95 text-white transition-all shadow-md shadow-red-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <PlusIcon size={15} />
              <span>{isSuccess ? "กำลังบันทึก..." : "บันทึกและเพิ่มสินค้า"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
