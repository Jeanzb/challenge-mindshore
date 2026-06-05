type FeaturePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FeaturePlaceholder({ eyebrow, title, description }: FeaturePlaceholderProps) {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-lg border border-white/10 bg-space-panel p-8 text-card-foreground shadow-2xl shadow-black/30">
        <p className="mb-3 text-xs font-semibold uppercase tracking-normal text-space-cyan">{eyebrow}</p>
        <h1 className="text-2xl font-semibold tracking-normal text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
