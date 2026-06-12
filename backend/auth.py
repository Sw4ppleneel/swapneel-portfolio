import time

import bcrypt
import jwt

from config import settings


def verify_password(plain: str) -> bool:
    """Check a submitted password against the stored bcrypt hash."""
    if not settings.admin_password_hash:
        return False
    try:
        return bcrypt.checkpw(plain.encode(), settings.admin_password_hash.encode())
    except ValueError:
        return False


def make_token() -> str:
    now = int(time.time())
    payload = {
        "sub": "admin",
        "iat": now,
        "exp": now + settings.jwt_ttl_minutes * 60,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def verify_token(token: str) -> bool:
    if not settings.jwt_secret:
        return False
    try:
        jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        return True
    except jwt.PyJWTError:
        return False
