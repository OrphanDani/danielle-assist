import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarCheck,
  History,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/insights", label: "Productivity Insights", icon: BarChart3 },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = (
    <nav aria-label="Main" className="flex flex-col gap-1 p-3">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-app-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
          <BrandMark />
          {nav}
          <div className="mt-auto p-4">
            <p className="rounded-xl bg-secondary p-3 text-xs leading-relaxed text-muted-foreground">
              AI-generated content. Always review before sending or acting on it.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
            </div>
          </header>

          {open ? (
            <div className="border-b border-border bg-sidebar lg:hidden">{nav}</div>
          ) : null}

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>

          <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground lg:px-8">
            SmartWork AI keeps your drafts in your browser by default. Nothing is stored on a
            server unless you explicitly save it.
          </footer>
        </div>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient">
        <Sparkles className="size-5 text-primary-foreground" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold">SmartWork AI</span>
        <span className="block text-xs text-muted-foreground">Productivity assistant</span>
      </span>
    </Link>
  );
}
