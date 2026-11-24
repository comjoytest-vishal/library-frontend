import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import BookEntry from "./components/BookEntry";
import StudentEntry from "./components/StudentEntry";
import BookRecords from "./components/BookRecords";
import BookStock from "./components/BookStock";
import StudentRecords from "./components/StudentRecords";
import BookDistribution from "./components/BookDistribution";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/book-entry" element={<BookEntry />} />
        <Route path="/student-entry" element={<StudentEntry />} />
        <Route path="/book-records" element={<BookRecords />} />
        <Route path="/book-stock" element={<BookStock />} />
        <Route path="/student-records" element={<StudentRecords />} />
        <Route path="/book-distribution" element={<BookDistribution />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;