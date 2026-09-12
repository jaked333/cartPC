"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role?: Role;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Built-in Seed Accounts with strict passwords
const DEFAULT_ACCOUNTS: User[] = [
  {
    id: "user-adm-1",
    name: "ผู้ดูแลระบบ (Admin)",
    email: "admin@pcshop.co.th",
    password: "admin1234",
    phone: "089-999-8888",
    address: "สำนักงานใหญ่ PC PARTS อาคารไอทีสแควร์ ชั้น 4 กทม.",
    role: "admin",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user-cust-1",
    name: "สมชาย ใจดี",
    email: "customer@pcshop.co.th",
    password: "user1234",
    phone: "081-234-5678",
    address: "45/2 หมู่ 5 ถ.วิภาวดีรังสิต แขวงลาดยาว เขตจตุจักร กทม. 10900",
    role: "customer",
    createdAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "user-cust-2",
    name: "กิตติศักดิ์ พัฒนา",
    email: "kittisak@gmail.com",
    password: "user1234",
    phone: "081-998-7766",
    address: "128/4 หมู่ 3 ถ.สุขุมวิท ต.เสม็ด อ.เมือง จ.ชลบุรี 20000",
    role: "customer",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "user-cust-3",
    name: "ธีรภัทร เมฆา",
    email: "teerapat@hotmail.com",
    password: "user1234",
    phone: "089-123-4567",
    address: "55/12 ซ.ลาดพร้าว 71 แขวงสะพานสอง เขตวังทองหลาง กทม. 10310",
    role: "customer",
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "user-cust-4",
    name: "ศิริพร วงศ์สุวรรณ",
    email: "siriporn@outlook.com",
    password: "user1234",
    phone: "084-555-1234",
    address: "99 อาคารภิรัชทาวเวอร์ ถ.สาทรใต้ แขวงยานนาวา เขตสาทร กทม. 10120",
    role: "customer",
    createdAt: "2026-01-20T00:00:00Z",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pcshop_auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to restore auth session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRegisteredUsers = (): User[] => {
    try {
      const stored = localStorage.getItem("pcshop_registered_users");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return [];
  };

  const getAllUsers = (): User[] => {
    const custom = getRegisteredUsers();
    // Merge without duplicates by email
    const merged = [...DEFAULT_ACCOUNTS];
    custom.forEach((u) => {
      if (!merged.some((m) => m.email.toLowerCase() === u.email.toLowerCase())) {
        merged.push(u);
      }
    });
    return merged;
  };

  const login = async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const allUsers = getAllUsers();

    // Look for matching user
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!found) {
      return { success: false, error: "ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาตรวจสอบอีเมลหรือสมัครสมาชิก" };
    }

    // STRICT PASSWORD CHECK
    if (found.password !== password) {
      return { success: false, error: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" };
    }

    // Login successful
    setUser(found);
    localStorage.setItem("pcshop_auth_user", JSON.stringify(found));
    return { success: true };
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role?: Role;
  }) => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const allUsers = getAllUsers();

    if (allUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: "อีเมลนี้ถูกลงทะเบียนใช้งานไปแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ" };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: trimmedEmail,
      password: data.password,
      phone: data.phone?.trim() || "",
      address: data.address?.trim() || "",
      role: data.role || "customer",
      createdAt: new Date().toISOString(),
    };

    try {
      const currentList = getRegisteredUsers();
      currentList.push(newUser);
      localStorage.setItem("pcshop_registered_users", JSON.stringify(currentList));
    } catch (e) {
      console.error(e);
    }

    // Auto-login the new user
    setUser(newUser);
    localStorage.setItem("pcshop_auth_user", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pcshop_auth_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, getAllUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
