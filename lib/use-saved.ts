"use client";
import { useMemo, useSyncExternalStore } from "react";
import { getSavedRaw, getServerSaved, parseSaved, subscribeSaved, type SavedItem } from "@/lib/saved";

export function useSaved(): SavedItem[] {
  const raw = useSyncExternalStore(subscribeSaved, getSavedRaw, getServerSaved);
  return useMemo(() => parseSaved(raw), [raw]);
}
