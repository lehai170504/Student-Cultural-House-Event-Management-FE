"use client";

import { AuthDemo } from "@/components/AuthDemo";
import { UserProfile } from "@/components/UserProfile";
import { AuthStatus } from "@/components/AuthStatus";

export default function AuthDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AWS Cognito OIDC Demo
          </h1>
          <p className="text-gray-600">
            Demo authentication với AWS Cognito sử dụng react-oidc-context
          </p>
        </div>

        {/* Auth Status Warning */}
        <div className="mb-6">
          <AuthStatus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Demo */}
          <div>
            <AuthDemo />
          </div>

          {/* User Profile */}
          <div>
            <UserProfile />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Hướng dẫn sử dụng:</h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p><strong>1. Sign in:</strong> Click "Sign in" để đăng nhập qua AWS Cognito</p>
            <p><strong>2. Sign out (Local):</strong> Xóa thông tin user khỏi localStorage</p>
            <p><strong>3. Sign out (Cognito):</strong> Đăng xuất hoàn toàn từ Cognito</p>
            <p><strong>4. Tokens:</strong> Hiển thị ID Token, Access Token và Refresh Token</p>
          </div>
        </div>
      </div>
    </div>
  );
}
