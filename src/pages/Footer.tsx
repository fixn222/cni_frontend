// Responsive refresh: the footer now uses a stacked mobile-first grid with light hover motion on links.
import { motion } from "motion/react";
import { Brain } from "lucide-react";

import { CLIENT_NAV } from "../lib/constants";

const footerGroups = [
  {
    title: "Explore",
    links: CLIENT_NAV,
  },
  {
    title: "Support",
    links: [
      { title: "Help Center", href: "#", icon: Brain },
      { title: "Contact Us", href: "#", icon: Brain },
      { title: "Privacy", href: "#", icon: Brain },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "#", icon: Brain },
      { title: "Partners", href: "#", icon: Brain },
      { title: "Careers", href: "#", icon: Brain },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto grid w-full max-w-7xl gap-10 rounded-[2rem] border border-white/10 bg-white/5 px-5 py-8 backdrop-blur-xl sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]"
      >
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-background/80 p-3">
              <Brain className="size-5" />
            </div>
            <h2 className="text-lg font-semibold tracking-[0.18em]">
              CNI GLOBAL
            </h2>
          </div>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            AI-assisted visa support built to make planning, document handling,
            and status tracking clearer across desktop and mobile screens.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {footerGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
                delay: groupIndex * 0.06,
              }}
              className="flex flex-col items-start"
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {group.title}
              </h3>
              <div className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <a
                    key={`${group.title}-${link.title}`}
                    href={link.href}
                    className="text-sm transition-transform duration-300 hover:translate-x-1 hover:text-primary"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
