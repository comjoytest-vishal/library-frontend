import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";

/* ------------------------------ Demo data ------------------------------ */

const SUBJECTS = {
  1: ["English", "Hindi", "Mathematics", "Islamic Studies", "Arabic", "EVS"],
  2: ["English", "Hindi", "Mathematics", "Islamic Studies", "Arabic", "EVS"],
  3: ["English", "Hindi", "Mathematics", "Islamic Studies", "Arabic", "General Science"],
  4: ["English", "Hindi", "Mathematics", "Islamic Studies", "Arabic", "General Science"],
  5: ["English", "Hindi", "Mathematics", "Islamic Studies", "Arabic", "EVS / Science"],
  6: ["English", "Bengali", "Mathematics", "Islamic Studies", "Arabic", "Science"],
  7: ["English", "Bengali", "Mathematics", "Islamic Studies", "Arabic", "Social Science"],
  8: ["English", "Bengali", "Mathematics", "Islamic Studies", "Arabic", "Social Science"],
  9: ["English", "Bengali", "Mathematics", "Islamic Studies", "Physical Science", "Life Science"],
  10: ["English", "Bengali", "Mathematics", "Islamic Studies", "Physical Science", "Life Science"],
  11: ["English", "Bengali", "Mathematics", "Quran & Hadith", "Physics", "Chemistry"],
  12: ["English", "Bengali", "Mathematics", "Quran & Hadith", "Physics", "Chemistry"],
};

const FIRST_NAMES = [
  "Neha", "Rehan", "Ayesha", "Imran", "Fatima", "Sayeed", "Zainab", "Arif",
  "Sabina", "Faruk", "Nilufar", "Rafiq", "Taslima", "Javed", "Mumtaz", "Kabir",
  "Rizwana", "Habib", "Salma", "Imtiaz", "Parveen", "Sohel", "Afsana", "Nadim",
  "Rehana", "Akbar", "Shahina", "Mustafa", "Husna", "Jahangir", "Farhana", "Yasin",
  "Mahfuza", "Anwar", "Sufia", "Saiful", "Laila", "Tariq", "Gulshan", "Irfan",
];
const LAST_NAMES = [
  "Khatun", "Alam", "Parveen", "Ali", "Begum", "Ahmed",
  "Hossain", "Sheikh", "Mondal", "Molla", "Biswas", "Gazi",
];
const LAST_UPDATED = ["Today", "Yesterday", "1 day ago", "3 days ago", "1 week ago", "Today"];

const hash = (n) => Math.imul(n + 1, 2654435761) >>> 0;

