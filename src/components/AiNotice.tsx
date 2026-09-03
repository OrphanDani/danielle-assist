import { Info, ShieldCheck } from "lucide-react";

export function AiNotice({
  children = "AI-generated content. Please review and edit before sending or acting on it. SmartWork AI never invents facts, but it can misread context.",
}: {
  children?: React.ReactNode;
}) {
  return (
    <p
      role="note"
      className="flex items-start gap-2 rounded-xl border border-accent bg-accent/60 px-3 py-2.5 text-xs leading-relaxed text-accent-foreground"
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function PrivacyNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
