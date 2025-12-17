import ActiveCounter from "@/app/ActiveCounter";
import adminDB from "@/lib/instantAdmin";
import { Metadata } from "next";
import Home from "@/app/Home";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Stepan Parunashvili",
  description: "Read Essays by Stepan Parunashvili",
  alternates: {
    canonical: "https://stopa.io",
    types: {
      "application/rss+xml": "https://stopa.io/feed.rss",
      "application/atom+xml": "https://stopa.io/feed.atom",
    },
  },
};

export default async function Page() {
  return <Home />;
}
