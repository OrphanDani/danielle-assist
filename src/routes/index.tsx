import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Mail,
  NotebookPen,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { AiNotice } from "@/components/AiNotice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getActivities,
  getPrefs,
  getTasks,
  toggleTask,
  type Activity,
  type TaskItem,
} from "@/lib/store";
import { formatMinutes, useStoreVersion } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartWork AI — Intelligent Productivity Assistant" },
      {
        name: "description",
        content:
          "SmartWork AI writes professional emails, summarizes meeting notes and builds prioritized daily plans, with transparent AI and estimated time saved.",
      },
      { property: "og:title", content: "SmartWork AI — Intelligent Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Generate emails, summarize meetings and plan your day with responsible AI. See how much admin time you save.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email" as const,
    icon: Mail,
    emoji: "✉️",
    title: "Smart Email Generator",
    body: "Turn a one-line intent into a polished, on-tone email with subject line and call to action.",
  },
  {
    to: "/meetings" as const,
    icon: NotebookPen,
    emoji: "📝",
    title: "Meeting Notes Summarizer",
    body: "Convert messy notes into decisions, action items, owners and deadlines — never invented.",
  },
  {
    to: "/planner" as const,
    icon: CalendarCheck,
    emoji: "✅",
    title: "AI Task Planner",
    body: "Prioritize with Urgency × Importance and get a realistic, conflict-aware time-blocked day.",
  },
  {
    to: "/insights" as const,
    icon: TrendingUp,
    emoji: "📊",
    title: "Productivity Insights",
    body: "Track usage and estimated time saved across every assisted task.",
  },
];

function Dashboard() {
  const version = useStoreVersion();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [name, setName] = useState("there");

  useEffect(() => {
    setActivities(getActivities());
    setTasks(getTasks());
    setName(getPrefs().name || "there");
  }, [version]);

  const weekAgo = Date.now() - 7 * 864e5;
  const weekly = activities.filter((a) => new Date(a.createdAt).getTime() >= weekAgo);
  const minutesSaved = weekly.reduce((sum, a) => sum + a.minutesSaved, 0);
  const completed = tasks.filter((t) => t.done).length;
  const openTasks = tasks.filter((t) => !t.done);

  return (
    <AppShell
      title={`Welcome back, ${name}!`}
      description="What would you like to accomplish today?"
    >
      <div className="space-y-8">
        <section className="overflow-hidden rounded-3xl bg-brand-gradient p-6 text-primary-foreground shadow-lift sm:p-8">
          <Badge className="border-0 bg-primary-foreground/15 text-primary-foreground">
            <Sparkles className="mr-1 size-3.5" aria-hidden="true" /> Responsible AI workspace
          </Badge>
          <h2 className="mt-4 max-w-2xl text-2xl font-bold sm:text-3xl">
            Less admin. More of the work that actually matters.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/85">
            SmartWork AI drafts your emails, turns meeting notes into action items and builds a
            realistic plan for your day — you stay in full control of every output.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link to="/email">
                Write an email <ArrowRight className="ml-1 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/meetings">Summarize meeting notes</Link>
            </Button>
          </div>
        </section>

        <section aria-labelledby="stats-heading" className="space-y-3">
          <h2 id="stats-heading" className="text-sm font-semibold text-muted-foreground">
            This week at a glance
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              icon={Clock}
              label="Estimated time saved"
              value={formatMinutes(minutesSaved)}
              hint="Estimate, not a measurement"
            />
            <Stat
              icon={Mail}
              label="Emails generated"
              value={String(weekly.filter((a) => a.kind === "email").length)}
              hint="Last 7 days"
            />
            <Stat
              icon={NotebookPen}
              label="Meetings summarized"
              value={String(weekly.filter((a) => a.kind === "meeting").length)}
              hint="Last 7 days"
            />
            <Stat
              icon={CheckCircle2}
              label="Tasks completed"
              value={`${completed}/${tasks.length}`}
              hint="Tracked in this browser"
            />
          </div>
        </section>

        <section aria-labelledby="features-heading" className="space-y-3">
          <h2 id="features-heading" className="text-sm font-semibold text-muted-foreground">
            AI tools
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map((f) => (
              <Link
                key={f.to}
                to={f.to}
                className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="h-full transition-shadow group-hover:shadow-lift">
                  <CardHeader>
                    <span aria-hidden="true" className="text-2xl">
                      {f.emoji}
                    </span>
                    <CardTitle className="text-base">{f.title}</CardTitle>
                    <CardDescription>{f.body}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Open <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today's priorities</CardTitle>
              <CardDescription>Tick items off as you complete them.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {openTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing outstanding. Add tasks from the Task Planner.
                </p>
              ) : (
                openTasks.slice(0, 6).map((t) => (
                  <label
                    key={t.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 text-sm hover:bg-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                      className="mt-0.5 size-4 accent-[var(--primary)]"
                    />
                    <span className="min-w-0">
                      <span className="block font-medium">{t.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {t.owner ? `${t.owner} · ` : ""}
                        {t.deadline || "No deadline specified"}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent AI activity</CardTitle>
              <CardDescription>Titles only — content stays private by default.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {activities.slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 text-sm"
                >
                  <span className="min-w-0 truncate">{a.label}</span>
                  <Badge variant="secondary" className="shrink-0 capitalize">
                    {a.kind}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <AiNotice />
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="flex items-start gap-3 pt-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
