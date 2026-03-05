import { useState, useEffect } from "react";
import "./App.css";
import { Map } from "./components/Map/Map";
import { useStations } from "./hooks/useStations";
import { useBestPrices } from "./hooks/useBestPrices";
import { PriceTable } from "./components/PriceTable/PriceTable";

const logo = new URL('./assets/lxr.png', import.meta.url).href;

function App() {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [radius, setRadius] = useState<number>(8);
  const [userLat, setUserLat] = useState<number | undefined>(undefined);
  const [userLng, setUserLng] = useState<number | undefined>(undefined);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setGeoError("Unable to get your location — showing all nearby stations");
      }
    );
  }, []);
  
  const { stations, loading, error } = useStations(userLat, userLng, radius);

  const bestStations= useBestPrices(stations);

  const bestStationIds = new Set(
    Object.values(bestStations).map(b => b.station.id)
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <img className="logo" src={logo} alt="Latvian Xtreme Racer logo" />
        <div className="radius-control">
        <button onClick={() => setRadius(8)}>📍 Nearby</button>
        <button onClick={() => setRadius(-1)}>🌍 All</button>
        </div>
      </header>
      <main className="app-main">
        <div className="map-shell">
        {(error || geoError) && !errorDismissed && (
          <div className="error-overlay">
            <button 
              className="error-close"
              onClick={() => setErrorDismissed(true)}
            >
              ✕
            </button>
            <p>⚠️ {error ? "Failed to load stations" : "Location unavailable"}</p>
            <p className="loading-sub">{error?.message ?? geoError}</p>
          </div>
        )}
        {error && (
          <div className="error-overlay">
            <p>⚠️ Failed to load stations</p>
            <p className="loading-sub">{error.message}</p>
          </div>
        )}
        {loading && (
            <div className="loading-overlay">
              <div className="loading-content">
                <p>⛽ Loading fuel stations...</p>
                <p className="loading-sub">This may take up to 50s on first load</p>
              </div>
            </div>
          )}
          <Map userLat={userLat ?? 56.9496} userLng={userLng ?? 24.1052} stations={stations} bestStationIds={bestStationIds} bestPrices={bestStations} selectedStationId={selectedStationId}/>
          <PriceTable bestPrices={bestStations} onSelectStation={(id) => {
            setSelectedStationId(null);
            setTimeout(() => setSelectedStationId(id), 50);
          }}/>
        </div>
      </main>
    </div>
  );
}

export default App;
