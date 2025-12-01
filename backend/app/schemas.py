from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RoomCreate(BaseModel):
    language: Optional[str] = "python"

class RoomResponse(BaseModel):
    roomId: str
    
class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str

class AutocompleteResponse(BaseModel):
    suggestions: List[str]
    
class WebSocketMessage(BaseModel):
    type: str
    code: Optional[str] = None
    count: Optional[int] = None