from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool
import sqlalchemy as sa

# Ensure sqlmodel & models are importable for metadata
import sqlmodel
from sqlmodel.sql import sqltypes
from app.models import SQLModel

# Alembic config
config = context.config

# Logging config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Models metadata for autogenerate
target_metadata = SQLModel.metadata

# ---- Map SQLModel Auto* types to SQLAlchemy types during autogenerate ----
AUTO_TO_SA = {}
if hasattr(sqltypes, "AutoString"):
    AUTO_TO_SA["AutoString"] = "sa.String()"
if hasattr(sqltypes, "AutoInteger"):
    AUTO_TO_SA["AutoInteger"] = "sa.Integer()"
if hasattr(sqltypes, "AutoFloat"):
    AUTO_TO_SA["AutoFloat"] = "sa.Float()"
if hasattr(sqltypes, "AutoJSON"):
    AUTO_TO_SA["AutoJSON"] = "sa.JSON()"


def render_item(type_, obj, autogen_context):
    """
    Replace sqlmodel.sql.sqltypes.Auto* with standard SQLAlchemy types
    in generated migration scripts, so we don't depend on `import sqlmodel`
    inside each revision file.
    """
    if type_ == "type":
        cls = type(obj)
        mod = getattr(cls, "__module__", "")
        name = getattr(cls, "__name__", "")
        if mod.startswith("sqlmodel.sql.sqltypes") and name in AUTO_TO_SA:
            return AUTO_TO_SA[name]
    return False


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_item=render_item,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_item=render_item,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
