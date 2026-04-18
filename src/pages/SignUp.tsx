// Auth redesign: this sign-up screen now fully follows the landing-page visual language and collapses cleanly on mobile.
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { ArrowRight, Globe, Sparkles, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import Particles from "../components/Particles";
import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useSession } from "../hooks/useSession";
import { ROUTES } from "../lib/routes";
import { signUpFormSchema } from "../types";
import { useEffect, useState } from "react";

type SignUpValues = z.infer<typeof signUpFormSchema>;

const signUpBenefits = [
  "Create your account in a few guided steps",
  "Upload documents and continue from any screen size",
  "Receive live updates as your application progresses",
];



const SignUp = () => {


  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading , setLoading] = useState(false);
  const { signUp, clearError, error: sessionError } = useSession();
  const navigate = useNavigate();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (values: SignUpValues) => {
    setMessage("");
    setError("");
    setLoading(true)
    try {
      const result = await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setMessage("Account Created Successfully");
      form.reset();
      navigate(ROUTES.VERIFY_EMAIL, {
        replace: true,
        state: { email: values.email },
      });

    } catch (error) {

      console.error(error);
      setError("Something went wrong");


    }finally{
      setLoading(false);
    }
    // console.log(values);
  };

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#29a89a24,transparent_60%)]">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={135}
          particleSpread={9}
          speed={0.08}
          particleBaseSize={85}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(340px,460px)_minmax(0,1.05fr)] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="order-2 mx-auto w-full max-w-md lg:order-1"
        >
          <div className="rounded-[2rem] border border-white/10 bg-background/80 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-2xl border border-white/10 bg-background/70 p-3">
                  <UserPlus className="size-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Create Account</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start your visa process with a clean, guided setup.
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Full name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full name"
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
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email</FormLabel>
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
                        <FormLabel className="text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a password"
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
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Re-enter your password"
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
                    <p className="text-green-500 text-sm mt-5 mb-5 ">{message}</p>
                  )}
                  {(error || sessionError) && (
                    <p className="text-red-500 text-sm mt-5 mb-5 ">{error || sessionError}</p>

                  )}

                  <Button disabled={loading} type="submit" className="h-12 w-full rounded-xl text-base">
                       {loading ? "Loading..." : "Sign Up"}
                    <ArrowRight />
                  </Button>
                </form>
              </Form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
          className="order-1 mx-auto flex w-full max-w-2xl flex-col items-center text-center lg:order-2 lg:mx-0 lg:items-start lg:text-left"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 backdrop-blur-2xl">
            <Sparkles size={18} />
            <span className="text-xs font-semibold tracking-[0.22em] sm:text-sm">
              GET STARTED
            </span>
          </div>

          <h1 className="mt-6 max-w-[14ch] text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Create your account in the same design system.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base lg:text-lg">
            This page now mirrors the landing experience more closely with the
            same atmospheric background, glass surfaces, and responsive spacing
            so the transition into account creation feels intentional.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/60 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-md sm:text-sm">
            <Globe size={16} />
            <span>Built for applicants moving across countries and devices</span>
          </div>

          <div className="mt-8 grid w-full gap-4 sm:grid-cols-3">
            {signUpBenefits.map((item, index) => (
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
      </div>
    </section>
  );
};

export default SignUp;
