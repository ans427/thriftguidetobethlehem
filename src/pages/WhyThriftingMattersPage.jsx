import { Link } from "react-router-dom";

export default function WhyThriftingMattersPage() {
  return (
    <div className="page">
      <div className="content">
        <section className="card">
          <h1>Why Thrifting Matters</h1>
          <div className="impact-photo-grid" aria-label="Fast fashion waste photos">
            <figure className="impact-photo-figure">
              <img
                src="/fast-fashion-waste-1.png"
                alt="Large pile of discarded clothing in a landfill."
                className="impact-photo"
                loading="lazy"
              />
            </figure>
            <figure className="impact-photo-figure">
              <img
                src="/fast-fashion-waste-2.png"
                alt="Textile waste burning outdoors, releasing smoke."
                className="impact-photo"
                loading="lazy"
              />
            </figure>
            <figure className="impact-photo-figure">
              <img
                src="/fast-fashion-waste-3.png"
                alt="Mixed textile debris and clothing waste in an urban dump site."
                className="impact-photo"
                loading="lazy"
              />
            </figure>
          </div>
          <p>
            Fast fashion is often marketed as cheap and convenient, but its environmental costs are
            much higher than the price tag. Evidence from Earth.Org, UNEP, EPA, GAO, and the IPCC
            shows the issue is not just about clothing trends - it is about emissions, material
            throughput, and waste-system pressure.
          </p>
        </section>

        <section className="card">
          <h2>What the evidence shows</h2>
          <ul className="facts-list">
            <li>
              Fashion supply chains contribute significantly to greenhouse gas emissions, and
              projected growth in textile output creates additional climate risk.
            </li>
            <li>
              Production stages such as fiber processing, dyeing, and finishing are
              resource-intensive and add substantial water and chemical burdens.
            </li>
            <li>
              U.S. textile waste is huge: around 17 million tons in 2018. Of that total, only
              about 2.5 million tons were recovered through recycling (14.7%), leaving most
              materials to be trashed or burned.
            </li>
            <li>
              Recovery rates also stay low across categories. Clothing and footwear were recycled at
              roughly 13%, while household textiles like sheets and pillowcases reached only about
              15.8%.
            </li>
            <li>
              Synthetic fabrics can release microfibers during normal washing, contributing to
              aquatic pollution over time.
            </li>
          </ul>
        </section>

        <section className="card">
          <h2>Why this matters locally</h2>
          <p>
            In Bethlehem, these global impacts show up as local decisions: where we shop, how long
            we keep clothes, and whether items get reused or discarded. Thrifting is a practical
            way to interrupt the overconsumption cycle by extending garment life and reducing demand
            for new production.
          </p>
          <p>
            This project translates that evidence into action by combining education with tools:
            store discovery, map-based access, and community tips through comments and photos. The
            goal is to make the sustainable option easier to choose, not just easier to understand.
          </p>
        </section>

        <section className="card">
          <h2>Action steps that make an impact</h2>
          <ul className="facts-list">
            <li>Choose one secondhand purchase before buying new this month.</li>
            <li>Use the map and filters to find nearby stores that match your needs and budget.</li>
            <li>Donate or rehome usable clothing to keep garments in circulation longer.</li>
            <li>Share thrift finds to build social momentum around reuse.</li>
          </ul>
          <p>
            Individual choices alone will not solve the full problem, but consistent reuse behavior
            combined with policy and industry change can move the system toward sustainability.
          </p>
          <p className="source-note">
            Sources and credibility notes:{" "}
            <Link to="/project-evidence">See the Project evidence page</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
