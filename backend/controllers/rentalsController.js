import { errorHandler } from "../utils/error.js";

// Fetch city coordinates using Nominatim API
const getCityCoords = async (city) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'SmartRentalFinder/1.0' }
  });
  const data = await response.json();
  if (data.length === 0) throw new Error("City not found");
  return { lat: data[0].lat, lon: data[0].lon };
};

// Fetch rentals using Overpass API
const getRentalsFromOSM = async (lat, lon) => {
  const query = `[out:json];node["amenity"="car_rental"](around:10000, ${lat}, ${lon});out;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  
  return data.elements.map(el => ({
    id: el.id,
    name: el.tags?.name || "Premium Car Rental",
    lat: el.lat,
    lon: el.lon,
    brand: el.tags?.brand || "Local",
    address: el.tags?.["addr:street"] || "Near City Center"
  }));
};

export const getRentals = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) return next(errorHandler(400, "City is required"));

    const coords = await getCityCoords(city);
    const rentals = await getRentalsFromOSM(coords.lat, coords.lon);

    res.status(200).json({
      success: true,
      city: city,
      coords,
      count: rentals.length,
      rentals
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, error.message || "Failed to fetch rental data"));
  }
};
