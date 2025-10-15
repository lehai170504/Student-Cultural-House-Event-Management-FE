"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { signOutRedirect } from "@/config/oidc-config";

export function UserProfile() {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  const handleLogout = () => {
    console.log('Logout button clicked!');
    
    // BƯỚC 1: Xóa dữ liệu phiên đăng nhập được lưu cục bộ
    console.log('Clearing local session data...');
    
    // Xóa OIDC user data từ localStorage
    const oidcUserKey = 'oidc.user:https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_9RLjNQhOk:6rer5strq9ga876qntv37ngv6d';
    localStorage.removeItem(oidcUserKey);
    
    // Xóa sessionStorage nếu có
    sessionStorage.clear();
    
    // Xóa các token khác nếu có
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    
    console.log('Local session data cleared!');
    
    // BƯỚC 2: Chuyển hướng đến trang đăng xuất của Cognito
    console.log('Redirecting to Cognito logout...');
    signOutRedirect();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="space-y-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {auth.user.profile?.name?.[0] || auth.user.profile?.email?.[0] || "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {auth.user.profile?.name || auth.user.profile?.email || "User"}
            </p>
            <p className="text-sm text-gray-500">
              {auth.user.profile?.email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}
