type IconProps = {
  name: string;
  className?: string;
};

const paths: Record<string, string> = {
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0c2.5 2.5 4 6 4 10s-1.5 7.5-4 10m0-20c-2.5 2.5-4 6-4 10s1.5 7.5 4 10M2 12h20",
  phone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 16h2",
  cloud: "M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 18 18H7Z",
  code: "M8 6 2 12l6 6m8-12 6 6-6 6",
  sparkles: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Zm7 9 .9 2.1L22 15l-2.1.9L19 18l-.9-2.1L16 15l2.1-.9L19 12Z",
  shield: "M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z",
  check: "M20 6 9 17l-5-5",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  trend: "M3 17l6-6 4 4 7-7m0 0h-5m5 0v5",
  users: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m13-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm4 9v-1a4 4 0 0 0-3-3.9M11 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  mail: "M3 6h18v12H3V6Zm0 0 9 7 9-7",
  pin: "M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

export default function Icon({ name, className = "h-6 w-6" }: IconProps) {
  const d = paths[name] ?? paths.check;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