// Deterministic shuffle so the demo data is the same on every render
const seededShuffle = (arr, seed) => {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeMarks = (category, seed, n) => {
  if (category === "full") return Array(n).fill(true);
  if (category === "not") return Array(n).fill(false);
  const marks = Array.from({ length: n }, (_, j) => hash(seed * 31 + j) % 100 < 60);
  if (marks.every(Boolean)) marks[hash(seed) % n] = false;
  if (!marks.some(Boolean)) marks[hash(seed) % n] = true;
  return marks;
};

// The six Class 5 students shown in the design
const FEATURED = [
  { name: "Neha Khatun", roll: 3, marks: [true, false, true, true, true, true], lastUpdated: "1 day ago" },
  { name: "Md. Rehan Alam", roll: 1, marks: [true, true, true, true, true, true], lastUpdated: "Today" },
  { name: "Ayesha Parveen", roll: 7, marks: [true, true, false, true, true, false], lastUpdated: "Yesterday" },
  { name: "Sk. Imran Ali", roll: 12, marks: [true, false, true, true, true, true], lastUpdated: "Today" },
  { name: "Fatima Begum", roll: 18, marks: [false, false, false, false, false, false], lastUpdated: "3 days ago" },
  { name: "Sayeed Ahmed", roll: 22, marks: [true, true, true, true, true, true], lastUpdated: "Today" },
];

const buildClass = (cls) => {
  const subjectCount = SUBJECTS[cls].length;
  const isFive = cls === 5;
  const featured = isFive ? FEATURED : [];
  const total = isFive ? 38 : 30;
  const generatedCount = total - featured.length;

  // Class 5 totals: 14 fully, 21 partially, 3 not received (featured included)
  const cats = isFive
    ? [...Array(12).fill("full"), ...Array(18).fill("partial"), ...Array(2).fill("not")]
    : [...Array(10).fill("full"), ...Array(18).fill("partial"), ...Array(2).fill("not")];
  const shuffled = seededShuffle(cats, cls * 97);

  const usedRolls = new Set(featured.map((f) => f.roll));
  const freeRolls = Array.from({ length: total }, (_, i) => i + 1).filter((r) => !usedRolls.has(r));

  const generated = Array.from({ length: generatedCount }, (_, i) => ({
    name: `${FIRST_NAMES[(i * 7 + cls * 3) % FIRST_NAMES.length]} ${LAST_NAMES[(i * 5 + cls) % LAST_NAMES.length]}`,
    roll: freeRolls[i],
    marks: makeMarks(shuffled[i], cls * 100 + i, subjectCount),
    lastUpdated: LAST_UPDATED[(i + cls) % LAST_UPDATED.length],
  }));

  return [...featured, ...generated].map((s, i) => ({
    ...s,
    id: `${cls}-${i}`,
    classLevel: cls,
    dirty: false,
  }));
};

const INITIAL_STUDENTS = Object.keys(SUBJECTS).flatMap((c) => buildClass(Number(c)));

const CLASSES = Object.keys(SUBJECTS).map(Number);
const PAGE_SIZE = 6;
const DEFAULT_CLASS = "5";

/* ------------------------------ Helpers ------------------------------ */

const pad = (n) => String(n).padStart(2, "0");

const getStatus = (marks) => {
  if (marks.every(Boolean)) return { key: "full", label: "Fully Received", cls: "bg-emerald-100 text-emerald-800" };
  if (!marks.some(Boolean)) return { key: "none", label: "Not Received", cls: "bg-red-100 text-red-700" };
  return { key: "partial", label: "Partially Received", cls: "bg-amber-100 text-amber-800" };
};

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
  const header = ["Class", "Roll", "Name", "Status", "Received", "Not Received"];
  const lines = rows.map((s) => {
    const subs = SUBJECTS[s.classLevel];
    const got = subs.filter((_, i) => s.marks[i]).join("; ");
    const missing = subs.filter((_, i) => !s.marks[i]).join("; ");
    return [s.classLevel, s.roll, `"${s.name}"`, getStatus(s.marks).label, `"${got}"`, `"${missing}"`].join(",");
  });
  const blob = new Blob([[header.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "book-distribution-report.csv";
  a.click();
  URL.revokeObjectURL(url);
};

/* ------------------------------ Component ------------------------------ */

export default function BookDistribution() {
  const navigate = useNavigate();

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [classInput, setClassInput] = useState(DEFAULT_CLASS);
  const [searchInput, setSearchInput] = useState("");
  const [applied, setApplied] = useState({ cls: DEFAULT_CLASS, q: "" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = applied.q.trim().toLowerCase();
    return students.filter(
      (s) =>
        s.classLevel === Number(applied.cls) &&
        (q === "" || s.name.toLowerCase().includes(q))
    );
  }, [students, applied]);

  const counts = useMemo(() => {
    const c = { full: 0, partial: 0, none: 0 };
    filtered.forEach((s) => (c[getStatus(s.marks).key] += 1));
    return c;
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const applyFilter = () => {
    setApplied({ cls: classInput, q: searchInput });
    setPage(1);
  };

  const resetFilter = () => {
    setClassInput(DEFAULT_CLASS);
    setSearchInput("");
    setApplied({ cls: DEFAULT_CLASS, q: "" });
    setPage(1);
  };

  const toggleSubject = (id, index) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, marks: s.marks.map((m, i) => (i === index ? !m : m)), dirty: true }
          : s
      )
    );
  };

  const updateStatus = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, dirty: false, lastUpdated: "Today" } : s))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">Student Book Distribution</h1>
            <p className="text-sm text-slate-500">
              Mark and track received textbooks per student by class
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/book-entry")}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition"
            >
              <Plus className="h-4 w-4" /> Issue New Book
            </button>
            <button
              onClick={() => exportCsv(filtered)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <Download className="h-4 w-4" /> Export Distribution Report (PDF/Excel)
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                Filter Records:
              </span>

              <div className="relative w-full sm:w-40">
                <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-slate-500">
                  Select Class
                </span>
                <select
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
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
                  placeholder="Search Student Name..."
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

            {/* Summary */}
            <p className="text-sm text-slate-700 xl:ml-auto">
              Total Students: <b className="text-emerald-800">{filtered.length}</b>
              <span className="mx-1.5">•</span>
              Fully Received: <b className="text-emerald-800">{counts.full}</b>
              <span className="mx-1.5">•</span>
              Partially Received: <b className="text-red-700">{counts.partial}</b>
              <span className="mx-1.5">•</span>
              Not Received: <b className="text-red-700">{counts.none}</b>
            </p>
          </div>
        </section>

        {/* Student cards */}
        {visible.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No students found. Try a different class or name.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((s) => {
              const status = getStatus(s.marks);
              const subjects = SUBJECTS[s.classLevel];
              return (
                <article
                  key={s.id}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-slate-900">{s.name}</h3>
                      <p className="text-sm text-slate-500">
                        Class {s.classLevel} • Roll: {pad(s.roll)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <ul className="mt-2 space-y-1.5">
                    {subjects.map((subject, i) => {
                      const received = s.marks[i];
                      const inputId = `${s.id}-${i}`;
                      return (
                        <li key={subject}>
                          <label
                            htmlFor={inputId}
                            className="flex cursor-pointer items-center gap-2 text-sm text-slate-800"
                          >
                            <input
                              id={inputId}
                              type="checkbox"
                              checked={received}
                              onChange={() => toggleSubject(s.id, i)}
                              className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-emerald-800"
                            />
                            <span>{subject}</span>
                            <span className="text-slate-400">—</span>
                            {received ? (
                              <span className="inline-flex items-center gap-1 text-green-700">
                                <Check className="h-4 w-4" />
                                <span className="text-slate-800">(Received)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                <X className="h-4 w-4" />
                                <span className="text-slate-800">(Not Received)</span>
                              </span>
                            )}
                          </label>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <button
                      onClick={() => updateStatus(s.id)}
                      className="rounded-md bg-emerald-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 transition"
                    >
                      Update Status
                    </button>
                    {s.dirty ? (
                      <span className="text-xs font-medium text-amber-700">Unsaved changes</span>
                    ) : (
                      <span className="text-xs text-slate-500">Last updated: {s.lastUpdated}</span>
                    )}
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
              Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} Students in Class {applied.cls}
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
        © 2026 Muhammadiya Mission • Munshirhat, Howrah • Book Library Admin Portal
      </footer>
    </div>
  );
}