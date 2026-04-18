import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MailCheck, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useSession } from "../hooks/useSession";
import {
  sendVerificationEmailRequest,
  verifyEmailCodeRequest,
} from "../lib/auth-client";
import { ROUTES } from "../lib/routes";
import { verifyEmailFormSchema } from "../types";

type VerifyEmailValues = z.infer<typeof verifyEmailFormSchema>;

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, isEmailVerified, refreshSession } = useSession();

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const stateEmail =
    (location.state as { email?: string; autoSent?: boolean } | null)?.email ??
    "";
  const email = user?.email ?? stateEmail;

  const title = useMemo(() => {
    if (isEmailVerified) {
      return "Email verified";
    }

    return "Check your inbox";
  }, [isEmailVerified]);

  const description = useMemo(() => {
    if (isEmailVerified) {
      return "Your email is verified. You can continue into your account.";
    }

    return email
      ? `We sent a 6-digit verification code to ${email}. Enter it below to activate your account.`
      : "We sent a 6-digit verification code to your email address. Enter it below to activate your account.";
  }, [email, isEmailVerified]);

  const handleVerify = async (values: VerifyEmailValues) => {
    if (!email) {
      setError("No email address is available for verification.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await verifyEmailCodeRequest({
        email,
        otp: values.otp,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      await refreshSession();
      setMessage("Email verified successfully.");
      navigate(ROUTES.CLIENT.ROOT, { replace: true });
    } catch (requestError) {
      console.error(requestError);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("No email address is available for resending.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await sendVerificationEmailRequest(email);

      if (result.error) {
        setError(result.error);
        return;
      }

      setMessage("A new verification code has been sent.");
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
                {isEmailVerified ? (
                  <CheckCircle2 className="size-5 text-green-500" />
                ) : (
                  <MailCheck className="size-5" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            {message ? <p className="mb-4 text-sm text-green-500">{message}</p> : null}
            {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

            {isEmailVerified ? (
              <Button asChild className="h-12 w-full rounded-xl text-base">
                <Link to={isAuthenticated ? ROUTES.CLIENT.ROOT : ROUTES.LOGIN}>
                  {isAuthenticated ? "Go to dashboard" : "Go to sign in"}
                </Link>
              </Button>
            ) : (
              <div className="space-y-3">
                <Form {...form}>
                  <form className="space-y-3" onSubmit={form.handleSubmit(handleVerify)}>
                    <FormField
                      control={form.control}
                      name="otp"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Verification code</FormLabel>
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

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-xl text-base"
                      disabled={loading || !email}
                    >
                      {loading ? "Verifying..." : "Verify code"}
                    </Button>
                  </form>
                </Form>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full rounded-xl text-base"
                  disabled={loading || !email}
                  onClick={() => void handleResend()}
                >
                  {loading ? "Sending..." : "Resend verification code"}
                  <RotateCw />
                </Button>

                <Button asChild className="h-12 w-full rounded-xl text-base">
                  <Link to={ROUTES.LOGIN}>Back to sign in</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
