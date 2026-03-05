import math
import httpx



headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://gas.didnt.work/",
    "Origin": "https://gas.didnt.work",
}

REGIONS = [
    "20.97,55.67,24.50,57.40",
    "24.50,55.67,28.24,57.40",
    "20.93,53.90,24.50,56.45",
    "24.50,53.90,26.83,56.45",
    "21.76,57.40,25.50,59.70",
    "25.50,57.40,28.21,59.70",
    "14.12,49.00,18.00,52.00",
    "18.00,49.00,24.15,52.00",
    "14.12,52.00,18.00,54.83",
    "18.00,52.00,24.15,54.83",
]


def _fix_utf8_mojibake(value: str) -> str:
    if not isinstance(value, str):
        return value
    try:
        return value.encode("latin-1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return value


def compute_bbox(lat: float, lng: float, radius_km: float = 20.0) -> tuple[float, float, float, float]:
    delta_lat = radius_km / 111.0

    lat_rad = math.radians(lat)
    km_per_degree_lng = 111.0 * math.cos(lat_rad)
    if km_per_degree_lng == 0:
        delta_lng = 0.0
    else:
        delta_lng = radius_km / km_per_degree_lng

    min_lat = lat - delta_lat
    max_lat = lat + delta_lat
    min_lng = lng - delta_lng
    max_lng = lng + delta_lng

    return min_lat, min_lng, max_lat, max_lng

def transform_station(raw: dict) -> dict:
    address = _fix_utf8_mojibake(raw.get("address", "") or "")
    parts = [p.strip() for p in address.split(",") if p.strip()]
    city = parts[-2] if len(parts) >= 2 else ""

    coords = raw.get("coords") or [None, None]
    lat = float(coords[0]) if coords[0] is not None else 0.0
    lng = float(coords[1]) if coords[1] is not None else 0.0

    prices_raw = raw.get("prices") or {}
    currency = raw.get("currency", "€")
    if currency != "€":
        currency = "€"
    prices = []
    for fuel_type, info in prices_raw.items():
        price = info.get("price")
        if price is None:
            continue
        prices.append(
            {
                "fuel_type": str(fuel_type),
                "price": float(price),
                "currency": currency,
            }
        )

    return {
        "id": str(raw.get("id")),
        "name": _fix_utf8_mojibake(raw.get("name", "") or ""),
        "brand": _fix_utf8_mojibake(raw.get("brand", "") or ""),
        "address": address,
        "city": _fix_utf8_mojibake(city or ""),
        "lat": lat,
        "lng": lng,
        "prices": prices,
    }
async def fetch_stations(lat: float, lng: float, radius_km:float = 20.0):
    min_lat, min_lng, max_lat, max_lng = compute_bbox(lat, lng, radius_km=radius_km)
    url = f"https://gas.didnt.work/api/stations?bbox={min_lng},{min_lat},{max_lng},{max_lat}"
    try:
        async with httpx.AsyncClient(http2=False, headers=headers) as client:
            response = await client.get(url)
            response.encoding = "utf-8"
            print("Status:", response.status_code)
            print("Body:", response.text[:200])
            data = response.json()

            if isinstance(data, list):
                results = [transform_station(s) for s in data if isinstance(s, dict)]
                return [s for s in results if s is not None]

            if isinstance(data, dict):
                return [transform_station(station) for station in data.values()]

            if isinstance(data, list):
                return [transform_station(station) for station in data]

            return []
    except Exception as ex:
        print(ex)
        return []

async def fetch_all_stations() -> list:
    all_stations = []
    async with httpx.AsyncClient(http2=False, headers=headers, timeout=30.0) as client:
        for bbox in REGIONS:
            try:
                url = f"https://gas.didnt.work/api/stations?bbox={bbox}"
                response = await client.get(url)
                print(f"bbox={bbox} status={response.status_code}")
                if response.status_code != 200:
                    continue
                data = response.json()
     
                if isinstance(data, list):
                    all_stations.extend([transform_station(s) for s in data])
                elif isinstance(data, dict):
                    all_stations.extend([transform_station(s) for s in data.values()])
            except Exception as ex:
                print(f"Failed bbox {bbox}: {ex}")
                continue
    seen = set()
    unique = []
    for s in all_stations:
        if s["id"] not in seen:
            seen.add(s["id"])
            unique.append(s)
    print(f"Total unique stations: {len(unique)}")
    return unique