import React from "react";
import {
  Building2,
  Check,
  Globe,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  FileText,
  User,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { type Quotation, type Product } from "@/lib/quotation";
import { useFocusProps } from "./preview-focus";

const pad2 = (n: number) => String(n).padStart(2, "0");

const BRAND = {
  name: "NEXORA ENTERPRISE",
  display: "Nexora Enterprise",
  tagA: "Bulk SMS | RCS | WhatsApp | OBD | IVR | SMPP",
  tagB: "",
  tagSub: "Enterprise Communication Solutions",
  site: "nexoracpaas.in",
  email: "support@nexoracpaas.in",
  phone: "+91 81759 50586",
  address: "Nexora Enterprise, Office 401, Waliv, Vasai East, Palghar, Maharashtra 401208",
};

export function QuotationDocument({
  data,
  logoSrc = "/nexora-logo.png",
}: {
  data: Quotation;
  logoSrc?: string;
}) {
  const activeProducts = data.products.filter((p) => p.enabled);

  return (
    <>
      <CoverPage data={data} logoSrc={logoSrc} />
      {activeProducts.map((p, idx) => (
        <ProductPage
          key={p.key}
          product={p}
          pageNo={idx + 2}
          logoSrc={logoSrc}
        />
      ))}
      <ContactPage
        data={data}
        pageNo={activeProducts.length + 2}
        logoSrc={logoSrc}
      />
    </>
  );
}

/* ========================================================================= */
/*                              SHARED COMPONENTS                            */
/* ========================================================================= */

function Spine({ pageNo }: { pageNo: number }) {
  return (
    <div className="pg-spine" aria-hidden="true">
      <span className="sp-dot"></span>
      <span className="sp-text">NEXORA ENTERPRISE • BUSINESS PROPOSAL</span>
      <span className="sp-num">{pad2(pageNo)}</span>
    </div>
  );
}

function PageHead({ logoSrc }: { logoSrc: string }) {
  return (
    <>
      <div className="pg-head">
        <div>
          <div className="pg-bname">{BRAND.name}</div>
          <div className="pg-btag">
            {BRAND.tagA}<b>{BRAND.tagB}</b>
            <span>{BRAND.tagSub}</span>
          </div>
        </div>
        <img
          src={logoSrc}
          alt={BRAND.name}
          style={{ width: 48, height: "auto", objectFit: "contain", display: "block" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/nexora-logo.png";
          }}
        />
      </div>
      <div className="pg-rule"><i></i></div>
    </>
  );
}

function PageFooter({ pageNo }: { pageNo: number }) {
  return (
    <div className="pg-footer">
      <div className="frule"></div>
      <div className="frow align-items-center">
        <span className="fbrand">{BRAND.name}</span>
        <span className="fcontacts">
          <span>
            <Globe className="w-3 h-3 text-slate-500 inline-block mr-1" />
            {BRAND.site}
          </span>
          <span>
            <Mail className="w-3 h-3 text-slate-500 inline-block mr-1" />
            {BRAND.email}
          </span>
          <span>
            <Phone className="w-3 h-3 text-slate-500 inline-block mr-1" />
            {BRAND.phone}
          </span>
        </span>
        <span className="fpage">PAGE {pad2(pageNo)}</span>
      </div>
    </div>
  );
}

/* ========================================================================= */
/*                              PAGE 1: COVER                                */
/* ========================================================================= */

function CoverPage({
  data,
  logoSrc,
}: {
  data: Quotation;
  logoSrc: string;
}) {
  const c = data.client;
  const clientNameFx = useFocusProps("client:name", "cv-card");
  const clientCompanyFx = useFocusProps("client:company", "cv-card");
  const proposalFx = useFocusProps("client:proposal");
  const dateFx = useFocusProps("client:date");

  const chips = [
    { label: "SMS", icon: <Mail className="w-3 h-3 text-white" /> },
    { label: "WhatsApp", icon: <Phone className="w-3 h-3 text-white" /> },
    { label: "Meta Verified", icon: <Check className="w-3 h-3 text-white" strokeWidth={3} /> },
    { label: "IVR & OBD", icon: <PhoneCall className="w-3 h-3 text-white" /> },
    { label: "API", icon: <FileText className="w-3 h-3 text-white" /> },
  ];

  return (
    <section className="a4-page" id="page-cover" data-page="cover">
      {/* Left Gradient Band */}
      <div className="cv-band">
        <span className="orb o1"></span>
        <span className="orb o2"></span>
        <span className="orb o3"></span>
        <div className="cv-logo">
          <img
            src={logoSrc}
            alt="Nexora Enterprise"
            style={{ width: 46, height: 46, objectFit: "contain", display: "block" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/nexora-logo.png";
            }}
          />
        </div>
        <div className="cv-name">NEXORA<span>ENTERPRISE</span></div>
        <p className="cv-tag">{BRAND.tagA}<b>{BRAND.tagB}</b></p>
        <span className="cv-div"></span>
        <div className="cv-chips">
          {chips.map((item, idx) => (
            <div className="cv-chip" key={idx}>
              <span className="ic">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="cv-meta">
          <span {...proposalFx}>Proposal No: <b>{c.proposalNumber || "—"}</b></span>
          <span {...dateFx}>Date: <b>{c.date || "—"}</b></span>
        </div>
      </div>

      {/* Decorative Rings Graphic */}
      <div className="cv-rings" aria-hidden="true">
        <svg width="210" height="210" viewBox="0 0 210 210" fill="none">
          <defs>
            <linearGradient id="rgc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#417cf9" />
              <stop offset="1" stopColor="#9757fc" />
            </linearGradient>
          </defs>
          <circle cx="105" cy="105" r="60" stroke="#e8ecf7" strokeWidth="1.6" />
          <circle cx="105" cy="105" r="86" stroke="#e8ecf7" strokeWidth="1.6" />
          <circle cx="105" cy="105" r="100" stroke="#eef1fa" strokeWidth="1.6" />
          <circle
            cx="105"
            cy="105"
            r="73"
            stroke="url(#rgc)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="172 287"
            transform="rotate(-55 105 105)"
          />
          <circle cx="105" cy="18" r="4.5" fill="#417cf9" />
          <circle cx="186" cy="140" r="3.5" fill="#9757fc" />
        </svg>
      </div>

      {/* Hero Panel */}
      <div className="cv-hero-panel" aria-hidden="true"></div>
      <div className="cv-kicker">ENTERPRISE COMMUNICATION SOLUTIONS</div>
      <h1 className="cv-title">BUSINESS<span className="gradient-text">PROPOSAL</span></h1>
      <div className="cv-rrule"></div>
      <p className="cv-intro">
        We are pleased to present our Communication Solutions that empower your business to connect, engage, and grow faster with our reliable and innovative messaging services.
      </p>

      {/* Client Cards */}
      <div className="cv-cards">
        <div {...clientNameFx} className={`cv-card ${clientNameFx.className}`}>
          <span className="cv-ic">
            <User className="w-4 h-4 text-white" />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <label>Prepared For</label>
            <div
              className="val fit"
              style={{
                fontSize:
                  (c.clientName || "").length > 40
                    ? "3.2mm"
                    : (c.clientName || "").length > 25
                    ? "3.65mm"
                    : "4.2mm",
              }}
            >
              {c.clientName || "—"}
            </div>
          </div>
        </div>
        <div {...clientCompanyFx} className={`cv-card ${clientCompanyFx.className}`}>
          <span className="cv-ic">
            <Building2 className="w-4 h-4 text-white" />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <label>Our Valued Partner</label>
            <div
              className="val fit"
              style={{
                fontSize:
                  (c.companyName || "").length > 40
                    ? "3.2mm"
                    : (c.companyName || "").length > 25
                    ? "3.65mm"
                    : "4.2mm",
              }}
            >
              {c.companyName || "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Executive Banner */}
      <div className="cv-banner">
        <span className="cv-plane">
          <svg width="26" height="20" viewBox="0 0 60 46" fill="none">
            <path d="M56 4 6 24l20 6 4 14 10-16 16-24Z" fill="#fff" />
          </svg>
        </span>
        <div>
          <b>{BRAND.tagA}{BRAND.tagB}</b>
          <div className="hline"></div>
          <em>{BRAND.tagSub}</em>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="cv-bottom-panel">
        <div className="cv-bottom-head">
          <strong>Communication solutions built for growth</strong>
          <span>TRUSTED. SCALABLE. RESPONSIVE.</span>
        </div>
        <div className="cv-benefits">
          <div className="cv-benefit">
            <span className="cb-ic"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></span>
            <div><b>Reliable delivery</b><small>Consistent campaign reach</small></div>
          </div>
          <div className="cv-benefit">
            <span className="cb-ic"><Globe className="w-3.5 h-3.5 text-white" /></span>
            <div><b>Built to scale</b><small>Channels that grow with you</small></div>
          </div>
          <div className="cv-benefit">
            <span className="cb-ic"><Phone className="w-3.5 h-3.5 text-white" /></span>
            <div><b>Dedicated support</b><small>Help when it matters</small></div>
          </div>
        </div>
      </div>

      {/* Cover Page Footer */}
      <div className="cv-footer">
        <div className="cv-footer-line"></div>
        <div className="cv-footer-content">
          <span className="cv-footer-brand">{BRAND.name}</span>
          <div className="cv-footer-right">
            <span>{BRAND.site}</span>
            <span>{BRAND.email}</span>
          </div>
        </div>
        <div className="cv-footer-confidential">CONFIDENTIAL - FOR CLIENT REVIEW ONLY</div>
      </div>
    </section>
  );
}

/* ========================================================================= */
/*                              PRODUCT PAGE                                 */
/* ========================================================================= */

function formatRateDisplay(val: string): string {
  if (!val) return "—";
  const trimmed = val.trim();
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed} Paise`;
  }
  return trimmed;
}

function ProductPage({
  product: p,
  pageNo,
  logoSrc,
}: {
  product: Product;
  pageNo: number;
  logoSrc: string;
}) {
  const titleFx = useFocusProps(p.key + ":title", "fit ttl");
  const subFx = useFocusProps(p.key + ":sub", "pd-sub");
  const introFx = useFocusProps(p.key + ":intro", "pd-intro");
  const pricingFx = useFocusProps(p.key + ":pricing", "pd-pricing");
  const bulletsFx = useFocusProps(p.key + ":bullets", "pg-bullets");

  const bl = p.bullets.slice(0, 14);
  const half = Math.ceil(bl.length / 2);
  const col1 = bl.slice(0, half);
  const col2 = bl.slice(half);

  const isWhatsapp = p.key === "metaWhatsapp" || p.key === "virtualWhatsapp";

  return (
    <section
      className="a4-page"
      id={`page-${p.key}`}
      data-page={p.key}
      data-product={isWhatsapp ? "whatsapp" : p.key}
    >
      <Spine pageNo={pageNo} />
      <PageHead logoSrc={logoSrc} />

      <div className="pd-content">
        <div className="pd-title">
          <div {...titleFx} className={`fit ttl ${titleFx.className}`}>{p.title}</div>
          <div {...subFx} className={`pd-sub ${subFx.className}`}>
            <span className="pd-line"></span>
            <span className="pg-chip">{p.badge || "ENTERPRISE"}</span>
            <span className="fit pd-subtext">{p.subTitle}</span>
            <span className="pd-line r"></span>
          </div>
        </div>

        <div {...introFx} className={`pd-intro ${introFx.className}`}>
          <p>
            <strong style={{ color: "var(--ink)" }}>{BRAND.display}</strong> {p.intro}
          </p>
        </div>

        <div {...pricingFx} className={`pd-pricing ${pricingFx.className}`}>
          {p.tables.map((t, idx) => (
            <div className="pg-tablewrap" style={{ marginBottom: "3mm" }} key={idx}>
              <table className="pg-table">
                <thead>
                  <tr>
                    <th style={{ width: "50%" }}>{t.slabLabel}</th>
                    <th style={{ width: "50%" }}>{t.rateLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t.slabValue}</td>
                    <td className="rate">{formatRateDisplay(t.rateValue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}

          {isWhatsapp && (
            <div className="wa-experience">
              <div className="wa-experience-title">
                <strong>WhatsApp Experience</strong>
                <span>Rich, trusted conversations designed for conversion.</span>
              </div>
              <div className="wa-experience-grid">
                <div className="wa-experience-card">
                  <i><Check className="w-3 h-3 text-white" strokeWidth={3} /></i>
                  <div><b>Verified identity</b><small>Build customer trust</small></div>
                </div>
                <div className="wa-experience-card">
                  <i><FileText className="w-3 h-3 text-white" /></i>
                  <div><b>Rich campaigns</b><small>Media and templates</small></div>
                </div>
                <div className="wa-experience-card">
                  <i><Phone className="w-3 h-3 text-white" /></i>
                  <div><b>Smart engagement</b><small>Conversations at scale</small></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pg-bcard">
          <div className="bhead">
            <span className="bic">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </span>
            <span className="lbl">Key Highlights</span>
          </div>
          <div {...bulletsFx} className={`pg-bullets ${bulletsFx.className}`}>
            <ul className="bcol">
              {col1.map((b, i) => (
                <li key={i}>
                  <span className="bchk">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <ul className="bcol">
              {col2.map((b, i) => (
                <li key={i}>
                  <span className="bchk">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bfoot">
            <span className="fdot"></span>
            <span>{BRAND.name} &bull; {BRAND.tagA}{BRAND.tagB}</span>
            <span className="fdot"></span>
          </div>
        </div>
      </div>

      <PageFooter pageNo={pageNo} />
    </section>
  );
}

/* ========================================================================= */
/*                              CONTACT PAGE                                 */
/* ========================================================================= */

function ContactPage({
  data,
  pageNo,
  logoSrc,
}: {
  data: Quotation;
  pageNo: number;
  logoSrc: string;
}) {
  const m = data.manager;
  const b = data.bank;
  const managerFx = useFocusProps("manager:card", "ct-card");

  const bankRows = [
    { label: "Acc Name", val: b.accountName || "Nexora Enterprise", icon: <User className="w-3 h-3 text-violet-700" /> },
    { label: "Bank name", val: b.bankName || "Federal Bank", icon: <Building2 className="w-3 h-3 text-violet-700" /> },
    { label: "Branch Name", val: b.branchName || "Waliv (Vasai East)", icon: <MapPin className="w-3 h-3 text-violet-700" /> },
    { label: "Account Number", val: b.accountNumber || "15750200024456", icon: <CreditCard className="w-3 h-3 text-violet-700" /> },
    { label: "Account Type", val: b.accountType || "Current Account", icon: <FileText className="w-3 h-3 text-violet-700" /> },
    { label: "IFSC Code", val: b.ifscCode || "FDRL0001575", icon: <ShieldCheck className="w-3 h-3 text-violet-700" /> },
  ];

  const terms = [
    "No Service taxes.",
    "Rates are non-negotiable.",
    "Payment Terms is postpaid.",
    "All Payment In favor of Nexora Enterprise.",
  ];

  return (
    <section className="a4-page" id="page-contact" data-page="contact">
      <Spine pageNo={pageNo} />
      <PageHead logoSrc={logoSrc} />

      <div className="contact-content">
        <h2 className="ct-title">Contact Us</h2>
        <div className="ct-tbar"></div>

        <div {...managerFx} className={`ct-card ${managerFx.className}`}>
          <span className="ct-avatar">
            <User className="w-7 h-7 text-white" />
          </span>
          <div className="ct-minfo">
            <div className="fit" style={{ fontWeight: 800, fontSize: "5.2mm", color: "var(--ink)", lineHeight: 1.15 }}>
              {m.name || "—"}
            </div>
            <div className="fit" style={{ color: "#64748b", fontWeight: 600, fontSize: "3.4mm", marginTop: ".8mm" }}>
              {m.designation || "Enterprise Relationship Manager"}
            </div>
            <div className="ct-rows">
              <span className="ct-pill">
                <Phone className="w-3 h-3 text-purple-700 mr-1" />
                {m.mobile || BRAND.phone}
              </span>
              <span className="ct-pill">
                <Mail className="w-3 h-3 text-purple-700 mr-1" />
                {m.email || BRAND.email}
              </span>
            </div>
          </div>
        </div>

        <div className="ct-sec ct-sec-1">
          <span className="ct-ic">
            <Building2 className="w-5 h-5 text-white" />
          </span>
          <h3>Bank Account Details</h3>
          <span className="ct-line"></span>
        </div>

        <div className="ct-bank">
          {bankRows.map((r, i) => (
            <div className="ct-brow" key={i}>
              <span className="ct-bic">{r.icon}</span>
              <label>{r.label}</label>
              <b>{r.val}</b>
            </div>
          ))}
        </div>

        <div className="ct-trust">
          <div className="ct-trust-card">
            <span className="tic"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></span>
            <div><b>Transparent process</b><span>Clear commercial terms</span></div>
          </div>
          <div className="ct-trust-card">
            <span className="tic"><Globe className="w-3.5 h-3.5 text-white" /></span>
            <div><b>Enterprise ready</b><span>Reliable communication stack</span></div>
          </div>
          <div className="ct-trust-card">
            <span className="tic"><Phone className="w-3.5 h-3.5 text-white" /></span>
            <div><b>Always supported</b><span>Dedicated assistance</span></div>
          </div>
        </div>

        {/* Terms & Conditions Box */}
        <div className="ct-terms-wrap">
          <div className="ct-terms-box">
            <div className="ct-terms-title">
              <span className="tc-icon"><FileText className="w-3.5 h-3.5 text-white" /></span>
              <span>Terms &amp; Conditions</span>
            </div>
            <div className="ct-terms-body">
              {terms.map((t, i) => (
                <div className="ct-terms-row" key={i}>
                  <span className="ct-terms-num">{i + 1}</span>
                  <span className="ct-terms-text">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ct-thanks"><span className="gradient-text">Thank You</span></div>
        <p className="ct-support">
          24/7 Support Center: Call us on {BRAND.phone} Or Mail us on {BRAND.email}
          <i>&quot;Any Changes in rules and Regulations by Company, TRAI or Operator will be Applicable with effect from the date communicated&quot;</i>
        </p>
        <p className="ct-addr">{BRAND.address}</p>
      </div>

      <PageFooter pageNo={pageNo} />
    </section>
  );
}
