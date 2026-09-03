import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Copy, ListPlus, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AiNotice, PrivacyNotice } from "@/components/AiNotice";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting, type MeetingResult } from "@/lib/ai.functions";
import { addTasks, logActivity, SAMPLE_MEETING_NOTES } from "@/lib/store";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — SmartWork AI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into a clear summary with decisions, action items, owners, deadlines and open questions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — SmartWork AI" },
      {
        property: "og:description",
        content: "Structured summaries with owners and deadlines — nothing invented, gaps flagged.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MeetingResult | null>(null);

  async function submit() {
    if (!notes.trim()) {
      setError("Paste your meeting notes before summarizing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await run({ data: { notes, title, context } });
      setResult(data);
      logActivity("meeting", `Meeting summary${title ? `: ${title}` : ""}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Messy notes in, structured decisions and action items out."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting notes</CardTitle>
            <CardDescription>Paste raw notes or a transcript — order doesn't matter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting title (optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly delivery sync"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={14}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your notes here…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Extra context (optional)</Label>
              <Input
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Project Atlas, client-facing release"
              />
            </div>

            <ErrorBanner message={error} />

            <div className="flex flex-wrap gap-2">
              <Button onClick={submit} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-1 size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="mr-1 size-4" aria-hidden="true" />
                )}
                {loading ? "Summarizing…" : "Summarize notes"}
              </Button>
              <Button variant="outline" onClick={() => setNotes(SAMPLE_MEETING_NOTES)} disabled={loading}>
                Load sample notes
              </Button>
            </div>
            <PrivacyNotice>
              Notes are sent to the AI model only to produce this summary and are not stored on a
              server.
            </PrivacyNotice>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Structured summary</CardTitle>
            <CardDescription>
              Anything the notes didn't say is listed as missing, never guessed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result ? (
              <p className="text-sm text-muted-foreground">
                Your summary, decisions and action items will appear here.
              </p>
            ) : (
              <>
                <Section title="Summary">
                  <p className="text-sm leading-relaxed">{result.summary}</p>
                </Section>
                <Bullets title="Key points" items={result.keyPoints} />
                <Bullets title="Decisions" items={result.decisions} />

                <Section title="Action items">
                  {result.actionItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No action items found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {result.actionItems.map((a) => (
                        <li key={a.task} className="rounded-xl border border-border p-3 text-sm">
                          <p className="font-medium">{a.task}</p>
                          <p className="text-xs text-muted-foreground">
                            Owner: {a.responsible} · Deadline: {a.deadline} · {a.status}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </Section>

                <Bullets title="Open questions" items={result.openQuestions} />
                <Bullets title="Missing information" items={result.missingInformation} />

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      addTasks(
                        result.actionItems.map((a) => ({
                          title: a.task,
                          owner: a.responsible,
                          deadline: a.deadline,
                          source: "meeting" as const,
                        })),
                      );
                      toast.success("Action items added to your tasks");
                    }}
                    disabled={result.actionItems.length === 0}
                  >
                    <ListPlus className="mr-1 size-4" aria-hidden="true" /> Add to tasks
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        `${result.summary}\n\nDecisions:\n${result.decisions.join("\n")}\n\nActions:\n${result.actionItems
                          .map((a) => `- ${a.task} (${a.responsible}, ${a.deadline})`)
                          .join("\n")}`,
                      );
                      toast.success("Summary copied to clipboard");
                    }}
                  >
                    <Copy className="mr-1 size-4" aria-hidden="true" /> Copy summary
                  </Button>
                </div>
              </>
            )}
            <AiNotice />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Bullets({ title, items }: { title: string; items: string[] }) {
  return (
    <Section title={title}>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None recorded.</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
    </Section>
  );
}
