import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoreComments from "../components/StoreComments";
import { fallbackStores } from "../data/fallbackContent";
import { sanityClient } from "../lib/sanity";

const storeQuery = `*[_type == "thriftStore" && (slug.current == $ref || _id == $ref)][0]{
  _id,
  name,
  slug,
  address,
  neighborhood,
  hours,
  priceRange,
  donationDropoff,
  categories,
  website,
  instagram,
  description,
  "lat": coordinates.lat,
  "lng": coordinates.lng
}`;

function findFallbackStore(ref) {
  if (!ref) return undefined;
  const decoded = decodeURIComponent(ref);
  return fallbackStores.find(
    (s) => s._id === decoded || s.slug?.current === decoded
  );
}

export default function StoreDetailPage() {
  const { storeRef } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const rawRef = storeRef || "";
      const ref = rawRef ? decodeURIComponent(rawRef) : "";

      setLoading(true);

      if (sanityClient && ref) {
        try {
          const doc = await sanityClient.fetch(storeQuery, { ref });
          if (cancelled) return;
          if (doc) {
            setStore(doc);
            setNotFound(false);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      const local = findFallbackStore(rawRef);
      if (cancelled) return;

      if (local) {
        setStore(local);
        setNotFound(false);
      } else {
        setStore(null);
        setNotFound(true);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [storeRef]);

  if (loading) {
    return (
      <div className="page">
        <p className="status-note">Loading store…</p>
        <Link to="/" className="text-link">
          ← Back to home
        </Link>
      </div>
    );
  }

  if (notFound || !store) {
    return (
      <div className="page">
        <h1>Store not found</h1>
        <p>This thrift store does not exist or the link is outdated.</p>
        <Link to="/" className="text-link">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="page store-detail">
      <Link to="/" className="text-link back-link">
        ← All stores
      </Link>

      <header className="store-detail-header">
        <p className="eyebrow">{store.neighborhood || "Bethlehem area"}</p>
        <h1>{store.name}</h1>
        {store.priceRange && <p className="price-badge">Price: {store.priceRange}</p>}
      </header>

      <div className="content store-detail-grid">
        <section className="card">
          <h2>About</h2>
          {store.description ? (
            <p className="store-description">{store.description}</p>
          ) : (
            <p className="muted">No description yet—add one in Sanity for this store.</p>
          )}

          {!!(store.categories && store.categories.length) && (
            <>
              <h3 className="subheading">Tags</h3>
              <ul className="tag-list">
                {store.categories.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="card">
          <h2>Visit</h2>
          <dl className="detail-dl">
            {store.address && (
              <>
                <dt>Address</dt>
                <dd>{store.address}</dd>
              </>
            )}
            {store.hours && (
              <>
                <dt>Hours</dt>
                <dd>{store.hours}</dd>
              </>
            )}
            <dt>Donations</dt>
            <dd>{store.donationDropoff ? "Drop-off accepted (confirm in store)" : "Unknown / call ahead"}</dd>
          </dl>

          <div className="store-links">
            {store.website && (
              <a href={store.website} className="button-link" target="_blank" rel="noreferrer">
                Website
              </a>
            )}
            {store.instagram && (
              <a href={store.instagram} className="button-link ghost" target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
          </div>

          {(store.lat != null && store.lng != null) && (
            <p className="muted coordinates-note">
              Map coordinates: {Number(store.lat).toFixed(4)}, {Number(store.lng).toFixed(4)}
            </p>
          )}
        </section>
      </div>

      <StoreComments storeId={store._id} storeName={store.name} />
    </div>
  );
}
