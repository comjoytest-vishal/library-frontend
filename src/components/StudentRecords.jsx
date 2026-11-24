import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Filter,
  Users,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  CircleUser,
  SquarePen,
} from "lucide-react";

/* ------------------------------ Demo data ------------------------------ */

const FEATURED = [
  { name: "Md. Rehan Alam", roll: 4, classLevel: 8, phone: "+91 98765 43210", address: "Munshirhat, Howrah, WB - 711410" },
  { name: "Ayesha Khatun", roll: 12, classLevel: 8, phone: "+91 87654 32109", address: "Bargachia, Howrah, WB - 711404" },
  { name: "Sayeed Ahmed", roll: 11, classLevel: 8, phone: "+91 91234 56789", address: "Amta Road, Munshirhat, Howrah, WB" },
  { name: "Fatima Begum", roll: 15, classLevel: 8, phone: "+91 70012 34567", address: "Jagatballavpur, Howrah, WB - 711408" },
  { name: "Sk. Imran Ali", roll: 19, classLevel: 8, phone: "+91 94321 09876", address: "Munshirhat Bazar, Howrah, WB - 711410" },
  { name: "Zainab Parveen", roll: 23, classLevel: 8, phone: "+91 81001 23456", address: "Domjur, Howrah, WB - 711411" },
];

const FIRST_NAMES = [
  "Abdul", "Nasreen", "Mehboob", "Rukhsar", "Tanvir", "Shabnam", "Arif", "Sabina",
  "Faruk", "Nilufar", "Rafiq", "Taslima", "Javed", "Mumtaz", "Kabir", "Rizwana",
  "Habib", "Salma", "Imtiaz", "Parveen", "Sohel", "Afsana", "Nadim", "Rehana",
  "Akbar", "Shahina", "Mustafa", "Husna", "Jahangir", "Farhana", "Yasin", "Mahfuza",
  "Anwar", "Sufia", "Saiful", "Laila", "Tariq", "Gulshan", "Irfan", "Roshni",
  "Wasim", "Bushra",
];
const LAST_NAMES = [
  "Hossain", "Khan", "Sheikh", "Mondal", "Molla", "Mallick", "Biswas", "Gazi",
  "Laskar", "Sarkar", "Haque", "Rahman", "Islam", "Mirza",
];
const PLACES = [
  "Munshirhat, Howrah, WB - 711410",
  "Bargachia, Howrah, WB - 711404",
  "Amta Road, Howrah, WB - 711401",
  "Jagatballavpur, Howrah, WB - 711408",
  "Domjur, Howrah, WB - 711405",
  "Uluberia, Howrah, WB - 711316",
  "Bagnan, Howrah, WB - 711303",
  "Sankrail, Howrah, WB - 711302",
];
const OTHER_CLASSES = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];
const AVATAR_TONES = [
  "bg-emerald-600", "bg-teal-600", "bg-sky-600", "bg-indigo-600",
  "bg-purple-600", "bg-rose-500", "bg-amber-600", "bg-cyan-700",
];

const GENERATED = Array.from({ length: 42 }, (_, i) => {
  const n = String(9000000000 + ((i + 1) * 7919341) % 999999999);
  return {
    name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 3) % LAST_NAMES.length]}`,
    roll: ((i * 5) % 40) + 1,
    classLevel: OTHER_CLASSES[i % OTHER_CLASSES.length],
    phone: `+91 ${n.slice(0, 5)} ${n.slice(5)}`,
    address: PLACES[i % PLACES.length],
  };
});

const STUDENTS = [...FEATURED, ...GENERATED].map((s, i) => ({
  ...s,
  id: i + 1,
  status: i >= 6 && i % 9 === 0 ? "Inactive" : "Active",
  tone: AVATAR_TONES[i % AVATAR_TONES.length],
}));

const CLASSES = Array.from({ length: 12 }, (_, i) => i + 1);
const PAGE_SIZE = 6;

/* ------------------------------ Helpers ------------------------------ */

const initials = (name) =>
  name
    .replace(/\./g, "")
    .split(" ")
    .filter((w) => w.toLowerCase() !== "md" && w.toLowerCase() !== "sk")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const pad = (n) => String(n).padStart(2, "0");

// 1 ... 4 5 6 ... 8 style page list
const pageList = (current, total) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…" + p);
    out.push(p);
  });
  return out;
};

const exportCsv = (rows) => {
  const header = ["Name", "Class", "Roll", "Phone", "Address", "Status"];
  const lines = rows.map((s) =>
    [`"${s.name}"`, s.classLevel, s.roll, `"${s.phone}"`, `"${s.address}"`, s.status].join(",")
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "student-records.csv";
  a.click();
  URL.revokeObjectURL(url);
};

/* ------------------------------ Component ------------------------------ */

export default function StudentRecords() {
  const navigate = useNavigate();

  const [classInput, setClassInput] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [applied, setApplied] = useState({ cls: "all", q: "" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = applied.q.trim().toLowerCase();
    return STUDENTS.filter(
      (s) =>
        (applied.cls === "all" || s.classLevel === Number(applied.cls)) &&
        (q === "" || s.name.toLowerCase().includes(q))
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
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">View Student Records</h1>
            <p className="text-sm text-slate-500">
              Manage, filter, and view student profiles and contact information
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/student-entry")}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition"
            >
              <Plus className="h-4 w-4" /> Add New Student
            </button>
            <button
              onClick={() => exportCsv(filtered)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <FileText className="h-4 w-4" /> Export PDF/Excel
            </button>
          </div>
        </div>

        {/* Filter card */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Filter className="h-4 w-4" /> Filter Records
          </h2>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="w-full lg:w-72">
              <label className="mb-1 block text-sm font-medium text-slate-700">Select Class</label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="all">All Classes</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="w-full lg:w-80">
              <label className="mb-1 block text-sm font-medium text-slate-700">Search by Name</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                  placeholder="Search student name..."
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
              <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                {badgeText}
              </span>
            </div>
          </div>
        </section>

        {/* Student cards */}
        {visible.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No students found. Try a different class or name.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((s) => (
              <article
                key={s.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-base font-semibold text-white ${s.tone}`}
                  >
                    {initials(s.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-base font-bold uppercase text-slate-900">
                        {s.name}
                      </h3>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        Roll: {pad(s.roll)}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-600">
                      <Briefcase className="h-3.5 w-3.5 text-slate-500" /> Class {s.classLevel}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-slate-600" /> {s.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-600" />
                    <span className="min-w-0">{s.address}</span>
                  </p>
                  <p
                    className={`flex items-center gap-2 ${
                      s.status === "Active" ? "text-green-700" : "text-slate-500"
                    }`}
                  >
                    {s.status === "Active" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0" />
                    )}
                    {s.status}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => alert(`View profile: ${s.name}`)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100 transition"
                  >
                    <CircleUser className="h-3.5 w-3.5" /> View Profile
                  </button>
                  <button
                    onClick={() => alert(`Edit record: ${s.name}`)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100 transition"
                  >
                    <SquarePen className="h-3.5 w-3.5" /> Edit Record
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-slate-600 sm:flex-row sm:gap-4">
            <span>
              Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} Students
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              {pageList(currentPage, totalPages).map((n) =>
                typeof n === "string" ? (
                  <span key={n} className="px-1 text-slate-400">
                    …
                  </span>
                ) : (
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
                )
              )}
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
        © 2026 Muhammadiya Mission • Munshirhat, Howrah • Student Admin Portal
      </footer>
    </div>
  );
}