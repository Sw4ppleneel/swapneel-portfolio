"""Best-effort new-message notifications.

A notification failure must never break the contact form, so every send is
wrapped and any error is swallowed. If the channel isn't configured, sends are
silent no-ops.
"""
import urllib.parse
import urllib.request

from config import settings

_MAX_BODY = 3500  # keep well under Telegram's 4096-char message limit


def send_telegram(name: str, email: str, message: str) -> None:
    token = settings.telegram_bot_token
    chat_id = settings.telegram_chat_id
    if not token or not chat_id:
        return  # not configured — no-op

    body = message if len(message) <= _MAX_BODY else message[:_MAX_BODY] + "…"
    text = f"📬 New portfolio message\n\nFrom: {name} <{email}>\n\n{body}"

    data = urllib.parse.urlencode(
        {"chat_id": chat_id, "text": text, "disable_web_page_preview": "true"}
    ).encode()
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        urllib.request.urlopen(
            urllib.request.Request(url, data=data, method="POST"), timeout=5
        )
    except Exception:
        pass  # swallow: the message is already stored; the ping is best-effort
