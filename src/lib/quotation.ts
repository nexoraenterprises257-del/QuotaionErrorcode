export type ProductKey =
  | "bulkSms"
  | "metaWhatsapp"
  | "rcs"
  | "obd"
  | "cpaas"
  | "virtualWhatsapp"
  | "ivr"
  | "mca"
  | "email"
  | "smpp";

export interface RateRow {
  slabLabel: string;
  slabValue: string;
  rateLabel: string;
  rateValue: string;
}

export interface Pricing {
  setup: string;
  monthly: string;
  price: string;
  gst: string;
  total: string;
  setupLabel?: string;
  monthlyLabel?: string;
  priceLabel?: string;
  gstLabel?: string;
  totalLabel?: string;
}

export interface Product {
  key: ProductKey;
  enabled: boolean;
  /** Banner heading, e.g. "SMS Services & Pricing" */
  title: string;
  /** Small label inside the round icon */
  badge: string;
  /** Sub heading above the rate table */
  subTitle: string;
  intro: string;
  tables: RateRow[];
  agentLimitLabel?: string;
  agentLimitValue?: string;
  bullets: string[];
  pricing: Pricing;
}

export interface ClientInfo {
  clientName: string;
  companyName: string;
  proposalNumber: string;
  date: string;
  city?: string;
}

export interface AccountManager {
  name: string;
  designation: string;
  mobile: string;
  email: string;
}

export interface BankInfo {
  accountName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountType: string;
  ifscCode: string;
}

export interface Quotation {
  client: ClientInfo;
  products: Product[];
  manager: AccountManager;
  bank: BankInfo;
}

export const emptyPricing = (
  setup = "0",
  monthly = "0",
  setupLabel = "Setup Charges",
  monthlyLabel = "Monthly Charges",
  priceLabel = "Price",
  gstLabel = "GST (%)",
  totalLabel = "Final Total",
): Pricing => ({
  setup,
  monthly,
  price: "0",
  gst: "18",
  total: "0",
  setupLabel,
  monthlyLabel,
  priceLabel,
  gstLabel,
  totalLabel,
});

export const PRODUCT_LABELS: Record<ProductKey, string> = {
  bulkSms: "Bulk SMS",
  metaWhatsapp: "WhatsApp Business API",
  rcs: "RCS Business Messaging",
  obd: "OBD Voice Calls",
  cpaas: "CPaaS Omni Platform",
  virtualWhatsapp: "Virtual WhatsApp",
  ivr: "IVR Solutions",
  mca: "MCA Services",
  email: "Enterprise Email",
  smpp: "SMPP Connectivity",
};

export function getTodayDateString(): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return new Date().toLocaleDateString("en-GB", options).toUpperCase();
}

export function generateProposalNumber(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(1 + Math.random() * 999)).padStart(3, "0");
  return `NEX/${year}/${seq}`;
}

