// Responsive refresh: this section now prioritizes stable mobile spacing and subtle entrance motion.
import { motion } from "motion/react";
import { Brain, Shield } from "lucide-react";

import Particles from "../components/Particles";
import { Button } from "../components/ui/button";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#29a89a26,transparent_60%)]">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={140}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={90}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,540px)] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-2xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left"
        >
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 backdrop-blur-2xl">
            <Brain size={18} />
            <span className="text-xs font-semibold tracking-[0.22em] sm:text-sm">
              AI POWERED
            </span>
          </div>

          <h1 className="mt-6 max-w-[14ch] text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Apply for Your Visa with Confidence
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base lg:text-lg">
            Streamlined visa applications powered by AI. From document
            verification to real-time tracking, the process stays clear, fast,
            and easy to follow on any device.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/60 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-md sm:text-sm">
            <Shield size={16} />
            <span>Secured with Arcjet-grade protection</span>
          </div>

          <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button className="h-12 w-full rounded-xl px-8 text-base sm:w-auto">
              Apply now
            </Button>
            <Button
              variant="secondary"
              className="h-12 w-full rounded-xl px-8 text-base sm:w-auto"
            >
              Learn more
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mx-auto flex w-full max-w-[22rem] justify-center sm:max-w-[28rem] lg:max-w-none"
        >
          <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
            <img
              src="/cni1.png"
              alt="Applicant dashboard preview"
              className=" w-full rounded-[1.5rem] object-cover shadow-xl transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
