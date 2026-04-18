import { createContext, useContext } from "react";

import type {
  AdminActivity,
  AdminApplication,
  AdminCountry,
  AdminUser,
} from "@admin/lib/admin-api";

type AdminContextValue = {
  applications: AdminApplication[];
  activities: AdminActivity[];
  users: AdminUser[];
  countries: AdminCountry[];
  loading: boolean;
  error: string | null;
  emailSending: boolean;
  savingCountry: boolean;
  fetchAllApplications: () => Promise<void>;
  updateStatus: (
    id: string,
    status: AdminApplication["status"],
  ) => Promise<AdminApplication>;
  deleteApplication: (id: string) => Promise<void>;
  createCountry: (payload: {
    code: string;
    name: string;
    visaType: string[];
    image: string;
    flag: string;
    popular?: boolean;
    selected?: boolean;
  }) => Promise<AdminCountry>;
  deleteCountry: (id: string) => Promise<void>;
  updateUserRole: (id: string, role: AdminUser["role"]) => Promise<AdminUser>;
  deleteUser: (id: string) => Promise<void>;
  sendEmail: (payload: {
    applicationId: string;
    subject: string;
    message: string;
  }) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
};

export const AdminContext = createContext<AdminContextValue | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }

  return context;
};
