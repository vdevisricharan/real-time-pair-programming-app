import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface RoomControlsProps {
  roomId: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

export const RoomControls: React.FC<RoomControlsProps> = ({
  roomId,
  onCreateRoom,
  onJoinRoom
}) => {
  const [inputRoomId, setInputRoomId] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleJoinRoom = () => {
    if (inputRoomId.trim()) {
      onJoinRoom(inputRoomId.trim());
      setShowJoinInput(false);
      setInputRoomId('');
    }
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!roomId) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 mb-6 border border-purple-500/30">
        <h2 className="text-xl font-semibold mb-6">Get Started</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onCreateRoom}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
          >
            Create New Room
          </button>
          
          <button
            onClick={() => setShowJoinInput(!showJoinInput)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-all"
          >
            Join Existing Room
          </button>
        </div>
        
        {showJoinInput && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Enter Room ID"
              className="flex-1 bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium transition-all"
            >
              Join
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-purple-500/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">Room ID</p>
          <p className="text-lg font-mono font-semibold">{roomId}</p>
        </div>
        
        <button
          onClick={handleCopyRoomId}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy ID'}
        </button>
      </div>
    </div>
  );
};