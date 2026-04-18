import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

import ApplicationDetailsView from "../components/ApplicationDetailsView";
import { Button } from "../components/ui/button";
import { ROUTES } from "../lib/routes";
import { useLocation } from "react-router-dom";
import { useCountries } from "../context/CountyContext";

const ApplicationPage = () => {
  const { countries, selectedCountryCode, setSelectedCountryCode } = useCountries();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const destination = params.get("destination");
  const activeCode = destination ?? selectedCountryCode;
  const selectedCountry =
    countries.find((country) => country.code === activeCode) ?? null;

  useEffect(() => {
    if (destination && destination !== selectedCountryCode) {
      setSelectedCountryCode(destination);
    }
  }, [destination, selectedCountryCode, setSelectedCountryCode]);

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#29a89a22,transparent_35%),radial-gradient(circle_at_bottom_right,#10182812,transparent_40%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Client Application
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Visa application workspace
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Review the chosen destination and collect the client passport and
              travel details in a dedicated page instead of the landing view.
            </p>
          </div>

          <Button asChild variant="outline" className="h-12 rounded-xl px-5">
            <a href={`${ROUTES.HOME}#countries`}>
              <ArrowLeft />
              Change destination
            </a>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ApplicationDetailsView country={selectedCountry} />
        </motion.div>
      </div>
    </section>
  );
};

export default ApplicationPage;
