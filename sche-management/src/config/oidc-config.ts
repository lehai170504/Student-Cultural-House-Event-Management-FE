// OIDC Configuration for AWS Cognito
import { WebStorageStateStore } from "oidc-client-ts";
export const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY || "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_9RLjNQhOk",
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "6rer5strq9ga876qntv37ngv6d",
  redirect_uri: (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "") + "/auth/callback",
  response_type: "code" as const,
  scope: "email openid phone profile aws.cognito.signin.user.admin",
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  // Additional OIDC options
  post_logout_redirect_uri: (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/",
  silent_redirect_uri: (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/",
  // Customize token storage: dùng localStorage để giữ đăng nhập giữa tabs
  userStore:
    typeof window !== "undefined"
      ? new WebStorageStateStore({ store: window.localStorage })
      : undefined,
  // Customize authentication flow
  extraQueryParams: {},
  // Handle authentication events
  onSigninCallback: () => {
    // Redirect to home page after successful login
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  onSignoutCallback: () => {
    // Redirect to login page after logout
    window.location.href = "/login";
  },
};

// Cognito Domain for logout (from your example)
export const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "https://ap-southeast-29rljnqhok.auth.ap-southeast-2.amazoncognito.com";

// Helper function for Cognito logout
export const signOutRedirect = (logoutUri?: string) => {
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "6rer5strq9ga876qntv37ngv6d";
  const defaultLogoutUri = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/";
  const finalLogoutUri = logoutUri || defaultLogoutUri;
  const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "https://ap-southeast-29rljnqhok.auth.ap-southeast-2.amazoncognito.com";
  
  // Get current user's ID token if available
  const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY || "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_9RLjNQhOk";
  const storageKey = `oidc.user:${authority}:${clientId}`;
  const user = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const idToken = user.id_token || '';
  
  let logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(finalLogoutUri)}`;
  
  // Add id_token_hint if available
  if (idToken) {
    logoutUrl += `&id_token_hint=${idToken}`;
  }
  
  console.log('Logout URL:', logoutUrl);
  console.log('ID Token available:', !!idToken);
  
  window.location.href = logoutUrl;
};

export default oidcConfig;
