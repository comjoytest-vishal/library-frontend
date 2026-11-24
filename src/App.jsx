import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import BookEntry from "./components/BookEntry";
import StudentEntry from "./components/StudentEntry";
import BookRecords from "./components/BookRecords";
import BookStock from "./components/BookStock";
import StudentRecords from "./components/StudentRecords";
import BookDistribution from "./components/BookDistribution";

// Simple placeholder for pages that are not built yet
function ComingSoon({ title }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">This page is coming soon.</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-block rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/digital-library" element={<ComingSoon title="Digital Book Library" />} />
        <Route path="/book-entry" element={<BookEntry />} />
        <Route path="/student-entry" element={<StudentEntry />} />
        <Route path="/student-records" element={<StudentRecords />} />
        <Route path="/book-records" element={<BookRecords />} />
        <Route path="/book-stock" element={<BookStock />} />
        <Route path="/book-distribution" element={<BookDistribution />} />
        <Route path="/change-password" element={<ComingSoon title="Change Password" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;