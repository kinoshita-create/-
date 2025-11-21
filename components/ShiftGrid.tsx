import React, { useState, useRef, useEffect } from 'react';
import { HOURS, POSITIONS } from '../constants';
import { ShiftBlock, Staff, PositionType } from '../types';

interface ShiftGridProps {
  shifts: ShiftBlock[];
  staffList: Staff[];
  onDrop: (staffId: string, time: number, position: PositionType, shiftId?: string) => void;
  onRemove: (shiftId: string) => void;
  onResize: (shiftId: string, newStart: number, newEnd: number) => void;
}

export const ShiftGrid: React.FC<ShiftGridProps> = ({ shifts, staffList, onDrop, onRemove, onResize }) => {
  const [dragOverTarget, setDragOverTarget] = useState<{ time: number; position: PositionType } | null>(null);
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeState, setResizeState] = useState<{
    shiftId: string;
    initialStart: number;
    initialEnd: number;
    direction: 'start' | 'end';
    baseClientX: number;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = (hour % 1) * 60;
    return `${h}:${m === 0 ? '00' : '30'}`;
  };

  const getPositionTotalHours = (position: PositionType) => {
    return shifts
      .filter(s => s.position === position)
      .reduce((acc, s) => acc + (s.endHour - s.startHour), 0);
  };

  const handleDragOver = (e: React.DragEvent, time: number, position: PositionType) => {
    e.preventDefault();
    if (dragOverTarget?.time !== time || dragOverTarget?.position !== position) {
      setDragOverTarget({ time, position });
    }
  };

  const handleDrop = (e: React.DragEvent, time: number, position: PositionType) => {
    e.preventDefault();
    const staffId = e.dataTransfer.getData('staffId');
    const shiftId = e.dataTransfer.getData('shiftId'); // Check if it's a move operation
    
    if (staffId) {
      onDrop(staffId, time, position, shiftId || undefined);
    }
    setDragOverTarget(null);
  };

  const getPositionColor = (position: PositionType) => {
    switch (position) {
      case PositionType.HALL: return 'bg-teal-400';
      case PositionType.SALAD: return 'bg-green-400';
      case PositionType.HIBANA: return 'bg-red-400';
      case PositionType.BENTO: return 'bg-orange-400';
      case PositionType.PC_PACKING: return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  // Resize Handlers
  const startResize = (e: React.MouseEvent, shift: ShiftBlock, direction: 'start' | 'end') => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeState({
      shiftId: shift.id,
      initialStart: shift.startHour,
      initialEnd: shift.endHour,
      direction,
      baseClientX: e.clientX
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeState || !gridRef.current) return;

      // Calculate grid cell width
      // The grid now has header (112px) + total (48px) + 36 slots
      const headerWidth = 160; 
      const gridRect = gridRef.current.getBoundingClientRect();
      const timeTrackWidth = gridRect.width - headerWidth;
      const totalSlots = 18 * 2; 
      const slotWidth = timeTrackWidth / totalSlots;

      const diffPixels = e.clientX - resizeState.baseClientX;
      const diffSlots = Math.round(diffPixels / slotWidth);
      const diffHours = diffSlots * 0.5; // Each slot is 0.5 hours

      if (resizeState.direction === 'end') {
        let newEnd = resizeState.initialEnd + diffHours;
        // Clamp: Max is 24 (midnight), Min is start + 0.5
        newEnd = Math.max(resizeState.initialStart + 0.5, Math.min(24, newEnd));
        // Round to nearest 0.5 to avoid floating point errors
        newEnd = Math.round(newEnd * 2) / 2;
        onResize(resizeState.shiftId, resizeState.initialStart, newEnd);
      } else {
        let newStart = resizeState.initialStart + diffHours;
        // Clamp: Min is 6 (opening), Max is end - 0.5
        newStart = Math.max(6, Math.min(resizeState.initialEnd - 0.5, newStart));
        // Round to nearest 0.5
        newStart = Math.round(newStart * 2) / 2;
        onResize(resizeState.shiftId, newStart, resizeState.initialEnd);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeState(null);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeState, onResize]);

  return (
    <div className="flex-1 overflow-auto bg-white relative flex flex-col select-none" ref={gridRef}>
      {/* Timeline Header */}
      <div className="sticky top-0 z-30 bg-gray-100 border-b border-gray-300 min-w-[1400px]">
        <div className="grid grid-cols-[7rem_3rem_repeat(36,_minmax(0,_1fr))]">
            <div className="p-2 font-semibold text-gray-600 bg-gray-100 sticky left-0 z-40 border-r border-gray-300 text-xs flex items-center justify-center shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)]">
            ポジション
            </div>
            <div className="p-2 font-semibold text-gray-600 bg-gray-100 sticky left-28 z-40 border-r border-gray-300 text-xs flex items-center justify-center shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)]">
            時間
            </div>
            {HOURS.map((hour) => (
            <div key={hour} className="col-span-2 p-2 text-center border-r border-gray-200 text-xs font-medium text-gray-600 bg-gray-50">
                {hour}:00
            </div>
            ))}
        </div>
      </div>

      {/* Grid Body */}
      <div className="min-w-[1400px]">
        {POSITIONS.map((position) => (
          <div key={position} className="grid grid-cols-[7rem_3rem_repeat(36,_minmax(0,_1fr))] border-b border-gray-200 relative h-12">
            
            {/* Row Header */}
            <div className="p-2 font-medium text-gray-700 bg-white sticky left-0 z-20 border-r border-gray-200 flex items-center shadow-[4px_0_5px_-2px_rgba(0,0,0,0.05)]">
              <span className={`inline-block w-2 h-6 mr-2 rounded-full ${getPositionColor(position)}`}></span>
              <span className="text-xs">{position}</span>
            </div>

             {/* Total Hours */}
             <div className="sticky left-28 z-20 bg-white border-r border-gray-200 flex items-center justify-center px-1 text-xs font-mono text-gray-600 font-medium shadow-[4px_0_5px_-2px_rgba(0,0,0,0.05)]">
              {getPositionTotalHours(position).toFixed(1)}h
            </div>

            {/* Grid Cells (30 min slots) */}
            {HOURS.map((hour) => (
              <React.Fragment key={`group-${hour}`}>
                {/* :00 Slot */}
                <div
                  onDragOver={(e) => handleDragOver(e, hour, position)}
                  onDrop={(e) => handleDrop(e, hour, position)}
                  className={`border-r border-gray-200 border-dotted relative
                    ${dragOverTarget?.time === hour && dragOverTarget?.position === position ? 'bg-blue-50' : 'bg-white'}
                  `}
                >
                </div>

                {/* :30 Slot */}
                <div
                  onDragOver={(e) => handleDragOver(e, hour + 0.5, position)}
                  onDrop={(e) => handleDrop(e, hour + 0.5, position)}
                  className={`border-r border-gray-200 relative
                    ${dragOverTarget?.time === (hour + 0.5) && dragOverTarget?.position === position ? 'bg-blue-50' : 'bg-white'}
                  `}
                >
                </div>
              </React.Fragment>
            ))}

            {/* Shifts Overlay */}
            <div className="absolute inset-0 left-[10rem] grid grid-cols-[repeat(36,_minmax(0,_1fr))] pointer-events-none h-full">
                {shifts
                 .filter(s => s.position === position)
                 .map(shift => {
                    const staff = staffList.find(st => st.id === shift.staffId);
                    if (!staff) return null;
                    
                    // Calculate grid position (30 min slots)
                    const colStart = Math.round((shift.startHour - 6) * 2) + 1;
                    const duration = shift.endHour - shift.startHour;
                    const colSpan = Math.round(duration * 2);
                    
                    return (
                        <div
                            key={shift.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('staffId', shift.staffId);
                              e.dataTransfer.setData('shiftId', shift.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            style={{ 
                                gridColumnStart: colStart, 
                                gridColumnEnd: `span ${colSpan}`
                            }}
                            className="relative h-full p-1 pointer-events-auto group z-10"
                        >
                            <div className={`w-full h-full rounded-md ${staff.color} shadow-sm text-white flex flex-col items-center justify-center text-xs cursor-grab active:cursor-grabbing relative overflow-visible group-hover:shadow-md transition-all`}>
                                <span className="font-bold text-[10px] leading-tight truncate w-full text-center px-1 pointer-events-none select-none">
                                    {staff.name}
                                </span>
                                <span className="text-[9px] opacity-80 pointer-events-none select-none font-mono">
                                    {formatTime(shift.startHour)} - {formatTime(shift.endHour)}
                                </span>

                                {/* Remove Button */}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onRemove(shift.id); }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-[60]"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>

                                {/* Resize Handle Left */}
                                <div 
                                    className="absolute left-0 top-0 bottom-0 w-3 cursor-w-resize flex items-center justify-center hover:bg-black/10 rounded-l-md group/handle z-[50]"
                                    onMouseDown={(e) => startResize(e, shift, 'start')}
                                >
                                    <div className="w-1 h-4 bg-white/40 rounded-full group-hover/handle:bg-white"></div>
                                </div>

                                {/* Resize Handle Right */}
                                <div 
                                    className="absolute right-0 top-0 bottom-0 w-3 cursor-e-resize flex items-center justify-center hover:bg-black/10 rounded-r-md group/handle z-[50]"
                                    onMouseDown={(e) => startResize(e, shift, 'end')}
                                >
                                    <div className="w-1 h-4 bg-white/40 rounded-full group-hover/handle:bg-white"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State Hint */}
      {shifts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40 mt-20">
            <div className="text-center p-8">
                <p className="text-2xl font-bold text-gray-300 mb-2">シフト作成</p>
                <p className="text-sm text-gray-400">左のリストからスタッフを配置し、<br/>端をドラッグして時間を調整できます（30分単位）</p>
            </div>
        </div>
      )}
      
      {/* Resize overlay for cursor consistency */}
      {isResizing && (
          <div className="fixed inset-0 z-50 cursor-ew-resize"></div>
      )}
    </div>
  );
};