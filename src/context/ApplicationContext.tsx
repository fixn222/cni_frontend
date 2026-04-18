import { createContext, useContext } from "react";
import type {
  Application,
  ApplicationPayload,
  UserActivity,
} from "../lib/applications-api.ts";

interface ApplicationContextValue {
  applications: Application[];
  activities: UserActivity[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitError: string | null;
  submitSuccess: string | null;
  messaging: boolean;
  createApplication: (data: ApplicationPayload) => Promise<Application>;
  deleteApplication: (id: string) => Promise<void>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<Application>;
  deleteActivity: (id: string) => Promise<void>;
  contactAdmin: (payload: {
    applicationId?: string;
    subject: string;
    message: string;
  }) => Promise<UserActivity>;
  refreshApplications: () => Promise<void>;
  clearSubmitStatus: () => void;
}

export const ApplicationContext = createContext<ApplicationContextValue | null>(null);

export const useApplications = () => {
  const ctx = useContext(ApplicationContext);

  if (!ctx) {
    throw new Error("useApplications must be used inside ApplicationProvider");
  }

  return ctx;
};
