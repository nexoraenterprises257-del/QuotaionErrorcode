import { createFileRoute } from "@tanstack/react-router";
import { QuotationBuilder } from "@/components/quotation/QuotationBuilder";

const title = "Quotation Manager — Nexora Enterprise CPaaS";
const description =
  "Build, price and export professional A4 enterprise proposals for WhatsApp API, Bulk SMS (TRAI DLT), RCS, CPaaS, Voice OBD, IVR and SMPP.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotationBuilder,
});
