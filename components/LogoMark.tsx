// The Brivora mark on its own - a ring split into a blue arc and a light-blue
// arc. Colours are taken from the brand logo.
export default function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="flex-none"
    >
      <path d="M54.07 24.32A26 26 0 1 1 24.25 53.62" stroke="#046AFD" strokeWidth="18.5" fill="none" />
      <path d="M24 50A26 26 0 0 1 48.19 24.06" stroke="#39ACFD" strokeWidth="18.5" fill="none" />
    </svg>
  );
}
