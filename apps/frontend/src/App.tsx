function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-card-foreground shadow-2xl shadow-black/30">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full border border-space-orange/40 bg-space-panelStrong text-space-orange">
              C
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal">Cosmara</h1>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                AI Space Archive
              </p>
            </div>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Frontend workspace ready. The next commit will add routing, providers, and feature
            folders for the application flow.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
