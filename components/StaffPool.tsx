import React from 'react';
import { Staff } from '../types';

interface StaffPoolProps {
  staffList: Staff[];
  onDragStart: (e: React.DragEvent, staffId: string) => void;
  onEdit: (staff: Staff) => void;
}

export const StaffPool: React.FC<StaffPoolProps> = ({ staffList, onDragStart, onEdit }) => {
  return (
    <div className="w-full lg:w-36 bg-white border-r border-gray-200 p-2 flex flex-col h-full overflow-y-auto shadow-sm z-10">
      <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center justify-center lg:justify-start">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="hidden lg:inline">スタッフ</span>
        <span className="lg:hidden">スタッフ一覧</span>
      </h2>
      <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            draggable
            onDragStart={(e) => onDragStart(e, staff.id)}
            onDoubleClick={() => onEdit(staff)}
            className="relative group flex flex-col lg:flex-row items-center p-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing transition-all shadow-sm hover:shadow-md"
          >
            <div className={`w-8 h-8 rounded-full ${staff.color} text-white flex items-center justify-center text-xs font-bold lg:mr-2 shrink-0`}>
              {staff.initials}
            </div>
            <div className="overflow-hidden text-center lg:text-left w-full">
              <p className="text-xs font-medium text-gray-900 truncate mt-1 lg:mt-0">{staff.name}</p>
            </div>
            
            {/* Edit Button (Visible on Hover) */}
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag start
                onEdit(staff);
              }}
              className="absolute top-1 right-1 lg:top-1/2 lg:-translate-y-1/2 lg:right-2 bg-white/80 hover:bg-white text-gray-500 hover:text-blue-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-200 hidden lg:flex"
              title="編集"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 text-[10px] text-gray-400 text-center lg:text-left">
        <p className="hidden lg:block">ドラッグ配置<br/>ダブルクリックで編集</p>
      </div>
    </div>
  );
};