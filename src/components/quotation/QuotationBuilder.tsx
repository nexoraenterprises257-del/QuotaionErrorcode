import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RotateCcw,
  ShieldCheck,
  FileText,
  Eye,
  Printer,
  ChevronDown,
  PenLine,
  Sparkles,
  Calendar,
  Zap,
} from "lucide-react";
import { QuotationDocument } from "@/components/quotation/QuotationDocument";
import { PreviewFocusContext } from "@/components/quotation/preview-focus";
import { SmsErrorHub } from "@/components/error-hub/SmsErrorHub";
import {
  defaultQuotation,
  generateProposalNumber,
  getTodayDateString,
  type Product,
  type Quotation,
  type ProductKey,
  type ClientInfo,
  type AccountManager,
} from "@/lib/quotation";

const MM = 96 / 25.4;
const PAGE_W = 210 * MM; // 793.7px
const PAGE_H = 297 * MM; // 1122.5px

export const PRODUCT_NAMES: Record<ProductKey, string> = {
  bulkSms: "Bulk SMS",
  rcs: "RCS Messaging",
  metaWhatsapp: "WhatsApp API",
  obd: "OBD Call",
  cpaas: "CPaaS Hub",
  virtualWhatsapp: "Virtual WhatsApp",
  ivr: "IVR Services",
  mca: "Missed Call (MCA)",
  email: "Email Solutions",
  smpp: "SMPP Bind",
};

