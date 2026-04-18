import { API_URL } from "@/lib/constants";

export type AdminApplication = {
  _id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  country: {
    name: string;
    code: string;
    flag: string;
  };
  clientDetails: {
    fullName: string;
    passportNumber: string;
    nationality: string;
  };
  visaDetails: {
    visaType: string;
    purpose: string;
    travelDate?: string | null;
    duration?: string;
    notes?: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  emailVerified: boolean;
  createdAt?: string | null;
};

export type AdminCountry = {
  id: string;
  code: string;
  name: string;
  visaType: string[];
  image: string;
  flag: string;
  popular?: boolean;
  selected?: boolean;
  createdAt?: string | null;
};

export type AdminActivity = {
  _id: string;
  type:
    | "application_created"
    | "status_updated"
    | "email_sent"
    | "support_message";
  title: string;
  description: string;
  actorName?: string | null;
  actorEmail?: string | null;
  subject?: string;
  visibility?: "admin" | "shared";
  applicationId?: string;
  userId?: string;
  createdAt: string;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const parsed = await response.json().catch(() => null);
    throw new Error(parsed?.message || "Request failed");
  }

  return response.json();
};

export const fetchAllApplications = async (): Promise<{
  applications: AdminApplication[];
  activities: AdminActivity[];
  users: AdminUser[];
  countries: AdminCountry[];
}> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/applications`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );
};

export const deleteAdminApplication = async (
  id: string,
): Promise<{ message: string }> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/applications/${id}`, {
      method: "DELETE",
      credentials: "include",
    }),
  );
};

export const createAdminCountry = async (payload: {
  code: string;
  name: string;
  visaType: string[];
  image: string;
  flag: string;
  popular?: boolean;
  selected?: boolean;
}): Promise<{ country: AdminCountry }> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/countries`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
};

export const deleteAdminCountry = async (
  id: string,
): Promise<{ message: string }> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/countries/${id}`, {
      method: "DELETE",
      credentials: "include",
    }),
  );
};

export const updateAdminUserRole = async (
  id: string,
  role: AdminUser["role"],
): Promise<{ user: AdminUser }> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/users/${id}/role`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }),
  );
};

export const deleteAdminUser = async (
  id: string,
): Promise<{ message: string }> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    }),
  );
};

export const updateApplicationStatus = async (
  id: string,
  status: AdminApplication["status"],
): Promise<{ application: AdminApplication }> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/applications/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }),
  );
};

export const sendApplicationEmail = async (payload: {
  applicationId: string;
  subject: string;
  message: string;
}): Promise<{ message: string }> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/send-email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
};

export const deleteAdminActivity = async (
  id: string,
): Promise<{ message: string }> => {
  return handleResponse(
    await fetch(`${API_URL}/api/admin/activities/${id}`, {
      method: "DELETE",
      credentials: "include",
    }),
  );
};
