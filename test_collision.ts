import { validateScheduleTime, checkCollisionBetweenTwo } from './lib/collisionEngine';

console.log("=== PENGETESAN COLLISION ENGINE (Oleh: Alvin) ===\n");

// B-01: No Conflict
const resB01 = checkCollisionBetweenTwo(
  { title: "Kegiatan A", date: "2026-09-28", startTime: "08:00", endTime: "10:30" },
  { title: "Kegiatan B", date: "2026-09-28", startTime: "13:00", endTime: "15:00" }
);
console.log(`B-01 (08.00-10.30 vs 13.00-15.00): ${!resB01.isCollision ? 'PASS' : 'FAIL'}`);

// B-02: Exact Boundary -> No Conflict
const resB02 = checkCollisionBetweenTwo(
  { title: "Kegiatan A", date: "2026-09-28", startTime: "09:00", endTime: "11:30" },
  { title: "Kegiatan B", date: "2026-09-28", startTime: "11:30", endTime: "14:00" }
);
console.log(`B-02 (09.00-11.30 vs 11.30-14.00): ${!resB02.isCollision ? 'PASS' : 'FAIL'}`);

// B-03: Partial Overlap (Bentrok 60 menit)
const resB03 = checkCollisionBetweenTwo(
  { title: "Kegiatan A", date: "2026-09-28", startTime: "13:00", endTime: "15:00" },
  { title: "Kegiatan B", date: "2026-09-28", startTime: "14:00", endTime: "16:00" }
);
console.log(`B-03 (13.00-15.00 vs 14.00-16.00): ${resB03.isCollision && resB03.overlapMinutes === 60 ? 'PASS' : 'FAIL'}`);

// B-04: Containment (Bentrok 120 menit)
const resB04 = checkCollisionBetweenTwo(
  { title: "Kegiatan A", date: "2026-09-28", startTime: "09:00", endTime: "11:00" },
  { title: "Kegiatan B", date: "2026-09-28", startTime: "08:00", endTime: "11:30" }
);
console.log(`B-04 (09.00-11.00 di dalam 08.00-11.30): ${resB04.isCollision && resB04.overlapMinutes === 120 ? 'PASS' : 'FAIL'}`);

// B-05: Invalid Time Input
const isValidB05 = validateScheduleTime("15:00", "13:00");
console.log(`B-05 (Start 15.00, End 13.00): ${!isValidB05 ? 'PASS' : 'FAIL'}`);