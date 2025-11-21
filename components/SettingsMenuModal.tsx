import React from 'react';

interface SettingsMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPatternEdit: () => void;
  onOpenScheduleEdit: () => void;
}

export const SettingsMenuModal: React.FC<SettingsMenuModalProps> = ({
  isOpen,
  onClose,
  onOpenPatternEdit,
  onOpenScheduleEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">モデル設定メニュー</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 grid gap-4">
          <button
            onClick={() => {
              onOpenPatternEdit();
            }}
            className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4 group-hover:bg-blue-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg">モデルパターン編集</h4>
              <p className="text-sm text-gray-500 mt-1">シフトのひな形を作成・修正します。</p>
            </div>
          </button>

          <button
            onClick={() => {
              onOpenScheduleEdit();
            }}
            className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group text-left"
          >
            <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4 group-hover:bg-green-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg">パターン適用スケジュール</h4>
              <p className="text-sm text-gray-500 mt-1">カレンダーにパターンを割り当てます。</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};