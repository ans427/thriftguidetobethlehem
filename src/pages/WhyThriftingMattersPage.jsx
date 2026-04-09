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
            Fast fashion may be affordable and convenient, but it comes with a major
            environmental cost. The fashion industry is responsible for roughly 10% of global
            carbon emissions, putting it on a similar scale to emissions from the European Union.
            Even more concerning, emissions from textile production are projected to grow by over
            60% by 2030 if current consumption patterns continue.
          </p>
          <p>
            Much of this environmental impact comes from how clothing is made. Resource-heavy
            processes like dyeing, finishing fabrics, and preparing yarn are among the largest
            contributors to pollution within the industry. Beyond production, everyday habits also
            play a role - washing synthetic clothing releases an estimated 500,000 tons of
            microfibers into oceans each year, which is comparable to 50 billion plastic bottles
            entering marine environments.
          </p>
          <p>
            Fast fashion encourages a cycle of overconsumption, where clothing is worn only a few
            times before being discarded. This leads to increased waste, higher emissions, and
            unnecessary strain on natural resources.
          </p>
          <p>
            Thrifting offers a more sustainable alternative. By choosing secondhand clothing, you
            help reduce demand for new production, extend the life of existing garments, and
            minimize waste. Small choices like this can collectively make a meaningful impact on
            reducing the environmental footprint of fashion.
          </p>
          <p className="source-note">
            Source:{" "}
            <a
              href="https://earth.org/fast-fashions-detrimental-effect-on-the-environment/"
              target="_blank"
              rel="noreferrer"
            >
              Earth.Org - The Environmental Impact of Fast Fashion, Explained
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
