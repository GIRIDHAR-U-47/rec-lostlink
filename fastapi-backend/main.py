from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.connect()
    yield
    db.close()

app = FastAPI(title="REC LostLink API", version="1.0.0", lifespan=lifespan)

# CORS Middleware
origins = [
    "http://localhost:3000", # Access from React/React Native web
    "*" # Allow all for development ease with React Native (Expo)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import auth, items, claims
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(items.router, prefix="/api/items", tags=["items"])
app.include_router(claims.router, prefix="/api/claims", tags=["claims"])

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "Welcome to REC LostLink API"}
