import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fallbackResources, fallbackStores } from "../data/fallbackContent";
import { storePath } from "../lib/storePath";
import { hasSanityEnv, sanityClient } from "../lib/sanity";

const storesQuery = `*[_type == "thriftStore" && featured == true] | order(name asc)[0...50]{
  _id,
  name,
  neighborhood,
  categories,
  slug
}`;

const resourcesQuery = `*[_type == "resourceArticle" && featured == true] | order(_createdAt desc)[0...5]{
  _id,
  title,
  summary
}`;

export default function HomePage() {
  const [stores, setStores] = useState(fallbackStores);
  const [resources, setResources] = useState(fallbackResources);
  const [loading, setLoading] = useState(hasSanityEnv);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSanityContent() {
      if (!sanityClient) return;

      try {
        setLoading(true);
        const [storeDocs, resourceDocs] = await Promise.all([
          sanityClient.fetch(storesQuery),
          sanityClient.fetch(resourcesQuery)
        ]);

        if (storeDocs?.length) setStores(storeDocs);
        if (resourceDocs?.length) setResources(resourceDocs);
      } catch (fetchError) {
        setError(
          "Using local fallback content. If the console shows CORS, add http://localhost:5173 under Sanity Manage → API → CORS origins. For a private dataset, set VITE_SANITY_API_READ_TOKEN in .env (see .env.example)."
        );
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    }

    loadSanityContent();
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Bethlehem, PA</p>
        <h1>Thrift Guide to Bethlehem</h1>
        <p className="hero-copy">
          Discover local thrift stores, learn the environmental impact of fast fashion,
          and make more sustainable shopping choices.
        </p>
        <div className="hero-actions">
          <Link to="/#map" className="hero-btn hero-btn--primary">
            Explore map
          </Link>
          <Link to="/#facts" className="hero-btn hero-btn--ghost">
            Why fast fashion matters
          </Link>
          <Link to="/stores" className="hero-btn hero-btn--ghost">
            Browse all stores
          </Link>
        </div>
        {!hasSanityEnv && (
          <p className="status-note">
            Add `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` to use live CMS data.
          </p>
        )}
        {loading && <p className="status-note">Loading Sanity content...</p>}
        {error && <p className="status-note warning">{error}</p>}
      </header>

      <div className="content">
        <section id="stores" className="card section-anchor">
          <h2>Featured Thrift Spots</h2>
          <p className="section-hint">Click a store for hours, location, and links.</p>
          <div className="shop-grid">
            {stores.map((shop) => (
              <Link key={shop._id || shop.name} to={storePath(shop)} className="shop-card-link">
                <article className="shop-card">
                  <h3>{shop.name}</h3>
                  <p>{shop.neighborhood || "Bethlehem area"}</p>
                  <ul>
                    {(shop.categories || []).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <span className="shop-card-cta">View details →</span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section id="map" className="card map-placeholder section-anchor">
          <h2>Interactive Map (next step)</h2>
          <p>
            This section is ready for Mapbox or Leaflet. You can plot shops, filter by
            neighborhood, and click markers for hours, price range, and donation info.
          </p>
          <div className="fake-map" aria-label="Map placeholder">
            Map Component Placeholder
          </div>
        </section>

        <section id="facts" className="card section-anchor">
          <h2>Fast Fashion Facts</h2>
          <ul className="facts-list">
            {resources.map((resource) => (
              <li key={resource._id}>{resource.title || resource.summary}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
