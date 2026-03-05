import { useEffect } from "react";
import type { Station } from "../../types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { StationPopup } from "../StationPopup/StationPopup";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import {getBrandColor} from "../../utils"

L.Icon.Default.mergeOptions({
    iconUrl,
    shadowUrl,
});
const userLocationIcon = L.divIcon({
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3),
                    0 0 12px rgba(59, 130, 246, 0.6);
      "></div>
    `,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12],
});

function createBrandIcon(brand: string) {
    const color = getBrandColor(brand);
    const html = `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>
    `;
    return L.divIcon({
      html,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
}

interface MapProps{
    userLat?: number;
    userLng?: number;
    stations: Station[];
}

function RecenterOnLocation({ lat, lng }: { lat?: number; lng?: number }) {
    const map = useMap();

    useEffect(() => {
        if (lat !== undefined && lng !== undefined) {
            map.setView([lat, lng]);
        }
    }, [lat, lng, map]);

    return null;
}

export function Map({ userLat, userLng, stations }: MapProps) {
    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <MapContainer
                center={[userLat ?? 56.9496, userLng ?? 24.1052]}
                zoom={13}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            >
                <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <RecenterOnLocation lat={userLat} lng={userLng} />
                {userLat !== undefined && userLng !== undefined && (
                    <Marker position={[userLat, userLng]} icon={userLocationIcon}>
                        <Popup>
                            <div
                                style={{
                                    padding: "4px 8px",
                                    backgroundColor: "#333",
                                    color: "#fff",
                                    borderRadius: "4px",
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                }}
                            >
                                You are here
                            </div>
                        </Popup>
                    </Marker>
                )}
                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        icon={createBrandIcon(station.brand)}
                        position={[station.lat, station.lng]}
                    >
                        <Popup>
                            <StationPopup station={station} />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}