
export function getBrandColor(brand: string): string {
    const colors: Record<string, string> = {
      "Circle K": "#e63027",
      "Neste":    "#007ac1",
      "Virsi":    "#f5a800",
      "Viada":    "#00843d",
    };
    return colors[brand] ?? "#444";
}

