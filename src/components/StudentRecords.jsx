
import { useEffect, useState } from "react";
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

import { getStudents } from "../api/studentApi";

/* ------------------------------ Constants ------------------------------ */

const CLASSES = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
    { id: 9, name: "NUR" },
    { id: 10, name: "LKG" },
    { id: 11, name: "UKG" },
];
const PAGE_SIZE = 9;

const AVATAR_TONES = [
  "bg-emerald-600",
  "bg-teal-600",
  "bg-sky-600",
  "bg-indigo-600",
  "bg-purple-600",
  "bg-rose-500",
  "bg-amber-600",
  "bg-cyan-700",
];

/* ------------------------------ Helpers ------------------------------ */

const initials = (name = "") =>
  name
    .replace(/\./g, "")
    .split(" ")
    .filter((w) => w.toLowerCase() !== "md" && w.toLowerCase() !== "sk")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const pad = (n) => String(n ?? "").padStart(2, "0");

// 1 ... 4 5 6 ... 8 style page list
const pageList = (current, total) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];

  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) {
      out.push("…" + p);
    }
    out.push(p);
  });

  return out;
};

// Convert database student fields into the format used by the UI
const formatStudent = (student, index) => ({
  id: student.id,
  name: student.name || "",
  roll: student.roll ?? "",
    classLevel: CLASSES.find(
        (cls) => cls.id === Number(student.class_id)
    )?.name ?? "N/A",
  phone: student.phone || "Not provided",
  address: student.address || "Not provided",
  tone: AVATAR_TONES[(Number(student.id) || index) % AVATAR_TONES.length],
});

// CSV export helper
const exportCsv = (rows) => {
  const header = ["Name", "Class", "Roll", "Phone", "Address"];

  const escapeCsv = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const lines = rows.map((s) =>
    [
      escapeCsv(s.name),
      escapeCsv(`Class ${s.class_id}`),
      escapeCsv(s.roll),
      escapeCsv(s.phone),
      escapeCsv(s.address),
    ].join(",")
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

  const [applied, setApplied] = useState({
    cls: "all",
    q: "",
  });

  const [page, setPage] = useState(1);

  // API data
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // API states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  /* ------------------------------ Fetch Students ------------------------------ */

  useEffect(() => {
    let isMounted = true;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: PAGE_SIZE,
          search: applied.q.trim(),
        };

        if (applied.cls !== "all") {
          params.class_id = Number(applied.cls);
        }

        const response = await getStudents(params);

        if (!isMounted) return;

        const result = response.data;

        // Student records returned by the backend
        const studentRows = Array.isArray(result.data)
          ? result.data
          : [];

        // Pagination information returned by the backend
        const pagination = result.pagination || {};

        const total = Number(pagination.total_students) || 0;
        const pages =
          Number(pagination.total_pages) ||
          Math.max(1, Math.ceil(total / PAGE_SIZE));

        setStudents(
          studentRows.map((student, index) =>
            formatStudent(student, index)
          )
        );

        setTotalStudents(total);
        setTotalPages(pages);
      } catch (err) {
        if (!isMounted) return;

        console.error("Students API Error:", err);

        setStudents([]);
        setTotalStudents(0);
        setTotalPages(1);

        setError(
          err.response?.data?.message ||
            "Unable to load student records. Please try again."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStudents();

    return () => {
      isMounted = false;
    };
  }, [page, applied]);

  /* ------------------------------ Filters ------------------------------ */

  const applyFilter = () => {
    setApplied({
      cls: classInput,
      q: searchInput,
    });

    setPage(1);
  };

  const resetFilter = () => {
    setClassInput("all");
    setSearchInput("");

    setApplied({
      cls: "all",
      q: "",
    });

    setPage(1);
  };

  /* ------------------------------ Export All Matching Records ------------------------------ */

  const handleExport = async () => {
    try {
      setExporting(true);

      const exportParams = {
        page: 1,
        limit: 50,
        search: applied.q.trim(),
      };

      if (applied.cls !== "all") {
        exportParams.class_id = Number(applied.cls);
      }

      const firstResponse = await getStudents(exportParams);

      const firstResult = firstResponse.data;
      const allStudents = Array.isArray(firstResult.data)
        ? [...firstResult.data]
        : [];

      const pagination = firstResult.pagination || {};

      const total = Number(pagination.total_students) || 0;
      const pages =
        Number(pagination.total_pages) ||
        Math.ceil(total / 50);

      // Fetch remaining pages when more than 50 records exist
      for (let currentPage = 2; currentPage <= pages; currentPage++) {
        const response = await getStudents({
          ...exportParams,
          page: currentPage,
        });

        const rows = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        allStudents.push(...rows);
      }

      exportCsv(allStudents);
    } catch (err) {
      console.error("Student Export Error:", err);
      alert("Unable to export student records. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  /* ------------------------------ Display Values ------------------------------ */

  const currentPage = Math.min(page, totalPages);

  const start =
    totalStudents === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;

  const badgeText =
    applied.cls === "all"
      ? `Showing ${totalStudents} records`
      : `Showing ${totalStudents} records for Class ${applied.cls}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">
              View Student Records
            </h1>

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
              onClick={handleExport}
              disabled={exporting || loading || totalStudents === 0}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              {exporting ? "Exporting..." : "Export PDF/Excel"}
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
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Select Class
              </label>

              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <select
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="all">All Classes</option>

{CLASSES.map((cls) => (
    <option key={cls.id} value={cls.id}>
        {cls.name}
    </option>
))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="w-full lg:w-80">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Search by Name or Roll Number
              </label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && applyFilter()
                  }
                  placeholder="Search student name or roll..."
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

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading student records...
          </div>
        )}

        {/* API Error */}
        {!loading && error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>

            <button
              onClick={() => setPage((p) => p)}
              className="mt-3 rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* Student cards */}
        {!loading && !error && students.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No students found. Try a different class or name.
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {students.map((s) => (
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
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                        Class {s.classLevel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-slate-600" />
                      {s.phone}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-600" />
                      <span className="min-w-0 break-words">
                        {s.address}
                      </span>
                    </p>

                    <p className="flex items-center gap-2 text-slate-500">
                      <XCircle className="h-4 w-4 shrink-0" />
                      Status not available
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => alert(`View profile: ${s.name}`)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100 transition"
                    >
                      <CircleUser className="h-3.5 w-3.5" />
                      View Profile
                    </button>

                    <button
                      onClick={() => alert(`Edit record: ${s.name}`)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100 transition"
                    >
                      <SquarePen className="h-3.5 w-3.5" />
                      Edit Record
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
        )}

        {/* Pagination */}
        {!loading && !error && totalStudents > 0 && (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-slate-600 sm:flex-row sm:gap-4">
            <span>
              Showing {start + 1}–
              {Math.min(start + students.length, totalStudents)} of{" "}
              {totalStudents} Students
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
                  <span
                    key={n}
                    className="px-1 text-slate-400"
                  >
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
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
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
