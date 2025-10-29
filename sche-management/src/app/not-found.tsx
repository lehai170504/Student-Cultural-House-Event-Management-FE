"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-50 text-center p-6 overflow-hidden">
      {/* Logo with floating animation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex justify-center mb-4"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/LogoRMBG.png"
            alt="Logo"
            width={120}
            height={120}
            className="mx-auto object-contain drop-shadow-md"
          />
        </motion.div>
      </motion.div>

      {/* Icon animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
        className="flex justify-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          <AlertTriangle className="w-16 h-16 text-orange-500" />
        </motion.div>
      </motion.div>

      {/* Text section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="space-y-4 mt-6"
      >
        <h1 className="text-5xl font-extrabold text-gray-800">
          404 – Trang không tồn tại
        </h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>
      </motion.div>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-8"
      >
        <Button
          asChild
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg font-medium px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105"
        >
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </motion.div>

      {/* Decorative background shapes */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-40"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-amber-300 rounded-full blur-3xl opacity-40"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />
    </div>
  );
}
