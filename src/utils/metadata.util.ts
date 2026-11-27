import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export function createMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  return {
    description,
    openGraph: {
      title: `${title} | GridGuard`,
      description,
      type: "website",
      url: `${BASE_URL}${path}`,
    },
  };
}