export const defaultQuotation = (): Quotation => ({
  client: {
    clientName: "Mr. Rohan Verma",
    companyName: "Kissht Financial Services Ltd",
    proposalNumber: "NEX/2026/101",
    date: getTodayDateString(),
    city: "Mumbai, Maharashtra",
  },
  manager: {
    name: "Account Manager Name",
    designation: "Enterprise Relationship Manager",
    mobile: "+91 81759 50586",
    email: "support@nexoracpaas.in",
  },
  bank: {
    accountName: "Nexora Enterprise",
    bankName: "Federal Bank",
    branchName: "Waliv (Vasai East)",
    accountNumber: "15750200024456",
    accountType: "Current Account",
    ifscCode: "FDRL0001575",
  },
  products: [
    {
      key: "bulkSms",
      enabled: true,
      title: "SMS Services & Pricing",
      badge: "SMS",
      subTitle: "Promotional SMS",
      intro:
        "provides reliable, high-volume SMS communication designed for time-sensitive business campaigns. Messages are routed through dependable promotional routes for fast, secure and measurable delivery.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per SMS",
          rateLabel: "SMS Rate",
          rateValue: "0.0675 Paise",
        },
      ],
      bullets: [
        "You will be charged only for delivered SMS.",
        "Undelivered credits will be refunded within 24 hours.",
        "Delivery: Non-DND & Partial DND Numbers.",
        "Delivery Ratio: 100%",
        "SMS Sending Time: 24 Hrs.",
        "DLT & Templates Support.",
        "Content approval TAT: 15 Minutes.",
        "Easy to use interface.",
        "REST API available with Postman collection and JSON format for easy integration.",
        "Comprehensive API documentation and sample requests are available.",
        "Technical assistance is available during the integration process.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "rcs",
      enabled: true,
      title: "RCS Business Messaging",
      badge: "RCS",
      subTitle: "RCS SMS",
      intro:
        "delivers verified RCS Business Messaging with rich media, carousels and action buttons, helping your brand create trusted and interactive customer journeys inside the native messaging inbox.",
      tables: [
        {
          slabLabel: "Credit Slab (Utility)",
          slabValue: "Per RCS",
          rateLabel: "RCS Rate",
          rateValue: "0.10 Paise",
        },
      ],
      bullets: [
        "Agent: Promotional — Time: 10 AM to 7 PM (7 days a week).",
        "Message Limit: Four (4) messages per brand per user per month.",
        "Onboarding: GST Certificate, Company PAN / CIN.",
        "Logo Image (224x224 px, under 90KB — JPEG, JPG, PNG).",
        "Banner Image (1440x448 px, under 360KB — JPEG, JPG, PNG).",
        "Rich communication experience with higher engagement.",
        "Verified business identity.",
        "Secure & reliable messaging.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "metaWhatsapp",
      enabled: true,
      title: "WhatsApp Services & Pricing",
      badge: "WA",
      subTitle: "Business WhatsApp (WABA)",
      intro:
        "provides an official WhatsApp Business API solution for secure, automated and scalable customer conversations. Engage customers with reliable messaging, campaign tools and meaningful analytics.",
      tables: [
        {
          slabLabel: "Credit Slab (Marketing)",
          slabValue: "Per WhatsApp",
          rateLabel: "WhatsApp Rate",
          rateValue: "0.80 Paise",
        },
        {
          slabLabel: "Credit Slab (Utility)",
          slabValue: "Per WhatsApp",
          rateLabel: "WhatsApp Rate",
          rateValue: "0.10 Paise",
        },
      ],
      bullets: [
        "No Conversations Free BIC (Business Incoming).",
        "Free WhatsApp API Approval & Setup.",
        "Bulk WhatsApp campaign notifications & campaign analytics.",
        "24 hours conversation window if same template is sent within the window.",
        "Zero Rental Charges.",
        "Zero Annual Maintenance Charges (AMC).",
        "Zero Hidden Charges.",
        "Transparent & Hassle-Free Pricing.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "obd",
      enabled: true,
      title: "OBD Voice Call Services",
      badge: "OBD",
      subTitle: "Voice Call - 30 Second",
      intro:
        "connect with customers instantly through professional outbound voice broadcasting. Benefit from artist voice recording, DND and Non-DND delivery, campaign reporting and round-the-clock support.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per Voice Call",
          rateLabel: "Voice Rate 30 Sec-Pulse",
          rateValue: "0.095 Paise/Voice",
        },
      ],
      bullets: [
        "Artist Voice Record (Male & Female).",
        "Delivery: Non-DND & DND Numbers.",
        "Sender ID: Virtual Number.",
        "Voice Sending Time: 24 Hrs.",
        "Voice approval TAT: 10 minutes.",
        "Voice Record TAT: 1 Day.",
        "24X7 Customer Care Support.",
        "Regular panel performance monitoring & tuning.",
        "Life time validity, 100% reliable services & reports.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "cpaas",
      enabled: false,
      title: "CPaaS Omni Communication Panel",
      badge: "CPaaS",
      subTitle: "Omni Messaging Platform",
      intro:
        "offers a unified CPaaS platform to manage SMS, RCS, WhatsApp, Voice and Email from a single dashboard. Our intelligent failover ensures your message is delivered through the best available channel.",
      tables: [
        {
          slabLabel: "Particulars",
          slabValue: "Successful Delivery – Any Channel (SMS / RCS / WhatsApp)",
          rateLabel: "Average Rate",
          rateValue: "₹ 0.20 / Message",
        },
      ],
      bullets: [
        "Automatic failover from SMS → RCS → WhatsApp.",
        "You pay only for the final successfully delivered message.",
        "One customer = One count, irrespective of the channel used.",
        "Single dashboard to manage all communication channels.",
        "Real-time delivery reports and analytics.",
        "API & SMPP integration support.",
        "Technical assistance available during integration.",
      ],
      pricing: emptyPricing("0", "0"),
    },
    {
      key: "virtualWhatsapp",
      enabled: false,
      title: "Virtual WhatsApp Services",
      badge: "V-WA",
      subTitle: "Virtual Messaging Infrastructure",
      intro:
        "provides reliable Virtual WhatsApp services for scalable enterprise broadcast outreach and conversational support with dedicated virtual identities.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per Virtual WhatsApp",
          rateLabel: "Rate",
          rateValue: "0.10 Paise",
        },
      ],
      bullets: [
        "High delivery ratio with instant status callbacks.",
        "Web panel & REST API access.",
        "Custom template support.",
        "Rich media and attachment distribution.",
        "24/7 technical monitoring and routing optimization.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "ivr",
      enabled: false,
      title: "IVR Solutions & Pricing",
      badge: "IVR",
      subTitle: "Cloud IVR",
      intro:
        "Automate inbound customer journeys with a cloud IVR built for scale — multi-level menus, call routing, recording and real-time reporting on a virtual number of your choice.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per Minute (Pulse 30 Sec)",
          rateLabel: "IVR Rate",
          rateValue: "0.30 Paise",
        },
      ],
      bullets: [
        "Multi-level IVR menu with smart call routing.",
        "Virtual number / toll-free number support.",
        "Call recording & downloadable reports.",
        "Sticky agent and working-hour routing.",
        "Missed call alerts over SMS & email.",
        "Real-time dashboard and live call monitoring.",
        "API & CRM integration support.",
      ],
      pricing: emptyPricing("5000", "2000"),
    },
    {
      key: "mca",
      enabled: false,
      title: "Missed Call Alert (MCA) Solutions",
      badge: "MCA",
      subTitle: "Instant Lead Generation",
      intro:
        "captures high-intent customer leads instantly via zero-cost missed calls on dedicated virtual numbers with automated SMS acknowledgments and CRM sync.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Dedicated MCA Number",
          rateLabel: "Annual Fee",
          rateValue: "₹ 6,000",
        },
      ],
      bullets: [
        "Unlimited incoming missed calls.",
        "Instant SMS acknowledgement to caller.",
        "Real-time webhook callback to CRM.",
        "Exportable Excel/CSV reports with caller analytics.",
        "24/7 technical monitoring and support.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "email",
      enabled: false,
      title: "Transactional & Marketing Email",
      badge: "Email",
      subTitle: "High-Inbox SMTP Relay",
      intro:
        "ensures high inbox placement with automated DKIM, SPF, and DMARC alignment, dedicated IPs, and real-time open/click tracking.",
      tables: [
        {
          slabLabel: "Volume Slab",
          slabValue: "100,000 Emails / Month",
          rateLabel: "Rate",
          rateValue: "₹ 0.035 / Email",
        },
      ],
      bullets: [
        "Dedicated IP warm-up support.",
        "Sub-second transactional dispatch.",
        "Drag & drop template builder.",
        "Full SPF, DKIM, and DMARC authentication guidance.",
        "Real-time open, click, bounce, and spam complaint analytics.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "smpp",
      enabled: false,
      title: "SMPP Connectivity",
      badge: "SMPP",
      subTitle: "Direct SMPP Binds",
      intro:
        "High-throughput, carrier-grade SMPP connectivity for enterprises sending at volume — direct binds, low latency and guaranteed uptime with dedicated technical support.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per SMS (SMPP)",
          rateLabel: "SMPP Rate",
          rateValue: "0.060 Paise",
        },
      ],
      bullets: [
        "SMPP v3.4 direct bind (TX / RX / TRX).",
        "Dedicated throughput as per committed TPS.",
        "IP whitelisting & secure credentials.",
        "Real-time DLR push over SMPP.",
        "99.5% platform uptime commitment.",
        "Dedicated NOC & technical integration support.",
      ],
      pricing: emptyPricing("10000", "5000"),
    },
  ],
});

export const computeTotal = (pricing: Pricing): number => {
  const setup = parseFloat(pricing.setup) || 0;
  const monthly = parseFloat(pricing.monthly) || 0;
  const price = parseFloat(pricing.price) || 0;
  const subtotal = setup + monthly + price;
  const gst = parseFloat(pricing.gst) || 0;
  return subtotal + (subtotal * gst) / 100;
};

export const currency = (val: string | number): string => {
  const n = typeof val === "number" ? val : parseFloat(val) || 0;
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
