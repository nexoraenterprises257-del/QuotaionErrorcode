import { createFileRoute } from "@tanstack/react-router";
import { QuotationBuilder } from "@/components/quotation/QuotationBuilder";

const title = "SMS & DLT Error Intelligence Hub — Nexora Enterprise";
const description =
  "Real-time technical troubleshooting and lookup engine for Indian telecom DLT scrubbing, operator response codes (Jio, Vi, Airtel, SmartPing), and SMPP delivery receipts.";

export const Route = createFileRoute("/error-hub")({
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
  component: () => <QuotationBuilder initialProduct="errorHub" />,
});
