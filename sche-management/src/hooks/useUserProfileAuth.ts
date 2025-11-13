import { useState, useEffect } from "react";

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  role: string;
}

export function useUserProfileAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("profile");
      if (!storedProfile) {
        console.warn("⚠️ Không tìm thấy key 'profile' trong localStorage");
        return;
      }

      const profile = JSON.parse(storedProfile);

      const userData: UserProfile = {
        username: profile.username,
        name: profile.name,
        email: profile.email,
        role: profile["cognito:groups"]?.[0] || "USER", // lấy trực tiếp từ cognito:groups
      };

      console.log("✅ Loaded user profile from localStorage:", userData);

      setUser(userData);
    } catch (error) {
      console.error("❌ Failed to parse user profile:", error);
    }
  }, []);

  return { user };
}
