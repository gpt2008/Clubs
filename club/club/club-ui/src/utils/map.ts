import { Coordinates, LocationByCoordinates, LocationDetailsWithAddress } from "types/entities/Location";
import LocationInfo from 'types/entities/Location';

//export const API_KEY = "AIzaSyA5HgrkTuOXHr0-Ux_PqNDyZhXxlbIEwYU";
export const API_KEY = "AIzaSyAe6LpgDS3xXQG5Reh8h-PHqrEji5Nm33k";

// Calcular el promedio de las latitudes y longitudes
export const calculateCenter = (points?: LocationInfo[]) => {
	if (!points) return { lat: 40.4165, lng: -3.70256 };

	let latSum = 0;
	let lngSum = 0;

	points.forEach((location) => {
		latSum += location.valueLat;
		lngSum += location.valueLong;
	});

	const centerLat = latSum / points.length;
	const centerLng = lngSum / points.length;

	return { lat: centerLat, lng: centerLng };
};

// Calcular el zoom del mapa
export const calculateZoom = (points: LocationInfo[]) => {
	// Puedes ajustar estos valores según tus necesidades
	console.log(points)
	const minLat = Math.min(...points.map((point) => point.valueLat));
	const maxLat = Math.max(...points.map((point) => point.valueLat));
	const minLng = Math.min(...points.map((point) => point.valueLong));
	const maxLng = Math.max(...points.map((point) => point.valueLong));
	
	// Calcula la diferencia entre las latitudes y longitudes máximas y mínimas
	const latSpan = maxLat - minLat;
	const lngSpan = maxLng - minLng;

	// Puedes ajustar este valor para controlar el nivel de zoom
	const maxZoom = 15;

	// Calcula el zoom basado en la diferencia entre las coordenadas
	const zoom = Math.min(
		maxZoom,
		Math.floor(Math.min(Math.log2(360 / lngSpan), Math.log2(180 / latSpan)))
	);

	return zoom;
};

const degreesToRadians = (degrees: number): number => {
	return degrees * (Math.PI / 180);
};

export const calculateDistance = (
	pos1: Coordinates,
	pos2: Coordinates,
	unit: string = "km"
): number => {
	const R = unit === "km" ? 6371 : 3958.8; // Radio de la Tierra en kilómetros o millas

	const lat1Rad = degreesToRadians(pos1.latitude);
	const lon1Rad = degreesToRadians(pos1.longitude);
	const lat2Rad = degreesToRadians(pos2.latitude);
	const lon2Rad = degreesToRadians(pos2.longitude);

	const deltaLat = lat2Rad - lat1Rad;
	const deltaLon = lon2Rad - lon1Rad;

	const a =
		Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
		Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = R * c;

	return distance;
};

export const getLocationNameByCoordinates = async (location: Coordinates) => {
	var url =
		"https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
		location.latitude +
		"," +
		location.longitude +
		"&key=" +
		API_KEY;

	const response = await fetch(url);
	const data = await response.json();

	if (data.status === "OK") {
		return {status: data.status, data: data.results[0].formatted_address};
	} else {
		return {status: data.status};
	}
};
