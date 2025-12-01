import { useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setSuggestions } from '../store/editorSlice';
import { apiService } from '../services/api.service';
import { type AppDispatch } from '../store';

export const useAutocomplete = (language: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerAutocomplete = useCallback(async (code: string, cursorPosition: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await apiService.getAutocomplete(code, cursorPosition, language);
        if (result.suggestions && result.suggestions.length > 0) {
          dispatch(setSuggestions(result.suggestions));
        }
      } catch (error) {
        console.error('Autocomplete error:', error);
      }
    }, 600);
  }, [language, dispatch]);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { triggerAutocomplete, cleanup };
};