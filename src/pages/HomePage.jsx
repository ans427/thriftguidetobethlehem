import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fallbackStores } from "../data/fallbackContent";
import { storePath } from "../lib/storePath";
import { hasSanityEnv, sanityClient } from "../lib/sanity";

const storesQuery = `*[_type == "thriftStore" && featured == true] | order(name asc)[0...50]{
  _id,
  name,
  neighborhood,
  categories,
  slug
}`;

export default function HomePage() {
  const [stores, setStores] = useState(fallbackStores);
  const [loading, setLoading] = useState(hasSanityEnv);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSanityContent() {
      if (!sanityClient) return;

      try {
        setLoading(true);
        const storeDocs = await sanityClient.fetch(storesQuery);

        if (storeDocs?.length) setStores(storeDocs);
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
          <Link to="/map" className="hero-btn hero-btn--primary">
            Explore map
          </Link>
          <Link to="/why-thrifting-matters" className="hero-btn hero-btn--ghost">
            Why thrifting matters
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
                  <span className="shop-card-cta">View details →</span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Interactive Map</h2>
          <p>
            Open the dedicated map page to view all stores you have added and explore markers with
            full details.
          </p>
          <Link to="/map" className="hero-btn hero-btn--ghost">
            Open full map
          </Link>
        </section>

        <section className="card">
          <h2>Why Thrifting Matters</h2>
          <p>
            Learn how secondhand shopping reduces textile waste, lowers demand for new production,
            and helps combat the environmental impact of fast fashion.
          </p>
          <Link to="/why-thrifting-matters" className="hero-btn hero-btn--ghost">
            Read the full guide
          </Link>
        </section>
      </div>
    </div>
  );
}
