import type { BestPricesMap } from "../../types";
import "./PriceTable.css";


interface PriceTableProps {
  bestPrices: BestPricesMap;
  onSelectStation?: (stationId: string) => void;
}

export function PriceTable({ bestPrices, onSelectStation }: PriceTableProps) {
  const entries = Object.entries(bestPrices).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  if (entries.length === 0) return null;
  entries.forEach(([fuelType, { station, price }]) => {
    console.log("Best price row:", {
      fuelType,
      price,
      stationId: station.id,
      stationName: station.name,
      stationCity: station.city,
      stationAddress: station.address,
    });
  });
  return (
    <div className="price-table-container">
    <div className="price-table-handle" />
      <h3 className="price-table-title">⛽ Best Prices</h3>
      <table className="price-table">
        <thead>
          <tr>
            <th>Fuel</th>
            <th>Price</th>
            <th>Station</th>
          </tr>
        </thead>
        <tbody>
        {entries.map(([fuelType, { station, price }]) => (
        <tr
            key={fuelType}
            onClick={() => onSelectStation?.(station.id)}
            className="price-table-row-clickable"
        >
            <td>{fuelType}</td>
            <td>🏆 {price.toFixed(3)} €</td>
            <td>{station.name}</td>
        </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}