# Real-Time Pair Programming Application

A collaborative coding platform with real-time synchronization, AI-type autocomplete, and WebSocket communication.

## 🚀 Features

- **Real-Time Collaboration**: Multiple users can edit code simultaneously with instant synchronization
- **Room-Based Sessions**: Create or join coding rooms with unique IDs
- **AI Type Autocomplete**: Mock AI suggestions based on context and language
- **Multi-Language Support**: Python, JavaScript, TypeScript, Java
- **Persistent Storage**: PostgreSQL database for room state
- **Clean Architecture**: Separated services, routers, and WebSocket management

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL 13+

## 🛠️ Installation & Setup

### Backend Setup

1. **Create PostgreSQL Database**
```bash
createdb pairprogramming
```

2. **Install Dependencies**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```
```bash
#.env.example
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pairprogramming
```
4. **Run Backend**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
```
```bash
#.env.example
VITE_API_BASE=http://localhost:8000
VITE_WS_BASE=ws://localhost:8000
```
3. **Run Frontend**

```bash
npm run dev
```

### Testing with Postman/cURL

**Create Room:**
```bash
curl -X POST http://localhost:8000/rooms \
  -H "Content-Type: application/json"
```

**Get Autocomplete:**
```bash
curl -X POST http://localhost:8000/autocomplete \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello(",
    "cursorPosition": 10,
    "language": "python"
  }'
```

**WebSocket Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/ROOM_ID');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.send(JSON.stringify({
  type: 'code_update',
  code: 'print("Hello, World!")'
}));
```

## 🏗️ Architecture

### Backend Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI app & WebSocket endpoint
│   ├── database.py          # SQLAlchemy configuration
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── routers/
│   │   ├── rooms.py         # Room CRUD endpoints
│   │   └── autocomplete.py  # Autocomplete endpoint
│   ├── services/
│   │   ├── room_service.py  # Room business logic
│   │   └── autocomplete_service.py # Autocomplete logic
│   └── websocket/
│       └── manager.py       # WebSocket connection manager
```
### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── RoomControls.tsx
│   │   ├── CodeEditorPanel.tsx
│   │   └── AutocompleteSuggestions.tsx
│   ├── store/              # Redux Store
│   │   ├── index.ts
│   │   └── editorSlice.ts
│   ├── services/
│   │   ├── api.service.ts
│   │   └── websocket.service.ts
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   └── useAutocomplete.ts
│   ├── utils/
│   │   └── languageMapping.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
```

### Key Design Decisions

1. **WebSocket Architecture**: Connection pooling per room with broadcast capability
2. **Database**: PostgreSQL for persistence with SQLAlchemy ORM
3. **Service Layer**: Separation of business logic from API routes
4. **Mock AI**: Rule-based suggestions using regex and context analysis
5. **State Management**: Redux Toolkit for predictable state updates

### Data Flow
```
User Types → React Component → WebSocket Send → FastAPI WebSocket
                                                      ↓
                                                 Broadcast to Room
                                                      ↓
                                                 Save to Database
                                                      ↓
                                              Other Users Receive
```

## 🔌 API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| POST | `/rooms` | Create new room |
| GET | `/rooms/{room_id}` | Get room details |
| POST | `/autocomplete` | Get code suggestions |

### WebSocket

- **Endpoint**: `/ws/{room_id}`
- **Message Types**:
  - `code_update`: Sync code changes
  - `user_count`: Update connected users

## 🧪 Testing

### Manual Testing
1. Open two browser windows

![alt text](image-1.png)
2. Create a room in window 1

![alt text](image-2.png)
3. Copy the room ID

![alt text](image-3.png)

4. Join with the same ID in window 2

![alt text](image-4.png)
5. Type in either window - see real-time sync

![alt text](image-5.png)

## 🚧 Limitations & Future Improvements

### Current Limitations
1. **In-Memory WebSocket State**: Connections lost on server restart
2. **Simple Conflict Resolution**: Last-write-wins (no CRDT)
3. **Mock Autocomplete**: Not using real AI models
4. **No Authentication**: Open access to all rooms
5. **Basic Cursor Sync**: Only code sync, not cursor positions

### Future Improvements

**High Priority:**
-  Operational Transformation (OT) or CRDT for conflict resolution
-  User authentication and authorization
-  Cursor position synchronization with user colors
-  Chat functionality between collaborators
-  Code execution sandbox

**Medium Priority:**
-  Real AI integration (OpenAI Codex, GitHub Copilot API)
-  Syntax highlighting and linting
-  Multiple file support per room
-  Git integration for version control
-  Room expiration and cleanup

**Low Priority:**
-  Video/audio chat integration
-  Screen sharing
-  Code review and commenting
-  Replay mode for sessions
-  Analytics and usage tracking

## 📝 Technical Decisions

### Why PostgreSQL?
- ACID compliance for room state
- Better for concurrent writes than NoSQL
- Native JSON support for flexible schemas

### Why WebSockets?
- Bi-directional real-time communication
- Lower latency than HTTP polling
- Native browser support

### Why Redux Toolkit?
- Predictable state management
- Excellent dev tools
- Simplified boilerplate

### Why FastAPI?
- Native async/await support
- Automatic API documentation
- Type safety with Pydantic
- WebSocket support out of the box

## 🐛 Known Issues

1. **Reconnection**: Manual refresh needed after disconnect
2. **Large Files**: Performance degrades with >10,000 lines
3. **Network Latency**: Noticeable with >200ms ping