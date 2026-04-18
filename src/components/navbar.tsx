// Navigation refresh: the navbar now exposes sign-in and sign-up actions while staying route-aware on desktop and mobile.
import { motion } from "motion/react";
import { Brain, Menu } from "lucide-react";
import { Link } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSession } from "../hooks/useSession";
import { ROUTES } from "../lib/routes";

const marketingLinks = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Services", href: `${ROUTES.HOME}#services` },
  { label: "Destinations", href: `${ROUTES.HOME}#countries` },
  { label: "Reviews", href: `${ROUTES.HOME}#testimonials` },
];

const guestLinks = [
  { label: "Sign In", href: ROUTES.LOGIN, variant: "ghost" as const },
  { label: "Sign Up", href: ROUTES.REGISTER, variant: "default" as const },
];

const isActiveRoute = (pathname: string, href: string) => pathname === href;

const NavBar = ({ pathname }: { pathname: string }) => {
  const { isAuthenticated, isEmailVerified, user } = useSession();
  const onAuthPage =
    pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;
  const authLinks = isAuthenticated
    ? [{
        label: isEmailVerified ? "Dashboard" : "Verify Email",
        href: isEmailVerified
          ? user?.role === "admin"
            ? ROUTES.ADMIN.ROOT
            : ROUTES.CLIENT.ROOT
          : ROUTES.VERIFY_EMAIL,
        variant: "default" as const,
      }]
    : guestLinks;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[1.5rem] border border-white/10 bg-background/80 px-4 py-3 shadow-lg backdrop-blur-xl sm:px-5">
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <Brain className="size-5" />
          </div>
          <p className="text-base font-bold tracking-[0.18em] sm:text-lg">
            CNI GLOBAL
          </p>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {marketingLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/5 ${
                pathname === ROUTES.HOME && link.href.includes("#")
                  ? "text-muted-foreground hover:text-foreground"
                  : isActiveRoute(pathname, link.href)
                    ? "bg-white/8 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle />
            {authLinks.map((link) => (
              <Button
                key={link.label}
                asChild
                variant={isActiveRoute(pathname, link.href) ? "default" : link.variant}
                className="rounded-full px-4"
              >
                <Link to={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="mr-0" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
              {marketingLinks.map((link) => (
                <DropdownMenuItem
                  key={link.label}
                  asChild
                  className="rounded-xl px-3 py-3"
                >
                  <Link to={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
              <div className="my-2 h-px bg-border" />
              {authLinks.map((link) => (
                <DropdownMenuItem
                  key={link.label}
                  asChild
                  className={`rounded-xl px-3 py-3 ${
                    isActiveRoute(pathname, link.href) || (onAuthPage && link.href === pathname)
                      ? "bg-white/8"
                      : ""
                  }`}
                >
                  <Link to={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
