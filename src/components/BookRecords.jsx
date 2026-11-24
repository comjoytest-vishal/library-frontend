import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
  Search,
  Pencil,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ------------------------------ Demo data ------------------------------ */

const TITLE_POOL = [
  { title: "Stories of the Prophets", price: 220, tone: "from-amber-400 to-orange-500" },
  { title: "Islamic Studies (Textbook)", price: 180, tone: "from-emerald-600 to-green-800" },
  { title: "Arabic Grammar - Level 1", price: 250, tone: "from-sky-600 to-teal-700" },
  { title: "Adab & Akhlaq (Character)", price: 150, tone: "from-purple-600 to-fuchsia-800" },
  { title: "Seerah & Islamic History", price: 200, tone: "from-cyan-600 to-blue-800" },
  { title: "Basic Tajweed & Quranic Reading", price: 120, tone: "from-yellow-500 to-amber-700" },
  { title: "Mathematics Workbook", price: 140, tone: "from-rose-500 to-red-700" },
  { title: "English Reader", price: 130, tone: "from-indigo-500 to-blue-700" },
  { title: "Bengali Literature", price: 160, tone: "from-lime-600 to-emerald-700" },
];

// Deterministic demo stock values so the UI is stable between renders
const STOCK_POOL = [45, 60, 32, 55, 40, 18, 24, 12, 75, 8, 66, 28];

const BOOKS = Array.from({ length: 54 }, (_, i) => {
  const base = TITLE_POOL[i % TITLE_POOL.length];
  const cls = Math.floor(i / 9) + 1; // 9 books per class, classes 1-6
  const quantity = STOCK_POOL[i % STOCK_POOL.length];
  return {
    id: i + 1,
    title: base.title,
    price: base.price,
    tone: base.tone,
    classLevel: cls,
    quantity,
  };
});

// Make Class 5 match the screenshot: 6 records
BOOKS.forEach((b) => {
  if (b.classLevel === 5) b.classLevel = 5;
});

const CLASSES = [1, 2, 3, 4, 5, 6];
const PAGE_SIZE = 6;

/* ------------------------------ Helpers ------------------------------ */

const getStatus = (qty) => {
  if (qty <= 0) return { label: "Out of Stock", cls: "text-red-600" };
  if (qty <= 20) return { label: "Low Stock", cls: "text-orange-600" };
  return { label: "Available", cls: "text-green-700" };
};

const exportCsv = (rows) => {
  const header = ["ID", "Title", "Class", "Price", "Quantity", "Status"];
  const lines = rows.map((b) =>
    [b.id, `"${b.title.replace(/"/g, '""')}"`, b.classLevel, b.price, b.quantity, getStatus(b.quantity).label].join(",")
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "book-catalog.csv";
  a.click();
  URL.revokeObjectURL(url);
};

/* ------------------------------ Component ------------------------------ */

export default function BookRecords() {
  const navigate = useNavigate();

  // Draft inputs vs. applied filters (Apply Filter button applies them)
  const [classInput, setClassInput] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [applied, setApplied] = useState({ cls: "all", q: "" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = applied.q.trim().toLowerCase();
    return BOOKS.filter(
      (b) =>
        (applied.cls === "all" || b.classLevel === Number(applied.cls)) &&
        (q === "" || b.title.toLowerCase().includes(q))
    );
  }, [applied]);

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

  const badgeText =
    applied.cls === "all"
      ? `Showing ${filtered.length} records`
      : `Showing ${filtered.length} records for Class ${applied.cls}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">View Book Records</h1>
            <p className="text-sm text-slate-500">
              Browse, search, and manage books in the digital library catalog
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/book-entry")}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition"
            >
              <Plus className="h-4 w-4" /> Add New Book
            </button>
            <button
              onClick={() => exportCsv(filtered)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <Download className="h-4 w-4" /> Export Catalog (PDF/CSV)
            </button>
          </div>
        </div>

        {/* Filter card */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Filter Catalog</h2>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="w-full lg:w-64">
              <label className="mb-1 block text-sm text-slate-700">Select Class</label>
              <div className="relative">
                <select
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="all">All Classes</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="w-full lg:flex-1">
              <label className="mb-1 block text-sm text-slate-700">Search by Book Name</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                  placeholder="Search book title..."
                  className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
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

            <div className="lg:ml-auto">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                {badgeText}
              </span>
            </div>
          </div>
        </section>

        {/* Book cards */}
        {visible.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No books found. Try a different class or search term.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((book) => {
              const status = getStatus(book.quantity);
              return (
                <article
                  key={book.id}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Demo cover */}
                  <div
                    className={`flex h-36 w-24 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${book.tone} p-2 text-center text-xs font-bold leading-tight text-white shadow-inner sm:h-40 sm:w-28`}
                  >
                    {book.title}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">
                        {book.title}
                      </h3>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                        Class {book.classLevel}
                      </span>
                    </div>

                    <div className="mt-1 space-y-0.5 text-sm text-slate-600">
                      <p>Price: ₹{book.price}</p>
                      <p>Quantity: {book.quantity} in stock</p>
                      <p>
                        Status: <span className={status.cls}>{status.label}</span>
                      </p>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                      <button
                        onClick={() => alert(`Edit: ${book.title}`)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => alert(`Details: ${book.title}`)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Eye className="h-4 w-4" /> View Details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-slate-600 sm:flex-row sm:gap-4">
            <span>
              Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} Books
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

     
    </div>
  );
}