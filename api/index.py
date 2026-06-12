"""Vercel serverless entrypoint.

Vercel's Python runtime detects the ASGI `app` variable exported here and serves
it. The actual FastAPI app lives in ../backend; we add it to the import path so
`main`, `auth`, `db`, and `config` resolve unchanged.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from main import app  # noqa: E402,F401  (re-exported for Vercel)
