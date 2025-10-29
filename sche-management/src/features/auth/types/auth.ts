export interface SignUpParams {
  username: string;
  password: string;
  attributes?: {
    name?: string;
    email?: string;
    phone_number?: string;
  };
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface ConfirmSignUpParams {
  username: string;
  confirmationCode: string;
}

export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}


export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface User {
  id?: number;
  username: string;
  name?: string;
  email?: string;
  phone_number?: string;
  role?: "student" | "org" | "booth";
  status?: "active" | "inactive";
}
