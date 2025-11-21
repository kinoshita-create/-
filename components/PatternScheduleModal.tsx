import React, { useState } from 'react';
import { ModelPattern, PatternSchedule } from '../types';
import { JAPANESE_HOLIDAYS } from '../constants';

interface PatternScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  patterns: ModelPattern[];
  schedule: PatternSchedule;
  onUpdateSchedule: (schedule: PatternSchedule) => void;
}

export const PatternScheduleModal: React.FC<PatternScheduleModalProps> = ({
  isOpen,
  onClose,
  onBack,
  patterns,
  schedule,
  onUpdateSchedule,
}) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);

  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const getDateKey = (date: Date) => {
    // Format as YYYY-MM-DD locally to match App.tsx key format
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const patternId = e.dataTransfer.getData('patternId');
    if (!patternId) return;

    const dateKey = getDateKey(date);
    onUpdateSchedule({
      ...schedule,
      [dateKey]: patternId,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeAssignment = (e: React.MouseEvent, date: Date) => {
    e.stopPropagation();
    const dateKey = getDateKey(date);
    const newSchedule = { ...schedule };
    delete newSchedule[dateKey];
    onUpdateSchedule(newSchedule);
  };

  const handleSave = () => {
    alert("保存しました");
  };

  const handleClearMonth = () => {
    if (window.confirm(`${year}年${month + 1}月の設定をすべてクリアしますか？`)) {
        const newSchedule = { ...schedule };
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dateKey = getDateKey(date);
            delete newSchedule[dateKey];
        }
        onUpdateSchedule(newSchedule);
    }
  };

  const handleBulkApply = (type: 'weekday' | 'weekend') => {
    if (!selectedPatternId) return;

    const newSchedule = { ...schedule };
    
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateKey = getDateKey(date);
        const day = date.getDay();
        const isHoliday = !!JAPANESE_HOLIDAYS[dateKey];
        
        let shouldApply = false;
        if (type === 'weekday') {
             // Mon(1) to Fri(5) AND not holiday
             if (day >= 1 && day <= 5 && !isHoliday) {
                 shouldApply = true;
             }
        } else {
             // Sun(0) or Sat(6) OR Holiday
             if (day === 0 || day === 6 || isHoliday) {
                 shouldApply = true;
             }
        }

        if (shouldApply) {
            newSchedule[dateKey] = selectedPatternId;
        }
    }
    onUpdateSchedule(newSchedule);
  };

  const selectedPattern = patterns.find(p => p.id === selectedPatternId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            パターン適用スケジュール
          </h3>
          <div className="flex items-center space-x-4">
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar: Draggable Patterns */}
          <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col p-4">
            <div className="flex-1 overflow-y-auto">
                <h4 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">利用可能なパターン</h4>
                <div className="space-y-2">
                {patterns.map((pattern) => (
                    <div
                    key={pattern.id}
                    draggable
                    onClick={() => setSelectedPatternId(pattern.id)}
                    onDragStart={(e) => {
                        setSelectedPatternId(pattern.id);
                        e.dataTransfer.setData('patternId', pattern.id);
                        e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className={`border p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-all
                        ${selectedPatternId === pattern.id 
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-100' 
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }
                    `}
                    >
                    <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${pattern.color || 'bg-blue-500'}`}></div>
                        <span className="font-medium text-gray-800 text-sm">{pattern.name}</span>
                    </div>
                    <div className={`text-xs mt-1 ml-4 ${selectedPatternId === pattern.id ? 'text-blue-500' : 'text-gray-400'}`}>
                        {selectedPatternId === pattern.id ? '選択中' : 'ドラッグ または クリック'}
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Bulk Apply Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center">
                    <span>一括適用</span>
                    {selectedPattern && (
                        <span className="ml-auto text-[10px] font-normal bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                            {selectedPattern.name}
                        </span>
                    )}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleBulkApply('weekday')}
                        disabled={!selectedPatternId}
                        className="px-2 py-2 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="月曜～金曜（祝日除く）に適用"
                    >
                        平日に適用
                    </button>
                    <button
                        onClick={() => handleBulkApply('weekend')}
                        disabled={!selectedPatternId}
                        className="px-2 py-2 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="土日および祝日に適用"
                    >
                        土日祝に適用
                    </button>
                </div>
            </div>
          </div>

          {/* Main: Calendar */}
          <div className="flex-1 flex flex-col bg-white p-4 overflow-hidden">
            {/* Calendar Navigation & Save Button */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {year}年 {month + 1}月
                  </h2>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                  >
                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     保存
                  </button>
                  <button 
                    onClick={handleClearMonth}
                    className="px-4 py-1.5 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm flex items-center"
                    title="この月の設定をすべてクリア"
                  >
                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     クリア
                  </button>
              </div>
              <div className="flex space-x-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 shrink-0">
              {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
                <div key={d} className={`text-center py-2 text-sm font-bold ${i===0 ? 'text-red-500' : i===6 ? 'text-blue-500' : 'text-gray-500'}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 border-l border-gray-200">
              {days.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="bg-gray-50 border-b border-r border-gray-200"></div>;
                }

                const dateKey = getDateKey(date);
                const patternId = schedule[dateKey];
                const pattern = patterns.find(p => p.id === patternId);
                const isToday = new Date().toDateString() === date.toDateString();
                const day = date.getDay();
                const isHoliday = !!JAPANESE_HOLIDAYS[dateKey];
                
                // Weekend/Holiday styling for date number
                let dateNumColor = 'text-gray-700';
                if (day === 0 || isHoliday) dateNumColor = 'text-red-500';
                else if (day === 6) dateNumColor = 'text-blue-500';
                if (isToday) dateNumColor = 'bg-blue-600 text-white';

                return (
                  <div
                    key={dateKey}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, date)}
                    className={`border-b border-r border-gray-200 p-2 relative transition-colors
                      ${isToday ? 'bg-blue-50/30' : 'bg-white'}
                      hover:bg-gray-50
                    `}
                  >
                    <span className={`text-sm font-medium inline-block w-6 h-6 text-center leading-6 rounded-full ${dateNumColor}`}>
                      {date.getDate()}
                    </span>
                    {isHoliday && <span className="ml-1 text-[10px] text-red-500 font-medium truncate block">{JAPANESE_HOLIDAYS[dateKey]}</span>}

                    {pattern ? (
                      <div className={`mt-2 text-white text-xs p-2 rounded shadow-sm group relative ${pattern.color || 'bg-blue-500'}`}>
                        <span className="font-bold block truncate">{pattern.name}</span>
                        <button 
                          onClick={(e) => removeAssignment(e, date)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 h-8 border-2 border-dashed border-gray-100 rounded flex items-center justify-center text-[10px] text-gray-300 select-none">
                        なし
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 flex justify-end border-t border-gray-200 shrink-0">
           <button 
             onClick={onBack || onClose} 
             className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium shadow-sm"
           >
             戻る
           </button>
        </div>
      </div>
    </div>
  );
};