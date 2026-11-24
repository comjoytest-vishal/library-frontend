import { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  SquarePen,
  Users,
  FileText,
  Book,
  Package,
  CircleCheck,
  KeyRound,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TriangleAlert,
  UserPlus,
  Printer,
  ArrowRight,
} from "lucide-react";

/* ------------------------------ Demo data ------------------------------ */

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Digital Book Library", to: "/digital-library", icon: BookOpen },
  { label: "Book Entry (Add Book)", to: "/book-entry", icon: SquarePen },
  { label: "Student Entry (Add Student)", to: "/student-entry", icon: Users },
  { label: "View Student Records", to: "/student-records", icon: FileText },
  { label: "View Book Records", to: "/book-records", icon: Book },
  { label: "Book Stock Inventory", to: "/book-stock", icon: Package },
  { label: "Mark Student Book Records", to: "/book-distribution", icon: CircleCheck },
];

const DISTRIBUTED = 1842;
const TOTAL_STOCK = 2450;
const distributedPercent = ((DISTRIBUTED / TOTAL_STOCK) * 100).toFixed(1);

const STATS = [
  {
    label: "Total Students",
    value: "1,240",
    unit: "",
    chip: "Active Enrolled",
    chipCls: "bg-emerald-100 text-emerald-800",
    icon: Users,
    iconCls: "bg-emerald-100 text-emerald-800",
    trend: "up",
    to: "/student-records",
  },
  {
    label: "Total Books Catalog",
    value: "5,420",
    unit: "",
    chip: "54 Titles",
    chipCls: "bg-sky-100 text-sky-800",
    icon: BookOpen,
    iconCls: "bg-sky-100 text-sky-800",
    trend: "down",
    to: "/book-records",
  },
  {
    label: "Total Book Stock",
    value: "2,450",
    unit: "Books",
    chip: "In Library Stock",
    chipCls: "bg-amber-100 text-amber-800",
    icon: Package,
    iconCls: "bg-amber-100 text-amber-800",
    trend: "up",
    to: "/book-stock",
  },
  {
    label: "Books Distributed",
    value: DISTRIBUTED.toLocaleString("en-IN"),
    unit: "Issued",
    chip: `${distributedPercent}% Distributed`,
    chipCls: "bg-sky-100 text-sky-800",
    icon: CircleCheck,
    iconCls: "bg-emerald-100 text-emerald-800",
    trend: null,
    to: "/book-distribution",
  },
];

const DISTRIBUTION = [
  { cls: 1, percent: 85, status: "Completed" },
  { cls: 2, percent: 92, status: "Completed" },
  { cls: 3, percent: 78, status: "Completed" },
  { cls: 4, percent: 88, status: "Completed" },
  { cls: 5, percent: 74, status: "Completed" },
  { cls: 6, percent: 82, status: "Pending" },
];

const ACTIVITY = [
  {
    icon: BookOpen,
    iconCls: "text-emerald-700",
    title: "Book Added:",
    text: "Stories of the Prophets (Class 5) — 45 Copies",
    time: "20 mins ago",
    to: "/book-records",
  },
  {
    icon: TriangleAlert,
    iconCls: "text-red-600",
    title: "Out of Stock Warning:",
    text: "Mathematics (Class 1) — 0 Available",
    time: "1 hr ago",
    to: "/book-stock",
  },
  {
    icon: Users,
    iconCls: "text-emerald-700",
    title: "Student Enrolled:",
    text: "Neha Khatun (Class 5, Roll 03)",
    time: "2 hrs ago",
    to: "/student-records",
  },
  {
    icon: CircleCheck,
    iconCls: "text-emerald-700",
    title: "Book Issued:",
    text: "Md. Rehan Alam (Class 5) — 4 Books",
    time: "3 hrs ago",
    to: "/book-distribution",
  },
];

const LOW_STOCK = [
  { subject: "Mathematics", cls: 1 },
  { subject: "Arabic Grammar", cls: 3 },
  { subject: "Mathematics", cls: 6 },
];

/* ------------------------------ Helpers ------------------------------ */

function Ring({ percent }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 40 40" className="h-11 w-11 shrink-0 -rotate-90">
      <circle cx="20" cy="20" r={r} fill="none" strokeWidth="5" className="stroke-emerald-100" />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * percent) / 100}
        className="stroke-emerald-600"
      />
    </svg>
  );
}

