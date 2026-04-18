import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSession } from "../hooks/useSession";
import { ROUTES } from "../lib/routes";

const SessionFallback = () => (
  <div className="flex min-h-screen items-center justify-center px-4 pt-24">
    <div className="rounded-2xl border border-border/70 bg-background/80 px-6 py-4 text-sm text-muted-foreground shadow-sm backdrop-blur">
      Checking your session...
    </div>
  </div>
);

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isEmailVerified, user } = useSession();

  if (isLoading) {
    return <SessionFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (!isEmailVerified) {
    return (
      <Navigate
        to={ROUTES.VERIFY_EMAIL}
        replace
        state={{ email: user?.email }}
      />
    );
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isEmailVerified, user } = useSession();

  if (isLoading) {
    return <SessionFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (!isEmailVerified) {
    return (
      <Navigate
        to={ROUTES.VERIFY_EMAIL}
        replace
        state={{ email: user?.email }}
      />
    );
  }

  if (user?.role !== "admin") {
    return <Navigate to={ROUTES.CLIENT.ROOT} replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { isAuthenticated, isLoading, isEmailVerified, user } = useSession();

  if (isLoading) {
    return <SessionFallback />;
  }

  if (isAuthenticated) {
    if (!isEmailVerified) {
      return (
        <Navigate
          to={ROUTES.VERIFY_EMAIL}
          replace
          state={{ email: user?.email }}
        />
      );
    }

    return <Navigate to={ROUTES.CLIENT.ROOT} replace />;
  }

  return <Outlet />;
};
