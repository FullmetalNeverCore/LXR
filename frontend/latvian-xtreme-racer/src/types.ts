export interface FuelPrice {
    fuel_type: string;
    price: number;
    currency: string;
}

export type BestPricesMap = Record<string, { station: Station; price: number }>

export interface Station {
    id: string;
    name: string;
    brand: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    prices: FuelPrice[];
}
