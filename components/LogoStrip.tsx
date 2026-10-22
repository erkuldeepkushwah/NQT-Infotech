import { clientLogos } from "@/lib/site";

// Infinite logo carousel, matching the Brivora template's ticker: the row is
// rendered twice and each group slides by its own width plus the gap, so the
// loop is seamless. Item width, gap and speed all come from logs.tsx.
export default function LogoStrip() {
  return (
    <div className="logo-carousel">
      <div className="logo-track">
        {[0, 1].map((copy) => (
          <div className="logo-group" key={copy} aria-hidden={copy === 1}>
            {clientLogos.map((src) => (
              <div className="logo-item" key={src}>
                <img
                  src={src}
                  alt={copy === 0 ? "Client logo" : ""}
                  width={800}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="logo-img"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
