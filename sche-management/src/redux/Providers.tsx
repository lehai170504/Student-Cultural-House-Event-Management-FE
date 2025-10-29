"use client";

import { Provider } from "react-redux";
import { AuthProvider } from "react-oidc-context";
import { store } from "../lib/store";
import { oidcConfig } from "@/config/oidc-config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider {...oidcConfig}>
      <Provider store={store}>{children}</Provider>
    </AuthProvider>
  );
}
