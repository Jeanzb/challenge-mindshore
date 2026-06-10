import { Construction } from "lucide-react";

type FeaturePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FeaturePlaceholder({ eyebrow, title, description }: FeaturePlaceholderProps) {
  return (
    <section className="cosmara-fade-in flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-xl border border-white/10 bg-space-panel p-8 text-card-foreground shadow-2xl shadow-black/30 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="cosmara-float cosmara-glow-cyan flex h-14 w-14 items-center justify-center rounded-2xl border border-space-cyan/20 bg-space-cyan/10 text-space-cyan">
            <Construction className="h-7 w-7" />
          </span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-space-cyan">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-white sm:text-3xl">{title}</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
          <div className="cosmara-shimmer mt-6 h-1 w-24 rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}
