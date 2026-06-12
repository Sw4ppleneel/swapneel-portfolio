from contextlib import contextmanager

import psycopg
from psycopg.rows import dict_row

from config import settings


@contextmanager
def _conn():
    conn = psycopg.connect(settings.database_url, row_factory=dict_row)
    # pgbouncer (Vercel/Neon pooled URLs) runs in transaction mode, which is
    # incompatible with psycopg's server-side prepared statements. Disable them.
    conn.prepare_threshold = None
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with _conn() as c:
        c.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id         SERIAL  PRIMARY KEY,
                name       TEXT    NOT NULL,
                email      TEXT    NOT NULL,
                message    TEXT    NOT NULL,
                created_at TEXT    NOT NULL,
                is_read    BOOLEAN NOT NULL DEFAULT FALSE
            )
            """
        )


def add_message(name: str, email: str, message: str, created_at: str) -> int:
    with _conn() as c:
        cur = c.execute(
            "INSERT INTO messages (name, email, message, created_at) "
            "VALUES (%s, %s, %s, %s) RETURNING id",
            (name, email, message, created_at),
        )
        return cur.fetchone()["id"]


def list_messages() -> list[dict]:
    with _conn() as c:
        rows = c.execute(
            "SELECT id, name, email, message, created_at, is_read "
            "FROM messages ORDER BY created_at DESC"
        ).fetchall()
        return [dict(r) for r in rows]


def mark_read(message_id: int) -> None:
    with _conn() as c:
        c.execute("UPDATE messages SET is_read = TRUE WHERE id = %s", (message_id,))


def delete_message(message_id: int) -> None:
    with _conn() as c:
        c.execute("DELETE FROM messages WHERE id = %s", (message_id,))
