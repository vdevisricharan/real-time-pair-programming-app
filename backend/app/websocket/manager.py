from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        
        self.active_connections[room_id].append(websocket)
        
        # Broadcast user count
        await self.broadcast_user_count(room_id)
    
    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            
            if len(self.active_connections[room_id]) == 0:
                del self.active_connections[room_id]
    
    async def broadcast(self, message: dict, room_id: str, exclude: WebSocket = None):
        if room_id in self.active_connections:
            dead_connections = []
            
            for connection in self.active_connections[room_id]:
                if connection != exclude:
                    try:
                        await connection.send_text(json.dumps(message))
                    except Exception:
                        dead_connections.append(connection)
            
            # Clean up dead connections
            for dead in dead_connections:
                self.disconnect(dead, room_id)
    
    async def broadcast_user_count(self, room_id: str):
        if room_id in self.active_connections:
            count = len(self.active_connections[room_id])
            await self.broadcast({
                "type": "user_count",
                "count": count
            }, room_id)
    
    def get_user_count(self, room_id: str) -> int:
        return len(self.active_connections.get(room_id, []))

manager = ConnectionManager()