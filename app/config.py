# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, AliasChoices

class Settings(BaseSettings):
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES:int

    ALGORITHM: str = "HS256"

    OPENAI_API_KEY: str = Field(
        ...,
        validation_alias=AliasChoices("OPENAI_API_KEY", "openai_api_key"),
    )
    OPENAI_MODEL: str = Field(
        "gpt-5-nano",
        validation_alias=AliasChoices("OPENAI_MODEL", "openai_model"),
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="",
        case_sensitive=False,
        extra="ignore",
    )

settings = Settings()