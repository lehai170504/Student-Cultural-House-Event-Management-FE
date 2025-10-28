"use client";

import { useEffect, useState } from "react";

export function AuthStatus() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if environment variables are configured
    const hasConfig = !!(
      process.env.NEXT_PUBLIC_COGNITO_AUTHORITY &&
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
    );

    setShowWarning(!hasConfig);
  }, []);

  if (!showWarning) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Cần cấu hình AWS Cognito OIDC:</strong> Để sử dụng tính năng đăng nhập, 
            vui lòng tạo file <code className="bg-yellow-100 px-1 rounded">.env.local</code> 
            với các thông tin OIDC từ AWS Cognito Console.
          </p>
          <div className="mt-2 text-xs text-yellow-600">
            <p>Bạn cần các biến sau:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><code>NEXT_PUBLIC_COGNITO_AUTHORITY</code> (Authority URL)</li>
              <li><code>NEXT_PUBLIC_COGNITO_CLIENT_ID</code> (Client ID)</li>
              <li><code>NEXT_PUBLIC_APP_URL</code> (Redirect URI)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
