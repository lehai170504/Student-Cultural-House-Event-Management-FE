"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { signOutRedirect } from "@/config/oidc-config";

export function UserProfile() {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  const handleLocalLogout = () => {
    // Local logout (remove user from storage)
    auth.removeUser();
  };

  const handleCognitoLogout = () => {
    // Cognito logout (redirect to Cognito logout page)
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

        {/* Logout Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={handleLocalLogout}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-700"
          >
            Đăng xuất (Local)
          </Button>
          <Button
            onClick={handleCognitoLogout}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Đăng xuất (Cognito)
          </Button>
        </div>
      </div>
    </div>
  );
}
