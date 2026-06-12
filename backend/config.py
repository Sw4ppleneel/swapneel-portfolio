from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All config comes from environment / .env — no secrets in code."""

    admin_password_hash: str = ""          # bcrypt hash, never the plaintext
    jwt_secret: str = ""                    # signing key for login tokens
    jwt_ttl_minutes: int = 120
    allowed_origins: str = "http://localhost:5173"

    # Postgres connection string. Vercel Postgres exposes POSTGRES_URL; Neon and
    # most others expose DATABASE_URL — accept either.
    database_url: str = Field(
        default="",
        validation_alias=AliasChoices("DATABASE_URL", "POSTGRES_URL"),
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()
