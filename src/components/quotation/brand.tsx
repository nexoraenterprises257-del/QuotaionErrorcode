/**
 * Executive Brand Primitives for Nexora Enterprise CPaaS (nexoracpaas.in).
 * Color palette derived directly from the official 3D ribbon logo:
 * - Cyber Cyan: #00D2FF
 * - Royal / Electric Blue: #2563EB
 * - Deep Midnight Slate: #0F172A
 * - Electric Violet / Purple: #9D50BB
 * - Vibrant Orange: #F97316
 */

import React from "react";
import { Globe, Mail, Phone } from "lucide-react";
import { AutoFit } from "./AutoFit";

export const NAVY = "#0f172a";
export const PRIMARY_BLUE = "#2563eb";
export const CYAN = "#00d2ff";
export const VIOLET = "#9d50bb";
export const ORANGE = "#f97316";
export const DARK_INDIGO = "#0f172a";

export const GRADIENT_PRIMARY = "linear-gradient(135deg, #00d2ff 0%, #2563eb 50%, #9d50bb 100%)";
export const GRADIENT_CYAN_PURPLE = "linear-gradient(135deg, #00d2ff 0%, #9d50bb 100%)";
export const BRAND_GRADIENT = GRADIENT_CYAN_PURPLE;

const LOGO_ASPECT = 428 / 581;

export function LogoMark({
  size = 44,
  src = "/nexora-logo.png",
  className = "",
}: {
  size?: number;
  src?: string;
  className?: string;
}) {
  const width = size;
  const height = size * LOGO_ASPECT;
  return (
    <img
      src={src}
      alt="Nexora Enterprise Logo"
      width={width}
      height={height}
      className={`logo-img dynamic-logo ${className}`}
      style={{ height, width: "auto", objectFit: "contain", display: "block" }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/nexora-logo.png";
      }}
    />
  );
}

/** Standard page header matching media_1792132221493.html */
export function ProposalPageHeader({
  logoSrc = "/nexora-logo.png",
  date = "06 AUG 2026",
  sectionLabel,
  dateFocusProps,
}: {
  logoSrc?: string;
  date?: string;
  sectionLabel?: React.ReactNode;
  dateFocusProps?: Record<string, unknown>;
}) {
  return (
    <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 flex-shrink-0">
      <div>
        <LogoMark size={40} src={logoSrc} />
        <p className="text-[9px] font-black text-orange-500 mt-1 uppercase tracking-wider">
          Smart Communication. Stronger Results.
        </p>
      </div>
      <div className="text-right flex items-center gap-3">
        {sectionLabel ? (
          <div className="bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
            {sectionLabel}
          </div>
        ) : null}
        <div {...(dateFocusProps || {})}>
          <p className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-400 mb-0.5">
            Date Created
          </p>
          <span className="font-bold text-slate-800 text-xs bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 inline-block">
            {date || "06 AUG 2026"}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Standard footer curve matching media_1792132221493.html */
export function ProposalFooterCurve({
  currentPage = 1,
  totalPages = 6,
  logoSrc = "/nexora-logo.png",
}: {
  currentPage?: number;
  totalPages?: number;
  logoSrc?: string;
}) {
  return (
    <div className="footer-curve">
      <div className="flex items-center gap-3">
        <img
          src={logoSrc}
          alt="Nexora"
          className="h-6 filter brightness-0 invert opacity-90 dynamic-logo"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/nexora-logo.png";
          }}
        />
        <span className="text-[10px] font-black tracking-widest uppercase opacity-90 text-cyan-400">
          Nexora Enterprise
        </span>
      </div>
      <div className="text-center hidden sm:block">
        <p className="text-[9px] font-semibold text-slate-400">
          Shop No. 44 Oshiwara Police Station Rd, Andheri West, Mumbai, MH 400102 | +91 81759 50586
        </p>
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
          PAGE {currentPage} OF {totalPages}
        </span>
      </div>
    </div>
  );
}

