import { API_URL } from "./constants";

const API_BASE_URL = API_URL;

export interface ClientDetails {
  fullName: string;
  nationality: string;
  passportNumber: string;
}

export interface VisaDetails {
  visaType: string;
  travelDate?: string;
  duration?: string;
  purpose?: string;
  notes?: string;
}

export interface CountryInfo {
  _id: string;
  name: string;
  code: string;
}

export interface Application {
  _id: string;
  country: CountryInfo;
  clientDetails: ClientDetails;
  visaDetails: VisaDetails;
  status?: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

export interface UserActivity {
  _id: string;
  type:
    | "application_created"
    | "status_updated"
    | "email_sent"
    | "support_message";
  title: string;
  description: string;
  subject?: string;
  actorName?: string | null;
  actorEmail?: string | null;
  visibility?: "user" | "shared";
  applicationId?: string;
  createdAt: string;
}

export interface ApplicationPayload {
  countryCode: string;
  clientDetails: ClientDetails;
  visaDetails: VisaDetails;
}

type RawApplication = {
  _id?: string;
  country?: Partial<CountryInfo> | null;
  clientDetails?: Partial<ClientDetails> | null;
  visaDetails?: {
    visaType?: string;
    viaType?: string;
    travelDate?: string;
    duration?: string;
    travelPurpose?: string;
    purpose?: string;
    notes?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  status?: "pending" | "approved" | "rejected";
};

const normalizeApplication = (application: RawApplication): Application => ({
  _id: application?._id ?? "",
  country: {
    _id: application?.country?._id ?? "",
    name: application?.country?.name ?? "Unknown Country",
    code: application?.country?.code ?? "",
  },
  clientDetails: {
    fullName: application?.clientDetails?.fullName ?? "",
    nationality: application?.clientDetails?.nationality ?? "",
    passportNumber: application?.clientDetails?.passportNumber ?? "",
  },
  visaDetails: {
    visaType:
      application?.visaDetails?.visaType ??
      application?.visaDetails?.viaType ??
      "",
    travelDate: application?.visaDetails?.travelDate ?? "",
    duration: application?.visaDetails?.duration ?? "",
    purpose:
      application?.visaDetails?.purpose ??
      application?.visaDetails?.travelPurpose ??
      "",
    notes: application?.visaDetails?.notes ?? "",
  },
  createdAt: application?.createdAt ?? "",
  updatedAt: application?.updatedAt,
  status: application?.status ?? "pending",
});

const normalizeUserActivity = (
  activity: Partial<UserActivity>,
): UserActivity => ({
  _id: activity?._id ?? "",
  type: activity?.type ?? "application_created",
  title: activity?.title ?? "",
  description: activity?.description ?? "",
  subject: activity?.subject ?? "",
  actorName: activity?.actorName ?? null,
  actorEmail: activity?.actorEmail ?? null,
  visibility: activity?.visibility ?? "shared",
  applicationId: activity?.applicationId ?? "",
  createdAt: activity?.createdAt ?? "",
});

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const parsed = await res.json().catch(() => null);
    throw new Error(parsed?.message || "Request failed");
  }
  return res.json();
};

export const getApplications = async (): Promise<{ applications: Application[] }> => {
  const response = await handleResponse<{ applications?: RawApplication[] }>(
    await fetch(`${API_BASE_URL}/api/applications`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
  );

  return {
    applications: (response.applications ?? []).map(normalizeApplication),
  };
};

export const createApplication = async (data: ApplicationPayload): Promise<{ application: Application }> => {
  const response = await handleResponse<{ application?: RawApplication }>(
    await fetch(`${API_BASE_URL}/api/applications`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );

  return {
    application: normalizeApplication(response.application ?? {}),
  };
};

export const deleteApplication = async (id: string): Promise<{ message: string }> => {
  return handleResponse<{ message: string }>(
    await fetch(`${API_BASE_URL}/api/applications/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
  );
};

export const updateApplication = async (id: string, data: Partial<{ clientDetails: ClientDetails; visaDetails: VisaDetails }>): Promise<{ application: Application }> => {
  const response = await handleResponse<{ application?: RawApplication }>(
    await fetch(`${API_BASE_URL}/api/applications/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );

  return {
    application: normalizeApplication(response.application ?? {}),
  };
};

export const getUserActivities = async (): Promise<{ activities: UserActivity[] }> => {
  const response = await handleResponse<{ activities?: Partial<UserActivity>[] }>(
    await fetch(`${API_BASE_URL}/api/applications/activities`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }),
  );

  return {
    activities: (response.activities ?? []).map(normalizeUserActivity),
  };
};

export const deleteUserActivity = async (
  id: string,
): Promise<{ message: string }> => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/api/applications/activities/${id}`, {
      method: "DELETE",
      credentials: "include",
    }),
  );
};

export const contactAdmin = async (payload: {
  applicationId?: string;
  subject: string;
  message: string;
}): Promise<{ activity: UserActivity }> => {
  const response = await handleResponse<{ activity?: Partial<UserActivity> }>(
    await fetch(`${API_BASE_URL}/api/applications/contact-admin`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );

  return {
    activity: normalizeUserActivity(response.activity ?? {}),
  };
};
