export interface EditorState {
  code: string;
  roomId: string | null;
  connectedUsers: number;
  suggestions: string[];
  isConnected: boolean;
  language: string;
}

export interface WebSocketMessage {
  type: 'code_update' | 'user_count';
  code?: string;
  count?: number;
}

export interface AutocompleteRequest {
  code: string;
  cursorPosition: number;
  language: string;
}

export interface AutocompleteResponse {
  suggestions: string[];
}

export interface RoomResponse {
  roomId: string;
}