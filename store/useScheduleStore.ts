"use client";

import { create } from "zustand";
import { ScheduleItem, ConflictPair, DUMMY_SCHEDULES } from "@/data/schedules";
import { detectConflicts, getConflictingIds } from "@/lib/detectConflicts";

interface ScheduleStore {
  schedules: ScheduleItem[];
  conflicts: ConflictPair[];
  conflictingIds: Set<string>;

  addSchedule: (item: Omit<ScheduleItem, "id">) => void;
  updateSchedule: (id: string, updated: Partial<ScheduleItem>) => void;
  deleteSchedule: (id: string) => void;
  getConflictById: (id: string) => ConflictPair | undefined;
}

function recompute(schedules: ScheduleItem[]) {
  const conflicts = detectConflicts(schedules);
  const conflictingIds = getConflictingIds(schedules);
  return { conflicts, conflictingIds };
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: DUMMY_SCHEDULES,
  ...recompute(DUMMY_SCHEDULES),

  addSchedule: (item) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `custom-${Date.now()}`,
    };
    const schedules = [...get().schedules, newItem];
    set({ schedules, ...recompute(schedules) });
  },

  updateSchedule: (id, updated) => {
    const schedules = get().schedules.map((s) =>
      s.id === id ? { ...s, ...updated } : s
    );
    set({ schedules, ...recompute(schedules) });
  },

  deleteSchedule: (id) => {
    const schedules = get().schedules.filter((s) => s.id !== id);
    set({ schedules, ...recompute(schedules) });
  },

  getConflictById: (id) => get().conflicts.find((c) => c.id === id),
}));
