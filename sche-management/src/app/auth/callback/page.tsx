"use client";

import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cognitoUserAttributesService from "@/features/auth/services/cognitoUserAttributesService";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const auth = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!auth.isLoading) {
        if (auth.isAuthenticated && auth.user?.id_token) {
          try {
            setStatus("fetching-attributes");

            // Fetch user attributes from ID token
            const attributes =
              await cognitoUserAttributesService.fetchUserAttributes(
                auth.user.id_token
              );

            setStatus("checking-onboarding");

            // Check if user needs onboarding
            if (cognitoUserAttributesService.needsOnboarding(attributes)) {
              setStatus("redirecting-onboarding");
              // Redirect to onboarding page
              router.push("/onboarding/profile-completion");
            } else {
              setStatus("redirecting-home");
              // Redirect to home page
              router.push("/");
            }
          } catch (error) {
            console.error("Error checking user attributes:", error);
            // On error, redirect to home anyway (graceful degradation)
            setStatus("redirecting-home");
            router.push("/");
          }
        } else {
          // Not authenticated, redirect to login
          setStatus("redirecting-login");
          router.push("/login");
        }
      }
    };

    handleAuthCallback();
  }, [auth.isLoading, auth.isAuthenticated, auth.user, router]);

  const statusMessages: Record<string, string> = {
    checking: "Đang kiểm tra...",
    "fetching-attributes": "Đang tải thông tin tài khoản...",
    "checking-onboarding": "Đang kiểm tra thông tin hồ sơ...",
    "redirecting-onboarding": "Đang chuyển hướng...",
    "redirecting-home": "Đang chuyển hướng...",
    "redirecting-login": "Đang chuyển hướng...",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">{statusMessages[status]}</p>
      </div>
    </div>
  );
}
