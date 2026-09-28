export interface ScheduleItem {
  id: string;
  name: string;
  category: "kuliah" | "organisasi" | "lainnya";
  day: "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu";
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  location: string;
  lecturer?: string;
  role?: string;
  notes?: string;
  priority?: "wajib" | "fleksibel";
  isRoutine: boolean;
}

export interface ConflictPair {
  id: string;
  scheduleA: ScheduleItem;
  scheduleB: ScheduleItem;
  day: string;
  overlapStart: string;
  overlapEnd: string;
  severity: "tinggi" | "sedang" | "rendah";
}

export const DUMMY_SCHEDULES: ScheduleItem[] = [
  {
    id: "1",
    name: "Pemrograman Web Lanjut",
    category: "kuliah",
    day: "kamis",
    startTime: "08:00",
    endTime: "10:30",
    location: "Lab Komputer 3",
    lecturer: "Dr. Hendra, S.T.",
    notes: "",
    priority: "wajib",
    isRoutine: true,
  },
  {
    id: "2",
    name: "Kecerdasan Buatan",
    category: "kuliah",
    day: "kamis",
    startTime: "13:00",
    endTime: "15:00",
    location: "Gedung B201",
    lecturer: "Dr. Ir. Hendra, M.T.",
    notes: "Presensi minimal 75%",
    priority: "wajib",
    isRoutine: true,
  },
  {
    id: "3",
    name: "Rapat Panitia Dies Natalis",
    category: "organisasi",
    day: "kamis",
    startTime: "14:00",
    endTime: "16:00",
    location: "Gedung PKM Lt. 2",
    role: "Ketua Divisi Acara",
    notes: "Membahas rundown acara utama",
    priority: "fleksibel",
    isRoutine: false,
  },
  {
    id: "4",
    name: "Istirahat & Sholat Dzuhur",
    category: "lainnya",
    day: "kamis",
    startTime: "11:00",
    endTime: "12:30",
    location: "Musholla Al-Ikhlas Lt. 1",
    isRoutine: true,
  },
  {
    id: "5",
    name: "Belajar Kelompok Algoritma",
    category: "lainnya",
    day: "kamis",
    startTime: "16:30",
    endTime: "18:00",
    location: "Perpustakaan Pusat Lantai 2",
    isRoutine: false,
  },
  {
    id: "6",
    name: "Kalkulus Multivariabel",
    category: "kuliah",
    day: "senin",
    startTime: "08:00",
    endTime: "10:30",
    location: "Gedung D302",
    priority: "wajib",
    isRoutine: true,
  },
  {
    id: "7",
    name: "Praktikum Fisika Dasar",
    category: "kuliah",
    day: "senin",
    startTime: "13:00",
    endTime: "15:00",
    location: "Lab Fisika Terpadu",
    priority: "wajib",
    isRoutine: true,
  },
  {
    id: "8",
    name: "Bahasa Inggris Teknis",
    category: "kuliah",
    day: "selasa",
    startTime: "10:00",
    endTime: "12:00",
    location: "Ruang Rektorat Lt. 2",
    priority: "wajib",
    isRoutine: true,
  },
  {
    id: "9",
    name: "Struktur Data & Algoritma",
    category: "kuliah",
    day: "rabu",
    startTime: "09:00",
    endTime: "11:30",
    location: "Lab Komputer A",
    priority: "wajib",
    isRoutine: true,
  },
  {
    id: "10",
    name: "Olahraga Futsal Prodi",
    category: "lainnya",
    day: "rabu",
    startTime: "11:00",
    endTime: "13:00",
    location: "Gelanggang Remaja",
    isRoutine: false,
  },
  {
    id: "11",
    name: "Seminar Kewirausahaan",
    category: "kuliah",
    day: "jumat",
    startTime: "09:00",
    endTime: "11:00",
    location: "Auditorium Utama",
    priority: "wajib",
    isRoutine: false,
  },
  {
    id: "12",
    name: "Briefing Divisi Humas",
    category: "organisasi",
    day: "jumat",
    startTime: "08:00",
    endTime: "11:30",
    location: "Meeting Room B",
    role: "Anggota Humas",
    priority: "fleksibel",
    isRoutine: false,
  },
  {
    id: "13",
    name: "Diskusi Buku Komunitas",
    category: "lainnya",
    day: "sabtu",
    startTime: "19:00",
    endTime: "21:00",
    location: "Kopi Titik Temu",
    isRoutine: false,
  },
];

export const DUMMY_USER = {
  name: "User",
  nim: "2106728192",
  university: "Universitas Indonesia",
  faculty: "Ilmu Komputer",
  semester: 6,
  angkatan: 2022,
};
