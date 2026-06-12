import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, EmailStr, Field

import auth
import db
import notify
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    yield


app = FastAPI(title="Portfolio Inbox", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

bearer = HTTPBearer(auto_error=False)


def require_admin(cred: HTTPAuthorizationCredentials | None = Depends(bearer)) -> bool:
    if cred is None or not auth.verify_token(cred.credentials):
        raise HTTPException(status_code=401, detail="unauthorized")
    return True


# ---------- public: receive a message ----------

class MessageIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)
    company: str | None = None  # honeypot — humans never see this field


@app.post("/api/messages")
def create_message(payload: MessageIn):
    if payload.company:  # a bot filled the hidden field — silently drop
        return {"ok": True}
    name = payload.name.strip()
    message = payload.message.strip()
    db.add_message(
        name,
        str(payload.email),
        message,
        datetime.now(timezone.utc).isoformat(),
    )
    notify.send_telegram(name, str(payload.email), message)  # best-effort ping
    return {"ok": True}


# ---------- admin: login (rate-limited) ----------

_LOGIN_ATTEMPTS: dict[str, list[float]] = {}
_WINDOW_SECONDS = 300
_MAX_ATTEMPTS = 8


class LoginIn(BaseModel):
    password: str


@app.post("/api/admin/login")
def login(body: LoginIn, request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    recent = [t for t in _LOGIN_ATTEMPTS.get(ip, []) if now - t < _WINDOW_SECONDS]

    if len(recent) >= _MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="too many attempts — wait a few minutes")

    if not auth.verify_password(body.password):
        recent.append(now)
        _LOGIN_ATTEMPTS[ip] = recent
        raise HTTPException(status_code=401, detail="wrong password")

    _LOGIN_ATTEMPTS[ip] = []  # clear on success
    return {"token": auth.make_token(), "expires_in": settings.jwt_ttl_minutes * 60}


# ---------- admin: inbox ----------

@app.get("/api/admin/messages")
def get_messages(_: bool = Depends(require_admin)):
    return db.list_messages()


@app.post("/api/admin/messages/{message_id}/read")
def read_message(message_id: int, _: bool = Depends(require_admin)):
    db.mark_read(message_id)
    return {"ok": True}


@app.delete("/api/admin/messages/{message_id}")
def remove_message(message_id: int, _: bool = Depends(require_admin)):
    db.delete_message(message_id)
    return {"ok": True}


@app.get("/api/health")
def health():
    return {"ok": True}
