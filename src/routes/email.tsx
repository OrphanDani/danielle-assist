import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AiNotice, PrivacyNotice } from "@/components/AiNotice";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail, type EmailResult } from "@/lib/ai.functions";
import { getPrefs, logActivity } from "@/lib/store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — SmartWork AI" },
      {
        name: "description",
        content:
          "Turn a one-line intent into a professional, on-tone email with subject line, clear call to action and listed assumptions.",
      },
      { property: "og:title", content: "Smart Email Generator — SmartWork AI" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds, with full control over tone and length.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const SAMPLE = {
  purpose: "Ask a client for a one-week extension on the payments module release",
  keyInfo:
    "Two QA testers were on leave, regression suite is 60% complete, we do not want to ship an untested payments flow.",
  cta: "Confirm whether the new date of 19 September works for them.",
};

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [keyInfo, setKeyInfo] = useState("");
  const [cta, setCta] = useState("");
  const [audience, setAudience] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [refinement, setRefinement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmailResult | null>(null);

  const fullText = result
    ? `Subject: ${result.subject}\n\n${result.greeting}\n\n${result.body}\n\n${result.callToAction}\n\n${result.closing}`
    : "";

  async function submit(extra?: string) {
    if (!purpose.trim()) {
      setError("Describe what the email needs to achieve before generating.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await run({
        data: {
          purpose,
          keyInfo,
          cta,
          audience,
          tone,
          length,
          senderName: getPrefs().name,
          refinement: extra ?? refinement,
        },
      });
      setResult(data);
      logActivity("email", `Email: ${data.subject}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the intent — get a polished, professional email you control."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What do you need to say?</CardTitle>
            <CardDescription>
              One line is enough. The more context you add, the fewer assumptions the AI makes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Request a deadline extension from the client"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyinfo">Key information (optional)</Label>
              <Textarea
                id="keyinfo"
                rows={3}
                value={keyInfo}
                onChange={(e) => setKeyInfo(e.target.value)}
                placeholder="Facts the email must include. Anything missing will be flagged, never invented."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Audience" value={audience} onChange={setAudience} options={["Client", "Manager", "Team", "Vendor", "Customer"]} />
              <Field label="Tone" value={tone} onChange={setTone} options={["Professional", "Friendly", "Formal", "Apologetic", "Persuasive", "Direct"]} />
              <Field label="Length" value={length} onChange={setLength} options={["Short", "Medium", "Detailed"]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta">Desired next step (optional)</Label>
              <Input
                id="cta"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="e.g. Confirm the new delivery date"
              />
            </div>

            <ErrorBanner message={error} />

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => submit()} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-1 size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="mr-1 size-4" aria-hidden="true" />
                )}
                {loading ? "Generating…" : "Generate email"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPurpose(SAMPLE.purpose);
                  setKeyInfo(SAMPLE.keyInfo);
                  setCta(SAMPLE.cta);
                }}
                disabled={loading}
              >
                Load sample
              </Button>
            </div>
            <PrivacyNotice>
              Your draft stays in this browser. Only the text you enter is sent to the AI model to
              produce the email.
            </PrivacyNotice>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated email</CardTitle>
            <CardDescription>Review and edit before sending.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result ? (
              <p className="text-sm text-muted-foreground">
                Your draft will appear here, including any assumptions the AI had to make.
              </p>
            ) : (
              <>
                <div className="rounded-xl border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground">Subject</p>
                  <p className="font-semibold">{result.subject}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                    {result.greeting}
                    {"\n\n"}
                    {result.body}
                    {"\n\n"}
                    {result.callToAction}
                    {"\n\n"}
                    {result.closing}
                  </p>
                </div>

                {result.assumptions.length > 0 ? (
                  <div className="rounded-xl border border-border bg-secondary p-3">
                    <p className="text-xs font-semibold">Assumptions made</p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                      {result.assumptions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="refine">Refine this draft</Label>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      id="refine"
                      className="min-w-[200px] flex-1"
                      value={refinement}
                      onChange={(e) => setRefinement(e.target.value)}
                      placeholder="e.g. Make it shorter and warmer"
                    />
                    <Button variant="secondary" onClick={() => submit()} disabled={loading}>
                      Regenerate
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(fullText);
                    toast.success("Email copied to clipboard");
                  }}
                >
                  <Copy className="mr-1 size-4" aria-hidden="true" /> Copy email
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

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
