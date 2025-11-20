import React, { useState } from 'react';
import { Calendar } from './Calendar';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAiAdvice: () => void;
  loadingAi: boolean;
  onSettings: () => void;
  onAutoSchedule: () => void;
  onStaffList: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  onDateChange, 
  onAiAdvice, 
  loadingAi,
  onSettings,
  onAutoSchedule,
  onStaffList
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
              ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-100' 
              : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100 hover:border-gray-300'
            }`}
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
          className={`flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed`}
        >
            {loadingAi ? (
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
            ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
            <span className="hidden md:inline">AIアドバイス</span>
            <span className="md:hidden">AI</span>
        </button>
      </div>
    </header>
  );
};