export function QuotationBuilder({
  initialProduct = "quotation",
}: {
  initialProduct?: "quotation" | "errorHub";
} = {}) {
  const [data, setData] = useState<Quotation>(defaultQuotation);

  const [activeProduct, setActiveProduct] = useState<"quotation" | "errorHub">(() => {
    if (typeof window !== "undefined") {
      const p =
        new URLSearchParams(window.location.search).get("product") ||
        new URLSearchParams(window.location.search).get("tab");
      if (p === "error-hub" || p === "errorHub" || initialProduct === "errorHub") {
        return "errorHub";
      }
    }
    return initialProduct;
  });

  const handleProductSwitch = (prod: "quotation" | "errorHub") => {
    setActiveProduct(prod);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const shell = document.querySelector(".app-shell");
      if (shell) shell.scrollTop = 0;

      const url = new URL(window.location.href);
      if (prod === "errorHub") {
        url.searchParams.set("product", "error-hub");
      } else {
        url.searchParams.delete("product");
        url.searchParams.delete("tab");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const [openKey, setOpenKey] = useState<ProductKey | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [zoom, setZoom] = useState<"fit-width" | "fit-page" | number>("fit-width");
  const [scale, setScale] = useState(1);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [selectedPage, setSelectedPage] = useState<string>("cover");

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const glowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------- Computed Grand Total ---------------- */
  const enabledProducts = useMemo(
    () => data.products.filter((p) => p.enabled),
    [data.products],
  );
  const enabledCount = enabledProducts.length;
  const pageCount = enabledCount + 2; // Cover + Products + Contact

  const grandTotal = useMemo(() => {
    return enabledProducts.reduce((acc, p) => {
      const t = parseFloat(p.pricing.total) || 0;
      if (t > 0) return acc + t;
      const auto =
        (parseFloat(p.pricing.setup) || 0) + (parseFloat(p.pricing.monthly) || 0);
      return acc + auto;
    }, 0);
  }, [enabledProducts]);

  const grandTotalDisplay = grandTotal.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  /* ---------------- Auto-scale observer for preview ---------------- */
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const apply = () => {
      // Guard against zero/collapsed dimensions when hidden
      if (el.clientWidth <= 100) return;
      const availW = el.clientWidth - 48; // padding
      const availH = el.clientHeight - 48;

      if (zoom === "fit-width") {
        setScale(Math.min(1.2, Math.max(0.35, availW / PAGE_W)));
      } else if (zoom === "fit-page") {
        const sw = availW / PAGE_W;
        const sh = availH / PAGE_H;
        setScale(Math.min(1.2, Math.max(0.35, Math.min(sw, sh))));
      } else {
        setScale(zoom);
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [zoom, activeProduct]);

  /* Reset scroll and recalibrate scale on tab switch */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const shell = document.querySelector(".app-shell");
      if (shell) shell.scrollTop = 0;
    }
    if (activeProduct === "quotation") {
      const t = setTimeout(() => {
        const el = scrollerRef.current;
        if (!el || el.clientWidth <= 100) return;
        const availW = el.clientWidth - 48;
        const availH = el.clientHeight - 48;
        if (zoom === "fit-width") {
          setScale(Math.min(1.2, Math.max(0.35, availW / PAGE_W)));
        } else if (zoom === "fit-page") {
          const sw = availW / PAGE_W;
          const sh = availH / PAGE_H;
          setScale(Math.min(1.2, Math.max(0.35, Math.min(sw, sh))));
        }
      }, 60);
      return () => clearTimeout(t);
    }
  }, [activeProduct, zoom]);

  /* ---------------- Preview Navigation & Focus ---------------- */
  const scrollToPage = useCallback((pageId: string) => {
    setSelectedPage(pageId);
    if (window.innerWidth <= 900) {
      setMobileTab("preview");
    }
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = scroller.querySelector<HTMLElement>(`#page-${CSS.escape(pageId)}`);
    if (!el) return;
    const top =
      el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    scroller.scrollTo({ top: Math.max(0, top - 12), behavior: "smooth" });
  }, []);

  const flashFocus = useCallback((focusId: string) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = scroller.querySelector<HTMLElement>(`[data-focus="${focusId}"]`);
    if (el) {
      const top =
        el.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop -
        scroller.clientHeight / 2 +
        el.getBoundingClientRect().height / 2;
      scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      setHighlight(focusId);
      if (glowTimer.current) clearTimeout(glowTimer.current);
      glowTimer.current = setTimeout(() => setHighlight(null), 2100);
    }
    const card = focusId.split(":")[0];
    const cardKey = ["client", "manager", "contact"].includes(card)
      ? card === "contact"
        ? "manager"
        : card
      : card;
    setActiveCard(cardKey);
  }, []);

  const onSelect = useCallback((focusId: string) => {
    flashFocus(focusId);
    const card = focusId.split(":")[0];
    if (card === "client" || card === "manager") {
      setActiveCard(card);
    } else {
      setActiveCard(card);
      setOpenKey(card as ProductKey);
    }
  }, [flashFocus]);

  /* ---------------- State Mutators ---------------- */
  const setClient = (field: keyof ClientInfo, val: string) => {
    setData((d) => ({ ...d, client: { ...d.client, [field]: val } }));
  };

  const setManager = (field: keyof AccountManager, val: string) => {
    setData((d) => ({ ...d, manager: { ...d.manager, [field]: val } }));
  };

  const toggleProduct = (key: ProductKey) => {
    setData((d) => ({
      ...d,
      products: d.products.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)),
    }));
  };

  const toggleOpen = (key: ProductKey) => {
    setOpenKey((prev) => (prev === key ? null : key));
    setActiveCard(key);
  };

  const setProduct = (key: ProductKey, field: keyof Product, val: any) => {
    setData((d) => ({
      ...d,
      products: d.products.map((p) => (p.key === key ? { ...p, [field]: val } : p)),
    }));
  };

  const setTable = (
    key: ProductKey,
    index: number,
    field: "slabValue" | "rateValue",
    val: string,
  ) => {
    setData((d) => ({
      ...d,
      products: d.products.map((p) => {
        if (p.key !== key) return p;
        const newTables = [...p.tables];
        if (newTables[index]) {
          newTables[index] = { ...newTables[index], [field]: val };
        }
        return { ...p, tables: newTables };
      }),
    }));
  };

  const setPricing = (key: ProductKey, field: "setup" | "monthly", val: string) => {
    setData((d) => ({
      ...d,
      products: d.products.map((p) => {
        if (p.key !== key) return p;
        return { ...p, pricing: { ...p.pricing, [field]: val } };
      }),
    }));
  };

  const setBullets = (key: ProductKey, val: string) => {
    const list = val.split("\n");
    setData((d) => ({
      ...d,
      products: d.products.map((p) => (p.key === key ? { ...p, bullets: list } : p)),
    }));
  };

  const resetDefaults = () => {
    const fresh = defaultQuotation();
    setData(fresh);
    setOpenKey(null);
    setActiveCard(null);
    scrollToPage("cover");
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="app-shell fixed inset-0 w-full h-full bg-[#eef1f6] flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* ===================================================================== */}
      {/*                              TOP BAR                                  */}
      {/* ===================================================================== */}
      <header className="topbar no-print sticky top-0 shrink-0 bg-[#1e1b4b] text-white flex items-center justify-between px-3 sm:px-6 py-2.5 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="/nexora-logo.png"
            alt="Nexora Enterprise"
            className="h-9 w-auto object-contain drop-shadow shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/nexora-logo.png";
            }}
          />
          <span className="text-lg font-bold tracking-tight text-white hidden lg:inline">
            Nexora <span className="gradient-text font-black">Enterprise</span>
          </span>
        </div>

        {/* 2-PRODUCT NAVIGATION SWITCHER */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10 shadow-inner">
          <button
            type="button"
            id="nav-quotation-builder-btn"
            onClick={() => handleProductSwitch("quotation")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeProduct === "quotation"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quotation Builder</span>
          </button>
          <button
            type="button"
            id="nav-sms-error-hub-btn"
            onClick={() => handleProductSwitch("errorHub")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeProduct === "errorHub"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>SMS Error Hub</span>
            <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded-full font-mono font-bold">1212</span>
          </button>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        {activeProduct === "quotation" ? (
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="text-xs font-semibold text-slate-300 hidden xl:inline" id="headerStats">
              {enabledCount} products · {pageCount} pages
            </span>

            <button
              type="button"
              onClick={resetDefaults}
              title="Reset to default Nexora proposal"
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={exportPDF}
              className="flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-800 text-xs font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-700" />
              <span>Export PDF</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-lg hidden sm:inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              1,212 SMS &amp; DLT Codes
            </span>
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/*                            MAIN CONTENT                               */}
      {/* ===================================================================== */}
      <div className={`main-row flex-1 flex min-h-0 overflow-hidden ${activeProduct === "quotation" ? "" : "hidden"}`}>
        {/* =================================================================== */}
        {/*                           LEFT PANEL                                */}
        {/* =================================================================== */}
        <div
          className={`left-panel no-print ${mobileTab === "preview" ? "hidden md:block" : ""}`}
          id="leftPanel"
        >
          {/* CARD 1: Client Information */}
          <div
            className={`panel-card ${activeCard === "client" ? "active" : ""}`}
            id="card-client"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Client Information</h3>
                <p className="text-[11px] text-slate-500 m-0 mt-0.5">Appears on the proposal cover page</p>
              </div>
              <button
                type="button"
                className="eye-btn"
                title="Preview cover page"
                onClick={() => scrollToPage("cover")}
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="field-label">Client Name</span>
                <input
                  id="field-client-name"
                  className="field-input"
                  value={data.client.clientName}
                  placeholder="Enter client name"
                  onChange={(e) => setClient("clientName", e.target.value)}
                  onFocus={() => flashFocus("client:name")}
                />
              </label>
              <label className="block">
                <span className="field-label">Company Name</span>
                <input
                  id="field-company-name"
                  className="field-input"
                  value={data.client.companyName}
                  placeholder="Enter company name"
                  onChange={(e) => setClient("companyName", e.target.value)}
                  onFocus={() => flashFocus("client:company")}
                />
              </label>
              <label className="block">
                <div className="flex items-center justify-between mb-1">
                  <span className="field-label m-0">Proposal Number</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newNo = generateProposalNumber();
                      setClient("proposalNumber", newNo);
                      flashFocus("client:proposal");
                    }}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
                    title="Auto generate proposal number"
                  >
                    <Sparkles className="w-2.5 h-2.5" /> Auto
                  </button>
                </div>
                <input
                  id="field-proposal-number"
                  className="field-input"
                  value={data.client.proposalNumber}
                  placeholder="NEX/2026/001"
                  onChange={(e) => setClient("proposalNumber", e.target.value)}
                  onFocus={() => flashFocus("client:proposal")}
                />
              </label>
              <label className="block">
                <div className="flex items-center justify-between mb-1">
                  <span className="field-label m-0">Date</span>
                  <button
                    type="button"
                    onClick={() => {
                      const today = getTodayDateString();
                      setClient("date", today);
                      flashFocus("client:date");
                    }}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
                    title="Set today's date"
                  >
                    <Calendar className="w-2.5 h-2.5" /> Today
                  </button>
                </div>
                <input
                  id="field-proposal-date"
                  className="field-input"
                  value={data.client.date}
                  placeholder="DD/MM/YYYY"
                  onChange={(e) => setClient("date", e.target.value)}
                  onFocus={() => flashFocus("client:date")}
                />
              </label>
            </div>
          </div>

          {/* CARD 2: Product Pages */}
          <div className="panel-card">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-900 m-0">Product Pages</h3>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">Only enabled products are included in the PDF</p>
            </div>
            {data.products.map((p) => {
              const isOpen = openKey === p.key;
              return (
                <div
                  key={p.key}
                  className={`prod-row ${p.enabled ? "enabled" : ""} ${isOpen ? "open" : ""} ${
                    activeCard === p.key ? "active" : ""
                  }`}
                  id={`card-${p.key}`}
                >
                  <div className="prod-head">
                    <button
                      type="button"
                      className={`toggle ${p.enabled ? "on" : ""}`}
                      role="switch"
                      aria-checked={p.enabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProduct(p.key);
                      }}
                    >
                      <span className="knob"></span>
                    </button>
                    <div className="flex-1 min-w-0" onClick={() => toggleOpen(p.key)}>
                      <span className="block truncate text-[13px] font-bold text-slate-900">
                        {PRODUCT_NAMES[p.key] || p.title}
                      </span>
                      <span
                        className={`block text-[11px] ${
                          p.enabled ? "text-purple-700 font-semibold" : "text-slate-400"
                        }`}
                      >
                        {p.enabled ? "Included in PDF" : "Excluded from PDF"}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="eye-btn"
                      title={
                        p.enabled
                          ? `Preview ${PRODUCT_NAMES[p.key] || p.title}`
                          : `Enable & preview ${PRODUCT_NAMES[p.key] || p.title}`
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!p.enabled) {
                          toggleProduct(p.key);
                        }
                        setTimeout(() => {
                          scrollToPage(p.key);
                        }, 50);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500 hover:text-purple-600 transition" />
                    </button>
                    <span className="chev" onClick={() => toggleOpen(p.key)}>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </div>

                  {isOpen && (
                    <div className="prod-body" style={{ display: "block" }}>
                      <div className="space-y-3">
                        <label className="block">
                          <span className="field-label">Page Title</span>
                          <input
                            className="field-input"
                            value={p.title}
                            placeholder="Enter service title"
                            onChange={(e) => setProduct(p.key, "title", e.target.value)}
                            onFocus={() => flashFocus(`${p.key}:title`)}
                          />
                        </label>
                        <label className="block">
                          <span className="field-label">Section Heading</span>
                          <input
                            className="field-input"
                            value={p.subTitle}
                            placeholder="e.g., Promotional SMS"
                            onChange={(e) => setProduct(p.key, "subTitle", e.target.value)}
                            onFocus={() => flashFocus(`${p.key}:sub`)}
                          />
                        </label>

                        {p.tables.map((t, idx) => (
                          <div className="grid grid-cols-2 gap-3" key={idx}>
                            <label className="block">
                              <span className="field-label">{t.slabLabel} · Slab</span>
                              <input
                                className="field-input"
                                value={t.slabValue}
                                placeholder="e.g., Per SMS"
                                onChange={(e) =>
                                  setTable(p.key, idx, "slabValue", e.target.value)
                                }
                                onFocus={() => flashFocus(`${p.key}:pricing`)}
                              />
                            </label>
                            <label className="block">
                              <span className="field-label">{t.rateLabel}</span>
                              <input
                                className="field-input"
                                value={t.rateValue}
                                placeholder="e.g., 0.50 Paise"
                                onChange={(e) =>
                                  setTable(p.key, idx, "rateValue", e.target.value)
                                }
                                onFocus={() => flashFocus(`${p.key}:pricing`)}
                              />
                            </label>
                          </div>
                        ))}

                        <div className="pricing-box">
                          <p className="field-label" style={{ marginBottom: "10px" }}>
                            Pricing (Optional)
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                              <span className="field-label">Setup Charges (₹)</span>
                              <input
                                className="field-input"
                                value={p.pricing.setup}
                                placeholder="0"
                                onChange={(e) => setPricing(p.key, "setup", e.target.value)}
                                onFocus={() => flashFocus(`${p.key}:pricing`)}
                              />
                            </label>
                            <label className="block">
                              <span className="field-label">Monthly Charges (₹)</span>
                              <input
                                className="field-input"
                                value={p.pricing.monthly}
                                placeholder="0"
                                onChange={(e) => setPricing(p.key, "monthly", e.target.value)}
                                onFocus={() => flashFocus(`${p.key}:pricing`)}
                              />
                            </label>
                          </div>
                        </div>

                        <label className="block">
                          <span className="field-label">Bullet Points (one per line)</span>
                          <textarea
                            className="field-input"
                            rows={6}
                            placeholder="Enter each feature on a new line..."
                            value={p.bullets.join("\n")}
                            onChange={(e) => setBullets(p.key, e.target.value)}
                            onFocus={() => flashFocus(`${p.key}:bullets`)}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CARD 3: Account Manager */}
          <div
            className={`panel-card ${activeCard === "manager" ? "active" : ""}`}
            id="card-manager"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Account Manager</h3>
                <p className="text-[11px] text-slate-500 m-0 mt-0.5">Shown on the final Contact Us page</p>
              </div>
              <button
                type="button"
                className="eye-btn"
                title="Preview contact page"
                onClick={() => scrollToPage("contact")}
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="field-label">Name</span>
                <input
                  className="field-input"
                  value={data.manager.name}
                  placeholder="Enter manager name"
                  onChange={(e) => setManager("name", e.target.value)}
                  onFocus={() => flashFocus("manager:card")}
                />
              </label>
              <label className="block">
                <span className="field-label">Designation</span>
                <input
                  className="field-input"
                  value={data.manager.designation}
                  placeholder="e.g., Enterprise Relationship Manager"
                  onChange={(e) => setManager("designation", e.target.value)}
                  onFocus={() => flashFocus("manager:card")}
                />
              </label>
              <label className="block">
                <span className="field-label">Mobile Number</span>
                <input
                  className="field-input"
                  value={data.manager.mobile}
                  placeholder="+91 81759 50586"
                  onChange={(e) => setManager("mobile", e.target.value)}
                  onFocus={() => flashFocus("manager:card")}
                />
              </label>
              <label className="block">
                <span className="field-label">Email Address</span>
                <input
                  className="field-input"
                  value={data.manager.email}
                  placeholder="support@nexoracpaas.in"
                  onChange={(e) => setManager("email", e.target.value)}
                  onFocus={() => flashFocus("manager:card")}
                />
              </label>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/*                          RIGHT PANEL                                */}
        {/* =================================================================== */}
        <div className={`right-panel ${mobileTab === "edit" ? "hidden md:flex" : "flex"}`}>
          {/* ZOOM BAR */}
          <div className="zoom-bar no-print" id="zoomBtns">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                type="button"
                className={`zoom-btn ${zoom === "fit-width" ? "active" : ""}`}
                onClick={() => setZoom("fit-width")}
              >
                Fit Width
              </button>
              <button
                type="button"
                className={`zoom-btn ${zoom === "fit-page" ? "active" : ""}`}
                onClick={() => setZoom("fit-page")}
              >
                Fit Page
              </button>
              <button
                type="button"
                className={`zoom-btn ${zoom === 0.5 ? "active" : ""}`}
                onClick={() => setZoom(0.5)}
              >
                50%
              </button>
              <button
                type="button"
                className={`zoom-btn ${zoom === 0.75 ? "active" : ""}`}
                onClick={() => setZoom(0.75)}
              >
                75%
              </button>
              <button
                type="button"
                className={`zoom-btn ${zoom === 1 ? "active" : ""}`}
                onClick={() => setZoom(1)}
              >
                100%
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block"></div>

              {/* JUMP TO PAGE DROPDOWN */}
              <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-lg px-2.5 py-1 transition">
                <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide hidden sm:inline">
                  Page:
                </span>
                <select
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer pr-1"
                  value={selectedPage}
                  onChange={(e) => scrollToPage(e.target.value)}
                  title="Jump directly to page"
                >
                  <option value="cover">1. Cover</option>
                  {data.products
                    .filter((p) => p.enabled)
                    .map((p, idx) => (
                      <option key={p.key} value={p.key}>
                        {idx + 2}. {PRODUCT_NAMES[p.key] || p.title}
                      </option>
                    ))}
                  <option value="contact">
                    {data.products.filter((p) => p.enabled).length + 2}. Terms &amp; Contact
                  </option>
                </select>
              </div>
            </div>

            <span className="text-[10px] sm:text-xs font-semibold text-slate-600 shrink-0">
              Grand Total: <span className="font-bold text-slate-800" id="grandTotalDisplay">₹ {grandTotalDisplay}</span>
            </span>
          </div>

          {/* PREVIEW SCROLLER */}
          <div className="preview-scroll" id="previewScroller" ref={scrollerRef}>
            <div
              id="pageStack"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                marginBottom: `${(scale - 1) * PAGE_H * pageCount}px`,
              }}
            >
              <PreviewFocusContext.Provider value={{ highlight, onSelect }}>
                <QuotationDocument data={data} />
              </PreviewFocusContext.Provider>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE TAB BAR */}
      <div className={`m-tabbar md:hidden no-print ${activeProduct === "quotation" ? "" : "hidden"}`}>
        <button
          type="button"
          className={mobileTab === "edit" ? "active" : ""}
          onClick={() => setMobileTab("edit")}
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          className={mobileTab === "preview" ? "active" : ""}
          onClick={() => setMobileTab("preview")}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* SMS ERROR HUB PRODUCT */}
      <div className={`flex-1 min-h-0 overflow-y-auto ${activeProduct === "errorHub" ? "" : "hidden"}`}>
        <SmsErrorHub />
      </div>
    </div>
  );
}
