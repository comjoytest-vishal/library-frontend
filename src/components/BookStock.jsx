import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

/* ------------------------------ Demo data ------------------------------ */
// qty: 0 means "Out of Stock"

const STOCK_DATA = [
  {
    classLevel: 1,
    items: [
      { name: "English Reader", qty: 45 },
      { name: "Hindi / Bhasha", qty: 26 },
      { name: "Mathematics", qty: 0 },
      { name: "Islamic Studies", qty: 50 },
      { name: "Arabic Primer", qty: 38 },
      { name: "Environmental Studies", qty: 12 },
    ],
  },
  {
    classLevel: 2,
    items: [
      { name: "English Reader", qty: 52 },
      { name: "Hindi / Bhasha", qty: 30 },
      { name: "Mathematics", qty: 41 },
      { name: "Islamic Studies", qty: 48 },
      { name: "Arabic", qty: 15 },
      { name: "Art & Craft", qty: 12 },
    ],
  },
  {
    classLevel: 3,
    items: [
      { name: "English Reader", qty: 38 },
      { name: "Hindi / Bhasha", qty: 24 },
      { name: "Mathematics", qty: 32 },
      { name: "Islamic Studies", qty: 45 },
      { name: "Arabic Grammar", qty: 0 },
      { name: "General Science", qty: 26 },
    ],
  },
  {
    classLevel: 4,
    items: [
      { name: "English Literature", qty: 48 },
      { name: "Hindi Reader", qty: 35 },
      { name: "Mathematics", qty: 42 },
      { name: "Islamic Studies", qty: 50 },
      { name: "Arabic Language", qty: 22 },
      { name: "General Science", qty: 18 },
    ],
  },
  {
    classLevel: 5,
    items: [
      { name: "English Text", qty: 42 },
      { name: "Hindi / Bhasha", qty: 28 },
      { name: "Mathematics", qty: 36 },
      { name: "Stories of Prophets", qty: 45 },
      { name: "Arabic", qty: 20 },
      { name: "Social Studies", qty: 13 },
    ],
  },
  {
    classLevel: 6,
    items: [
      { name: "English", qty: 32 },
      { name: "Hindi / Bengali", qty: 25 },
      { name: "Mathematics", qty: 0 },
      { name: "Quran & Tajweed", qty: 40 },
      { name: "Arabic Grammar", qty: 18 },
      { name: "Science & Technology", qty: 39 },
    ],
  },
  {
    classLevel: 7,
    items: [
      { name: "English", qty: 45 },
      { name: "Hindi / Bengali", qty: 35 },
      { name: "Mathematics", qty: 40 },
      { name: "Islamic Studies", qty: 50 },
      { name: "Arabic Grammar", qty: 28 },
      { name: "Science", qty: 32 },
    ],
  },
  {
    classLevel: 8,
    items: [
      { name: "English", qty: 42 },
      { name: "Hindi / Bengali", qty: 33 },
      { name: "Mathematics", qty: 38 },
      { name: "Islamic Studies", qty: 48 },
      { name: "Arabic", qty: 30 },
      { name: "Social Science", qty: 34 },
    ],
  },
  {
    classLevel: 9,
    items: [
      { name: "English", qty: 40 },
      { name: "Hindi / Bengali", qty: 30 },
      { name: "Mathematics", qty: 36 },
      { name: "Islamic Studies", qty: 46 },
      { name: "Physical Science", qty: 35 },
      { name: "Life Science", qty: 33 },
    ],
  },
  {
    classLevel: 10,
    items: [
      { name: "English", qty: 44 },
      { name: "Hindi / Bengali", qty: 32 },
      { name: "Mathematics", qty: 42 },
      { name: "Islamic Studies", qty: 50 },
      { name: "Physical Science", qty: 36 },
      { name: "History & Geography", qty: 31 },
    ],
  },
  {
    classLevel: 11,
    items: [
      { name: "English", qty: 41 },
      { name: "Bengali", qty: 31 },
      { name: "Mathematics", qty: 39 },
      { name: "Quran & Hadith", qty: 47 },
      { name: "Physics", qty: 34 },
      { name: "Chemistry", qty: 36 },
    ],
  },
  {
    classLevel: 12,
    items: [
      { name: "English", qty: 40 },
      { name: "Bengali", qty: 30 },
      { name: "Mathematics", qty: 38 },
      { name: "Quran & Hadith", qty: 46 },
      { name: "Physics", qty: 35 },
      { name: "Chemistry", qty: 36 },
    ],
  },
];

const PAGE_SIZE = 6;

/* ------------------------------ Helpers ------------------------------ */

const sumQty = (items) => items.reduce((t, i) => t + i.qty, 0);

