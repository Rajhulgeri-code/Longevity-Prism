import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface QuestionFaceProps {
  question: string;
  options: string[];
  selectedOption?: string;
  onSelect: (option: string) => void;
}

export const QuestionFace: React.FC<QuestionFaceProps> = ({
  question,
  options,
  selectedOption,
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (selectedOption) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
  }, [selectedOption]);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      className={`w-full h-full bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center transition-all duration-500 border border-neutral-100 ${
        animate ? 'scale-[1.02] shadow-3xl' : ''
      }`}
    >
      <div className="text-center mb-8">
        <h2 className="text-neutral-800 mb-2">{question}</h2>
      </div>

      <div className="relative w-full max-w-xs">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
            selectedOption
              ? 'border-neutral-800 bg-gradient-to-br from-neutral-800 to-neutral-700 text-white shadow-lg'
              : 'border-neutral-200 bg-white/80 text-neutral-600 hover:border-neutral-300 hover:bg-white'
          }`}
        >
          <span>{selectedOption ? capitalizeFirst(selectedOption) : 'Choose your response'}</span>
          <ChevronDown
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            size={20}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full px-6 py-3 text-left transition-all duration-200 ${
                  selectedOption === option
                    ? 'bg-neutral-100 text-neutral-800'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {capitalizeFirst(option)}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedOption && (
        <div className="mt-6 text-neutral-500 text-sm animate-fade-in flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Answer recorded
        </div>
      )}
    </div>
  );
};