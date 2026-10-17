import React, { useState, useMemo, useRef, useEffect, useTransition } from "react";
import {
  Search,
  Copy,
  Check,
  RotateCcw,
  Moon,
  Sun,
  X,
  Zap,
  ShieldCheck,
  Database,
  ArrowRight,
  Filter,
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [visibleLimit, setVisibleLimit] = useState(48);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"code" | "details" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem("nexora_errorhub_theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("nexora_errorhub_theme", next);
  };

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
      const qTokens = q.split(/\s+/).filter(Boolean);

      res = res.filter((item) => {
        const code = (item.error_code || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        const name = (item.error_name || "").toLowerCase();
        const op = (item.operator || "").toLowerCase();
        const cat = (item.category || "").toLowerCase();

        if (targetField === "code") {
          return code.includes(q) || name.includes(q);
        } else if (targetField === "desc") {
          return qTokens.every((tok) => desc.includes(tok));
        } else {
          if (code === q || code.includes(q) || name.includes(q)) return true;
          const haystack = `${code} ${name} ${desc} ${op} ${cat}`;
          return qTokens.every((tok) => haystack.includes(tok));
        }
      });

      res.sort((a, b) => {
        const aCode = (a.error_code || "").toLowerCase();
        const bCode = (b.error_code || "").toLowerCase();
        const aName = (a.error_name || "").toLowerCase();
        const bName = (b.error_name || "").toLowerCase();

        if (aCode === q && bCode !== q) return -1;
        if (bCode === q && aCode !== q) return 1;

        if (aName === q && bName !== q) return -1;
        if (bName === q && aName !== q) return 1;

        const aStarts = aCode.startsWith(q);
        const bStarts = bCode.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        const aHas = aCode.includes(q);
        const bHas = bCode.includes(q);
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;

        return aCode.localeCompare(bCode);
      });
    }

    const t1 = performance.now();
    return {
      filtered: res,
      durationMs: Math.max(0.1, t1 - t0).toFixed(1),
    };
  }, [query, activeCategory, targetField]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleLimit(48);
  }, [query, activeCategory, targetField]);

  const displayedItems = useMemo(() => {
    return filtered.slice(0, visibleLimit);
  }, [filtered, visibleLimit]);

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? "bg-[#070B14] text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900/95 text-white border border-cyan-500/40 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold animate-fade-in">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Header / Hero Bar */}
      <div
        className={`border-b transition-colors ${
          isDark
            ? "border-slate-800/80 bg-slate-950/40"
            : "border-slate-200 bg-white/70"
        } backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Nexora Enterprise Bulk SMS &amp; DLT Intelligence Database
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Find the Error.{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Fix it Faster.
                </span>
              </h1>
              <p
                className={`mt-1.5 text-xs sm:text-sm max-w-2xl ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Instant technical troubleshooting engine for Indian telecom DLT scrubbing, operator response codes (Jio, Vi, Airtel, SmartPing), and SMPP delivery receipts.
              </p>
            </div>

            {/* Theme & Meta Quick Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/40"
                    : "bg-white border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm"
                }`}
                title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                isDark
                  ? "bg-slate-900/60 border-slate-800/80 shadow-lg shadow-black/20"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                {ALL_ERRORS.length}
              </div>
              <div
                className={`text-[11px] font-semibold uppercase tracking-wider mt-0.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                SMS Error Codes
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border transition-all ${
                isDark
                  ? "bg-slate-900/60 border-slate-800/80 shadow-lg shadow-black/20"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">
                {OPERATORS.length - 1}
              </div>
              <div
                className={`text-[11px] font-semibold uppercase tracking-wider mt-0.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Operators &amp; Protocols
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border transition-all ${
                isDark
                  ? "bg-slate-900/60 border-slate-800/80 shadow-lg shadow-black/20"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                &lt;1ms
              </div>
              <div
                className={`text-[11px] font-semibold uppercase tracking-wider mt-0.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Instant Search
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border transition-all ${
                isDark
                  ? "bg-slate-900/60 border-slate-800/80 shadow-lg shadow-black/20"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                100%
              </div>
              <div
                className={`text-[11px] font-semibold uppercase tracking-wider mt-0.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Local Offline Database
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Search Bar Wrapper */}
        <div className="relative mb-4">
          <div
            className={`relative rounded-2xl border transition-all flex items-center shadow-lg ${
              isDark
                ? "bg-slate-900/90 border-slate-700/80 focus-within:border-cyan-400/80 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-cyan-950/10"
                : "bg-white border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
            }`}
          >
            <div className="pl-4 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search SMS error code, DLT status, or description... (e.g. 600, 20A, SMPP, throttled, timeout, DND)"
              className="w-full py-3.5 pr-24 bg-transparent outline-none text-sm sm:text-base font-medium placeholder:text-slate-400"
              spellCheck={false}
              autoComplete="off"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                  title="Clear search (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span
                className={`hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                  isDark
                    ? "bg-slate-800/90 border-slate-700 text-slate-400"
                    : "bg-slate-100 border-slate-200 text-slate-500"
                }`}
                title="Press '/' to focus search"
              >
                /
              </span>
            </div>
          </div>

          {/* Quick Search Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span
              className={`font-semibold ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Popular:
            </span>
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer border ${
                  query === item
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20"
                    : isDark
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 shadow-xs"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Toolbar (Tabs & Target) */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3 border-y mb-6 ${
            isDark ? "border-slate-800/80" : "border-slate-200"
          }`}
        >
          {/* Operator Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {OPERATORS.map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setActiveCategory(op)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                  activeCategory === op
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-sm shadow-cyan-500/30"
                    : isDark
                    ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs"
                }`}
              >
                {op === "All" ? "All Operators" : op}
              </button>
            ))}
          </div>

          {/* Search In Target Filter */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto text-xs">
            <span
              className={`font-semibold ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Search In:
            </span>
            <select
              value={targetField}
              onChange={(e) => setTargetField(e.target.value as any)}
              className={`px-2.5 py-1.5 rounded-lg border font-semibold text-xs outline-none cursor-pointer ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-200"
                  : "bg-white border-slate-300 text-slate-800 shadow-2xs"
              }`}
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
            <span className="font-bold text-sm">
              Showing{" "}
              <span className="text-cyan-400 font-mono font-black">
                {filtered.length}
              </span>{" "}
              error codes
            </span>
            <span
              className={`text-[11px] font-mono ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              ({durationMs}ms)
            </span>
          </div>
          <span
            className={`hidden sm:inline font-medium text-[11px] ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Click cards to copy code or troubleshooting details
          </span>
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border ${
              isDark
                ? "bg-slate-900/40 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold mb-1">No matching error codes found</h3>
            <p
              className={`text-xs max-w-md mx-auto mb-4 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              No error record matched "{query}" under the selected operator filter. Try clearing your search query or selecting "All Operators".
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer shadow-md shadow-cyan-600/20"
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

              // Logo or badge
              let opBadge = null;
              if (item.operator === "Jio") {
                opBadge = (
                  <img
                    src="/assets/jio-logo.png"
                    alt="Jio"
                    className="h-5 w-auto object-contain rounded"
                  />
                );
              } else if (item.operator === "Vi") {
                opBadge = (
                  <img
                    src="/assets/vi-logo.jpg"
                    alt="Vi"
                    className="h-5 w-auto object-contain rounded"
                  />
                );
              } else if (item.operator === "Airtel") {
                opBadge = (
                  <img
                    src="/assets/airtel-logo.png"
                    alt="Airtel"
                    className="h-5 w-auto object-contain rounded"
                  />
                );
              } else if (item.operator === "SmartPing") {
                opBadge = (
                  <img
                    src="/assets/smartping-logo.png"
                    alt="SmartPing"
                    className="h-5 w-auto object-contain rounded"
                  />
                );
              } else if (item.operator === "SMPP") {
                opBadge = (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    ⚡ SMPP
                  </span>
                );
              } else {
                opBadge = (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {item.operator}
                  </span>
                );
              }

              return (
                <div
                  key={uniqueKey}
                  className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 ${
                    isDark
                      ? "bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/20"
                      : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md"
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {opBadge}
                        <span className="font-mono text-base font-extrabold tracking-tight text-cyan-400">
                          {item.error_code}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isDark
                            ? "bg-slate-800/80 border-slate-700/80 text-slate-400"
                            : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        {item.category || "General"}
                      </span>
                    </div>

                    {/* Error Name */}
                    {item.error_name && (
                      <h4 className="text-sm font-bold tracking-tight mb-2 leading-snug line-clamp-1">
                        {item.error_name}
                      </h4>
                    )}

                    {/* Description */}
                    <p
                      className={`text-xs leading-relaxed mb-3 line-clamp-3 ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {item.description}
                    </p>

                    {/* Metadata Items */}
                    <div
                      className={`p-2.5 rounded-xl border text-[11px] space-y-1 mb-4 ${
                        isDark
                          ? "bg-slate-950/60 border-slate-800/60 text-slate-400"
                          : "bg-slate-50 border-slate-100 text-slate-500"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-500">Action:</span>
                        <span
                          className={`font-medium text-right line-clamp-1 ${
                            isDark ? "text-slate-200" : "text-slate-700"
                          }`}
                        >
                          {item.portal_action || "Review logs & settings"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-500">Retry:</span>
                        <span
                          className={`font-mono font-bold text-[10px] px-1.5 py-0.2 rounded ${
                            item.retry === "YES"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : item.retry === "NO"
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {item.retry || "NO"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/40">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          item.error_code,
                          uniqueKey,
                          "code",
                          `Error code copied: ${item.error_code}`
                        )
                      }
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                        isCopiedCode
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : isDark
                          ? "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200"
                          : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      {isCopiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          `Code: ${item.error_code}\nName: ${item.error_name || "N/A"}\nOperator: ${item.operator}\nDescription: ${item.description}\nAction: ${item.portal_action || "N/A"}`,
                          uniqueKey,
                          "details",
                          `Copied details for ${item.error_code}`
                        )
                      }
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                        isCopiedDetails
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                          : isDark
                          ? "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200"
                          : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      {isCopiedDetails ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Copied ✓</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-3 h-3 text-slate-400" />
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer shadow-md ${
                isDark
                  ? "bg-slate-900 border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-white"
                  : "bg-white border-slate-300 hover:border-blue-400 text-slate-800 shadow-sm"
              }`}
            >
              <span>Load More ({filtered.length - visibleLimit} remaining)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`py-6 border-t text-center text-xs transition-colors ${
          isDark
            ? "border-slate-800/80 bg-slate-950/60 text-slate-500"
            : "border-slate-200 bg-white text-slate-400"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="m-0">
            © 2026 Nexora Enterprise Support ·{" "}
            <a
              href="mailto:support@nexoracpaas.in"
              className="text-cyan-400 hover:underline"
            >
              support@nexoracpaas.in
            </a>{" "}
            · +91 81759 50586
          </p>
          <p className="m-0 text-[11px]">
            TRAI DLT Scrubbing Compliance &amp; Bulk SMS Telephony Standards
          </p>
        </div>
      </footer>
    </div>
  );
}
