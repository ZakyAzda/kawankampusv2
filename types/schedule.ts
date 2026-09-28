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
