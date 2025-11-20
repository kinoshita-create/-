import React, { useState } from 'react';
import { Calendar } from './Calendar';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAiAdvice: () => void;
  loadingAi: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onDateChange, onAiAdvice, loadingAi }) => {
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