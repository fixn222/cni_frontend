import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { requestPasswordResetRequest } from "../lib/auth-client";
import { ROUTES } from "../lib/routes";
import { forgotPasswordFormSchema } from "../types";

type ForgotPasswordValues = z.infer<typeof forgotPasswordFormSchema>;

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await requestPasswordResetRequest({
        email: values.email,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setMessage("If that email exists in the system, a reset code has been sent.");
      navigate(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(values.email)}`, {
        replace: true,
      });
    } catch (requestError) {
      console.error(requestError);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#29a89a24,transparent_60%)]">
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
                <Mail className="size-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Forgot password</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your email and we will send you a password reset code.
                </p>
              </div>
            </div>

            <Form {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
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
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send reset code"}
                  <ArrowRight />
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
