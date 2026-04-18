import { createApplication as apiCreateApplication, deleteApplication as apiDeleteApplication, updateApplication as apiUpdateApplication, getApplications, type Application, type ApplicationPayload } from "../lib/applications-api.ts";
import {
  contactAdmin as apiContactAdmin,
  deleteUserActivity as apiDeleteUserActivity,
  getUserActivities,
  type UserActivity,
} from "../lib/applications-api.ts";
import { ApplicationContext } from "../context/ApplicationContext.tsx";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "../hooks/useSession.ts";

interface ApplicationProviderProps {
  children: React.ReactNode;
}

export const ApplicationProvider = ({ children }: ApplicationProviderProps) => {
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messaging, setMessaging] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!isAuthenticated) {
      setApplications([]);
      setActivities([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [applicationsResponse, activitiesResponse] = await Promise.all([
        getApplications(),
        getUserActivities(),
      ]);
      setApplications(applicationsResponse.applications || []);
      setActivities(activitiesResponse.activities || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load applications";
      console.error("Failed to fetch applications:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isSessionLoading) {
      setLoading(true);
      return;
    }

    void fetchApplications();
  }, [fetchApplications, isSessionLoading]);

  const createApplication = useCallback(async (data: ApplicationPayload): Promise<Application> => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const response = await apiCreateApplication(data);
      const newApp = response.application;

      setApplications((prev) => [newApp, ...prev]);
      setSubmitSuccess("Application submitted successfully!");

      return newApp;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create application";
      console.error("Failed to create application:", message);
      setSubmitError(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const deleteApplication = useCallback(async (id: string): Promise<void> => {
    const previousApps = [...applications];

    setApplications((prev) => prev.filter((app) => app._id !== id));

    try {
      await apiDeleteApplication(id);
    } catch (err) {
      setApplications(previousApps);
      const message = err instanceof Error ? err.message : "Failed to delete application";
      console.error("Failed to delete application:", message);
      setError(message);
      throw err;
    }
  }, [applications]);

  const updateApplication = useCallback(async (id: string, data: Partial<Application>): Promise<Application> => {
    const previousApps = [...applications];

    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, ...data } : app))
    );

    try {
      const response = await apiUpdateApplication(id, data as any);
      const updatedApp = response.application;

      setApplications((prev) =>
        prev.map((app) => (app._id === id ? updatedApp : app))
      );

      return updatedApp;
    } catch (err) {
      setApplications(previousApps);
      const message = err instanceof Error ? err.message : "Failed to update application";
      console.error("Failed to update application:", message);
      setError(message);
      throw err;
    }
  }, [applications]);

  const clearSubmitStatus = useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(null);
  }, []);

  const deleteActivity = useCallback(async (id: string): Promise<void> => {
    const previousActivities = [...activities];

    setActivities((current: UserActivity[]) =>
      current.filter((activity: UserActivity) => activity._id !== id),
    );

    try {
      await apiDeleteUserActivity(id);
    } catch (requestError) {
      setActivities(previousActivities);
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete activity";
      setError(message);
      throw requestError;
    }
  }, [activities]);

  const contactAdmin = useCallback(async (payload: {
    applicationId?: string;
    subject: string;
    message: string;
  }): Promise<UserActivity> => {
    try {
      setMessaging(true);
      setError(null);
      const response = await apiContactAdmin(payload);
      const activity = response.activity;

      setActivities((current: UserActivity[]) => [activity, ...current]);

      return activity;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to contact admin";
      setError(message);
      throw requestError;
    } finally {
      setMessaging(false);
    }
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        activities,
        loading,
        error,
        submitting,
        submitError,
        submitSuccess,
        messaging,
        createApplication,
        deleteApplication,
        updateApplication,
        deleteActivity,
        contactAdmin,
        refreshApplications: async () => {
          await fetchApplications();
        },
        clearSubmitStatus,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
