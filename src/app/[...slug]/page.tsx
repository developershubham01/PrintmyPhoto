import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd, howToSchema } from "@/components/seo/JsonLd";
import { ROUTE_META, parsePath } from "@/lib/routes";

interface CatchAllPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = "/" + (slug?.join("/") || "");
  const match = parsePath(path);
  const meta = ROUTE_META[match.route];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default function CatchAllPage() {
  return (
    <>
      <AppShell />
      <JsonLd data={howToSchema()} />
    </>
  );
}
