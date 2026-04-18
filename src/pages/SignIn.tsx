// Auth redesign: this sign-in screen now shares the landing-page atmosphere, card language, and mobile stacking behavior.
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { ArrowRight, Brain, ShieldCheck, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { useSession } from "../hooks/useSession";
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
import { ROUTES } from "../lib/routes";
import { signInFormSchema } from "../types";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type SignInValues = z.infer<typeof signInFormSchema>;

const signInHighlights = [
  "Resume applications from any device",
  "Track document review and status updates",
  "Secure access with the same guided experience",
];

const SignIn = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { signIn, clearError, error: sessionError } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || ROUTES.CLIENT.ROOT;

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (values: SignInValues) => {
    setError("");
    setLoading(true);
    setMessage("");

    try {
      const result = await signIn({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        if (result.code === "EMAIL_NOT_VERIFIED") {
          navigate(ROUTES.VERIFY_EMAIL, {
            replace: true,
            state: { email: values.email, autoSent: true },
          });
          return;
        }

        setError(result.error);
        return;
      }

      setMessage("Welcome back");
      form.reset();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(error);
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
          particleCount={130}
          particleSpread={9}
          speed={0.08}
          particleBaseSize={85}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,460px)] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-2xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 backdrop-blur-2xl">
            <Brain size={18} />
            <span className="text-xs font-semibold tracking-[0.22em] sm:text-sm">
              WELCOME BACK
            </span>
          </div>

          <h1 className="mt-6 max-w-[14ch] text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Sign in and continue with confidence.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base lg:text-lg">
            The auth flow now uses the same visual system as the landing page:
            soft atmosphere, glass panels, generous spacing, and mobile-first
            structure that stays easy to use on smaller screens.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/60 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-md sm:text-sm">
            <ShieldCheck size={16} />
            <span>Protected access for your application history</span>
          </div>

          <div className="mt-8 grid w-full gap-4 sm:grid-cols-3">
            {signInHighlights.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: 0.08 + index * 0.05,
                }}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-5 text-sm text-muted-foreground shadow-lg backdrop-blur-xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-[2rem] border border-white/10 bg-background/80 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-2xl border border-white/10 bg-background/70 p-3">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Sign In</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Access your dashboard, files, and next steps.
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form
                  className="space-y-5"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="h-12 rounded-xl border-white/10 bg-background/70 px-4"
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
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-3">
                          <FormLabel className="text-sm font-medium">
                            Password
                          </FormLabel>
                          <Link
                            to={ROUTES.FORGOT_PASSWORD}
                            className="text-sm text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="h-12 rounded-xl border-white/10 bg-background/70 px-4"
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

                  {message && (
                    <p className="text-green-500 text-sm mt-5 mb-5 ">
                      {message}
                    </p>
                  )}
                  {(error || sessionError) && (
                    <p className="text-red-500 text-sm mt-5 mb-5 ">
                      {error || sessionError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl text-base"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Sign In"}
                    <ArrowRight />
                  </Button>
                </form>
              </Form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                New here?{" "}
                <Link
                  to={ROUTES.REGISTER}
                  className="font-medium text-primary hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SignIn;
