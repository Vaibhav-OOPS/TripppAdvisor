'use client';
import dynamic from 'next/dynamic';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Dynamically import MapContent component with SSR disabled
const MapContent = dynamic(() => import('./MapContent'), { ssr: false });

type Props = { place: string };

type Coords = { lat: number; lon: number; display: string } | null;
type Weather = { temp: number; rainProb: number } | null;
type Wiki = { summary: string; image: string };
type PlaceMarker = { name: string; lat: number; lon: number };

// Example: <PlaceDetails place="Delhi" />
export default function PlaceDetails({ place }: Props) {
  const [coords, setCoords] = useState<Coords>(null);
  const [weather, setWeather] = useState<Weather>(null);
  const [attractions, setAttractions] = useState<PlaceMarker[]>([]);
  const [wiki, setWiki] = useState<Wiki>({ summary: '', image: '' });

  useEffect(() => {
    (async () => {
      if (!place) return;
      try {
        // Nominatim: Get coordinates
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
        );
        if (!res.data || res.data.length === 0) return;
        const { lat, lon, display_name } = res.data[0];
        setCoords({ lat: Number(lat), lon: Number(lon), display: display_name });

        // Open-Meteo: Get weather
        const wRes = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation_probability&timezone=auto`
        );
        setWeather({
          temp: wRes.data.current_weather.temperature,
          rainProb: wRes.data.hourly.precipitation_probability?.[0],
        });

        // Overpass: Get attractions (build lat/lon for markers)
        const body = `
          [out:json];
          (node["tourism"](around:3000,${lat},${lon});
            way["tourism"](around:3000,${lat},${lon});
            relation["tourism"](around:3000,${lat},${lon});
          );
          out center;
        `;
        const pRes = await axios.post('https://overpass-api.de/api/interpreter', body, {
          headers: { 'Content-Type': 'text/plain' },
        });
        const elements = pRes.data?.elements || [];
        const placeMarkers: PlaceMarker[] = elements
          .map((e: any) => {
            const pt = e.type === 'node'
              ? { lat: e.lat, lon: e.lon }
              : { lat: e.center?.lat, lon: e.center?.lon };
            return e.tags?.name && pt?.lat && pt?.lon
              ? { name: e.tags.name, lat: pt.lat, lon: pt.lon }
              : null;
          })
          .filter(Boolean)
          .slice(0, 5);
        setAttractions(placeMarkers);

        // Wikipedia: Get summary and image
        try {
          const wikiRes = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place.split(',')[0].trim())}`
          );
          setWiki({
            summary: wikiRes.data.extract || '',
            image: wikiRes.data.originalimage?.source || wikiRes.data.thumbnail?.source || '',
          });
        } catch {
          setWiki({ summary: '', image: '' });
        }
      } catch (err) {
        // Handle fetch errors here for real apps
      }
    })();
  }, [place]);

  if (!coords) return <div className="text-white">Please enter a valid place.</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Map display -- always client-only, dynamically imported */}
      <div className="rounded-lg overflow-hidden mb-2 relative z-10 h-[300px]">
        <MapContent
          lat={coords.lat}
          lon={coords.lon}
          display={coords.display}
          places={attractions}
        />
      </div>

      {/* Weather widget */}
      <div className="bg-blue-200 rounded-lg p-3 relative z-10">
        <span className="font-bold text-blue-900">Current Weather:</span>
        <div className="text-blue-800">
          Temperature: {weather?.temp}°C | Rain probability: {weather?.rainProb}%
        </div>
      </div>

      {/* Wiki image and summary (white text) */}
      <div className="flex gap-4 items-center bg-black/60 backdrop-blur-md p-4 rounded-lg shadow-lg mb-4 relative z-10">
        {wiki.image && (
          <img
            src={wiki.image}
            alt={coords.display}
            className="w-28 h-28 object-cover rounded-md flex-shrink-0 shadow-md"
          />
        )}
        <div className="flex flex-col">
          <div className="font-bold text-green-300 mb-2">{coords.display}</div>
          <div className="text-white">{wiki.summary}</div>
        </div>
      </div>
      
      {/* Attractions */}
      <div className="bg-green-100 rounded-lg p-3 relative z-10">
        <span className="font-bold text-green-900">Top Attractions Nearby:</span>
        <ul className="text-green-700 list-disc ml-6">
          {attractions.length > 0 ? attractions.map((marker, i) => (
            <li key={i}>{marker.name}</li>
          )) : <li>No major tourist attractions found.</li>}
        </ul>
      </div>
    </div>
  );
}
