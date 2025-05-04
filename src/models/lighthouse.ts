export interface Lighthouse {
  Id: number;
  Name: string;
  Description: string;
  Latitude: number | null;
  Longitude: number | null;
  Elevation: number | null;
}

// Interface with camelCase properties for use within the app
export interface LighthouseInternal {
  id: string;
  name: string;
  description: string;
  lat: number;
  lon: number;
  elevation: number | null;
}

/**
 * Converts from API format (PascalCase) to internal format (camelCase)
 */
export function convertToInternalFormat(lighthouse: Lighthouse): LighthouseInternal {
  return {
    id: lighthouse.Id.toString(),
    name: lighthouse.Name,
    description: lighthouse.Description || '',
    lat: lighthouse.Latitude || 0,
    lon: lighthouse.Longitude || 0,
    elevation: lighthouse.Elevation,
  };
}

/**
 * Converts from internal format to API format
 */
export function convertToApiFormat(lighthouse: LighthouseInternal): Lighthouse {
  return {
    Id: parseInt(lighthouse.id, 10),
    Name: lighthouse.name,
    Description: lighthouse.description,
    Latitude: lighthouse.lat,
    Longitude: lighthouse.lon,
    Elevation: lighthouse.elevation,
  };
}
