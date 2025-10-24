# app/auth.py
from datetime import datetime, timedelta
from jose import jwt
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlmodel import Session, select
import bcrypt
from .models import User
from .config import settings



def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Создаёт JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except Exception:
        return None

def hash_password(password: str) -> str:
    """Хэширует пароль с усечением до 72 байт (ограничение bcrypt)."""
    return bcrypt.hashpw(password[:72].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, password_hash: str) -> bool:
    """Проверяет пароль с учётом ограничения 72 байт для bcrypt."""
    try:
        return bcrypt.checkpw(password[:72].encode("utf-8"), password_hash.encode("utf-8"))
    except Exception:
        return False

def verify_user_credentials(session: Session, username: str, password: str):
    """Возвращает пользователя при корректной паре (логин/пароль), иначе None."""
    user = session.exec(select(User).where(User.name == username)).first()
    if not user:
        return None
    return user if verify_password(password, user.password_hash) else None