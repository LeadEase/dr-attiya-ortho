import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://drattiyaortho.co.uk/clear-aligners", lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
