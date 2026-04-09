import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StoresMap from "../components/StoresMap";
import { fallbackStores } from "../data/fallbackContent";
import { storePath } from "../lib/storePath";
import { hasSanityEnv, sanityClient } from "../lib/sanity";

const allStoresMapQuery = `*[_type == "thriftStore"] | order(name asc)[0...300]{
  _id,
  name,
  slug,
  address,
  neighborhood,
  "lat": coordinates.lat,
  "lng": coordinates.lng
}`;

function hasCoords(store) {
  return Number.isFinite(Number(store?.lat)) && Number.isFinite(Number(store?.lng));
}

export default function MapPage() {
  const [stores, setStores] = useState(fallbackStores);
  const [loading, setLoading] = useState(hasSanityEnv);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStores() {
      if (!sanityClient) return;

      try {
        setLoading(true);
        const docs = await sanityClient.fetch(allStoresMapQuery);
        if (docs?.length) setStores(docs);
      } catch (fetchError) {
        setError("Could not load all stores from Sanity. Showing local fallback stores.");
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    }

    loadStores();
  }, []);

  const storesWithCoords = useMemo(() => stores.filter(hasCoords), [stores]);
  const storesMissingCoords = useMemo(() => stores.filter((store) => !hasCoords(store)), [stores]);

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Map</p>
        <h1>Bethlehem Thrift Map</h1>
        <p className="hero-copy">
          Explore all stores you have added. Click a marker for quick details, then open the full
          store page.
        </p>
        <p className="status-note">
          {stores.length} total store{stores.length === 1 ? "" : "s"} • {storesWithCoords.length}{" "}
          on map
          {loading ? " (loading...)" : ""}
        </p>
        {error && <p className="status-note warning">{error}</p>}
      </header>

      <div className="content">
        <section className="card">
          <h2>Interactive Map</h2>
          <StoresMap stores={stores} />
        </section>

        <section className="card">
          <h2>All Included Stores</h2>
          <div className="map-store-list">
            {stores.map((store) => (
              <article key={store._id || store.slug?.current || store.name} className="map-store-item">
                <div>
                  <h3>{store.name}</h3>
                  <p className="muted">{store.neighborhood || "Bethlehem area"}</p>
                  {store.address && <p className="muted">{store.address}</p>}
                  {!hasCoords(store) && (
                    <p className="muted">Not pinned yet (add coordinates in Sanity to map it).</p>
                  )}
                </div>
                <Link to={storePath(store)} className="text-link">
                  View details
                </Link>
              </article>
            ))}
          </div>
        </section>

        {storesMissingCoords.length > 0 && (
          <section className="card">
            <h2>Stores Missing Coordinates</h2>
            <p className="muted">
              These stores are included on this page, but need `coordinates` in Sanity before they
              can appear as map markers.
            </p>
            <ul className="facts-list">
              {storesMissingCoords.map((store) => (
                <li key={`missing-${store._id || store.slug?.current || store.name}`}>
                  {store.name}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
