import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Copy,
  Check,
  RotateCcw,
  X,
  Zap,
  ShieldCheck,
  Database,
  ArrowRight,
} from "lucide-react";
import rawErrorsData from "@/data/errors.json";

interface ErrorRecord {
  operator: string;
  error_code: string;
  error_name?: string;
  description: string;
  category?: string;
  stage?: string;
  retry?: string;
  portal_action?: string;
  source?: string;
  verification?: string;
}

const ALL_ERRORS: ErrorRecord[] = rawErrorsData as ErrorRecord[];

const OPERATORS = [
  "All",
  "Jio",
  "Vi",
  "Airtel",
  "SmartPing",
  "Telspil",
  "Provider",
  "SMPP",
  "General",
];

const POPULAR_SEARCHES = [
  "600",
  "20A",
  "DLT",
  "SMPP",
  "0x00000058",
  "408",
  "5110",
  "timeout",
  "DND",
];

export function SmsErrorHub() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [targetField, setTargetField] = useState<"all" | "code" | "desc">("all");
  const [visibleLimit, setVisibleLimit] = useState(48);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"code" | "details" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' or 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" && document.activeElement !== searchInputRef.current) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === "Escape") {
        if (query) {
          setQuery("");
        } else {
          searchInputRef.current?.blur();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2400);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const copyText = async (text: string, id: string, type: "code" | "details", msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setCopiedType(type);
      showToast(msg);
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 1800);
    } catch {
      showToast("Copied: " + text);
    }
  };

  // Search execution & benchmark
  const { filtered, durationMs } = useMemo(() => {
    const t0 = performance.now();
    let res = ALL_ERRORS;

    if (activeCategory !== "All") {
      res = res.filter((item) => item.operator === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      if (targetField === "code") {
        res = res.filter((item) => item.error_code.toLowerCase().includes(q));
      } else if (targetField === "desc") {
        res = res.filter((item) => item.description.toLowerCase().includes(q));
      } else {
        res = res.filter((item) => {
          return (
            item.error_code.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            (item.error_name && item.error_name.toLowerCase().includes(q)) ||
            (item.category && item.category.toLowerCase().includes(q)) ||
            (item.operator && item.operator.toLowerCase().includes(q)) ||
            (item.portal_action && item.portal_action.toLowerCase().includes(q))
          );
        });
      }
    }

    const duration = Math.max(0, Math.round(performance.now() - t0));
    return { filtered: res, durationMs: duration };
  }, [query, activeCategory, targetField]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleLimit(48);
  }, [query, activeCategory, targetField]);

  const displayedItems = useMemo(() => {
    return filtered.slice(0, visibleLimit);
  }, [filtered, visibleLimit]);

  return (
    <div className="min-h-full flex-1 flex flex-col font-sans bg-[#f8fafc] text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white border border-indigo-400/40 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Header / Hero Bar */}
      <div className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                Nexora Enterprise Bulk SMS &amp; DLT Intelligence Database
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Find the Error.{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Fix it Faster.
                </span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm max-w-2xl text-slate-600 leading-relaxed">
                Instant technical troubleshooting engine for Indian telecom DLT scrubbing, operator response codes (Jio, Vi, Airtel, SmartPing), and SMPP delivery receipts.
              </p>
            </div>

            {/* Quick Live Status Pill */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Offline &amp; Instant</span>
              </div>
            </div>
          </div>

          {/* Stats Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition">
              <div className="text-2xl font-black text-indigo-700 font-mono">
                {ALL_ERRORS.length}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                SMS Error Codes
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition">
              <div className="text-2xl font-black text-purple-700 font-mono">
                {OPERATORS.length - 1}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Operators &amp; Protocols
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition">
              <div className="text-2xl font-black text-emerald-700 font-mono">
                &lt;1ms
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Instant Search
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition">
              <div className="text-2xl font-black text-blue-700 font-mono">
                100%
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Local Database
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Search Bar Wrapper */}
        <div className="relative mb-5">
          <div className="relative rounded-2xl border-2 border-slate-200 bg-white focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 flex items-center shadow-xs transition-all">
            <div className="pl-4 pr-2 text-indigo-600">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search SMS error code, DLT status, or description... (e.g. 600, 20A, SMPP, throttled, timeout, DND)"
              className="w-full py-3.5 pr-24 bg-transparent outline-none text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400"
              spellCheck={false}
              autoComplete="off"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Clear search (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span
                className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 border border-slate-200 text-slate-500"
                title="Press '/' to focus search"
              >
                /
              </span>
            </div>
          </div>

          {/* Quick Search Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="font-bold text-slate-500">Popular:</span>
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer border ${
                  query === item
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-xs"
                    : "bg-white border-slate-200/90 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40 shadow-2xs"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Toolbar (Tabs & Target) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3.5 border-y border-slate-200/90 mb-6 bg-white/50 px-3 rounded-xl">
          {/* Operator Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {OPERATORS.map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setActiveCategory(op)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                  activeCategory === op
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-xs"
                    : "bg-white border-slate-200/90 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/50 hover:border-indigo-200 shadow-2xs"
                }`}
              >
                {op === "All" ? "All Operators" : op}
              </button>
            ))}
          </div>

          {/* Search In Target Filter */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto text-xs">
            <span className="font-bold text-slate-500">Search In:</span>
            <select
              value={targetField}
              onChange={(e) => setTargetField(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-xs text-slate-800 outline-none cursor-pointer shadow-2xs focus:border-indigo-500"
            >
              <option value="all">All Fields</option>
              <option value="code">Error Code Only</option>
              <option value="desc">Description Only</option>
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">
              Showing{" "}
              <span className="text-indigo-600 font-mono font-black">
                {filtered.length}
              </span>{" "}
              error codes
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              ({durationMs}ms)
            </span>
          </div>
          <span className="hidden sm:inline font-medium text-[11px] text-slate-500">
            Click cards to copy code or technical diagnostic details
          </span>
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No matching error codes found</h3>
            <p className="text-xs max-w-md mx-auto mb-4 text-slate-500">
              No error record matched "{query}" under the selected operator filter. Try clearing your search query or selecting "All Operators".
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer shadow-sm shadow-indigo-600/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Search &amp; Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedItems.map((item, idx) => {
              const uniqueKey = `${item.operator}-${item.error_code}-${idx}`;
              const isCopiedCode = copiedId === uniqueKey && copiedType === "code";
              const isCopiedDetails = copiedId === uniqueKey && copiedType === "details";

              // Professional Badge Styling
              let opBadge = null;
              if (item.operator === "Jio") {
                opBadge = (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    Jio
                  </span>
                );
              } else if (item.operator === "Vi") {
                opBadge = (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    Vi
                  </span>
                );
              } else if (item.operator === "Airtel") {
                opBadge = (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    Airtel
                  </span>
                );
              } else if (item.operator === "SmartPing") {
                opBadge = (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    SmartPing
                  </span>
                );
              } else if (item.operator === "SMPP") {
                opBadge = (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    SMPP
                  </span>
                );
              } else {
                opBadge = (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    {item.operator}
                  </span>
                );
              }

              return (
                <div
                  key={uniqueKey}
                  className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {opBadge}
                        <span className="font-mono text-base font-extrabold tracking-tight text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
                          {item.error_code}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                        {item.category || "General"}
                      </span>
                    </div>

                    {/* Error Name */}
                    {item.error_name && (
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-1.5 leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {item.error_name}
                      </h4>
                    )}

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-slate-600 mb-3.5 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Metadata & Troubleshooting Action Box */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[11px] space-y-2 mb-4">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-indigo-950 shrink-0 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500 shrink-0" /> Action:
                        </span>
                        <span className="font-semibold text-right text-indigo-900 line-clamp-2">
                          {item.portal_action || "Verify DLT template & message headers"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-indigo-100/60">
                        <span className="font-semibold text-slate-500">Retry Allowed:</span>
                        <span
                          className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-full border ${
                            item.retry === "YES"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.retry === "NO"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {item.retry === "YES" ? "✓ Yes" : item.retry === "NO" ? "✕ No" : "Conditional"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          item.error_code,
                          uniqueKey,
                          "code",
                          `Copied code: ${item.error_code}`
                        )
                      }
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                        isCopiedCode
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                          : "bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700"
                      }`}
                    >
                      {isCopiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          `Error Code: ${item.error_code}\nName: ${item.error_name || "N/A"}\nOperator: ${item.operator}\nCategory: ${item.category || "General"}\nDescription: ${item.description}\nRecommended Action: ${item.portal_action || "N/A"}\nRetry: ${item.retry || "N/A"}`,
                          uniqueKey,
                          "details",
                          `Copied diagnostic report for ${item.error_code}`
                        )
                      }
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                        isCopiedDetails
                          ? "bg-emerald-600 text-white border-transparent"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-xs shadow-indigo-600/20"
                      }`}
                    >
                      {isCopiedDetails ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-3 h-3 text-indigo-100" />
                          <span>Copy Details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Pagination */}
        {visibleLimit < filtered.length && (
          <div className="flex justify-center mt-8 mb-6">
            <button
              type="button"
              onClick={() => setVisibleLimit((prev) => prev + 48)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold border-2 border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 text-indigo-700 transition cursor-pointer shadow-xs"
            >
              <span>Load More ({filtered.length - visibleLimit} remaining)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="m-0">
            © 2026 Nexora Enterprise Support ·{" "}
            <a
              href="mailto:support@nexoracpaas.in"
              className="text-indigo-600 hover:underline font-semibold"
            >
              support@nexoracpaas.in
            </a>{" "}
            · +91 81759 50586
          </p>
          <p className="m-0 text-[11px] text-slate-400">
            TRAI DLT Scrubbing Compliance &amp; Bulk SMS Telephony Standards
          </p>
        </div>
      </footer>
    </div>
  );
}
