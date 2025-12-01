from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import RoomCreate, RoomResponse
from ..services.room_service import RoomService

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.post("", response_model=RoomResponse)
def create_room(
    room_data: RoomCreate = RoomCreate(),
    db: Session = Depends(get_db)
):
    """Create a new coding room"""
    room = RoomService.create_room(db, room_data.language)
    return RoomResponse(roomId=room.id)

@router.get("/{room_id}")
def get_room(room_id: str, db: Session = Depends(get_db)):
    """Get room details"""
    room = RoomService.get_room(db, room_id)
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    return {
        "roomId": room.id,
        "code": room.code,
        "language": room.language,
        "createdAt": room.created_at
    }