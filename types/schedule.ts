export type ScheduleCategory = "kuliah" | "organisasi" | "lainnya";
export type DayName = "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu";

export interface Schedule {
  id: string;
  userId: string;
  name: string;
  category: ScheduleCategory | string;
  day: DayName | string;
  specificDate?: string | null;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  location?: string | null;
  notes?: string | null;
  isRoutine: boolean;
  priority: "wajib" | "fleksibel" | string;
  courseCode?: string | null;
  lecturer?: string | null;
  sks?: number | null;
  role?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Conflict {
  id: string;
  userId: string;
  scheduleAId: string;
  scheduleA: Schedule;
  scheduleBId: string;
  scheduleB: Schedule;
  day: string;
  overlapStart: string;
  overlapEnd: string;
  overlapMinutes: number;
  status: "unresolved" | "resolved" | "ignored";
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConflictStats {
  total: number;
  unresolved: number;
  resolved: number;
  healthScore: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university?: string | null;
  major?: string | null;
  nim?: string | null;
  semester?: number | null;
  avatar?: string | null;
  _count?: {
    schedules: number;
    conflicts: number;
    notifications: number;
  };
}

// Backward compatibility with legacy components
export interface ScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  startTime: string;
  endTime: string;
  room: string;
  sks: number;
  type: 'Teori' | 'Praktikum' | 'Seminar';
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai' | 'Ditiadakan';
  notes?: string;
}

export interface WarningAlert {
  id: string;
  type: 'urgent' | 'info' | 'warning';
  title: string;
  message: string;
  courseName?: string;
  actionText?: string;
  timestamp: string;
}
