import { useState, useEffect } from "react";
import "./App.css";
import { Map } from "./components/Map/Map";
import { useStations } from "./hooks/useStations";

const logo = new URL('./assets/lxr.png', import.meta.url).href;

function App() {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 56.9496,
    lng: 24.1052,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({lat: position.coords.latitude, lng: position.coords.longitude});
      },
      (error) => {
        console.error(error);
        setGeoError("Unable to get your location — showing all nearby stations");
      }
    );
  }, []);
  
  const { stations,loading,error } = useStations(coords.lat, coords.lng);

  return (
    <div className="app-container">
      <header className="app-header">
        <img className="logo" src={logo} alt="Latvian Xtreme Racer logo" />
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
          <Map userLat={coords.lat} userLng={coords.lng} stations={stations} />
        </div>
      </main>
    </div>
  );
}

export default App;
