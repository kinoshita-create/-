import React, { useState, useRef, useEffect } from 'react';
import { HOURS } from '../constants';
import { ModelShift } from '../types';

interface ModelShiftPatternProps {
  shifts: ModelShift[];
  onChange?: (shifts: ModelShift[]) => void;
  readOnly?: boolean;
  patternColor?: string;
}

const ROWS = [
  { id: 'h1', label: 'ホール①' },
  { id: 'h2', label: 'ホール②' },
  { id: 'h3', label: 'ホール③' },
  { id: 'h4', label: 'ホール④' },
  { id: 'k1', label: 'キッチン①' },
  { id: 'k2', label: 'キッチン②' },
  { id: 'k3', label: 'キッチン③' },
  { id: 'k4', label: 'キッチン④' },
];

export const ModelShiftPattern: React.FC<ModelShiftPatternProps> = ({ 
    shifts, 
    onChange, 
    readOnly = false,
    patternColor = 'bg-slate-400'
}) => {
  const [interaction, setInteraction] = useState<{
    type: 'create' | 'resize' | 'move';
    shiftId: string;
    initialStart: number;
    initialEnd: number;
    baseClientX: number;
    edge?: 'start' | 'end';
    anchorTime?: number;
  } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  // Calculate hours
  const getDuration = (start: number, end: number) => end - start;
  
  const getRowTotal = (rowId: string) => {
    return shifts
      .filter(s => s.rowId === rowId)
      .reduce((acc, s) => acc + getDuration(s.start, s.end), 0);
  };

  const getTotalAll = () => {
    return shifts.reduce((acc, s) => acc + getDuration(s.start, s.end), 0);
  };

  // --- Interaction Handlers ---

  const handleMouseDown = (e: React.MouseEvent, rowId: string, time: number, shift?: ModelShift, edge?: 'start' | 'end') => {
    if (readOnly || !onChange) return;
    if (e.button !== 0) return;
    
    e.preventDefault();
    
    if (shift && edge) {
      // Resize existing
      e.stopPropagation();
      setInteraction({
        type: 'resize',
        shiftId: shift.id,
        initialStart: shift.start,
        initialEnd: shift.end,
        baseClientX: e.clientX,
        edge
      });
    } else if (shift) {
      // Move existing
      e.stopPropagation();
      setInteraction({
        type: 'move',
        shiftId: shift.id,
        initialStart: shift.start,
        initialEnd: shift.end,
        baseClientX: e.clientX
      });
    } else {
      // Create new
      const newId = Math.random().toString(36).substr(2, 9);
      const newShift = { id: newId, rowId, start: time, end: time + 0.5 };
      
      // Immediate update for visual feedback
      onChange([...shifts, newShift]);

      setInteraction({
        type: 'create',
        shiftId: newId,
        initialStart: time,
        initialEnd: time + 0.5,
        anchorTime: time, 
        baseClientX: e.clientX
      });
    }
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    if (readOnly || !onChange) return;
    e.stopPropagation();
    e.preventDefault();
    onChange(shifts.filter(s => s.id !== id));
  };

  useEffect(() => {
    if (readOnly || !onChange) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interaction || !gridRef.current) return;

      const headerWidth = 160; 
      const gridRect = gridRef.current.getBoundingClientRect();
      const timeTrackWidth = gridRect.width - headerWidth;
      const totalSlots = 18 * 2; // 36 slots
      const slotWidth = timeTrackWidth / totalSlots;

      // Calculate raw hour difference based on pixels moved
      const diffPixels = e.clientX - interaction.baseClientX;
      const diffHours = Math.round(diffPixels / slotWidth * 2) / 2; // Snap to 0.5

      if (interaction.type === 'create' && interaction.anchorTime !== undefined) {
        const updatedShifts = shifts.map(s => {
          if (s.id !== interaction.shiftId) return s;
          
          const draggedTime = interaction.anchorTime! + diffHours + (diffHours >= 0 ? 0.5 : 0);
          
          let newStart = Math.min(interaction.anchorTime!, draggedTime);
          let newEnd = Math.max(interaction.anchorTime!, draggedTime);

          // Ensure at least 0.5h duration
          if (newEnd - newStart < 0.5) {
             if (diffHours < 0) newStart = newEnd - 0.5;
             else newEnd = newStart + 0.5;
          }
          
          newStart = Math.max(6, newStart);
          newEnd = Math.min(24, newEnd);

          return { ...s, start: newStart, end: newEnd };
        });
        onChange(updatedShifts);

      } else if (interaction.type === 'resize') {
        const updatedShifts = shifts.map(s => {
          if (s.id !== interaction.shiftId) return s;

          let newStart = interaction.initialStart;
          let newEnd = interaction.initialEnd;

          if (interaction.edge === 'start') {
            newStart = Math.min(Math.max(6, newStart + diffHours), s.end - 0.5);
          } else {
            newEnd = Math.max(Math.min(24, newEnd + diffHours), s.start + 0.5);
          }

          return { ...s, start: newStart, end: newEnd };
        });
        onChange(updatedShifts);

      } else if (interaction.type === 'move') {
        const updatedShifts = shifts.map(s => {
          if (s.id !== interaction.shiftId) return s;

          const duration = interaction.initialEnd - interaction.initialStart;
          let newStart = interaction.initialStart + diffHours;
          
          // Clamp
          newStart = Math.max(6, Math.min(24 - duration, newStart));
          const newEnd = newStart + duration;

          return { ...s, start: newStart, end: newEnd };
        });
        onChange(updatedShifts);
      }
    };

    const handleMouseUp = () => {
      setInteraction(null);
    };

    if (interaction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, shifts, onChange, readOnly]);


  return (
    <div className={`flex-none border-b border-gray-300 overflow-x-auto select-none relative ${readOnly ? 'bg-gray-50' : 'bg-white'}`} ref={gridRef}>
      <div className="min-w-[1400px]">
        {/* Header */}
        <div className={`grid grid-cols-[7rem_3rem_repeat(36,_minmax(0,_1fr))] border-b border-gray-300 text-[10px] ${readOnly ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
          <div className={`p-1 text-center border-r border-gray-300 sticky left-0 z-20 font-medium flex items-center justify-center ${readOnly ? 'bg-gray-100' : 'bg-gray-200'}`}>
            モデル
          </div>
          <div className={`p-1 text-center border-r border-gray-300 font-medium flex items-center justify-center sticky left-28 z-20 ${readOnly ? 'bg-gray-100' : 'bg-gray-200'}`}>
            時間
          </div>
          {HOURS.map((hour) => (
            <div key={hour} className="col-span-2 text-center border-r border-gray-300 py-1 font-medium">
              {hour}
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        {ROWS.map((row, idx) => (
          <div 
            key={row.id} 
            className={`grid grid-cols-[7rem_3rem_repeat(36,_minmax(0,_1fr))] border-b border-gray-200 h-8 relative group/row ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
          >
            {/* Row Label */}
            <div className={`sticky left-0 z-20 border-r border-gray-300 flex items-center justify-center px-2 text-[10px] font-bold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${readOnly ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
              {row.label}
            </div>

             {/* Duration Total */}
             <div className={`sticky left-28 z-20 border-r border-gray-300 flex items-center justify-center px-1 text-[10px] font-mono font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${readOnly ? 'bg-gray-50 text-gray-400' : 'bg-white text-blue-600'}`}>
              {getRowTotal(row.id).toFixed(1)}h
            </div>

            {/* Time Slots */}
            {HOURS.map((hour) => (
              <React.Fragment key={hour}>
                {/* :00 slot */}
                <div 
                  onMouseDown={(e) => handleMouseDown(e, row.id, hour)}
                  className={`border-r border-dotted ${readOnly ? 'border-gray-200 cursor-default' : 'border-gray-100 hover:bg-blue-50 cursor-crosshair'}`}
                ></div>
                {/* :30 slot */}
                <div 
                  onMouseDown={(e) => handleMouseDown(e, row.id, hour + 0.5)}
                  className={`border-r ${readOnly ? 'border-gray-200 cursor-default' : 'border-gray-300 hover:bg-blue-50 cursor-crosshair'}`}
                ></div>
              </React.Fragment>
            ))}

            {/* Shifts Overlay */}
            <div className="absolute inset-0 left-[10rem] grid grid-cols-[repeat(36,_minmax(0,_1fr))] pointer-events-none h-full">
              {shifts
                .filter(s => s.rowId === row.id)
                .map(shift => {
                  const colStart = Math.round((shift.start - 6) * 2) + 1;
                  const colSpan = Math.round((shift.end - shift.start) * 2);

                  // Determine background classes
                  // If readOnly is true, we might want to fade it out, but still show color
                  // If interactive, show hover effect.
                  // Since we use Tailwind arbitrary classes, we can rely on CSS filters for hover brightness
                  
                  const bgClass = patternColor;

                  return (
                    <div
                      key={shift.id}
                      style={{ gridColumn: `${colStart} / span ${colSpan}` }}
                      className={`relative h-full p-1 pointer-events-auto z-10 group ${readOnly ? 'opacity-70' : ''}`}
                    >
                       <div 
                         className={`w-full h-full rounded shadow-sm text-white text-[10px] flex items-center justify-center relative transition-all
                            ${bgClass}
                            ${readOnly ? 'cursor-default' : 'hover:brightness-90 cursor-grab active:cursor-grabbing'}`}
                         onMouseDown={(e) => handleMouseDown(e, row.id, 0, shift)}
                       >
                          {/* Delete Button (Only in Edit Mode) */}
                          {!readOnly && (
                            <button 
                                onMouseDown={(e) => e.stopPropagation()} 
                                onClick={(e) => handleRemove(e, shift.id)}
                                className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-20 cursor-pointer"
                            >
                                ×
                            </button>
                          )}

                          {/* Resize Handles (Only in Edit Mode) */}
                          {!readOnly && (
                            <>
                              <div 
                                className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-white/20 rounded-l"
                                onMouseDown={(e) => handleMouseDown(e, row.id, 0, shift, 'start')}
                              />
                              <div 
                                className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-white/20 rounded-r"
                                onMouseDown={(e) => handleMouseDown(e, row.id, 0, shift, 'end')}
                              />
                            </>
                          )}
                       </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Total Row */}
        <div className={`grid grid-cols-[7rem_3rem_repeat(36,_minmax(0,_1fr))] border-b border-gray-300 h-8 ${readOnly ? 'bg-gray-50' : 'bg-gray-100'}`}>
            <div className={`sticky left-0 z-20 border-r border-gray-300 flex items-center justify-center px-2 text-[10px] font-bold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${readOnly ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700'}`}>
                合計
            </div>
            <div className={`sticky left-28 z-20 border-r border-gray-300 flex items-center justify-center px-1 text-[10px] font-mono font-bold border-t-2 border-blue-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${readOnly ? 'bg-gray-50 text-gray-500' : 'bg-gray-100 text-blue-700'}`}>
                {getTotalAll().toFixed(1)}h
            </div>
            <div className="col-span-[36] bg-transparent"></div>
        </div>
      </div>

      {/* Global cursor overrides during interaction */}
      {interaction?.type === 'resize' && <div className="fixed inset-0 z-50 cursor-ew-resize" />}
      {interaction?.type === 'create' && <div className="fixed inset-0 z-50 cursor-col-resize" />}
      {interaction?.type === 'move' && <div className="fixed inset-0 z-50 cursor-grabbing" />}
    </div>
  );
};