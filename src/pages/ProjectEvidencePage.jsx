export default function ProjectEvidencePage() {
  return (
    <div className="page">
      <div className="content">
        <section className="card">
          <h1>Project Goals, Impact, and Evidence</h1>
          <p className="muted">
            This page documents how the project aligns with EES 102 final project requirements.
          </p>
        </section>

        <section className="card">
          <h2>Topic and Issue Significance</h2>
          <p>
            This project focuses on fast fashion, textile waste, and local sustainable consumption
            behavior in Bethlehem, PA. Fast fashion increases greenhouse gas emissions, resource
            use, and waste generation. The app translates environmental science into local action
            by helping users locate secondhand options and understand the sustainability impact of
            thrifting.
          </p>
        </section>

        <section className="card">
          <h2>Target Audience</h2>
          <ul className="facts-list">
            <li>Lehigh University students and nearby residents who buy clothing regularly.</li>
            <li>Cost-conscious shoppers looking for affordable alternatives to fast fashion.</li>
            <li>Community members interested in sustainability but needing practical next steps.</li>
          </ul>
        </section>

        <section className="card">
          <h2>Action/Solution and Feasibility</h2>
          <p>
            The solution is a public, sharable web app that makes secondhand shopping easier and
            more attractive by combining an interactive map, store filters, store detail pages, and
            a community comments/photos section.
          </p>
          <ul className="facts-list">
            <li>Action: shift purchases from new fast-fashion items to secondhand alternatives.</li>
            <li>Feasibility: implemented now with React, Sanity CMS, and deployed web hosting.</li>
            <li>
              Tangible outputs: local store directory, map page, educational content, and user
              engagement features.
            </li>
            <li>
              Impact pathway: reduced demand for new textile production and longer garment life.
            </li>
          </ul>
        </section>

        <section className="card">
          <h2>Goals and Intended Impact</h2>
          <ul className="facts-list">
            <li>Increase awareness of fast fashion externalities among local users.</li>
            <li>Increase discovery and use of local thrift stores in Bethlehem.</li>
            <li>Encourage behavior change through practical, location-specific alternatives.</li>
            <li>Create a reusable outreach tool for sustainability education.</li>
          </ul>
        </section>

        <section className="card">
          <h2>Multiple Perspectives Considered</h2>
          <ul className="facts-list">
            <li>
              <strong>Economic:</strong> Thrifting lowers consumer costs and supports circular
              local markets.
            </li>
            <li>
              <strong>Political/Policy:</strong> Textile waste and producer responsibility policy
              influence supply chains and disposal outcomes.
            </li>
            <li>
              <strong>Ethical:</strong> Fast fashion labor conditions and environmental justice
              impacts are part of purchasing decisions.
            </li>
            <li>
              <strong>Beyond humans:</strong> Reduced textile waste and pollution can benefit
              ecosystems and waterways.
            </li>
          </ul>
        </section>

        <section className="card">
          <h2>Sources, Credibility, and Potential Bias</h2>
          <div className="source-review-list">
            <article className="source-review-item">
              <h3>Earth.Org (2026)</h3>
              <p>
                <strong>Type:</strong> Environmental journalism/explainer.
              </p>
              <p>
                <strong>Credibility:</strong> Useful for accessible synthesis and public outreach.
              </p>
              <p>
                <strong>Potential bias:</strong> As an advocacy-oriented environmental platform, the article may emphasize urgency and highlight negative impacts more strongly than neutral sources; key claims should be cross-checked with peer-reviewed and institutional research.
              </p>
              <p>
                <a
                  href="https://earth.org/fast-fashions-detrimental-effect-on-the-environment/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://earth.org/fast-fashions-detrimental-effect-on-the-environment/
                </a>
              </p>
            </article>

            <article className="source-review-item">
              <h3>UN Environment Programme (UNEP) - Sustainable Fashion</h3>
              <p>
                <strong>Type:</strong> Intergovernmental organization resource.
              </p>
              <p>
                <strong>Credibility:</strong> High institutional credibility and global policy
                relevance.
              </p>
              <p>
                <strong>Potential bias:</strong> As an intergovernmental organization, the content reflects global policy priorities and consensus framing, which may emphasize high-level solutions while underrepresenting local implementation challenges and context-specific constraints.

              </p>
              <p>
                <a href="https://www.unep.org/sustainable-fashion" target="_blank" rel="noreferrer">
                  https://www.unep.org/.../sustainable-fashion
                </a>
              </p>
            </article>

            <article className="source-review-item">
              <h3>U.S. EPA - Textiles: Material-Specific Data</h3>
              <p>
                <strong>Type:</strong> Government data/resource page.
              </p>
              <p>
                <strong>Credibility:</strong> High for U.S. waste metrics and methodology clarity.
              </p>
              <p>
                <strong>Potential bias:</strong> U.S.-focused dataset may not represent global
                supply chain impacts.
              </p>
              <p>
                <a href="https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/textiles-material-specific-data" target="_blank" rel="noreferrer">
                  https://www.epa.gov/.../textiles-material-specific-data
                </a>
              </p>
            </article>

            <article className="source-review-item">
              <h3>U.S. Government Accountability Office (GAO) Blog - Fast Fashion</h3>
              <p>
                <strong>Type:</strong> U.S. government blog/explainer.
              </p>
              <p>
                <strong>Credibility:</strong> Strong institutional credibility and policy context.
              </p>
              <p>
                <strong>Potential bias:</strong> Framed through U.S. policy and oversight priorities;
                less detail on non-U.S. local thrift market differences.
              </p>
              <p>
                <a href="https://www.gao.gov/blog/fast-fashion-great-your-wallet-costly-planet" target="_blank" rel="noreferrer">
                  https://www.gao.gov/blog/fast-fashion-great-your-wallet-costly-planet
                </a>
              </p>
            </article>

            <article className="source-review-item">
              <h3>IPCC AR6 Synthesis Report</h3>
              <p>
                <strong>Type:</strong> Peer-reviewed climate assessment synthesis.
              </p>
              <p>
                <strong>Credibility:</strong> Highest-quality consensus source on climate science.
              </p>
              <p>
                <strong>Potential bias:</strong> Conservative consensus process can understate
                uncertainty tails and rapid social dynamics.
              </p>
              <p>
                <a href="https://www.ipcc.ch/report/ar6/syr/" target="_blank" rel="noreferrer">
                  https://www.ipcc.ch/report/ar6/syr/
                </a>
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
