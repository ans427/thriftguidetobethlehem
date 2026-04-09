import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fallbackStores } from "../data/fallbackContent";
import { storePath } from "../lib/storePath";
import { hasSanityEnv, sanityClient } from "../lib/sanity";

const allStoresQuery = `*[_type == "thriftStore"] | order(name asc)[0...300]{
  _id,
  name,
  slug,
  neighborhood,
  address,
  description,
  categories,
  donationDropoff,
  priceRange,
  "hasPhotos": defined(photos[0])
}`;

const quickFilterTags = [
  "vintage",
  "secondhand",
  "thrift",
  "consignment",
  "affordable",
  "student-friendly",
  "non-profit",
  "curated",
  "furniture",
  "family clothing"
];

function includesQuery(shop, query) {
  const haystack = [
    shop.name,
    shop.neighborhood,
    shop.address,
    shop.description,
    ...(shop.categories || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function StoresPage() {
  const [stores, setStores] = useState(fallbackStores);
  const [loading, setLoading] = useState(hasSanityEnv);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [neighborhood, setNeighborhood] = useState("all");
  const [category, setCategory] = useState("all");
  const [donationOnly, setDonationOnly] = useState(false);
  const [photoOnly, setPhotoOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeQuickTags, setActiveQuickTags] = useState([]);
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    async function loadStores() {
      if (!sanityClient) return;
      try {
        setLoading(true);
        const docs = await sanityClient.fetch(allStoresQuery);
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

  const neighborhoods = useMemo(() => {
    return Array.from(new Set(stores.map((s) => s.neighborhood).filter(Boolean))).sort();
  }, [stores]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        stores.flatMap((s) => (Array.isArray(s.categories) ? s.categories : [])).filter(Boolean)
      )
    ).sort();
  }, [stores]);

  const filteredStores = useMemo(() => {
    let result = [...stores];

    if (search.trim()) {
      result = result.filter((shop) => includesQuery(shop, search.trim()));
    }
    if (neighborhood !== "all") {
      result = result.filter((shop) => (shop.neighborhood || "") === neighborhood);
    }
    if (category !== "all") {
      result = result.filter((shop) => (shop.categories || []).includes(category));
    }
    if (donationOnly) {
      result = result.filter((shop) => Boolean(shop.donationDropoff));
    }
    if (photoOnly) {
      result = result.filter((shop) => Boolean(shop.hasPhotos));
    }
    if (priceFilter !== "all") {
      result = result.filter((shop) => (shop.priceRange || "").trim() === priceFilter);
    }
    if (activeQuickTags.length > 0) {
      result = result.filter((shop) => {
        const tags = (shop.categories || []).map((t) => String(t).toLowerCase());
        return activeQuickTags.every((selected) => tags.some((tag) => tag.includes(selected)));
      });
    }

    result.sort((a, b) => {
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "neighborhood") {
        return (a.neighborhood || "zzzz").localeCompare(b.neighborhood || "zzzz");
      }
      return (a.name || "").localeCompare(b.name || "");
    });

    return result;
  }, [stores, search, neighborhood, category, donationOnly, photoOnly, priceFilter, activeQuickTags, sortBy]);

  const priceRanges = useMemo(() => {
    return Array.from(new Set(stores.map((s) => (s.priceRange || "").trim()).filter(Boolean))).sort();
  }, [stores]);

  return (
    <div className="page stores-page">
      <header className="hero stores-hero">
        <p className="eyebrow">Directory</p>
        <h1>Find Bethlehem Thrift Stores</h1>
        <p className="hero-copy">
          Search and filter local thrift spots by neighborhood, category, and donation options.
        </p>
        <p className="status-note">
          {filteredStores.length} result{filteredStores.length === 1 ? "" : "s"}
          {loading ? " (loading...)" : ""}
        </p>
        {error && <p className="status-note warning">{error}</p>}
      </header>

      <section className="card store-filters">
        <div className="filter-grid">
          <label className="filter-label">
            Search
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Store name, category, address..."
            />
          </label>

          <label className="filter-label">
            Neighborhood
            <select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
              <option value="all">All neighborhoods</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-label">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-label">
            Price range
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="all">All price ranges</option>
              {priceRanges.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-label">
            Sort by
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="neighborhood">Neighborhood</option>
            </select>
          </label>
        </div>

        <div className="quick-filter-wrap">
          <span className="quick-filter-label">Quick filters:</span>
          <div className="quick-filter-chips">
            {quickFilterTags.map((tag) => {
              const isActive = activeQuickTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`quick-filter-chip${isActive ? " active" : ""}`}
                  onClick={() => {
                    setActiveQuickTags((prev) =>
                      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                    );
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="filter-actions">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={donationOnly}
                onChange={(e) => setDonationOnly(e.target.checked)}
              />
              Donation drop-off only
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={photoOnly}
                onChange={(e) => setPhotoOnly(e.target.checked)}
              />
              Has store photos
            </label>
          </div>

          <button
            type="button"
            className="hero-btn hero-btn--ghost"
            onClick={() => {
              setSearch("");
              setNeighborhood("all");
              setCategory("all");
              setDonationOnly(false);
              setPhotoOnly(false);
              setPriceFilter("all");
              setActiveQuickTags([]);
              setSortBy("name-asc");
            }}
          >
            Reset filters
          </button>
        </div>
      </section>

      <section className="content">
        <div className="shop-grid">
          {filteredStores.map((shop) => (
            <Link key={shop._id || shop.name} to={storePath(shop)} className="shop-card-link">
              <article className="shop-card">
                <h3>{shop.name}</h3>
                <p>{shop.neighborhood || "Bethlehem area"}</p>
                {shop.address && <p className="shop-meta">{shop.address}</p>}
                <div className="shop-badges">
                  {shop.priceRange && <span className="shop-badge">Price: {shop.priceRange}</span>}
                  {shop.donationDropoff && <span className="shop-badge">Donations</span>}
                </div>
                <span className="shop-card-cta">View details →</span>
              </article>
            </Link>
          ))}
        </div>

        {!loading && filteredStores.length === 0 && (
          <section className="card">
            <h2>No stores match these filters</h2>
            <p className="muted">Try removing a filter or using fewer keywords in search.</p>
          </section>
        )}
      </section>
    </div>
  );
}
