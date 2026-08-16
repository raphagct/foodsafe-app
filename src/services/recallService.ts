import type { FdaRecallRecord, RecallSeverity } from "../types/recall";

const CACHE_KEY = "foodsafe_recall_cache_v1";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const DISMISSED_KEY = "foodsafe_dismissed_recalls_v1";

interface RecallCache {
  fetchedAt: number;
  keyword: string;
  days: number;
  recalls: FdaRecallRecord[];
}

function readCache(): RecallCache | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as RecallCache) : null;
  } catch {
    return null;
  }
}

function writeCache(cache: RecallCache) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage full or unavailable — skip caching silently
  }
}

interface FetchRecallsOptions {
  keyword?: string;
  days?: number;
  limit?: number;
  forceRefresh?: boolean;
}

interface FetchRecallsResult {
  recalls: FdaRecallRecord[];
  error: string | null;
  fromCache: boolean;
}

/**
 * Fetch recent FDA food recalls, matching an optional keyword.
 * Wraps the public openFDA food enforcement API and keeps a local
 * cache (localStorage) so the last known list is still available offline.
 */
export async function fetchRecentRecalls({
  keyword = "",
  days = 90,
  limit = 20,
  forceRefresh = false,
}: FetchRecallsOptions = {}): Promise<FetchRecallsResult> {
  const cached = readCache();
  const isFresh = !!cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS;
  const sameQuery = !!cached && cached.keyword === keyword && cached.days === days;

  if (!forceRefresh && isFresh && sameQuery && cached) {
    return { recalls: cached.recalls, error: null, fromCache: true };
  }

  const since = new Date(Date.now() - days * 86_400_000)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const searchParts = [`recall_initiation_date:[${since}+TO+99991231]`];
  if (keyword.trim()) {
    searchParts.push(`AND+reason_for_recall:"${encodeURIComponent(keyword.trim())}"`);
  }

  const url =
    `https://api.fda.gov/food/enforcement.json?search=${searchParts.join("+")}` +
    `&sort=recall_initiation_date:desc&limit=${limit}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (cached) return { recalls: cached.recalls, error: `FDA API error: ${res.status}`, fromCache: true };
      return { recalls: [], error: `FDA API error: ${res.status}`, fromCache: false };
    }
    const data = await res.json();
    const recalls: FdaRecallRecord[] = data.results ?? [];
    writeCache({ fetchedAt: Date.now(), keyword, days, recalls });
    return { recalls, error: null, fromCache: false };
  } catch (err) {
    if (cached) return { recalls: cached.recalls, error: (err as Error).message, fromCache: true };
    return { recalls: [], error: (err as Error).message, fromCache: false };
  }
}

const SEVERITY_MAP: Record<string, RecallSeverity> = {
  "Class I": { level: "HIGH", color: "#EF4444", bg: "#FEF2F2", border: "#FEE2E2" },
  "Class II": { level: "MEDIUM", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  "Class III": { level: "LOW", color: "#159947", bg: "#F0FDF4", border: "#DCFCE7" },
};

const UNKNOWN_SEVERITY: RecallSeverity = { level: "UNKNOWN", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" };

/** Map an FDA recall classification (Class I/II/III) to a UI severity. */
export function classifyRecallSeverity(fdaClass: string): RecallSeverity {
  return SEVERITY_MAP[fdaClass] ?? UNKNOWN_SEVERITY;
}

/** Recall numbers the user has dismissed from the home banner (stored locally). */
export function getDismissedRecallIds(): string[] {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function dismissRecall(recallNumber: string) {
  const current = getDismissedRecallIds();
  if (current.includes(recallNumber)) return;
  try {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify([...current, recallNumber]));
  } catch {
    // ignore
  }
}

/** Format an FDA "YYYYMMDD" date string as "YYYY-MM-DD". */
export function formatRecallDate(yyyymmdd: string | undefined): string {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd ?? "";
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}
