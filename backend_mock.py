
# -----------------------------------------------------------------------------
# ARCHITECTURAL REFERENCE: FastAPI Backend for Wedding Management
# -----------------------------------------------------------------------------

from fastapi import FastAPI, WebSocket, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import Document, init_beanie
import jwt

app = FastAPI(title="Wedding API")

# Models
class Invitee(Document):
    name: str
    phone: str
    family_count: int = 1
    rsvp_status: str = "Pending"
    food_preference: str = "Non-Veg"
    tag: str = "General"
    message: Optional[str] = None
    arrived: bool = False
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "invitees"

class WeddingSettings(Document):
    bride_name: str
    groom_name: str
    date: str
    time: str
    venue: str
    slug: str
    is_active: bool = True

    class Settings:
        name = "settings"

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.on_event("startup")
async def startup():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    await init_beanie(database=client.wedding_db, document_models=[Invitee, WeddingSettings])

# Endpoints
@app.get("/invitees")
async def get_invitees():
    return await Invitee.find_all().to_list()

@app.post("/invitees")
async def create_invitee(invitee: Invitee):
    await invitee.insert()
    await manager.broadcast({"event": "new_invitee", "data": invitee.dict()})
    return invitee

@app.put("/invitees/{id}/checkin")
async def checkin_guest(id: str):
    invitee = await Invitee.get(id)
    if not invitee:
        raise HTTPException(status_code=404)
    invitee.arrived = True
    await invitee.save()
    await manager.broadcast({"event": "checkin", "guest": invitee.name})
    return {"status": "success"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)
