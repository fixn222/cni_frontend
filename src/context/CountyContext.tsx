import { createContext, useContext } from "react";

export interface Country {
  code: string;
  name: string;
  visaType: string[];
  image: string;
  flag: string;
  popular?: boolean;
  selected?: boolean;
}

export interface CountryContextValue {
  countries: Country[];
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
  selectedCountryCode: string | null;
  setSelectedCountryCode: (code: string | null) => void;
}

export const CountryContext = createContext<CountryContextValue | null>(null);

export const useCountries = () => {
  const context = useContext(CountryContext);

  if (!context) {
    throw new Error("useCountries must be used inside CountryProvider");
  }

  return context;
};
