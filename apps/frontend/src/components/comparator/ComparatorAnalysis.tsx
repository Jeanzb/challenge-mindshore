import { ArrowLeftRight, BookOpen, FlaskConical, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { parseComparisonSections, stripMarkdown } from "@/lib/comparisonAnalysis";
import { m } from "@/paraglide/messages";

type ComparatorAnalysisProps = {
  analysis: string;
};

const renderListItem = (item: string) => (
  <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-70" />
    <span>{item}</span>
  </li>
);

export function ComparatorAnalysis({ analysis }: ComparatorAnalysisProps) {
  const sections = parseComparisonSections(analysis);

  if (sections === null) {
    return <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{stripMarkdown(analysis)}</p>;
  }

  return (
    <div className="space-y-5">
      {sections.summary.length > 0 ? (
        <p className="text-sm leading-7 text-foreground">{sections.summary}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <SectionList title={m.compare_section_similarities()} tone="cyan" icon={Sparkles} items={sections.similarities} />
        <SectionList title={m.compare_section_differences()} tone="orange" icon={ArrowLeftRight} items={sections.differences} />
      </div>
      <SectionBlock title={m.compare_section_historical()} icon={BookOpen} body={sections.historicalContext} />
      <SectionBlock title={m.compare_section_scientific()} icon={FlaskConical} body={sections.scientificValue} />
      {sections.conclusion.length > 0 ? (
        <div className="rounded-lg border border-space-orange/25 bg-space-orange/5 p-4">
          <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-space-orange">
            {m.compare_section_conclusion()}
          </p>
          <p className="text-sm leading-7 text-foreground">{sections.conclusion}</p>
        </div>
      ) : null}
    </div>
  );
}

type SectionTone = "cyan" | "orange";

type SectionListProps = {
  title: string;
  tone: SectionTone;
  icon: LucideIcon;
  items: readonly string[];
};

function SectionList({ title, tone, icon: Icon, items }: SectionListProps) {
  if (items.length === 0) {
    return null;
  }

  const toneClass = tone === "cyan" ? "text-space-cyan" : "text-space-orange";

  return (
    <div className="rounded-lg border border-white/10 bg-space-void/30 p-4">
      <p className={`mb-3 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-wider ${toneClass}`}>
        <Icon className="h-3.5 w-3.5" />
        {title}
      </p>
      <ul className={`space-y-2 ${toneClass}`}>{items.map(renderListItem)}</ul>
    </div>
  );
}

type SectionBlockProps = {
  title: string;
  icon: LucideIcon;
  body: string;
};

function SectionBlock({ title, icon: Icon, body }: SectionBlockProps) {
  if (body.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-space-void/30 p-4">
      <p className="mb-1.5 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-space-cyan" />
        {title}
      </p>
      <p className="text-sm leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}
