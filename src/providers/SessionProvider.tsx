import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchSession,
  signInRequest,
  signOutRequest,
  signUpRequest,
  type AuthPayload,
  type SessionData,
  type SessionUser,
  type SignUpPayload,
} from "../lib/auth-client";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionContextValue = {
  user: SessionUser | null;
  session: Record<string, unknown> | null;
  status: SessionStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  error: string | null;
  refreshSession: () => Promise<SessionData | null>;
  signIn: (payload: AuthPayload) => Promise<{ error?: string; code?: string; data?: unknown }>;
  signUp: (payload: SignUpPayload) => Promise<{ error?: string; code?: string; data?: unknown }>;
  signOut: () => Promise<{ error?: string; code?: string; data?: unknown }>;
  clearError: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const unauthenticatedSession: SessionData = {
  authenticated: false,
  user: null,
  session: null,
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionData>(unauthenticatedSession);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const applySession = useCallback((data: SessionData) => {
    setSessionData(data);
    setStatus(data.authenticated ? "authenticated" : "unauthenticated");
  }, []);

  const refreshSession = useCallback(async () => {
    setError(null);

    try {
      const data = await fetchSession();
      applySession(data);
      return data;
    } catch (sessionError) {
      applySession(unauthenticatedSession);
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "Failed to fetch session",
      );
      return null;
    }
  }, [applySession]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const signIn = useCallback(
    async (payload: AuthPayload) => {
      setError(null);
      const result = await signInRequest(payload);

      if (result.error) {
        setError(result.error);
        return { error: result.error, code: result.code };
      }

      const data = await refreshSession();
      if (!data?.authenticated) {
        const message = "Sign-in completed but no active session was found";
        setError(message);
        return { error: message };
      }

      return { data: result.data };
    },
    [refreshSession],
  );

  const signUp = useCallback(
    async (payload: SignUpPayload) => {
      setError(null);
      const result = await signUpRequest(payload);

      if (result.error) {
        setError(result.error);
        return { error: result.error, code: result.code };
      }

      const data = await refreshSession();
      if (!data?.authenticated) {
        const message = "Account created but no active session was found";
        setError(message);
        return { error: message };
      }

      return { data: result.data };
    },
    [refreshSession],
  );

  const signOut = useCallback(async () => {
    setError(null);
    const result = await signOutRequest();

    if (result.error) {
      setError(result.error);
      return { error: result.error, code: result.code };
    }

    applySession(unauthenticatedSession);
    return { data: result.data };
  }, [applySession]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user: sessionData.user,
      session: sessionData.session,
      status,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      isEmailVerified: Boolean(sessionData.user?.emailVerified),
      error,
      refreshSession,
      signIn,
      signUp,
      signOut,
      clearError,
    }),
    [clearError, error, refreshSession, sessionData.session, sessionData.user, signIn, signOut, signUp, status],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
