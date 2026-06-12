# Portfolio Inbox — backend

Tiny FastAPI service that receives contact-form messages, stores them in SQLite,
and lets only you read them after a password login. No secrets live in the
frontend; the password is never stored (only its bcrypt hash), and the inbox
endpoints require a signed token.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/messages` | public | store a contact message `{name, email, message}` |
| POST | `/api/admin/login` | public | exchange password for a short-lived token (rate-limited) |
| GET | `/api/admin/messages` | token | list all messages, newest first |
| POST | `/api/admin/messages/{id}/read` | token | mark one read |
| DELETE | `/api/admin/messages/{id}` | token | delete one |
| GET | `/api/health` | public | health check |

## Setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
python scripts/hash_password.py      # → paste output into .env as ADMIN_PASSWORD_HASH
python -c "import secrets; print(secrets.token_urlsafe(48))"   # → JWT_SECRET in .env
```

Edit `.env`:
- `ADMIN_PASSWORD_HASH` — from the script above
- `JWT_SECRET` — the random string above
- `ALLOWED_ORIGINS` — the exact origin your portfolio is served from
  (e.g. `https://swapneel.dev`), comma-separated for more than one.

## Run

```bash
uvicorn main:app --reload --port 8000     # dev
# prod (example):
# uvicorn main:app --host 127.0.0.1 --port 8000
```

Point the frontend at it: in `index.html`, set
`window.PF_API_BASE = 'https://your-api-host'`. Leave it `''` if the API is
served from the same origin as the page.

## Notes / security

- Passwords are checked with bcrypt; only the hash is stored, in `.env` (gitignored).
- Login is rate-limited (8 tries / 5 min / IP) to slow brute force.
- Inbox endpoints require a `Bearer` JWT that expires after `JWT_TTL_MINUTES`.
- A hidden `company` honeypot field silently drops bot submissions.
- The frontend renders messages with `textContent`, so a message containing
  HTML/script can't execute in your inbox view (stored-XSS safe).
- Run behind HTTPS (e.g. your existing Cloudflare + nginx) so the password and
  token never travel in plaintext.
