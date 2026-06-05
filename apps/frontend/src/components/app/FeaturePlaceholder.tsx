type FeaturePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FeaturePlaceholder({ eyebrow, title, description }: FeaturePlaceholderProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-lg border border-border bg-card p-8 text-card-foreground shadow-2xl shadow-black/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-space-cyan">
            {eyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </section>
    </main>
  );
}
