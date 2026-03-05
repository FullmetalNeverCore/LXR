import type { Station } from "../types";
import { useMemo } from "react";

export function useBestPrices(stations: Station[]) {
  return useMemo(() => {
    const best: Record<string, { station: Station; price: number }> = {};
    stations.forEach((station) => {
      station.prices.forEach((p) => {
        const key = p.fuel_type;
        if (!best[key] || p.price < best[key].price) {
          best[key] = { station, price: p.price };
        }
      });
    });
    return best;
  }, [stations]);
}