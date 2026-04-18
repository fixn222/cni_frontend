export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  APPLICATION: "/application",

  ADMIN: {
    ROOT: "/admin",
    APPLICATIONS: "/admin/applications",
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
  },

  CLIENT: {
    ROOT: "/dashboard",
    APPLICATIONS: "/dashboard/applications",
    NEW_APPLICATION: "/dashboard/new",
    MESSAGES: "/dashboard/messages",
  },
};

export const getApplicationRoute = (destination?: string) =>
  destination
    ? `${ROUTES.APPLICATION}?destination=${encodeURIComponent(destination)}`
    : ROUTES.APPLICATION;
