import React from 'react';
import { Code, Users } from 'lucide-react';

interface HeaderProps {
  connectedUsers: number;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ connectedUsers, isConnected }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Code className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Pair Programming Online
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
          <Users className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">{connectedUsers} Connected</span>
        </div>
        
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
      </div>
    </div>
  );
};