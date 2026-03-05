import { useState, useEffect } from "react";
import "./App.css";
import { Map } from "./components/Map/Map";
import { useStations } from "./hooks/useStations";

const logo = new URL('./assets/lxr.png', import.meta.url).href;

function App() {
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
        alert('Error getting location');
      }
    );
  }, []);
  
  const { stations } = useStations(coords.lat, coords.lng);

  return (
    <div className="app-container">
      <header className="app-header">
        <img className="logo" src={logo} alt="Latvian Xtreme Racer logo" />
      </header>
      <main className="app-main">
        <div className="map-shell">
          <Map userLat={coords.lat} userLng={coords.lng} stations={stations} />
        </div>
      </main>
    </div>
  );
}

export default App;
