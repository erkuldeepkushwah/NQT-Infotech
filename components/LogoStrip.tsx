import { clientLogos } from "@/lib/site";
import { logo } from "@/lib/images";

// Infinite logo carousel: the row is rendered twice and the track is translated
// by -50%, so the loop is seamless. Hovering pauses it.
export default function LogoStrip() {
  const track = [...clientLogos, ...clientLogos];

  return (
    <div className="logo-carousel relative overflow-hidden">
      <div className="logo-track flex w-max items-center gap-12 sm:gap-16">
        {track.map((name, index) => (
          <img
            key={name + "-" + index}
            src={logo(name)}
            alt={name}
            width={210}
            height={48}
            loading="lazy"
            aria-hidden={index >= clientLogos.length}
            className="h-9 w-auto flex-none object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 sm:h-11"
          />
        ))}
      </div>

      {/* soft edges so the logos fade in and out rather than being cut */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" />
    </div>
  );
}
