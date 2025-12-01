import React from 'react';
import { Lightbulb } from 'lucide-react';

interface AutocompleteSuggestionsProps {
  suggestions: string[];
  onApplySuggestion: (suggestion: string) => void;
}

export const AutocompleteSuggestions: React.FC<AutocompleteSuggestionsProps> = ({
  suggestions,
  onApplySuggestion
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 bg-gray-700 rounded-lg p-3 shadow-xl border border-purple-500/50 max-w-sm z-50">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <span className="text-xs font-semibold text-gray-300">AI Suggestions</span>
      </div>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onApplySuggestion(suggestion)}
          className="w-full text-left bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded mb-1 last:mb-0 text-sm transition-all font-mono"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};