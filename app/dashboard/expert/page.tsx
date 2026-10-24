import type { Metadata } from "next";
import Experts from "./Experts";

export const metadata: Metadata = {
  title: "Expert",
  description: "Ask a professor about your track.",
};

export default function ExpertPage() {
  return <Experts />;
}
