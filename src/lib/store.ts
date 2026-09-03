/**
 * Local-only usage store. Nothing leaves the browser: raw emails, notes and
 * task descriptions are never persisted unless the user explicitly saves an item.
 */
export type ActivityKind = "email" | "meeting" | "planner";

export type Activity = {
  id: string;
  kind: ActivityKind;
  label: string;
  createdAt: string;
  minutesSaved: number;
  /** Only present when the user explicitly chose to save the content. */
  content?: string;
};

export type TaskItem = {
  id: string;
  title: string;
  owner?: string;
  deadline?: string;
  done: boolean;
  source: "planner" | "meeting" | "manual";
};

const ACTIVITY_KEY = "smartwork.activities.v1";
const TASK_KEY = "smartwork.tasks.v1";
const PREF_KEY = "smartwork.prefs.v1";

/** Estimated manual minutes per assisted action (clearly labelled as estimates in UI). */
export const MINUTES_SAVED: Record<ActivityKind, number> = {
  email: 12,
  meeting: 25,
  planner: 18,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — metrics are non-critical */
  }
  window.dispatchEvent(new Event("smartwork:update"));
}

export const uid = () => Math.random().toString(36).slice(2, 10);

/* -------------------------------- Activities ------------------------------- */

export function getActivities(): Activity[] {
  const stored = read<Activity[]>(ACTIVITY_KEY, []);
  return stored.length ? stored : DEMO_ACTIVITIES;
}

export function logActivity(kind: ActivityKind, label: string, content?: string) {
  const current = read<Activity[]>(ACTIVITY_KEY, DEMO_ACTIVITIES);
  const next: Activity[] = [
    {
      id: uid(),
      kind,
      label,
      createdAt: new Date().toISOString(),
      minutesSaved: MINUTES_SAVED[kind],
      content,
    },
    ...current,
  ].slice(0, 200);
  write(ACTIVITY_KEY, next);
}

export function deleteActivity(id: string) {
  write(
    ACTIVITY_KEY,
    read<Activity[]>(ACTIVITY_KEY, DEMO_ACTIVITIES).filter((a) => a.id !== id),
  );
}

export function clearActivities() {
  write(ACTIVITY_KEY, []);
}

/* ---------------------------------- Tasks --------------------------------- */

export function getTasks(): TaskItem[] {
  const stored = read<TaskItem[] | null>(TASK_KEY, null);
  return stored ?? DEMO_TASKS;
}

export function saveTasks(tasks: TaskItem[]) {
  write(TASK_KEY, tasks);
}

export function addTasks(tasks: Omit<TaskItem, "id" | "done">[]) {
  const current = getTasks();
  saveTasks([...tasks.map((t) => ({ ...t, id: uid(), done: false })), ...current]);
}

export function toggleTask(id: string) {
  saveTasks(getTasks().map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
}

export function removeTask(id: string) {
  saveTasks(getTasks().filter((t) => t.id !== id));
}

/* ------------------------------- Preferences ------------------------------ */

export type Prefs = {
  name: string;
  workingHours: string;
  saveContent: boolean;
};

export const DEFAULT_PREFS: Prefs = {
  name: "Danielle",
  workingHours: "08:30–17:00, lunch 13:00–13:30",
  saveContent: false,
};

export function getPrefs(): Prefs {
  return { ...DEFAULT_PREFS, ...read<Partial<Prefs>>(PREF_KEY, {}) };
}

export function savePrefs(prefs: Prefs) {
  write(PREF_KEY, prefs);
}

/* ------------------------------- Demo content ------------------------------ */

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const DEMO_ACTIVITIES: Activity[] = [
  { id: "d1", kind: "email", label: "Deadline extension request — Client", createdAt: daysAgo(0), minutesSaved: 12 },
  { id: "d2", kind: "meeting", label: "Q3 delivery review summary", createdAt: daysAgo(1), minutesSaved: 25 },
  { id: "d3", kind: "planner", label: "Weekly plan — 12 tasks", createdAt: daysAgo(1), minutesSaved: 18 },
  { id: "d4", kind: "email", label: "Follow-up: invoice approval", createdAt: daysAgo(2), minutesSaved: 12 },
  { id: "d5", kind: "meeting", label: "Onboarding kickoff notes", createdAt: daysAgo(3), minutesSaved: 25 },
  { id: "d6", kind: "email", label: "Team update — sprint outcomes", createdAt: daysAgo(4), minutesSaved: 12 },
  { id: "d7", kind: "planner", label: "Daily plan — deep work focus", createdAt: daysAgo(5), minutesSaved: 18 },
  { id: "d8", kind: "email", label: "Apology for delayed report", createdAt: daysAgo(6), minutesSaved: 12 },
];

export const DEMO_TASKS: TaskItem[] = [
  { id: "t1", title: "Finalise client proposal", owner: "Me", deadline: "Today 16:00", done: false, source: "planner" },
  { id: "t2", title: "Prepare QA report", owner: "Sarah", deadline: "Friday", done: false, source: "meeting" },
  { id: "t3", title: "Contact client about scope change", owner: "John", deadline: "Monday", done: false, source: "meeting" },
  { id: "t4", title: "Review sprint backlog", owner: "Me", deadline: "Tomorrow", done: true, source: "manual" },
  { id: "t5", title: "Approve design handover", owner: "Me", deadline: "Wednesday", done: false, source: "planner" },
];

export const SAMPLE_MEETING_NOTES = `Weekly delivery sync — attendees: Sarah, John, Priya, Me
- Discussed the QA backlog; testing on the payments module is behind because two testers were on leave.
- Sarah said the regression suite is 60% complete.
- We agreed to request a one-week extension from the client before committing to a new release date.
- John will contact the client on Monday to raise the extension.
- Sarah will prepare the QA status report by Friday.
- Priya raised a concern about the third-party invoicing API returning timeouts; no owner assigned yet.
- Open: do we still ship the reporting dashboard in this release? Not decided.
- Budget impact of the extension was mentioned but no numbers were given.`;

export const SAMPLE_TASKS = `1. Finalise client proposal — deadline today 16:00, ~90 min, high importance, urgent
2. Prepare QA status report — deadline Friday, ~60 min, high importance, not urgent
3. Reply to 12 outstanding emails — ~40 min, low importance, urgent
4. Team stand-up — fixed 09:30, 15 min
5. Review design handover — deadline Wednesday, ~45 min, medium importance
6. Update project risk register — ~30 min, important, not urgent`;
