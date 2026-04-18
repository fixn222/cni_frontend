import { API_URL } from "./constants";

export const fetchCountries = async () => {
  const res = await fetch(`${API_URL}/api/countries`, {
    credentials: "include",
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch countries");
  }

  return data;
};
