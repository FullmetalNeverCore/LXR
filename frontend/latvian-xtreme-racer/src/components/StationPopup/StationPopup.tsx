import type { Station ,BestPricesMap } from "../../types";
import "./StationPopup.css";
import { getBrandColor } from "../../utils";

export interface StationPopupProps{
    station: Station;
    bestPrices: BestPricesMap;
}

export function StationPopup({ station, bestPrices }: StationPopupProps) {
    return (
        <div className="popup">
            <div className="popup-brand" style={{ backgroundColor: getBrandColor(station.brand) }}>{station.brand}</div>
            <table className="popup-table">
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>{station.name}</td>
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td>{station.address}</td>
                    </tr>
                    <tr>
                        <td>City</td>
                        <td>{station.city}</td>
                    </tr>
                    {station.prices.map((p) => {
                    const isWinner = bestPrices[p.fuel_type]?.station.id === station.id;
                    return (
                        <tr key={p.fuel_type} style={{ 
                        color: isWinner ? "#FFD700" : "white",
                        fontWeight: isWinner ? 900 : 300
                        }}>
                        <td>{isWinner ? "🏆 " : ""}{p.fuel_type}</td>
                        <td>{p.price}</td>
                        <td>{p.currency}</td>
                        </tr>
                    );
                    })}
                </tbody>
            </table>
        </div>
    );
}