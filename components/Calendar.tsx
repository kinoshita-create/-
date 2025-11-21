import React, { useState, useEffect } from 'react';
import { JAPANESE_HOLIDAYS } from '../constants';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [viewDate, setViewDate] = useState(selectedDate);
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');

  // Update the view if the selected date changes externally
  useEffect(() => {
    if (selectedDate.getMonth() !== viewDate.getMonth() || selectedDate.getFullYear() !== viewDate.getFullYear()) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  // Padding for the start of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const handlePrev = () => {
    if (viewMode === 'day') {
      setViewDate(new Date(year, month - 1, 1));
    } else {
      setViewDate(new Date(year - 1, month, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      setViewDate(new Date(year, month + 1, 1));
    } else {
      setViewDate(new Date(year + 1, month, 1));
    }
  };

  const handleMonthSelect = (m: number) => {
    setViewDate(new Date(year, m, 1));
    setViewMode('day');
  };

  const isSelected = (d: Date) => {
    return d.getDate() === selectedDate.getDate() &&
           d.getMonth() === selectedDate.getMonth() &&
           d.getFullYear() === selectedDate.getFullYear();
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };

  const getDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDayColorClass = (d: Date, isSelected: boolean) => {
    if (isSelected) return 'text-white'; // Selected state overrides colors
    
    const day = d.getDay();
    const dateKey = getDateKey(d);
    const isHoliday = !!JAPANESE_HOLIDAYS[dateKey];

    if (day === 0 || isHoliday) return 'text-red-500';
    if (day === 6) return 'text-blue-500';
    return 'text-gray-700';
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white p-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrev} 
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-gray-800 flex items-center justify-center flex-1">
          <button 
            onClick={() => setViewMode(viewMode === 'day' ? 'month' : 'day')}
            className="px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {viewMode === 'day' ? `${year}年 ${month + 1}月` : `${year}年`}
          </button>
        </h2>

        <button 
          onClick={handleNext} 
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {viewMode === 'day' ? (
        <>
          {/* Days Grid */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day, index) => (
              <div 
                key={day} 
                className={`text-center text-xs font-bold py-1
                  ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-400'}`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="h-10 md:h-12" />;
              
              const selected = isSelected(date);
              const today = isToday(date);
              const colorClass = getDayColorClass(date, selected);
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => onDateSelect(date)}
                  className={`
                    h-10 md:h-12 rounded-lg flex flex-col items-center justify-center relative transition-all duration-200 text-sm font-medium
                    ${selected 
                      ? 'bg-blue-600 shadow-md scale-105 z-10' 
                      : 'hover:bg-gray-100 hover:text-blue-600'
                    }
                    ${today && !selected ? 'bg-blue-50 font-bold ring-1 ring-blue-200' : ''}
                    ${colorClass}
                  `}
                >
                  <span>{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* Month Selection Grid */
        <div className="grid grid-cols-3 gap-4 py-4">
          {Array.from({ length: 12 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleMonthSelect(i)}
              className={`
                py-4 rounded-xl text-sm font-bold transition-all
                ${i === month 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }
              `}
            >
              {i + 1}月
            </button>
          ))}
        </div>
      )}
    </div>
  );
};