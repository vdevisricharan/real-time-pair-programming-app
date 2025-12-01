import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRoomId } from './store/editorSlice';
import type { RootState, AppDispatch } from './store';
import { apiService } from './services/api.service';
import { Header } from './components/Header';
import { RoomControls } from './components/RoomControls';
import { CodeEditorPanel } from './components/CodeEditorPanel';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { roomId, connectedUsers, isConnected } = useSelector((state: RootState) => state.editor);

  const handleCreateRoom = async () => {
    try {
      const data = await apiService.createRoom();
      dispatch(setRoomId(data.roomId));
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = (roomIdToJoin: string) => {
    dispatch(setRoomId(roomIdToJoin));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Header connectedUsers={connectedUsers} isConnected={isConnected} />
        
        <RoomControls
          roomId={roomId}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
        
        <CodeEditorPanel />
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Real-time collaborative coding with WebSocket • AI-style autocomplete</p>
        </div>
      </div>
    </div>
  );
};

export default App;