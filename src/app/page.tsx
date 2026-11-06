import { AppShell } from "@/components/layout/AppShell";
import { JsonLd, howToSchema, faqPageSchema } from "@/components/seo/JsonLd";
import { FAQS } from "@/data/faqs";

export default function Home() {
  return (
    <>
      <AppShell />
      <JsonLd data={howToSchema()} />
      <JsonLd data={faqPageSchema(FAQS.slice(0, 8))} />
    </>
  );
}
