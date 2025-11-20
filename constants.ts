import { Staff, PositionType } from './types';

export const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 to 23:00

export const POSITIONS = [
  PositionType.HALL,
  PositionType.SALAD,
  PositionType.HIBANA,
  PositionType.BENTO,
  PositionType.PC_PACKING,
];

export const MOCK_STAFF: Staff[] = [
  { id: 's1', name: '田中 一郎', initials: '田', employmentType: '社員', primaryPosition: PositionType.HIBANA, color: 'bg-red-500' },
  { id: 's2', name: '佐藤 花子', initials: '佐', employmentType: 'パートナー', primaryPosition: PositionType.SALAD, color: 'bg-green-500' },
  { id: 's3', name: '鈴木 健', initials: '鈴', employmentType: 'パートナー', primaryPosition: PositionType.BENTO, color: 'bg-orange-500' },
  { id: 's4', name: '高橋 優', initials: '高', employmentType: '社員', primaryPosition: PositionType.HALL, color: 'bg-teal-500' },
  { id: 's5', name: '伊藤 舞', initials: '伊', employmentType: 'フラワー', primaryPosition: PositionType.PC_PACKING, color: 'bg-blue-500' },
  { id: 's6', name: '渡辺 翔', initials: '渡', employmentType: 'パートナー', primaryPosition: PositionType.HALL, color: 'bg-teal-600' },
  { id: 's7', name: '山本 玲奈', initials: '山', employmentType: 'パートナー', primaryPosition: PositionType.SALAD, color: 'bg-green-600' },
];