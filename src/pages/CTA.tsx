// Responsive refresh: this section scales its step rail for mobile and adds gentle staggered reveals.
import { motion } from "motion/react";
import { CreditCard, EyeIcon, Globe, Upload } from "lucide-react";

import LogoLoop from "../components/LogoLoop";

const techLogos = [
  { node: <Globe size={40} />, title: "Select Destination", href: "#" },
  { node: <Upload size={40} />, title: "Upload Details", href: "#" },
  { node: <CreditCard size={40} />, title: "Pay Securely", href: "#" },
  { node: <EyeIcon size={40} />, title: "Track Status", href: "#" },
];

const CTA = () => {
  return (
    <section className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-6xl flex-col items-center rounded-[2rem] border border-white/10 bg-white/5 px-5 py-10 text-center shadow-xl backdrop-blur-xl sm:px-8 sm:py-12"
      >
        <div className="inline-flex items-center gap-3 rounded-full bg-white/6 px-5 py-2">
          <Upload size={16} />
          <span className="text-xs font-semibold tracking-[0.22em] sm:text-sm">
            HOW IT WORKS
          </span>
        </div>

        <h2 className="mt-5 text-balance text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Four Simple Steps
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          From destination selection to visa approval, every stage is designed
          to stay clear and touch-friendly on smaller screens.
        </p>

        <div className="mt-8 w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-background/70 px-3 py-5 sm:px-5">
          <LogoLoop
            logos={techLogos}
            speed={22}
            direction="left"
            logoHeight={40}
            gap={28}
            hoverSpeed={0.4}
            scaleOnHover
            fadeOut
            fadeOutColor="transparent"
            ariaLabel="Visa process steps"
            renderItem={(item, key) => {
              const isNode = "node" in item;

              return (
                <motion.div
                  key={key}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex min-w-[126px] flex-col items-center justify-center rounded-2xl px-3 py-4"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-3xl shadow-sm">
                    {isNode ? (
                      item.node
                    ) : (
                      <img src={item.src} alt={item.alt} className="h-8" />
                    )}
                  </div>
                  <span className="mt-3 text-center text-xs font-medium text-muted-foreground sm:text-sm">
                    {item.title}
                  </span>
                </motion.div>
              );
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
