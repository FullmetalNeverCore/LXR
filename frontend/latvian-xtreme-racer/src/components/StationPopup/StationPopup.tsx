import type { Station } from "../../types";
import "./StationPopup.css";
import { getBrandColor } from "../../utils";

export interface StationPopupProps{
    station: Station;
}

export function StationPopup({ station }: StationPopupProps) {
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
                    {station.prices.map((price) => (
                        <tr key={price.fuel_type}>
                        <td>{price.fuel_type}</td>
                        <td>{price.price}</td>
                        <td>{price.currency}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}