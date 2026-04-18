import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { type z } from "zod";

import Particles from "../components/Particles";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { resetPasswordRequest } from "../lib/auth-client";
import { ROUTES } from "../lib/routes";
import { resetPasswordFormSchema } from "../types";

type ResetPasswordValues = z.infer<typeof resetPasswordFormSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const email = searchParams.get("email") ?? "";

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!email) {
      setError("Missing email address for password reset.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await resetPasswordRequest({
        email,
        otp: values.otp,
        password: values.password,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setMessage("Password updated successfully. You can sign in now.");
      form.reset();
    } catch (requestError) {
      console.error(requestError);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#29a89a24,transparent_60%)]">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={120}
          particleSpread={8}
          speed={0.08}
          particleBaseSize={85}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="rounded-[2rem] border border-white/10 bg-background/85 p-5 shadow-2xl backdrop-blur-2xl">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-6">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-2xl border border-white/10 bg-background/70 p-3">
                <KeyRound className="size-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Reset password</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter the code from your email and choose a new password.
                </p>
              </div>
            </div>

            {email ? (
              <p className="mb-5 rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                Resetting password for <span className="font-medium text-foreground">{email}</span>
              </p>
            ) : null}

            <Form {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Reset code</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="Enter 6-digit code"
                          className="h-12 rounded-xl border-white/10 bg-background/70 px-4 tracking-[0.35em]"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error ? (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter a new password"
                          className="h-12 rounded-xl border-white/10 bg-background/70 px-4"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error ? (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Re-enter your password"
                          className="h-12 rounded-xl border-white/10 bg-background/70 px-4"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error ? (
                        <p className="text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      ) : null}
                    </FormItem>
                  )}
                />

                {message ? <p className="text-sm text-green-500">{message}</p> : null}
                {error ? <p className="text-sm text-red-500">{error}</p> : null}

                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl text-base"
                  disabled={loading || !email}
                >
                  {loading ? "Updating..." : "Update password"}
                  <ArrowRight />
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Need a new code?{" "}
              <Link to={ROUTES.FORGOT_PASSWORD} className="font-medium text-primary hover:underline">
                Request again
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Back to{" "}
              <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
                sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
