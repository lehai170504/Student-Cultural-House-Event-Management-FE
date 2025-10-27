"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";

export function UserProfile() {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  const handleLogout = () => {
    console.log('Logout button clicked!');
    // Redirect to Cognito logout
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'https://ap-southeast-29rljnqhok.auth.ap-southeast-2.amazoncognito.com';
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '6rer5strq9ga876qntv37ngv6d';
    const baseUri = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    const logoutUri = baseUri + '/';
    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    console.log('Logout URL:', logoutUrl);
    // Clear local auth state first
    auth.removeUser();
    // Redirect
    window.location.href = logoutUrl;
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