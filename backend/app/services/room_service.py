from sqlalchemy.orm import Session
from ..models import Room
import uuid

class RoomService:
    @staticmethod
    def create_room(db: Session, language: str = "python") -> Room:
        room_id = str(uuid.uuid4())[:8]
        
        # Ensure unique room ID
        while db.query(Room).filter(Room.id == room_id).first():
            room_id = str(uuid.uuid4())[:8]
        
        room = Room(
            id=room_id,
            code="",
            language=language
        )
        
        db.add(room)
        db.commit()
        db.refresh(room)
        
        return room
    
    @staticmethod
    def get_room(db: Session, room_id: str) -> Room:
        return db.query(Room).filter(Room.id == room_id).first()
    
    @staticmethod
    def update_room_code(db: Session, room_id: str, code: str):
        room = db.query(Room).filter(Room.id == room_id).first()
        if room:
            room.code = code
            db.commit()