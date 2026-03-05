import { useState, useEffect } from "react";
import type { Station } from "../types";

const API_BASE_URL = (() => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv && fromEnv.trim() !== "") {
    return fromEnv.replace(/\/+$/, "");
  }

  if (import.meta.env.DEV) {
    console.warn(
      "[useStations] VITE_API_BASE_URL is not set, falling back to http://localhost:8000 in dev."
    );
    return "http://localhost:8000";
  }

  throw new Error(
    "VITE_API_BASE_URL is not defined. Set it in your .env/.env.production file for production."
  );
})();

export function useStations(lat?: number, lng?: number) {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function fetchData() {
            setLoading(true);
            const params = new URLSearchParams();
            if (lat !== undefined) params.set("lat", String(lat));
            if (lng !== undefined) params.set("lng", String(lng));

            const url = `${API_BASE_URL}/api/stations?${params.toString()}`;
            console.log("[useStations] Fetching stations", {
                url,
                lat,
                lng,
            });

            try {
                const response = await fetch(url, { signal });
                const text = await response.text();

                console.log("[useStations] Raw response text (first 500 chars):", text.slice(0, 500));

                if (!response.ok) {
                    console.error("[useStations] HTTP error", {
                        status: response.status,
                        statusText: response.statusText,
                    });
                    throw new Error(`Request failed with status ${response.status}`);
                }

                let data: Station[];
                try {
                    data = JSON.parse(text) as Station[];
                } catch (parseError) {
                    console.error("[useStations] JSON parse error", parseError);
                    throw parseError;
                }

                console.log("[useStations] Parsed stations count", data.length);
                setStations(data);
                setError(null);
                setLoading(false);
            } catch (err) {
                if ((err as Error).name === "AbortError") {
                    console.log("[useStations] Request aborted");
                    return;
                }

                console.error("[useStations] Fetch failed", {
                    error: err,
                    lat,
                    lng,
                });
                setError(err as Error);
            }
        }

        fetchData();

        return () => {
            controller.abort();
        };
    }, [lat, lng]);

    return { stations, loading, error };
}