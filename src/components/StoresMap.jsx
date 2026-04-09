import { Link } from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { storePath } from "../lib/storePath";

const BETHLEHEM_CENTER = [40.6259, -75.3705];

function isValidCoord(value) {
  return Number.isFinite(Number(value));
}

function getMappableStores(stores) {
  return (stores || []).filter((store) => isValidCoord(store.lat) && isValidCoord(store.lng));
}

function getCenter(storesWithCoords) {
  if (!storesWithCoords.length) return BETHLEHEM_CENTER;

  const sums = storesWithCoords.reduce(
    (acc, store) => ({
      lat: acc.lat + Number(store.lat),
      lng: acc.lng + Number(store.lng)
    }),
    { lat: 0, lng: 0 }
  );

  return [sums.lat / storesWithCoords.length, sums.lng / storesWithCoords.length];
}

export default function StoresMap({ stores }) {
  const mappableStores = getMappableStores(stores);
  const center = getCenter(mappableStores);

  if (!mappableStores.length) {
    return (
      <p className="muted">
        No store coordinates yet. Add coordinates in Sanity to place stores on the map.
      </p>
    );
  }

  return (
    <div className="stores-map-wrap">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="stores-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mappableStores.map((store) => (
          <CircleMarker
            key={store._id || store.slug?.current || store.name}
            center={[Number(store.lat), Number(store.lng)]}
            radius={12}
            pathOptions={{ color: "#1b4332", fillColor: "#2d6a4f", fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <div className="map-popup">
                <strong>{store.name}</strong>
                <p>{store.neighborhood || "Bethlehem area"}</p>
                {store.address && <p>{store.address}</p>}
                <Link to={storePath(store)} className="text-link">
                  View store details
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
