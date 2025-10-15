"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { signOutRedirect } from "@/config/oidc-config";

export function AuthDemo() {
  const auth = useAuth();

  const handleSignIn = () => {
    auth.signinRedirect();
  };

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

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold mb-2">Authentication Error</h3>
        <p className="text-red-700">{auth.error.message}</p>
      </div>
    );
  }

  if (auth.isAuthenticated && auth.user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">User Information</h2>
        
        {/* User Profile */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Profile</h3>
          <div className="bg-gray-50 rounded p-3 text-sm">
            <pre className="whitespace-pre-wrap">
              Email: {auth.user.profile?.email || "N/A"}
              {"\n"}Name: {auth.user.profile?.name || "N/A"}
              {"\n"}Phone: {auth.user.profile?.phone_number || "N/A"}
            </pre>
          </div>
        </div>

        {/* Tokens */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Tokens</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID Token</label>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono break-all">
                {auth.user.id_token ? `${auth.user.id_token.substring(0, 50)}...` : "N/A"}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Access Token</label>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono break-all">
                {auth.user.access_token ? `${auth.user.access_token.substring(0, 50)}...` : "N/A"}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Refresh Token</label>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono break-all">
                {auth.user.refresh_token ? `${auth.user.refresh_token.substring(0, 50)}...` : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Authentication Demo</h2>
      <p className="text-gray-600 mb-4">
        Click the button below to sign in with AWS Cognito
      </p>
      
      <div className="flex justify-center">
        <Button
          onClick={handleSignIn}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
