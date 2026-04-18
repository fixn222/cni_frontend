import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  PlaneTakeoff,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import type { Country } from "../context/CountyContext";
import { applicationFormSchema } from "../types";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useApplications } from "../context/ApplicationContext";
// import { duration } from "node_modules/zod/v4/core/regexes.d.cts";

interface ApplicationDetailsViewProps {
  country: Country | null;
}

const travelPurposes = ["Tourism", "Business", "Study", "Family visit"];

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const ApplicationDetailsView = ({ country }: ApplicationDetailsViewProps) => {
  const { createApplication, submitError, submitSuccess, submitting, clearSubmitStatus } = useApplications();
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      fullName: "",
      passportNumber: "",
      nationality: "",
      email: "",
      visaType: country?.visaType[0] ?? "",
      travelPurpose: travelPurposes[0],
      travelDate: "",
      durationOfStay: "",
      additionalNotes: "",
    },
  });

  useEffect(() => {
    if (!country) {
      return;
    }

    form.reset({
      fullName: "",
      passportNumber: "",
      nationality: "",
      email: "",
      visaType: country.visaType[0] ?? "",
      travelPurpose: travelPurposes[0],
      travelDate: "",
      durationOfStay: "",
      additionalNotes: "",
    });
    clearSubmitStatus();
  }, [country, form, clearSubmitStatus]);

  if (!country) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-center shadow-xl backdrop-blur-xl sm:p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-background/80">
          <PlaneTakeoff className="size-6 text-primary" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold">Choose a destination</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          Select one of the supported countries above to open the visa
          application view with client details and travel information fields.
        </p>
      </div>
    );
  }

  const onSubmit = async (values: ApplicationFormValues) => {
    const payload = {
      countryCode: country.code,
      clientDetails: {
        fullName: values.fullName,
        nationality: values.nationality,
        passportNumber: values.passportNumber,
      },
      visaDetails: {
        visaType: values.visaType,
        purpose: values.travelPurpose,
        travelDate: values.travelDate,
        duration: values.durationOfStay,
        notes: values.additionalNotes,
      },
    };

    try {
      await createApplication(payload);
      form.reset({
        fullName: "",
        passportNumber: "",
        nationality: "",
        email: "",
        visaType: country.visaType[0] ?? "",
        travelPurpose: travelPurposes[0],
        travelDate: "",
        durationOfStay: "",
        additionalNotes: "",
      });
    } catch {
      // Error is handled by the provider
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-2xl backdrop-blur-2xl"
      >
        <div className="relative border-b border-white/10 p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#29a89a33,transparent_40%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <img
                src={country.image}
                alt={country.name}
                className="h-20 w-20 rounded-[1.25rem] object-cover shadow-lg"
              />
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  <Globe2 className="size-3.5" />
                  {country.code}
                </div>
                <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                  {country.name} Visa Application
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Capture the client profile and travel details in one place
                  before moving into document collection and review.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Processing
                </p>
                <p className="mt-1 text-sm font-semibold">6-12 working days</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Entry
                </p>
                <p className="mt-1 text-sm font-semibold">Single / Multiple</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Available
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {country.visaType.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[minmax(0,1.45fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-white/10 bg-background/70 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-primary/10">
                  <UserRound className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Client Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Personal details exactly as shown in the passport.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Full name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter full name"
                          className="h-12 rounded-xl bg-white/60 px-4 dark:bg-background/40"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passportNumber"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Passport number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter passport number"
                          className="h-12 rounded-xl bg-white/60 px-4 uppercase dark:bg-background/40"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Nationality
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter nationality"
                          className="h-12 rounded-xl bg-white/60 px-4 dark:bg-background/40"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Contact email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          className="h-12 rounded-xl bg-white/60 px-4 dark:bg-background/40"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-background/70 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-primary/10">
                  <FileText className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">
                    Visa Applying Details
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Purpose, timing, and supporting notes for the case file.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Visa type
                      </FormLabel>
                      <FormControl>
                        <select
                          className="flex h-12 w-full rounded-xl border border-input bg-white/60 px-4 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-background/40"
                          {...field}
                        >
                          {country.visaType.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="travelPurpose"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Travel purpose
                      </FormLabel>
                      <FormControl>
                        <select
                          className="flex h-12 w-full rounded-xl border border-input bg-white/60 px-4 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-background/40"
                          {...field}
                        >
                          {travelPurposes.map((purpose) => (
                            <option key={purpose} value={purpose}>
                              {purpose}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="travelDate"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Intended travel date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-12 rounded-xl bg-white/60 px-4 dark:bg-background/40"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationOfStay"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Duration of stay
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 14 days"
                          className="h-12 rounded-xl bg-white/60 px-4 dark:bg-background/40"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">
                        Additional notes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Special travel history, urgency, interview notes, or supporting context."
                          className="min-h-28 rounded-xl bg-white/60 px-4 py-3 dark:bg-background/40"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-background/70 p-5 sm:p-6">
              <h4 className="text-lg font-semibold">Application Snapshot</h4>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">
                      Destination confirmed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {country.flag} {country.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Best for</p>
                    <p className="text-sm text-muted-foreground">
                      Planning travel dates and document deadlines early.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseBusiness className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Case readiness</p>
                    <p className="text-sm text-muted-foreground">
                      Collect passport copy, photographs, bank proof, and
                      itinerary.
                    </p>
                  </div>
                </div>
              </div>

              {submitSuccess && (
                <p className="mt-3 text-sm text-green-600">{submitSuccess}</p>
              )}

              {submitError && (
                <p className="mt-3 text-sm text-red-500">{submitError}</p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="mt-6 h-12 w-full rounded-xl text-sm font-semibold"
              >
                {submitting ? "Submitting..." : "Start Application"}
              </Button>
            </div>

            <div className="rounded-[1.5rem] border border-primary/15 bg-primary/10 p-5 sm:p-6">
              <p className="text-sm font-semibold">Checklist</p>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                  Passport valid for at least 6 months
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                  Destination and visa type selected
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                  Travel intent and dates confirmed
                </div>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </Form>
  );
};

export default ApplicationDetailsView;