const exportCsv = (classes) => {
  const rows = [["Class", "Book / Subject", "Stock", "Status"]];
  classes.forEach((c) =>
    c.items.forEach((i) =>
      rows.push([
        `Class ${c.classLevel}`,
        `"${i.name.replace(/"/g, '""')}"`,
        i.qty,
        i.qty === 0 ? "Out of Stock" : "In Stock",
      ])
    )
  );
  const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "book-stock-report.csv";
  a.click();
  URL.revokeObjectURL(url);
};

/* ------------------------------ Component ------------------------------ */

export default function BookStock() {
  const navigate = useNavigate();

  // Draft inputs vs. applied filters (Apply Filter button applies them)
  const [classInput, setClassInput] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [applied, setApplied] = useState({ cls: "all", q: "" });
  const [page, setPage] = useState(1);

  // Classes after filtering. When searching, each class only keeps matching rows.
  const filtered = useMemo(() => {
    const q = applied.q.trim().toLowerCase();
    return STOCK_DATA.filter(
      (c) => applied.cls === "all" || c.classLevel === Number(applied.cls)
    )
      .map((c) => ({
        ...c,
        items: q ? c.items.filter((i) => i.name.toLowerCase().includes(q)) : c.items,
      }))
      .filter((c) => c.items.length > 0);
  }, [applied]);

  const totalStock = filtered.reduce((t, c) => t + sumQty(c.items), 0);
  const outOfStock = filtered.reduce(
    (t, c) => t + c.items.filter((i) => i.qty === 0).length,
    0
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const applyFilter = () => {
    setApplied({ cls: classInput, q: searchInput });
    setPage(1);
  };

  const resetFilter = () => {
    setClassInput("all");
    setSearchInput("");
    setApplied({ cls: "all", q: "" });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">Book Stock Inventory</h1>
            <p className="text-sm text-slate-500">
              Track total available book stock across all classes and subjects
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/book-entry")}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition"
            >
              <Plus className="h-4 w-4" /> Add Stock
            </button>
            <button
              onClick={() => exportCsv(filtered)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <Download className="h-4 w-4" /> Export Stock Report (Excel/PDF)
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                Filter Stock by Class:
              </span>

              <div className="relative w-full sm:w-44">
                <select
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  aria-label="Select Class"
                  className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="all">All Classes</option>
                  {STOCK_DATA.map((c) => (
                    <option key={c.classLevel} value={c.classLevel}>
                      Class {c.classLevel}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                  placeholder="Search book or subject..."
                  className="w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-9 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={applyFilter}
                  className="rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition"
                >
                  Apply Filter
                </button>
                <button
                  onClick={resetFilter}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Summary chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium xl:ml-auto">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                Total Classes: {filtered.length}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
                Total Stock: <b>{totalStock.toLocaleString("en-IN")} Books</b>
              </span>
              <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">
                Out of Stock: {outOfStock} {outOfStock === 1 ? "Book" : "Books"}
              </span>
            </div>
          </div>
        </section>

        {/* Class cards */}
        {visible.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No stock found. Try a different class or search term.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((c) => (
              <article
                key={c.classLevel}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-200 border-t-4 border-t-emerald-800 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between border-b-2 border-amber-600 bg-emerald-50 px-4 py-2.5">
                  <h3 className="text-base font-semibold text-slate-900">Class {c.classLevel}</h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    Total: {sumQty(c.items)} Books
                  </span>
                </div>

                <ul className="flex-1 space-y-1.5 px-4 py-3">
                  {c.items.map((item) => (
                    <li key={item.name} className="flex items-center gap-2 text-sm text-slate-800">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
                      <span className="shrink-0">{item.name}</span>
                      <span className="mt-1 h-px flex-1 border-b border-dotted border-slate-300" />
                      {item.qty === 0 ? (
                        <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-medium text-white">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="shrink-0 font-bold text-slate-900">{item.qty}</span>
                      )}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => alert(`View full stock for Class ${c.classLevel}`)}
                  className="inline-flex items-center justify-center gap-1 border-t border-slate-200 py-2.5 text-sm font-medium text-emerald-900 hover:bg-emerald-50 transition"
                >
                  View Full Class {c.classLevel} Stock <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-slate-600 sm:flex-row sm:gap-4">
            <span>
              Showing Class {visible[0].classLevel} to Class {visible[visible.length - 1].classLevel} of{" "}
              {filtered.length} Classes
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 w-8 rounded text-sm font-medium transition ${
                    n === currentPage
                      ? "bg-emerald-900 text-white"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-600">
        © 2026 Muhammadiya Mission • Munshirhat, Howrah • Book Library Admin Portal
      </footer>
    </div>
  );
}