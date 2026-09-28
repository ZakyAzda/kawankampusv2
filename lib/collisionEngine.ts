/**
 * Modul Collision Engine - KawanKampus MVP
 * Dikerjakan oleh: Alvin (Tim B)
 */

export interface Schedule {
  id?: string;
  title: string;
  date: string; // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
}

export interface CollisionResult {
  isCollision: boolean;
  activityA?: string;
  activityB?: string;
  overlapMinutes?: number;
  formattedOverlap?: string;
}

// Helper: Ubah jam "HH:mm" menjadi total menit
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper: Format durasi menit ke kalimat deskriptif
export function minutesToHoursMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0 && mins > 0) return `${hours} jam ${mins} menit`;
  if (hours > 0) return `${hours} jam`;
  return `${mins} menit`;
}

/**
 * Validasi Input Waktu (P0): Jam Selesai wajib > Jam Mulai pada hari yang sama
 */
export function validateScheduleTime(start: string, end: string): boolean {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  return endMin > startMin;
}

/**
 * Deteksi bentrok antara dua jadwal (P0)
 */
export function checkCollisionBetweenTwo(
  scheduleA: Schedule,
  scheduleB: Schedule
): CollisionResult {
  if (scheduleA.date !== scheduleB.date) {
    return { isCollision: false };
  }

  const startA = timeToMinutes(scheduleA.startTime);
  const endA = timeToMinutes(scheduleA.endTime);
  const startB = timeToMinutes(scheduleB.startTime);
  const endB = timeToMinutes(scheduleB.endTime);

  // Aturan P0: startA < endB DAN endA > startB
  const isCollision = startA < endB && endA > startB;

  if (!isCollision) {
    return { isCollision: false };
  }

  const overlapStart = Math.max(startA, startB);
  const overlapEnd = Math.min(endA, endB);
  const overlapMinutes = overlapEnd - overlapStart;

  return {
    isCollision: true,
    activityA: scheduleA.title,
    activityB: scheduleB.title,
    overlapMinutes,
    formattedOverlap: minutesToHoursMinutes(overlapMinutes),
  };
}

/**
 * Memeriksa seluruh jadwal untuk menemukan semua konflik
 */
export function detectAllCollisions(schedules: Schedule[]): CollisionResult[] {
  const collisions: CollisionResult[] = [];

  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      const result = checkCollisionBetweenTwo(schedules[i], schedules[j]);
      if (result.isCollision) {
        collisions.push(result);
      }
    }
  }

  return collisions;
}