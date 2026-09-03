import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AiNotice, PrivacyNotice } from "@/components/AiNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_PREFS, getPrefs, savePrefs, type Prefs } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SmartWork AI" },
      {
        name: "description",
        content:
          "Set your name, working hours and whether AI-generated content is saved locally in your browser.",
      },
      { property: "og:title", content: "Settings — SmartWork AI" },
      {
        property: "og:description",
        content: "Control your defaults and how SmartWork AI handles your content.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    setPrefs(getPrefs());
  }, []);

  return (
    <AppShell title="Settings" description="Your defaults and privacy choices.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal defaults</CardTitle>
            <CardDescription>Used to personalise drafts and daily plans.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={prefs.name}
                onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wh">Working hours</Label>
              <Input
                id="wh"
                value={prefs.workingHours}
                onChange={(e) => setPrefs({ ...prefs, workingHours: e.target.value })}
              />
            </div>
            <Button
              onClick={() => {
                savePrefs(prefs);
                toast.success("Settings saved");
              }}
            >
              Save settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Privacy</CardTitle>
            <CardDescription>You decide what stays on this device.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">Save generated content locally</p>
                <p className="text-xs text-muted-foreground">
                  Off by default. When off, only short titles are recorded in your history.
                </p>
              </div>
              <Switch
                checked={prefs.saveContent}
                aria-label="Save generated content locally"
                onCheckedChange={(v) => {
                  const next = { ...prefs, saveContent: v };
                  setPrefs(next);
                  savePrefs(next);
                }}
              />
            </div>
            <PrivacyNotice>
              SmartWork AI has no user accounts and stores nothing on a server. Your text is sent to
              the AI model only when you press a generate button.
            </PrivacyNotice>
            <AiNotice>
              AI outputs are suggestions. You remain responsible for anything you send or act on.
            </AiNotice>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
