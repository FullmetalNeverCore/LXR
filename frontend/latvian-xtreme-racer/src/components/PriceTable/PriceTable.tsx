import type { Station,BestPricesMap } from "../../types";
import "./PriceTable.css";


interface PriceTableProps {
  bestPrices: BestPricesMap;
}

export function PriceTable({ bestPrices }: PriceTableProps) {
  const entries = Object.entries(bestPrices).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  if (entries.length === 0) return null;

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
            <tr key={fuelType}>
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