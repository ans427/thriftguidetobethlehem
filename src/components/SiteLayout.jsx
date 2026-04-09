import { Link, NavLink, Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <div className="site">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-brand">
            <img src="/logo.png" alt="Thrift Guide Bethlehem logo" className="site-brand-logo" />
            <span className="site-brand-text">
              <span className="site-brand-name">Thrift Guide</span>
              <span className="site-brand-tag">Bethlehem, PA</span>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `site-nav-link${isActive ? " is-active" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/stores"
              className={({ isActive }) =>
                `site-nav-link${isActive ? " is-active" : ""}`
              }
            >
              Stores
            </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) => `site-nav-link${isActive ? " is-active" : ""}`}
            >
              Map
            </NavLink>
            <Link to="/why-thrifting-matters" className="site-nav-link">
              Why it matters
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-top">
            <div className="site-footer-brand">
              <strong className="site-footer-title">Thrift Guide to Bethlehem</strong>
              <p>
                Find resale and thrift in the Lehigh Valley, and learn how secondhand shopping
                eases the footprint of fast fashion.
              </p>
            </div>
            <div className="site-footer-col">
              <span className="site-footer-heading">Explore</span>
              <ul className="site-footer-list">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/stores">Thrift stores</Link>
                </li>
                <li>
                  <Link to="/map">Map</Link>
                </li>
                <li>
                  <Link to="/why-thrifting-matters">Why thrifting matters</Link>
                </li>
              </ul>
            </div>
            <div className="site-footer-icon-wrap" aria-hidden="true">
              <img src="/favicon-logo.png" alt="" className="site-footer-icon" />
            </div>
          </div>
          <div className="site-footer-bottom">
            <p>Sustainability education project — reduce waste, reuse what already exists.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
