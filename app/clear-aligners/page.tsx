import type { Metadata } from "next";
import ClearAlignersLanding from "./landing";

export const metadata: Metadata = {
  alternates: { canonical: "/clear-aligners" },
};

export default function Page() {
  return <ClearAlignersLanding />;
}
