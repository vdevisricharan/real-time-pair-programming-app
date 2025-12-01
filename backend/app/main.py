from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from .database import engine, get_db, Base
from .routers import rooms, autocomplete
from .websocket.manager import manager
from .services.room_service import RoomService
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pair Programming API", version="1.0.0")

# Get allowed origins from environment variable
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rooms.router)
app.include_router(autocomplete.router)

@app.get("/")
def root():
    return {
        "message": "Pair Programming API",
        "version": "1.0.0",
        "endpoints": {
            "rooms": "/rooms",
            "autocomplete": "/autocomplete",
            "websocket": "/ws/{room_id}"
        }
    }

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    db: Session = Depends(get_db)
):
    # Verify room exists
    room = RoomService.get_room(db, room_id)
    if not room:
        await websocket.close(code=1008, reason="Room not found")
        return
    
    await manager.connect(websocket, room_id)
    
    # Send current code to new user
    if room.code:
        await websocket.send_text(json.dumps({
            "type": "code_update",
            "code": room.code
        }))
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "code_update":
                code = message.get("code", "")
                
                # Save to database
                RoomService.update_room_code(db, room_id, code)
                
                # Broadcast to other users
                await manager.broadcast(
                    {"type": "code_update", "code": code},
                    room_id,
                    exclude=websocket
                )
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast_user_count(room_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, room_id)