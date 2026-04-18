import { API_URL } from "./constants";
const AUTH_BASE_URL = API_URL;

export type SessionUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  role?: "user" | "admin";
};

export type SessionData = {
  authenticated: boolean;
  user: SessionUser | null;
  session: Record<string, unknown> | null;
};

export type AuthPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = AuthPayload & {
  name: string;
};

export type RequestPasswordResetPayload = {
  email: string;
};

export type VerifyEmailCodePayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
};

export type AuthResult = {
  data?: unknown;
  error?: string;
  code?: string;
};

const parseErrorResponse = async (response: Response) => {
  try {
    const payload = await response.json();
    return {
      message:
        (typeof payload?.message === "string" && payload.message) ||
        (typeof payload?.error === "string" && payload.error) ||
        "Request failed",
      code: typeof payload?.code === "string" ? payload.code : undefined,
      payload,
    };
  } catch {
    return {
      message: "Request failed",
      code: undefined,
      payload: null,
    };
  }
};

export const fetchSession = async (): Promise<SessionData> => {
  const response = await fetch(`${AUTH_BASE_URL}/api/auth/session`, {
    credentials: "include",
  });

  if (!response.ok) {
    const parsed = await parseErrorResponse(response);
    throw new Error(parsed.message);
  }

  return response.json();
};

export const signInRequest = async (
  payload: AuthPayload,
): Promise<AuthResult> => {
  const response = await fetch(`${AUTH_BASE_URL}/api/auth/sign-in/email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const parsed = await parseErrorResponse(response);
  if (!response.ok) {
    return {
      error: parsed.message || "Unable to sign in",
      code: parsed.code,
    };
  }

  return { data: parsed.payload };
};

export const signUpRequest = async (
  payload: SignUpPayload,
): Promise<AuthResult> => {
  const response = await fetch(`${AUTH_BASE_URL}/api/auth/sign-up/email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const parsed = await parseErrorResponse(response);
  if (!response.ok) {
    return {
      error: parsed.message || "Unable to create account",
      code: parsed.code,
    };
  }

  return { data: parsed.payload };
};

export const signOutRequest = async (): Promise<AuthResult> => {
  const response = await fetch(`${AUTH_BASE_URL}/api/auth/sign-out`, {
    method: "POST",
    credentials: "include",
  });

  const parsed = await parseErrorResponse(response);
  if (!response.ok) {
    return {
      error: parsed.message || "Unable to sign out",
      code: parsed.code,
    };
  }

  return { data: parsed.payload };
};

export const sendVerificationEmailRequest = async (
  email: string,
): Promise<AuthResult> => {
  const response = await fetch(`${AUTH_BASE_URL}/api/auth/email-otp/send-verification-otp`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      type: "email-verification",
    }),
  });

  const parsed = await parseErrorResponse(response);
  if (!response.ok) {
    return {
      error: parsed.message || "Unable to send verification email",
      code: parsed.code,
    };
  }

  return { data: parsed.payload };
};

export const requestPasswordResetRequest = async (
  payload: RequestPasswordResetPayload,
): Promise<AuthResult> => {
  const response = await fetch(`${AUTH_BASE_URL}/api/auth/email-otp/request-password-reset`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const parsed = await parseErrorResponse(response);
  if (!response.ok) {
    return {
      error: parsed.message || "Unable to request password reset",
      code: parsed.code,
    };
  }

  return { data: parsed.payload };
};

export const verifyEmailCodeRequest = async (
  payload: VerifyEmailCodePayload,
): Promise<AuthResult> => {
  const response = await fetch(`${AUTH_BASE_URL}/api/auth/email-otp/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const parsed = await parseErrorResponse(response);
  if (!response.ok) {
    return {
      error: parsed.message || "Unable to verify email",
      code: parsed.code,
    };
  }

  return { data: parsed.payload };
};

export const resetPasswordRequest = async (
  payload: ResetPasswordPayload,
): Promise<AuthResult> => {
  const response = await fetch(`${AUTH_BASE_URL}/api/auth/email-otp/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const parsed = await parseErrorResponse(response);
  if (!response.ok) {
    return {
      error: parsed.message || "Unable to reset password",
      code: parsed.code,
    };
  }

  return { data: parsed.payload };
};