/** 3-color accent bar */
export function GradientBar({ height = 3, className = "" }: { height?: number; className?: string }) {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        height: `${height}px`,
        background: "linear-gradient(90deg, #00d2ff 0%, #2563eb 50%, #9d50bb 100%)",
      }}
    />
  );
}

export function DotGrid({
  rows = 5,
  cols = 6,
  color = "#cbd5e1",
  gap = 4.5,
  dot = 1.2,
  className = "",
  style,
}: {
  rows?: number;
  cols?: number;
  color?: string;
  gap?: number;
  dot?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${gap}mm)`,
          gridTemplateRows: `repeat(${rows}, ${gap}mm)`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <span
            key={i}
            style={{
              width: `${dot}mm`,
              height: `${dot}mm`,
              borderRadius: "999px",
              background: color,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function CornerBlob() {
  return (
    <div className="absolute top-0 right-0 w-[80mm] h-[80mm] overflow-hidden pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <path d="M0 0 L100 0 L100 100 Z" fill="#0f172a" opacity="0.04" />
        <path d="M40 0 L100 0 L100 60 Z" fill="url(#techGradLight)" opacity="0.08" />
        <line x1="0" y1="0" x2="100" y2="100" stroke="url(#techGradLine)" strokeWidth="0.8" opacity="0.4" />
        <defs>
          <linearGradient id="techGradLight" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#9d50bb" />
          </linearGradient>
          <linearGradient id="techGradLine" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#9d50bb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function Glyph({
  name,
  color = "#2563eb",
  size = 4,
}: {
  name: "globe" | "mail" | "phone" | "user" | "bank" | "pin" | "card" | "doc" | "check";
  color?: string;
  size?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15 0 18M12 3c-2.5 2.7-2.5 15 0 18" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.5-4 4-5.5 7-5.5S17.5 16 19 20" />
      </>
    ),
    bank: (
      <>
        <path d="M3 10 12 4l9 6" />
        <path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
    doc: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M9 12h6M9 16h6" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
  };
  return (
    <svg
      width={`${size}mm`}
      height={`${size}mm`}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function RibbonTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[4mm]">
      <div
        className="rounded-full shrink-0"
        style={{
          width: "4mm",
          height: "9mm",
          background: "linear-gradient(180deg, #00d2ff 0%, #2563eb 50%, #9d50bb 100%)",
        }}
      />
      <div className="min-w-0 flex-1">
        <AutoFit
          size={6.2}
          maxLines={1}
          lineHeight={1.15}
          className="font-display font-extrabold tracking-tight text-slate-900"
          style={{ width: "auto" }}
        >
          {children}
        </AutoFit>
      </div>
      <div
        className="h-[1.5px] flex-1 max-w-[40mm]"
        style={{ background: "linear-gradient(90deg, #2563eb 0%, transparent 100%)" }}
      />
    </div>
  );
}

export function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="flex items-center justify-between pb-3 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <LogoMark size={compact ? 36 : 42} />
        <div>
          <div className="font-display font-extrabold tracking-tight text-slate-900 leading-none text-base">
            NEXORA <span style={{ color: PRIMARY_BLUE }}>ENTERPRISE</span>
          </div>
          <div className="font-medium text-slate-500 mt-1 leading-none text-xs">
            Carrier CPaaS Solutions · Commercial Proposal
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full font-semibold uppercase tracking-wider text-slate-600 border border-slate-200 bg-slate-50 text-[10px] px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-cyan-400" />
          Direct Carrier Network
        </span>
      </div>
    </header>
  );
}

export function PageFooter({
  site = "www.nexoraenterprise.in",
  email = "info@nexoraenterprise.in",
  phone = "+91 81759 50586",
}: {
  site?: string;
  email?: string;
  phone?: string;
}) {
  return (
    <footer className="footer-curve">
      <div className="flex justify-between items-center w-full text-[9px] font-black tracking-widest uppercase">
        <span className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-cyan-400 shrink-0" /> {site.toUpperCase()}</span>
        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-cyan-400 shrink-0" /> {email.toUpperCase()}</span>
        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-cyan-400 shrink-0" /> {phone}</span>
      </div>
    </footer>
  );
}
