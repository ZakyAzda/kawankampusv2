import { ScheduleItem, ConflictPair } from "@/data/schedules";

/** Convert "HH:MM" to total minutes since midnight */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Returns true if two time ranges overlap */
function hasOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const sA = toMinutes(startA);
  const eA = toMinutes(endA);
  const sB = toMinutes(startB);
  const eB = toMinutes(endB);
  return sA < eB && eA > sB;
}

/** Compute the overlap window between two time ranges */
function getOverlapWindow(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): { start: string; end: string } {
  const overlapStart = Math.max(toMinutes(startA), toMinutes(startB));
  const overlapEnd   = Math.min(toMinutes(endA),   toMinutes(endB));
  const fmt = (mins: number) =>
    `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  return { start: fmt(overlapStart), end: fmt(overlapEnd) };
}

/**
 * Determine severity of a conflict:
 * - tinggi  : both are "kuliah" or one is "wajib" priority
 * - sedang  : one is kuliah, one is organisasi
 * - rendah  : both are "lainnya" or "fleksibel"
 */
function getSeverity(
  a: ScheduleItem,
  b: ScheduleItem
): ConflictPair["severity"] {
  const bothKuliah = a.category === "kuliah" && b.category === "kuliah";
  const oneWajib =
    a.priority === "wajib" || b.priority === "wajib";
  if (bothKuliah || (oneWajib && (a.category === "kuliah" || b.category === "kuliah"))) {
    return "tinggi";
  }
  if (a.category === "organisasi" || b.category === "organisasi") {
    return "sedang";
  }
  return "rendah";
}

/** Main function: detect all conflicts in a schedule list */
export function detectConflicts(schedules: ScheduleItem[]): ConflictPair[] {
  const conflicts: ConflictPair[] = [];

  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      const a = schedules[i];
      const b = schedules[j];

      if (a.day !== b.day) continue;

      if (hasOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
        const { start, end } = getOverlapWindow(
          a.startTime,
          a.endTime,
          b.startTime,
          b.endTime
        );
        conflicts.push({
          id: `conflict-${a.id}-${b.id}`,
          scheduleA: a,
          scheduleB: b,
          day: a.day,
          overlapStart: start,
          overlapEnd: end,
          severity: getSeverity(a, b),
        });
      }
    }
  }

  return conflicts;
}

/** Get conflicts involving a specific schedule id */
export function getConflictsForSchedule(
  schedules: ScheduleItem[],
  id: string
): ConflictPair[] {
  return detectConflicts(schedules).filter(
    (c) => c.scheduleA.id === id || c.scheduleB.id === id
  );
}

/** Get schedule IDs that are in conflict */
export function getConflictingIds(schedules: ScheduleItem[]): Set<string> {
  const ids = new Set<string>();
  detectConflicts(schedules).forEach((c) => {
    ids.add(c.scheduleA.id);
    ids.add(c.scheduleB.id);
  });
  return ids;
}