const formatNow = () => {
  const t = new Date()
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .toUpperCase();
  return `Today, ${t}`;
};

/* ------------------------------ Component ------------------------------ */

export default function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // TODO: clear your real auth data here (token / session) before redirecting
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md border-l-4 px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "border-amber-400 bg-emerald-800/70 text-amber-300"
        : "border-transparent text-emerald-50/90 hover:bg-emerald-800/50 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-emerald-900 px-4 py-3 text-white lg:hidden">
        <span className="text-sm font-semibold">Muhammadiya Mission</span>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="rounded p-1 hover:bg-emerald-800"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto bg-emerald-900 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 lg:hidden">
          <span className="text-sm font-semibold">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="rounded p-1 hover:bg-emerald-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
            Main Navigation
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass} onClick={() => setMenuOpen(false)}>
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-emerald-700/60 px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
            Account &amp; System
          </p>
          <div className="space-y-2">
            <Link
              to="/change-password"
              className="flex items-center gap-3 rounded-md border border-emerald-600/70 bg-emerald-800/50 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              <KeyRound className="h-5 w-5 shrink-0 text-amber-300" />
              Change Password
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md border border-red-400/60 bg-red-900/20 px-3 py-2.5 text-sm font-medium text-red-100 transition hover:bg-red-900/40"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h1>
              <p className="text-sm text-slate-500">
                Overview of school library, student records, and book inventory
              </p>
            </div>
            <p className="text-sm text-slate-600">Last updated: {formatNow()}</p>
          </div>

          {/* Stat cards */}
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  to={s.to}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${s.iconCls}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{s.label}</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {s.value}
                        {s.unit && <span className="ml-1.5 text-base font-semibold">{s.unit}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.chipCls}`}>
                      {s.chip}
                    </span>
                    {s.trend && (
                      <TrendingUp
                        className={`h-5 w-5 ${
                          s.trend === "up" ? "text-emerald-600" : "-scale-y-100 text-red-600"
                        }`}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </section>

          {/* Distribution + Activity */}
          <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Quick Distribution Status</h2>
                <Link
                  to="/book-distribution"
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 hover:underline"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                {DISTRIBUTION.map((d) => (
                  <div key={d.cls} className="flex items-center gap-3">
                    <Ring percent={d.percent} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm leading-tight text-slate-700">
                          <p>Class {d.cls}</p>
                          <p className="font-semibold text-slate-900">{d.percent}% Received</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            d.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {d.status}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200">
                        <div
                          className="h-1.5 rounded-full bg-emerald-600"
                          style={{ width: `${d.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity &amp; Alerts</h2>
              <ul className="mt-3 divide-y divide-slate-200">
                {ACTIVITY.map((a) => {
                  const Icon = a.icon;
                  return (
                    <li key={a.title}>
                      <Link
                        to={a.to}
                        className="flex items-center gap-3 py-3 text-sm text-slate-800 hover:bg-slate-50"
                      >
                        <Icon className={`h-5 w-5 shrink-0 ${a.iconCls}`} />
                        <span className="min-w-0 flex-1">
                          <b className="font-semibold">{a.title}</b> {a.text}
                        </span>
                        <span className="shrink-0 text-xs text-slate-500">{a.time}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Low stock + Quick actions */}
          <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Low Stock Alerts</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {LOW_STOCK.map((l) => (
                  <Link
                    key={`${l.subject}-${l.cls}`}
                    to="/book-stock"
                    className="rounded-md border border-slate-300 bg-slate-50 px-3 py-2 transition hover:border-red-300 hover:bg-red-50"
                  >
                    <p className="text-sm font-medium text-slate-900">{l.subject}</p>
                    <p className="text-xs text-slate-500">Class {l.cls}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Quick Add Student", icon: UserPlus, action: () => navigate("/student-entry") },
                  { label: "Quick Add Book", icon: Book, action: () => navigate("/book-entry") },
                  { label: "Print Stock Report", icon: Printer, action: () => window.print() },
                ].map(({ label, icon: Icon, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-4 text-sm font-medium text-slate-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <Icon className="h-7 w-7" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-600">
          © 2026 Muhammadiya Mission • Munshirhat, Howrah • Admin Portal • System Version 2.1.4
        </footer>
      </div>
    </div>
  );
}