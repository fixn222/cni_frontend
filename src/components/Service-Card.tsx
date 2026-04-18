// Responsive refresh: service cards now preserve readable spacing and use a restrained hover lift.
import type { LucideIcon } from "lucide-react";

interface ServiceProps {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight?: boolean;
}

const ServiceCard = ({
  title,
  description,
  icon: Icon,
  highlight,
}: ServiceProps) => {
  return (
    <article
      className={`flex h-full flex-col rounded-[1.5rem] border p-6 text-center shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-7 lg:text-left ${
        highlight
          ? "border-primary/30 bg-primary/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-center justify-center lg:justify-start">
        <div className="rounded-2xl border border-white/10 bg-background/70 p-3">
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-4 text-base font-semibold sm:text-lg">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </article>
  );
};

export default ServiceCard;
