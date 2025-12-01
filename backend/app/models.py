from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.sql import func
from .database import Base

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(String, primary_key=True, index=True)
    code = Column(Text, default="")
    language = Column(String, default="python")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    active_users = Column(Integer, default=0)