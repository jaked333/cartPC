"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LockIcon,
  MailIcon,
  CpuIcon,
  UserIcon,
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/Icons";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "bg-slate-200 dark:bg-slate-700" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) || /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 25, label: "อ่อนมาก (Very Weak)", color: "bg-red-500" };
    if (score === 2) return { score: 50, label: "ปานกลาง (Fair)", color: "bg-amber-500" };
    if (score === 3) return { score: 75, label: "ดี (Good)", color: "bg-blue-500" };
    return { score: 100, label: "แข็งแรงมาก (Strong)", color: "bg-emerald-500" };
  }, [password]);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("กรุณากรอกชื่อ-นามสกุลของคุณ");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError("กรุณากรอกรูปแบบอีเมลที่ถูกต้อง เช่น yourname@domain.com");
      return;
    }
    if (!password || password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    if (!agreeTerms) {
      setError("กรุณายอมรับเงื่อนไขและข้อตกลงการให้บริการ");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name,
        email,
        password,
        role: "customer",
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setError(res.error || "การสมัครสมาชิกล้มเหลว โปรดลองใหม่อีกครั้ง");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col justify-between text-slate-800 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-200 dark:shadow-red-950/40 group-hover:bg-red-700 transition-colors">
              <CpuIcon size={24} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white block leading-tight">
                PC<span className="text-red-600">PARTS</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block -mt-0.5">
                ร้านคอมพิวเตอร์และอุปกรณ์ไอที
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            ← กลับหน้าหลัก (Storefront)
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/60 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-colors">
            <div className="text-center mb-6">
              <div className="inline-flex p-2 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl mb-2">
                <UserIcon size={24} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                สมัครสมาชิกใหม่ (Register)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                สร้างบัญชีผู้ใช้งานเพื่อสั่งซื้อสินค้าและติดตามสถานะพัสดุ
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
                <span className="text-sm">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckIcon size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>สมัครสมาชิกสำเร็จ! บันทึกข้อมูลเรียบร้อย กำลังเข้าสู่ระบบ...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Name */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อ - นามสกุล <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="สมชาย ใจดี"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  อีเมล (Email Address) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <MailIcon size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    รหัสผ่าน (Password) <span className="text-red-500">*</span>
                  </label>
                  {password && (
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      ความแข็งแรง:{" "}
                      <span className="font-bold">{passwordStrength.label}</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <LockIcon size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ขั้นต่ำ 6 - 8 ตัวอักษร"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>

                {/* Password Strength Progress Bar */}
                {password && (
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    ยืนยันรหัสผ่าน (Confirm Password) <span className="text-red-500">*</span>
                  </label>
                  {confirmPassword && (
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                        passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {passwordsMatch ? "✓ รหัสผ่านตรงกัน" : "✗ รหัสผ่านไม่ตรงกัน"}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <LockIcon size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านเดิมอีกครั้ง"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>

              {/* Agree terms */}
              <div className="flex items-start pt-1">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="ml-2 text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                  ฉันยอมรับ{" "}
                  <a href="#" className="text-red-600 dark:text-red-400 hover:underline font-medium">
                    ข้อตกลงการให้บริการ
                  </a>{" "}
                  และนโยบายความเป็นส่วนตัวของ PC PARTS
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-red-200 dark:shadow-red-950/50 hover:shadow-red-300 dark:hover:shadow-red-900/60 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 select-none"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>กำลังสร้างบัญชี...</span>
                  </>
                ) : (
                  <>
                    <span>ยืนยันการสมัครสมาชิก (Register)</span>
                    <ArrowRightIcon size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
              มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
              <Link
                href="/login"
                className="font-bold text-red-600 dark:text-red-400 hover:underline active:scale-95 inline-block transition-transform duration-150"
              >
                เข้าสู่ระบบที่นี่ (Sign In)
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 transition-colors">
        © 2026 PC PARTS Thailand. All rights reserved.
      </footer>
    </div>
  );
}
