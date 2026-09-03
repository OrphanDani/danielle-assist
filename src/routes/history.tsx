import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { PrivacyNotice } from "@/components/AiNotice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, useStoreVersion } from "@/lib/format";
import { clearActivities, deleteActivity, getActivities, type Activity } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Activity History — SmartWork AI" },
      {
        name: "description",
        content:
          "Review every AI-assisted email, meeting summary and plan created in this browser, and delete anything you no longer need.",
      },
      { property: "og:title", content: "Activity History — SmartWork AI" },
      {
        property: "og:description",
        content: "A private, local log of your AI activity with one-click deletion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const version = useStoreVersion();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(getActivities());
  }, [version]);

  return (
    <AppShell title="History" description="Everything the assistant has helped you with.">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
          <CardDescription>
            Stored locally in this browser. Content is only kept if you enabled saving in Settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm"
              >
                <Badge variant="secondary" className="shrink-0 capitalize">
                  {a.kind}
                </Badge>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{a.label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {formatDate(a.createdAt)} · ~{a.minutesSaved} min saved (estimate)
                  </span>
                  {a.content ? (
                    <span className="mt-2 block whitespace-pre-wrap rounded-lg bg-secondary p-2 text-xs">
                      {a.content}
                    </span>
                  ) : null}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${a.label}`}
                  onClick={() => deleteActivity(a.id)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))
          )}

          <div className="pt-2">
            <Button variant="outline" onClick={clearActivities}>
              Clear all history
            </Button>
          </div>

          <PrivacyNotice>
            Clearing history removes these records from your browser permanently.
          </PrivacyNotice>
        </CardContent>
      </Card>
    </AppShell>
  );
}
