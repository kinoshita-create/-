import React, { useState } from 'react';
import { ModelShiftPattern } from './ModelShiftPattern';
import { ModelPattern, ModelShift } from '../types';
import { PATTERN_COLORS } from '../constants';

interface ModelPatternModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  patterns: ModelPattern[];
  activePatternId: string;
  onUpdatePatterns: (patterns: ModelPattern[]) => void;
  onSelectActivePattern: (id: string) => void;
}

export const ModelPatternModal: React.FC<ModelPatternModalProps> = ({
  isOpen,
  onClose,
  onBack,
  patterns,
  activePatternId,
  onUpdatePatterns,
  onSelectActivePattern
}) => {
  const [selectedEditId, setSelectedEditId] = useState<string>(activePatternId);

  if (!isOpen) return null;

  const selectedPattern = patterns.find(p => p.id === selectedEditId) || patterns[0];

  const handleAddPattern = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    // Auto-assign color
    const color = PATTERN_COLORS[patterns.length % PATTERN_COLORS.length];
    const newPattern: ModelPattern = {
      id: newId,
      name: `パターン ${patterns.length + 1}`,
      shifts: [],
      color
    };
    onUpdatePatterns([...patterns, newPattern]);
    setSelectedEditId(newId);
  };

  const handleDeletePattern = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (patterns.length <= 1) {
      alert("最後のパターンは削除できません");
      return;
    }
    
    const newPatterns = patterns.filter(p => p.id !== id);
    onUpdatePatterns(newPatterns);
    
    if (id === selectedEditId) {
      setSelectedEditId(newPatterns[0].id);
    }
    if (id === activePatternId) {
      onSelectActivePattern(newPatterns[0].id);
    }
  };

  const handleNameChange = (id: string, newName: string) => {
    const newPatterns = patterns.map(p => 
      p.id === id ? { ...p, name: newName } : p
    );
    onUpdatePatterns(newPatterns);
  };

  const handleShiftsChange = (newShifts: ModelShift[]) => {
    const newPatterns = patterns.map(p => 
      p.id === selectedEditId ? { ...p, shifts: newShifts } : p
    );
    onUpdatePatterns(newPatterns);
  };
  
  const handleSave = () => {
    alert("保存しました");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            モデルパターン編集
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar List */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
             <div className="p-3 border-b border-gray-200">
               <button 
                 onClick={handleAddPattern}
                 className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
               >
                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 新規パターン追加
               </button>
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2">
               {patterns.map(pattern => (
                 <div 
                   key={pattern.id}
                   onClick={() => setSelectedEditId(pattern.id)}
                   className={`group p-3 rounded-lg cursor-pointer border transition-all relative flex flex-col
                     ${selectedEditId === pattern.id ? 'bg-white border-blue-400 shadow-md ring-1 ring-blue-100' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                 >
                   <div className="flex items-center justify-between w-full">
                      <div className="flex items-center flex-1">
                        {/* Color Indicator */}
                        <div className={`w-3 h-3 rounded-full mr-2 ${pattern.color || 'bg-gray-400'}`}></div>
                        <input 
                            type="text"
                            value={pattern.name}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleNameChange(pattern.id, e.target.value)}
                            className="text-sm font-bold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                        />
                      </div>
                      <button 
                        onClick={(e) => handleDeletePattern(e, pattern.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${selectedPattern.color || 'bg-gray-400'}`}></span>
                <h4 className="font-bold text-gray-700">
                  {selectedPattern.name} の編集
                </h4>
                <button
                  onClick={handleSave}
                  className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
                >
                  保存
                </button>
              </div>
              <span className="text-xs text-gray-500">ドラッグして時間を調整</span>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
               <div className="bg-white rounded shadow-sm border border-gray-200">
                 <ModelShiftPattern 
                   shifts={selectedPattern.shifts} 
                   onChange={handleShiftsChange}
                   readOnly={false}
                   patternColor={selectedPattern.color}
                 />
               </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-3 flex justify-end border-t border-gray-200">
          <button 
            onClick={onBack || onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-sm font-medium"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};
