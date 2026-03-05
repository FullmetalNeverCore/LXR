import math
import httpx



headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://gas.didnt.work/",
    "Origin": "https://gas.didnt.work",
}


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
async def fetch_stations(lat: float, lng: float):
    min_lat, min_lng, max_lat, max_lng = compute_bbox(lat, lng, radius_km=20.0)
    url = f"https://gas.didnt.work/api/stations?bbox={min_lng},{min_lat},{max_lng},{max_lat}"
    try:
        async with httpx.AsyncClient(http2=False, headers=headers) as client:
            response = await client.get(url)
            response.encoding = "utf-8"
            print("Status:", response.status_code)
            print("Body:", response.text[:200])
            data = response.json()

            if isinstance(data, dict):
                return [transform_station(station) for station in data.values()]

            if isinstance(data, list):
                return [transform_station(station) for station in data]

            return []
    except Exception as ex:
        print(ex)
        return []