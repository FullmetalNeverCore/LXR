from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scraper.scraper import fetch_stations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://lxr-five.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/stations")
async def get_stations(lat: float ,lng: float):
    if lat is None or lng is None:
        return []
    return await fetch_stations(lat,lng)