// Responsive refresh: service content now collapses cleanly on mobile and uses restrained reveal animation.
import { motion } from "motion/react";
import { Settings } from "lucide-react";

import ServiceCard from "../components/Service-Card";
import { SERVICES } from "../lib/constants";

const Service = () => {
  return (
    <section
      id="services"
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#29a89a26,transparent_60%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(320px,460px)_minmax(0,1fr)] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="order-2 mx-auto w-full max-w-sm lg:order-1 lg:max-w-none"
        >
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
            <img
              src="/servis.png"
              alt="Services illustration"
              className="aspect-[4/4.3] w-full rounded-[1.5rem] object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
          className="order-1 w-full text-center lg:order-2 lg:text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-lg backdrop-blur-xl">
            <Settings size={18} />
            <span className="text-xs font-semibold tracking-[0.22em] sm:text-sm">
              SERVICES
            </span>
          </div>

          <h2 className="mt-6 text-balance text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Smart Application Hub
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base lg:mx-0">
            Everything you need to navigate the visa process, from guided
            document prep to instant updates, in a layout that stays readable on
            smaller screens.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: index * 0.06,
                }}
              >
                <ServiceCard
                  title={service.title}
                  icon={service.icon}
                  description={service.description}
                  highlight={service.highlight}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Service;
