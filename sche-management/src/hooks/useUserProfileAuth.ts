import { useState, useEffect, useMemo } from "react";

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  groups: string[];
}

export function useUserProfileAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!;
      const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
      const key = `oidc.user:${authority}:${clientId}`;

      const storedProfile =
        (typeof window !== "undefined" && localStorage.getItem(key)) ||
        (typeof window !== "undefined" && sessionStorage.getItem(key));

      if (!storedProfile) {
        console.warn("⚠️ Không tìm thấy key profile trong storage");
        return;
      }

      const profile = JSON.parse(storedProfile)?.profile;
      if (!profile) return;

      const userData: UserProfile = {
        username: profile.username || profile["cognito:username"],
        name: profile.name || profile["name"] || "",
        email: profile.email || "",
        groups: Array.isArray(profile["cognito:groups"])
          ? profile["cognito:groups"]
          : [],
      };

      setUser(userData);
      console.log("✅ Loaded user profile:", userData);
    } catch (error) {
      console.error("❌ Failed to parse user profile:", error);
    }
  }, []);

  // helper: kiểm tra quyền
  const isAdmin = useMemo(
    () => user?.groups.includes("Admin") ?? false,
    [user]
  );
  const isManager = useMemo(
    () => user?.groups.includes("Manager") ?? false,
    [user]
  );

  return { user, isAdmin, isManager };
}
