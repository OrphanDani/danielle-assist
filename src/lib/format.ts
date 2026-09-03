import { useEffect, useState } from "react";

export function formatMinutes(mins: number) {
  if (!mins) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Re-renders consumers whenever the local store changes. */
export function useStoreVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener("smartwork:update", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("smartwork:update", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
  return version;
}
