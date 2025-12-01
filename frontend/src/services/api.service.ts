import type { AutocompleteRequest, AutocompleteResponse, RoomResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const apiService = {
  createRoom: async (): Promise<RoomResponse> => {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('Failed to create room');
    }
    
    return response.json();
  },
  
  getAutocomplete: async (
    code: string,
    cursorPosition: number,
    language: string
  ): Promise<AutocompleteResponse> => {
    const response = await fetch(`${API_BASE}/autocomplete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cursorPosition, language } as AutocompleteRequest)
    });
    
    if (!response.ok) {
      throw new Error('Failed to get autocomplete suggestions');
    }
    
    return response.json();
  }
};