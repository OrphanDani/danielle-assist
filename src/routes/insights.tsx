import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AiNotice } from "@/components/AiNotice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMinutes, useStoreVersion } from "@/lib/format";
import {
  getActivities,
  getTasks,
  MINUTES_SAVED,
  type Activity,
  type TaskItem,
} from "@/lib/store";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Productivity Insights — SmartWork AI" },
      {
        name: "description",
        content:
          "See how often you use each AI tool and how much admin time you have saved, with transparent estimate methodology.",
      },
      { property: "og:title", content: "Productivity Insights — SmartWork AI" },
      {
        property: "og:description",
        content: "Usage, task completion and estimated time saved across every assisted task.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const version = useStoreVersion();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    setActivities(getActivities());
    setTasks(getTasks());
  }, [version]);

  const total = activities.length;
  const minutes = activities.reduce((s, a) => s + a.minutesSaved, 0);
  const byKind = (["email", "meeting", "planner"] as const).map((kind) => ({
    kind,
    count: activities.filter((a) => a.kind === kind).length,
  }));
  const max = Math.max(1, ...byKind.map((b) => b.count));
  const done = tasks.filter((t) => t.done).length;
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <AppShell
      title="Productivity Insights"
      description="Where the AI is helping, and roughly how much time it gives you back."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Metric label="Assisted tasks" value={String(total)} hint="All time, this browser" />
          <Metric
            label="Estimated time saved"
            value={formatMinutes(minutes)}
            hint="Estimate, not a measurement"
          />
          <Metric label="Task completion" value={`${completion}%`} hint={`${done}/${tasks.length} done`} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage by tool</CardTitle>
            <CardDescription>Which assistant you lean on most.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {byKind.map((b) => (
              <div key={b.kind} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{b.kind}</span>
                  <span className="text-muted-foreground">{b.count}</span>
                </div>
                <Progress value={(b.count / max) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">How time saved is estimated</CardTitle>
            <CardDescription>Full transparency — these are assumptions, not tracking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Each assisted action is credited with a fixed estimate of the manual time it typically
              replaces:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Email drafted: {MINUTES_SAVED.email} minutes</li>
              <li>Meeting summarized: {MINUTES_SAVED.meeting} minutes</li>
              <li>Day planned: {MINUTES_SAVED.planner} minutes</li>
            </ul>
            <p>
              We do not measure your actual working time and we never claim precision. Treat these
              figures as an indicative benchmark only.
            </p>
          </CardContent>
        </Card>

        <AiNotice>
          Insights are derived from your own local usage. No analytics leave this browser.
        </AiNotice>
      </div>
    </AppShell>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="shadow-card">
      <CardContent className="pt-6">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
