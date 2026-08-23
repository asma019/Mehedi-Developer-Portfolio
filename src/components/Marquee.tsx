import { Sparkle } from "lucide-react";
import { marqueeItems } from "../data/content";

export default function Marquee() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="relative border-y border-line bg-alt/60 py-4.5">
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-12 pr-12">
          {row.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-12 whitespace-nowrap font-display text-sm font-medium uppercase tracking-[0.22em] text-muted"
            >
              {item}
              <Sparkle size={12} className="text-accent/70" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
