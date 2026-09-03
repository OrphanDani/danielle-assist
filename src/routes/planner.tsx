import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AiNotice } from "@/components/AiNotice";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks, type PlanResult } from "@/lib/ai.functions";
import {
  addTasks,
  getPrefs,
  getTasks,
  logActivity,
  removeTask,
  SAMPLE_TASKS,
  toggleTask,
  type TaskItem,
} from "@/lib/store";
import { useStoreVersion } from "@/lib/format";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — SmartWork AI" },
      {
        name: "description",
        content:
          "Prioritize your workload with Urgency x Importance and get a realistic, conflict-aware time-blocked daily schedule.",
      },
      { property: "og:title", content: "AI Task Planner — SmartWork AI" },
      {
        property: "og:description",
        content: "Turn a task list into a prioritized, time-blocked plan that fits your working hours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(planTasks);
  const version = useStoreVersion();
  const [tasksText, setTasksText] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [commitments, setCommitments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, [version]);

  useEffect(() => {
    setWorkingHours(getPrefs().workingHours);
  }, []);

  async function submit() {
    if (!tasksText.trim()) {
      setError("List the tasks you want planned first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await run({
        data: {
          tasks: tasksText,
          workingHours: workingHours || "09:00–17:00",
          commitments,
          planDate: new Date().toDateString(),
        },
      });
      setResult(data);
      logActivity("planner", `Plan — ${data.prioritised.length} tasks`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="AI Task Planner"
      description="Prioritized with Urgency × Importance, scheduled around your real working hours."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your tasks</CardTitle>
              <CardDescription>
                One per line. Include deadlines and rough durations where you know them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={10}
                aria-label="Tasks"
                value={tasksText}
                onChange={(e) => setTasksText(e.target.value)}
                placeholder="1. Finalise client proposal — today 16:00, 90 min…"
              />
              <div className="space-y-2">
                <Label htmlFor="hours">Working hours</Label>
                <Input
                  id="hours"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="08:30–17:00, lunch 13:00–13:30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commitments">Fixed commitments (optional)</Label>
                <Input
                  id="commitments"
                  value={commitments}
                  onChange={(e) => setCommitments(e.target.value)}
                  placeholder="Stand-up 09:30, client call 15:00"
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
                  {loading ? "Planning…" : "Build my plan"}
                </Button>
                <Button variant="outline" onClick={() => setTasksText(SAMPLE_TASKS)} disabled={loading}>
                  Load sample tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Task list</CardTitle>
              <CardDescription>Saved in this browser.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                      aria-label={`Mark ${t.title} complete`}
                      className="mt-0.5 size-4 accent-[var(--primary)]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className={t.done ? "block line-through" : "block font-medium"}>
                        {t.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {t.owner ? `${t.owner} · ` : ""}
                        {t.deadline || "No deadline"} · from {t.source}
                      </span>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${t.title}`}
                      onClick={() => removeTask(t.id)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your plan</CardTitle>
            <CardDescription>Priorities, schedule and any conflicts detected.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result ? (
              <p className="text-sm text-muted-foreground">
                Add your tasks and generate a plan to see prioritization and time blocks.
              </p>
            ) : (
              <>
                <p className="text-sm leading-relaxed">{result.overview}</p>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Prioritized tasks
                  </h3>
                  {result.prioritised.map((p) => (
                    <div key={p.task} className="rounded-xl border border-border p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{p.task}</span>
                        <Badge variant="secondary">{p.quadrant}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Urgency {p.urgency} · Importance {p.importance} · {p.deadline} · ~
                        {p.estimatedMinutes} min
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{p.reasoning}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Time-blocked schedule
                  </h3>
                  {result.schedule.map((s) => (
                    <div
                      key={`${s.start}-${s.activity}`}
                      className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm"
                    >
                      <CalendarClock className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="w-28 shrink-0 text-xs font-medium">
                        {s.start}–{s.end}
                      </span>
                      <span className="min-w-0 flex-1">{s.activity}</span>
                      <Badge variant="outline" className="shrink-0">
                        {s.type}
                      </Badge>
                    </div>
                  ))}
                </div>

                {result.conflicts.length > 0 ? (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
                    <p className="text-xs font-semibold">Conflicts and overloads</p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-xs">
                      {result.conflicts.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {result.recommendations.length > 0 ? (
                  <div className="rounded-xl bg-secondary p-3">
                    <p className="text-xs font-semibold">Recommendations</p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                      {result.recommendations.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Button
                  variant="outline"
                  onClick={() =>
                    addTasks(
                      result.prioritised.map((p) => ({
                        title: p.task,
                        deadline: p.deadline,
                        source: "planner" as const,
                      })),
                    )
                  }
                >
                  Save these to my task list
                </Button>
              </>
            )}
            <AiNotice />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
