import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { JAPANESE_HOLIDAYS } from '../constants';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAiAdvice: () => void;
  loadingAi: boolean;
  onSettings: () => void;
  onAutoSchedule: () => void;
  onStaffList: () => void;
  onEditModelPatterns: () => void;
  isModelPatternVisible: boolean;
  onToggleModelPattern: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  onDateChange, 
  onAiAdvice, 
  loadingAi,
  onSettings,
  onAutoSchedule,
  onStaffList,
  onEditModelPatterns,
  isModelPatternVisible,
  onToggleModelPattern
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }).format(date);
  };

  const getDateColorClass = (date: Date) => {
    const day = date.getDay();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;
    const isHoliday = !!JAPANESE_HOLIDAYS[dateKey];

    if (day === 0 || isHoliday) return 'text-red-500';
    if (day === 6) return 'text-blue-500';
    return 'text-gray-700';
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setIsCalendarOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between z-50 relative shrink-0">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden md:block">ShiftCraft AI</h1>
      </div>

      <div className="flex items-center space-x-4 relative">
        <button 
          onClick={handlePrevDay}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Date Toggle Button */}
        <button 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`flex items-center justify-center text-sm font-medium px-4 py-1.5 rounded-full border min-w-[180px] transition-all
            ${isCalendarOpen 
              ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' 
              : 'bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-300'
            } ${getDateColorClass(currentDate)}`}
        >
          <svg className={`w-4 h-4 mr-2 ${isCalendarOpen ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="font-bold">{formatDate(currentDate)}</span>
          <svg className={`w-4 h-4 ml-2 transition-transform ${isCalendarOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        <button 
          onClick={handleNextDay}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Calendar Popover */}
        {isCalendarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setIsCalendarOpen(false)}></div>
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
               <Calendar selectedDate={currentDate} onDateSelect={handleDateSelect} />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {/* Settings Button */}
        <button 
          onClick={onSettings}
          className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors"
          title="設定"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Model Visibility Toggle */}
        <button
          onClick={onToggleModelPattern}
          className={`hidden xl:flex items-center px-3 py-2 border rounded-lg shadow-sm text-sm font-medium transition-all
            ${isModelPatternVisible 
              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          title={isModelPatternVisible ? "モデルパターンを非表示" : "モデルパターンを表示"}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             {isModelPatternVisible ? (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
             ) : (
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
             )}
          </svg>
          {isModelPatternVisible ? 'モデル表示中' : 'モデル非表示'}
        </button>

        {/* Model Pattern Edit */}
        <button 
          onClick={onEditModelPatterns}
          className="hidden xl:flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm text-sm font-medium transition-all"
          title="モデルパターン編集"
        >
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          モデル編集
        </button>

        {/* Staff Edit Button */}
        <button 
          onClick={onStaffList}
          className="hidden lg:flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          スタッフ編集
        </button>

        {/* Auto Create Button */}
        <button 
          onClick={onAutoSchedule}
          className="hidden lg:flex items-center px-3 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 shadow-sm text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          ワーク自動作成
        </button>

        {/* AI Advice Button */}
        <button 
          onClick={onAiAdvice}
          disabled={loadingAi}
          title="AIアドバイス"
          className={`flex items-center justify-center p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed`}
        >
            {loadingAi ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
        </button>
      </div>
    </header>
  );
};