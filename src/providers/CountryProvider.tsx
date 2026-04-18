import { fetchCountries } from "../lib/api.ts";
import { useEffect, useState } from "react";
import {
  CountryContext,
  type Country,
} from "../context/CountyContext.tsx";

export const CountryProvider = ({ children }: any) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

    const loadCountries = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await fetchCountries();
            setCountries(data);
        } catch (error : any) {
            setError(error.message);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=> {
        loadCountries();
    } , []);

    return (
        <CountryContext.Provider
        value={{
            countries,
            loading,
            error,
            refetch: loadCountries,
            selectedCountryCode,
            setSelectedCountryCode,
        }}
        >
            {children}
        </CountryContext.Provider>
    );
};
