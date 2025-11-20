import React, { useState, useCallback } from 'react';
import { MOCK_STAFF } from './constants';
import { ShiftBlock, PositionType, Staff } from './types';
import { Header } from './components/Header';
import { StaffPool } from './components/StaffPool';
import { ShiftGrid } from './components/ShiftGrid';
import { ModelShiftPattern } from './components/ModelShiftPattern';
import { getShiftAdvice } from './services/geminiService';
import { AdviceModal } from './components/AdviceModal';
import { StaffModal } from './components/StaffModal';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shifts, setShifts] = useState<ShiftBlock[]>([]);
  
  // Staff Management State
  const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // AI Advice State
  const [loadingAi, setLoadingAi] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);

  // Date formatting for easy comparison/key usage
  const dateKey = currentDate.toISOString().split('T')[0];

  const filteredShifts = shifts.filter(s => s.date === dateKey);

  const handleDragStart = (e: React.DragEvent, staffId: string) => {
    e.dataTransfer.setData('staffId', staffId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = useCallback((staffId: string, time: number, position: PositionType, shiftId?: string) => {
    setShifts(prev => {
      // --- MOVE EXISTING SHIFT ---
      if (shiftId) {
        const existingShift = prev.find(s => s.id === shiftId);
        if (!existingShift) return prev;

        const duration = existingShift.endHour - existingShift.startHour;
        let newStart = time;
        let newEnd = time + duration;

        // Clamp to operating hours (6 to 24 max)
        if (newEnd > 24) {
          newEnd = 24;
          newStart = Math.max(6, 24 - duration);
        }

        // Update the shift
        return prev.map(s => {
          if (s.id === shiftId) {
            return {
              ...s,
              position,
              startHour: newStart,
              endHour: newEnd
            };
          }
          return s;
        });
      }

      // --- CREATE NEW SHIFT ---
      // Default 1 hour duration, but starts at the dropped 30-min slot
      const newStart = time;
      const newEnd = Math.min(24, time + 1);

      // Check overlap logic (simplified)
      const exists = prev.some(
        s => s.date === dateKey && 
             s.position === position && 
             s.staffId === staffId &&
             // Check overlap
             Math.max(s.startHour, newStart) < Math.min(s.endHour, newEnd)
      );

      if (exists) return prev;

      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        staffId,
        position,
        startHour: newStart,
        endHour: newEnd,
        date: dateKey
      }];
    });
  }, [dateKey]);

  const handleResizeShift = (shiftId: string, newStart: number, newEnd: number) => {
    setShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        return { ...s, startHour: newStart, endHour: newEnd };
      }
      return s;
    }));
  };

  const handleRemoveShift = (shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));
  };

  // --- Staff Edit Handlers ---
  const handleEditStaff = (staff: Staff) => {
    setEditingStaff(staff);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (updatedStaff: Staff) => {
    setStaffList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  };

  // --- AI Advice ---
  const handleAiAdvice = async () => {
    setLoadingAi(true);
    const adviceText = await getShiftAdvice(dateKey, filteredShifts, staffList);
    setAdvice(adviceText);
    setLoadingAi(false);
    setIsAdviceModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-800 font-sans overflow-hidden">
      <Header 
        currentDate={currentDate} 
        onDateChange={setCurrentDate} 
        onAiAdvice={handleAiAdvice}
        loadingAi={loadingAi}
      />
      
      {/* Model Shift Pattern (Replaces Calendar) */}
      <ModelShiftPattern />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <StaffPool 
          staffList={staffList} 
          onDragStart={handleDragStart}
          onEdit={handleEditStaff}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden shadow-inner bg-gray-100">
           {/* Controls Bar */}
           <div className="bg-white px-4 py-2 border-b border-gray-200 flex justify-between items-center text-xs text-gray-500 shrink-0">
             <span className="font-bold text-gray-700">シフト表</span>
             <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <span className="flex items-center shrink-0"><span className="w-2 h-2 bg-teal-400 rounded-full mr-1"></span>ホール</span>
                <span className="flex items-center shrink-0"><span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>サラダ</span>
                <span className="flex items-center shrink-0"><span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>火場</span>
                <span className="flex items-center shrink-0"><span className="w-2 h-2 bg-orange-400 rounded-full mr-1"></span>お弁当</span>
                <span className="flex items-center shrink-0"><span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>PC詰め</span>
             </div>
           </div>
           
           <ShiftGrid 
             shifts={filteredShifts} 
             staffList={staffList}
             onDrop={handleDrop}
             onRemove={handleRemoveShift}
             onResize={handleResizeShift}
           />
        </div>
      </div>

      <AdviceModal 
        isOpen={isAdviceModalOpen} 
        onClose={() => setIsAdviceModalOpen(false)} 
        advice={advice || ""} 
      />

      <StaffModal 
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staff={editingStaff}
        onSave={handleSaveStaff}
      />
    </div>
  );
};

export default App;