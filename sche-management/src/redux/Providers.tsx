"use client";

import { Provider } from "react-redux";
import { AuthProvider } from "react-oidc-context";
import { makeStore } from "./store";
import { oidcConfig } from "@/config/oidc-config";

const store = makeStore();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider {...oidcConfig}>
      <Provider store={store}>{children}</Provider>
    </AuthProvider>
  );
}
