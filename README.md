# LXR — Latvian Xtreme Racer

![LXR logo](frontend/latvian-xtreme-racer/src/assets/lxr.png)

**LXR** is an interactive map showing gas stations and fuel prices across the **Baltics** (Latvia, Lithuania, Estonia) and **Poland**. Use it to find nearby stations and compare fuel prices when planning a trip or refueling.

**Live demo**: [`https://lxr-five.vercel.app`](https://lxr-five.vercel.app)

## Features

- Interactive map with gas station locations
- Fuel prices at a glance
- Coverage: Latvia, Lithuania, Estonia, Poland
- Fast, map-centric interface

## Project structure

| Folder | Stack | Description |
|--------|--------|-------------|
| `frontend/latvian-xtreme-racer` | React, TypeScript, Vite, Leaflet | Web app and map UI |
| `backend` | Python, FastAPI | API and station/scraping logic |

## Getting started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API base: `http://localhost:8000`  
- Health: `GET /health`  
- Stations: `GET /api/stations?lat=<lat>&lng=<lng>`

### Frontend

```bash
cd frontend/latvian-xtreme-racer
npm install
npm run dev
```

App: `http://localhost:5173`

### Production

- Set `VITE_API_URL` (or equivalent) in the frontend to your backend URL.
- Build: `npm run build` in the frontend; serve the backend with a production ASGI server (e.g. Gunicorn + Uvicorn).

## License

See repository for license details.
