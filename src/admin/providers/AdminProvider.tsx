import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  createAdminCountry as apiCreateAdminCountry,
  deleteAdminActivity as apiDeleteAdminActivity,
  deleteAdminApplication as apiDeleteAdminApplication,
  deleteAdminCountry as apiDeleteAdminCountry,
  deleteAdminUser as apiDeleteAdminUser,
  fetchAllApplications as apiFetchAllApplications,
  sendApplicationEmail,
  updateAdminUserRole as apiUpdateAdminUserRole,
  updateApplicationStatus,
  type AdminActivity,
  type AdminApplication,
  type AdminCountry,
  type AdminUser,
} from "@admin/lib/admin-api";
import { AdminContext } from "@admin/context/AdminContext";
import { useSession } from "@/hooks/useSession";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: isSessionLoading, user } = useSession();
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [countries, setCountries] = useState<AdminCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [savingCountry, setSavingCountry] = useState(false);

  const fetchAllApplications = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "admin") {
      setApplications([]);
      setActivities([]);
      setUsers([]);
      setCountries([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiFetchAllApplications();
      setApplications(response.applications ?? []);
      setActivities(response.activities ?? []);
      setUsers(response.users ?? []);
      setCountries(response.countries ?? []);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load admin dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (isSessionLoading) {
      setLoading(true);
      return;
    }

    void fetchAllApplications();
  }, [fetchAllApplications, isSessionLoading]);

  const updateStatus = useCallback(
    async (id: string, status: AdminApplication["status"]) => {
      const previousApplications = [...applications];

      setApplications((current: AdminApplication[]) =>
        current.map((application: AdminApplication) =>
          application._id === id ? { ...application, status } : application,
        ),
      );

      try {
        const response = await updateApplicationStatus(id, status);
        const updatedApplication = response.application;

        setApplications((current: AdminApplication[]) =>
          current.map((application: AdminApplication) =>
            application._id === id ? updatedApplication : application,
          ),
        );

        setActivities((current: AdminActivity[]) => [
          {
            _id: `status-${updatedApplication._id}-${Date.now()}`,
            type: "status_updated",
            title: "Application status updated",
            description: `${updatedApplication.clientDetails.fullName} was marked as ${status}.`,
            actorName: user?.name ?? "Admin",
            actorEmail: user?.email ?? null,
            applicationId: updatedApplication._id,
            createdAt: new Date().toISOString(),
          },
          ...current,
        ]);

        return updatedApplication;
      } catch (requestError) {
        setApplications(previousApplications);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to update application status",
        );
        throw requestError;
      }
    },
    [applications, user?.email, user?.name],
  );

  const sendEmail = useCallback(
    async (payload: {
      applicationId: string;
      subject: string;
      message: string;
    }) => {
      try {
        setEmailSending(true);
        setError(null);
        await sendApplicationEmail(payload);

        const selectedApplication = applications.find(
          (application: AdminApplication) =>
            application._id === payload.applicationId,
        );

        setActivities((current: AdminActivity[]) => [
          {
            _id: `email-${payload.applicationId}-${Date.now()}`,
            type: "email_sent",
            title: "Email sent to client",
            description: `${user?.name ?? "Admin"} emailed ${selectedApplication?.clientDetails?.fullName ?? "the client"}.`,
            actorName: user?.name ?? "Admin",
            actorEmail: user?.email ?? null,
            applicationId: payload.applicationId,
            createdAt: new Date().toISOString(),
          },
          ...current,
        ]);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to send email",
        );
        throw requestError;
      } finally {
        setEmailSending(false);
      }
    },
    [applications, user?.email, user?.name],
  );

  const deleteApplication = useCallback(async (id: string) => {
    const previousApplications = [...applications];

    setApplications((current: AdminApplication[]) =>
      current.filter((application: AdminApplication) => application._id !== id),
    );

    try {
      await apiDeleteAdminApplication(id);
      setActivities((current: AdminActivity[]) =>
        current.filter((activity: AdminActivity) => activity.applicationId !== id),
      );
    } catch (requestError) {
      setApplications(previousApplications);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete application",
      );
      throw requestError;
    }
  }, [applications]);

  const createCountry = useCallback(async (payload: {
    code: string;
    name: string;
    visaType: string[];
    image: string;
    flag: string;
    popular?: boolean;
    selected?: boolean;
  }) => {
    try {
      setSavingCountry(true);
      setError(null);
      const response = await apiCreateAdminCountry(payload);
      const country = response.country;

      setCountries((current: AdminCountry[]) =>
        [...current, country].sort((left, right) => left.name.localeCompare(right.name)),
      );

      return country;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to create destination",
      );
      throw requestError;
    } finally {
      setSavingCountry(false);
    }
  }, []);

  const deleteCountry = useCallback(async (id: string) => {
    const previousCountries = [...countries];

    setCountries((current: AdminCountry[]) =>
      current.filter((country: AdminCountry) => country.id !== id),
    );

    try {
      await apiDeleteAdminCountry(id);
    } catch (requestError) {
      setCountries(previousCountries);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete destination",
      );
      throw requestError;
    }
  }, [countries]);

  const updateUserRole = useCallback(async (id: string, role: AdminUser["role"]) => {
    const previousUsers = [...users];

    setUsers((current: AdminUser[]) =>
      current.map((existingUser: AdminUser) =>
        existingUser.id === id ? { ...existingUser, role } : existingUser,
      ),
    );

    try {
      const response = await apiUpdateAdminUserRole(id, role);
      const updatedUser = response.user;

      setUsers((current: AdminUser[]) =>
        current.map((existingUser: AdminUser) =>
          existingUser.id === id ? updatedUser : existingUser,
        ),
      );

      return updatedUser;
    } catch (requestError) {
      setUsers(previousUsers);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update user role",
      );
      throw requestError;
    }
  }, [users]);

  const deleteUser = useCallback(async (id: string) => {
    const previousUsers = [...users];
    const previousApplications = [...applications];
    const previousActivities = [...activities];

    setUsers((current: AdminUser[]) =>
      current.filter((existingUser: AdminUser) => existingUser.id !== id),
    );
    setApplications((current: AdminApplication[]) =>
      current.filter((application: AdminApplication) => application.user.id !== id),
    );
    setActivities((current: AdminActivity[]) =>
      current.filter((activity: AdminActivity) => activity.userId !== id),
    );

    try {
      await apiDeleteAdminUser(id);
    } catch (requestError) {
      setUsers(previousUsers);
      setApplications(previousApplications);
      setActivities(previousActivities);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete user",
      );
      throw requestError;
    }
  }, [activities, applications, users]);

  const deleteActivity = useCallback(async (id: string) => {
    const previousActivities = [...activities];

    setActivities((current: AdminActivity[]) =>
      current.filter((activity: AdminActivity) => activity._id !== id),
    );

    try {
      await apiDeleteAdminActivity(id);
    } catch (requestError) {
      setActivities(previousActivities);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to delete activity",
      );
      throw requestError;
    }
  }, [activities]);

  const value = useMemo(
    () => ({
      applications,
      activities,
      users,
      countries,
      loading,
      error,
      emailSending,
      savingCountry,
      fetchAllApplications,
      updateStatus,
      deleteApplication,
      createCountry,
      deleteCountry,
      updateUserRole,
      deleteUser,
      sendEmail,
      deleteActivity,
    }),
    [
      applications,
      activities,
      users,
      countries,
      loading,
      error,
      emailSending,
      savingCountry,
      fetchAllApplications,
      updateStatus,
      deleteApplication,
      createCountry,
      deleteCountry,
      updateUserRole,
      deleteUser,
      sendEmail,
      deleteActivity,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
