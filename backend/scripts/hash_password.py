"""Generate a bcrypt hash for your admin password.

Run from the backend/ directory:
    python scripts/hash_password.py

Paste the printed hash into .env as ADMIN_PASSWORD_HASH.
The plaintext password is never stored anywhere.
"""
import getpass

import bcrypt


def main() -> None:
    pw = getpass.getpass("New admin password: ")
    confirm = getpass.getpass("Confirm password: ")
    if pw != confirm:
        raise SystemExit("Passwords do not match.")
    if len(pw) < 8:
        raise SystemExit("Use at least 8 characters.")
    digest = bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()
    print("\nADMIN_PASSWORD_HASH=" + digest)


if __name__ == "__main__":
    main()
