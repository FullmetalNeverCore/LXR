from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scraper.scraper import fetch_stations,fetch_all_stations
from typing import Optional

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
async def get_stations(
    lat: Optional[float] = None, 
    lng: Optional[float] = None,
    radius_km: Optional[float] = None
):
    print(radius_km)
    if lat is None or lng is None or (radius_km is not None and radius_km < 0):
        return await fetch_all_stations()
    return await fetch_stations(lat, lng, radius_km or 20.0)