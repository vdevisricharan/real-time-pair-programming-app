import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type EditorState } from '../types';

const initialState: EditorState = {
  code: '',
  roomId: null,
  connectedUsers: 0,
  suggestions: [],
  isConnected: false,
  language: 'python'
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setConnectedUsers: (state, action: PayloadAction<number>) => {
      state.connectedUsers = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    }
  }
});

export const {
  setCode,
  setRoomId,
  setConnectedUsers,
  setSuggestions,
  setIsConnected,
  setLanguage,
  clearSuggestions
} = editorSlice.actions;

export default editorSlice.reducer;