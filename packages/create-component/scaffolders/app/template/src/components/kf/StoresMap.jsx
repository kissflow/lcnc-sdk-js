import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Real OpenStreetMap (Leaflet). Plots ONLY coordinates that come from the SDK — a
 * record's Geolocation field (`lat`/`lng`). No demo data and no static city→coordinate
 * lookups: if the records carry no coordinates, it says so honestly. Vector markers
 * avoid broken default-icon assets.
 */
export function StoresMap({ stores = [] }) {
  const points = (stores || [])
    .map((s) => ({
      name: s.name,
      at: s.lat != null && s.lng != null ? [Number(s.lat), Number(s.lng)] : null,
    }))
    .filter((s) => s.at && !Number.isNaN(s.at[0]) && !Number.isNaN(s.at[1]));

  if (!points.length) {
    return (
      <div className="kf-map kf-map-empty">
        <p className="kf-note">No location data yet — add coordinates to the Geolocation field in Kissflow.</p>
      </div>
    );
  }

  return (
    <div className="kf-map">
      <MapContainer center={points[0].at} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }} attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points.map((s, i) => (
          <CircleMarker key={i} center={s.at} radius={7} pathOptions={{ color: "#fff", weight: 2, fillColor: "#e2553b", fillOpacity: 1 }}>
            {s.name && <Tooltip>{s.name}</Tooltip>}
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
