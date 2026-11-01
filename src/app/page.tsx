import { AppShell } from "@/components/layout/AppShell";
import { JsonLd, howToSchema } from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <>
      <AppShell />
      <JsonLd data={howToSchema()} />
    </>
  );
}
