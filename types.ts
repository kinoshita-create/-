export enum PositionType {
  HALL = 'ホール',
  SALAD = 'サラダ',
  HIBANA = '火場',
  BENTO = 'お弁当',
  PC_PACKING = 'PC詰め'
}

export type EmploymentType = '社員' | 'パートナー' | 'フラワー';

export interface Staff {
  id: string;
  name: string;
  initials: string;
  employmentType: EmploymentType;
  primaryPosition: PositionType;
  color: string;
}

export interface ShiftBlock {
  id: string;
  staffId: string;
  position: PositionType;
  startHour: number; // 0-23 inclusive
  endHour: number;   // 0-24 exclusive (e.g., 17:00 means shift ends at 17:00)
  date: string; // YYYY-MM-DD
}

export interface DaySchedule {
  date: string;
  shifts: ShiftBlock[];
}

export interface DragItem {
  staffId: string;
  fromHour?: number;
  fromPosition?: PositionType;
}