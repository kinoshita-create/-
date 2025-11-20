import React, { useState, useEffect } from 'react';
import { Staff, PositionType, EmploymentType } from '../types';
import { POSITIONS } from '../constants';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onSave: (updatedStaff: Staff) => void;
}

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500',
  'bg-green-500', 'bg-teal-500', 'bg-cyan-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-purple-500',
  'bg-pink-500', 'bg-slate-500'
];

export const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose, staff, onSave }) => {
  const [formData, setFormData] = useState<Partial<Staff>>({});

  useEffect(() => {
    if (staff) {
      setFormData({ ...staff });
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.initials && formData.primaryPosition && formData.color && formData.employmentType) {
      onSave(formData as Staff);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">スタッフ編集</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.name || ''}
              onChange={e => setFormData({ 
                ...formData, 
                name: e.target.value,
                initials: e.target.value.charAt(0) // Auto-update initials
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">雇用形態</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.employmentType || 'パートナー'}
                onChange={e => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
              >
                <option value="社員">社員</option>
                <option value="パートナー">パートナー</option>
                <option value="フラワー">フラワー</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">主なポジション</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.primaryPosition || ''}
                onChange={e => setFormData({ ...formData, primaryPosition: e.target.value as PositionType })}
              >
                {POSITIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">カラー</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(colorClass => (
                <button
                  key={colorClass}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: colorClass })}
                  className={`w-8 h-8 rounded-full ${colorClass} transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ${formData.color === colorClass ? 'ring-gray-400 scale-110' : 'ring-transparent'}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};