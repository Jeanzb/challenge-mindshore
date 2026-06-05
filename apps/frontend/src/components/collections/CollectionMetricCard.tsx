import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type CollectionMetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function CollectionMetricCard({ icon: Icon, label, value }: CollectionMetricCardProps) {
  return (
    <Card className="flex items-center gap-4 rounded-lg border-white/10 bg-space-panel p-4 shadow-sm shadow-black/20">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-space-cyan/10 text-space-cyan">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xl font-semibold leading-6 text-white">{value}</span>
        <span className="block text-xs text-muted-foreground">{label}</span>
      </span>
    </Card>
  );
}
