// Responsive refresh: country cards now use proper chip wrapping and touch-friendly spacing.
import { getApplicationRoute } from "../lib/routes";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import type { Country } from "../context/CountyContext";

export interface CardProps extends Country {
  onSelect?: () => void;
}

const ContriesCard = ({
  code,
  name,
  visaType,
  image,
  flag,
  popular,
  selected,
  onSelect,
}: CardProps) => {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[1.5rem] border shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        selected
          ? "border-primary/40 bg-primary/10 ring-1 ring-primary/30"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-44 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
        {popular && (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
            Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 text-center sm:p-6">
        <div className="flex items-start justify-between gap-4 text-left">
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Visa support available
            </p>
          </div>
          <div className="h-[14px] w-[40px]">
            <img src={flag} alt="flag" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {visaType?.map((type) => (
            <span
              key={`${name}-${type}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                selected
                  ? "border-primary/20 bg-primary/10 text-foreground"
                  : "border-white/10 bg-white/8 text-muted-foreground"
              }`}
            >
              {type}
            </span>
          ))}
        </div>

        <Button
          asChild
          className="mt-6 h-11 w-full rounded-xl"
          variant={selected ? "secondary" : "default"}
        >
             <Link to={getApplicationRoute(code)} onClick={onSelect}>
             {selected ? "Selected destination" : "Choose destination"}
                </Link>
        </Button>
      </div>
    </article>
  );
};

export default ContriesCard;
